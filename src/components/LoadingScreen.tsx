import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const words = ['Write', 'Play', 'Remember']
const DURATION_MS = 1800

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)

  // Elapsed-time driven (not rAF) so the intro still finishes if the page
  // was opened in a background tab where animation frames are paused
  useEffect(() => {
    const start = performance.now()
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      setCount(100)
      setTimeout(onComplete, 350)
    }
    const iv = setInterval(() => {
      const progress = Math.min(1, (performance.now() - start) / DURATION_MS)
      setCount(Math.round(progress * 100))
      if (progress >= 1) {
        clearInterval(iv)
        finish()
      }
    }, 30)
    const hardStop = setTimeout(finish, DURATION_MS + 1500)
    return () => {
      clearInterval(iv)
      clearTimeout(hardStop)
    }
  }, [onComplete])

  useEffect(() => {
    const t = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 600)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col bg-ink"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <motion.span
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted md:left-10 md:top-8"
      >
        Pencat Games
      </motion.span>

      <div className="flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="font-display text-4xl italic text-parchment/80 md:text-6xl lg:text-7xl"
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="absolute bottom-8 right-6 font-display text-6xl tabular-nums text-parchment md:bottom-10 md:right-10 md:text-8xl lg:text-9xl">
        {String(count).padStart(3, '0')}
      </span>

      <div className="h-[3px] w-full bg-stroke/50">
        <div
          className="accent-gradient h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: '0 0 8px rgba(224, 86, 63, 0.4)',
          }}
        />
      </div>
    </motion.div>
  )
}
