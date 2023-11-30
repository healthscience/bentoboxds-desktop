<template>
  <Teleport to="body">bentoboxfocus
    <!-- use the modal component, pass in the prop -->
    <modal-bentobox :show="bentoboxLive" @close="closedataBox">
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
      </template>
      <template #body>
        <bento-box :bboxid="props.bboxid"></bento-box>
      </template>
      <template #footer>
      </template>
    </modal-bentobox>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalBentobox from '@/components/bentobox/bentoboxmodal/bentoboxModal.vue'
import BentoBox from '@/components/bentobox/bentoBox.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const bboxStore = bentoboxStore()
  const showModal = ref(true)

  const props = defineProps({
    bboxid: String
  })


  // a computed ref
  const bentoboxLive = computed(() => {
    return storeAI.expandBentobox[props.bboxid]
  })

  const closedataBox = () => {
    storeAI.expandBentobox[props.bboxid] = !storeAI.expandBentobox[props.bboxid]
  }
</script>

<style scoped>


#return-modal-close {
  text-align: right;
}

  @media (min-width: 1024px) {

    #pace-modal-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    #return-modal-close {
      justify-content: right;
    }


  }

</style>
