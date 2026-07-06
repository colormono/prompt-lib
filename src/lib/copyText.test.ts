import { describe, expect, it } from "vitest";
import { getCopyText } from "./copyText";
import type { PromptAsset, SkillAsset, ToolAsset } from "./types";

function makePrompt(overrides: Partial<PromptAsset> = {}): PromptAsset {
  return {
    id: "prompt-1",
    type: "prompt",
    title: "Summarize doc",
    description: "Summarizes a document",
    category: "docs",
    roles: [],
    sdlcStage: "build",
    favorite: false,
    order: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    prompt: "Summarize {doc} in {n} bullets",
    model: "gpt-4",
    slots: { doc: "@spec.md", n: "5" },
    ...overrides,
  };
}

function makeSkill(overrides: Partial<SkillAsset> = {}): SkillAsset {
  return {
    id: "skill-1",
    type: "skill",
    title: "Onboard teammate",
    description: "",
    category: "product",
    roles: [],
    sdlcStage: "operate",
    favorite: false,
    order: 0,
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
    description: "",
    category: "design",
    roles: [],
    sdlcStage: "design",
    favorite: false,
    order: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    url: "https://figma.com",
    ...overrides,
  };
}

describe("getCopyText", () => {
  it("fills the prompt with the asset's own slots by default", () => {
    expect(getCopyText(makePrompt())).toBe("Summarize @spec.md in 5 bullets");
  });

  it("fills the prompt with the provided slot values instead", () => {
    expect(getCopyText(makePrompt(), { doc: "@notes.md", n: "3" })).toBe(
      "Summarize @notes.md in 3 bullets",
    );
  });

  it("returns the body for skills", () => {
    expect(getCopyText(makeSkill())).toBe("Walk through setup instructions");
  });

  it("returns the url for tools", () => {
    expect(getCopyText(makeTool())).toBe("https://figma.com");
  });
});
