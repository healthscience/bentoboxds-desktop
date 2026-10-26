<template>
  <div class="conduction-mapper">
    <div class="workspace">
      
      <!-- Left: The Visual Structure -->
      <div class="tree-pane">
        <h4>Extracted Device Structure</h4>
        <p class="hint" v-if="focusedAnnotationTarget">
          Click a node below to assign it to <strong>{{ focusedAnnotationTarget }}</strong>.
        </p>
        <p class="hint" v-else>
          Select a field on the right to manually annotate its path.
        </p>
        
        <ul class="tree-root">
          <TreeNode 
            :node="extractedData" 
            path="" 
            :selectedPath="activeMapping[focusedAnnotationTarget]"
            @select-root="handleNodeSelected" 
          />
        </ul>
      </div>

      <!-- Right: The Suggested/Editable Mapping -->
      <div class="annotation-pane">
        <h4>Conduction Rule Mapping</h4>
        <p class="hint">Review and annotate the extracted paths to align with the overlay-data structure.</p>
        
        <div class="mapping-fields">
          <!-- Device Class -->
          <div 
            class="field-row" 
            :class="{ active: focusedAnnotationTarget === 'tinyDevicePath' }"
            @click="setFocus('tinyDevicePath')"
          >
            <label>Tiny Device</label>
            <input v-model="activeMapping.tinyDevicePath" type="text" placeholder="e.g., exoCue-cameraOverlay-v2" />
          </div>

          <!-- Time Anchor Path (Helistamp) -->
          <div 
            class="field-row" 
            :class="{ active: focusedAnnotationTarget === 'conductionPath' }"
            @click="setFocus('conductionPath')"
          >
            <label>Conduction info.</label>
            <input v-model="activeMapping.conductionPath" type="text" placeholder="e.g., helistamp etc" />
          </div>

          <!-- Scale Anchor Path -->
          <div 
            class="field-row" 
            :class="{ active: focusedAnnotationTarget === 'scaleAnchorPath' }"
            @click="setFocus('scaleAnchorPath')"
          >
            <label>Scale Anchor</label>
            <input v-model="activeMapping.scaleAnchorPath" type="text" placeholder="e.g., scale ratio" />
          </div>

          <!-- Morphology Context Path -->
          <div 
            class="field-row" 
            :class="{ active: focusedAnnotationTarget === 'morphologyPath' }"
            @click="setFocus('morphologyPath')"
          >
            <label>Morphology Path</label>
            <input v-model="activeMapping.morphologyPath" type="text" placeholder="e.g., cues.morphology" />
          </div>

          <!-- Primary Cue Map Path -->
          <div 
            class="field-row" 
            :class="{ active: focusedAnnotationTarget === 'cueMapPath' }"
            @click="setFocus('cueMapPath')"
          >
            <label>Data</label>
            <input v-model="activeMapping.cueMapPath" type="text" placeholder="e.g. source data" />
          </div>
        </div>

        <div class="action-row">
          <button class="accept-btn" @click="acceptMapping">
            Mint Conduction Rule
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import TreeNode from './TreeNode.vue'
import { libraryStore } from '@/stores/libraryStore.js'


const storeLibrary = libraryStore()

const props = defineProps({
  // The pre-extracted JSON structure passed down from safeflow-ecs
  extractedData: {
    type: Object,
    required: true
  }
})

// The working conduction contract that the peer is annotating
const activeMapping = reactive({
  tinyDevicePath: '',
  conductionPath: '',
  scaleAnchorPath: '',
  morphologyPath: '',
  cueMapPath: ''
})

// Tracks which field the peer is currently trying to assign via the tree
const focusedAnnotationTarget = ref(null)


watch(() => props.extractedData, (newData) => {
  if (newData) {
    // autoSuggestMapping(newData)
  }
}, { immediate: true, deep: true })

// When a peer clicks a field in the contract to edit or assign it
const setFocus = (field) => {
  focusedAnnotationTarget.value = field
}

// When a peer clicks a node in the visual tree to assign a path to the focused field
const handleNodeSelected = (path) => {
  if (focusedAnnotationTarget.value) {
    // Strip internal ECS wrapper prefix if present to keep paths relative to payload root
    const cleanPath = path.replace(/^fullStructure\./, '')
    
    activeMapping[focusedAnnotationTarget.value] = cleanPath
    focusedAnnotationTarget.value = null // drop focus after assignment
  }
}

const acceptMapping = () => {
  storeLibrary.newConductionForm.map = activeMapping
}
</script>

<style scoped>
.conduction-mapper {
  font-family: monospace;
}
.workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.tree-pane, .annotation-pane {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid #444;
  padding: 1.5rem;
  background: #181818;
  color: #ddd;
  border-radius: 6px;
}
.hint {
  color: #88a;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.tree-root {
  list-style-type: none;
  padding-left: 0;
  max-height: 400px;
  overflow-y: auto;
}
.mapping-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}
.field-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  background: #222;
  transition: all 0.2s ease;
}
.field-row:hover {
  border-color: #555;
}
.field-row.active {
  border-color: #74c7ec;
  background: #1a2b3c;
  box-shadow: 0 0 8px rgba(116, 199, 236, 0.2);
}
.field-row label {
  font-size: 0.85rem;
  color: #aaa;
  pointer-events: none;
}
.field-row input {
  background: transparent;
  border: none;
  color: #fff;
  font-family: monospace;
  font-size: 1rem;
  outline: none;
}
.action-row {
  display: flex;
  justify-content: flex-end;
}
.accept-btn {
  background: #4e9a06;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-family: monospace;
  border-radius: 4px;
  font-size: 1rem;
}
.accept-btn:hover {
  background: #5cac08;
}
</style>