# Mission

## What this is

Colormono's AI Prompt Manager is a **personal catalog** for the prompts, skills,
tools, and resources I use to get my work done. One local-first library where my
AI working assets live as searchable, taxonomy-coded cards instead of being
scattered across notes apps, chat histories, and text files.

## Who it's for

One user: me. No accounts, no server, no collaboration. The app runs on my own
machine and my data never leaves it unless I explicitly export it.

## Guiding principles

- **Local-first.** All data lives in the browser (localStorage/IndexedDB). The
  app is fully usable offline and owns no remote state.
- **No lock-in.** The whole library exports to JSON and imports back. My data is
  portable at all times.
- **Four first-class asset types.** Prompt, Skill, Tool, and Resource each have
  their own shape and fields rather than being flattened into one generic note.
- **Fast retrieval over everything.** Full-text search, free-form tags, and
  type filters are core, not add-ons — finding an asset should take seconds.
- **Grows with my workflow.** Rich metadata (tags, status, usage, timestamps)
  so the library reflects what's actually working.
- **Quality over quantity.** Duplicate detection and review reminders keep the
  library from sprawling.

## The four asset types

| Type         | What it holds                                   |
| ------------ | ----------------------------------------------- |
| **Prompt**   | Reusable prompt text with fillable variables    |
| **Skill**    | A reusable capability or workflow               |
| **Tool**     | An app, connector, extension, or script         |
| **Resource** | Reference material and links                    |

## Success criteria

- I stop keeping prompts in scratch files — this becomes the single source.
- Any asset is findable in seconds via search, tag, or type filter.
- I can copy a prompt (raw or with variables filled) in one click.
- I can back up and restore the entire library from a single JSON file.

## Explicit non-goals (for now)

- No multi-user accounts, sharing, or permissions.
- No cloud sync or remote backend.
- No AI-model execution inside the app — it catalogs assets, it doesn't run them.
