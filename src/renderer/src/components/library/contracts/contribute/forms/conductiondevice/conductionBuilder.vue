<template>
  <div id="source-tools">
    <div class="source-form-item">
      <select class="select-source-id" @change="sourceSelect" v-model="fileType">
        <option value="none" disabled selected>Please select source type</option>
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
        <option value="sqlite">SQLite</option>
        <option value="duckdb">DuckDB</option>
        <option value="hyperdrive">Hyperdrive</option>
        <option value="hyperbee">Hyperbee</option>        
      </select>
    </div>

    <!-- Dynamic Overlay Wizards -->
    <div id="describe-conduction-data" class="conduction-form-item-single" v-if="datasourceLive">
      
      <!-- Describe the shape of the data (SQL, JSON, etc.) -->
      <conduction-exocuedescribe></conduction-exocuedescribe>
      
      <!-- 
        CRITICAL FIX: Pass the actual array of required cues from the contract, 
        NOT the filetype string. Assuming storeLibrary.activeContractCues holds this.
      -->
      <!--<map-cues :requiredCues="storeLibrary.activeContractCues"></map-cues>-->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'
import ConductionDescribe from '@/components/library/contracts/contribute/forms/conductiondevice/conductionDescribe.vue'
import MapCues from '@/components/library/contracts/contribute/forms/conductiondevice/mapCues.vue'

const storeLibrary = libraryStore()
const fileType = ref('none')

const sourceSelect = () => {
  if (fileType.value === 'none') return

  storeLibrary.uploadStatus = true
  storeLibrary.sourceDataSelected = true
  storeLibrary.sourceFiletype = fileType.value
  storeLibrary.newPackagingForm.type = fileType.value
  
  storeLibrary.fileFeedback.columns = []
  
  if (!storeLibrary.newPackagingForm.sourceStrategy) {
    storeLibrary.newPackagingForm.sourceStrategy = {
      driver: fileType.value,
      // Removed hardcoded schema. This will be injected dynamically 
      // by the overlay contract builder when the package is sealed.
      extraction: { columnMap: {} }
    }
  } else {
    storeLibrary.newPackagingForm.sourceStrategy.driver = fileType.value
  }
}


</script>