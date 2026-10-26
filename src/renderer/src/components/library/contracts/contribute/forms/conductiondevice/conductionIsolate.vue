<template>
  <div id="conduction-isolated-builder">
    <h3>Upload an example data file</h3>
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

    <!-- Step : Upload Radia Payload -->
    <div id="file-agent" v-if="uploadStatus === true">
      <upload-space :inline="true" @upload-sent="handleUploadSent"></upload-space>
      <div v-if="fileMatch?.success === true" class="upload-success-message">
        ✅ {{ fileIDoutgoing }} uploaded
      </div>
    </div>

    <!-- allow to add path to example -->
    <div id="overlay-source-path">
      <label for="conduction-source-path">Example source:</label>
      <input 
        id="conduction-source-example" 
        v-model="storeLibrary.newConductionForm.sourcepath" 
        placeholder="hyperdrive address" 
        required 
        type="text"
      >
    </div>

    <!-- emulation scale -->
    <div id="emulation-scale">
      <label for="conduction-emulation">Emulation:</label>
      <select 
        id="conduction-emulation" 
        v-model="storeLibrary.newConductionForm.emulation" 
        required
        @change="changeEmulationWorld()"
      >
        <option value="" disabled selected>Please select emulation scale</option>
        <option value="body-full">body-full</option>
        <option value="body-organ">body-organ</option>
        <option value="body-cell">body-cell</option>
        <option value="environment">environment</option>
        <option value="bioregion">bioregion</option>
      </select>
    </div>

    <!-- Step 2: Parse and Describe Payload Structure -->dd {{ datasourceLive }}
    <div id="conduction-viewer" v-if="datasourceLive === true">
      <div id="data-viewer">
          <conduction-data :extractedData="conductionData"></conduction-data>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { useOverlayStore } from '@/stores/overlayStore.js'
import UploadSpace from '@/components/dataspace/upload/uploadSpace.vue'
import ConductionData from '@/components/library/contracts/contribute/forms/conductiondevice/OverlayDataBuilder.vue'

const storeAI = aiInterfaceStore()
const storeLibrary = libraryStore()
const storeOverlay = useOverlayStore()

const fileType = ref('none')
const fileIDoutgoing = ref('')

/* computed */
const datasourceLive = computed(() => storeLibrary.sourceDataSelected)

const uploadStatus = computed(() => {
  return storeLibrary.uploadStatus
})

const conductionData = computed(() => {
  return storeOverlay.newOverlayContractLive
})


const sourceSelect = () => {
  // set file context to new overlay
  storeLibrary.newFileIntent = 'overlay-data'
  if (fileType.value === 'none') return

  storeLibrary.uploadStatus = true
  storeLibrary.sourceDataSelected = true
  storeLibrary.sourceFiletype = fileType.value
  storeLibrary.newConductionForm.type = fileType.value
  storeLibrary.fileFeedback = []
  
}

const changeEmulationWorld = () => {
  console.log('world change')
    if (storeLibrary.newConductionForm.emulation === 'body-full') {
      storeAI.activeWorld = 'body'
    } else if (storeLibrary.newConductionForm.emulation === 'body-organ') {
      storeAI.activeWorld = 'body'
    } else if (storeLibrary.newConductionForm.emulation === 'body-cell') {
      storeAI.activeWorld = 'body'
    } else if (storeLibrary.newConductionForm.emulation === 'environment') {
      storeAI.activeWorld = 'earth'
    } else if (storeLibrary.newConductionForm.emulation === 'bioregion') {
      storeAI.activeWorld = 'earth'
    } else {
      storeAI.activeWorld = 'orbit'
    }
}

const handleUploadSent = (payload) => {
  fileIDoutgoing.value = payload.fileBundle.name
}

const fileMatch = computed(() => {
  let fileSavedMatch = storeLibrary.fileSaveList.find(
    f => f.file.name === fileIDoutgoing.value
  );
  return fileSavedMatch
})

</script>

<style scoped>
#conduction-isolated-builder {
  padding: 1.5em;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
.upload-success-message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
}

#file-agent {
  display: grid;
  grid-template-columns: 1fr;
}

#conduction-viewer {
  display: grid;
  grid-template-columns: 1fr;  
}

</style>