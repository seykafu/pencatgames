import { motion } from 'framer-motion'
import { stats } from '../data/games'

export default function Stats() {
  return (
    <section className="bg-ink py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 sm:grid-cols-3 md:px-10 lg:px-16">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="flex flex-col items-center gap-2 border-stroke text-center sm:border-l first:sm:border-l-0"
          >
            <span className="font-display text-5xl text-parchment md:text-7xl">{s.value}</span>
            <span className="text-xs uppercase tracking-[0.25em] text-muted">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
