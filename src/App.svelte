<script lang="ts">
  import AboutModal from "./components/AboutModal.svelte";
  import AppHeader from "./components/AppHeader.svelte";
  import AssetForm from "./components/AssetForm.svelte";
  import AssetList from "./components/AssetList.svelte";
  import ConfirmDeleteModal from "./components/ConfirmDeleteModal.svelte";
  import StyleGuide from "./components/dev/StyleGuide.svelte";
  import SettingsPanel from "./components/SettingsPanel.svelte";
  import { addAsset, deleteAsset, updateAsset } from "./lib/stores";
  import type { Asset, AssetDraft } from "./lib/types";

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
  let aboutOpen = $state(false);
  let statusMessage = $state<string | null>(null);
  let statusTimeout: ReturnType<typeof setTimeout> | undefined;

  function showStatus(message: string) {
    statusMessage = message;
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
      statusMessage = null;
    }, 3000);
  }

  function truncateTitle(title: string, max = 48): string {
    return title.length > max ? `${title.slice(0, max)}…` : title;
  }

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
    formOpen = false;
    deletingAsset = asset;
    deleteOpen = true;
  }

  function handleDeleteConfirm(asset: Asset) {
    deleteAsset(asset.id);
    showStatus(`Deleted "${truncateTitle(asset.title)}".`);
  }
</script>

{#if showStyleGuide}
  <StyleGuide />
{:else}
  <main>
    <AppHeader
      onNewAsset={openCreateForm}
      onOpenSettings={() => (settingsOpen = true)}
      onOpenAbout={() => (aboutOpen = true)}
    />

    {#if statusMessage}
      <p class="app-status" role="status" aria-live="polite">{statusMessage}</p>
    {/if}

    <AssetList onCreate={openCreateForm} onEdit={openEditForm} />

    <AssetForm
      bind:open={formOpen}
      asset={editingAsset}
      onSubmit={handleFormSubmit}
      onDelete={openDeleteConfirm}
    />

    <ConfirmDeleteModal
      bind:open={deleteOpen}
      asset={deletingAsset}
      onConfirm={handleDeleteConfirm}
    />

    <SettingsPanel
      bind:open={settingsOpen}
      onResetComplete={() => showStatus("Library reset to starter set.")}
    />
    <AboutModal bind:open={aboutOpen} />
  </main>
{/if}

<style>
  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .app-status {
    align-self: center;
    margin-block: 0 var(--space-2);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    background-color: var(--color-success-subtle);
    color: var(--color-success);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }
</style>
