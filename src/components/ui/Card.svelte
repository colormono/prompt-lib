<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    header?: Snippet;
    footer?: Snippet;
    children: Snippet;
    padding?: "sm" | "md" | "lg";
  }

  let { header, footer, children, padding = "md" }: Props = $props();
</script>

<div class="card card--padding-{padding}">
  {#if header}
    <div class="card__header">{@render header()}</div>
  {/if}
  <div class="card__body">{@render children()}</div>
  {#if footer}
    <div class="card__footer">{@render footer()}</div>
  {/if}
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .card__header {
    border-bottom: 1px solid var(--color-border);
    font-weight: var(--font-weight-semibold);
  }

  .card__footer {
    border-top: 1px solid var(--color-border);
  }

  .card--padding-sm > * {
    padding: var(--space-3);
  }

  .card--padding-md > * {
    padding: var(--space-4);
  }

  .card--padding-lg > * {
    padding: var(--space-6);
  }
</style>
