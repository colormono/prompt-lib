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

  it("toggleFavorite flips the flag and bumps updatedAt", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const { library, addAsset, toggleFavorite } = await freshStores();
    const created = addAsset(makePromptDraft());

    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
    toggleFavorite(created.id);
    vi.useRealTimers();

    const toggled = get(library)[0];
    expect(toggled.favorite).toBe(true);
    expect(toggled.updatedAt).not.toBe(created.updatedAt);
  });

  describe("portability", () => {
    it("exportLibrary reflects the current library", async () => {
      const { addAsset, exportLibrary } = await freshStores();
      const created = addAsset(makePromptDraft());

      const exported = exportLibrary();

      expect(exported.version).toBe(1);
      expect(exported.assets).toEqual([created]);
    });

    it("importLibrary replaces and persists the library", async () => {
      const { library, importLibrary } = await freshStores();
      const incoming = [makeStoredTool()];

      importLibrary(incoming);

      expect(get(library)).toEqual(incoming);
      const { loadLibrary } = await import("./storage");
      expect(loadLibrary()).toEqual(incoming);
    });

    it("resetToStarterLibrary replaces and persists the starter set", async () => {
      const { library, addAsset, resetToStarterLibrary } = await freshStores();
      addAsset(makePromptDraft());

      resetToStarterLibrary();

      const { STARTER_LIBRARY } = await import("./starterLibrary");
      expect(get(library)).toEqual(STARTER_LIBRARY);
      const { loadLibrary } = await import("./storage");
      expect(loadLibrary()).toEqual(STARTER_LIBRARY);
    });
  });

  describe("filters", () => {
    it("visibleAssets narrows by search query", async () => {
      const { visibleAssets, addAsset, setSearchQuery } = await freshStores();
      addAsset(
        makePromptDraft({
          title: "Summarize doc",
          description: "",
          prompt: "Condense a document",
        }),
      );
      addAsset(
        makePromptDraft({
          title: "Draft email",
          description: "",
          prompt: "Write a polite email",
        }),
      );

      setSearchQuery("summarize");

      expect(get(visibleAssets)).toHaveLength(1);
      expect(get(visibleAssets)[0].title).toBe("Summarize doc");
    });

    it("visibleAssets narrows by type", async () => {
      const { visibleAssets, addAsset, setActiveType } = await freshStores();
      addAsset(makePromptDraft());
      addAsset(makeStoredTool());

      setActiveType("tool");

      expect(get(visibleAssets)).toHaveLength(1);
      expect(get(visibleAssets)[0].type).toBe("tool");
    });

    it("visibleAssets requires all active roles (AND)", async () => {
      const { visibleAssets, addAsset, toggleActiveRole } = await freshStores();
      addAsset(makePromptDraft({ roles: ["pm"] }));
      addAsset(makePromptDraft({ roles: ["pm", "design"], title: "Second" }));

      toggleActiveRole("pm");
      toggleActiveRole("design");

      expect(get(visibleAssets)).toHaveLength(1);
      expect(get(visibleAssets)[0].title).toBe("Second");
    });

    it("visibleAssets matches any active category (OR)", async () => {
      const { visibleAssets, addAsset, toggleActiveCategory } =
        await freshStores();
      addAsset(makePromptDraft({ category: "writing" }));
      addAsset(makePromptDraft({ category: "design", title: "Second" }));
      addAsset(makePromptDraft({ category: "people", title: "Third" }));

      toggleActiveCategory("writing");
      toggleActiveCategory("design");

      expect(get(visibleAssets).map((asset) => asset.title)).toEqual([
        "Summarize doc",
        "Second",
      ]);
    });

    it("visibleAssets narrows to favorites only", async () => {
      const { visibleAssets, addAsset, toggleFavorite, setFavoritesOnly } =
        await freshStores();
      const created = addAsset(makePromptDraft());
      addAsset(makePromptDraft({ title: "Not favorited" }));
      toggleFavorite(created.id);

      setFavoritesOnly(true);

      expect(get(visibleAssets)).toHaveLength(1);
      expect(get(visibleAssets)[0].id).toBe(created.id);
    });

    it("clearFilters resets every filter dimension", async () => {
      const {
        visibleAssets,
        addAsset,
        setSearchQuery,
        setActiveType,
        toggleActiveRole,
        toggleActiveCategory,
        setFavoritesOnly,
        clearFilters,
      } = await freshStores();
      addAsset(makePromptDraft());
      addAsset(makeStoredTool());

      setSearchQuery("nope");
      setActiveType("tool");
      toggleActiveRole("pm");
      toggleActiveCategory("design");
      setFavoritesOnly(true);
      clearFilters();

      expect(get(visibleAssets)).toHaveLength(2);
    });
  });
});
