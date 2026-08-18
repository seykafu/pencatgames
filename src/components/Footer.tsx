import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Coffee, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { games, kofiUrl, mailtoHref, youtubeUrl } from '../data/games'
import { useInViewPlay } from '../hooks/useInViewPlay'
import RingButton from './RingButton'

const MARQUEE = 'Stories worth remembering  •  More games coming soon  •  '

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  useInViewPlay(videoRef)

  useEffect(() => {
    if (!marqueeRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 40,
      ease: 'none',
      repeat: -1,
    })
    return () => {
      tween.kill()
    }
  }, [])

  const copy = MARQUEE.repeat(4)

  return (
    <footer className="relative overflow-hidden bg-ink pb-8 pt-16 md:pb-12 md:pt-20">
      {/* Khione footage, flipped, heavily dimmed */}
      <video
        ref={videoRef}
        src={games[1].video}
        poster={games[1].poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full scale-y-[-1] object-cover"
      />
      <div className="absolute inset-0 bg-ink/80" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent" />

      <div className="relative z-10">
        {/* Marquee */}
        <div className="overflow-hidden border-y border-parchment/10 py-4">
          <div ref={marqueeRef} className="flex w-max whitespace-nowrap will-change-transform">
            <span className="font-display text-2xl italic uppercase tracking-wide text-parchment/70 md:text-4xl">
              {copy}
            </span>
            <span
              className="font-display text-2xl italic uppercase tracking-wide text-parchment/70 md:text-4xl"
              aria-hidden="true"
            >
              {copy}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto flex max-w-[1200px] flex-col items-center px-6 py-16 text-center md:px-10 md:py-24 lg:px-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Get in touch</p>
          <h2 className="mt-4 max-w-3xl text-3xl text-parchment md:text-5xl">
            Have a tale worth telling?{' '}
            <em className="font-display italic whitespace-nowrap">Say hi.</em>
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted md:text-base">
            Reach out for collaborations, press, or just to talk games. And if
            you enjoy what we make, a coffee keeps the stories coming.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <RingButton href={mailtoHref}>
              <Mail className="h-4 w-4" /> Email us
            </RingButton>
            <RingButton href={kofiUrl} external variant="outline">
              <Coffee className="h-4 w-4" /> Buy me a coffee{' '}
              <span aria-hidden="true">↗</span>
            </RingButton>
          </div>
        </div>

        {/* Footer bar */}
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 border-t border-parchment/10 px-6 pt-6 text-xs text-muted sm:flex-row sm:justify-between md:px-10 lg:px-16">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-parchment">
              YouTube
            </a>
            <a href={kofiUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-parchment">
              Ko-fi
            </a>
            <Link to="/about" className="transition-colors hover:text-parchment">
              About
            </Link>
            <a href={mailtoHref} className="transition-colors hover:text-parchment">
              Contact
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="pulse-dot h-2 w-2 rounded-full bg-ember" />
              More games coming soon
            </span>
            <span className="hidden sm:inline">© Pencat Games</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
