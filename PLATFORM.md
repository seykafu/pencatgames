# Pencat Games — Platform Specification

> **Status:** Draft v0.1 · Placeholder content marked with `[PLACEHOLDER]` will be replaced when final assets/copy arrive.

---

## 1. What This Platform Is

**Pencat Games** is a game publisher focused on **storytelling games** — worlds you fall into, characters you carry with you. This website is the publisher's main landing area and central hub: the one link that represents the label, showcases every title we publish, and routes players out to each game's own site.

**Primary goals:**

1. **Showcase the catalog** — currently two published titles — front and center on the landing page.
2. **Drive clicks to each game's site** via a clear CTA per title (the hero itself rotates between games).
3. **Establish the publisher's identity** through an About page and consistent brand voice.
4. **Offer light-touch contact & community** — a mailto contact CTA and a YouTube channel link.

**Non-goals (for now):** no storefront/checkout, no accounts, no blog/CMS, no press kit portal. Those can layer in later.

---

## 2. The Catalog

| Game | Tagline (placeholder) | CTA destination |
|---|---|---|
| **Ravage** | `[PLACEHOLDER]` "A story of what survives us." | https://Ravage.game |
| **Khione & the 10 Islands** | `[PLACEHOLDER]` "Ten islands. One winter that never ends." | https://Khione.game |

Each game gets:
- A **hero scene** in the landing page rotation (background video/art pulled from that game).
- A **primary CTA button** ("Play Ravage" / "Explore Khione") linking out to its site, shown while its scene is active.
- A short one-line hook rendered as the hero subtext while its scene is active.

> `[PLACEHOLDER]` Game key art, trailer/loop videos, logos, and final taglines to be provided later.

---

## 3. Site Map

```
/                → Landing (cinematic hero + game showcase rotation)
/about           → About Us (the Pencat Games story)
mailto:          → Contact Us (mailto CTA, no dedicated page needed)
external         → YouTube (https://www.youtube.com/@jxfufu)
external         → Ravage.game, Khione.game (per-game CTAs)
```

### Navigation bar (all pages)

| Item | Behavior |
|---|---|
| **Pencat Games** (logo, left) | Links home (`/`) |
| **Games** | Scrolls/jumps to the game switcher on the landing hero |
| **About Us** | Navigates to `/about` |
| **Contact Us** | `mailto:kaseyfuwaterloo@gmail.com` |
| **YouTube** | Opens https://www.youtube.com/@jxfufu in a new tab |

Mobile: hamburger menu (crossfade rotation animation) opening a fullscreen overlay with staggered link entrance — same pattern as the hero spec below.

---

## 4. Brand & Visual Theme

Deliberately **adjacent to, but differentiated from,** the Lumora reference (mindfulness app: airy whites, liquid glass, dawn light). Pencat Games is a **storyteller's brand** — the same cinematic calm, but warmer, inkier, more like an open book at night than a sunrise meditation.

### 4.1 Palette

| Token | Hex | Use |
|---|---|---|
| `ink` | `#141118` | Base background, dark text on light scenes |
| `parchment` | `#F2E9DA` | Light text, light UI fills |
| `ember` | `#E0563F` | Primary accent — CTAs, active states (Ravage energy) |
| `frost` | `#8FC1D4` | Secondary accent — links, Khione scenes |
| `midnight` | `#1E3A5F` | Deep secondary surface, Khione scene text mode |
| `gilt` | `#C9A227` | Sparing highlight — hover glints, dividers |

Rule of thumb: **ink + parchment** carry the site; **ember** and **frost** are each "owned" by a game and tint the UI while that game's scene is active.

### 4.2 Typography

- **Display / logo:** `Fraunces` (Google Fonts), italic for the logo wordmark — a storyteller's serif with more ink and character than Instrument Serif (differentiation from the reference).
- **Body / UI:** `system-ui, sans-serif` for subtext, buttons, stats, and scene labels.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&display=swap" rel="stylesheet">
```

### 4.3 Surface treatment — "Storybook Glass"

Keep the liquid-glass pill/panel language from the reference but tune it to the ink palette: slightly warmer, lower blur, with a `gilt` shimmer on the gradient border instead of pure white.

```css
.story-glass {
  background: rgba(20, 17, 24, 0.08);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: inset 0 1px 1px rgba(242, 233, 218, 0.12);
  position: relative;
  overflow: hidden;
}
.story-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(242,233,218,0.5) 0%, rgba(201,162,39,0.2) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(201,162,39,0.2) 80%, rgba(242,233,218,0.5) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

