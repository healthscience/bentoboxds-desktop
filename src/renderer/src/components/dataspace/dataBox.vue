<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-data :show="dataBoxStatus" @close="closedataBox">
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
        <button @click="nxpLibraryPeer">Experiments</button>
        <button @click="nxpAdd">+ new NXP</button>
      </template>
      <template #body>
        <space-upload v-if="uploadStatus === true"></space-upload>
        <rest-upload v-if="restStatus === true"></rest-upload>
        <csv-preview v-if="storeLibrary.csvpreviewLive === true"></csv-preview>
        <div v-if="libraryStatus === true">
          <network-library></network-library>
        </div>
        <library-view v-if="storeLibrary.libPeerview === true"></library-view>
        <newnxp-view v-if="storeLibrary.newNXP === true"></newnxp-view>
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
import RestUpload from '@/components/dataspace/upload/restUpload.vue'
import CsvPreview from '@/components/dataspace/upload/csvPreview.vue'
import NetworkLibrary from '@/components/library/index.vue'
import LibraryView from '@/components/dataspace/libraryNXPView.vue'
import NewnxpView from '@/components/dataspace/newnxpView.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAI = aiInterfaceStore()
  const bboxStore = bentoboxStore()
  const storeLibrary = libraryStore()
  const showModal = ref(true)
  
  const uploadStatus = computed(() => {
    return storeLibrary.uploadStatus
  })

  const restStatus = computed(() => {
    return storeLibrary.restStatus
  })


  const dataBoxStatus = computed(() => {
    return storeAI.dataBoxStatus
  })

  // a computed ref
  const uploadLive = computed(() => {
    return storeLibrary.uploadStatus
  })

  const libraryStatus = computed(() => {
    return storeLibrary.libraryStatus
  })

  const closedataBox = () => {
    storeAI.dataBoxStatus = !storeAI.dataBoxStatus
    storeLibrary.uploadStatus = false
  }

  const networkLibraryShow = () => {
    storeLibrary.libraryStatus = !storeLibrary.libraryStatus
  }

  const nxpLibraryPeer = () => {
    storeLibrary.libPeerview = !storeLibrary.libPeerview
  }

  const nxpAdd = () => {
    storeLibrary.newNXP = !storeLibrary.newNXP
    // send message to HOP to create genesis NXP contract structure
    if (storeLibrary.newNXP === true) {
      storeAI.prepareGenesisContracts()
    }
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
