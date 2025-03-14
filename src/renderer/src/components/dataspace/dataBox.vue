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
        <button class="button-lib-data" v-bind:class="{ active: libraryStatus === true }" @click="networkLibraryShow">
          Library
        </button>
        <button class="button-lib-data" v-bind:class="{ active: uploadLive === true }" @click="networkUploadShow">
          Upload
        </button>
        <button class="button-lib-data" v-bind:class="{ active: libraryExperiments === true }" @click="nxpLibraryPeer">
          Experiments
        </button>
        <button class="button-lib-data" v-bind:class="{ active: newModulebuild === true }" @click="nxpAdd">
          + new NXP
        </button>
      </template>
      <template #body>
        <!-- data utilities-->
        <space-upload v-if="uploadStatus === true && joinNXPStatus !== true"></space-upload>
        <rest-upload v-if="restStatus === true"></rest-upload>
        <csv-preview v-if="storeLibrary.csvpreviewLive === true"></csv-preview>
        <image-preview v-if="storeLibrary.imagepreviewLive === true"></image-preview>
        <!-- mian library-->
        <div v-if="libraryStatus === true">
          <network-library></network-library>
        </div>
        <!-- network experiments private and public-->
        <libraryexp-view v-if="storeLibrary.libPeerview === true"></libraryexp-view>
        <newnxp-view v-if="storeLibrary.newNXP === true"></newnxp-view>
        <joinnxp-view v-if="storeLibrary.joinNXP === true"></joinnxp-view>
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
import ImagePreview from '@/components/dataspace/upload/imagePreview.vue'
import NetworkLibrary from '@/components/library/index.vue'
import LibraryexpView from '@/components/dataspace/experimentNXPView.vue'
import NewnxpView from '@/components/dataspace/newnxpView.vue'
import JoinnxpView from '@/components/library/contracts/join/joinnxpView.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()

  const uploadStatus = computed(() => {
    return storeLibrary.uploadStatus
  })

  const joinNXPStatus = computed(() => {
    return  storeLibrary.joinNXP
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

  const libraryExperiments = computed(() => {
    return storeLibrary.libPeerview
  })

  const newModulebuild = computed(() => {
    return storeLibrary.newNXP
  })

  const closedataBox = () => {
    storeAI.dataBoxStatus = !storeAI.dataBoxStatus
    storeLibrary.uploadStatus = false
  }

  const networkLibraryShow = () => {
    storeLibrary.libraryStatus = !storeLibrary.libraryStatus
  }

  const networkUploadShow = () => {
    storeLibrary.uploadStatus = !storeLibrary.uploadStatus
  }

  const nxpLibraryPeer = () => {
    storeLibrary.libPeerview = !storeLibrary.libPeerview
    // prepare public library for table list view
    if (storeLibrary.publicLibrary.referenceContracts !== undefined) {
      storeLibrary.prepPublicNXPlist()
    }
    // ask network library for contracts via HOP
    storeLibrary.sendMessage('get-library')
    storeLibrary.sendMessage('get-results')
  }

  const nxpAdd = () => {
    storeLibrary.newNXP = !storeLibrary.newNXP
    // send message to HOP to create genesis NXP contract structure
    if (storeLibrary.newNXP === true) {
      // setup gensis open tools data structure
      let modSettings = {}
      modSettings.xaxis = ['time'] // mod.value.info.settings.xaxis
      modSettings.yaxis = ['333']
      modSettings.category = []
      storeBentobox.openDataSettings['genesis-123579'] = modSettings
      storeLibrary.prepareGenesisModContracts()
      storeLibrary.saveSuccessnxp = false
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

    .button-lib-data {
      margin-left: 1em;
    }

    .active {
      background-color: rgb(113, 172, 114);
      border: 1px solid green;
    }

  }

</style>
