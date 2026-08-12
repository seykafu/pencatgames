export type GameId = 'ravage' | 'khione'

export interface Game {
  id: GameId
  name: string
  eyebrow: string
  headingLines: [string, string]
  hook: string
  ctaLabel: string
  ctaUrl: string
  /** Tailwind classes for the solid CTA button */
  ctaClasses: string
  /** 'light' = parchment hero text, 'midnight' = dark blue hero text */
  contentMode: 'light' | 'midnight'
}

export interface Scene {
  label: string
  videoUrl: string
  gameId: GameId
}

export const games: Record<GameId, Game> = {
  ravage: {
    id: 'ravage',
    name: 'Ravage',
    eyebrow: 'RAVAGE',
    headingLines: ['Stories That', 'Refuse to Stay Quiet'],
    hook: '[PLACEHOLDER] A story of what survives us. Fight, endure, and remember in a world that keeps the score.',
    ctaLabel: 'Play Ravage',
    ctaUrl: 'https://Ravage.game',
    ctaClasses: 'bg-ember text-parchment hover:bg-ember/90',
    contentMode: 'light',
  },
  khione: {
    id: 'khione',
    name: 'Khione & the 10 Islands',
    eyebrow: 'KHIONE',
    headingLines: ['Ten Islands,', 'One Unending Winter'],
    hook: '[PLACEHOLDER] Ten islands. One winter that never ends. Sail, uncover, and thaw the story frozen beneath.',
    ctaLabel: 'Explore Khione',
    ctaUrl: 'https://Khione.game',
    ctaClasses: 'bg-frost text-ink hover:bg-frost/90',
    contentMode: 'midnight',
  },
}

/* [PLACEHOLDER] Scene videos reuse the motion-prompt loops until final
   game capture arrives — mapped 2-and-2 so the CTA logic stands now. */
export const scenes: Scene[] = [
  {
    label: 'Golden Hour',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4',
    gameId: 'ravage',
  },
  {
    label: 'Still Water',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4',
    gameId: 'ravage',
  },
  {
    label: 'Deep Woods',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4',
    gameId: 'khione',
  },
  {
    label: 'Quiet Dawn',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4',
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
