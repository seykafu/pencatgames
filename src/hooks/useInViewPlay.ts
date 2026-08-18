import { useEffect, type RefObject } from 'react'

/**
 * Plays a muted video only while it's on screen; pauses it otherwise so a
 * page with several looping videos doesn't decode them all at once.
 */
export function useInViewPlay(ref: RefObject<HTMLVideoElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Set directly: React doesn't always reflect `muted` before the
    // browser's autoplay check runs
    el.muted = true
    el.defaultMuted = true

    const tryPlay = () => {
      if (el.paused) el.play().catch(() => {})
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay()
        else el.pause()
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    el.addEventListener('canplay', tryPlay)
    window.addEventListener('pointerdown', tryPlay)
    return () => {
      io.disconnect()
      el.removeEventListener('canplay', tryPlay)
      window.removeEventListener('pointerdown', tryPlay)
    }
  }, [ref])
}
