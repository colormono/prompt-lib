import { fillPrompt } from "./promptFill";
import type { Asset } from "./types";

/**
 * The most useful raw text to copy for an asset: the prompt (with slots
 * filled from `slotValues`, falling back to the asset's own slot values)
 * for prompts, the instructions for skills, and the URL for tools/resources.
 */
export function getCopyText(
  asset: Asset,
  slotValues?: Record<string, string>,
): string {
  switch (asset.type) {
    case "prompt":
      return fillPrompt(asset.prompt, slotValues ?? asset.slots);
    case "skill":
      return asset.body;
    case "tool":
    case "resource":
      return asset.url;
  }
}
