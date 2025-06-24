<template>
  <!-- Two-column grid layout -->
  <div id="cues-container">
    <!-- Left Column - Chart and Controls -->
    <div id="chart-column">
      <div id="cue-bentobox" v-if="cueKnowledge === 'concept'">
        <!-- produce cue wheel based on active cue -->
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
            <button id="view-cue-button" @click="bentoSpaceOpen()">Space</button>
            <button id="remove-cue-delete" @click="removeCue()">Delete</button>
          </div>
        </div>
        <!-- cognative glue options -->
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
        <!--markers for this cue? -->
        <div id="cue-markers" v-if="markerContext.length > 0 && cueConext !== 'space'">
          <div class="marker-button-item" v-for="mark in markerContext">
            <button class="marker-button" @click="viewMarker(mark)">{{ mark[0].value.concept.name }}</button>
          </div> 
        </div>
      </div>
    </div>
    <!-- Knowledge cues - Filter and List -->
    <div id="cues-column">
      <div id="minimise-cues" v-if="minCues === true">
        <!-- a to z and filter -->
        <div id="filter-cues">
          <div class="filter-alphabet">
            <button class="filter-letter" v-for="letter of alaphabestLetters" @click="filterCuesLetter(letter)" v-bind:class="{ active: liveLetter === letter }">{{ letter }}</button>
            <button id="refresh-cues-btn" @click="refreshCues()">refresh</button>
          </div>
        </div>
        <div id="saved-cues" v-if="cueConext === 'cueall' && cuesNetworkList.length > 0">
          <div id="no-filter" v-if="liveLetter === ''">
            <div class="network-cues" v-for="ncue of cuesNetworkList" :value="ncue">
              <button class="cue-item" @click="viewCue(ncue.key, ncue)">{{ ncue.value.concept.name }}</button>
            </div>
          </div>
          <div v-else>
            <div class="network-cues" v-for="ncue of filteredCues" :value="ncue">
              <button class="cue-item" @click="viewCue(ncue.key, ncue)">{{ ncue.value.concept.name }}</button>
            </div>
          </div>
        </div>
        <div v-else-if="cueConext === 'space'" id="cue-space">
          <button class="cue-item" @click="viewCue(storeAI.liveBspace.spaceid, storeAI.liveBspace)">{{ storeAI.liveBspace.name }}</button>
        </div>
        <!--start sync option -->
        <div id="sync-cues" v-else>
          <div id="sync-message">
            Sync <a href="#" @click="gaiaSyncStart()">Gaia cues</a> or create new cues
          </div>
        </div>
      </div>
      <div id="minimise-cues-button">
        <button class="minimise-cues-button" @click="minimiseCues()">{{ minCueStatus }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { ref, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let cueSelectrel = ref(false)
  let liveLetter = ref('')
  let activeGlueType = ref('')  // Track active glue type

  /* cumputed */
  const cueConext = computed(() => {
    return storeCues.cueContext
  })

  const glueHistoryList = computed(() => {
    return storeCues.glueHistory
  })

  const minCues = computed(() => {
    return storeCues.minCuesStatus
  })

  const minCueStatus = computed(() => {
    return storeCues.minCuesText
  })

  const cueKnowledge = computed(() => {
    return storeCues.cueKnowledge
  })

  const beebeeFeedback = computed(() => {
    return storeAI.cuesFeedback
  })

  const cuesNetworkList = computed(() => {
    // sort into alphabetical order
    const contracts = storeCues.cuesList
    // Sort the contracts by name in ascending order
    const sortedContracts = contracts.sort((a, b) => {
      if (a.value.concept.name < b.value.concept.name) return -1
      if (a.value.concept.name > b.value.concept.name) return 1
      return 0
    })
    return sortedContracts
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

  const alaphabestLetters = computed(() => {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
    return alphabet
  })

  /* methods */
  const gaiaSyncStart = () => {
    // inform library to prepare gaia datatype contracts
    storeCues.prepareGaia()
  }

  const refreshCues = () => {
    // get cues from library store
    storeCues.refreshGetCues()
  }

  const filterCuesLetter = (letter) => {
    if (letter === liveLetter.value) {
      letter = ''
    }
    liveLetter.value = letter
    // filter cues by first letter
    storeCues.cuesListFilter = storeCues.cuesList.filter(cue => cue.value.concept.name.toLowerCase().charAt(0) === letter.toLowerCase())
  }

  const viewCue = (cueKey, cueR) => {
    // update time stamps
    storeCues.updateCueTimestamp(cueKey)
    // reset any context
    storeCues.glueHistory = []
    storeCues.cueMatchMarkersLive = [] 
    storeCues.cueKnowledge = 'concept'
    storeCues.activeCue = cueKey
    storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(cueKey, cueR, {})
    // check in other context e.g. flake
    storeCues.glueRelActive = ''
    storeCues.checkCueContext()
    // storeCues.getMostPopularItems(storeCues.cueMenuHistory)
  }

  const viewCueHistory = (cueKey, cueH) => {
    storeCues.activeDougnnutData = cueH.data
  }

  const minimiseCues = () => {
    if (minCues.value === true) {
      storeCues.minCuesText = 'Show'
    } else {
      storeCues.minCuesText = 'Minimise'
    }
    storeCues.minCuesStatus = !storeCues.minCuesStatus
  }

  const bentoSpaceOpen = (spaceID) => {
    storeCues.cueContext = 'space'
    storeAI.beebeeContext = 'chatspace'
    storeAI.bentospaceState = true
    // mmach to contract and form space structure
    let cueContract = {}
    for (let cue of storeCues.cuesList) {
      if (cue.key === storeCues.activeCue) {
        cueContract = cue
      }  
    }
    // any contract?
    let cueLive = Object.keys(cueContract)
    if (cueLive.length > 0) {
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

  const removeCue = () => {
    // delete cue
    let liveCuesUpdate = []
    for (let cl of storeCues.cuesList) {
      if (cl.key !== storeCues.activeCue) {
        liveCuesUpdate.push(cl)
      }
    }
    storeCues.cuesList = liveCuesUpdate
    // remove wheel data
    storeCues.activeDougnnutData = {}
    // message to HOP to delete cue
    let cueMessage = {}
    cueMessage.type = 'library'
    cueMessage.reftype = 'cue-history'
    cueMessage.action = 'cues'
    cueMessage.task = 'DEL'
    cueMessage.privacy = 'private'
    cueMessage.data = { cueid: storeCues.activeCue }
    cueMessage.bbid = ''
    storeAI.sendMessageHOP(cueMessage)
  }

  const cueSegSelect = async (segType, segInfo) => {
    // match seg to cue contract
    let matchCue = storeCues.matchCueContractLabel(segInfo)
    storeCues.activeCue = matchCue.key
    storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(matchCue.key, matchCue, {})
    // what relationships for this cue?
    storeCues.cueKnowledge = 'concept'

  }

  const glueType = (glueType) => {
    storeCues.cueGluePrepare(glueType)
    activeGlueType.value = glueType  // Update active glue type
  }

  const viewMarker = (mid) => {
    // do nothing for now
  }

</script>

<style scoped>

#cues-container {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  padding: 0.5rem;
  width: 100%;
}

#chart-column {
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
  gap: 1rem;
  padding: 1rem;
}

#cues-column {
  display: grid;
  grid-template-columns: 1fr;
}

#cue-bentobox {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: .1rem;
  padding: .1rem;
  height: 100%;
}

/* Chart Section */
#cue-wheel {
  display: grid;
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#cues-wheel {
  position: relative;
  min-height: 200px;
  margin-bottom: 1rem;
}

#cues-doughnut {
  display: grid;
  grid-template-columns: 1fr;
  height: inherit;
}

