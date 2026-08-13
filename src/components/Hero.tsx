import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Navbar from './Navbar.tsx'
import { games, overlayPngUrl, scenes, stats } from '../data/games.ts'

const AUTO_ADVANCE_MS = 8000

export default function Hero() {
  const [activeScene, setActiveScene] = useState(0)
  const [autoAdvance, setAutoAdvance] = useState(true)
  // Text lags one beat behind the footage: it slides out in the swipe
  // direction, swaps to the new game, then slides in from the other side
  const [displayedScene, setDisplayedScene] = useState(0)
  const [textPhase, setTextPhase] = useState<'in' | 'out'>('in')
  const slideDirRef = useRef(1)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const game = games[scenes[activeScene].gameId]
  const displayedGame = games[scenes[displayedScene].gameId]
  const isMidnight = game.contentMode === 'midnight'

  useEffect(() => {
    if (activeScene === displayedScene) return
    slideDirRef.current = activeScene > displayedScene ? 1 : -1
    setTextPhase('out')
    const timer = setTimeout(() => {
      setDisplayedScene(activeScene)
      setTextPhase('in')
    }, 280)
    return () => clearTimeout(timer)
  }, [activeScene, displayedScene])

  // Mid-swipe clicks are fine: the track simply retargets and animates on
  const switchScene = (index: number, manual = false) => {
    if (manual) setAutoAdvance(false)
    if (index === activeScene) return
    setActiveScene(index)
  }

  useEffect(() => {
    if (!autoAdvance) return
    const timer = setTimeout(() => {
      setActiveScene((s) => (s + 1) % scenes.length)
    }, AUTO_ADVANCE_MS)
    return () => clearTimeout(timer)
  }, [activeScene, autoAdvance])

  // If the browser ever blocks/pauses autoplay, resume the visible video —
  // retry when it buffers enough, when the tab becomes visible again, and
  // on the first user interaction (which lifts autoplay restrictions)
  useEffect(() => {
    const video = videoRefs.current[activeScene]
    if (!video) return
    const tryPlay = () => {
      if (video.paused) video.play().catch(() => {})
    }
    const onVisible = () => {
      if (!document.hidden) tryPlay()
    }
    tryPlay()
    video.addEventListener('canplay', tryPlay)
    window.addEventListener('pointerdown', tryPlay)
    window.addEventListener('keydown', tryPlay)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      video.removeEventListener('canplay', tryPlay)
      window.removeEventListener('pointerdown', tryPlay)
      window.removeEventListener('keydown', tryPlay)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [activeScene])

  // Hero content color: parchment on Ravage scenes, midnight on Khione scenes
  const contentColor = isMidnight ? 'text-midnight' : 'text-parchment'

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background scene videos — horizontal swipe between scenes */}
      <div
        className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${activeScene * 100}%)` }}
      >
        {scenes.map((scene, i) => (
          <div key={scene.videoUrl} className="relative h-full w-full shrink-0">
            <video
              ref={(el) => {
                videoRefs.current[i] = el
                // React doesn't always reflect the muted prop onto the DOM
                // before the browser's autoplay check — set it directly
                if (el) {
                  el.muted = true
                  el.defaultMuted = true
                }
              }}
              src={scene.videoUrl}
              poster={scene.posterUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
            {games[scene.gameId].heroScrim && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(20,17,24,0.5) 0%, rgba(20,17,24,0.2) 65%, rgba(20,17,24,0.4) 100%)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                }}
              />
            )}
          </div>
        ))}
      </div>

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
          style={{ '--outline': isMidnight ? '#f2e9da' : '#141118' } as React.CSSProperties}
        >
          <div className="story-glass mb-6 rounded-full px-4 py-1.5">
            <p className="font-sans text-xs sm:text-sm">
              More games coming soon
            </p>
          </div>

          <div
            key={displayedScene}
            className={`flex flex-col items-center ${
              textPhase === 'out' ? 'hero-text-out' : 'hero-text-in'
            }`}
            style={{ '--slide-dir': slideDirRef.current } as React.CSSProperties}
          >
            <h1
              className={`text-bubble-outline font-display max-w-4xl leading-[1.1] ${displayedGame.headingClass}`}
            >
              {displayedGame.headingLines[0]}
              <br />
              {displayedGame.headingLines[1]}
            </h1>

            <p className="text-bubble-outline mt-6 max-w-xl font-sans text-sm leading-relaxed sm:text-base">
              {displayedGame.hook}
            </p>

            {/* Primary CTA */}
            <div className="story-glass mt-8 rounded-full p-1.5">
              <a
                href={displayedGame.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-semibold transition-colors sm:px-8 sm:text-base ${displayedGame.ctaClasses}`}
              >
                {displayedGame.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Scene switcher, grouped by game */}
          {/* Switcher sits over the dark carriage bezel in every scene, so it
              keeps parchment text + dark outline instead of the scene color mode */}
          <div
            id="games"
            className="mt-10 flex items-end gap-6 text-parchment sm:gap-10"
            style={{ '--outline': '#141118' } as React.CSSProperties}
          >
            {(['ravage', 'khione'] as const).map((gameId) => {
              const isActiveGame = scenes[activeScene].gameId === gameId
              return (
                <div key={gameId} className="flex flex-col items-center gap-2">
                  <span
                    className={`text-bubble-outline font-sans text-[10px] tracking-[0.2em] transition-opacity duration-300 sm:text-xs ${
                      isActiveGame ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    {games[gameId].eyebrow}
                  </span>
                  <div className="flex gap-2 sm:gap-3">
                    {scenes.map((scene, i) =>
                      scene.gameId === gameId ? (
                        <button
                          key={scene.label}
                          onClick={() => switchScene(i, true)}
                          className={`rounded-full px-4 py-1.5 font-sans text-xs transition-all duration-300 sm:text-sm ${
                            i === activeScene
                              ? `${games[gameId].ctaClasses} font-semibold shadow-lg`
                              : 'story-glass opacity-60 hover:opacity-90'
                          }`}
                        >
                          {scene.label}
                        </button>
                      ) : null,
                    )}
                  </div>
                </div>
              )
            })}
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