---

## 5. Landing Page — Cinematic Hero

A single fullscreen section (`h-screen`, `overflow-hidden`, `bg-black` to prevent load flash). Built in React + Tailwind CSS + Lucide React icons. The hero **is** the game showcase: each "scene" belongs to a game, and switching scenes switches the featured game and its CTA.

### 5.1 Background scene layer

Stack fullscreen looping videos, absolutely positioned; only the active scene at `opacity-100`, others `opacity-0`, crossfading over **1000ms ease-in-out**. Videos `autoPlay muted loop playsInline`.

**Scenes (4):**

| # | Scene label | Game | Asset |
|---|---|---|---|
| 1 | Ravage — `[PLACEHOLDER label]` | Ravage | `[PLACEHOLDER video URL]` |
| 2 | Ravage — `[PLACEHOLDER label]` | Ravage | `[PLACEHOLDER video URL]` |
| 3 | Khione — `[PLACEHOLDER label]` | Khione & the 10 Islands | `[PLACEHOLDER video URL]` |
| 4 | Khione — `[PLACEHOLDER label]` | Khione & the 10 Islands | `[PLACEHOLDER video URL]` |

> Until real capture/trailer loops arrive, use any 4 muted looping placeholder videos; keep the 2-and-2 game mapping so the CTA logic can be built now.

### 5.2 Foreground overlay

