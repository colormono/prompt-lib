---
name: Colormono AI Prompt Manager
description: A local-first, single-user catalog for prompts, skills, tools, and resources.
colors:
  parchment: "#f7f7f4"
  bone: "#f2f1ed"
  linen: "#e6e5e0"
  stone: "#cdcdc9"
  mist: "#a1a19f"
  driftwood: "#84847e"
  ash: "#7a7974"
  ink: "#26251e"
  ember: "#f54e00"
  amber: "#c08532"
  forest: "#34785c"
  verdant: "#1f8a65"
  crimson: "#cf2d56"
  selection: "#8bc4f8"
  code-surface: "#1c1b18"
  code-text: "#e6e5e0"
typography:
  title:
    fontFamily: "'IBM Plex Sans', system-ui, Helvetica Neue, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  body:
    fontFamily: "'IBM Plex Sans', system-ui, Helvetica Neue, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'IBM Plex Sans', system-ui, Helvetica Neue, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.25
  editorial:
    fontFamily: "'EB Garamond', Iowan Old Style, Palatino Linotype, ui-serif, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.45
  mono:
    fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-amber:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-danger:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.bone}"
    rounded: "{rounded.md}"
    padding: "24px"
  input:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  badge:
    backgroundColor: "transparent"
    textColor: "{colors.ash}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
---

# Design System: Colormono AI Prompt Manager

> Warm parchment atelier lit by embers

**Theme:** light-first (dark is a warm ink companion, not a cool slate)

## 1. Overview

**Creative North Star: "Warm parchment atelier"**

A personal prompt library that should feel closer to a literary journal's technical annex than a SaaS dashboard. Cream canvas, warm ink, paper-on-paper layering, and a single ember accent that punctuates links — never fills buttons. Authority comes from restraint: weight-400 titles with progressively tighter tracking, sharp 4px corners, hairline borders, and soft warm-gray shadows.

This is still a mid-workflow retrieval tool (get in, copy, get out). The parchment language serves that job by making chrome quiet and content — especially mono prompt bodies — the visual focus.

**Key Characteristics:**
- Ink-filled primary actions on parchment; Ember is text-only punctuation
- Amber for in-product actions inside prompt/code chrome (Copy)
- IBM Plex Sans (CursorGothic stand-in) for UI; EB Garamond for editorial prose; IBM Plex Mono for prompts/metadata
- 4px radius on cards, buttons, inputs; 8px only on modals
- Flat paper surfaces; depth from hairline borders before shadows

## 2. Colors

| Name | Value | Role |
|------|-------|------|
| Parchment | `#f7f7f4` | Page background — warm cream canvas |
| Bone | `#f2f1ed` | Cards, elevated containers, inputs |
| Linen | `#e6e5e0` | Secondary button fills, raised chips |
| Stone | `#cdcdc9` | Hairline borders and dividers |
| Mist | `#a1a19f` | Tertiary helper text |
| Driftwood | `#84847e` | Secondary body text |
| Ash | `#7a7974` | Icons, muted labels, mono metadata |
| Ink | `#26251e` | Primary text and primary button fill |
| Ember | `#f54e00` | Links and short emphasis — never a large fill |
| Amber | `#c08532` | In-product action buttons (Copy, Build-like moments) |
| Forest | `#34785c` | Success fills / selected confirmation |
| Verdant | `#1f8a65` | Success text accents |
| Crimson | `#cf2d56` | Destructive text and danger fills |
| Selection | `#8bc4f8` | Browser text selection only (the sole cool tone) |

### Named Rules

**The Ember Punctuation Rule.** Ember appears on links, tags, and short emphasis. Never as a button background, large surface, icon wash, or gradient stop.

**The Ink CTA Rule.** The highest-contrast action is Ink on Parchment (or Parchment on Ink in dark theme). Pair it with a Linen secondary in the same group — never two filled buttons of the same weight.

**The Warm Shadow Rule.** Shadows stay warm `rgba(0,0,0,…)` over cream. No cool/blue-tinted elevation.

## 3. Typography

**UI / Headings:** IBM Plex Sans (stand-in for CursorGothic) — weights 400 and 500 only for display. Headlines never use 600+.
**Editorial:** EB Garamond — "Why this works", about copy, long prose. Keep it off UI labels and navigation.
**Mono:** IBM Plex Mono — prompt bodies, model names, file-like metadata, token estimates.
**System:** system-ui only for micro labels where a custom face adds noise.

### Type scale (product-tight)

