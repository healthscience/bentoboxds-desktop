<template>
  <!-- list of active cue wheels made per account -->
  <div id="cues-available">
    Cues available:
  </div>
  <div id="minimise-cues" v-if="minCues === true">
    <!-- a to z and filter -->
     <div id="filter-cues">
      <div class="filter-alphabet" v-for="letter of alaphabestLetters">
        <button class="filter-letter" @click="filterCuesLetter(letter)" v-bind:class="{ active: liveLetter === letter }">{{ letter }}</button>
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
  <div id="cue-bentobox" v-if="cueKnowledge === 'concept'">
    <!-- produce cue wheel based on active cue -->
    <div id="cue-wheel">
      <pie-chartcues v-if="Object.keys(liveDoughData).length > 0" :chartData="liveDoughData" :options="{}" @segmentClick="cueSegSelect" ></pie-chartcues>
      <div id="beebee-feedback">
        {{ beebeeFeedback }}
      </div>
      <div id="remove-cue">
        <button id="remove-cue-delete" @click="removeCue()">Delete</button>
        <button id="view-cue-button" @click="bentoSpaceOpen()">Space</button>
      </div>
      </div>
    <div id="relationship-glue" v-if="cueSelectrel === false">
      <div id="beebee-rel">
        <div id="connection-glue">
          <button class="glue-btn" @click="glueType('down')">Down</button>
          <button class="glue-btn" @click="glueType('up')">Up</button>
          <button class="glue-btn" @click="glueType('equal')">Equal</button>
          <button class="glue-btn" @click="glueType('measure')">Measure</button>
          <button class="glue-btn" @click="glueType('unknown')">Unknown</button>
          <button class="glue-btn" @click="glueType('compute')">Compute</button>
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
</template>

<script setup>
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { ref, computed, markRaw } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let cueSelectrel = ref(false)
  let liveLetter = ref('')

  /* cumputed */
  const cueConext = computed(() => {
    return storeCues.cueContext
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

  const filterCuesLetter = (letter) => {
    if (letter === liveLetter.value) {
      letter = ''
    }
    liveLetter.value = letter
    // filter cues by first letter
    storeCues.cuesListFilter = storeCues.cuesList.filter(cue => cue.value.concept.name.toLowerCase().charAt(0) === letter.toLowerCase())
  }

  const viewCue = (cueKey, cueR) => {
    // reset any context
    storeCues.cueMatchMarkersLive = [] 
    storeCues.cueKnowledge = 'concept'
    storeCues.activeCue = cueKey
    storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(cueKey, cueR, {})
    // check in other context e.g. flake
    storeCues.glueRelActive = ''
    storeCues.checkCueContext()
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
    storeAI.liveBspace = {
      name: cueContract.value.concept.name,
      spaceid: storeCues.activeCue,
      cueid: storeCues.activeCue,
      gluedown: 'down',
      active: false,
      expand: true
    }
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
  }

</script>


<style scoped>

#minimise-cues {
  display: grid;
  grid-template-columns: 1fr;
}

#minimise-cues-button {
  text-align: end;
  margin-right: 2em;
}

.minimise-cues-button {
  background-color: #b8cde2;
  color: #140d6b;
  border: none;
  border-radius: 4px;
  padding: 6px 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.minimise-cues-button:active {
  background-color: #004494;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
  height: 300px;
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
  display: inline-grid;
}

.filter-letter {
  margin-left: .4em;
}

#cue-bentobox {
  display: grid;
  grid-template-columns: 4fr 1fr 2fr;
  margin: 2em;

}

#relationship-glue {
  border: 0px solid blue;
}

#connection-glue {
  display: grid;
  grid-template-columns: 1fr;
}

.glue-btn {
  margin-bottom: .5em;
}

#cue-markers {
  border: 0px solid red;
  padding: 1em;
}

.marker-button-item {
  margin-bottom: 1em;
}

.marker-button {
  margin-bottom: .5em;
}

.active {
  background-color: rgb(119, 106, 238);
}

@media (min-width: 1024px) {
  #saved-cues {
    height: 300px;
    width: 100%;
    overflow-y: auto;
    margin: 2em;
    border: 1px solid rgb(143, 142, 187);
    padding: .6em;
  }

}

</style>