<template>
  <div class="new-datatype-form">
    <lib-form-item label="Datatype Primary?" id="source-value">
      <select class="lib-select" id="source-value" v-model="storeLibrary.datatypeForm.primary">
        <option value="yes">YES</option>
        <option value="no">NO</option>
      </select>
    </lib-form-item>

    <div v-if="storeLibrary.datatypeForm.primary === 'yes'" class="primary-fields">
      <lib-form-item label="Name" id="ref-datatype-name" required>
        <input 
          id="ref-datatype-name" 
          v-model="storeLibrary.datatypeForm.name" 
          class="lib-input"
          placeholder="datatype name" 
          type="text"
        >
      </lib-form-item>

      <lib-form-item label="Description" id="api-datatype-description" required>
        <textarea 
          id="api-datatype-description"
          v-model="storeLibrary.datatypeForm.description" 
          class="lib-textarea"
          rows="4"
          placeholder="Describe the datatype..."
        ></textarea>
      </lib-form-item>

      <lib-form-item label="Wikipedia entry" id="wikipedia-datatype-name">
        <input 
          id="wikipedia-datatype-name" 
          v-model="storeLibrary.datatypeForm.wiki" 
          class="lib-input"
          placeholder="https://en.wikipedia.org/wiki/..." 
          type="text"
        >
      </lib-form-item>

      <lib-form-item label="RDF linked data" id="rdf-datatype-name">
        <input 
          id="rdf-datatype-name" 
          v-model="storeLibrary.datatypeForm.rdf" 
          class="lib-input"
          placeholder="https://dbpedia.org/page/..." 
          type="text"
        >
      </lib-form-item>
    </div>
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

.primary-fields {
  margin-top: 1rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
