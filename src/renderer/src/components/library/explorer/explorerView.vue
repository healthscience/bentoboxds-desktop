<template>
  <div id="explorer-view-main">
    <div class="explorer-header-scope" :class="props.scope">
      <span>Currently Exploring: <strong>{{ props.scope.toUpperCase() }} LIBRARY</strong></span>
    </div>
    <div class="explorer-layout">
      <!-- Left sidebar for categories -->
      <aside class="explorer-sidebar">
        <h3>Categories</h3>
        <nav class="category-nav">
          <button 
            :class="{ active: currentCategory === 'cues' }" 
            @click="currentCategory = 'cues'">
            Cues (Knowledge)
          </button>
          <button 
            :class="{ active: currentCategory === 'datatype' }" 
            @click="currentCategory = 'datatype'">
            Datatypes
          </button>
          <button 
            :class="{ active: currentCategory === 'question' }" 
            @click="currentCategory = 'question'">
            Questions
          </button>
          <button 
            :class="{ active: currentCategory === 'packaging' }" 
            @click="currentCategory = 'packaging'">
            Data Packaging
          </button>
          <button 
            :class="{ active: currentCategory === 'compute' }" 
            @click="currentCategory = 'compute'">
            Compute
          </button>
          <button 
            :class="{ active: currentCategory === 'visualise' }" 
            @click="currentCategory = 'visualise'">
            Visualise
          </button>
        </nav>
      </aside>

      <!-- Main content area for the selected category -->
      <main class="explorer-content">
        <library-cues v-if="currentCategory === 'cues'"></library-cues>
        <reference-contract-list 
          v-else-if="currentCategory === 'datatype'" 
          :contracts="storeLibrary.datatypeContracts" 
          title="Datatype Contracts">
        </reference-contract-list>
        <reference-contract-list 
          v-else-if="currentCategory === 'question'" 
          :contracts="storeLibrary.questionContracts" 
          title="Question Contracts">
        </reference-contract-list>
        <reference-contract-list 
          v-else-if="currentCategory === 'packaging'" 
          :contracts="storeLibrary.packagingContracts" 
          title="Data Packaging Contracts">
        </reference-contract-list>
        <reference-contract-list 
          v-else-if="currentCategory === 'compute'" 
          :contracts="storeLibrary.computeContracts" 
          title="Compute Contracts">
        </reference-contract-list>
        <reference-contract-list 
          v-else-if="currentCategory === 'visualise'" 
          :contracts="storeLibrary.visualisationContracts" 
          title="Visualise Contracts">
        </reference-contract-list>
      </main>
    </div>
  </div>
</template>

<script setup>
import LibraryCues from '@/components/library/explorer/libraryCues.vue'
import ReferenceContractList from '@/components/library/contracts/list/ReferenceContractList.vue'
import { ref } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

const props = defineProps({
  scope: {
    type: String,
    default: 'public'
  }
})

const storeLibrary = libraryStore()
const currentCategory = ref('cues')
</script>

<style scoped>
#explorer-view-main {
  width: 100%;
}

.explorer-header-scope {
  padding: 12px 24px;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.explorer-header-scope.public {
  background-color: rgba(59, 130, 246, 0.08);
  color: rgb(37, 99, 235);
  border: 1px solid rgba(59, 130, 246, 0.15);
}

.explorer-header-scope.private {
  background-color: rgba(139, 92, 246, 0.08);
  color: rgb(124, 58, 237);
  border: 1px solid rgba(139, 92, 246, 0.15);
}

.explorer-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  background-color: #fcfcfc;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.explorer-sidebar h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--sov-accent, #3b82f6);
}

.category-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-nav button {
  padding: 10px 16px;
  text-align: left;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: #475569;
}

.category-nav button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.category-nav button.active {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.explorer-content {
  min-height: 400px;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}
</style>