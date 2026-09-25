import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, Coffee } from 'lucide-react'
import { games, kofiUrl, lectureZoom, ravageContinuation } from '../data/games'
import RingButton from './RingButton'

gsap.registerPlugin(ScrollTrigger)

const roles = ['tales', 'worlds', 'riddles', 'battles']
const ROLE_MS = 2000
/** Total scroll distance of the pinned stage */
const SCROLL_VH = 420

/* Timeline positions, as fractions of the stage's scroll distance */
const ZOOM_END = 0.6 // lecture push-in finishes on the laptop screen
const HANDOFF = 0.58 // real gameplay fades in over the matching last frame
const DIM_AT = 0.66 // gameplay darkens
const TITLE_AT = 0.72 // title block reveals

const ravage = games[0]

interface HeroProps {
  /** Blob URL of the preloaded zoom video; null until it's ready */
  zoomSrc: string | null
  /** False while the loading screen is still up */
  ready: boolean
}

export default function Hero({ zoomSrc, ready }: HeroProps) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const sectionRef = useRef<HTMLElement>(null)
  const zoomRef = useRef<HTMLVideoElement>(null)
  const contRef = useRef<HTMLVideoElement>(null)
  const contWrapRef = useRef<HTMLDivElement>(null)
  const dimRef = useRef<HTMLDivElement>(null)
  const startHintRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const targetTime = useRef(0)
  const pendingTime = useRef<number | null>(null)

  // Seeks are coalesced: while the decoder is busy only the latest scroll
  // position is kept, so fast scrolling never queues up stale frames
  const applySeek = useCallback(() => {
    const v = zoomRef.current
    const t = pendingTime.current
    if (!v || t === null || v.seeking || v.readyState < 1) return
    pendingTime.current = null
    if (Math.abs(v.currentTime - t) > 1 / 60) v.currentTime = t
  }, [])

  const requestSeek = useCallback(
    (t: number) => {
      targetTime.current = t
      pendingTime.current = Math.min(t, lectureZoom.duration - 0.05)
      applySeek()
    },
    [applySeek],
  )

  useEffect(() => {
    const t = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), ROLE_MS)
    return () => clearInterval(t)
  }, [])

  // Wire up the zoom video whenever its source arrives
  useEffect(() => {
    const v = zoomRef.current
    if (!v || !zoomSrc) return
    v.muted = true
    const onSeeked = () => applySeek()
    const onMeta = () => {
      // iOS won't paint seeked frames until the element has played once
      v.play()
        .then(() => v.pause())
        .catch(() => {})
        .finally(() => requestSeek(targetTime.current))
      ScrollTrigger.refresh()
    }
    v.addEventListener('seeked', onSeeked)
    v.addEventListener('loadedmetadata', onMeta)
    if (v.readyState >= 1) onMeta()
    return () => {
      v.removeEventListener('seeked', onSeeked)
      v.removeEventListener('loadedmetadata', onMeta)
    }
  }, [zoomSrc, applySeek, requestSeek])

  // Scroll timeline
  useEffect(() => {
    const section = sectionRef.current
    const cont = contRef.current
    if (!section || !cont) return
    cont.muted = true

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>('.hero-reveal')
      gsap.set(contWrapRef.current, { opacity: 0 })
      gsap.set(dimRef.current, { opacity: 0 })
      gsap.set(reveals, { opacity: 0, y: 40, filter: 'blur(10px)' })

      let contPlaying = false
      const syncContinuation = (progress: number) => {
        const on = progress >= HANDOFF
        if (on && !contPlaying) {
          contPlaying = true
          cont.currentTime = 0
          cont.play().catch(() => {})
        } else if (!on && contPlaying) {
          // Rewind so crossfading back lands on the frame the zoom ends on
          contPlaying = false
          cont.pause()
          cont.currentTime = 0
        }
      }

      const proxy = { t: 0 }
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'none' },
        onUpdate: () => syncContinuation(tl.progress()),
      })
      tl.to(startHintRef.current, { opacity: 0, duration: 0.03 }, 0.01)
      tl.to(
        proxy,
        { t: lectureZoom.duration, duration: ZOOM_END, onUpdate: () => requestSeek(proxy.t) },
        0,
      )
      tl.to(contWrapRef.current, { opacity: 1, duration: 0.04 }, HANDOFF)
      tl.to(dimRef.current, { opacity: 1, duration: 0.12, ease: 'power1.inOut' }, DIM_AT)
      tl.to(
        reveals,
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.1, stagger: 0.02, ease: 'power2.out' },
        TITLE_AT,
      )
      tl.set({}, {}, 1)

      if (reduceMotion) {
        tl.progress(1)
        return
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        animation: tl,
      })
    }, stageRef)

    return () => {
      ctx.revert()
      cont.pause()
    }
  }, [reduceMotion, requestSeek])

  // Layout can shift while the intro overlay is up; re-measure once it's gone
  useEffect(() => {
    if (ready) ScrollTrigger.refresh()
  }, [ready])

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink"
      style={{ height: reduceMotion ? '100vh' : `${SCROLL_VH}vh` }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Lecture hall push-in, scrubbed by scroll */}
        <video
          ref={zoomRef}
          src={zoomSrc ?? undefined}
          poster={lectureZoom.poster}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Real gameplay, picking up on the zoom's final frame */}
        <div ref={contWrapRef} className="absolute inset-0">
          <video
            ref={contRef}
            src={ravageContinuation}
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Darkening behind the title */}
        <div ref={dimRef} className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-ink/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(20,17,24,0.55)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
        </div>

        {/* Opening prompt */}
        <div
          ref={startHintRef}
          className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="rounded-full bg-ink/50 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-parchment/90 backdrop-blur-sm">
            Scroll to begin
          </span>
          <div className="relative h-10 w-px overflow-hidden bg-parchment/20">
            <div className="scroll-down-anim absolute inset-x-0 top-0 h-1/3 bg-parchment" />
          </div>
        </div>

        {/* Title block */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <p className="hero-reveal mb-8 text-xs uppercase tracking-[0.3em] text-parchment/70">
            Storytelling Games Publisher
          </p>
          <h1 className="hero-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-parchment md:text-8xl lg:text-9xl">
            Pencat Games
          </h1>
          <p className="hero-reveal mb-4 text-base text-parchment/90 md:text-xl">
            Publishing{' '}
            <span key={roleIndex} className="role-fade-in inline-block font-display italic text-parchment">
              {roles[roleIndex]}
            </span>{' '}
            worth remembering.
          </p>
          <p className="hero-reveal mb-12 max-w-md text-sm text-parchment/60 md:text-base">
            An independent publisher of storytelling games. AI-enabled worlds,
            human-written tales.
          </p>
          <div className="hero-reveal flex flex-wrap items-center justify-center gap-4">
            <RingButton href="#games">
              See the games <ArrowDown className="h-4 w-4" />
            </RingButton>
            <RingButton href={kofiUrl} external variant="outline">
              <Coffee className="h-4 w-4" /> Buy me a coffee <span aria-hidden="true">↗</span>
            </RingButton>
          </div>
        </div>

        {/* Now playing */}
        <div className="hero-reveal absolute bottom-8 left-6 z-10 hidden items-center gap-3 text-xs text-parchment/60 md:flex md:left-10">
          <span className="uppercase tracking-[0.2em]">Now playing</span>
          <span className="h-px w-6 bg-parchment/20" />
          <a
            href={ravage.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm italic text-parchment transition-colors hover:text-gilt"
          >
            {ravage.name}
          </a>
        </div>

        {/* Keep scrolling */}
        <div className="hero-reveal absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-parchment/60">Scroll</span>
          <div className="relative h-10 w-px overflow-hidden bg-parchment/20">
            <div className="scroll-down-anim absolute inset-x-0 top-0 h-1/3 bg-parchment" />
          </div>
        </div>
      </div>
    </section>
  )
}
