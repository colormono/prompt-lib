import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App.svelte";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the app title and an empty library", () => {
    render(App);
    expect(
      screen.getByRole("heading", { name: "Colormo AI Prompt Manager" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Your library is empty.")).toBeInTheDocument();
  });
});
