import { beforeEach, describe, expect, it } from "vitest";
import { dismissDisclaimer, isDisclaimerDismissed } from "./disclaimer";

describe("disclaimer", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("is not dismissed by default", () => {
    expect(isDisclaimerDismissed()).toBe(false);
  });

  it("persists dismissal", () => {
    dismissDisclaimer();
    expect(isDisclaimerDismissed()).toBe(true);
  });

  it("ignores other stored values", () => {
    localStorage.setItem("prompt-lib:disclaimer-dismissed", "true");
    expect(isDisclaimerDismissed()).toBe(false);
  });
});
