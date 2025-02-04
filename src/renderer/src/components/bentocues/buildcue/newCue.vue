<template>
  <div id="cue-doughnut" class="pie">
    <div id="new-cue-space">
      <form id="add-cue-form" @submit.prevent="cueAdd()">
        <label for="benefit"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
        <input type="input" id="cuenameadd" name="cuename" placeholder="cue name" v-model="cueName" autofocus>
      </form>
      <div id="build-segments">
        <div id="build-datatype">
          <select class="select-dt-library" id="dt-library-list" v-model="datatypeCue" @change="selectDatatypeC()">
            <option selected="" v-for="dtc in referenceDataTypes" :value="dtc">
              {{ dtc.value.concept.name }}
            </option>
          </select>
          <button id="new-datatype" @click="newDatatypeadd()">new datatype</button>
          <div id="new-datatype-contribute" v-if="newDatatype === true">
            <new-datatype></new-datatype>
            <button id="new-datatype-button" @click="contributeDatatype()">Add datatype to library</button>
            <!--
            <form id="add-cue-segment" @submit.prevent="cueAdd()">
              <label for="benefit"></label>
              <input type="input" id="cuesegadd" name="cuepadd" placeholder="segment name" v-model="cueSegment" autofocus>
            </form>-->
          </div>
        </div>
        <ColorPicker v-model:pureColor="pureColor" format="hex" shape="square" />
        <!--<button id="cue-add" type="submit" @click="cueAdd()">
          + cue
        </button>-->
      </div>
    </div>
    <div id="build-cues">
      <div id="new-doughnut-cues">
        <div id="doughnut-size-add">
          <pie-chartcues v-if="cuesNew.labels.length > 0" :cueType="'new'" :chartData="cuesNew" :options="{}" @segmentClick="cueSelectAdd"></pie-chartcues>
        </div>
      </div>
        <!--<div id="sub-wheel" v-if="subNewSeg === true">
          sub segment
          <div id="sub-cue-space">
            Cue segment: {{ subSegLabel }}
            <div id="build-datatype">
              <select class="select-dt-library" id="dt-library-list" v-model="datatypeCueSub" @change="selectDatatypeCSub()">
                <option selected="" v-for="dtc in referenceDataTypes" :value="dtc">
                  {{ dtc.value.concept.name }}
                </option>
              </select>
              <button id="new-datatype" @click="newDatatypeaddsub()">new</button>
              <div id="new-datatype-contribute" v-if="newDatatypesub === true">
                <new-datatype></new-datatype>
                <button id="new-datatype-button" @click="contributeDatatype()">Add datatype to library</button>
              </div>
              <ColorPicker v-model:pureColor="pureColor" format="hex" shape="square" />
              <button id="cue-add-sub" type="submit" @click="cueAddSub()">
                + cue
              </button>
            </div>
            <div id="doughnut-sub-add">
              <pie-chartcues v-if="cuesNewSub.labels.length > 0" :cueType="'new'" :chartData="cuesNewSub" :options="{}" @segmentClick="cueSelectAddSub"></pie-chartcues>
            </div>
          </div>
        </div>
      </div>-->
      <!--<div id="name-cue-wheel">
        OPTI JUV MED
      </div>
      <div id="addMarker">
        <button @click="addSubCue()">Add sub cue</button>
        <button @click="addSegMarker()">Add marker</button>
        <div id="attach-marker" v-if="cueMarkerSelect === true">
          <form id="marker-cue-form" @submit.prevent="cueAttachMarker()">
            <label for="cuemarker"></label>
            <input type="input" id="cuemarker" name="cuemarker" placeholder="marker name" v-model="cueMarker" autofocus>
          </form>
          <button id="cue-add-marker" type="submit" @click="cueAttachMarker()">
            Attach marker
          </button>
          <div id="select-marker-list">
            <select class="select-model-save" id="bbox-model-save" v-model="markerSelected" @change="attachMarker()">
            <option selected="" v-for="ctest in cueMarkerTest" :value="ctest.test">
              {{ ctest.test }}
              </option>
            </select>
            <button id="select-market-cue" @click="attachMarker()"> + marker</button>
          </div>
        </div>
      </div>-->
      <div id="save-cues-network">
        <button id="save-cues-library" @click="saveCue()">Contribute cue</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import hashObject from 'object-hash'
