import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadLibrary, StorageWriteError, saveLibrary } from "./storage";
import type { ToolAsset } from "./types";

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

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty library when nothing is stored", () => {
    expect(loadLibrary()).toEqual([]);
  });

  it("round-trips a saved library", () => {
    const assets = [makeTool()];
    saveLibrary(assets);
    expect(loadLibrary()).toEqual(assets);
  });

  it("falls back to an empty library on corrupt JSON", () => {
    localStorage.setItem("prompt-lib:assets", "{not json");
    expect(loadLibrary()).toEqual([]);
  });

  it("falls back to an empty library when stored data isn't an array", () => {
    localStorage.setItem("prompt-lib:assets", JSON.stringify({ foo: "bar" }));
    expect(loadLibrary()).toEqual([]);
  });

  it("filters out malformed entries while keeping valid ones", () => {
    const valid = makeTool();
    localStorage.setItem(
      "prompt-lib:assets",
      JSON.stringify([valid, { not: "an asset" }, null, 42]),
    );
    expect(loadLibrary()).toEqual([valid]);
  });

  it("throws a StorageWriteError when localStorage.setItem fails", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("quota exceeded");
      });

    expect(() => saveLibrary([makeTool()])).toThrow(StorageWriteError);

    spy.mockRestore();
  });
});
