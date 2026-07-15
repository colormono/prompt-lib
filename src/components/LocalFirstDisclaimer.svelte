<script lang="ts">
  import {
    DISCLAIMER_BODY,
    DISCLAIMER_TITLE,
    dismissDisclaimer,
    GITHUB_REPO_LABEL,
    GITHUB_REPO_URL,
    isDisclaimerDismissed,
  } from "../lib/disclaimer";


  let mounted = $state(!isDisclaimerDismissed());
  let open = $state(!isDisclaimerDismissed());

  function handleDismiss(): void {
    dismissDisclaimer();
    open = false;
  }

  function handleTransitionEnd(event: TransitionEvent): void {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "opacity") return;
    if (!open) mounted = false;
  }
</script>

{#if mounted}
  <aside
    class="disclaimer"
    class:disclaimer--closed={!open}
    role="note"
    aria-labelledby="local-first-disclaimer-title"
    aria-hidden={!open}
    ontransitionend={handleTransitionEnd}
  >
    <div class="disclaimer__body">
      <h2 id="local-first-disclaimer-title" class="disclaimer__title">
        {DISCLAIMER_TITLE}
      </h2>
      <p class="disclaimer__text">{DISCLAIMER_BODY}</p>

      <a
        class="disclaimer__repo"
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {GITHUB_REPO_LABEL}
      </a>
    </div>
    <button
      type="button"
      class="disclaimer__close"
      onclick={handleDismiss}
      aria-label="Dismiss notice"
      tabindex={open ? 0 : -1}
    >
      ✕
    </button>
  </aside>
{/if}

<style>
  .disclaimer {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: var(--space-3) var(--space-4);
    max-height: 18rem;
    padding: var(--space-4);
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity var(--transition-base),
      transform var(--transition-base),
      max-height var(--transition-base),
      padding var(--transition-base),
      border-color var(--transition-base),
      margin var(--transition-base);
  }

  .disclaimer--closed {
    max-height: 0;
    margin: 0;
    padding-block: 0;
    border-color: transparent;
    opacity: 0;
    transform: translateY(-0.2rem);
    pointer-events: none;
  }

  .disclaimer__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    max-width: 64ch;
    min-width: 0;
  }

  .disclaimer__title {
    margin: 0;
    font-family: var(--font-family-base);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-title);
    line-height: var(--line-height-tight);
    color: var(--color-text);
    text-wrap: balance;
  }

  .disclaimer__text {
    margin: 0;
    font-family: var(--font-family-editorial);
    font-size: 1.0625rem;
    line-height: var(--line-height-relaxed);
    color: var(--color-text);
    text-wrap: pretty;
  }

  .disclaimer__repo {
    align-self: start;
    margin-block-start: var(--space-1);
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    line-height: var(--line-height-normal);
    color: var(--color-accent);
    text-decoration: none;
    text-underline-offset: 0.2em;
  }

  .disclaimer__repo:hover {
    color: var(--color-accent-hover);
    text-decoration: underline;
  }

  .disclaimer__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 2rem;
    block-size: 2rem;
    margin-block-start: -0.2rem;
    margin-inline-end: -0.35rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    line-height: 1;
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
  }

  .disclaimer__close:hover {
    background-color: var(--color-surface-raised);
    color: var(--color-text);
  }

  @media (max-width: 36rem) {
    .disclaimer {
      padding: var(--space-3);
    }

    .disclaimer__body {
      max-width: none;
    }

    .disclaimer__title {
      font-size: var(--font-size-md);
    }
  }
</style>
