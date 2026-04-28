<template>
  <div class="chart-message">
    <!-- interactive messages -->
    <div id="bentobox-view" v-if="messageType === 'datatype'">
      <span>Datatype: {{ message.data.library.text }} for month {{ message.data.time.words.day }} day {{ message.data.time.words.month }}</span>---
      <button id="new-query" @click.prevent="beebeeChartSpace(message.data)">yes, produce chart</button>
    </div>
    <div v-else-if="messageType === 'experiment'">
      <button @click="viewSaveExperiment(bboxid, 'need to add')">View experiment</button>
    </div>
    <div v-else-if="messageType === 'network-library-n1'">
      {{ message?.data?.text?.boardname }}<button @click="publibLibAdd(message.data.text)"> yes add this Cue space to public library</button>
    </div>
    <!-- now build a bentox-->
    <div id="beebee-chartspace" v-if="storeBentobox.beebeeChatLog[bboxid] === true && storeBentobox.bentoboxData[bboxid].datasets[0]?.data !== undefined">
      <bento-box :bboxid="bboxid"></bento-box>
    </div>
    <!--<div v-else-if="message?.data?.text !== undefined && message?.data?.text.length > 0">
      {{ message?.data?.text }}
      <bento-box :bboxid="message?.bbid"></bento-box>
    </div> -->
  </div>
</template>

<script setup>
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import BentoBox from '@/components/bentobox/baseBox.vue'

const props = defineProps({
  bboxid: String,
  status: String,
  messageType: String,
})

const storeAI = aiInterfaceStore()
const storeLibrary = libraryStore()
const storeBentobox = bentoboxStore()

const viewSaveExperiment = (bbid, contractID) => {
  storeLibrary.prepareLibraryViewFromContract(bbid, contractID)
}

const publibLibAdd = (board) => {
  storeLibrary.confrimAddPublicLibrary(board.data)
}

const beebeeChartSpace = (data) => {
  // Implement the chart space functionality
  console.log('Chart space data:', data)
}
</script>

<style scoped>
.chart-message {
  padding: 1em;
  background-color: #e6f7ff;
  border-radius: 8px;
  margin: 0.5em 0;
  font-size: 14px;
}

#beebee-chartspace {
  display: grid;
  grid-template-columns: 1fr;
  width: 80%;
  height: auto;
}
</style>