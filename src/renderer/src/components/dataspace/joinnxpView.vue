<template>
  <div id="nxp-join-nxp" v-for="gmod in genesisNXP.modules">
    <div class="nxp-question" v-if="gmod?.value?.style === 'question'">
      Network Experiment: {{ gmod.value.info.value.concept.name }}
    </div>
    <div id="data-options" v-if="gmod?.value?.style === 'packaging'">
      <!-- select data source -->
      <header class="module-header">Data</header>
      {{ gmod?.value?.info?.value?.concept?.name }}
      <!--<div class="data-select-datasource" v-if="NXPJoinModuleData.length !== 0">
        <div class="data-select-item right">
          <label for="data-select-source">Select Data Contract</label>
        </div>
        <div class="data-select-item peerinput">
          <select class="data-data-source" @change="sourceSelect" v-model="selectJoin.source" id="">Please select
            <option v-for="ds in NXPJoinModuleData" :key="ds.key" v-bind:value="ds.option.key">
              {{ ds.option.value.concept.name }}
            </option>
          </select>
        </div>
      </div>
      <div id="data-source-options" v-if="selectJoin.source.length > 1">
        <div class="data-select-item peerinput">1
          <label class="data-button">Select file to upload</label>
          <input class="data-button" type="file" @change="loadTextFromFile">
        </div>
        <div class="data-select-item peerinput">2
          <button class="data-button" id="networkdata" @click="askHOPDataNXP">Sync data</button>
        </div>
        <div class="data-select-item peerinput">3
          <div id="file-upload-interface" v-if="filebutton === true">
          <button class="data-button" id="uploadfile" @click="uploadFileNXP">Yes, add this file</button>
          </div>
        </div>
        <div class="data-select-item peerinput">4
          <div id="sync-progress-interface" v-if="askDataNXP === true">
            The data will be saved to this accounts datastore. Progress bar
          </div>
        </div>
      </div> -->
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
        {{ gmod?.value?.info?.value?.computational?.name }}
        <!--<chart-builder class="vis-area" v-if="NXPJoinModuleVisualise" :shellID="shellID" :moduleCNRL="moduleCNRL" :moduleType="moduleType" :mData="mData" ></chart-builder>-->
      </div>
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

  // a computed ref
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
    settingsOptions.devices = matchPack.value.info.value.concept.devicesList
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

  const joinNXPBoard = () => {
    // update date settings and prepare private contracts and save in peer library
    let millsDate
    // check date has been selected
    if (boxDate.value !== null) {
      let luxTime = DateTime.local(boxDate.value)
      millsDate = luxTime.toMillis()
      // update compute contract settings
      let settingsJoin = {}
      settingsJoin = storeLibrary.joinOptions
      settingsJoin.time = millsDate
      storeLibrary.prepareJoinNXPMessage(genesisNXP, settingsJoin)
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

  }
</style>