#cue-history {
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 1em;
}

#beebee-feedback {
  display: grid;
  grid-template-columns: 1fr;
  height: 80px;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 1rem;
}

#remove-cue {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* Action Buttons */
#remove-cue-delete,
#view-cue-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

#remove-cue-delete {
  background-color: #dc3545;
  color: white;
}

#remove-cue-delete:hover {
  background-color: #c82333;
}

#view-cue-button {
  background-color: #b8cde2;
  color: #140d6b;
}

#view-cue-button:hover {
  background-color: #a1b5d4;
}

/* Cog Glue Section */
#relationship-glue {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#connection-glue {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.glue-btn {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #8f8ebb;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 0.9rem;
}

.glue-btn.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.glue-btn:hover {
  background-color: #b8cde2;
  color: #140d6b;
  transform: translateY(-1px);
}

/* Markers Section */
#cue-markers {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.marker-button-item {
  margin-bottom: 0.5rem;
}

.marker-button {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #8f8ebb;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.marker-button:hover {
  background-color: #b8cde2;
  color: #140d6b;
}

/* Keep existing styles for right column */
#minimise-cues {
  display: grid;
  grid-template-columns: 1fr;
}

#minimise-cues-button {
  text-align: end;
  margin-right: 2em;
}

.minimise-cues-button {
  background-color: #004494;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.minimise-cues-button:hover {
  background-color: #002d62;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.minimise-cues-button:active {
  background-color: #003380;
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.network-cues{
  display: inline-grid;
  margin-top: 1em;
  margin-right: .8em;
}

#sync-message {
  margin: 2em;
}

