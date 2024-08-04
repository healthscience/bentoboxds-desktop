<template>
  <div id="chart-toolbar">
    <div class="network-tools">
      <div id="chart-options">
        <div class="chart-calendar-update">
          <select v-model="selectedTimeFormat" @change.prevent="setTimeFormat()">
            <option class="data-vis-action" v-for="tfoption in timeformatoptions" v-bind:value="tfoption.value" :key='tfoption.id' :selectedd="selectedChartnumber">
            {{ tfoption.text }}
            </option>
          </select>
        </div>
        <div>
          <button class="data-vis-action" @click.prevent="labelsSelect()">Labels</button>
          <button class="data-vis-action" @click.prevent="tidySelect()"  v-bind:class="{ active: tidyData }">Tidy</button>
        </div>
      </div>
    </div>
    <div id="chart-style-tools" class="network-tools">
        <button class="chart-type" @click.prevent="chartSelect()">Bar</button>
        <button class="chart-type" @click.prevent="chartSelect()">Line</button>
        <button class="chart-type" @click.prevent="chartSelect()">Simulation</button>
        <button class="chart-type" @click.prevent="chartSelect()">Table</button>
      <!--<li>
        <button @click.prevent="chartSelect()">Mixed</button>
      </li>
      <div>
        <button @click.prevent="labelsSelect()">Labels</button>
      </div>-->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { accountStore } from '@/stores/accountStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  
  const selectedChartnumber = ref('singlechart')
  const tidyData = ref(false)

  const props = defineProps({
    bboxid: String
  })

const timeformatoptions = ref([
  { text: 'Time series', value: 'timeseries', id: 0 },
  { text: 'Overlay', value: 'overlay', id: 1 }
])

const selectedTimeFormat = ref('timeseries')

/* methods */
const openDataToolbar = () => {
 // storeBentobox.boxToolStatus[props.bboxid].opendatatools.active = !storeBentobox.boxToolStatus[props.bboxid].opendatatools.active
 storeBentobox.bbToolbarOpendata[props.bboxid] = !storeBentobox.bbToolbarOpendata[props.bboxid]
 storeAI.prepareLibrarySummary(props.bboxid)
}

const viewNetworkGrpah = () => {
  storeBentobox.networkGraph = !storeBentobox.networkGraph
}

const viewMap = () => {
  storeBentobox.geoMap = !storeBentobox.geoMap
}

const setTimeFormat = () => {
  console.log('set time format')
}

const labelsSelect = () => {
  // this.liveData.data.chartOptions.legend.display = !this.liveData.data.chartOptions.legend.display
  let legendContext = {}
  legendContext.shellID = '' // this.shellID
  legendContext.moduleCNRL = '' // this.moduleCNRL
  legendContext.moduleType = '' // this.moduleType
  legendContext.mData = '' // his.mData
  // this.$store.dispatch('actionLegendStatus', legendContext)
}

const tidySelect = () => {
  tidyData.value = !tidyData.value
  libraryStore.tidyOption = tidyData.value
  // get the modules to update HOPquery
  storeAI.prepareLibrarySummary(props.bboxid)
  let entityID = Object.keys(storeAI.boxLibSummary[props.bboxid].data)
  // match box to HOPid
  let matchHOPid = ''
  for (let hpbid of storeAI.bbidHOPid) {
    if (hpbid.bbid === props.bboxid) {
      matchHOPid = hpbid.HOPid
    }
  }
  let existingNXP = {}
  for (let summaryMatch of storeAI.hopSummary) {
    if (summaryMatch.HOPid === matchHOPid) {
      existingNXP = summaryMatch.summary
    }
  }
  let expID = Object.keys(existingNXP.data)
  // prepare structure for updates
  // any settings changes?
  let moduleUpdate = {}
  let computeChanges = { controls: { tidy: tidyData.value } }
  moduleUpdate['compute'] = computeChanges
  // prepare HOPquery
  let HOPcontext = {}
  HOPcontext.entityUUID = matchHOPid
  HOPcontext.bbid = props.bboxid
  HOPcontext.exp = { key: matchHOPid, update: existingNXP.data }
  HOPcontext.update = {}
  let updateECS = {}
  updateECS.entityUUID = matchHOPid
  updateECS.input = 'refUpdate'
  updateECS.modules = existingNXP.data[expID].modules
  updateECS.changes = moduleUpdate
  HOPcontext.update = updateECS
  storeLibrary.updateHOPqueryContracts(HOPcontext)
}

const chartSelect = () => {
  console.log('char ttype')
}

/*  computed */
const boxSettings = computed(() => {
  return storeBentobox.boxToolStatus[props.bboxid]
})

const visToolbarStatus = computed(() => {
  return storeBentobox.bbToolbarOpendata[props.bboxid]
})

</script>


<style scoped>

#vis-tools {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  background-color:rgb(224, 227, 243);
  z-index: 12;
}

@media (min-width: 1024px) {

  #vis-tools {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 1fr 1fr;
  }

  #grap-map {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .network-tools {
    border: 1px solid rgb(171, 171, 227);
  }

  .context-network {
    margin-top: 1em;
    margin-left: 2em;
  }

  .data-vis-action, .chart-calendar-update {
    margin-left: 10px;
  }

  .active {
    background-color: rgb(113, 172, 114);
    border: 1px solid green;
  }
}

</style>