<template>
  <div id="open-data-tools">
    <div id="knowledge-selector">
      <div id="live-context-datatypes" class="knowledge-item">
        <div id="context-devices" class="live-kelement">
          <header>Devices:</header>
          <ul>
            <li>
              <label for="devices-select"></label>
              <select class="select-device-id" id="device-mapping-build" v-model="deviceSettings.devices">
                <option value="none" >please select</option>
                <option v-for="dev in deviceList" :key="dev.device_mac" v-bind:value="dev.device_mac">
                  {{ dev.device_name + ' ' + dev.device_mac }}
                </option>
              </select>
            </li>
          </ul>
        </div>
        <div id="context-compute" class="live-kelement">
          <header>Compute:</header>
          <ul>
            <li>
              <label for="compute-select"></label>
              <select class="select-compute-id" id="compute-mapping-build" v-model="deviceSettings.compute">
                <option value="none" >please select</option>
                <option v-for="compL in refContractsComputeLive" :key="compL.key" v-bind:value="compL.key">
                  {{ compL.value.computational.name }}
                </option>
              </select>
            </li>
          </ul>
        </div>
      </div>
      <div id="live-context-datatypes" class="knowledge-item">
        <ul>
          <li class="live-dtitem">
            <header>X-axis</header>
            <ul>
              <li v-if="refContractPackage?.xaxisSet?.length > 0">
              <label for="xaxis-select"></label>
                <select class="select-xaxis-id" id="xaxis-mapping-build" v-model="deviceSettings.xaxis">
                  <option value="none" selected="">please select</option>
                  <option v-for="colpair in refContractPackage.xaxisSet" :key="colpair.refcontract" v-bind:value="colpair.key">
                  {{ colpair.column }}
                  </option>
                </select>
              </li>
            </ul>
          </li>
          <li class="live-item">
            <header>Y-axis</header>
            <ul v-if="refContractPackage?.yaxisSet?.length > 0">
              <label for="yaxis-select"></label>
              <select multiple="true" class="select-yaxis-id" id="yaxis-mapping-build" v-model="deviceSettings.yaxis">
                <option value="none" selected="">please select</option>
                <option v-for="colpairy in refContractPackage.yaxisSet" :key="colpairy.refcontract" v-bind:value="colpairy.refcontract">
                {{ colpairy.column }}
                </option>
              </select>
            </ul>
            <div v-if="feedback.datatypes" class="feedback">
              ---
            </div>
          </li>
        </ul>
      </div>
      <div id="live-context-category" class="live-kelement knowledge-item">
        <header>Category</header>
          <ul>
            <li id="cat-items">
              <label for="category-select"></label>
              <select  multiple="true" class="select-category-id" id="category-mapping-build" v-model="deviceSettings.category">>
                <option value="please" selected="">Please select</option>
                <option v-for="catL in category" :key="catL.key" v-bind:value="catL.key">
                  {{ catL.name }}
                </option>
              </select>
            </li>
          </ul>
          <div v-if="feedback.categories" class="feedback">---</div>
      </div>
      <div id="context-time" class="live-kelement knowledge-item">
        <header>Time Period:</header>
          <ul>
            <li id="time-items">
              <label for="time-select"></label>
              <select class="select-time-id" id="time-mapping-build" v-model="deviceSettings.timeperiod">
                <option value="none" selected="">please select</option>
                <option v-for="t in time" :key="t.id" v-bind:value="t.id">
                  {{ t.text }}
                </option>
              </select>
            </li>
          </ul>
          <div v-if="feedback.time" class="feedback">---</div>
      </div>
      <div id="context-resolution" class="live-kelement knowledge-item">
        <header>Resolution:</header>
          <div class="live-item"></div>
            <li id="resolution-items">
              <label for="resolution-select"></label>
              <select class="select-resolution-id" id="resolution-mapping-build" v-model="deviceSettings.resolution">
                <option value="none" selected="">please select</option>
                <option v-for="rs in resolution" :key="rs.id" v-bind:value="rs.id">
                  {{ rs.text }}
                </option>
              </select>
            </li>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

const storeBentobox = bentoboxStore()

let refContractsComputeLive = ref([])
let refContractPackage = ref([])
let feedback = ref([])
let category = ref([])
let deviceList = ref([])
let time = ref([])
let resolution = ref('')

/* props */
const props = defineProps({
    bboxid: String
  })


/*  computed */
const deviceSettings = computed(() => {
  return storeBentobox.devicesettings[props.bboxid]
})
</script>

<style scoped>


@media (min-width: 1024px) {

  #open-data-tools {
    display: grid;
    grid-template-columns: 1fr;
    border: 2px solid red;
    height: 200px;
  }

  #knowledge-selector {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;    
  }

  .knowledge-item {
    border: 1px solid blue;
  }
}

</style>