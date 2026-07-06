<script lang="ts">
  import { setViewMode, theme, toggleTheme, viewMode } from "../lib/stores";
  import Button from "./ui/Button.svelte";

  interface Props {
    onNewAsset: () => void;
    onOpenSettings: () => void;
    onOpenAbout: () => void;
  }

  const { onNewAsset, onOpenSettings, onOpenAbout }: Props = $props();

  const appTitle = "Colormo AI Prompt Manager";
  const currentTheme = $derived($theme);
  const currentViewMode = $derived($viewMode);
</script>

<header class="app-header">
  <button
    type="button"
    class="app-header__logo"
    onclick={onOpenAbout}
    aria-label={`About ${appTitle}`}
  >
    <h1 class="app-header__title">{appTitle}</h1>
  </button>

  <div class="app-header__actions">
    <Button size="sm" onclick={onNewAsset}>New asset</Button>

    <fieldset class="app-header__view-toggle">
      <legend class="sr-only">View mode</legend>
      <button
        type="button"
        class="app-header__icon-btn"
        class:app-header__icon-btn--active={currentViewMode === "list"}
        aria-pressed={currentViewMode === "list"}
        aria-label="List view"
        onclick={() => setViewMode("list")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 5h12M3 9h12M3 13h12"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        class="app-header__icon-btn"
        class:app-header__icon-btn--active={currentViewMode === "grid"}
        aria-pressed={currentViewMode === "grid"}
        aria-label="Grid view"
        onclick={() => setViewMode("grid")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="5"
            height="5"
            rx="1"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <rect
            x="10"
            y="3"
            width="5"
            height="5"
            rx="1"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <rect
            x="3"
            y="10"
            width="5"
            height="5"
            rx="1"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <rect
            x="10"
            y="10"
            width="5"
            height="5"
            rx="1"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      </button>
    </fieldset>

    <button
      type="button"
      class="app-header__icon-btn"
      aria-label="Data"
      onclick={onOpenSettings}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          stroke-width="1.6"
        />
      </svg>
    </button>

    <button
      type="button"
      class="app-header__icon-btn"
      aria-pressed={currentTheme === "dark"}
      aria-label={currentTheme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme"}
      onclick={toggleTheme}
    >
      {#if currentTheme === "dark"}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 10.5A6.5 6.5 0 0 1 7.5 3 6.5 6.5 0 1 0 15 10.5Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      {:else}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="3.5" stroke="currentColor" stroke-width="1.5" />
          <path
            d="M9 1.5v2M9 14.5v2M16.5 9h-2M3.5 9h-2M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4M14.3 14.3l-1.4-1.4M5.1 5.1 3.7 3.7"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      {/if}
    </button>
  </div>
</header>

<style>
  .app-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .app-header__logo {
    border-radius: var(--radius-md);
    padding: var(--space-1) var(--space-2);
    margin-inline-start: calc(var(--space-2) * -1);
  }

  .app-header__logo:hover {
    background-color: var(--color-bg-subtle);
  }

  .app-header__title {
    font-size: var(--font-size-lg);
  }

  .app-header__actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .app-header__view-toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    margin: 0;
    padding: var(--space-1);
    border: none;
    border-radius: var(--radius-md);
    background-color: var(--color-bg-subtle);
  }

  .app-header__icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 2rem;
    block-size: 2rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-muted);
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
  }

  .app-header__icon-btn:hover {
    background-color: var(--color-bg-subtle);
    color: var(--color-text);
  }

  .app-header__icon-btn--active {
    background-color: var(--color-surface-raised);
    color: var(--color-accent);
    box-shadow: var(--shadow-sm);
  }
</style>
