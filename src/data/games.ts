export type GameId = 'ravage' | 'khione'

export interface Game {
  id: GameId
  name: string
  /** Short italic line under the title (from the key art) */
  tagline: string
  genre: string
  hook: string
  ctaLabel: string
  ctaUrl: string
  keyArt: string
  video: string
  poster: string
  /** Brand accent used for the game's CTA text and hover ring */
  accentHex: string
}

export const games: Game[] = [
  {
    id: 'ravage',
    name: 'Ravage',
    tagline: 'A Tactical Story of Anthros',
    genre: '2D Tactical RPG · Visual Novel',
    hook: 'A 2D tactical strategy and RPG game wrapped around a visual novel. Characters who plot, plead, fall in love, and betray each other across a thirty-battle campaign with seven endings, every one of which you can still lose.',
    ctaLabel: 'Play Ravage',
    ctaUrl: 'https://Ravage.game',
    keyArt: '/images/ravage.png',
    video: '/videos/ravage-hero.mp4',
    poster: '/videos/ravage-poster.jpg',
    accentHex: '#e0563f',
  },
  {
    id: 'khione',
    name: 'Khione & the 10 Islands',
    tagline: 'A little cat. Ten islands. One letter.',
    genre: '3D Puzzle Adventure',
    hook: 'Play as a 3D Persian cat named Khione and solve riddles across one island to another to discover the final hidden treasure.',
    ctaLabel: 'Explore Khione',
    ctaUrl: 'https://Khione.game',
    keyArt: '/images/khione.png',
    video: '/videos/khione-teaser.mp4',
    poster: '/videos/khione-poster.jpg',
    accentHex: '#8fc1d4',
  },
]

export const contactEmail = 'kaseyfuwaterloo@gmail.com'
export const mailtoHref = `mailto:${contactEmail}?subject=Hello%20Pencat%20Games`
export const youtubeUrl = 'https://www.youtube.com/@jxfufu'
export const kofiUrl = 'https://ko-fi.com/kaseyfu'

/** Scroll-scrubbed hero: lecture hall push-in that ends on this exact
    Ravage frame, where ravageContinuation picks up */
export const lectureZoom = {
  url: '/videos/lecture-zoom.mp4',
  poster: '/videos/lecture-zoom-poster.jpg',
  bytes: 8_127_619,
  duration: 8.04,
}
export const ravageContinuation = '/videos/ravage-continuation.mp4'

/** Studio mark: the pen-nib cat, cropped for round slots like the navbar */
export const logoIcon = '/images/logo/pencat-mark.png'
export const mascotImage = '/images/gaming.png'

export const stats = [
  { value: '2', label: 'Worlds Published' },
  { value: '1', label: 'Independent Studio' },
  { value: '100%', label: 'Human-Written Stories' },
]
