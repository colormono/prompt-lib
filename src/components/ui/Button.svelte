<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "action";
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
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-body);
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

  .btn--sm {
    padding: 0.4em 0.85em;
    font-size: var(--font-size-sm);
  }

  .btn--md {
    padding: 0.78em 1.35em 0.8em;
    font-size: var(--font-size-base);
  }

  .btn--lg {
    padding: 0.85em 1.5em;
    font-size: var(--font-size-md);
  }

  /* Ink on parchment — highest-contrast CTA */
  .btn--primary {
    background-color: var(--color-accent-solid);
    color: var(--color-text-on-brand);
  }

  .btn--primary:not(:disabled):hover {
    background-color: var(--color-accent-solid-hover);
  }

  .btn--primary:not(:disabled):active {
    background-color: var(--color-accent-solid-active);
  }

  /* Linen secondary */
  .btn--secondary {
    background-color: var(--color-surface-raised);
    color: var(--color-text);
  }

  .btn--secondary:not(:disabled):hover {
    background-color: color-mix(in srgb, var(--color-surface-raised) 80%, var(--color-ink));
  }

  .btn--ghost {
    background-color: transparent;
    color: color-mix(in srgb, var(--color-text) 60%, transparent);
  }

  .btn--ghost:not(:disabled):hover {
    color: var(--color-text);
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  /* Amber in-product action */
  .btn--action {
    background-color: var(--color-action);
    color: var(--color-action-text);
  }

  .btn--action:not(:disabled):hover {
    background-color: var(--color-action-hover);
  }

  .btn--danger {
    background-color: var(--color-danger);
    color: var(--color-text-on-danger);
  }

  .btn--danger:not(:disabled):hover {
    opacity: 0.9;
  }
</style>
