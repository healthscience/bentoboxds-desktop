<template>
  <div id="source-tools">
    <div class="source-form-item">
      <select class="select-source-id" @change="sourceSelect" v-model="fileType">
        <option value="none" selected="">Please select</option>
        <!-- <option value="safeNetwork">SAFEnetwork</option> -->
        <!-- <option value="dat">HYERCORE</option> -->
        <!-- <option value="ipfs">IPFS</option> -->
        <option value="rest">REST</option>
        <!-- <option value="grpc">gRPC</option> -->
        <option value="csv">CSV</option>
        <option value="json">JSON</option>
        <option value="sqlite">SQLite</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'
import { ref, computed } from 'vue'

  const storeLibrary = libraryStore()

  // a computed ref

  /* data */

  let fileType = ref('')

  /* methods */
  const sourceSelect = () => {
    if (fileType.value === 'csv') {
      storeLibrary.uploadStatus = !storeLibrary.uploadStatus
      storeLibrary.sourceDataSelected = true
      storeLibrary.newPackagingForm.type = 'csv'
    } else if (fileType.value === 'json') {
      storeLibrary.uploadStatus = !storeLibrary.uploadStatus
      storeLibrary.sourceDataSelected = true
      storeLibrary.newPackagingForm.type = 'json'
    } else if (fileType.value === 'sqlite') {
      storeLibrary.uploadStatus = !storeLibrary.uploadStatus
      storeLibrary.sourceDataSelected = true
      storeLibrary.newPackagingForm.type = 'sqlite'
    } else if (fileType.value === 'rest') {
      storeLibrary.restStatus = true
      // storeLibrary.sourceDataSelected = !storeLibrary.sourceDataSelected
      storeLibrary.newPackagingForm.type = 'rest'
    }
  }

</script>

<style scoped>
@media (min-width: 1024px) {
  #source-tools {
    display: grid;
    grid-template-columns: 1fr;
  }

  .source-form-item {
    width: 100%;
  }

  .select-source-id {
    display: grid;
    justify-content: start;
    width: 300px;
  }
}

</style>
