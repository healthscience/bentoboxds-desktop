<template>
  <div id="cue-relationships" class="pie">
    <div id="rel-tools">
      Relationships
    </div>
    <div id="save-relationship-btnone">
      <button id="glue-button-one" @click="mapGlue">Glue relationship</button>
    </div>
    <div id="rel-columns">
      <div id="rel-one">
        <div id="select-cue-a">
          Select a Cue
          <AlphabetFilter v-model="filterLetterA" :showReset="true" />
          <div class="cues-list" v-for="whCue in filteredCuesListA">
            <button  v-bind:class="{ active: whCue.contract.key === cueSelect }" @click="selectCue(whCue.contract.key)">{{ whCue.contract.value.concept.datatype.concept.name }}</button>
          </div>
        </div>
        <div id="doughnut-size-add" v-if="columnA === 'cueA'">
          <pie-chartcues v-if="cuesNew.labels.length > 0" :cueType="'view'" :chartData="cuesColA" :options="{}" @segmentClick="cueSelectAdd"></pie-chartcues>
        </div>
      </div>
      <div id="relationship-glue">
        Relationship
        <div id="connection-glue">
          <button class="glue-type" :class="{ active: glueMatch === 'upstream' }" @click="glueType('upstream')">Upstream</button>
          <button class="glue-type" :class="{ active: glueMatch === 'downstream' }" @click="glueType('downstream')">Downstream</button>
          
          <button class="glue-type" :class="{ active: glueMatch === 'resonance' }" @click="glueType('resonance')">Resonance</button>
          
          <button class="glue-type" :class="{ active: glueMatch === 'gauge' }" @click="glueType('gauge')">Gauge</button>
          <button class="glue-type" :class="{ active: glueMatch === 'afferent' }" @click="glueType('afferent')">Afferent</button>
          
          <button class="glue-type" :class="{ active: glueMatch === 'metabolize' }" @click="glueType('metabolize')">Metabolize</button>
          <button class="glue-type" :class="{ active: glueMatch === 'flux' }" @click="glueType('flux')">Flux</button>
        </div>
      </div>
      <div id="rel-two">
        <div id="match-type">
          <div class="match-source" @click="matchStyle('cue')" v-bind:class="{ active: matchType === 'cue' }">Cues</div>
          <div class="match-source" @click="matchStyle('media')">Media</div>
          <div class="match-source" @click="matchStyle('research')">Research</div>
          <div class="match-source" @click="matchStyle('marker')" v-bind:class="{ active: matchType === 'marker' }">Markers</div>
          <div class="match-source" @click="matchStyle('product')">Product</div>
        </div>
        <div id="select-cue-a" v-if="matchType === 'cue'">
          Select a relationship cue
          <AlphabetFilter v-model="filterLetterRel" :showReset="true" />
          <!-- existing cues -->
          <div class="cues-list" v-for="whCue in filteredCuesListRel">
            <button  v-bind:class="{ active: isActiveRel(whCue.contract.key) }" @click="selectCueRel(whCue.contract.key)">{{ whCue.contract.value.concept.datatype.concept.name }}</button>
          </div>
        </div>
        <div id="select-cue-a" v-if="matchType === 'marker'">
          Select a marker
          <!-- existing markers -->
          <div class="cues-list" v-for="mark in markerList">
            <div v-if="mark.value.concept.name">
             <button class="marker-button" v-bind:class="{ active: mark.active === true}" @click="selectMarkerRel(mark.key)">{{ mark.value.concept.name }}</button>
             </div>
          </div>
        </div>
      </div>
    </div>
    <div id="save-relationship-btnone">
      <button id="glue-button-one" @click="mapGlue">Glue relationship</button>
    </div>
    <div id="glue-relationship">
      <div id="glue-wheel">
        <div id="doughnut-size-add" v-if="columnB === true">
          <pie-chartcues v-if="cuesColB?.labels?.length > 0" :cueType="'view'" :chartData="cuesColB" :options="{}" @segmentClick="cueSelectAdd"></pie-chartcues>
        </div>
      </div>
      <button id="glue-type-button" @click="mapGlue">Glue relationship</button>
    </div>
    <div id="beebee-feedback" v-if="feedbackCount > 0">
      {{ feedbackBeeBee }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AlphabetFilter from '@/components/shared/AlphabetFilter.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { cuesStore } from '@/stores/cuesStore.js'
import { CullFaceBack } from 'three/src/constants.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()

  let columnA = ref(false)
  let columnB = ref(false)
  let matchType = ref('cue')
  let glueMatch = ref('')
  let cueSelect = ref('')
  let cueSelectRel = ref([])
  let markerSelectList = ref([])
  let primeCue = ref('')
  let feedbackCount = ref(0)
  let existingRelGlue = ref([])
  let filterLetterA = ref('')
  let filterLetterRel = ref('')

  /*  computed  */
  const feedbackBeeBee = computed(() => {
    return storeAI.cuesRelationshipFeedback
  })

  const cuesColA = computed(() => {
    return storeCues.cueColumnA
  })

  const cuesColB = computed(() => {
    return storeCues.cueColumnB
  })

  const cuesList = computed(() => {
    // sort into alphabetical order
    const contracts = storeCues.cuesList
    // Sort the contracts by name in ascending order
    const sortedContracts = contracts.sort((a, b) => {
      if (a.contract.value.concept.name < b.contract.value.concept.name) return -1
      if (a.contract.value.concept.name > b.contract.value.concept.name) return 1
      return 0
    })
    return sortedContracts
  })

  const markerList = computed(() => {
    // sort into alphabetical order
    const contracts = storeCues.markerList
    // Sort the contracts by name in ascending order
    const sortedContracts = contracts.sort((a, b) => {
      if (a.type < b.type) return -1
      if (a.type > b.type) return 1
      return 0
    })
    return sortedContracts
  })

  const filteredCuesListA = computed(() => {
    const list = cuesList.value
    if (!filterLetterA.value) return list
    const letter = filterLetterA.value.toLowerCase()
    return list.filter(whCue => {
      const name = whCue.contract.value?.concept?.datatype?.concept?.name || ''
      return name.toLowerCase().startsWith(letter)
    })
  })

  const filteredCuesListRel = computed(() => {
    const list = cuesList.value
    if (!filterLetterRel.value) return list
    const letter = filterLetterRel.value.toLowerCase()
    return list.filter(whCue => {
      const name = whCue.contract.value?.concept?.datatype?.concept?.name || ''
      return name.toLowerCase().startsWith(letter)
    })
  })

  /* methods */
  const cueSelectAdd = (type, seg) => {
    let labelA = seg.chart.$context.chart.tooltip.dataPoints[0].label
  }

  const matchStyle = (mstyle) => {
    matchType.value = mstyle
  }

  const selectCue = (cueKey) => {
    // make this cue active in column A
    for(let cue of storeCues.cuesList) {
      if (cue.contract.key === cueKey) {
        cue.state.isActive = !cue.state.isActive
        if (cue.state.isActive === true) { 
          cueSelect.value = cueKey
        } else {
          cueSelect.value = ''
        }
      }
    }
    // pass on info to prepare bentoWheel (categorize doughnut)
  }

const selectCueRel = (cueKey) => {
  for (let c of storeCues.cuesList) {
    if (c.contract.key === cueKey) {
      c.state.isActive = !c.state.isActive
      if (c.state.isActive === true) {
        cueSelectRel.value.push(cueKey)
      } else {
        // Find exactly where this key lives inside cueSelectRel
        const actualIndex = cueSelectRel.value.indexOf(cueKey)
        
        if (actualIndex !== -1) {
          cueSelectRel.value.splice(actualIndex, 1)
        }
      }
      
      // Once found, break out of the loop to save cycles
      break 
    } 
  }
    // first time add or existing?
    /*if (storeCues.cueColumnB.length > 0) {
      let cueRelDisplay = storeCues.cueDisplayBuilder(primeCue.value.key, cueContract, storeCues.cueColumnB[0])
      storeCues.cueColumnB = cueRelDisplay
    } else {
      let cueRelDisplay = storeCues.cueDisplayBuilder(primeCue.value.key, cueContract, storeCues.cueColumnB)
      storeCues.cueColumnB = cueRelDisplay
    }
    columnB.value = true*/
  }

  const isActiveRel = (key) => cueSelectRel.value.includes(key);

  const glueType = (glue) => {
    glueMatch.value = glue
  }

  const selectMarkerRel = (markID) => {
    // make this cue color green ie active
    let updateMarkerList = []
    for (let amark of storeCues.markerList) {
      if (amark.key === markID) {
        let currentSet = amark
        currentSet.active = !currentSet.active
        if (currentSet.active === true) {
          // keep track of relationships
          markerSelectList.value.push(markID)
        } else {
          // remove from selected list
          markerSelectList.value = markerSelectList.value.filter((item) => item !== markID)
        }
        updateMarkerList.push(currentSet)
      } else {
        updateMarkerList.push(amark)
      }
    }
    storeCues.markerList = updateMarkerList
  }

  const mapGlue = () => {
    // loop over to extract keys of mappings
    feedbackCount.value = 0
    storeAI.cuesRelationshipFeedback = {}
    // check three parts exist
    if (cueSelect.value.length === 0) {
      storeAI.cuesRelationshipFeedback.primecue = 'Please select a primary cue'
      feedbackCount.value++
    }
    if (glueMatch.value === '') {
      storeAI.cuesRelationshipFeedback.glue = 'Please select a glue'
      feedbackCount.value++
    }
    if (matchType.value === 'cue') {
      if (cueSelectRel.value.length === 0) {
        storeAI.cuesRelationshipFeedback.cueRel = 'Please cues to map a relationship with'
        feedbackCount.value++
      }
    } else if (matchType.value === 'marker') {
      if (markerSelectList.value.length === 0) {
        storeAI.cuesRelationshipFeedback.markerRel = 'Please markers to map a relationship with'
        feedbackCount.value++
      }
    }
    // all in place proceed
    if (feedbackCount.value === 0) {
      // prepare the relationship depending on glue type
      if (matchType.value === 'cue') {
        let relCueActive = []
        let keyCues = cueSelectRel.value
        let relTriplet = {}
        relTriplet.source = cueSelect.value
        relTriplet.cogglue = glueMatch.value
        relTriplet.target = cueSelectRel.value

        const cueContract = {}
        cueContract.type = 'library'
        cueContract.action = 'cues'
        cueContract.reftype = 'new'
        cueContract.task = 'RELATIONSHIP'
        cueContract.privacy = 'public'
        cueContract.data = relTriplet
        storeLibrary.sendMessage(cueContract)
        // need to update rel cue contract with opposite relationship, e.g  down to up  
        // reset the form
        cueSelect.value = ''
        glueMatch.value = ''
        cueSelectRel.value = []
      } else if (matchType.value === 'marker') {
        let relMarkerActive = markerSelectList.value
        if (markerSelectList.value.length > 0) {
          relMarkerActive = markerSelectList.value
          let relTriplet = {}
          relTriplet.contract = primeCue.value
          let glueRel = {}
          glueRel[glueMatch.value] = relMarkerActive
          relTriplet.relationships = glueRel 
          const cueContract = {}
          cueContract.type = 'library'
          cueContract.action = 'cues'
          cueContract.reftype = 'relationship'
          cueContract.task = 'UPDATE'
          cueContract.privacy = 'public'
          cueContract.data = relTriplet
          storeLibrary.sendMessage(cueContract)
          // need to update rel cue contract with opposite relationship, e.g  down to up  
          // reset the form
          let resetMarkerList = []
          for (let amark of storeCues.markerList) {
            amark.active = false
            resetMarkerList.push(amark)
          }
          storeCues.markerList = resetMarkerList
        }
        primeCue.value = {}
      }
      // clear those selected
      matchType.value = ''
    } else {
      console.log('incomplete relationship')
    }
  }

</script>

<style scoped>

#cue-relationships {
  display: grid;
  grid-template-columns: 1fr;
  margin: 2em;
}

