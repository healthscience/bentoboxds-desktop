<!-- src/components/library/contracts/contribute/forms/conductiondevice/conductionDescribe.vue -->
<template>
  <div id="conduction-describe">
    <!-- Radia Camera Device Manifest Banner -->
    <div v-if="manifest.version" class="manifest-card">
      <div class="manifest-header">
        <span class="badge">radia-camera</span>
        <span class="manifest-version">v{{ manifest.version }}</span>
        <span class="manifest-wasm">{{ manifest.heliWasm }}</span>
      </div>
      <div class="manifest-grid">
        <div><strong>HeliCycle:</strong> {{ manifest.heliCycle }}</div>
        <div><strong>Helistamp:</strong> {{ manifest.helistamp }}</div>
        <div><strong>Optical Mode:</strong> {{ manifest.opticalMode }}</div>
        <div><strong>Scale Anchor:</strong> {{ manifest.scaleAnchor.value }} {{ manifest.scaleAnchor.unit }}</div>
      </div>
    </div>

    <!-- JSON Root Path Structure Tool -->
    <div v-if="isStreamOrDoc" class="structure-block">
      <div class="form-row">
        <label for="json-root">Data Root Path:</label>
        <input 
          id="json-root" 
          type="text" 
          v-model="rootPath" 
          placeholder="e.g. overlayData.cues"
          @input="updateDocStructure"
        />
      </div>
      
      <button type="button" class="inspect-btn" @click="inspectLiveSource">
        Inspect Radia Cues & Keys
      </button>
    </div>

    <!-- Relational / Database Query Builder (SQLite / DuckDB) -->
    <div v-else-if="isDatabase" class="structure-block">
      <div class="form-row">
        <label for="db-table">Target Table / View:</label>
        <input 
          id="db-table" 
          type="text" 
          v-model="targetTable"
          placeholder="e.g. body_kinematics"
          @input="updateQueryBuilder"
        />
      </div>

      <div class="form-row">
        <label for="db-query">Live Query (SQL Wizard):</label>
        <textarea 
          id="db-query" 
          rows="3" 
          v-model="rawQuery"
          placeholder="SELECT helistamp, torso, head FROM body_kinematics"
          @input="updateQueryBuilder"
        ></textarea>
      </div>

      <button type="button" class="inspect-btn" @click="inspectLiveSource">
        Inspect Source Fields
      </button>
    </div>

    <!-- Discovered Cues / Segments Panel -->
    <div v-if="detectedColumns.length > 0" class="detected-fields-panel">
      <span class="panel-label">Discovered Segments / Cue Keys:</span>
      <div class="field-chips">
        <span v-for="field in detectedColumns" :key="field" class="chip">
          {{ field }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

const storeLibrary = libraryStore()

const targetTable = ref('')
const rawQuery = ref('')
const rootPath = ref('overlayData.cues')

const sourceType = computed(() => storeLibrary.sourceFiletype || storeLibrary.newConductionForm.type || '')
const isDatabase = computed(() => ['sqlite', 'duckdb'].includes(sourceType.value))
const isStreamOrDoc = computed(() => ['json', 'hyperbee', 'hyperdrive', 'csv'].includes(sourceType.value))

const manifest = computed(() => storeLibrary.newConductionForm.conductionManifest || {})
const detectedColumns = computed(() => storeLibrary.fileFeedback.columns || [])

const ensureExtractionStrategy = () => {
  if (!storeLibrary.newConductionForm.sourceStrategy) {
    storeLibrary.newConductionForm.sourceStrategy = {
      driver: sourceType.value,
      extraction: {}
    }
  }
}

const updateDocStructure = () => {
  ensureExtractionStrategy()
  storeLibrary.newConductionForm.sourceStrategy.extraction.rootPath = rootPath.value
}

const updateQueryBuilder = () => {
  ensureExtractionStrategy()
  storeLibrary.newConductionForm.sourceStrategy.extraction.queryBuilder = {
    table: targetTable.value,
    rawQuery: rawQuery.value
  }
}

// Safely traverses nested objects using string path (e.g., 'overlayData.cues')
const resolveNestedPath = (obj, path) => {
  if (!obj || !path) return obj
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj)
}

const inspectLiveSource = () => {
  const payload = storeLibrary.newDatafile
  if (!payload) return

  if (isStreamOrDoc.value) {
    const cueBranch = resolveNestedPath(payload, rootPath.value)

    if (cueBranch && typeof cueBranch === 'object') {
      // Collect segments (torso, head, leftArm, etc.)
      const segments = Object.keys(cueBranch)
      
      // Also collect deep hex keys if needed
      const discoveredKeys = []
      segments.forEach(segmentKey => {
        discoveredKeys.push(segmentKey) // e.g. "torso"
        const innerHexMap = cueBranch[segmentKey]
        if (typeof innerHexMap === 'object') {
          Object.keys(innerHexMap).forEach(hexKey => {
            discoveredKeys.push(`${segmentKey}.${hexKey.slice(0, 8)}...`)
          })
        }
      })

      storeLibrary.fileFeedback.columns = segments
    }
  } else if (payload.columns) {
    storeLibrary.fileFeedback.columns = payload.columns.map(c => c.name || c)
  }
}

onMounted(() => {
  if (storeLibrary.newDatafile) {
    inspectLiveSource()
  }
})
</script>

<style scoped>
#conduction-describe {
  background: rgba(0, 0, 0, 0.02);
  padding: 1.2em;
  border-radius: 4px;
  border: 1px solid #eaeaea;
  margin-bottom: 1em;
}

.manifest-card {
  background: #1a202c;
  color: #edf2f7;
  padding: 1em;
  border-radius: 4px;
  margin-bottom: 1.2em;
}

.manifest-header {
  display: flex;
  align-items: center;
  gap: 0.8em;
  margin-bottom: 0.6em;
}

.badge {
  background: #3182ce;
  color: #fff;
  padding: 0.2em 0.5em;
  border-radius: 3px;
  font-size: 0.75em;
  font-weight: bold;
}

.manifest-version, .manifest-wasm {
  font-family: monospace;
  font-size: 0.85em;
}

.manifest-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4em;
  font-size: 0.85em;
}

.form-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: center;
  margin-bottom: 0.8em;
}

.inspect-btn {
  padding: 0.5em 1em;
  background: #2b6cb0;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.detected-fields-panel {
  margin-top: 1em;
  padding-top: 0.8em;
  border-top: 1px dashed #cbd5e0;
}

.field-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
  margin-top: 0.4em;
}

.chip {
  background: #edf2f7;
  padding: 0.25em 0.6em;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.82em;
}
</style>