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
        <div class="header-controls-row">
          <div class="top-tabs">
            <button class="button-lib-data" v-bind:class="{ active: activeTab === 'library' }" @click="activeTab = 'library'">
              Library
            </button>
            <button class="button-lib-data" v-bind:class="{ active: activeTab === 'experiments' }" @click="activeTab = 'experiments'">
              Experiments
            </button>
            <button class="button-lib-data" v-bind:class="{ active: activeTab === 'experience' }" @click="activeTab = 'experience'">
              @experience
            </button>
          </div>
          <div id="data-box-section-header"></div>
        </div>
      </template>
      <template #body>
        <!-- mian library-->
        <div v-if="activeTab === 'library'">
          <network-library></network-library>
        </div>
        
        <!-- experiments -->
        <div v-if="activeTab === 'experiments'">
          <libraryexp-view></libraryexp-view>
        </div>

        <!-- experience -->
        <div v-if="activeTab === 'experience'">
          <teach-view></teach-view>
        </div>
        
        <!-- Global overlays (for upload previews, etc. if needed) -->
        <csv-preview v-if="storeLibrary.csvpreviewLive === true"></csv-preview>
        <image-preview v-if="storeLibrary.imagepreviewLive === true"></image-preview>
      </template>
      <template #footer>
      </template>
    </modal-data>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ModalData from '@/components/dataspace/datamodal/dataModal.vue'
import CsvPreview from '@/components/dataspace/upload/csvPreview.vue'
import ImagePreview from '@/components/dataspace/upload/imagePreview.vue'
import NetworkLibrary from '@/components/library/index.vue'
import LibraryexpView from '@/components/dataspace/experimentNXPView.vue'
import TeachView from '@/components/dataspace/teach/teachView.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { teachingStore } from '@/stores/teachingStore.js'
import { besearchStore } from '@/stores/besearchStore.js'

const storeAI = aiInterfaceStore()
const storeBentobox = bentoboxStore()
const storeLibrary = libraryStore()
const storeTeach = teachingStore()
const storeBesearch = besearchStore()

const activeTab = ref('library')

const dataBoxStatus = computed(() => {
  return storeAI.dataBoxStatus
})

watch(activeTab, (newVal) => {
  if (newVal === 'experiments') {
    if (storeLibrary.publicLibrary && storeLibrary.publicLibrary.referenceContracts !== undefined) {
      storeLibrary.prepPublicNXPlist()
    }
    storeLibrary.sendMessage('get-library')
    storeLibrary.sendMessage('get-results')
  }
})

const closedataBox = () => {
  storeAI.dataBoxStatus = false
  storeLibrary.uploadStatus = false
}
</script>

<style scoped>
#space-toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: antiquewhite;
}

#dataBox-holder {
  border: 0px solid red;
}

#return-modal-close {
  text-align: right;
  cursor: pointer;
}

.header-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 1rem;
  width: 100%;
}

.top-tabs {
  display: flex;
  gap: 1rem;
  margin-top: 0;
  flex-shrink: 0;
}

#data-box-section-header {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.button-lib-data {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s;
}

.button-lib-data:hover {
  background-color: #e9e9e9;
}

.button-lib-data.active {
  background-color: rgb(113, 172, 114);
  color: white;
  border-color: green;
}

@media (min-width: 1024px) {
  #dataBox-holder {
    height: 80vh;
    width: 100%;
    overflow: scroll;
  }

  #space-modal-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #return-modal-close {
    justify-content: right;
  }
}
</style>
