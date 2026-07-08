# Colormono AI Prompt Manager

A personal catalog for the prompts, skills, tools, and resources I use to get my work done.

I built Stacks to keep my AI working assets in one place, organized so I can find and reuse them fast. Instead of prompts scattered across notes apps, chat histories, and text files, each asset lives as a card in a searchable, taxonomy-coded library — the way colored tabs work in a real filing drawer.

---

## Development

Built with Svelte + TypeScript + Vite, tested with Vitest, linted and formatted with Biome.

```bash
npm install      # install dependencies
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # serve the production build locally
npm run test     # run the Vitest test suite
npm run lint     # check formatting, imports, and lint rules with Biome
npm run format   # apply Biome formatting
npm run check    # type-check with svelte-check + tsc
```

The `prototype/` folder holds the original static HTML/CSS/JS prototype, kept for reference. It is not part of the Vite app and is not imported by `src/`.

### Design system style guide

While the dev server is running, visit `/#style-guide` to see every design token and UI primitive (`Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Card`, `Badge`, `Modal`) in both light and dark themes. It's an internal reference, not part of the shipped app flow.

---

## Overview

I treat four kinds of assets as first-class citizens, each with its own shape and identity:

| Type | What it holds | Example |
|------|---------------|---------|
| **Prompt** | Reusable prompt text with fillable variables | "Corporate clairvoyant" — pull insights from a document |
| **Skill** | A reusable capability or workflow | "docx report builder" — generate a formatted Word doc |
| **Tool** | An app, connector, extension, or script | "Claude Code" — agentic coding from the terminal |
| **Resource** | Reference material and links | "Prompt engineering guide" |

I want the library to grow with my workflow, so every asset carries enough metadata — tags, status, usage, timestamps — to power search, filtering, and a sense of what's actually working.

---

## Features

### Core content types
- Prompts, skills, tools, and resources are stored as distinct shapes rather than one generic "note."
- Each type gets the fields it needs: prompts carry a model and variables, tools and resources carry links, and everything carries a description.

### Organization & retrieval
- Full-text search across titles, descriptions, bodies, tags, and model names.
- Free-form tagging so one asset can live in many contexts, with filtering by any tag.
- Filtering by type, with live counts for each.
- Favorites, with a filter to show only starred assets.
- Collections that group assets by workflow (e.g. "weekly report pipeline") rather than by type.
- Duplicate detection to keep the library from sprawling.

### Prompt power features
- Variables wrapped in braces (`{topic}`, `{tone}`) become fillable fields at use time.
- One-click copy, either raw or with variables already filled in.
- Versioning to keep a history of a prompt's refinements, with rollback and comparison.
- Chaining to link prompts that feed into one another.
- Model-specific variants of the same prompt.

### Usage & quality tracking
- Usage count and last-used timestamp to surface what's working and what's dead weight.
- Status for each asset: draft, tested, or retired.
- Result notes — what worked, what to tweak, which model handled it best.
- A quick rating beyond status.

### Maintenance & portability
- Export the whole library to JSON to avoid lock-in.
- Import a library from JSON to restore or migrate.
- Reset back to the starter library.
- Review reminders that flag assets left untouched and possibly out of date.

### Collaboration
- Sharing and permissions, for when the library becomes a team resource.