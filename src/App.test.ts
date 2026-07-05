import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import App from "./App.svelte";

describe("App", () => {
  it("renders the scaffold ready marker", () => {
    render(App);
    expect(screen.getByTestId("scaffold-marker")).toHaveTextContent(
      "scaffold ready",
    );
  });
});
