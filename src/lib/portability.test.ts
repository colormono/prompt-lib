import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildExport,
  diffImport,
  parseImport,
  resolveImport,
  serializeExport,
} from "./portability";
import { STARTER_LIBRARY } from "./starterLibrary";
import type { ToolAsset } from "./types";

const seedLibraryPath = resolve(process.cwd(), "fixtures/seed-library.json");
const seedLibraryRaw = readFileSync(seedLibraryPath, "utf-8");

function makeTool(overrides: Partial<ToolAsset> = {}): ToolAsset {
  return {
    id: "1",
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

describe("portability", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  describe("buildExport / serializeExport", () => {
    it("round-trips through parseImport", () => {
      const assets = [makeTool()];
      const exported = buildExport(assets);
      const serialized = serializeExport(exported);

      const parsed = parseImport(serialized);

      expect(parsed).not.toBe("invalid-json");
      expect(parsed).not.toBe("invalid-shape");
      expect((parsed as { assets: unknown }).assets).toEqual(assets);
    });

    it("stamps version and exportedAt", () => {
      const exported = buildExport([]);
      expect(exported.version).toBe(1);
      expect(() => new Date(exported.exportedAt).toISOString()).not.toThrow();
    });
  });

  describe("parseImport", () => {
    it("returns 'invalid-json' for malformed JSON", () => {
      expect(parseImport("{not json")).toBe("invalid-json");
    });

    it("returns 'invalid-shape' for valid JSON missing an assets array", () => {
      expect(parseImport(JSON.stringify({ foo: "bar" }))).toBe("invalid-shape");
    });

    it("filters out non-asset entries while keeping valid ones", () => {
      const valid = makeTool();
      const raw = JSON.stringify({
        version: 1,
        exportedAt: "2026-01-01T00:00:00.000Z",
        assets: [valid, { not: "an asset" }, null, 42],
      });

      const parsed = parseImport(raw);

      expect(parsed).not.toBe("invalid-json");
      expect(parsed).not.toBe("invalid-shape");
      expect((parsed as { assets: unknown[] }).assets).toEqual([valid]);
    });

    it("parses the seed-library fixture", () => {
      const parsed = parseImport(seedLibraryRaw);

      expect(parsed).not.toBe("invalid-json");
      expect(parsed).not.toBe("invalid-shape");
      const assets = (parsed as { assets: { id: string }[] }).assets;
      expect(assets.length).toBeGreaterThan(0);
      expect(assets.some((asset) => asset.id === "starter-tool-1")).toBe(true);
    });
  });

  describe("diffImport", () => {
    it("treats all incoming assets as new when there are no id collisions", () => {
      const existing = [makeTool({ id: "existing-1" })];
      const incoming = [makeTool({ id: "new-1", title: "Linear" })];

      const diff = diffImport(existing, incoming);

      expect(diff.toAdd).toEqual(incoming);
      expect(diff.conflicts).toEqual([]);
    });

    it("groups id-colliding assets as conflicts", () => {
      const existing = [makeTool({ id: "shared-1", title: "Existing" })];
      const incoming = [makeTool({ id: "shared-1", title: "Incoming" })];

      const diff = diffImport(existing, incoming);

      expect(diff.toAdd).toEqual([]);
      expect(diff.conflicts).toEqual([
        { incoming: incoming[0], existing: existing[0] },
      ]);
    });

    it("splits a mix of new and colliding assets, matching the seed fixture", () => {
      const parsed = parseImport(seedLibraryRaw);
      if (parsed === "invalid-json" || parsed === "invalid-shape") {
        throw new Error("expected seed fixture to parse");
      }

      const diff = diffImport(STARTER_LIBRARY, parsed.assets);

      expect(diff.conflicts).toHaveLength(1);
      expect(diff.conflicts[0].existing.id).toBe("starter-tool-1");
      expect(diff.toAdd.length).toBe(parsed.assets.length - 1);
    });
  });

  describe("resolveImport", () => {
    const existingAsset = makeTool({ id: "shared-1", title: "Existing" });
    const incomingAsset = makeTool({ id: "shared-1", title: "Incoming" });
    const newAsset = makeTool({ id: "new-1", title: "New" });

    function diffFor() {
      return diffImport([existingAsset], [incomingAsset, newAsset]);
    }

    it("keep-mine leaves the existing asset untouched", () => {
      const diff = diffFor();
      const result = resolveImport([existingAsset], diff, {
        "shared-1": "keep-mine",
      });

      expect(result).toContainEqual(existingAsset);
      expect(result).not.toContainEqual(incomingAsset);
      expect(result).toContainEqual(newAsset);
    });

    it("keep-imported replaces the existing asset", () => {
      const diff = diffFor();
      const result = resolveImport([existingAsset], diff, {
        "shared-1": "keep-imported",
      });

      expect(result).not.toContainEqual(existingAsset);
      expect(result).toContainEqual(incomingAsset);
    });

    it("keep-both adds a new asset without touching the existing one", () => {
      const diff = diffFor();
      const result = resolveImport([existingAsset], diff, {
        "shared-1": "keep-both",
      });

      expect(result).toContainEqual(existingAsset);
      const clone = result.find(
        (asset) => asset.id !== existingAsset.id && asset.id !== newAsset.id,
      );
      expect(clone).toBeDefined();
      expect(clone?.title).toBe("Incoming (imported)");
    });

    it("defaults to keep-mine when a conflict has no explicit resolution", () => {
      const diff = diffFor();
      const result = resolveImport([existingAsset], diff, {});

      expect(result).toContainEqual(existingAsset);
      expect(result).not.toContainEqual(incomingAsset);
    });

    it("applies independent resolutions across multiple conflicts", () => {
      const secondExisting = makeTool({ id: "shared-2", title: "Second" });
      const secondIncoming = makeTool({
        id: "shared-2",
        title: "Second incoming",
      });
      const diff = diffImport(
        [existingAsset, secondExisting],
        [incomingAsset, secondIncoming],
      );

      const result = resolveImport([existingAsset, secondExisting], diff, {
        "shared-1": "keep-mine",
        "shared-2": "keep-imported",
      });

      expect(result).toContainEqual(existingAsset);
      expect(result).not.toContainEqual(secondExisting);
      expect(result).toContainEqual(secondIncoming);
    });
  });
});
