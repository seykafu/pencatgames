import { Routes, Route } from 'react-router-dom'
import Hero from './components/Hero.tsx'
import About from './pages/About.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}
