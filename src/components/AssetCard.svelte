<script lang="ts">
  import type { Asset, AssetType } from "../lib/types";
  import Badge from "./ui/Badge.svelte";
  import Button from "./ui/Button.svelte";
  import Card from "./ui/Card.svelte";

  interface Props {
    asset: Asset;
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
  }

  let { asset, onEdit, onDelete }: Props = $props();

  const TYPE_LABELS: Record<AssetType, string> = {
    prompt: "Prompt",
    skill: "Skill",
    tool: "Tool",
    resource: "Resource",
  };

  const TYPE_VARIANTS: Record<
    AssetType,
    "brand" | "success" | "warning" | "neutral"
  > = {
    prompt: "brand",
    skill: "success",
    tool: "warning",
    resource: "neutral",
  };
</script>

<Card>
  <div class="asset-card">
    <div class="asset-card__top">
      <Badge variant={TYPE_VARIANTS[asset.type]}>
        {TYPE_LABELS[asset.type]}
      </Badge>
      <div class="asset-card__actions">
        <Button variant="ghost" size="sm" onclick={() => onEdit(asset)}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onclick={() => onDelete(asset)}>
          Delete
        </Button>
      </div>
    </div>
    <h3 class="asset-card__title">{asset.title}</h3>
    {#if asset.description}
      <p class="asset-card__description">{asset.description}</p>
    {/if}
    {#if asset.roles.length > 0}
      <div class="asset-card__roles">
        {#each asset.roles as role (role)}
          <Badge variant="neutral">{role}</Badge>
        {/each}
      </div>
    {/if}
  </div>
</Card>

<style>
  .asset-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .asset-card__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .asset-card__actions {
    display: flex;
    gap: var(--space-1);
  }

  .asset-card__title {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
  }

  .asset-card__description {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .asset-card__roles {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    margin-top: var(--space-1);
  }
</style>
