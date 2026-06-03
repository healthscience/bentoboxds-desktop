<template>
  <!-- Two-column grid layout -->
  <div id="library-cues-container">
    <!-- Left Column - Chart and Controls -->
    <div id="chart-column">
      <!--<div id="cue-bentobox" v-if="cueKnowledge === 'concept'">
        produce cue wheel based on active cue 
        <div id="cue-wheel">
          <div id="cues-doughnut">
            <pie-chartcues v-if="Object.keys(liveDoughData).length > 0" :chartData="liveDoughData" :options="{}" @segmentClick="cueSegSelect" ></pie-chartcues>
          </div>
          <div id="beebee-feedback">
            {{ beebeeFeedback }}
          </div>
          <div id="cue-history">
            <div id="cue-history-title">
              History
            </div>
            <div class="cue-history-item" v-for="cueH of glueHistoryList">
              <div class="cue-relationship-history" v-if="cueH.type !== undefined">
                <button class="cue-history-button" @click="glueType(cueH.type)">{{ cueH.type }}</button>
              </div>
              <div v-else>
                <button class="cue-history-button" @click="viewCueHistory(cueH.key, cueH)">{{ cueH.data.labels[0] }}</button>
              </div>
            </div>
          </div>
          <div id="remove-cue">
            <button id="view-cue-button" @click="bentoSpaceOpen()">Open Space</button>
          </div>
        </div>-->
        <!-- cognative glue options 
        <div id="relationship-glue" v-if="cueSelectrel === false">
          <div id="beebee-rel">
            <div id="connection-glue">
              <button class="glue-btn" :class="{ active: activeGlueType === 'down' }" @click="glueType('down')">Down</button>
              <button class="glue-btn" :class="{ active: activeGlueType === 'up' }" @click="glueType('up')">Up</button>
              <button class="glue-btn" :class="{ active: activeGlueType === 'equal' }" @click="glueType('equal')">Equal</button>
              <button class="glue-btn" :class="{ active: activeGlueType === 'measure' }" @click="glueType('measure')">Measure</button>
              <button class="glue-btn" :class="{ active: activeGlueType === 'unknown' }" @click="glueType('unknown')">Unknown</button>
              <button class="glue-btn" :class="{ active: activeGlueType === 'compute' }" @click="glueType('compute')">Compute</button>
            </div>
          </div>
        </div>
        markers for this cue? 
        <div id="cue-markers" v-if="markerContext.length > 0 && cueConext !== 'space'">
          <div class="marker-button-item" v-for="mark in markerContext">
            <button class="marker-button" @click="viewMarker(mark)">{{ mark[0].value.concept.name }}</button>
          </div> 
        </div>
      </div>
      <div id="no-cue-selected" v-else>
        <p>Select a cue from the list to explore its relationships.</p>
      </div>-->
    </div>
    
    <!-- Knowledge cues - Filter and List -->
    <div id="cues-column">
      <div v-if="storeOrrery.isSeeding" class="seeding-status pulse">
        seeding biology knowledge... {{ storeOrrery.seedingProgress }}%
      </div>
      
      <div id="minimise-cues" v-if="minCues === true">
        <!-- a to z and filter -->
        <div id="filter-cues">
          <AlphabetFilter v-model="liveLetter" size="md">
            <template #extra>
              <button id="refresh-cues-btn" @click="refreshCues()">refresh</button>
            </template>
          </AlphabetFilter>
        </div>
        
        <div id="saved-cues" v-if="cueConext === 'cueall' && cuesNetworkList.length > 0">
          <div id="no-filter" v-if="liveLetter === ''">
            <div class="network-cues" v-for="ncue of cuesNetworkList" :key="ncue.key">
              <button class="cue-item" @click="viewCue(ncue.key, ncue)">{{ ncue.value.concept.datatype.concept.name }}</button>
            </div>
          </div>
          <div v-else>
            <div class="network-cues" v-for="ncue of filteredCues" :key="ncue.key">
              <button class="cue-item" @click="viewCue(ncue.key, ncue)">{{ ncue.value.concept.datatype.concept.name }}</button>
            </div>
          </div>
        </div>
        
        <div v-else-if="cueConext === 'space'" id="cue-space">
          <button class="cue-item" @click="viewCue(storeAI.liveBspace.spaceid, storeAI.liveBspace)">{{ storeAI.liveBspace.name }}</button>
        </div>
        
        <div id="sync-cues" v-else-if="!storeOrrery.isSeeding">
          <div id="sync-message">
             Seeded biology cues will appear here. Click "Seed public library" above to start.
          </div>
        </div>
        <!-- display cue contract -->
        <div v-if="selectedCue" id="cue-contract-details">
          <div class="contract-header">
            <h4>Cue: {{ selectedCue.value.concept.name }}</h4>
            <span class="cue-key-id">{{ selectedCue.key }}</span>
          </div>

          <div class="contract-sections">
            <!-- Concept Section -->
            <div class="contract-section">
              <h5>Concept</h5>
              <div class="section-content">
                <div class="content-row">
                  <span class="label">Name:</span> <span>{{ selectedCue.value.concept.name }}</span>
                </div>
                <div v-if="selectedCue.value.concept.description" class="content-row">
                  <span class="label">Description:</span> <span>{{ selectedCue.value.concept.description }}</span>
                </div>
                <div class="content-links" v-if="selectedCue.value.concept.wiki || selectedCue.value.concept.rdf">
                  <a v-if="selectedCue.value.concept.wiki" :href="selectedCue.value.concept.wiki" target="_blank" class="cue-link">Wikipedia</a>
                  <a v-if="selectedCue.value.concept.rdf" :href="selectedCue.value.concept.rdf" target="_blank" class="cue-link">DBPedia</a>
                </div>
              </div>
            </div>

            <!-- Datatype Section (Structured) -->
            <div v-if="selectedCue.value.concept.datatype" class="contract-section nested">
              <h5>Datatype Context</h5>
              <div class="section-content">
                <div v-if="selectedCue.value.concept.datatype.concept" class="datatype-sub-section">
                  <div class="content-row">
                    <span class="label">Primary:</span> <span class="badge">{{ selectedCue.value.concept.datatype.concept.primary }}</span>
                  </div>
                  <div class="content-row">
                    <span class="label">Name:</span> <span>{{ selectedCue.value.concept.datatype.concept.name }}</span>
                  </div>
                  <div v-if="selectedCue.value.concept.datatype.concept.description" class="content-row">
                    <span class="label">Description:</span> <span>{{ selectedCue.value.concept.datatype.concept.description }}</span>
                  </div>
                  <div class="content-links" v-if="selectedCue.value.concept.datatype.concept.wiki || selectedCue.value.concept.datatype.concept.rdf">
                    <a v-if="selectedCue.value.concept.datatype.concept.wiki" :href="selectedCue.value.concept.datatype.concept.wiki" target="_blank" class="cue-link">Wiki Context</a>
                    <a v-if="selectedCue.value.concept.datatype.concept.rdf" :href="selectedCue.value.concept.datatype.concept.rdf" target="_blank" class="cue-link">RDF Context</a>
                  </div>
                </div>
                
                <div v-if="selectedCue.value.concept.datatype.computational" class="datatype-sub-section mt-2">
                  <div class="section-grid">
                    <div class="grid-item">
                      <span class="label">Measurement:</span> <span>{{ selectedCue.value.concept.datatype.computational.measurement }}</span>
                    </div>
                    <div class="grid-item">
                      <span class="label">Type:</span> <span>{{ selectedCue.value.concept.datatype.computational.datatypeType }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="selectedCue.value.concept.datatype.space" class="datatype-sub-section mt-2">
                   <div class="content-row">
                    <span class="label">Space:</span> <span class="badge">{{ selectedCue.value.concept.datatype.space.concept }}</span>
                  </div>
                </div>

                <div class="datatype-raw mt-2">
                  <button class="toggle-raw-btn" @click="showRawDatatype = !showRawDatatype">
                    {{ showRawDatatype ? 'Hide' : 'Show' }} Raw Datatype
                  </button>
                  <pre v-if="showRawDatatype" class="json-block mt-1">{{ JSON.stringify(selectedCue.value.concept.datatype, null, 2) }}</pre>
                </div>
              </div>
            </div>

            <!-- Space Section -->
            <div v-if="selectedCue.value.space" class="contract-section">
              <h5>Space</h5>
              <div class="section-content">
                <div class="content-row">
                  <span class="label">Context:</span> <span class="badge">{{ selectedCue.value.space.concept }}</span>
                </div>
              </div>
            </div>

            <!-- Computational Section -->
            <div v-if="selectedCue.value.computational" class="contract-section">
              <h5>Computational</h5>
              <div class="section-grid">
                <div class="grid-item">
                  <span class="label">Frequency:</span> <span>{{ selectedCue.value.computational.frequency }}</span>
                </div>
                <div class="grid-item">
                  <span class="label">Confidence:</span> <span>{{ selectedCue.value.computational.confidence }}</span>
                </div>
                <div class="grid-item" v-if="selectedCue.value.computational.color">
                  <span class="label">Color:</span> 
                  <span class="color-swatch" :style="{ backgroundColor: selectedCue.value.computational.color }"></span>
                  <span>{{ selectedCue.value.computational.color }}</span>
                </div>
              </div>
            </div>

            <!-- Time Section -->
            <div v-if="selectedCue.value.time" class="contract-section">
              <h5>Time</h5>
              <div class="section-grid">
                <div class="grid-item">
                  <span class="label">Frequency Count:</span> <span>{{ selectedCue.value.time.frequencyCount }}</span>
                </div>
                <div class="grid-item">
                  <span class="label">Decay Rate:</span> <span>{{ selectedCue.value.time.decayRate }}</span>
                </div>
              </div>
              <div class="timestamp-list">
                <div class="timestamp-item">
                  <span class="label">Created:</span> <span>{{ selectedCue.value.time.createTimestamp }}</span>
                </div>
                <div class="timestamp-item">
                  <span class="label">Last Used:</span> <span>{{ selectedCue.value.time.lastTimestamp }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import AlphabetFilter from '@/components/shared/AlphabetFilter.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { orreryStore } from '@/stores/orreryStore.js'

const storeCues = cuesStore()
const storeAI = aiInterfaceStore()
const storeBentobox = bentoboxStore()
const storeOrrery = orreryStore()
const storeLibrary = libraryStore()

let selectedCue = ref(null)
let showRawDatatype = ref(false)
let cueSelectrel = ref(false)
let liveLetter = ref('')
let activeGlueType = ref('')

/* computed */
const cueConext = computed(() => {
  return storeCues.cueContext
})

const glueHistoryList = computed(() => {
  return storeCues.glueHistory
})

const minCues = computed(() => {
  return storeCues.minCuesStatus
})

const cueKnowledge = computed(() => {
  return storeCues.cueKnowledge
})

const beebeeFeedback = computed(() => {
  return storeAI.cuesFeedback
})

const cuesNetworkList = computed(() => {
  const contracts = storeCues.cuesList
  return [...contracts].sort((a, b) => {
    const nameA = a?.value?.concept?.datatype?.value?.concept?.name || ''
    const nameB = b?.value?.concept?.datatype?.value?.concept?.name || ''
    return nameA.localeCompare(nameB)
  })
})

const filteredCues = computed(() => {
  return storeCues.cuesListFilter
})

const markerContext = computed(() => {
  return storeCues.cueMatchMarkersLive
})

const liveDoughData = computed(() => {
  return storeCues.activeDougnnutData
})

/* methods */
const refreshCues = () => {
  storeCues.refreshGetCues()
}

watch(liveLetter, (newLetter) => {
  if (newLetter === '') {
    storeCues.cuesListFilter = storeCues.cuesList
    return
  }
  storeCues.cuesListFilter = cuesNetworkList.value.filter(cue => {
    const name = cue?.value?.concept?.datatype?.concept?.name
    return name && typeof name === 'string' && name.toLowerCase().charAt(0) === newLetter.toLowerCase()
  })
})

const viewCue = (cueKey, cueR) => {
  selectedCue.value = cueR
}

const viewCueHistory = (cueKey, cueH) => {
  storeCues.activeDougnnutData = cueH.data
}

const bentoSpaceOpen = () => {
  storeCues.cueContext = 'space'
  storeAI.beebeeContext = 'chatspace'
  storeAI.bentospaceState = true
  
  let cueContract = storeCues.cuesList.find(cue => cue.key === storeCues.activeCue)
  
  if (cueContract) {
    storeAI.liveBspace = {
      name: cueContract.value.concept.name,
      spaceid: storeCues.activeCue,
      cueid: storeCues.activeCue,
      gluedown: 'down',
      active: false,
      expand: true
    }
  }
  storeAI.chatAttention = storeCues.activeCue
  storeBentobox.spaceList.push(storeCues.activeCue)
  storeCues.cogGlueSpace(storeCues.activeCue)
}

const cueSegSelect = async (segType, segInfo) => {
  let matchCue = storeCues.matchCueContractLabel(segInfo)
  if (matchCue.key) {
    storeCues.activeCue = matchCue.key
    storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(matchCue.key, matchCue, {})
    storeCues.cueKnowledge = 'concept'
  }
}

const glueType = (type) => {
  storeCues.cueGluePrepare(type)
  activeGlueType.value = type
}

const viewMarker = (mid) => {
  // logic for viewing markers if needed
}

onMounted(() => {
  // Reset cue context when entering library
  storeCues.cueContext = 'cueall'
})
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
