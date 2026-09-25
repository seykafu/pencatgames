import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from '../components/LoadingScreen'
import Hero from '../components/Hero'
import FeaturedGames from '../components/FeaturedGames'
import Stats from '../components/Stats'
import Footer from '../components/Footer'
import { lectureZoom } from '../data/games'
import { preloadVideo } from '../lib/preloadVideo'

const INTRO_KEY = 'pencat-intro-seen'

// Show the intro once per tab session, and never for reduced-motion users
function shouldShowIntro() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return !sessionStorage.getItem(INTRO_KEY)
}

export default function Home() {
  const [loading, setLoading] = useState(shouldShowIntro)
  const [loadProgress, setLoadProgress] = useState(0)
  const [zoomSrc, setZoomSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const { promise, unsubscribe } = preloadVideo(
      lectureZoom.url,
      (p) => !cancelled && setLoadProgress(p),
      lectureZoom.bytes,
    )
    promise
      .then((url) => !cancelled && setZoomSrc(url))
      .catch(() => {
        if (cancelled) return
        setZoomSrc(lectureZoom.url)
        setLoadProgress(1)
      })
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  // The intro gates the hero: no scrolling the zoom before it's on screen
  useEffect(() => {
    if (!loading) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = prev
    }
  }, [loading])

  const finishIntro = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, '1')
    window.scrollTo({ top: 0 })
    // If the download stalled past the loader's cap, stream it instead
    setZoomSrc((src) => src ?? lectureZoom.url)
    setLoading(false)
  }, [])

  return (
    <>
      {/* Portaled to <body> so the page-transition wrapper's stacking
          context can't put the navbar above it */}
      {createPortal(
        <AnimatePresence>
          {loading && (
            <LoadingScreen key="intro" onComplete={finishIntro} loadProgress={loadProgress} />
          )}
        </AnimatePresence>,
        document.body,
      )}
      <Hero zoomSrc={zoomSrc} ready={!loading} />
      <FeaturedGames />
      <Stats />
      <Footer />
    </>
  )
}
