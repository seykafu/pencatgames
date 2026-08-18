import { ArrowRight, Coffee } from 'lucide-react'
import Footer from '../components/Footer'
import { games, kofiUrl } from '../data/games'

const principles = [
  {
    title: 'Narrative before mechanics',
    body: 'Every game we publish starts with a tale worth telling. Whether the world is 2D or 3D, the systems and set pieces exist to make that tale land harder, and to be genuinely fun to play along the way.',
  },
  {
    title: 'Beautiful, memorable tales',
    body: 'Our vision is to publish games that tell beautiful and memorable stories while still engaging players in fun gameplay, experiences, and enjoyment. Story and play aren’t rivals. The best games weave them together.',
  },
  {
    title: 'AI-enabled, human-written',
    body: 'Pencat Games publishes games that are enabled with the help of AI. It’s how a small team ships big worlds. But the writing is, and always will be, human-created.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-ink text-parchment">
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        {/* Hero statement */}
        <h1 className="font-display text-4xl leading-[1.15] sm:text-5xl md:text-6xl">
          The games worth remembering are the ones that tell you{' '}
          <em className="text-gilt">something true.</em>
        </h1>
        <p className="mt-6 max-w-[65ch] font-body leading-relaxed text-parchment/80">
          Pencat Games is an independent publisher of storytelling games:
          worlds you fall into, characters you carry with you.
        </p>

        {/* Our story */}
        <section className="mt-16">
          <h2 className="font-display text-2xl italic text-gilt sm:text-3xl">
            Our Story
          </h2>
          <div className="mt-4 max-w-[65ch] space-y-4 font-body leading-relaxed text-parchment/80">
            <p>
              Pencat Games is produced and published by Kasey Fu, an AI product
              lead and games enthusiast who loves storytelling. Storytelling
              has been a huge part of Kasey’s life since childhood. He’s
              published fiction (<em>Darkness Me, Colorful You</em>) and never
              stopped writing.
            </p>
            <p>
              His interest in the convergence of storytelling and game design
              began when he joined a remote team to produce{' '}
              <a
                href="https://seykafu.itch.io/cultivate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gilt underline-offset-4 hover:underline"
              >
                Cultivate
              </a>
              , a 3D maze-runner game. What started there became a conviction:
              games are at their best when a story worth telling shapes the
              play. That conviction grew into Ravage, Khione &amp; the 10
              Islands, and Pencat Games itself.
            </p>
          </div>
        </section>

        {/* What we publish */}
        <section className="mt-16">
          <h2 className="font-display text-2xl italic text-gilt sm:text-3xl">
            What We Publish
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {games.map((game) => (
              <a
                key={game.id}
                href={game.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="story-glass group rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <img
                  src={game.keyArt}
                  alt={`${game.name} key art`}
                  className="mb-4 aspect-[3/1] w-full rounded-xl object-cover"
                />
                <h3 className="font-display text-xl">{game.name}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-parchment/70">
                  {game.hook}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-medium text-gilt">
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
                <p className="mt-1 max-w-[65ch] font-body text-sm leading-relaxed text-parchment/70">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Support */}
        <section className="mt-16 rounded-3xl border border-stroke bg-surface p-6 sm:p-8">
          <h2 className="font-display text-2xl italic text-gilt sm:text-3xl">
            Support the Studio
          </h2>
          <p className="mt-3 max-w-[65ch] font-body text-sm leading-relaxed text-parchment/70">
            Pencat Games is a one-person publishing label. If you enjoy Ravage
            or Khione, buying Kasey a coffee helps keep the next story in
            production.
          </p>
          <a
            href={kofiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 font-body text-sm font-semibold text-parchment transition-colors hover:bg-ember/90"
          >
            <Coffee className="h-4 w-4" />
            Buy me a coffee on Ko-fi
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>
      <Footer />
    </div>
  )
}
