import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface RingButtonProps {
  children: ReactNode
  href?: string
  to?: string
  external?: boolean
  variant?: 'solid' | 'outline'
  size?: 'sm' | 'md'
  className?: string
  onClick?: () => void
}

/**
 * Pill button that reveals an ember-to-gilt gradient ring on hover.
 * solid: parchment fill that inverts to ink on hover.
 * outline: stroke border that gives way to the gradient ring on hover.
 */
export default function RingButton({
  children,
  href,
  to,
  external,
  variant = 'solid',
  size = 'md',
  className = '',
  onClick,
}: RingButtonProps) {
  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm' : 'px-7 py-3.5 text-sm'
  const inner =
    variant === 'solid'
      ? `bg-parchment text-ink group-hover:bg-ink group-hover:text-parchment ${pad}`
      : `border-2 border-stroke bg-ink bg-clip-padding text-parchment group-hover:border-transparent ${pad}`
  const ringInset = variant === 'solid' ? '-inset-[2px]' : 'inset-0'

  const content = (
    <>
      <span
        className={`accent-gradient absolute ${ringInset} rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        aria-hidden="true"
      />
      <span
        className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors duration-300 ${inner}`}
      >
        {children}
      </span>
    </>
  )
  const base = `group relative inline-flex rounded-full transition-transform duration-300 hover:scale-105 ${className}`

  if (to) {
    return (
      <Link to={to} className={base} onClick={onClick}>
        {content}
      </Link>
    )
  }
  return (
    <a
      href={href}
      className={base}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  )
}