| Role | Size | Weight | Letter spacing | Line height |
|------|------|--------|----------------|-------------|
| meta / mono | 12px | 400 | normal | 1.45 |
| label | 13px | 500 | 0.004em | 1.25 |
| body | 14px | 400 | 0.01em | 1.5 |
| title | 22px | 400 | -0.005em | 1.3 |
| title-lg | 26px | 400 | -0.012em | 1.25 |

### Named Rules

**The Whisper Headline Rule.** Titles are weight 400 with tighter tracking as size grows. Bold kills the editorial restraint.

**The Mono Voice Rule.** Prompt text and developer metadata always speak in IBM Plex Mono. UI chrome never does.

## 4. Elevation & Surfaces

| Surface | Token | Use |
|---------|-------|-----|
| Canvas | Parchment | Page background |
| Card | Bone | Asset cards, panels |
| Elevated | Linen | Secondary buttons, active trays |
| Outline | Stone / `color-mix(ink 8%, transparent)` | Hairline borders |

### Shadow vocabulary
- **sm:** barely-there paper lift for resting cards
- **md:** soft warm double-layer for raised product chrome
- **lg:** reserved for the modal overlay only

**The Flat-By-Default Rule.** Hairline borders do the work. Shadows whisper; they never decorate.

## 5. Spacing & Radius

**Base unit:** 4px. **Density:** compact.

- Card padding: 16–24px
- Element gap: 8px
- Page max content width: ~1300px with 24px outer padding

**Radius:** 4px on buttons, cards, inputs, tiles. 8px on modals. No pills (`999px`) on buttons or cards.

## 6. Components

### Buttons
- **Primary:** Ink fill, Parchment text, 4px radius, IBM Plex Sans 14px / 400.
- **Secondary:** Linen fill, Ink text.
- **Ghost:** Transparent, Ink at ~60% opacity; underline or subtle Bone fill on hover.
- **Amber action:** Amber fill, Parchment text — Copy and other in-chrome product actions.
- **Danger:** Crimson fill, Parchment text — destructive confirm only.
- Transition: 150ms cubic-bezier(0.4, 0, 0.2, 1).

### Cards
- Bone background, 4px radius, hairline Ink-at-5–10% border, optional `sm` warm shadow.
- No nested cards. No colored side stripes.

### Inputs
- Bone (or transparent) fill, 1px Ink-at-10% border, 4px radius, 8×12 padding.
- Focus: Ember ring (2px) with 2px offset.

### Badges / metadata tags
- Prefer transparent mono tags in Ash (12px IBM Plex Mono) — no pill, no wash.
- When a type chip needs presence: 4px radius, Linen/Bone fill, Ash or Ink text. Ember text only for actionable/brand emphasis.

### App header
- Transparent or Bone-on-Parchment, hairline bottom border, ~52px tall.
- Title: IBM Plex Sans 22px weight 400, slight negative tracking.
- Right cluster: ghost icon buttons + Ink primary "New asset".

### Prompt code block (window chrome)
- Dark warm code surface (`#1c1b18`) inside a Bone-framed or freestanding 4px block.
- Gray traffic-light dots (atelier restraint) or classic macOS dots — never chromatic decoration elsewhere.
- Header actions: ghost Reset + Amber Copy.
- Body: IBM Plex Mono, linen-colored text, editable slot fields dashed in Amber.
- Footer: mono metadata tags (model, category, ~tokens) — transparent, Ash text.

### Modal
- 8px radius, `lg` warm shadow, hairline dividers for header/footer.
- One dialog at a time; swap or replace-in-place for destructive confirm.

## 7. Do's and Don'ts

### Do
- Use 4px radius on buttons, cards, inputs, and tiles
- Set titles at weight 400 with progressive tracking
- Use Parchment canvas and Bone cards; layer with hairline borders before shadows
- Keep Ember on links and short emphasis only
- Use IBM Plex Mono for prompts and developer metadata
- Pair Ink primary with Linen secondary in the same action group

### Don't
- Use pure `#ffffff` or `#000000` — warm cream and warm ink only
- Apply weight 600+ to headings
- Use pill shapes on buttons or cards
- Introduce gradients, glows, or cool-tinted shadows
- Fill large surfaces with Ember
- Put EB Garamond on nav, labels, or buttons
- Stack more than two button styles in one action group
- Revive Electric Indigo, glassmorphism, or SaaS card-grid monotony

## 8. Dark theme

Dark is a warm ink atelier, not a cool slate console:
- Canvas → Ink / near-ink warm dark
- Surface → slightly lifted warm charcoal
- Text → Parchment / Bone
- Primary solid → Parchment fill with Ink text
- Ember links and Amber actions stay chromatic
- Status whispers sit on elevated dark surfaces, not pastel washes