#saved-cues {
  width: 100%;
  overflow-y: auto;
  margin: 2em;
  border: 1px solid rgb(143, 142, 187);
  padding: .6em;
}

.cue-item {
  display: inline-grid;
  width: 100%;
}

.filter-alphabet {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-letter {
  margin-left: .4em;
}

#refresh-cues-btn {
  display: inline;
  margin-left: 0.4em;
  background-color: #4CAF50;  /* Green background */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

#refresh-cues-btn:hover {
  background-color: #45a049;  /* Slightly darker green on hover */
  transform: translateY(-1px);  /* Slight lift effect */
}

#refresh-cues-btn:active {
  background-color: #388E3C;  /* Even darker green when clicked */
  transform: translateY(0);
}

.active {
  background-color: rgb(119, 106, 238);
}

/* Responsive Adjustments */
@media (min-width: 1024px) {

  #cues-container {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0.5rem;
    width: 100%;
    z-index: 9999;
  }

  #chart-column {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0.5rem;
  }

  #cue-bentobox {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: .1rem;
    padding: .1rem;
  }

  /* Chart Section */
  #cue-wheel {
    display: grid;
    height: 400px;
    border-radius: 8px;
    padding: .5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  #cues-doughnut {
    display: grid;
    grid-template-columns: 1fr;
    height: inherit;
  }

  #beebee-feedback {
    display: grid;
    grid-template-columns: 1fr;
    height: 50px;
    padding: 0.5rem;
    background-color: #f8f9fa;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  #remove-cue {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 24px;
  }

  #connection-glue {
    display: grid;
    grid-template-columns: 1fr;
  }

  #cues-column {
    display: grid;
    grid-template-columns: 1fr;
  }

  #saved-cues {
    width: 100%;
    overflow-y: auto;
    margin: 2em;
    border: 1px solid rgb(143, 142, 187);
    padding: .6em;
  }

  /* Keep existing styles for right column */
  #minimise-cues {
    display: grid;
    grid-template-columns: 1fr;
    width: 90%;
  }

  #minimise-cues-button {
    text-align: end;
    margin-right: 2em;
  }

  .minimise-cues-button {
    background-color: #004494;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .minimise-cues-button:hover {
    background-color: #002d62;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  .minimise-cues-button:active {
    background-color: #003380;
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

}
</style>