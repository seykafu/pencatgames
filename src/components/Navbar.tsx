import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { logoIcon, mailtoHref, youtubeUrl } from '../data/games'
import RingButton from './RingButton'

const links = [
  { label: 'Home', to: '/', hideOnMobile: true },
  { label: 'Games', to: '/#games' },
  { label: 'About', to: '/about' },
  { label: 'YouTube', href: youtubeUrl },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (to?: string) => {
    if (!to) return false
    if (to === '/') return pathname === '/' && !hash
    if (to === '/#games') return pathname === '/' && hash === '#games'
    return pathname === to
  }

  const linkClass = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs transition-colors sm:px-4 sm:py-2 sm:text-sm ${
      active
        ? 'bg-stroke/60 text-parchment'
        : 'text-muted hover:bg-stroke/50 hover:text-parchment'
    }`

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <nav
        className={`pointer-events-auto inline-flex items-center gap-1 rounded-full border border-parchment/10 bg-surface/85 px-2 py-2 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? 'shadow-lg shadow-black/30' : ''
        }`}
      >
        <Link
          to="/"
          aria-label="Pencat Games home"
          className="accent-gradient group h-9 w-9 shrink-0 rounded-full p-[2px] transition-transform duration-300 hover:scale-110"
        >
          <img
            src={logoIcon}
            alt=""
            className="h-full w-full rounded-full object-cover"
          />
        </Link>

        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        {links.map((l) =>
          l.href ? (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass(false)}
            >
              {l.label}
            </a>
          ) : (
            <Link
              key={l.label}
              to={l.to!}
              className={`${linkClass(isActive(l.to))} ${l.hideOnMobile ? 'hidden sm:inline-flex' : ''}`}
            >
              {l.label}
            </Link>
          ),
        )}

        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        <RingButton href={mailtoHref} variant="outline" size="sm" className="ml-1">
          Say hi <span aria-hidden="true">↗</span>
        </RingButton>
      </nav>
    </header>
  )
}
