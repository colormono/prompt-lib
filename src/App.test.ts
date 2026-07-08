import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/svelte";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App.svelte";
import { addAsset, clearFilters, library } from "./lib/stores";
import type { PromptDraft, ToolDraft } from "./lib/types";

function seedLibrary() {
  addAsset({
    type: "prompt",
    title: "Summarize doc",
    description: "Summarizes a document",
    category: "docs",
    roles: ["pm"],
    sdlcStage: "build",
    prompt: "Summarize {doc}",
    model: "gpt-4",
    slots: {},
  } satisfies PromptDraft);

  const figma = addAsset({
    type: "tool",
    title: "Figma",
    description: "Design tool",
    category: "design",
    roles: ["design"],
    sdlcStage: "design",
    url: "https://figma.com",
  } satisfies ToolDraft);

  return { figma };
}

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    library.set([]);
    clearFilters();
  });

  it("renders the app title and an empty library", () => {
    render(App);
    expect(
      screen.getByRole("heading", { name: "Colormono AI Prompt Manager" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Your library is empty.")).toBeInTheDocument();
  });

  it("narrows the list by search query", async () => {
    seedLibrary();
    render(App);
    expect(screen.getByText("Summarize doc")).toBeInTheDocument();
    expect(screen.getByText("Figma")).toBeInTheDocument();

    const search = screen.getByLabelText("Search");
    await fireEvent.input(search, { target: { value: "figma" } });

    await waitFor(() => {
      expect(screen.queryByText("Summarize doc")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Figma")).toBeInTheDocument();
  });

  it("narrows the list by type", async () => {
    seedLibrary();
    render(App);

    await fireEvent.click(screen.getByRole("button", { name: "Tool (1)" }));

    expect(screen.queryByText("Summarize doc")).not.toBeInTheDocument();
    expect(screen.getByText("Figma")).toBeInTheDocument();
  });

  it("narrows the list to favorites only", async () => {
    const { figma } = seedLibrary();
    render(App);
    const figmaCard = screen.getByText("Figma").closest(".card") as HTMLElement;
    await fireEvent.click(
      within(figmaCard).getByRole("button", { name: "Add to favorites" }),
    );

    await fireEvent.click(
      screen.getByRole("checkbox", { name: "Favorites only" }),
    );

    expect(screen.queryByText("Summarize doc")).not.toBeInTheDocument();
    expect(screen.getByText(figma.title)).toBeInTheDocument();
  });

  it("shows a clear-filters empty state when no assets match", async () => {
    seedLibrary();
    render(App);

    const search = screen.getByLabelText("Search");
    await fireEvent.input(search, { target: { value: "nonexistent" } });

    await waitFor(() => {
      expect(
        screen.getByText("No assets match your filters."),
      ).toBeInTheDocument();
    });

    const clearButtons = screen.getAllByRole("button", {
      name: "Clear filters",
    });
    await fireEvent.click(clearButtons[clearButtons.length - 1]);

    await waitFor(() => {
      expect(screen.getByText("Summarize doc")).toBeInTheDocument();
    });
  });
});
