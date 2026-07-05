# Phase 1 — Design System · Plan

Numbered task groups. Complete in order; each group leaves the repo in a
working state.

## 1. Design tokens

1.1 Create `src/styles/tokens.css` with CSS custom properties on `:root`
    (light theme defaults) and a `[data-theme="dark"]` override block:
    - Color: neutral scale, brand/accent, semantic (success/warning/danger),
      surface/background/border/text roles.
    - Type: font family, a type scale (sizes + line-heights), weights.
    - Spacing: a consistent scale (e.g. 4px base).
    - Radii: small/medium/large/pill.
    - Shadows: elevation levels for cards/modals.
2.2 Add a small `theme.ts` helper: read/write the active theme to
    `localStorage`, apply `data-theme` on `<html>`, default to system
    preference (`prefers-color-scheme`) on first load.

## 2. Global reset & base styles

2.1 Create `src/styles/global.css`: modern CSS reset (box-sizing, margin
    reset, media defaults) + base element styles (body, headings, links,
    lists, form elements) driven entirely by tokens.
2.2 Import `tokens.css` and `global.css` from `main.ts` (or `App.svelte`),
    replacing any prototype styling.
2.3 Verify base page (body background/text/font) reflects tokens in both
    themes.

## 3. Core UI primitives

Build each as a self-contained Svelte component in `src/components/ui/`,
styled only with tokens, with visible focus states and semantic markup.

3.1 `Button.svelte` — variants (primary/secondary/ghost/danger), sizes,
    disabled state, optional icon slot.
3.2 `Input.svelte` — text input with label, placeholder, error/help text,
    disabled state.
3.3 `Textarea.svelte` — multi-line variant of Input, same label/error
    conventions, resizable.
3.4 `Select.svelte` — labeled dropdown for enum fields (e.g. asset type,
    status), error/help text, disabled state.
3.5 `Checkbox.svelte` — labeled boolean control (e.g. favorite/status
    toggles), disabled state.
3.6 `Card.svelte` — container with padding/radius/shadow tokens, optional
    header/footer slots.
3.7 `Badge.svelte` (Tag) — small pill for tags/status, color variants.
3.8 `Modal.svelte` — overlay + dialog, focus-trapped, closes on
    backdrop click and `Escape`, `role="dialog"` + `aria-modal`.

## 4. Style guide route

4.1 Add a dev-only style guide view (e.g. `components/dev/StyleGuide.svelte`)
    that renders: all token swatches (colors, type scale, spacing, radii,
    shadows) and every primitive with its variants/states, in both themes.
4.2 Wire a way to reach it without polluting the real app shell — e.g. a
    simple hash route check (`#style-guide`) in `App.svelte`, or a
    `VITE_`-gated dev link. Keep it permanently in the codebase per the
    stakeholder decision (not a throwaway scaffold to delete later).
4.3 Add a theme toggle control on the style guide page to flip
    `data-theme` and visually confirm both themes render correctly across
    every primitive.

## 5. Verify & finalize

5.1 Manually walk the style guide in both themes; confirm focus states are
    visible via keyboard (Tab) and contrast looks correct.
5.2 Run `npm run build` and `npm run preview` — style guide and base app
    both load with no console errors.
5.3 Run `npm run lint` and `npm run format` — clean.
5.4 Run `npm run test` — existing sanity test(s) still pass (no new
    interaction tests added this phase, per requirements decisions).
5.5 Update `README.md` if the style guide route needs a note on how to
    reach it locally.
5.6 Commit using Conventional Commits (e.g.
    `feat: add design tokens, global styles, and ui primitives`).
