<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-data :show="uploadLive" @close="closedataBox">
      <template #header>
        <!-- The code below goes into the header slot -->
        <div id="space-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closedataBox"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="return-modal-close" @click="closedataBox">return</div>
        </div>
        <h3>Data Box</h3>
        <button @click="networkLibraryShow">Library</button>
      </template>
      <template #body>
        <space-upload v-if="uploadLive === true"></space-upload>
        <csv-preview v-if="storeAI.csvpreviewLive === true"></csv-preview>
        <div v-if="showLibrary === true">
          <iframe
            :src="'./xlibrary-test.html'"
            width="90%"
            height="1200px"
            name="networklibrarylive"
            frameborder="0" >
          </iframe>
      </div>
      </template>
      <template #footer>
      </template>
    </modal-data>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalData from '@/components/dataspace/datamodal/dataModal.vue'
import SpaceUpload from '@/components/dataspace/upload/uploadSpace.vue'
import CsvPreview from '@/components/dataspace/upload/csvPreview.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const bboxStore = bentoboxStore()
  const showModal = ref(true)
  const showLibrary = ref(false)

  const networkLibraryShow = () => {
    showLibrary.value = !showLibrary.value
  }
  
  const databoxStatus = computed(() => {
    return storeAI.dataBoxState
  })

  // a computed ref
  const uploadLive = computed(() => {
    return storeAI.uploadStatus
  })

  const closedataBox = () => {
    storeAI.uploadStatus = !storeAI.uploadStatus
  }
</script>

<style scoped>

#space-toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: antiquewhite;
}

#dataBox-holder {
  border: 0px solid red;;
}


#return-modal-close {
  text-align: right;
}

  @media (min-width: 1024px) {

    #dataBox-holder {
      height: 80vh;
      width: 100%;
      overflow: scroll;
    }

    #pace-modal-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    #return-modal-close {
      justify-content: right;
    }


  }

</style>
