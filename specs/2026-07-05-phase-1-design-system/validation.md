# Phase 1 — Design System · Validation

Phase 1 is **done and mergeable** when all of the following hold.

## Primary acceptance criteria

- [ ] `src/styles/tokens.css` defines color, type, spacing, radii, and
      shadow tokens, with a working `[data-theme="dark"]` override block.
- [ ] Both light and dark themes render correctly and can be toggled (via
      the style guide's theme control) without a page reload.
- [ ] `src/styles/global.css` provides a reset + base element styles, and
      no component hard-codes colors/spacing outside of tokens.
- [ ] All eight primitives exist in `src/components/ui/` and render
      correctly in both themes: `Button`, `Input`, `Textarea`, `Select`,
      `Checkbox`, `Card`, `Badge`/`Tag`, `Modal`.
- [ ] The style guide route renders every token swatch and every primitive
      variant/state, and remains reachable in the codebase after merge
      (not deleted).

## Accessibility checks

- [ ] Every interactive primitive (`Button`, `Input`, `Textarea`, `Select`,
      `Checkbox`) has a visible focus state reachable via Tab.
- [ ] `Modal` traps focus while open, closes on `Escape` and backdrop
      click, and exposes `role="dialog"` + `aria-modal="true"`.
- [ ] Form primitives (`Input`, `Textarea`, `Select`, `Checkbox`) associate
      a `<label>` with their control.
- [ ] Text/background color pairs in both themes are visually legible
      (manual check; no automated contrast tooling required this phase).

## Toolchain checks

- [ ] `npm run lint` (Biome) reports zero errors.
- [ ] `npm run format` (Biome) leaves the tree unchanged.
- [ ] `npm run test` passes (no new primitive interaction tests required
      this phase — deferred to Phase 2 per requirements decisions).
- [ ] `npm run build` and `npm run preview` succeed with no console errors
      on both the base app and the style guide route.

## How to verify

```bash
npm install
npm run lint
npm run test
npm run build
npm run dev     # open the app, then the style guide route
```

In the browser:

1. Load the base app — confirm it uses reset/base styles from
   `global.css` (no prototype styling leaking in).
2. Navigate to the style guide route — confirm all tokens and primitives
   render.
3. Toggle the theme control — confirm every primitive updates correctly
   for both light and dark.
4. Tab through the style guide's interactive primitives — confirm visible
   focus rings throughout, and that `Modal` traps focus and closes on
   `Escape`.

## Explicitly not required this phase

- Vitest interaction tests for primitive behavior (e.g. click/open-close
  assertions) — deferred until primitives are used in real features.
- Any data model, storage, stores, or real feature UI (Phase 2).
- Automated accessibility/contrast tooling — manual checks only.
