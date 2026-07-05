import { describe, expect, it } from "vitest";
import type {
  PromptDraft,
  ResourceDraft,
  SkillDraft,
  ToolDraft,
} from "./types";
import { validateAsset } from "./validation";

function basePromptDraft(overrides: Partial<PromptDraft> = {}): PromptDraft {
  return {
    type: "prompt",
    title: "Summarize doc",
    description: "",
    category: "writing",
    roles: [],
    sdlcStage: "build",
    prompt: "Summarize {doc}",
    model: "",
    slots: {},
    ...overrides,
  };
}

function baseSkillDraft(overrides: Partial<SkillDraft> = {}): SkillDraft {
  return {
    type: "skill",
    title: "Code review",
    description: "",
    category: "engineering",
    roles: [],
    sdlcStage: "build",
    body: "Review the diff for correctness.",
    ...overrides,
  };
}

function baseToolDraft(overrides: Partial<ToolDraft> = {}): ToolDraft {
  return {
    type: "tool",
    title: "Figma",
    description: "",
    category: "design",
    roles: [],
    sdlcStage: "design",
    url: "https://figma.com",
    ...overrides,
  };
}

function baseResourceDraft(
  overrides: Partial<ResourceDraft> = {},
): ResourceDraft {
  return {
    type: "resource",
    title: "Style guide",
    description: "",
    category: "design",
    roles: [],
    sdlcStage: "design",
    url: "https://example.com/guide",
    resourceType: "doc",
    ...overrides,
  };
}

describe("validateAsset", () => {
  it("passes for a valid draft of each type", () => {
    for (const draft of [
      basePromptDraft(),
      baseSkillDraft(),
      baseToolDraft(),
      baseResourceDraft(),
    ]) {
      expect(validateAsset(draft)).toEqual({ valid: true, errors: {} });
    }
  });

  it("rejects a missing title for every type", () => {
    for (const draft of [
      basePromptDraft({ title: "" }),
      baseSkillDraft({ title: "   " }),
      baseToolDraft({ title: "" }),
      baseResourceDraft({ title: "" }),
    ]) {
      const result = validateAsset(draft);
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBeTruthy();
    }
  });

  it("rejects a missing prompt for Prompt", () => {
    const result = validateAsset(basePromptDraft({ prompt: "  " }));
    expect(result.valid).toBe(false);
    expect(result.errors.prompt).toBeTruthy();
  });

  it("rejects a missing body for Skill", () => {
    const result = validateAsset(baseSkillDraft({ body: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors.body).toBeTruthy();
  });

  it("rejects a missing url for Tool", () => {
    const result = validateAsset(baseToolDraft({ url: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors.url).toBeTruthy();
  });

  it("rejects a missing url for Resource", () => {
    const result = validateAsset(baseResourceDraft({ url: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors.url).toBeTruthy();
  });
});
