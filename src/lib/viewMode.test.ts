import { beforeEach, describe, expect, it } from "vitest";
import { getInitialViewMode, getStoredViewMode, setViewMode } from "./viewMode";

describe("viewMode", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to list when nothing is stored", () => {
    expect(getStoredViewMode()).toBeNull();
    expect(getInitialViewMode()).toBe("list");
  });

  it("round-trips a stored view mode", () => {
    setViewMode("grid");
    expect(getStoredViewMode()).toBe("grid");
    expect(getInitialViewMode()).toBe("grid");
  });

  it("ignores invalid stored values", () => {
    localStorage.setItem("prompt-lib:view-mode", "cards");
    expect(getStoredViewMode()).toBeNull();
    expect(getInitialViewMode()).toBe("list");
  });
});
