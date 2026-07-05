<script lang="ts">
  import AssetForm from "./components/AssetForm.svelte";
  import AssetList from "./components/AssetList.svelte";
  import ConfirmDeleteModal from "./components/ConfirmDeleteModal.svelte";
  import StyleGuide from "./components/dev/StyleGuide.svelte";
  import SettingsPanel from "./components/SettingsPanel.svelte";
  import Button from "./components/ui/Button.svelte";
  import { addAsset, deleteAsset, updateAsset } from "./lib/stores";
  import type { Asset, AssetDraft } from "./lib/types";

  const appTitle = "Colormo AI Prompt Manager";

  let hash = $state(window.location.hash);

  $effect(() => {
    const onHashChange = () => {
      hash = window.location.hash;
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  });

  const showStyleGuide = $derived(hash === "#style-guide");

  let formOpen = $state(false);
  let editingAsset = $state<Asset | undefined>(undefined);
  let deleteOpen = $state(false);
  let deletingAsset = $state<Asset | undefined>(undefined);
  let settingsOpen = $state(false);

  function openCreateForm() {
    editingAsset = undefined;
    formOpen = true;
  }

  function openEditForm(asset: Asset) {
    editingAsset = asset;
    formOpen = true;
  }

  function handleFormSubmit(draft: AssetDraft) {
    if (editingAsset) {
      updateAsset(editingAsset.id, draft);
    } else {
      addAsset(draft);
    }
  }

  function openDeleteConfirm(asset: Asset) {
    deletingAsset = asset;
    deleteOpen = true;
  }

  function handleDeleteConfirm(asset: Asset) {
    deleteAsset(asset.id);
  }
</script>

{#if showStyleGuide}
  <StyleGuide />
{:else}
  <main>
    <header class="app-header">
      <h1>{appTitle}</h1>
      <Button variant="ghost" size="sm" onclick={() => (settingsOpen = true)}>
        Data
      </Button>
      <a class="dev-link" href="#style-guide">Design system style guide →</a>
    </header>

    <AssetList
      onCreate={openCreateForm}
      onEdit={openEditForm}
      onDelete={openDeleteConfirm}
    />

    <AssetForm
      bind:open={formOpen}
      asset={editingAsset}
      onSubmit={handleFormSubmit}
    />

    <ConfirmDeleteModal
      bind:open={deleteOpen}
      asset={deletingAsset}
      onConfirm={handleDeleteConfirm}
    />

    <SettingsPanel bind:open={settingsOpen} />
  </main>
{/if}

<style>
  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .app-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-6) var(--space-4) 0;
    text-align: center;
  }

  .dev-link {
    font-size: var(--font-size-sm);
  }
</style>
