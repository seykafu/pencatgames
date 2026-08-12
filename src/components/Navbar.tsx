import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { mailtoHref, youtubeUrl } from '../data/games.ts'

const links = [
  { label: 'Games', href: '/#games', external: false },
  { label: 'About Us', href: '/about', external: false },
  { label: 'Contact Us', href: mailtoHref, external: false },
  { label: 'YouTube', href: youtubeUrl, external: true },
]

function NavLink({
  label,
  href,
  external,
  className,
  onClick,
  style,
}: {
  label: string
  href: string
  external: boolean
  className: string
  onClick?: () => void
  style?: React.CSSProperties
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
        style={style}
      >
        {label}
      </a>
    )
  }
  if (href.startsWith('mailto:') || href.includes('#')) {
    return (
      <a href={href} className={className} onClick={onClick} style={style}>
        {label}
      </a>
    )
  }
  return (
    <Link to={href} className={className} onClick={onClick} style={style}>
      {label}
    </Link>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="flex w-full items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
        <Link
          to="/"
          className="font-display text-xl italic text-parchment sm:text-2xl"
        >
          Pencat Games
        </Link>

        {/* Desktop pill */}
        <div className="story-glass hidden items-center gap-6 rounded-full py-2 pl-6 pr-2 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.label}
              {...l}
              className="font-sans text-sm text-parchment/90 transition-colors hover:text-parchment"
            />
          ))}
          <a
            href="/#games"
            className="rounded-full bg-ember px-4 py-2 font-sans text-sm font-medium text-parchment transition-colors hover:bg-ember/90"
          >
            Browse Games
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="story-glass relative z-50 rounded-full p-3 text-parchment md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="relative block h-5 w-5">
            <Menu
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                menuOpen ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
          onClick={() => setMenuOpen(false)}
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-8">
          {links.map((l, i) => (
            <NavLink
              key={l.label}
              {...l}
              onClick={() => setMenuOpen(false)}
              className={`font-display text-3xl text-parchment transition-all duration-500 ${
                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionDelay: menuOpen ? `${100 + i * 50}ms` : '0ms',
                transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          ))}
          <a
            href="/#games"
            onClick={() => setMenuOpen(false)}
            className={`mt-6 rounded-full bg-ember px-8 py-3 font-sans text-lg font-medium text-parchment transition-all duration-500 ${
              menuOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
            style={{
              transitionDelay: menuOpen ? '300ms' : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            Browse Games
          </a>
        </div>
      </div>
    </>
  )
}