A transparent PNG overlay (full viewport, `z-index: 1`) for parallax depth — e.g. a foreground silhouette frame (`[PLACEHOLDER asset]`, ideally themed: torn-page / ink-brush vignette edges rather than the reference's train window). Continuous idle bob: `translateY` 0 → −6px over 3s ease-in-out infinite, constant `scale(1.03)` so edges never show.

### 5.3 Content layer (z-index 2, flex column, full height)

**Navigation (top)** — as per the site map table above:
- Left: **"Pencat Games"** wordmark — parchment, Fraunces italic, `text-xl sm:text-2xl`.
- Right (md+): a `.story-glass` pill with links — Games · About Us · Contact Us · YouTube — `text-sm` parchment/90, hover to full parchment; ending with a solid **ember** "Browse Games" button.
- Right (mobile): `.story-glass` rounded hamburger (Lucide `Menu`/`X`), 300ms crossfade-rotation (Menu rotates out 90°, scales to 75%; X rotates in from −90°).

**Mobile menu overlay** (fixed, z-50): `bg-black/60 backdrop-blur-sm` backdrop; centered panel; links parchment `text-3xl` with staggered entrance (delays 100/150/200/250/300ms, `translate-y-4 → 0`); ember CTA button at bottom with scale-in; easing `cubic-bezier(0.4,0,0.2,1)`, 500ms.

**Hero content (centered):**
- **Badge:** `.story-glass` rounded-full pill — `[PLACEHOLDER]` "Two worlds published. More stories on the way."
- **Heading:** changes with the active game —
  - Ravage scenes: `[PLACEHOLDER]` "Stories That / Refuse to Stay Quiet" (break after "That")
  - Khione scenes: `[PLACEHOLDER]` "Ten Islands, / One Unending Winter"
  - Sizes: `text-4xl / sm:text-5xl / md:text-7xl / lg:text-[5.5rem]`, `leading-[1.1]`, `max-w-4xl`, Fraunces.
- **Subtext:** the active game's one-line hook (see Catalog table), `max-w-xl leading-relaxed`, system-ui.
- **Primary CTA:** in place of the reference's email capture, a `.story-glass` rounded-full pill holding a solid button that links out:
  - Ravage active → **"Play Ravage →"** → `https://Ravage.game`
  - Khione active → **"Explore Khione →"** → `https://Khione.game`
  - Button fill follows the game accent (ember / frost), text auto-contrasts.
- **Scene switcher:** row of 4 text buttons (scene labels). Active: solid color + bottom border; inactive: 50% opacity, transparent border, hover 80%. Grouped visually 2+2 under small "RAVAGE" / "KHIONE" eyebrow labels so users understand the catalog structure at a glance.

**Per-scene color mode:** analogous to the reference's "Deep Woods" dark mode — when a **Khione** scene is active, hero content (badge, heading, subtext, CTA, switcher) transitions to `midnight #1E3A5F` over 700ms (snowy scenes read light); Ravage scenes keep parchment text. Navbar and bottom stats stay parchment/white always.

**Bottom stats bar** (pushed down via `flex-1` spacer): `|`-separated on sm+, wrapping on mobile; `text-white/70 text-xs sm:text-sm`, system-ui:

> `[PLACEHOLDER]` "2 Worlds Published" · "1 Independent Studio" · "100% Story-First" · "Built in Canada"

### 5.4 Scene-switching logic

- State: `activeScene` (default 0) + `isTransitioning`.
- On switch: ignore if already active or mid-transition; set scene, start **1000ms cooldown** matching the crossfade; ignore clicks during cooldown.
- Derived from `activeScene`: featured game, heading, subtext, CTA target, accent color, and light/midnight content mode.
- Optional: auto-advance every ~8s, paused after any manual interaction.

### 5.5 Responsive

- **Mobile:** smaller type, tighter padding, hamburger nav, stats wrap, scene switcher may scroll horizontally.
- **Tablet/desktop:** full-size heading, inline nav pill, pipe-separated stats.

---

## 6. About Us Page (`/about`)

A quiet, readable page — ink background, parchment text, generous line length (max ~65ch). Structure:

1. **Hero statement** — `[PLACEHOLDER]` "Pencat Games is an independent publisher of storytelling games. We believe the games worth remembering are the ones that tell you something true."
2. **Our story** — `[PLACEHOLDER]` founding story: who's behind Pencat Games, why storytelling-first, the road to publishing Ravage and Khione & the 10 Islands.
3. **What we publish** — short cards for both games (key art thumbnail, one-liner, CTA to each game's site).
4. **What "story-first" means to us** — `[PLACEHOLDER]` 3 short principle blurbs (e.g., *Narrative before mechanics* · *Worlds with a point of view* · *Small teams, big feelings*).
5. **Footer CTA row** — Contact Us (mailto) + YouTube.

---

## 7. Contact & External Links

- **Contact Us:** everywhere it appears (nav, about footer), it is `mailto:kaseyfuwaterloo@gmail.com` — prefilled subject suggested: `?subject=Hello%20Pencat%20Games`.
- **YouTube:** nav item labeled exactly **"YouTube"** → `https://www.youtube.com/@jxfufu`, `target="_blank" rel="noopener noreferrer"`.
- **Game sites:** `https://Ravage.game` and `https://Khione.game`, both opened in a new tab from CTAs.

---

## 8. Tech Stack & Structure

- **React + Tailwind CSS + Lucide React**, Vite scaffold.
- Fonts via Google Fonts `<link>` in `index.html` (Fraunces).
- Landing hero lives in one component (`Hero.tsx`) with CSS in `index.css` (`.story-glass`, bob keyframes); `/about` as a second route (React Router).
- All game/scene data driven from a single `games.ts` config array (label, video URL, heading, hook, CTA URL, accent, content mode) so swapping placeholder assets for final ones is a one-file change.

```
src/
  App.tsx            # routes: / and /about
  components/
    Hero.tsx         # cinematic hero + scene switcher
    Navbar.tsx       # shared nav (glass pill / hamburger)
  pages/
    About.tsx
  data/
    games.ts         # scene + game config (single source of truth)
  index.css          # .story-glass, animations, font setup
```

---

## 9. Open Items (waiting on content)

- [ ] 4 scene loop videos (2 per game) + labels
- [ ] Foreground overlay PNG (themed vignette)
- [ ] Final taglines/hooks for Ravage and Khione & the 10 Islands
- [ ] Game logos / key art for About page cards
- [ ] Publisher story copy for About page
- [ ] Stats bar final numbers/claims
- [ ] Favicon / social share (OG) image
