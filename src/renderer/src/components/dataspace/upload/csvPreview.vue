<template>csv fiewer {{ storeAI.linesLimit?.length }}
  <div id="data-viewer">
    <div class="csv-section" id="summary-content">
      <ul v-for="(value, index) in storeAI.linesLimit" :key="value.id">
        <li><b>{{index }}</b> {{ value }}</li>
      </ul>
    </div>
    <div class="convert-section" id="convert-data" v-if="storeAI.linesLimit?.length > 0">
      <form class="file-info">
        Please enter:
        <div class="file-info-label">
          <label for="linenumber">Column names:</label>
          <input type="text" placeholder="line number" v-model="lineBundle.cnumber">
        </div>
        <div class="file-info-label">
          <label for="dataline">Data start:</label>
          <input type="text" placeholder="line number" v-model="lineBundle.dataline">
        </div>
        <div class="file-info-label">
          <label for="seperator">Seperator type:</label>
          <input type="text" placeholder="comma tab other" v-model="lineBundle.delimiter">
        </div>
        <div class="file-info-label">
          <label for="datename">Date column:</label>
          <input type="text" v-model="lineBundle.datename">
        </div>
        <div class="file-info-label">
          <label for="datetype">Type of date:</label>
          <input type="text" v-model="lineBundle.datetype">
        </div>
      </form>
      <button class="convert-button" @click='convertJSON'>SAVE</button>
      <div id="feedback-save">
        <div id="file-save-feedback" v-if="fileStatus === true">
          <div class="file-feedback-info">
            Conversion and save successful
          </div>
          <div>
            File save info:
            <div class="file-feedback-summary">
              <div class="file-detail-info">
                PATH:
              </div>
              <div class="file-detail-data">
                {{ fileFeedback.path }}
              </div>
            </div>
            <div class="file-feedback-summary">
              <div class="file-detail-info">
                COLUMNS:
              </div>
              <div class="file-detail-data">
                {{ fileFeedback.columns }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
 
const storeAI = aiInterfaceStore()
const bbliveStore = bentoboxStore()

  /* const props = defineProps({
    linesList: Array
  }) */

  // let linesLimit = ref([])
  const fileStatus = ref(false)

  let lineBundle = ref(
    {
      cnumber: '',
      dataline: '',
      delimiter: '',
      datetype: ''
    })

  let fileFeedback = ref('file feedback')

  const convertJSON = () => {
    let localFile = bbliveStore.fileBund
    localFile.info = lineBundle.value
    console.log(localFile)
    // prepare message structure
    let messageHOP = {}
    messageHOP.type = 'library'
    messageHOP.reftype = 'save-file'
    messageHOP.action = 'save-file'
    messageHOP.data = localFile
    // send to HOP
    console.log('before message send')
    storeAI.sendMessageHOP(messageHOP)
    storeAI.csvpreviewLive = false
  }

</script>

<style scoped>

#data-viewer {
  display: grid;
  grid-template-columns: 1fr;
}

.file-info-label  {
  display: grid;
  grid-template-columns: 2fr 1fr;
}

@media (min-width: 1024px) {
  #data-viewer {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 5%;
  }
}

</style>