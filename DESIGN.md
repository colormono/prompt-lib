---
name: Colormono AI Prompt Manager
description: A local-first, single-user catalog for prompts, skills, tools, and resources.
colors:
  electric-indigo: "#5b63f5"
  indigo-soft: "#a5adfb"
  indigo-strong: "#4348dc"
  indigo-deep: "#3336ab"
  indigo-whisper: "#e4e7ff"
  paper: "#ffffff"
  paper-subtle: "#f8f9fb"
  hairline: "#dde1e8"
  hairline-strong: "#c3c9d4"
  slate-muted: "#9aa2b1"
  slate: "#545c6d"
  charcoal: "#3c4251"
  charcoal-strong: "#262a35"
  ink: "#16181f"
  midnight: "#0c0d11"
  signal-green: "#1f9d55"
  signal-green-whisper: "#d9f5e3"
  signal-amber: "#b9770e"
  signal-amber-whisper: "#faecd0"
  signal-red: "#d1373f"
  signal-red-whisper: "#fbdedf"
typography:
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.2
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "999px"
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
    backgroundColor: "{colors.electric-indigo}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.indigo-strong}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-danger:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  badge-brand:
    backgroundColor: "{colors.indigo-whisper}"
    textColor: "{colors.electric-indigo}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

# Design System: Colormono AI Prompt Manager

## 1. Overview

**Creative North Star: "The Quiet Console"**

This is a control surface, not a storefront — a precise instrument built for exactly one operator, used mid-workflow to find, copy, and get back to work in seconds. Every visual decision serves retrieval speed and quiet confidence: the interface recedes so the cataloged content (a prompt's actual text, a tool's description) stays the visual focus, and the one saturated color in the system — Electric Indigo — exists to mean a single thing: *act on this*.

The system rejects the SaaS-dashboard reflex of card-grid monotony, gradient text, hero metrics, and decorative eyebrows named directly in `PRODUCT.md`'s anti-references. Nothing here needs to sell itself; it already has its one user. Density and precision read as respect for that user's time, not as sterility — buttons and controls stay tactile and confident (clear hover/active states, real color shifts) rather than flat and inert.

Light and dark are both first-class: the same semantic role names (`--color-bg`, `--color-text`, `--color-accent`, …) resolve to different neutral/brand steps per theme, so no component ever branches on theme directly.

**Key Characteristics:**
- One accent color (Electric Indigo), used sparingly and only for actionable/interactive emphasis
- Flat-leaning surfaces with hairline borders; shadows present but whispered, never the primary depth cue
- System font stack — no custom display type, because there is no display moment to serve
- Tight, disciplined spacing scale (4px base) and a small, consistent radius set
- Fast, unshowy motion (120–200ms ease) on state changes only

## 2. Colors

A restrained palette: a large neutral scale (paper → midnight) carries almost the entire surface, with one indigo hue for anything actionable and three status hues reserved strictly for success/warning/danger states.

### Primary
- **Electric Indigo** — the only color that means "act on this." Never used decoratively. Two roles, both driven by the same hue:
  - **Text/icon/link/focus-ring role** (`--color-accent`, `#5b63f5` light / `#a5adfb` dark): the lighter dark-theme step keeps indigo readable directly against a dark page background.
  - **Solid-fill role** (`--color-accent-solid`, `#5b63f5` in both themes): primary buttons and active/selected filter chips pair this with white text (`--color-text-on-brand`); it stays the same saturated step in both themes because white text needs ≥4.5:1, which the lighter dark-theme step (2.1:1) fails.

### Neutral
- **Paper** (`#ffffff`): light-theme background and surface.
- **Paper Subtle** (`#f8f9fb`): light-theme subtle background (hover fills, view-toggle tray).
- **Hairline** (`#dde1e8`): light-theme default border.
- **Hairline Strong** (`#c3c9d4`): light-theme emphasized border (secondary button outline, input border).
- **Slate Muted** (`#9aa2b1`): dark-theme muted text.
- **Slate** (`#545c6d`): light-theme muted text; dark-theme strong border.
- **Charcoal** (`#3c4251`): dark-theme default border.
- **Charcoal Strong** (`#262a35`): dark-theme raised surface (modals) and accent-subtle fill.
- **Ink** (`#16181f`): light-theme text; dark-theme background/surface base.
- **Midnight** (`#0c0d11`): dark-theme background.

