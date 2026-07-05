<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    icon?: Snippet;
    children: Snippet;
  }

  let {
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    icon,
    children,
    onclick,
    ...rest
  }: Props = $props();
</script>

<button
  {type}
  {disabled}
  {onclick}
  class="btn btn--{variant} btn--{size}"
  {...rest}
>
  {#if icon}
    <span class="btn__icon">{@render icon()}</span>
  {/if}
  {@render children()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-tight);
    white-space: nowrap;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      color var(--transition-fast),
      opacity var(--transition-fast);
  }

  .btn:disabled {
    opacity: 0.5;
  }

  .btn__icon {
    display: inline-flex;
    align-items: center;
  }

  /* Sizes */
  .btn--sm {
    padding: var(--space-1) var(--space-3);
    font-size: var(--font-size-sm);
  }

  .btn--md {
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-base);
  }

  .btn--lg {
    padding: var(--space-3) var(--space-6);
    font-size: var(--font-size-md);
  }

  /* Variants */
  .btn--primary {
    background-color: var(--color-accent);
    color: var(--color-text-on-brand);
  }

  .btn--primary:not(:disabled):hover {
    background-color: var(--color-accent-hover);
  }

  .btn--primary:not(:disabled):active {
    background-color: var(--color-accent-active);
  }

  .btn--secondary {
    background-color: var(--color-surface);
    border-color: var(--color-border-strong);
    color: var(--color-text);
  }

  .btn--secondary:not(:disabled):hover {
    background-color: var(--color-bg-subtle);
  }

  .btn--ghost {
    background-color: transparent;
    color: var(--color-text);
  }

  .btn--ghost:not(:disabled):hover {
    background-color: var(--color-bg-subtle);
  }

  .btn--danger {
    background-color: var(--color-danger);
    color: var(--color-text-on-danger);
  }

  .btn--danger:not(:disabled):hover {
    opacity: 0.9;
  }
</style>
