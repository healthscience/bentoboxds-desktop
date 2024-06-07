<template>
  <div id="open-data-tools" v-if="opendataSettingsLive !== false">
    <div id="live-context-datatypes" class="knowledge-item">
      <div id="context-devices" class="live-kelement">
        <header>Devices:</header>
        <label for="devices-select"></label>
        <select class="select-device-id" id="device-mapping-build" v-model="deviceSettings.devices">
          <option value="none" >please select</option>
          <option v-for="dev in opendataSettingsLive.devices">
            {{ dev.NAME }}
          </option>
        </select>
      </div>
    </div>
    <div id="context-compute" class="knowledge-item">
      <header>Compute:</header>
      <label for="compute-select"></label>
      <select class="select-compute-id" id="compute-mapping-build" v-model="deviceSettings.compute">
        <option value="none" >please select</option>
        <option v-for="compL in computeList">
          {{ compL.value.computational.name }}
        </option>
      </select>
    </div>
    <div id="live-context-datatypes" class="knowledge-item">
      <div class="live-dtitem">
        <header>X-axis</header>
        <div v-if="opendataSettingsLive.xaxis.length > 0">
          <label for="xaxis-select"></label>
          <select class="select-xaxis-id" id="xaxis-mapping-build" v-model="deviceSettings.xaxis">
            <option value="none" selected="">please select</option>
            <option v-for="colpair in opendataSettingsLive.xaxis">
            {{ colpair }}
            </option>
          </select>
        </div>
      </div>
      <div class="live-dtitem">
        <header>Y-axis</header>
        <div v-if="opendataSettingsLive.yaxis.length > 0">
          <label for="yaxis-select"></label>
          <select id="yaxis-mapping-build" v-model="deviceSettings.yaxis" multiple>
            <option value="none" selected="">please select</option>
            <option v-for="colpairy in opendataSettingsLive.yaxis">
            {{ colpairy.column }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div id="live-context-category" class="knowledge-item">
      <header>Category</header>
          <div id="cat-items">
            <label for="category-select"></label>
            <select class="select-category-id" id="category-mapping-build" v-model="deviceSettings.category">
              <option value="please" selected="">Please select</option>
              <option v-for="catL in opendataSettingsLive.category">
                {{ catL }}
              </option>
            </select>
          </div>
        <div v-if="feedback.categories" class="feedback">---</div>
    </div>
    <!--<div id="context-time" class="live-kelement knowledge-item">
      <header>Time Period:</header>
          <div id="time-items">
            <label for="time-select"></label>
            <select class="select-time-id" id="time-mapping-build" v-model="deviceSettings.timeperiod">
              <option value="none" selected="">please select</option>
              <option v-for="t in time">
                {{ t.text }}
              </option>
            </select>
          </div>
        <div v-if="feedback.time" class="feedback">---</div>
    </div>
    <div id="context-resolution" class="live-kelement knowledge-item">
      <header>Resolution:</header>
        <div class="live-item"></div>
          <div id="resolution-items">
            <label for="resolution-select"></label>
            <select class="select-resolution-id" id="resolution-mapping-build" v-model="deviceSettings.resolution">
              <option value="none" selected="">please select</option>
              <option v-for="rs in resolution">
                {{ rs.text }}
              </option>
            </select>
          </div>
    </div>-->
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeLibrary = libraryStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let feedback = ref([])
  let deviceSettings = ref( {
      devices: ['mac'],
      xaxis: ['time'],
      yaxis: [],
      category: ''
    })

  /* props */
  const props = defineProps({
    bboxid: String
  })

  /*  computed */
  const deviceList = computed(() => {
    return [{ device_name: 'aaa', device_mac: 'pdodld' }]
  })

  const computeList = computed(() => {
    return storeLibrary.publicLibrary.referenceContracts.compute
  })

 
  const opendataSettingsLive = computed (() => {
    let packKey = Object.keys(storeLibrary.newnxp.packagingLive)
    console.log(storeLibrary.newnxp.packagingLive[packKey].value)
    let packInfo = {}
    packInfo.devices = storeLibrary.newnxp.packagingLive[packKey].value.concept.devicesList
    packInfo.xaxis = ['time'] // storeLibrary.newnxp.packagingLive[packKey].value.concept.
    packInfo.yaxis = storeLibrary.newnxp.packagingLive[packKey].value.concept.tablestructure
    packInfo.category = storeLibrary.newnxp.packagingLive[packKey].value.concept.category
    packInfo.tidy = storeLibrary.newnxp.packagingLive[packKey].value.concept.tidy
    return packInfo
  })


  const resolution = computed(() => {
    let resolutionOptions =  [22, 22, 22]
    return resolutionOptions
  })

</script>

<style scoped>


@media (min-width: 1024px) {

  header {
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  #open-data-tools {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    height: 200px;
    background-color: rgb(224, 227, 243);
    z-index: 4;
  }

  .knowledge-item {
    border: 1px solid rgb(174, 174, 231);
    padding-left: 2em;
  }

  #yaxis-mapping-build {
    height: 80px;
    overflow-y: scroll;
  }
}

</style>