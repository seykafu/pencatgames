export type GameId = 'ravage' | 'khione'

export interface Game {
  id: GameId
  name: string
  eyebrow: string
  headingLines: [string, string]
  hook: string
  ctaLabel: string
  ctaUrl: string
  keyArt: string
  /** Tailwind classes for the solid CTA button */
  ctaClasses: string
  /** 'light' = parchment hero text, 'midnight' = dark blue hero text */
  contentMode: 'light' | 'midnight'
  /** Dim + soften busy gameplay footage so hero text stays readable */
  heroScrim: boolean
}

export interface Scene {
  label: string
  videoUrl: string
  posterUrl: string
  gameId: GameId
}

export const games: Record<GameId, Game> = {
  ravage: {
    id: 'ravage',
    name: 'Ravage',
    eyebrow: 'RAVAGE',
    headingLines: ['Stories That', 'Refuse to Stay Quiet'],
    hook: 'A 2D tactical strategy and RPG game wrapped around a visual novel. Characters who plot, plead, fall in love, and betray each other across a thirty-battle campaign with seven endings - every one of which you can still lose.',
    ctaLabel: 'Play Ravage',
    ctaUrl: 'https://Ravage.game',
    keyArt: '/images/ravage.png',
    ctaClasses: 'bg-ember text-parchment hover:bg-ember/90',
    contentMode: 'light',
    heroScrim: true,
  },
  khione: {
    id: 'khione',
    name: 'Khione & the 10 Islands',
    eyebrow: 'KHIONE',
    headingLines: ['Ten Islands,', 'One Unending Winter'],
    hook: 'Play as a 3D Persian cat named Khione and solve riddles across one island to another to discover the final hidden treasure.',
    ctaLabel: 'Explore Khione',
    ctaUrl: 'https://Khione.game',
    keyArt: '/images/khione.png',
    ctaClasses: 'bg-frost text-ink hover:bg-frost/90',
    contentMode: 'midnight',
    heroScrim: false,
  },
}

/* Real game footage — served from public/videos/ */
export const scenes: Scene[] = [
  {
    label: 'Footage',
    videoUrl: '/videos/ravage-footage.mp4',
    posterUrl: '/videos/ravage-poster.jpg',
    gameId: 'ravage',
  },
  {
    label: 'Teaser',
    videoUrl: '/videos/khione-teaser.mp4',
    posterUrl: '/videos/khione-poster.jpg',
    gameId: 'khione',
  },
]

/* [PLACEHOLDER] Foreground vignette — themed torn-page/ink-brush frame to come */
export const overlayPngUrl =
  'https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png'

export const contactEmail = 'kaseyfuwaterloo@gmail.com'
export const mailtoHref = `mailto:${contactEmail}?subject=Hello%20Pencat%20Games`
export const youtubeUrl = 'https://www.youtube.com/@jxfufu'

export const stats = [
  '2 Worlds Published',
  '1 Independent Studio',
  '100% Story-First',
  'Built in Canada',
]
