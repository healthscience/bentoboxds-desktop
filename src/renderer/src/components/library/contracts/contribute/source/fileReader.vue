<template>
  <div id="file-system">
    <source-modal v-show="sourceActive === true" :saveMessage="fileStatus" @close="closeSourceModal">
      <template v-slot:header>
        <!-- The code below goes into the header slot -->
        <button
          type="button"
          class="btn-green"
          @click="closeSourceModal"
          aria-label="Close modal"
        >
          Close
        </button>
      </template>
      <template v-slot:source-file>
        <div id="file-container">
          <div id="file-utility">
            <header>FILE CONTENT</header>
            <div class="file-section">
              <label class="file-select">Read file</label>
              <input type="file" @change="loadTextFromFile">
            </div>
            <div class="file-section">
              <label class="file-select">or enter url location:</label>
            </div>
            <div class="file-section" id="web-file-path">
              <input type="text" v-model="readRemotefile">
              <button @click="getRemotefile">read url file</button>
            </div>
            <div class="file-section" id="summary-content">
              <ul v-for="(value, index) in linesLimit" :key="value.id">
                <li><b>{{index }}</b> {{ value }}</li>
              </ul>
            </div>
          </div>
          <div class="convert-section" id="convert-data" v-if="linesLimit.length > 0">
            <form class="file-info">
              Please enter:
              <div class="file-info-label">
                <label for="linenumber">column names line number</label>
                <input type="text" v-if="lineBundle.cnumber">
              </div>
              <div class="file-info-label">
                <label for="dataline">Data start line number</label>
                <input type="text" v-model="lineBundle.dataline">
              </div>
              <div class="file-info-label">
                <label for="seperator">Seperator type</label>
                <input type="text" placeholder="comma tab other" v-model="lineBundle.delimiter">
              </div>
              <div class="file-info-label">
                <label for="datename">Date column</label>
                <input type="text" v-model="lineBundle.datename">
              </div>
              <div class="file-info-label">
                <label for="datetype">Type of date</label>
                <input type="text"  v-model="lineBundle.datetype">
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
    </source-modal>
  </div>
</template>

<script setup>
import SourceModal from '@/components/library/contracts/contribute/source/sourceModal.vue'
import axios from 'axios'

import {ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  let linesLimit = ref([])

  const props = defineProps({
    sourceType: String,
    sourceActive: Boolean,
    saveMessage: Boolean
  })

  // a computed ref
  const fileStatus = computed(() => {
    return storeLibrary.fileSaveStatus
  })

  const fileFeedback = computed(() => {
    return storeLibrary.fileFeedback
  })

</script>

<style scoped>
#file-system {
  display: grid;
  grid-template-columns: 1fr;
}

#file-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
}

.file-section {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 1em;
}

.file-section input {
  font-size: 1.2em;
  margin: 0 auto 1em auto;
}

.file-section input.web-path-file {
  width: 20em;
}

.file-select {
  font-size: 1.2em;
}

#web-file-path input {
  width: 30em;
}

#web-file-path button {
  width: 6em;
  margin: 0 auto 1em auto;
  font-size: 1.2em;
}

.url-remote-file {
  font-size: 1.2em;
  margin: 0 auto 1em auto;
  width: 8em;
  font-size: 1.2em;
}

form.file-info {
  font-size: 1.2em;
}

.file-info-label {
  display: grid;
  grid-template-columns: 1fr 1fr;
  line-height: 1.2em;
  margin-bottom: .5em;
}

.file-info-label label {
  justify-self: end;
  margin-right: 1em;
}

.file-info-label input {
  width: 40%;
}

.convert-button {
  margin: 1em;
  font-size: 1.2em;
}

#summary-content {
  height: 600px;
  overflow: scroll;
  background-color: lightgrey;
}

#feedback-save {
  display: grid;
  grid-template-columns: 1fr;
  border: 4px dashed orange;

}

.file-feedback-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-bottom: 1em;
}

.file-detail-info {
  justify-self: end;
  margin-right: 1em;
}

.file-detail-data {
  justify-self: start;
  font-weight: bold;
}

#convert-data {
  border: 1px solid red;
  margin-top: 15em;
}
</style>
