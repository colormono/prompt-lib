import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { get } from "svelte/store";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { STARTER_LIBRARY } from "../lib/starterLibrary";
import { addAsset, clearFilters, library } from "../lib/stores";
import type { PromptDraft, ToolDraft } from "../lib/types";
import SettingsPanel from "./SettingsPanel.svelte";

function seedLibrary() {
  addAsset({
    type: "prompt",
    title: "Summarize doc",
    description: "Summarizes a document",
    category: "writing",
    roles: ["pm"],
    sdlcStage: "build",
    prompt: "Summarize {doc}",
    model: "gpt-4",
    slots: {},
  } satisfies PromptDraft);
}

function seedConflictingTool() {
  return addAsset({
    type: "tool",
    title: "Figma",
    description: "Design tool",
    category: "design",
    roles: ["design"],
    sdlcStage: "design",
    url: "https://figma.com",
  } satisfies ToolDraft);
}

async function selectFile(input: HTMLElement, contents: string) {
  const file = new File([contents], "library.json", {
    type: "application/json",
  });
  await fireEvent.change(input, { target: { files: [file] } });
}

describe("SettingsPanel", () => {
  beforeEach(() => {
    localStorage.clear();
    library.set([]);
    clearFilters();
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:mock-url"),
      revokeObjectURL: vi.fn(),
    });
  });

  it("renders Export, Import, and Reset sections when open", () => {
    render(SettingsPanel, { open: true });

    expect(screen.getByRole("heading", { name: "Export" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Import" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Reset" })).toBeInTheDocument();
  });

  it("exporting the library does not throw", async () => {
    seedLibrary();
    render(SettingsPanel, { open: true });

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    await fireEvent.click(
      screen.getByRole("button", { name: "Export library" }),
    );

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("importing a file with only new assets adds them on confirm", async () => {
    render(SettingsPanel, { open: true });

    const fileContents = JSON.stringify({
      version: 1,
      exportedAt: "2026-01-01T00:00:00.000Z",
      assets: [
        {
          id: "new-1",
          type: "tool",
          title: "Linear",
          description: "Issue tracker",
          category: "engineering",
          roles: ["engineer"],
          sdlcStage: "build",
          favorite: false,
          order: 0,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
          url: "https://linear.app",
        },
      ],
    });

    await selectFile(screen.getByLabelText("Library file"), fileContents);

    await waitFor(() => {
      expect(
        screen.getByText("1 new asset will be added."),
      ).toBeInTheDocument();
    });

    await fireEvent.click(
      screen.getByRole("button", { name: "Confirm import" }),
    );

    await waitFor(() => {
      expect(screen.getByText("Import complete.")).toBeInTheDocument();
    });
    expect(get(library).map((asset) => asset.title)).toEqual(["Linear"]);
  });

  it("requires a resolution per conflict before enabling confirm, then applies it", async () => {
    const figma = seedConflictingTool();
    render(SettingsPanel, { open: true });

    const fileContents = JSON.stringify({
      version: 1,
      exportedAt: "2026-01-01T00:00:00.000Z",
      assets: [
        {
          ...figma,
          title: "Figma (imported)",
          description: "Updated design tool",
        },
      ],
    });

    await selectFile(screen.getByLabelText("Library file"), fileContents);

    const confirmButton = await screen.findByRole("button", {
      name: "Confirm import",
    });
    expect(confirmButton).toBeDisabled();

    await fireEvent.click(screen.getByRole("radio", { name: "Keep imported" }));
    expect(confirmButton).not.toBeDisabled();

    await fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText("Import complete.")).toBeInTheDocument();
    });
    const merged = get(library).find((asset) => asset.id === figma.id);
    expect(merged?.title).toBe("Figma (imported)");
  });

  it("reset requires confirmation before replacing the library", async () => {
    seedLibrary();
    render(SettingsPanel, { open: true });

    await fireEvent.click(
      screen.getByRole("button", { name: "Reset to starter library" }),
    );
    await fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(get(library).map((asset) => asset.title)).toEqual(["Summarize doc"]);

    await fireEvent.click(
      screen.getByRole("button", { name: "Reset to starter library" }),
    );
    await fireEvent.click(
      screen.getByRole("button", { name: "Reset library" }),
    );

    await waitFor(() => {
      expect(get(library)).toEqual(STARTER_LIBRARY);
    });
  });
});
