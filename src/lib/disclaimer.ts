const STORAGE_KEY = "prompt-lib:disclaimer-dismissed";

export const GITHUB_REPO_URL = "https://github.com/colormono/prompt-lib";
export const GITHUB_REPO_LABEL = "github.com/colormono/prompt-lib";

export const DISCLAIMER_TITLE = "A local library you can own";

export const DISCLAIMER_BODY =
  "A personal catalog to get work done — prompts, skills, tools, and resources in one place. Your library stays on this device. Use the free starter set, grow your own catalog, or fork the open-source project and reshape it.";



export function isDisclaimerDismissed(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "1";
}

export function dismissDisclaimer(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, "1");
}
