<template>
    <Teleport to="body">
      <modal-besearch :show="bentoBesearchStatus" @close="closeBentoBesearch">
        Besearch
        <template #header>
          <div id="cues-modal-header">
            <button
              type="button"
              class="btn-green"
              @click="closeBentoBesearch"
              aria-label="Close modal"
            >
              Close
            </button>
            <div id="cues-context">Besearch</div>
            <div id="return-modal-close" @click="closeBentoBesearch">return</div>
          </div>
        </template>
        <template #body>
          <div class="main">
            <header>Besearch cycles coming soon</header>
            <div id="cycle-periods">
              <div class="cycle-period">1 day</div>
              <div class="cycle-period">1 week</div>
              <div class="cycle-period">1 month</div>
              <div class="cycle-period">3 months</div>
              <div class="cycle-period">1 year</div>
            </div>
          </div>
          <div id="besearch-holder">canvas
            <canvas id="besearch-cycles" width="900px" height="900px" ></canvas>
          </div>
          <beebee-ai></beebee-ai>
        </template>
        <template #footer>
          Besearch
        </template>
      </modal-besearch>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import BeebeeAi from '@/components/beebeehelp/spaceChat.vue'
  import ModalBesearch from '@/components/besearch/besearchModal.vue'
  import { cuesStore } from '@/stores/cuesStore.js'
  import { aiInterfaceStore } from '@/stores/aiInterface.js'
  import { bentoboxStore } from '@/stores/bentoboxStore.js'
  
    const storeCues = cuesStore()
    const storeAI = aiInterfaceStore()
    const storeBentobox = bentoboxStore()
  
    let canvas = ref({})
    let ctx = ref({})

    /* on mount */
    onMounted(() => {
      // drawBesearchCycles()
    })

  const drawBesearchCycles = () => {
    let canvas2 = document.getElementById('besearch-cycles')
    ctx = canvas2.getContext("2d")
    ctx.font = '20px Arial'; // Set font size and family
    ctx.fillStyle = 'black';  // Set text color
    ctx.textAlign = 'center';  // Set text alignment
    // Draw the text
    ctx.fillText('Besearch cycles coming soon', 200, 100);
  }

    /* computed */
     const bentoBesearchStatus = computed(() => {
      return storeAI.bentobesearchState
    })

  
    /* methods */
    const closeBentoBesearch = () => {
      storeAI.bentobesearchState = !storeAI.bentobesearchState
      // storeCues.liveCueContext = 'menu'
    }
  
  </script>
  
  <style scoped>
  
  #besearch-cycles {
    display: grid;
    border: 1px solid red;
  }

    @media (min-width: 1024px) {
  
    }
  
  </style>