### Functional (status)
- **Signal Green** (`#1f9d55`) / whisper (`#d9f5e3`): tested/success status only.
- **Signal Amber** (`#b9770e`) / whisper (`#faecd0`): draft/warning status only.
- **Signal Red** (`#d1373f`) / whisper (`#fbdedf`): retired/destructive status only.

### Named Rules
**The One Signal Rule.** Electric Indigo appears only where the user can act: buttons, links, active toggles, focus rings, checkboxes. It never appears as a background wash, a gradient stop, or plain decoration. If indigo shows up somewhere the user can't click, tick, or type, it's misused.

**The Whisper Shadow Rule.** Depth comes from hairline borders first, shadow second. A component that needs a heavy shadow to read as "raised" should get a border instead.

## 3. Typography

**Body Font:** System UI stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`)
**Label/Mono Font:** `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace` — reserved for prompt bodies and code-shaped content.

**Character:** One system sans, used at a narrow range of sizes and weights. There is no display face because there is no hero moment — hierarchy comes from weight and size steps, not from a second typeface. The mono stack appears only where the content itself is technical (prompt text, model names), never for UI chrome.

### Hierarchy
- **Title** (semibold 600, 1.25rem, line-height 1.2): app header title, modal titles. The largest text in the system; still sits inside the header bar rather than dominating the viewport.
- **Body** (regular 400, 1rem, line-height 1.5): default reading size for descriptions, prompt previews, form values. Cap prose at 65–75ch where it wraps freely.
- **Label** (medium 500, 0.875rem, line-height 1.2): form field labels, badges, filter chips — anything naming a control rather than presenting content.
- **Small/meta** (regular 400, 0.75rem): help text, error messages, timestamps.

### Named Rules
**The No-Hero Rule.** No font size in this system exceeds 1.25rem (Title). If a screen seems to need something bigger, the answer is better information architecture, not a bigger headline — this is a tool, not a landing page.

## 4. Elevation

Ambient and restrained. Shadows exist (three steps, all low-opacity, tuned separately per theme) but they are a whisper, not a structural device — hairline borders and background-color steps do the actual work of separating surfaces. Only true overlays (the modal) reach for the largest shadow; everything else stays close to flat.

### Shadow Vocabulary
- **sm** (`0 1px 2px rgba(12, 13, 17, 0.06)` light / `rgba(0,0,0,0.4)` dark): default card resting shadow; barely perceptible.
- **md** (`0 4px 12px rgba(12, 13, 17, 0.1)` light / `rgba(0,0,0,0.45)` dark): active/raised state (e.g. the active view-toggle button).
- **lg** (`0 12px 32px rgba(12, 13, 17, 0.16)` light / `rgba(0,0,0,0.55)` dark): reserved for the modal only — the single true overlay in the system.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow above `sm` only appears in direct response to state (raised/active) or true overlay (modal); it is never used to make an otherwise-static element look "designed."

## 5. Components

Every primitive is tactile and confident: clear, immediate color shifts on hover/active rather than subtle opacity fades, so the one user always knows an action registered — but nothing overshoots into flourish (no bounce, no scale-up, no shadow blooms).

### Buttons
- **Shape:** 8px radius (`--radius-md`), 1px transparent border by default.
- **Primary:** Electric Indigo background, white text; hover → Indigo Strong (`#4348dc`); active → Indigo Deep (`#3336ab`). Padding scales with size (sm/md/lg): 4px/16px, 8px/16px, 12px/24px.
- **Secondary:** Paper background with a Hairline Strong border and Ink text; hover fills with Paper Subtle. The button that says "this is an option" without competing with Primary's indigo.
- **Ghost:** Transparent background, Ink text, hover fills with Paper Subtle. Used for the icon buttons in the header (view toggle, theme toggle, settings).
- **Danger:** Signal Red background, white text; hover drops to 90% opacity. Reserved for destructive confirmation only (delete asset).
- **Disabled:** 50% opacity across every variant, no hover response.

