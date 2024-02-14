<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-space :show="bentospaceStatus" @close="closeBentoSpace">
      <template #header>
        <!-- The code below goes into the header slot -->
        <div id="space-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoSpace"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="return-modal-close" @click="closeBentoSpace">return</div>
        </div>
        <h3>BentoSpace #</h3>
      </template>
      <template #body>
        <div id="space-toolbar">
          <div id="beebee-help">beebee help</div>
          <div id="space-bar">space bar</div>
        </div>
        <div id="bentospace-holder" v-dragscroll.noleft.noright="true" >
          <div id="bento-space">
            <!-- location for bentobox - es -->
            <div id="bento-layout" v-for="bbox in storeAI.bentoboxList[storeAI.liveBspace.spaceid]">
             <bento-box :bboxid="bbox"></bento-box>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
      </template>
    </modal-space>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalSpace from '@/components/bentospace/spaceModal.vue'
import BentoBox from '@/components/bentobox/bentoboxSpace.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const bboxStore = bentoboxStore()
  const bentospaceLive = ref(true)
  const showModal = ref(false)
  
  const bentospaceStatus = computed(() => {
    return storeAI.bentospaceState
  })

  const closeBentoSpace = () => {
    storeAI.bentospaceState = !storeAI.bentospaceState
  }
</script>

<style scoped>

#space-toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: antiquewhite;
}

#bentospace-holder {
  border: 0px solid red;;
}

#bento-space {
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid green;
  height: 80vh;
  width: 100%;
  margin-top: 0.1em;
  transform-origin: left top;
  border: 1px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
}

#return-modal-close {
  text-align: right;
}

  @media (min-width: 1024px) {

    #bentospace-holder {
      height: 80vh;
      width: 100%;
      overflow: scroll;
    }

    #bento-space {
      height: 998vh;
      width: 998vw;
      z-index: 2;
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
