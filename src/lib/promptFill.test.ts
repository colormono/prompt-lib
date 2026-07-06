import { describe, expect, it } from "vitest";
import { fillPrompt, parsePromptSegments } from "./promptFill";

describe("parsePromptSegments", () => {
  it("splits text and slot segments in order", () => {
    const segments = parsePromptSegments("Summarize {doc} in {n} bullets");
    expect(segments).toEqual([
      { type: "text", value: "Summarize " },
      { type: "slot", key: "doc" },
      { type: "text", value: " in " },
      { type: "slot", key: "n" },
      { type: "text", value: " bullets" },
    ]);
  });

  it("returns a single text segment when there are no slots", () => {
    expect(parsePromptSegments("No slots here")).toEqual([
      { type: "text", value: "No slots here" },
    ]);
  });

  it("handles a prompt that starts or ends with a slot", () => {
    expect(parsePromptSegments("{doc} summary")).toEqual([
      { type: "slot", key: "doc" },
      { type: "text", value: " summary" },
    ]);
    expect(parsePromptSegments("summary of {doc}")).toEqual([
      { type: "text", value: "summary of " },
      { type: "slot", key: "doc" },
    ]);
  });
});

describe("fillPrompt", () => {
  it("replaces every slot with its value", () => {
    expect(
      fillPrompt("Summarize {doc} in {n} bullets", { doc: "@spec.md", n: "5" }),
    ).toBe("Summarize @spec.md in 5 bullets");
  });

  it("leaves a slot untouched when no value is provided", () => {
    expect(fillPrompt("Summarize {doc}", {})).toBe("Summarize {doc}");
  });
});
