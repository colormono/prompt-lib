<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    open?: boolean;
    title?: string;
    children: Snippet;
    footer?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    title,
    children,
    footer,
    onclose,
  }: Props = $props();

  let dialogEl: HTMLDivElement | undefined = $state();
  let previouslyFocused: HTMLElement | null = null;

  const autoId = $props.id();
  const titleId = $derived(title ? `modal-title-${autoId}` : undefined);

  function close() {
    open = false;
    onclose?.();
  }

  function getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "Tab" && dialogEl) {
      const focusable = getFocusable(dialogEl);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) close();
  }

  $effect(() => {
    if (!open) return;

    previouslyFocused = document.activeElement as HTMLElement | null;
    document.addEventListener("keydown", handleKeydown);

    queueMicrotask(() => {
      if (!dialogEl) return;
      const focusable = getFocusable(dialogEl);
      (focusable[0] ?? dialogEl).focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      previouslyFocused?.focus();
    };
  });
</script>

{#if open}
  <!-- Escape-to-close is handled globally via the document keydown listener
       above; the backdrop only needs the click handler for pointer users. -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled globally via document keydown; backdrop click is a pointer-only convenience -->
  <!-- biome-ignore lint/a11y/noStaticElementInteractions: backdrop is a non-semantic overlay, not an interactive control -->
  <div class="modal-backdrop" onclick={handleBackdropClick}>
    <div
      bind:this={dialogEl}
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabindex="-1"
    >
      {#if title}
        <div class="modal__header">
          <h2 class="modal__title" id={titleId}>{title}</h2>
          <button
            type="button"
            class="modal__close"
            onclick={close}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
      {/if}
      <div class="modal__body">{@render children()}</div>
      {#if footer}
        <div class="modal__footer">{@render footer()}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
    background-color: rgba(12, 13, 17, 0.5);
    z-index: 100;
  }

  .modal {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 32rem;
    max-height: calc(100vh - var(--space-8));
    overflow: hidden;
    background-color: var(--color-surface-raised);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
  }

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    flex-shrink: 0;
    padding: var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .modal__title {
    font-size: var(--font-size-lg);
  }

  .modal__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 2rem;
    block-size: 2rem;
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
  }

  .modal__close:hover {
    background-color: var(--color-bg-subtle);
    color: var(--color-text);
  }

  .modal__body {
    flex: 1;
    min-height: 0;
    padding: var(--space-4);
    overflow-y: auto;
  }

  .modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    flex-shrink: 0;
    padding: var(--space-4);
    border-top: 1px solid var(--color-border);
  }
</style>
