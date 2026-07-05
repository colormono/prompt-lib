<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    variant?: "neutral" | "brand" | "success" | "warning" | "danger";
    children: Snippet;
  }

  let { variant = "neutral", children }: Props = $props();
</script>

<span class="badge badge--{variant}">
  {@render children()}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-pill);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-tight);
  }

  .badge--neutral {
    background-color: var(--color-bg-subtle);
    color: var(--color-text-muted);
  }

  .badge--brand {
    background-color: var(--color-accent-subtle);
    color: var(--color-accent);
  }

  .badge--success {
    background-color: var(--color-success-subtle);
    color: var(--color-success);
  }

  .badge--warning {
    background-color: var(--color-warning-subtle);
    color: var(--color-warning);
  }

  .badge--danger {
    background-color: var(--color-danger-subtle);
    color: var(--color-danger);
  }
</style>
