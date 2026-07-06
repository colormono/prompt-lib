/** A parsed piece of a prompt: literal text, or a fillable `{slot}` placeholder. */
export type PromptSegment =
  | { type: "text"; value: string }
  | { type: "slot"; key: string };

const SLOT_PATTERN = /\{([^{}]+)\}/g;

/** Splits a prompt into literal text and `{slot}` placeholder segments, in order. */
export function parsePromptSegments(prompt: string): PromptSegment[] {
  const segments: PromptSegment[] = [];
  let lastIndex = 0;

  for (const match of prompt.matchAll(SLOT_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", value: prompt.slice(lastIndex, index) });
    }
    segments.push({ type: "slot", key: match[1] });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < prompt.length) {
    segments.push({ type: "text", value: prompt.slice(lastIndex) });
  }

  return segments;
}

/** Replaces every `{slot}` placeholder with its value, leaving unmatched slots untouched. */
export function fillPrompt(
  prompt: string,
  values: Record<string, string>,
): string {
  return prompt.replace(SLOT_PATTERN, (match, key) =>
    key in values ? values[key] : match,
  );
}
