<template>
  <div class="library-container">
    <header class="library-header">
      <h1 class="library-title">Network Library</h1>
      <p class="library-subtitle">Explore and contribute to the decentralized reference contract network.</p>
      <!-- seed library button -->
      <button
        class="sov-demo-btn"
        @click="syncPublicLibrary('library', 'sync')"
      >
        Seed public library
      </button>
    </header>
    
    <main class="library-main">
      <contract-explorer></contract-explorer>
    </main>
  </div>
</template>

<script setup>
import ContractExplorer from '@/components/library/explorer/explorerView.vue'
import { libraryStore } from "@/stores/libraryStore.js";

const storeLibrary = libraryStore();

const syncPublicLibrary = () => {
  // send message to hop to create default reference contracts
  storeLibrary.syncLibraryFirst();
};
</script>

<style scoped>
.library-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--sov-bg);
  color: var(--sov-text);
  font-family: 'Inter', sans-serif;
}

.library-header {
  margin-bottom: 3rem;
  text-align: center;
  animation: slideDown 0.5s ease-out;
}

.library-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--sov-accent);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.library-subtitle {
  font-size: 1.1rem;
  color: var(--sov-text-muted);
  max-width: 600px;
  margin: 0 auto;
}

.library-main {
  animation: fadeIn 0.8s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .library-container {
    padding: 1rem;
  }
  
  .library-title {
    font-size: 2rem;
  }
}

/* BUTTON STYLES */
.sov-demo-btn {
  padding: 12px 20px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1.5rem;
}

.sov-demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
