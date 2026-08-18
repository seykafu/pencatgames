import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowDown, Coffee } from 'lucide-react'
import { games, kofiUrl } from '../data/games'
import RingButton from './RingButton'

const roles = ['tales', 'worlds', 'riddles', 'battles']
const SCENE_MS = 9000
const ROLE_MS = 2000

export default function Hero({ ready }: { ready: boolean }) {
  const [active, setActive] = useState(0)
  const [roleIndex, setRoleIndex] = useState(0)
  const rootRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % games.length), SCENE_MS)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), ROLE_MS)
    return () => clearInterval(t)
  }, [])

  // Only the visible video needs to decode; keep the other paused at its poster
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === active) v.play().catch(() => {})
      else v.pause()
    })
  }, [active])

  // Entrance runs once the loading screen has cleared
  useEffect(() => {
    if (!ready || !rootRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to('.name-reveal', { opacity: 1, y: 0, duration: 1.2 }, 0.1)
      tl.to(
        '.blur-in',
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 },
        0.3,
      )
    }, rootRef)
    return () => ctx.revert()
  }, [ready])

  return (
    <section
      ref={rootRef}
      className="relative flex h-screen min-h-[640px] w-full flex-col items-center justify-center overflow-hidden bg-ink"
    >
      {/* Game footage, slow crossfade between the two worlds */}
      {games.map((g, i) => (
        <video
          key={g.id}
          ref={(el) => {
            videoRefs.current[i] = el
            if (el) {
              el.muted = true
              el.defaultMuted = true
            }
          }}
          src={g.video}
          poster={g.poster}
          autoPlay={i === 0}
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-ink/55" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-muted">
          Storytelling Games Publisher
        </p>

        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-parchment md:text-8xl lg:text-9xl">
          Pencat Games
        </h1>

        <p className="blur-in mb-4 text-base text-parchment/85 md:text-xl">
          Publishing{' '}
          <span
            key={roleIndex}
            className="role-fade-in inline-block font-display italic text-parchment"
          >
            {roles[roleIndex]}
          </span>{' '}
          worth remembering.
        </p>

        <p className="blur-in mb-12 max-w-md text-sm text-muted md:text-base">
          An independent publisher of storytelling games. AI-enabled worlds,
          human-written tales.
        </p>

        <div className="blur-in flex flex-wrap items-center justify-center gap-4">
          <RingButton href="#games">
            See the games <ArrowDown className="h-4 w-4" />
          </RingButton>
          <RingButton href={kofiUrl} external variant="outline">
            <Coffee className="h-4 w-4" /> Buy me a coffee{' '}
            <span aria-hidden="true">↗</span>
          </RingButton>
        </div>
      </div>

      {/* Now showing */}
      <div className="absolute bottom-8 left-6 z-10 hidden items-center gap-3 text-xs text-muted md:flex md:left-10">
        <span className="uppercase tracking-[0.2em]">Now showing</span>
        <span className="h-px w-6 bg-stroke" />
        <a
          href={games[active].ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-sm italic text-parchment transition-colors hover:text-gilt"
        >
          {games[active].name}
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Scroll</span>
        <div className="relative h-10 w-px overflow-hidden bg-stroke">
          <div className="scroll-down-anim absolute inset-x-0 top-0 h-1/3 bg-parchment" />
        </div>
      </div>
    </section>
  )
}