### Cards
- **Corner Style:** 12px radius (`--radius-lg`), the largest radius in the system.
- **Background:** Paper (light) / raised charcoal (dark), always with a 1px Hairline border.
- **Shadow Strategy:** `sm` only, per the Flat-By-Default Rule.
- **Border:** 1px Hairline, always present — the border does more visual work than the shadow.
- **Internal Padding:** 16px default (md), 12px (sm) or 24px (lg) for denser or looser contexts.

### Inputs / Fields
- **Style:** 1px Hairline Strong border, Paper background, 8px radius, 8/12px padding.
- **Focus:** border-color shift plus the global 2px Electric Indigo focus ring with 2px offset — consistent across every interactive element, not just inputs.
- **Error:** border switches to Signal Red; helper text switches to Signal Red at the small/meta size.
- **Disabled:** 50% opacity, not-allowed cursor.

### Badges / Tags
- **Style:** pill radius (999px), no border, small/label-size text at medium weight.
- **Variants:** Neutral (Paper Subtle bg / muted text), Brand (Indigo Whisper bg / Electric Indigo text), Success/Warning/Danger (matching whisper backgrounds and signal-colored text). Status color, never decoration.

### Navigation (App Header)
- Sticky top bar, Paper background, 1px Hairline bottom border. Logo/title on the left (click opens About), a tight cluster of icon-buttons on the right (new asset, view toggle, settings, theme). Icon-buttons default to muted Ink; the active view-toggle state gets Paper-raised background, Electric Indigo icon color, and the `sm` shadow — the one place shadow and color combine to mark "this is currently selected."

### Modal
- **Corner Style:** 12px radius, matching cards.
- **Backdrop:** `rgba(12, 13, 17, 0.5)` scrim, centers the dialog.
- **Shadow:** `lg` — the only place in the system that reaches for the largest shadow, because it's the only true overlay.
- **Header/Footer:** 1px Hairline dividers separate title and footer actions from body content; footer actions right-align.
- **Focus:** trapped within the dialog, first focusable element focused on open, focus restored to the trigger on close.
- **Destructive confirmation:** one dialog at a time, never two stacked. Either swap the open dialog for the confirmation dialog (e.g. edit form → delete confirm), or replace the open dialog's own title/body/footer in place (e.g. Data panel → reset confirm) if the user should land back in the same panel on cancel.

## 6. Do's and Don'ts

### Do:
- **Do** keep Electric Indigo (`#5b63f5` / `#a5adfb` dark) to actionable elements only: buttons, links, focus rings, active states, checkboxes.
- **Do** lead with a 1px Hairline border for surface separation; add shadow only for raised/active state or the modal overlay.
- **Do** use the system font stack at the existing size steps (0.75rem–1.25rem); resist introducing a display face or a size above 1.25rem.
- **Do** give every interactive primitive a clear, immediate hover/active color shift — the tactile-and-confident standard.
- **Do** compose new feature UI from the existing primitives (`Button`, `Input`, `Select`, `Checkbox`, `Card`, `Badge`, `Modal`, `Textarea`) rather than one-off styling.

### Don't:
- **Don't** use card-grid monotony, gradient text, hero-metric layouts, or tiny uppercase eyebrow labels — named anti-references from `PRODUCT.md`.
- **Don't** reach for glassmorphism or decorative blur; this system has none.
- **Don't** let a status color (green/amber/red) appear anywhere except status/state contexts — they are not decorative accents.
- **Don't** introduce a heavy shadow (`lg`) outside the modal; it's reserved for the one true overlay.
- **Don't** open a second `Modal` on top of one that's already open; swap or replace-in-place instead (see Modal → Destructive confirmation).
- **Don't** use `border-left`/`border-right` as a colored accent stripe on cards or list rows.
- **Don't** add motion beyond the existing 120–200ms ease state-change transitions; there is no choreographed/scroll-driven motion in this system.
