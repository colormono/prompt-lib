# Phase 1 — Design System · Requirements

## Goal

Build the design system foundation from scratch: tokens, a global reset, and
a small set of UI primitives. This phase ships no feature UI — it exists so
Phase 2 (data model & core CRUD) has styled building blocks to compose
instead of writing one-off CSS per component.

## Scope

In scope:

- Design tokens in `styles/tokens.css`: color, type, spacing, radii, shadows.
- Both **light and dark themes**, switchable via a root `data-theme`
  attribute (not just light with dark stubbed).
- A `global.css` reset + base element styles built on the tokens.
- UI primitives in `components/ui/`, extended beyond the roadmap's original
  five because Phase 2's typed asset form needs them:
  - `Button`
  - `Input`
  - `Textarea`
  - `Select`
  - `Checkbox`
  - `Card`
  - `Badge` / `Tag`
  - `Modal`
- A temporary in-app style-guide route (e.g. `/dev/style-guide` or a
  dev-only view swapped in via `App.svelte`) that renders every token swatch
  and every primitive in its variants/states, used to visually verify the
  system as it's built. **This route is kept permanently** as an internal
  reference (per stakeholder decision), not removed before merge.
- Accessible-by-default primitives: visible focus states, sufficient color
  contrast in both themes, semantic markup (`<button>`, `<label>`, native
  `role`s where applicable).

Out of scope (later phases):

- Any data model, storage, or stores (Phase 2).
- Any real feature UI (asset cards, forms, search, filters) — the style
  guide route is not a feature.
- Automated Vitest coverage for primitive interaction behavior (see
  Decisions — deferred to when primitives are exercised by real features).

## Decisions

- **Theme support:** Both light and dark themes ship fully implemented in
  this phase, toggle via a root `data-theme="light" | "dark"` attribute, all
  primitive styling driven by token custom properties (no hard-coded colors
  in components).
- **Primitive set:** Extended beyond the roadmap's original five (Button,
  Input, Card, Badge/Tag, Modal) to include `Textarea`, `Select`, and
  `Checkbox`, since Phase 2's per-type asset form needs multi-line text,
  enum pickers, and boolean fields. All eight primitives ship in this
  phase so Phase 2 only composes them.
- **Verification approach:** A temporary-in-name but permanently-kept style
  guide page/route renders all tokens and primitive variants together. It's
  reachable only in dev (not linked from the real app shell) but stays in
  the codebase as a living reference for future primitives.
- **Testing depth:** No Vitest interaction tests for primitives in this
  phase (e.g. no dedicated `Button.test.ts` for click events). Behavior gets
  covered indirectly once Phase 2 exercises these components in real forms
  and flows. This phase relies on the style guide + manual/visual checks.
- **Styling mechanism:** CSS custom properties for tokens; Svelte component
  `<style>` blocks (scoped) for primitives, no CSS-in-JS or utility
  framework, per `tech-stack.md`.

## Context

- `specs/mission.md`: local-first, single-user asset catalog; no
  backend/accounts; fast retrieval is core.
- `specs/tech-stack.md`: Svelte + TS + Vite; design system built from
  scratch (not reusing the prototype's `globals.css`); tokens-first,
  light/dark via root attribute; small primitive set; accessible by
  default; suggested `styles/` and `components/ui/` layout.
- `specs/roadmap.md`: Phase 0 (scaffold) is done. Phase 1 = design system
  (this phase). Phase 2 = data model & core CRUD, which will consume these
  primitives for its typed asset form.
- `specs/2026-07-05-phase-0-scaffold/`: prior phase's spec docs, used as the
  structural template for this one (`plan.md` numbered task groups,
  `requirements.md` scope/decisions/context, `validation.md` checklist).
