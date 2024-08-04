<template>
  <div id="length-summary">
    csv viewer length = {{ summarydata?.length }}
  </div>
  <div id="data-viewer">
    <div class="csv-section" id="summary-content">
      <ul v-for="(value, index) in summarydata" :key="value.id">
        <li><b>{{index }}</b> {{ value }}</li>
      </ul>
    </div>
    <div class="convert-section" id="convert-data" v-if="summarydata?.length > 0">
      <form class="file-info">
        Please enter:
        <div class="file-info-label">
          <label for="linenumber">Column names:</label>
          <input type="text" placeholder="line number" v-model="storeLibrary.lineBundle.cnumber">
        </div>
        <div class="file-info-label">
          <label for="dataline">Data start:</label>
          <input type="text" placeholder="line number" v-model="storeLibrary.lineBundle.dataline">
        </div>
        <div class="file-info-label">
          <label for="seperator">Seperator type:</label>
          <input type="text" placeholder="comma tab other" v-model="storeLibrary.lineBundle.delimiter">
        </div>
        <div class="file-info-label">
          <label for="datename">Date column:</label>
          <input type="text" v-model="storeLibrary.lineBundle.datename">
        </div>
        <div class="file-info-label">
          <label for="datetype">Type of date:</label>
          <input type="text" v-model="storeLibrary.lineBundle.datetype">
        </div>
      </form>
      <button class="convert-button" @click="saveDatafromFile">Save describe</button>
      <button class="beebee-ask-button" @click="askBeeBeeConvert">Ask AI to describe data</button>
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
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore() 

  const props = defineProps({
    summarydata: Array
  })



  const fileStatus = ref(false)
  let fileFeedback = ref('file feedback')

  const saveDatafromFile = () => {
    let localFile = {}
    localFile.name = storeLibrary.fileBund.name
    localFile.info = storeLibrary.lineBundle
    localFile.content = storeLibrary.fileBund.content
    localFile.type = storeLibrary.newPackagingForm.type
    // prepare message structure
    let messageHOP = {}
    messageHOP.type = 'library'
    messageHOP.action = 'contracts'
    messageHOP.reftype = 'save-file'
    messageHOP.privacy = 'private'
    messageHOP.task = 'PUT'
    messageHOP.data = localFile
    // send to HOP
    storeLibrary.sendMessage(messageHOP)
    storeLibrary.csvpreviewLive = false
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