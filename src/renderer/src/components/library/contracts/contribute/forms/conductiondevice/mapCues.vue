<!-- src/components/library/contracts/contribute/forms/conductiondevice/mapCues.vue -->
<template>
  <div id="map-cues-view">
    <h4>Overlay Data ExoCue Conduction Mapping</h4>

    <!-- Fallback if the peer hasn't loaded a contract yet -->
    <div v-if="!requiredCues || requiredCues.length === 0" class="empty-state">
      <p>Waiting for exoCue contract parameters...</p>
    </div>

    <div v-else class="cue-mapping-list">
      <!-- Dynamically iterates over whatever cues the Library demands -->
      <div v-for="cue in requiredCues" :key="cue.key" class="cue-mapping-card">
        <div class="cue-meta">
          <span class="cue-label">{{ cue.label || 'Unnamed Cue' }}</span>
          <code class="cue-hex" :title="cue.key">{{ formatShortHex(cue.key) }}</code>
        </div>
        
        <div class="cue-selector">
          <span class="link-icon">⟷</span>
          <select 
            v-model="columnMap[cue.key]" 
            @change="syncStrategyToStore"
          >
            <option value="" disabled>Select source field...</option>
            <option v-for="field in availableFields" :key="field" :value="field">
              {{ field }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

// The parent component MUST pass down the array of required cues 
// fetched dynamically from the Library/selected exoCue contract.
const props = defineProps({
  requiredCues: {
    type: Array,
    required: true,
    default: () => []
  }
})

const storeLibrary = libraryStore()
const columnMap = reactive({})

// Update to the newConductionForm naming convention
const sourceType = computed(() => storeLibrary.newConductionForm.type || 'data')
const availableFields = computed(() => storeLibrary.fileFeedback.columns || [])

const formatShortHex = (hex) => {
  if (!hex) return '0x000...000'
  return `${hex.slice(0, 8)}...${hex.slice(-6)}`
}

const syncStrategyToStore = () => {
  if (!storeLibrary.newConductionForm.sourceStrategy) {
    storeLibrary.newConductionForm.sourceStrategy = {
      driver: sourceType.value,
      extraction: { columnMap: {} }
    }
  }
  
  storeLibrary.newConductionForm.sourceStrategy.extraction.columnMap = { ...columnMap }
}

onMounted(() => {
  // Hydrate local state from the store if editing an existing conduction setup
  if (storeLibrary.newConductionForm.sourceStrategy?.extraction?.columnMap) {
    Object.assign(columnMap, storeLibrary.newConductionForm.sourceStrategy.extraction.columnMap)
  }
})
</script>

<style scoped>
#map-cues-view {
  margin-top: 1.5em;
  padding: 1.5em;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid #eaeaea;
  border-radius: 4px;
}

.empty-state {
  color: #666;
  font-style: italic;
  padding: 1em 0;
}

.cue-mapping-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 0.8em;
  background: #fff;
  border: 1px solid #eee;
  margin-bottom: 0.5em;
  border-radius: 4px;
}

.cue-meta {
  display: flex;
  flex-direction: column;
}

.cue-label {
  font-weight: bold;
  font-size: 0.9em;
}

.cue-hex {
  font-size: 0.75em;
  color: #888;
  margin-top: 0.2em;
}

.cue-selector {
  display: flex;
  align-items: center;
  gap: 1em;
}

.link-icon {
  color: #aaa;
}

select {
  flex-grow: 1;
  padding: 0.4em;
}
</style>