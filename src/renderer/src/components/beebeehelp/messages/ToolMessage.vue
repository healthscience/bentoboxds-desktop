<template>
  <div class="tool-message">
    <div v-if="message.type === 'upload'">
      {{ message?.data?.text }}
      <button id="upload-button" @click="uploadButton">Click to upload file</button>
    </div>
    <div v-else-if="message.type === 'library-peerlibrary'">
      <button @click="openLibrary">open library</button>
    </div>
    <div v-else-if="message.action === 'library'">
      <button @click="openLibrary">open library</button>
    </div>
    <div v-else>
      <div v-if="message.type === 'feedback'">
        <div class="text-feedback">{{ message?.data?.text }}</div>
      </div>
      <div v-if="message.action === 'upload'">
        <button id="upload-button" @click="uploadButton">Click to upload file</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

const props = defineProps({
  message: Object
})

const storeAI = aiInterfaceStore()
const storeLibrary = libraryStore()

const uploadButton = () =>  {
  storeAI.dataBoxStatus = true
  storeLibrary.uploadStatus = true
  storeLibrary.libraryStatus = false
}

const openLibrary = () => {
  storeAI.dataBoxStatus = true
  storeAI.uploadStatus = false
  storeLibrary.libraryStatus = true
}
</script>

<style scoped>
.tool-message {
  padding: 1em;
  background-color: #f0f0f0;
  border-radius: 8px;
  margin: 0.5em 0;
}

.text-feedback {
  color: #333;
}
</style>