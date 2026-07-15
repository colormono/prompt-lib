<script lang="ts">
  import { GITHUB_REPO_URL } from "../lib/disclaimer";
  import { setViewMode, theme, toggleTheme, viewMode } from "../lib/stores";
  import Button from "./ui/Button.svelte";


  interface Props {
    onNewAsset: () => void;
    onOpenSettings: () => void;
    onOpenAbout: () => void;
  }

  const { onNewAsset, onOpenSettings, onOpenAbout }: Props = $props();

  const appTitle = "Prompt Manager";
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
        title="List view"
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
        title="Grid view"
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
      aria-label="Settings"
      title="Settings"
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

    <a
      class="app-header__icon-btn"
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open project on GitHub"
      title="GitHub"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.31.678.92.678 1.855 0 1.338-.012 2.417-.012 2.745 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z"
        />
      </svg>
    </a>

    <button
      type="button"
      class="app-header__icon-btn"
      aria-pressed={currentTheme === "dark"}

      aria-label={currentTheme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme"}
      title={currentTheme === "dark"
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
    min-height: 3.25rem;
    padding: var(--space-3) var(--space-6);
    background-color: color-mix(in srgb, var(--color-bg) 92%, transparent);
    backdrop-filter: blur(8px);
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
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-title);
  }

  .app-header__actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .app-header__view-toggle {
    display: none;
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
    text-decoration: none;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
  }

  .app-header__icon-btn:hover {
    background-color: var(--color-bg-subtle);
    color: var(--color-text);
  }

  a.app-header__icon-btn:hover {
    color: var(--color-text);
  }

  .app-header__icon-btn--active {
    background-color: var(--color-surface-raised);
    color: var(--color-text);
    box-shadow: var(--shadow-sm);
  }
</style>
