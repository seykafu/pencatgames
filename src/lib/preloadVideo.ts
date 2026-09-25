type Listener = (progress: number) => void

interface Entry {
  promise: Promise<string>
  progress: number
  listeners: Set<Listener>
}

const cache = new Map<string, Entry>()

/**
 * Downloads a video fully into memory and resolves with a blob URL.
 * Scroll-scrubbed video needs every frame local: seeking a streamed file
 * stalls on network range requests. Shared per URL, so StrictMode's double
 * effects and remounts don't download twice.
 *
 * `sizeHint` covers servers that omit Content-Length (e.g. compressed dev
 * responses), so progress still moves instead of jumping 0 → 100.
 */
export function preloadVideo(url: string, onProgress?: Listener, sizeHint = 0) {
  let entry = cache.get(url)
  if (!entry) {
    const e: Entry = { progress: 0, listeners: new Set(), promise: Promise.resolve('') }
    const emit = (p: number) => {
      e.progress = p
      e.listeners.forEach((l) => l(p))
    }
    e.promise = (async () => {
      const res = await fetch(url)
      if (!res.ok || !res.body) throw new Error(`Failed to load ${url}`)
      const total = Number(res.headers.get('content-length')) || sizeHint
      const reader = res.body.getReader()
      const chunks: Uint8Array[] = []
      let received = 0
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        received += value.length
        if (total) emit(Math.min(0.99, received / total))
      }
      emit(1)
      return URL.createObjectURL(new Blob(chunks as BlobPart[], { type: 'video/mp4' }))
    })()
    e.promise.catch(() => cache.delete(url))
    cache.set(url, e)
    entry = e
  }

  const current = entry
  if (onProgress) {
    current.listeners.add(onProgress)
    onProgress(current.progress)
  }
  return {
    promise: current.promise,
    unsubscribe: () => {
      if (onProgress) current.listeners.delete(onProgress)
    },
  }
}
