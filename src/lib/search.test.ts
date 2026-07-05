import { describe, expect, it } from "vitest";
import {
  countByType,
  distinctCategories,
  distinctRoles,
  EMPTY_FILTERS,
  filterAssets,
  matchesCategories,
  matchesFavorite,
  matchesQuery,
  matchesRoles,
  matchesType,
  searchableText,
} from "./search";
import type { Asset, PromptAsset, SkillAsset, ToolAsset } from "./types";

function makePrompt(overrides: Partial<PromptAsset> = {}): PromptAsset {
  return {
    id: "prompt-1",
    type: "prompt",
    title: "Summarize doc",
    description: "Summarizes a long document",
    category: "writing",
    roles: ["pm", "writer"],
    sdlcStage: "build",
    favorite: false,
    order: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    prompt: "Summarize {doc} in {n} bullet points",
    model: "gpt-4",
    slots: {},
    ...overrides,
  };
}

function makeSkill(overrides: Partial<SkillAsset> = {}): SkillAsset {
  return {
    id: "skill-1",
    type: "skill",
    title: "Onboard teammate",
    description: "Steps to onboard a new hire",
    category: "people",
    roles: ["manager"],
    sdlcStage: "operate",
    favorite: true,
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    body: "Walk through setup instructions",
    ...overrides,
  };
}

function makeTool(overrides: Partial<ToolAsset> = {}): ToolAsset {
  return {
    id: "tool-1",
    type: "tool",
    title: "Figma",
    description: "Design tool",
    category: "design",
    roles: ["design", "pm"],
    sdlcStage: "design",
    favorite: false,
    order: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    url: "https://figma.com",
    ...overrides,
  };
}

describe("searchableText", () => {
  it("includes title, description, category, roles, and type-specific fields", () => {
    const text = searchableText(makePrompt());
    expect(text).toContain("summarize doc");
    expect(text).toContain("summarizes a long document");
    expect(text).toContain("writing");
    expect(text).toContain("pm");
    expect(text).toContain("writer");
    expect(text).toContain("summarize {doc} in {n} bullet points");
    expect(text).toContain("gpt-4");
  });

  it("includes skill body and tool url", () => {
    expect(searchableText(makeSkill())).toContain("walk through setup");
    expect(searchableText(makeTool())).toContain("https://figma.com");
  });
});

describe("matchesQuery", () => {
  it("matches case-insensitively across searchable fields", () => {
    expect(matchesQuery(makePrompt(), "SUMMARIZE")).toBe(true);
    expect(matchesQuery(makePrompt(), "gpt-4")).toBe(true);
    expect(matchesQuery(makePrompt(), "nope")).toBe(false);
  });

  it("treats an empty or whitespace query as matching everything", () => {
    expect(matchesQuery(makePrompt(), "")).toBe(true);
    expect(matchesQuery(makePrompt(), "   ")).toBe(true);
  });
});

describe("matchesType", () => {
  it("matches when type is null or equal to the asset's type", () => {
    expect(matchesType(makePrompt(), null)).toBe(true);
    expect(matchesType(makePrompt(), "prompt")).toBe(true);
    expect(matchesType(makePrompt(), "tool")).toBe(false);
  });
});

describe("matchesRoles", () => {
  it("requires every selected role to be present (AND)", () => {
    const tool = makeTool();
    expect(matchesRoles(tool, [])).toBe(true);
    expect(matchesRoles(tool, ["design"])).toBe(true);
    expect(matchesRoles(tool, ["design", "pm"])).toBe(true);
    expect(matchesRoles(tool, ["design", "writer"])).toBe(false);
  });
});

describe("matchesCategories", () => {
  it("matches if the asset's single category is any of the selected ones (OR)", () => {
    const tool = makeTool({ category: "design" });
    expect(matchesCategories(tool, [])).toBe(true);
    expect(matchesCategories(tool, ["design"])).toBe(true);
    expect(matchesCategories(tool, ["writing", "design"])).toBe(true);
    expect(matchesCategories(tool, ["writing", "people"])).toBe(false);
  });
});

describe("matchesFavorite", () => {
  it("only filters when favoritesOnly is true", () => {
    expect(matchesFavorite(makePrompt({ favorite: false }), false)).toBe(true);
    expect(matchesFavorite(makePrompt({ favorite: false }), true)).toBe(false);
    expect(matchesFavorite(makePrompt({ favorite: true }), true)).toBe(true);
  });
});

describe("filterAssets", () => {
  const assets: Asset[] = [makePrompt(), makeSkill(), makeTool()];

  it("returns everything when filters are empty", () => {
    expect(filterAssets(assets, EMPTY_FILTERS)).toEqual(assets);
  });

  it("combines every filter dimension with AND", () => {
    const result = filterAssets(assets, {
      ...EMPTY_FILTERS,
      query: "design",
      type: "tool",
      roles: ["pm"],
      categories: ["design"],
      favoritesOnly: false,
    });
    expect(result).toEqual([makeTool()]);
  });

  it("excludes non-favorites when favoritesOnly is set", () => {
    const result = filterAssets(assets, {
      ...EMPTY_FILTERS,
      favoritesOnly: true,
    });
    expect(result).toEqual([makeSkill()]);
  });
});

describe("countByType", () => {
  it("counts assets per type, defaulting missing types to zero", () => {
    const counts = countByType([makePrompt(), makeSkill(), makeTool()]);
    expect(counts).toEqual({ prompt: 1, skill: 1, tool: 1, resource: 0 });
  });
});

describe("distinctRoles", () => {
  it("returns sorted, de-duplicated roles across the library", () => {
    const assets = [makePrompt(), makeSkill(), makeTool()];
    expect(distinctRoles(assets)).toEqual([
      "design",
      "manager",
      "pm",
      "writer",
    ]);
  });
});

describe("distinctCategories", () => {
  it("returns sorted, de-duplicated categories, ignoring blanks", () => {
    const assets = [makePrompt(), makeSkill(), makeTool({ category: "" })];
    expect(distinctCategories(assets)).toEqual(["people", "writing"]);
  });
});
