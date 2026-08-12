import { ArrowRight, Mail, Youtube } from 'lucide-react'
import Navbar from '../components/Navbar.tsx'
import { games, mailtoHref, youtubeUrl } from '../data/games.ts'

const principles = [
  {
    title: 'Narrative before mechanics',
    body: '[PLACEHOLDER] Every system we ship exists to serve the story. If a mechanic doesn’t make the tale land harder, it doesn’t make the cut.',
  },
  {
    title: 'Worlds with a point of view',
    body: '[PLACEHOLDER] We publish games with something to say — worlds that feel authored, not assembled.',
  },
  {
    title: 'Small teams, big feelings',
    body: '[PLACEHOLDER] Pencat Games is intentionally small. That’s how the strange, personal, unforgettable stories get made.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-ink text-parchment">
      <Navbar />

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
        {/* Hero statement */}
        <h1 className="font-display text-4xl leading-[1.15] sm:text-5xl md:text-6xl">
          The games worth remembering are the ones that tell you{' '}
          <em className="text-gilt">something true.</em>
        </h1>
        <p className="mt-6 max-w-[65ch] font-sans leading-relaxed text-parchment/80">
          Pencat Games is an independent publisher of storytelling games —
          worlds you fall into, characters you carry with you.
        </p>

        {/* Our story */}
        <section className="mt-16">
          <h2 className="font-display text-2xl italic text-gilt sm:text-3xl">
            Our Story
          </h2>
          <div className="mt-4 max-w-[65ch] space-y-4 font-sans leading-relaxed text-parchment/80">
            <p>
              [PLACEHOLDER] Pencat Games began with one person, two worlds, and
              the stubborn belief that story-first games deserve a home of
              their own. What started as late-night builds became Ravage, then
              Khione &amp; the 10 Islands — and a publishing label to carry
              them.
            </p>
            <p>
              [PLACEHOLDER] Founding story: who’s behind Pencat Games, why
              storytelling-first, and the road to publishing both titles.
            </p>
          </div>
        </section>

        {/* What we publish */}
        <section className="mt-16">
          <h2 className="font-display text-2xl italic text-gilt sm:text-3xl">
            What We Publish
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {Object.values(games).map((game) => (
              <a
                key={game.id}
                href={game.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="story-glass group rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <div
                  className={`mb-4 flex h-36 items-center justify-center rounded-xl font-display text-lg italic ${
                    game.id === 'ravage'
                      ? 'bg-ember/20 text-ember'
                      : 'bg-frost/20 text-frost'
                  }`}
                >
                  [PLACEHOLDER key art]
                </div>
                <h3 className="font-display text-xl">{game.name}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-parchment/70">
                  {game.hook}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-gilt">
                  {game.ctaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="mt-16">
          <h2 className="font-display text-2xl italic text-gilt sm:text-3xl">
            What “Story-First” Means to Us
          </h2>
          <div className="mt-6 space-y-8">
            {principles.map((p) => (
              <div key={p.title}>
                <h3 className="font-display text-lg">{p.title}</h3>
                <p className="mt-1 max-w-[65ch] font-sans text-sm leading-relaxed text-parchment/70">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA row */}
        <section className="mt-20 flex flex-col items-start gap-4 border-t border-parchment/10 pt-10 sm:flex-row sm:items-center">
          <a
            href={mailtoHref}
            className="flex items-center gap-2 rounded-full bg-ember px-6 py-3 font-sans text-sm font-semibold text-parchment transition-colors hover:bg-ember/90"
          >
            <Mail className="h-4 w-4" />
            Contact Us
          </a>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="story-glass flex items-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-medium text-parchment transition-colors hover:text-gilt"
          >
            <Youtube className="h-4 w-4" />
            YouTube
          </a>
        </section>
      </main>
    </div>
  )
}
