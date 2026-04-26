<template>
  <Teleport to="body">
    <modal-besearch :show="bentoBesearchStatus" @close="closeBentoBesearch">
      Besearch
      <template #header>
        <div id="besearch-modal-header">
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
        <div id="besearch-holder">
          <div id="cycle-periods">
            <div class="cycle-period">1 day</div>
            <div class="cycle-period">1 week</div>
            <div class="cycle-period">1 month</div>
            <div class="cycle-period">3 months</div>
            <div class="cycle-period">1 year</div>
          </div>
          <canvas id="besearch-cycles" width="900px" height="900px" ref="canvasbe" @click="handleBesearchClick($event)"></canvas>
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
import beeCycle from '@/assets/besearch-cycle.png'
import { ref, computed, onMounted } from 'vue'
import BeebeeAi from '@/components/beebeehelp/spaceChat.vue'
import ModalBesearch from '@/components/besearch/besearchModal.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
  
  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let canvasbe = ref(null)
  defineExpose({ canvasbe })
  let ctx = ref({})
  let angle = ref(0)
  let radius = ref(100)
  let cyclesCompleted = 0 // Counter for completed cycles
  const totalCycles = 3 // Total cycles to complete

  /* on mount */
  onMounted(() => {
    const canvasElement = canvasbe.value
      if (canvasElement) {
        // Your code to work with the canvas element goes here
        drawBesearchCycles()
      } else {
        console.error('Canvas element not found')
      }
  })

  /* computed */
  const bentoBesearchStatus = computed(() => {
    return storeAI.bentobesearchState
  })

  /* methods */
  const drawBesearchCycles = () => {
    canvasbe = document.getElementById('besearch-cycles')
    ctx = canvasbe.getContext("2d")
    drawBeeCycle()
  }

  const drawText = () => {
    ctx.beginPath()
    ctx.font = '20px Arial' // Set font size and family
    ctx.fillStyle = 'black'  // Set text color
    ctx.textAlign = 'center'  // Set text alignment
    // Draw the text
    ctx.fillText('Besearch cycles coming soon', 200, 100)
  }

  const drawBeeCycle = () => {
    const image = new Image()
    let imageD = beeCycle
    image.src = imageD
    // Use requestAnimationFrame for smooth animation
    const animate = () => {
      ctx.clearRect(0, 0, canvasbe.width, canvasbe.height) // Clear the canvas
      // Calculate the position of the image
      const centerX = canvasbe.width / 2 // Center of the canvas
      const centerY = canvasbe.height / 2 // Center of the canvas
      const x = centerX + radius.value * Math.cos(angle.value) // X position
      const y = centerY + radius.value * Math.sin(angle.value) // Y position
      // Draw the image at the calculated position
      ctx.drawImage(image, x, y, image.width * 1, image.height * 1)
      // Update the angle for the next frame
      angle.value += 0.05 // Adjust the speed of rotation here
     // Check if a full cycle has been completed
     if (angle.value >= 2 * Math.PI) {
        angle.value = 0; // Reset angle for the next cycle
        cyclesCompleted++; // Increment the cycle counter
      }

      // Stop the animation after the specified number of cycles
      if (cyclesCompleted < totalCycles) {
        requestAnimationFrame(animate) // Continue animation
      } else {
        drawText()
      }
    }

    // Start the animation once the image is loaded
    image.onload = () => {
      animate()
    }
  }

  /* methods */
  const closeBentoBesearch = () => {
    storeAI.bentobesearchState = !storeAI.bentobesearchState
    // storeCues.liveCueContext = 'menu'
  }

  const handleBesearchClick = (event) => {
  }
  
  </script>
  
  <style scoped>
  #besearch-holder {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;    
  }

  #cycle-periods {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    margin-bottom: 1em;
  }

  #besearch-cycles {
    display: block;
    width: 900px;
    height: 900px;
    border: 1px solid rgb(128, 122, 180);
    border-radius: 2%;
  }

  #besearch-modal-header {
    display: grid;
    grid-template-columns: 1fr 8fr 1fr;
  }

  .btn-green {
    display: inline-grid;
    height: 28px;
    margin-right: .4em;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  } 

  @media (min-width: 1024px) {
    #besearch-holder {
      display: grid;
      grid-template-columns: 1fr;
      justify-items: center;    
    }


    #cycle-periods {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      justify-items: center;
      margin-bottom: 1em;
    }

    #besearch-cycles {
      display: block;
      width: 900px;
      height: 900px;
      border: 1px solid rgb(128, 122, 180);
      border-radius: 2%;
    }

    #besearch-modal-header {
      display: grid;
      grid-template-columns: 1fr 8fr 1fr;
    }

    .btn-green {
      display: inline-grid;
      height: 28px;
      margin-right: .4em;
      background-color: #b8cde2;
      color: #140d6b;
      border: none;
      border-radius: 4px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    } 
  }
  </style>