import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from '../components/LoadingScreen'
import Hero from '../components/Hero'
import FeaturedGames from '../components/FeaturedGames'
import Stats from '../components/Stats'
import Footer from '../components/Footer'

const INTRO_KEY = 'pencat-intro-seen'

// Show the intro once per tab session, and never for reduced-motion users
function shouldShowIntro() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return !sessionStorage.getItem(INTRO_KEY)
}

export default function Home() {
  const [loading, setLoading] = useState(shouldShowIntro)

  const finishIntro = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, '1')
    setLoading(false)
  }, [])

  return (
    <>
      {/* Portaled to <body> so the page-transition wrapper's stacking
          context can't put the navbar above it */}
      {createPortal(
        <AnimatePresence>
          {loading && <LoadingScreen key="intro" onComplete={finishIntro} />}
        </AnimatePresence>,
        document.body,
      )}
      <Hero ready={!loading} />
      <FeaturedGames />
      <Stats />
      <Footer />
    </>
  )
}
