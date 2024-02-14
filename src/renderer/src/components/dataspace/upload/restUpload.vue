<template>
  <div id="rest-api">
    <div class="file-section">
      <label for="add-code-name">API address</label>
      <input type="text"  id="mapping-base-address" placeholder="https://" required @change="apibaseSave" v-model="storeLibrary.baseapi" />
    </div>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'

import { computed } from 'vue'

  const storeLibrary = libraryStore()

const props = defineProps({
  sourceType: String,
  sourceActive: Boolean,
  saveMessage: Boolean
})

  /* methods */
  const apibaseSave = () => {
    let localFile = {}
    localFile.api = storeLibrary.baseapi
    let messageHOP = {}
    messageHOP.type = 'library'
    messageHOP.action = 'contracts'
    messageHOP.reftype = 'save-file'
    messageHOP.privacy = 'private'
    messageHOP.task = 'PUT'
    messageHOP.data = localFile
    // send to HOP
    storeLibrary.sendMessage(messageHOP)
    storeLibrary.restStatus = false
  }

</script>

<style scoped>

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
  line-height: 1.4em;
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
  height: 100px;
  overflow: scroll;
  background-color: lightgrey;
}

#feedback-save {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px dashed orange;
  margin-bottom: 2em;
}

#file-save-feedback {
  display: grid;
  grid-template-columns: 1fr;
}

.file-feedback-info {
  padding-bottom: 1em;
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

</style>
