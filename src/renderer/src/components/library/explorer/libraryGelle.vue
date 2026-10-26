<template>
  <div id="library-cues-container">
    <div id="cues-column">
      <div id="minimise-cues">
        <!-- a to z and filter -->
        <div id="filter-cues">
          <AlphabetFilter v-model="liveLetter" size="md">
            <template #extra>
              <button id="refresh-cues-btn" @click="refreshGelles()">refresh</button>
            </template>
          </AlphabetFilter>
        </div>
        
        <div id="saved-cues" v-if="gellesList.length > 0">
          <div class="network-cues" v-for="ncue of filteredGelles" :key="ncue.contract?.key">
            <button class="cue-item" @click="viewGelle(ncue.contract?.key, ncue.contract)">
              {{ ncue.contract?.value?.concept?.name || ncue.contract?.key || 'Unknown' }}
            </button>
          </div>
        </div>
        
        <div id="sync-cues" v-else>
          <div id="sync-message">
             No gelles found.
          </div>
        </div>
        
        <!-- display contract -->
        <div v-if="selectedGelle" id="cue-contract-details">
          <div class="contract-header">
            <h4>Gelle: {{ selectedGelle.value?.concept?.name || 'Unknown' }}</h4>
            <span class="cue-key-id">{{ selectedGelle.key }}</span>
          </div>

          <div class="contract-sections">
            <div class="contract-section">
              <h5>Concept</h5>
              <div class="section-content">
                <div class="content-row">
                  <span class="label">Name:</span> <span>{{ selectedGelle.value?.concept?.name }}</span>
                </div>
                <div v-if="selectedGelle.value?.concept?.description" class="content-row">
                  <span class="label">Description:</span> <span>{{ selectedGelle.value?.concept?.description }}</span>
                </div>
              </div>
            </div>
            
            <div class="datatype-raw mt-2">
              <button class="toggle-raw-btn" @click="showRawDatatype = !showRawDatatype">
                {{ showRawDatatype ? 'Hide' : 'Show' }} Raw Gelle
              </button>
              <pre v-if="showRawDatatype" class="json-block mt-1">{{ JSON.stringify(selectedGelle, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AlphabetFilter from '@/components/shared/AlphabetFilter.vue'
import { ref, computed, watch } from 'vue'
import { useGelleStore } from '@/stores/gelleStore.js'

const storeGelle = useGelleStore()

let selectedGelle = ref(null)
let showRawDatatype = ref(false)
let liveLetter = ref('')

const gellesList = computed(() => {
  return storeGelle.gelleMorphogens
})

const filteredGelles = computed(() => {
  if (liveLetter.value === '') {
    return gellesList.value
  }
  return gellesList.value.filter(ncue => {
    const name = ncue.contract?.value?.concept?.name
    return name && typeof name === 'string' && name.toLowerCase().charAt(0) === liveLetter.value.toLowerCase()
  })
})

const refreshGelles = () => {
  // Logic to refresh if needed
}

const viewGelle = (key, contract) => {
  selectedGelle.value = contract
}
</script>

<style scoped>
#library-cues-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  background-color: #fcfcfc;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

#chart-column {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

#cue-bentobox {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

#cue-wheel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #eee;
}

#beebee-feedback {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 60px;
}

#relationship-glue {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.glue-btn {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.glue-btn:hover {
  background: #f1f5f9;
}

.glue-btn.active {
  background: var(--sov-accent, #3b82f6);
  color: white;
  border-color: var(--sov-accent, #3b82f6);
}

#saved-cues {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  max-height: 500px;
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 12px;
  background: white;
}

.cue-item {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  text-align: center;
  font-size: 0.85rem;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cue-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
}

.seeding-status {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

#refresh-cues-btn {
  padding: 6px 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

#cue-contract-details {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  max-height: 600px;
  overflow-y: auto;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.contract-header {
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.contract-header h4 {
  margin: 0;
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 700;
}

.cue-key-id {
  font-family: monospace;
  font-size: 0.75rem;
  color: #94a3b8;
}

.contract-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}

.contract-section h5 {
  margin: 0 0 0.75rem 0;
  color: #475569;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.content-row {
  font-size: 0.85rem;
  color: #334155;
}

.label {
  font-weight: 600;
  color: #64748b;
  margin-right: 0.5rem;
}

.content-links {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.cue-link {
  font-size: 0.75rem;
  color: #3b82f6;
  text-decoration: none;
  padding: 2px 8px;
  background: #eff6ff;
  border-radius: 4px;
}

.cue-link:hover {
  background: #dbeafe;
}

.json-block {
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  overflow-x: auto;
  margin: 0;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.grid-item {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.75rem; }

.datatype-sub-section {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  border: 1px solid #edf2f7;
}

.toggle-raw-btn {
  background: none;
  border: 1px solid #cbd5e1;
  color: #64748b;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-raw-btn:hover {
  background: #f1f5f9;
  color: #475569;
}

.badge {
  background: #e2e8f0;
  color: #475569;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.color-swatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
  margin-right: 4px;
  border: 1px solid rgba(0,0,0,0.1);
}

.timestamp-list {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #e2e8f0;
}

.timestamp-item {
  font-size: 0.75rem;
  color: #64748b;
  font-family: monospace;
}

@media (min-width: 1024px) {
  #library-cues-container {
    grid-template-columns: 1.2fr 1fr;
  }
}
</style>
