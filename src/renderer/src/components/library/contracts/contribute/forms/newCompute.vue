<template>
  <div class="new-compute-form">
    <lib-form-item label="Compute Primary?" id="compute-add-source">
      <select class="lib-select" v-model="storeLibrary.newComputeForm.primary">
        <option value="yes">YES</option>
        <option value="no">NO</option>
      </select>
    </lib-form-item>

    <lib-form-item label="Name" id="compute-mapping-name" required>
      <input 
        id="compute-mapping-name" 
        v-model="storeLibrary.newComputeForm.name" 
        class="lib-input"
        placeholder="compute mapping name" 
        type="text"
      >
    </lib-form-item>

    <lib-form-item label="Description" id="compute-mapping-description" required>
      <textarea 
        id="compute-mapping-description"
        v-model="storeLibrary.newComputeForm.description" 
        class="lib-textarea"
        rows="4"
        placeholder="Describe the compute mapping..."
      ></textarea>
    </lib-form-item>

    <lib-form-item label="Datatype Prefix" id="compute-refcontract-dt" required>
      <input 
        id="compute-refcontract-dt" 
        v-model="storeLibrary.newComputeForm.dtprefix" 
        class="lib-input"
        placeholder="datatype ref contract" 
        type="text"
      >
    </lib-form-item>

    <lib-form-item label="Location of Code" id="compute-code-name" required>
      <input 
        id="compute-code-name" 
        v-model="storeLibrary.newComputeForm.code" 
        class="lib-input"
        placeholder="compute code location" 
        type="text"
      >
    </lib-form-item>

    <lib-form-item label="Hash of Code" id="compute-code-hash" required>
      <input 
        id="compute-code-hash" 
        v-model="storeLibrary.newComputeForm.hash" 
        class="lib-input"
        placeholder="compute hash" 
        type="text"
      >
    </lib-form-item>

    <lib-form-item label="Mode of Compute" id="compute-code-mode" required>
      <input 
        id="compute-code-mode" 
        v-model="storeLibrary.newComputeForm.mode" 
        class="lib-input"
        placeholder="compute mode" 
        type="text"
      >
    </lib-form-item>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'
import LibFormItem from '@/components/library/shared/LibFormItem.vue'

const storeLibrary = libraryStore()
</script>

<style scoped>
.lib-input, .lib-textarea, .lib-select {
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--sov-border-radius);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--sov-bg-soft);
  color: var(--sov-text);
  font-family: inherit;
  transition: var(--sov-transition-med);
}

.lib-input:focus, .lib-textarea:focus, .lib-select:focus {
  outline: none;
  border-color: var(--sov-accent);
  box-shadow: 0 0 0 3px var(--sov-accent-glow);
}
</style>
