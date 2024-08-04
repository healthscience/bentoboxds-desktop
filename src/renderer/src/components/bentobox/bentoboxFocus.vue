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
        <h3>Expanded</h3>
      </template>
      <template #body>
        <div id="focus-bentobox">
          <bento-box :bboxid="props.bboxid" :bbwidth="'90vw'"></bento-box>
        </div>
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
  const storeBentobox = bentoboxStore()

  const props = defineProps({
    bboxid: String
  })

  let date = ref('')

  // a computed ref
  const bentoboxLive = computed(() => {
    return storeAI.expandBentobox[props.bboxid]
  })

  const closedataBox = () => {
    storeAI.expandBentobox[props.bboxid] = !storeAI.expandBentobox[props.bboxid]
    // also close any toolbars open
    storeBentobox.boxtoolsShow[props.bboxid] = false
  }
</script>

<style scoped>


#return-modal-close {
  text-align: right;
}

  @media (min-width: 1024px) {

    #space-modal-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    #return-modal-close {
      justify-content: right;
    }

    #focus-bentobox {
      position: relative;
      display: grid;
      grid-template-columns: 1fr;
    }


  }

</style>
