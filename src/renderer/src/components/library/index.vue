<template>
  <div class="library-container">
      <header class="compact-library-header">
        <div class="library-brand">
          <h1 class="library-title">Network Library</h1>
          <p class="library-subtitle">Explore & contribute reference contracts.</p>
        </div>
        
        <div class="library-controls">
          <div class="library-scope-toggle">
            <button class="scope-btn" :class="{ active: libraryScope === 'public' }" @click="libraryScope = 'public'">
              Public
            </button>
            <button class="scope-btn" :class="{ active: libraryScope === 'private' }" @click="libraryScope = 'private'">
              Private
            </button>
          </div>

          <div class="library-toolbar" v-if="libraryScope === 'public'">
            <button class="sov-toolbar-btn" :class="{ active: currentView === 'explorer' }" @click="currentView = 'explorer'">
              Explorer
            </button>
            <button class="sov-toolbar-btn" :class="{ active: currentView === 'upload' }" @click="currentView = 'upload'">
              Upload
            </button>
            <button class="sov-toolbar-btn" :class="{ active: currentView === 'newRef' }" @click="currentView = 'newRef'">
              + Contract
            </button>
            <!-- seed library button -->
            <button
              class="sov-toolbar-btn seed-btn"
              @click="syncPublicLibrary('library', 'sync')"
            >
              Seed
            </button>
          </div>
          
          <div class="library-toolbar" v-if="libraryScope === 'private'">
            <button class="sov-toolbar-btn" :class="{ active: currentView === 'explorer' }" @click="currentView = 'explorer'">
              Explorer
            </button>
            <button class="sov-toolbar-btn" :class="{ active: currentView === 'upload' }" @click="currentView = 'upload'">
              Upload
            </button>
            <button class="sov-toolbar-btn" :class="{ active: currentView === 'newRef' }" @click="currentView = 'newRef'">
              + Contract
            </button>
          </div>
        </div>
      </header>
    
    <main class="library-main">
      <div v-if="currentView === 'explorer'">
        <contract-explorer :scope="libraryScope"></contract-explorer>
      </div>
      <div v-else-if="currentView === 'upload'">
        <space-upload></space-upload>
      </div>
      <div v-else-if="currentView === 'newRef'">
        <new-refcontract :scope="libraryScope"></new-refcontract>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ContractExplorer from '@/components/library/explorer/explorerView.vue'
import SpaceUpload from '@/components/dataspace/upload/uploadSpace.vue'
import NewRefcontract from '@/components/library/contracts/contribute/newRefcontract.vue'
import { libraryStore } from "@/stores/libraryStore.js";

const storeLibrary = libraryStore();
const currentView = ref('explorer');
const libraryScope = ref('public');

const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});

const syncPublicLibrary = () => {
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

.compact-library-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1.5rem;
}

.library-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 180px;
}

.compact-library-header .library-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--sov-accent);
  margin-bottom: 0;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.compact-library-header .library-subtitle {
  font-size: 0.8rem;
  color: var(--sov-text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.library-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.compact-library-header .library-scope-toggle {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0;
  background: var(--sov-bg-soft, #f8fafc);
  padding: 0.25rem;
  border-radius: 8px;
  width: fit-content;
}

.compact-library-header .scope-btn {
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--sov-text-muted, #64748b);
  cursor: pointer;
  transition: all 0.2s;
}

.compact-library-header .scope-btn.active {
  background: white;
  color: var(--sov-accent, #3b82f6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.compact-library-header .library-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0;
}

.compact-library-header .sov-toolbar-btn {
  padding: 6px 12px;
  font-size: 0.8rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: var(--sov-text);
  white-space: nowrap;
}

.compact-library-header .sov-toolbar-btn:hover {
  background: var(--sov-bg-soft, #f8fafc);
}

.compact-library-header .sov-toolbar-btn.active {
  background: var(--sov-accent, #3b82f6);
  color: white;
  border-color: var(--sov-accent, #3b82f6);
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

.sov-toolbar-btn {
  padding: 10px 16px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: var(--sov-text);
}

.sov-toolbar-btn:hover {
  background: var(--sov-bg-soft, #f8fafc);
}

.sov-toolbar-btn.active {
  background: var(--sov-accent, #3b82f6);
  color: white;
  border-color: var(--sov-accent, #3b82f6);
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
