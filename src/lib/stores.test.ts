import { get } from "svelte/store";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PromptDraft, ToolAsset } from "./types";

function makePromptDraft(overrides: Partial<PromptDraft> = {}): PromptDraft {
  return {
    type: "prompt",
    title: "Summarize doc",
    description: "Summarizes a document",
    category: "writing",
    roles: ["pm"],
    sdlcStage: "build",
    prompt: "Summarize {doc} in {n} bullet points",
    model: "gpt-4",
    slots: { doc: "@spec.md", n: "5" },
    ...overrides,
  };
}

function makeStoredTool(overrides: Partial<ToolAsset> = {}): ToolAsset {
  return {
    id: "existing-1",
    type: "tool",
    title: "Figma",
    description: "Design tool",
    category: "design",
    roles: ["design"],
    sdlcStage: "design",
    favorite: false,
    order: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    url: "https://figma.com",
    ...overrides,
  };
}

async function freshStores() {
  vi.resetModules();
  return import("./stores");
}

describe("stores", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("seeds the library from storage on load", async () => {
    const { saveLibrary } = await import("./storage");
    const stored = [makeStoredTool()];
    saveLibrary(stored);

    const { library } = await freshStores();
    expect(get(library)).toEqual(stored);
  });

  it("addAsset assigns id, timestamps, favorite, and order", async () => {
    const { library, addAsset } = await freshStores();

    const created = addAsset(makePromptDraft());

    expect(created.id).toBeTruthy();
    expect(created.favorite).toBe(false);
    expect(created.order).toBe(0);
    expect(created.createdAt).toBe(created.updatedAt);
    expect(get(library)).toHaveLength(1);
    expect(get(library)[0]).toEqual(created);
  });

  it("addAsset increments order for each new asset", async () => {
    const { addAsset } = await freshStores();

    const first = addAsset(makePromptDraft());
    const second = addAsset(makePromptDraft({ title: "Second" }));

    expect(first.order).toBe(0);
    expect(second.order).toBe(1);
  });

  it("addAsset persists to storage", async () => {
    const { addAsset } = await freshStores();
    addAsset(makePromptDraft());

    const { loadLibrary } = await import("./storage");
    expect(loadLibrary()).toHaveLength(1);
  });

  it("updateAsset merges draft fields and bumps updatedAt", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const { library, addAsset, updateAsset } = await freshStores();
    const created = addAsset(makePromptDraft());

    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
    updateAsset(created.id, makePromptDraft({ title: "Updated title" }));
    vi.useRealTimers();

    const updated = get(library)[0];
    expect(updated.title).toBe("Updated title");
    expect(updated.id).toBe(created.id);
    expect(updated.createdAt).toBe(created.createdAt);
    expect(updated.updatedAt).not.toBe(created.createdAt);
  });

  it("deleteAsset removes the asset by id", async () => {
    const { library, addAsset, deleteAsset } = await freshStores();
    const created = addAsset(makePromptDraft());

    deleteAsset(created.id);

    expect(get(library)).toEqual([]);
  });
});