#rel-columns {
  display: grid;
  grid-template-columns: 1fr;  
}

#relationship-glue {
  display: grid;
  align-content: start;
}

#connection-glue {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 2em;
  margin-left: 1em;
  margin-right: 1em;
}

#glue-relationship {
  justify-self: center;
}

#glue-type-button {
  margin-top: 1em;
  font-size: 1.2em;
}

#match-type {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  margin-bottom: 1em;
}

.match-source {
  border: 1px solid lightblue;
  margin-left: .6em;
  margin-right: .6em;
  padding-left: .6em;
  padding-right: .6em;
}

.expand-wheel {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid lightblue;
  margin-left: 1em;
  margin-bottom: .4em;
  cursor: pointer;
}

.glue-type {
  margin-bottom: 1em;
  margin-right: .6em;
  padding-right: .6em;  
}

.marker-button {
  margin-bottom: .6em;
  margin-right: .6em;
  padding-right: .6em;
}

#save-relationship-btnone {
  display: grid;
  grid-template-columns: 1fr;
  justify-self: end;
  width: 120px;
  height: 30px;
  font-size: 1.2em;
  margin: .1em;
}

.active {
  background-color: rgb(113, 172, 114);
}

@media (min-width: 1024px) {

  #rel-columns {
    display: grid;
    grid-template-columns: 4fr 1fr 4fr;
    border: 2px solid rgb(188, 190, 212);
    min-height: 200px;
  }

  #rel-one {
    border: 1px solid rgb(138, 138, 185);
    padding: .5em;
  }

  #rel-two {
    border: 1px solid rgb(138, 138, 185);
    padding: .5em;
  }

  #relationship-glue {
    display: grid;
    grid-template-columns: 1fr;
    border: 2px solid rgb(164, 165, 190);
    padding: .5em;
  }

}
</style>