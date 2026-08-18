import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SectionHeaderProps {
  eyebrow: string
  heading: ReactNode
  subtext?: string
  action?: ReactNode
}

export default function SectionHeader({ eyebrow, heading, subtext, action }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">{eyebrow}</span>
        </div>
        <h2 className="mt-4 text-3xl text-parchment md:text-5xl">{heading}</h2>
        {subtext && <p className="mt-3 max-w-lg text-sm text-muted md:text-base">{subtext}</p>}
      </div>
      {action}
    </motion.div>
  )
}
