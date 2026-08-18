import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { games, type Game } from '../data/games'
import { useInViewPlay } from '../hooks/useInViewPlay'
import SectionHeader from './SectionHeader'

function GameCard({ game, index }: { game: Game; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useInViewPlay(videoRef)

  return (
    <motion.a
      href={game.ctaUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      className={`group flex flex-col overflow-hidden rounded-3xl border border-stroke bg-surface transition-colors duration-500 hover:border-parchment/20 ${
        index % 2 === 0 ? 'md:col-span-7' : 'md:col-span-5'
      }`}
    >
      {/* Gameplay video; the narrower card gets a taller frame so the row
          stays balanced instead of leaving a hollow gap under its copy */}
      <div
        className={`relative overflow-hidden ${
          index % 2 === 0 ? 'aspect-video' : 'aspect-video md:aspect-[4/3]'
        }`}
      >
        <video
          ref={videoRef}
          src={game.video}
          poster={game.poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="halftone pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply" />

        {/* Genre pill */}
        <span className="story-glass absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-parchment/90">
          {game.genre}
        </span>

        {/* Hover: blur + play pill */}
        <div className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 backdrop-blur-lg transition-opacity duration-500 group-hover:opacity-100">
          <span className="accent-gradient-animated rounded-full p-[2px] shadow-xl shadow-black/40">
            <span className="flex items-center gap-2 rounded-full bg-parchment px-5 py-2.5 text-sm text-ink">
              Play <em className="font-display italic">{game.name}</em>
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </span>
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
        <h3 className="font-display text-2xl text-parchment md:text-3xl">{game.name}</h3>
        <p className="font-display text-base italic text-parchment/70 md:text-lg">
          {game.tagline}
        </p>
        <p className="text-sm leading-relaxed text-muted">{game.hook}</p>
        <span
          className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium"
          style={{ color: game.accentHex }}
        >
          {game.ctaLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.a>
  )
}

export default function FeaturedGames() {
  return (
    <section id="games" className="scroll-mt-24 bg-ink py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Our Games"
          heading={
            <>
              Featured <em className="font-display italic">games</em>
            </>
          }
          subtext="Two worlds published so far, each built around a story worth telling. Click a card to play."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-12 md:gap-6">
          {games.map((g, i) => (
            <GameCard key={g.id} game={g} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
