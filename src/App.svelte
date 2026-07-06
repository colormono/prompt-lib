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

    <SettingsPanel bind:open={settingsOpen} />
    <AboutModal bind:open={aboutOpen} />
  </main>
{/if}

<style>
  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>
