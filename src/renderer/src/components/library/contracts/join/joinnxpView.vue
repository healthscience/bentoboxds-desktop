<template>
  <div id="nxp-join-nxp" v-for="gmod in genesisNXP.modules">
    <div class="nxp-question" v-if="gmod?.value?.style === 'question'">
      Network Experiment: {{ gmod.value.info.value.concept.name }}
    </div>
    <div id="data-options" v-if="gmod?.value?.style === 'packaging'">
      <!-- select data source -->
      <header class="module-header">Data</header>join state {{ storeLibrary.joinNXP }}
      {{ gmod?.value?.info?.value?.concept?.name }}
      <div>please upload your {{ gmod.value.info.value.concept.path }} file.</div>
      <space-upload v-if="uploadStatus"></space-upload>
      <div class="join-device-select">
        <button @click="querySourceDataDevices(gmod.value.info.value)">Show devices</button>
      </div>
      <div v-if="storeLibrary?.devicesJoin !== undefined">Devices number: {{ storeLibrary.devicesJoin.length }}</div>
    </div>
    <div id="compute-options" v-if="gmod?.value?.style === 'compute'">
      <header class="module-header">Compute</header>
      {{ gmod?.value?.info?.value?.computational?.name }}
      <div class="compute-selection" id="compute-selected">
        <div class="compute-type" id="compute-type-right">
          Computaton selected:
        </div>
        <div class="compute-type peerinput">
          {{  }}
        </div>
      </div>
      <div class="compute-form-item peerinput">
        <div class="date-data-select">
          <div id="data-text-label">
            Select start date for data:
          </div>
        </div>
        <div class="date-data-select peerinput">
          <VueDatePicker class="calendar-view" @open="alertFn" @closed="alertFn" v-model="boxDate"></VueDatePicker>
        </div>
        <!--<label for="compute-add-source">Controls</label>
        <select class="select-compute-source" @change="controlsSave" v-model="newCompute.controls" id="">Please select
          <option value=true>YES</option>
          <option value=false>NO</option>
        </select>
        <label for="compute-add-source">Automation</label>
        <select class="select-compute-automation" @change="automationSave" v-model="newCompute.automation" id="">Please select
          <option value=true>YES</option>
          <option value=false>NO</option>
        </select> -->
      </div>
    </div>
    <div id="visualise-options" v-if="gmod?.value?.style === 'visualise'">
      <!-- preview visualisation -->
      <header class="module-header">Visualisation</header>
      <div id="vis-builder">
        {{ gmod?.value?.info?.value?.computational?.name }} Set default toolbar:
        <!--<chart-builder class="vis-area" v-if="NXPJoinModuleVisualise" :shellID="shellID" :moduleCNRL="moduleCNRL" :moduleType="moduleType" :mData="mData" ></chart-builder>-->
      </div>
      <chart-toolbar></chart-toolbar>
      <opendata-tool :bboxid="'genesis-123579'" :setOptions="settingsOptions"></opendata-tool>
    </div>
  </div>
  <div id="join-button">
    <button id="joinsaveNetworkExperiment" @click.prevent="joinNXPBoard()">Join</button>
    <div id="termsofjoin">
      Terms: a private and autonomous set of contracts will be setup on joining.
    </div>
    <div id="join-feedback" v-if="joinFeedbackActive === true">
      {{ joinFeedback }} -- {{ localFeedback }}
    </div>
  </div>
</template>

<script setup>
import SpaceUpload from '@/components/dataspace/upload/uploadSpace.vue'
import ChartToolbar from '@/components/bentobox/tools/chartBarJoin.vue'
import OpendataTool from '@/components/bentobox/tools/opendataToolsJoin.vue'
import { ref, computed } from 'vue'
import { DateTime, Interval } from 'luxon'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  let boxDate = ref(null)
  let calActive = ref(true)
  let localFeedback = ref('None')

	/* computed */
	const uploadStatus = computed(() => {
    return storeLibrary.uploadStatus
  })

  const genesisNXP = computed(() => {
    // take genNXP id and get full nxp contract
    let nxpGENcontract = storeLibrary.matchGenesisContract(storeLibrary.joinSelected)
    return nxpGENcontract
  })

  const settingsOptions = computed(() => {
    let nxpGENcontract = storeLibrary.matchGenesisContract(storeLibrary.joinSelected)
    let settingsOptions = {}
    let matchPack = {}
    for (let mod of nxpGENcontract.modules) {
      if(mod.value.style === 'packaging') {
        matchPack = mod
      }
    }
    settingsOptions.devices = storeLibrary.devicesJoin // matchPack.value.info.value.concept.devicesList
    settingsOptions.xaxis = ['time'] // matchPack.value.info.value.concept.
    settingsOptions.yaxis = matchPack.value.info.value.concept.tablestructure
    settingsOptions.category = matchPack.value.info.value.concept.category
    return settingsOptions
  })

  const joinFeedbackActive = computed(() => {
    return storeLibrary.joinFeedback
  })

  const joinFeedback = computed(() => {
  })
  
  /* methods */
  const alertFn = () => {
    calActive.value = !calActive.value
  }

  const querySourceDataDevices = (moduleCont) => {
    let messageHOP = {}
    messageHOP.type = 'library'
    messageHOP.action = 'source'
    messageHOP.reftype = 'sqlite' // moduleCont.concept.path
    messageHOP.privacy = 'private'
    messageHOP.task = 'GET'
    messageHOP.data = { query: 'devices', db: moduleCont.concept.filename, table: moduleCont.concept.devicequery }
    // send
    storeLibrary.sendMessage(messageHOP)
  }

  const joinNXPBoard = () => {
    // update date settings and prepare private contracts and save in peer library
    let millsDate
    // check date has been selected
    if (boxDate.value !== null) {
      let luxTime = DateTime.fromJSDate(boxDate.value).startOf('day')
      millsDate = luxTime.toMillis()
      // update compute contract settings
      let controlsJoin = {}
      controlsJoin = storeLibrary.joinOptions
      controlsJoin.time = millsDate
      controlsJoin.tidy = true
      controlsJoin.resolution = 'default'
      storeLibrary.prepareJoinNXPMessage(genesisNXP, controlsJoin, settingsOptions)
    } else {
      // prompt to select date
      storeLibrary.joinFeedback = true
      localFeedback.value = 'Please select a date before joing can complete.'
    }
  }

</script>

<style scoped>

  @media (min-width: 1024px) {

    #nxp-join-nxp {
      display: grid;
      grid-template-columns: 1fr;
      border: 1px solid orange;
      padding: 1em;
    }

    #join-button {
      display: grid;
      grid-template-columns: 1fr;
      border: 2px solid orange;
    }

    #joinsaveNetworkExperiment {
      display: grid;
      grid-template-columns: 1fr;
      justify-self: center;
      width: 30%;
      margin-top: 1em;
    }

    #join-feedback {
      padding: 1em;
      font-size: 1.2em;
      color: red;
    }

  }
</style>