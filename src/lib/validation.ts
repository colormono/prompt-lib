import type { AssetDraft } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

/**
 * Validates a form draft before create/edit. Returns field-level error
 * messages keyed by field name so the form can show them inline.
 */
export function validateAsset(draft: AssetDraft): ValidationResult {
  const errors: Record<string, string> = {};

  if (isBlank(draft.title)) {
    errors.title = "Title is required.";
  }

  switch (draft.type) {
    case "prompt":
      if (isBlank(draft.prompt)) {
        errors.prompt = "Prompt text is required.";
      }
      break;
    case "skill":
      if (isBlank(draft.body)) {
        errors.body = "Instructions are required.";
      }
      break;
    case "tool":
    case "resource":
      if (isBlank(draft.url)) {
        errors.url = "URL is required.";
      }
      break;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
