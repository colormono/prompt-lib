import type { Asset } from "./types";

const STARTER_TIMESTAMP = "2026-01-01T00:00:00.000Z";

/**
 * A small curated library shown after a Reset — one asset per type with
 * realistic content, so the app never feels empty right after onboarding.
 */
export const STARTER_LIBRARY: Asset[] = [
  {
    id: "starter-prompt-1",
    type: "prompt",
    title: "Summarize a document",
    description: "Condenses a long document into key bullet points.",
    category: "writing",
    roles: ["pm", "writer"],
    sdlcStage: "discover",
    favorite: false,
    order: 0,
    createdAt: STARTER_TIMESTAMP,
    updatedAt: STARTER_TIMESTAMP,
    prompt:
      "Summarize {doc} in {n} bullet points, focused on decisions and open questions.",
    model: "gpt-4",
    slots: { doc: "@meeting-notes.md", n: "5" },
  },
  {
    id: "starter-skill-1",
    type: "skill",
    title: "Write a pull request description",
    description: "Turns a diff and commit history into a clear PR summary.",
    category: "engineering",
    roles: ["engineer"],
    sdlcStage: "ship",
    favorite: false,
    order: 1,
    createdAt: STARTER_TIMESTAMP,
    updatedAt: STARTER_TIMESTAMP,
    body: "Read the diff and commit messages, then write a PR description with a Summary and a Test plan section, focused on why the change was made.",
  },
  {
    id: "starter-tool-1",
    type: "tool",
    title: "Figma",
    description: "Design and prototyping tool.",
    category: "design",
    roles: ["design"],
    sdlcStage: "design",
    favorite: false,
    order: 2,
    createdAt: STARTER_TIMESTAMP,
    updatedAt: STARTER_TIMESTAMP,
    url: "https://figma.com",
  },
  {
    id: "starter-resource-1",
    type: "resource",
    title: "Refactoring: Improving the Design of Existing Code",
    description: "Reference for identifying and fixing code smells.",
    category: "engineering",
    roles: ["engineer"],
    sdlcStage: "build",
    favorite: false,
    order: 3,
    createdAt: STARTER_TIMESTAMP,
    updatedAt: STARTER_TIMESTAMP,
    url: "https://martinfowler.com/books/refactoring.html",
    resourceType: "doc",
  },
];
