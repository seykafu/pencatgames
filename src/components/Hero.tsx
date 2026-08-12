import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Navbar from './Navbar.tsx'
import { games, overlayPngUrl, scenes, stats } from '../data/games.ts'

const CROSSFADE_MS = 1000
const AUTO_ADVANCE_MS = 8000

export default function Hero() {
  const [activeScene, setActiveScene] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const game = games[scenes[activeScene].gameId]
  const isMidnight = game.contentMode === 'midnight'

  const switchScene = (index: number, manual = false) => {
    if (index === activeScene || isTransitioning) return
    setActiveScene(index)
    setIsTransitioning(true)
    if (manual) setAutoAdvance(false)
    cooldownRef.current = setTimeout(() => setIsTransitioning(false), CROSSFADE_MS)
  }

  useEffect(() => {
    if (!autoAdvance) return
    const timer = setTimeout(() => {
      setActiveScene((s) => (s + 1) % scenes.length)
      setIsTransitioning(true)
      cooldownRef.current = setTimeout(() => setIsTransitioning(false), CROSSFADE_MS)
    }, AUTO_ADVANCE_MS)
    return () => clearTimeout(timer)
  }, [activeScene, autoAdvance])

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current)
    }
  }, [])

  // Hero content color: parchment on Ravage scenes, midnight on Khione scenes
  const contentColor = isMidnight ? 'text-midnight' : 'text-parchment'

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background scene videos */}
      {scenes.map((scene, i) => (
        <video
          key={scene.videoUrl}
          src={scene.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === activeScene ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Foreground vignette overlay */}
      <img
        src={overlayPngUrl}
        alt=""
        aria-hidden="true"
        className="train-bob pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover"
      />

      {/* Content layer */}
      <div className="relative z-[2] flex h-full flex-col">
        <Navbar />

        {/* Hero content */}
        <div
          className={`flex flex-1 flex-col items-center justify-center px-5 text-center transition-colors duration-700 sm:px-8 ${contentColor}`}
        >
          <div className="story-glass mb-6 rounded-full px-4 py-1.5">
            <p className="font-sans text-xs sm:text-sm">
              Two worlds published. More stories on the way.
            </p>
          </div>

          <h1 className="font-display max-w-4xl text-4xl leading-[1.1] sm:text-5xl md:text-7xl lg:text-[5.5rem]">
            {game.headingLines[0]}
            <br />
            {game.headingLines[1]}
          </h1>

          <p className="mt-6 max-w-xl font-sans text-sm leading-relaxed opacity-90 sm:text-base">
            {game.hook}
          </p>

          {/* Primary CTA */}
          <div className="story-glass mt-8 rounded-full p-1.5">
            <a
              href={game.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-semibold transition-colors sm:px-8 sm:text-base ${game.ctaClasses}`}
            >
              {game.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Scene switcher, grouped by game */}
          <div
            id="games"
            className="mt-10 flex items-end gap-6 sm:gap-10"
          >
            {(['ravage', 'khione'] as const).map((gameId) => (
              <div key={gameId} className="flex flex-col items-center gap-2">
                <span className="font-sans text-[10px] tracking-[0.2em] opacity-60 sm:text-xs">
                  {games[gameId].eyebrow}
                </span>
                <div className="flex gap-4 sm:gap-6">
                  {scenes.map((scene, i) =>
                    scene.gameId === gameId ? (
                      <button
                        key={scene.label}
                        onClick={() => switchScene(i, true)}
                        className={`border-b-2 pb-1 font-sans text-xs transition-all duration-300 sm:text-sm ${
                          i === activeScene
                            ? 'border-current opacity-100'
                            : 'border-transparent opacity-50 hover:opacity-80'
                        }`}
                      >
                        {scene.label}
                      </button>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 pb-6 font-sans text-xs text-white/70 sm:gap-x-4 sm:text-sm">
          {stats.map((stat, i) => (
            <span key={stat} className="flex items-center gap-3 sm:gap-4">
              {i > 0 && <span className="hidden sm:inline">|</span>}
              {stat}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
