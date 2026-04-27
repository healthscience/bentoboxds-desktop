<template>
  <div class="new-question-form">
    <lib-form-item label="Question Primary?" id="source-value">
      <select class="lib-select" id="source-value" v-model="storeLibrary.questionForm.primary">
        <option value="yes">YES</option>
        <option value="no">NO</option>
      </select>
    </lib-form-item>

    <lib-form-item label="Question" id="ref-question-name" required>
      <textarea 
        id="ref-question-name" 
        v-model="storeLibrary.questionForm.name" 
        class="lib-textarea"
        rows="3"
        placeholder="Enter the question text..."
      ></textarea>
    </lib-form-item>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'
import LibFormItem from '@/components/library/shared/LibFormItem.vue'

const storeLibrary = libraryStore()
</script>

<style scoped>
.lib-textarea, .lib-select {
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--sov-border-radius);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--sov-bg-soft);
  color: var(--sov-text);
  font-family: inherit;
  transition: var(--sov-transition-med);
}

.lib-textarea:focus, .lib-select:focus {
  outline: none;
  border-color: var(--sov-accent);
  box-shadow: 0 0 0 3px var(--sov-accent-glow);
}
</style>