import { ref, computed } from 'vue'
import NewDatatype from '@/components/library/contracts/contribute/forms/newDatatype.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { cuesStore } from '@/stores/cuesStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()

  let cueName = ref('')
  let datatypeCue = ref({})
  let datatypeCueSub = ref({})
  let newDatatype = ref(false)
  let newDatatypesub = ref(false)
  let cueSegment = ref('')
  let pureColor = ref('')
  let cueMarkerSelect = ref(false)
  let cueMarker = ref('')
  let markerSelected = ref('')
  let cuesNew = ref({ labels: [], datasets: [] })
  let cuesNewSub = ref({ labels: [], datasets: [] })
  let subNewSeg = ref(false)
  let subSegLabel = ref('')

  /*  computed  */
  const referenceDataTypes = computed(() => {
    return storeLibrary.publicLibrary.referenceContracts['datatype']
  })

  /* methods */
  const selectDatatypeC = () => {
    cueName.value = datatypeCue.value.value.concept.name
  }

  const newDatatypeadd = () => {
    newDatatype.value = true
  }

  const contributeDatatype = () => {
    // pull together other parts of refcontract
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    refContract.data = storeLibrary.datatypeForm  // ask LLM to prepare ref contract next release tiny LLM
    storeLibrary.sendMessage(refContract)
    newDatatype.value = false
    newDatatypesub.value = false
  }

  const saveCue = () => {
    // did the new cue com from the space menu create button?
    if (storeAI.historyList === 'space') {
      console.log('yes')
      // close the cues tools
      storeAI.bentocuesState = false
    }
    let cueHolder = {}
    cueHolder.name = cueName.value
    cueHolder.contract = datatypeCue.value // ask LLM to prepare ref contract next release tiny LLM
    cueHolder.color = pureColor.value
    storeCues.prepareCueContract(cueHolder)
  }


  // move to relatioship ie wheel spiral building

  const cueAdd = () => {
    let newSegment = { refcontract: datatypeCue.value.key, label: datatypeCue.value.value.concept.name, datasets: { backgroundColor: pureColor.value, data: 30 }}
    // addCueSegment(newSegment)
    cueSegment.value = ''
    newDatatype.value = false
  }

  const cueSelectAdd = (type, seg) => {
    subNewSeg.value = true
    subSegLabel.value = seg.chart.$context.chart.tooltip.dataPoints[0].label
  }


  const addCueSegment = (cSeg) => {
    let updatePie = {}
    updatePie.labels = []
    updatePie.datasets = []
    // current labels
    let currentLabels = cuesNew.value.labels
    let currentDatasets = cuesNew.value.datasets
    let newColor
    let newData
    // new array for color and data
    if (currentDatasets.length === 0) {
      newColor = [cSeg.datasets.backgroundColor]
      newData = [cSeg.datasets.data]
    } else {
      let existing = currentDatasets[0]
      newColor = existing['backgroundColor'].concat([cSeg.datasets.backgroundColor])
      newData = existing['data'].concat([cSeg.datasets.data])
    }
    // add to arrays
    currentLabels.push(cSeg.label)
    currentDatasets = [{ backgroundColor: newColor, data: newData }]
    let updatePieObj = {}
    updatePieObj.labels = currentLabels
    updatePieObj.datasets = currentDatasets
    cuesNew.value = updatePieObj
  }

  const cueAddSub = () => {
    let newSegment = { refcontract: datatypeCueSub.value.key, label: datatypeCueSub.value.value.concept.name, datasets: { backgroundColor: pureColor.value, data: 30 }}
    addCueSegmentSub(newSegment)
    cueSegment.value = ''
    newDatatypesub.value = false
  }


  const addCueSegmentSub = (cSeg) => {
    let updatePie = {}
    updatePie.labels = []
    updatePie.datasets = []
    // current labels
    let currentLabels = cuesNewSub.value.labels
    let currentDatasets = cuesNewSub.value.datasets
    let newColor
    let newData
    // new array for color and data
    if (currentDatasets.length === 0) {
      newColor = [cSeg.datasets.backgroundColor]
      newData = [cSeg.datasets.data]
    } else {
      let existing = currentDatasets[0]
      newColor = existing['backgroundColor'].concat([cSeg.datasets.backgroundColor])
      newData = existing['data'].concat([cSeg.datasets.data])
    }
    // add to arrays
    currentLabels.push(cSeg.label)
    currentDatasets = [{ backgroundColor: newColor, data: newData }]
    let updatePieObj = {}
    updatePieObj.labels = currentLabels
    updatePieObj.datasets = currentDatasets
    cuesNewSub.value = updatePieObj
  }

  const saveCuesWheel = () => {
    // 1 create new datatype ref contract and auto look up wikipedia API if internet 2. save cues info. seperate vis info plus relationship e.g cue name and via cue connection if present
    // uuid for cue wheel
    let cueID = hashObject(cueName.value + new Date())
    let newCue= {}
    newCue.name = cueName.value
    newCue.refdatatype = cueID
    newCue.relationships = cuesNew
    newCue.active = false
    // should add when confirmed by library contracts OK  NB need to remove
    storeCues.cuesList.push(newCue)
    // build data cue holder
    let cueHolder = {}
    cueHolder.refdatatype = cueID // ask LLM to prepare ref contract next release tiny LLM
    cueHolder.name = cueName.value
    cueHolder.relationships = cuesNew.value
    // storeLibrary.sendMessage(refContract)
    // save cues & relationship(s)
    const cueContract = {}
    cueContract.type = 'library'
    cueContract.action = 'cues'
    cueContract.reftype = 'new-cues'
    cueContract.task = 'PUT'
    cueContract.privacy = 'public'
    cueContract.data = cueHolder
    storeLibrary.sendMessage(cueContract)
  }
  
</script>

<style scoped>

#new-cue-space {
  display: grid;
  grid-template-columns: 1fr;
  margin: 2em;
  border: 1px solid lightblue;
  min-height: 80px;
}

#build-segments {
  display: grid;
  grid-template-columns: 8fr 3fr 1fr;
  margin: 2em;
  border: 1px solid lightblue;
  min-height: 80px;
  border: 2px solid red;
}

#dt-library-list {
  width: 80%;
  border: 2px solid blue;
}

input {
  width: 300px;
  font-size: 1.2em;
}

#cue-add {
  height: 2em;
}

#save-cues-network {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
}

#save-cues-library {
  height: 2em;
  width: 200px;
  font-size: 1.2em;
  margin-top: 2em;
  margin-bottom: 2em;
}
@media (min-width: 1024px) {


}
</style>
