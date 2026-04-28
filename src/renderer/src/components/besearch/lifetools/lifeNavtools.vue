<template>
<div id="life-tools-nav" v-bind:class="{ border: props.isLTOpen === true }">
  <div class="spiral-container">
    <div class="spiral"></div>
  </div>
  <div id="mode-selector">
    <h3>Modes</h3>
    <div class="mode-buttons">
      <button class="mode-button" @click="selectMode('cues')">
        <span class="mode-icon"></span>
        <span v-bind:class="{ active: selectedMode === 'cues' }">Cues</span>
      </button>
      <button class="mode-button" @click="selectMode('body')">
        <span class="mode-icon">🧠</span>
        <span v-bind:class="{ active: selectedMode === 'body' }">Body</span>
      </button>
      <button class="mode-button" @click="selectMode('earth')">
        <span class="mode-icon">🌍</span>
        <span v-bind:class="{ active: selectedMode === 'earth' }">Earth</span>
      </button>
    </div>
  </div>
  <!-- Besearch Navigation Controls -->
  <div id="peer-navigation">
    <h3>Navigation</h3>
    <div class="directional-buttons">
      <button @click="movePeer('up')" class="direction-button up">↑</button>
      <div class="horizontal-buttons">
        <button @click="movePeer('left')" class="direction-button left">←</button>
        <button @click="movePeer('right')" class="direction-button right">→</button>
      </div>
      <button @click="movePeer('down')" class="direction-button down">↓</button>
    </div>
    <div class="control-buttons">
      <button @click="startPeer" class="control-button">Start</button>
      <button @click="stopPeer" class="control-button">Stop</button>
      <button @click="intervene" class="control-button">Intervene</button>
    </div>
    <div class="navigation-instructions">
      <p>Use arrow keys or buttons to navigate the peer</p>
    </div>
  </div>
  <div id="time-cycles">
    <button id="besearch-cycles-time" @click="besearchTime()">time</button>
    <div id="cycle-periods" v-if="btoolsTime === true">
      <div class="cycle-period">1 day</div>
      <div class="cycle-period">1 week</div>
      <div class="cycle-period">1 month</div>
      <div class="cycle-period">3 months</div>
      <div class="cycle-period">1 year</div>
    </div>
  </div>
  <!-- besearch create start stop delete -->
  <besearch-controls />
  <intervention-type></intervention-type>
</div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import BesearchControls from './besearchControls.vue'
import InterventionType from '@/components/besearch/interventions/interventionType.vue'

/* props */
const props = defineProps({
  isLTOpen: Boolean
})

// Only need mode-selected and peer-moved emits now
const emit = defineEmits(['mode-selected', 'peer-moved'])

let btoolsTime = ref(false)
let selectedMode = ref('cues')

  /** methods */
  const besearchTime = () => {
    btoolsTime.value = !btoolsTime.value
  }

  const selectMode = (mode) => {
    selectedMode.value = mode
    // Emit event to parent component to update canvas
    emit('mode-selected', mode)
  }

  // Peer navigation methods
  const movePeer = (direction) => {
    let peerDirection = { x: 0, y: 0 }
    
    switch(direction) {
      case 'up':
        peerDirection.y = -1
        break
      case 'down':
        peerDirection.y = 1
        break
      case 'left':
        peerDirection.x = -1
        break
      case 'right':
        peerDirection.x = 1
        break
    }

    // Emit event with direction
    emit('peer-moved', {
      direction: peerDirection,
      isMoving: true
    })

    // Reset direction after a short delay to simulate button press
    setTimeout(() => {
      emit('peer-moved', {
        direction: { x: 0, y: 0 },
        isMoving: false
      })
    }, 100)
  }

  const startPeer = () => {
    // Start peer movement with current direction (if any)
    emit('peer-moved', {
      direction: { x: 0, y: 0 }, // No specific direction, just start
      isMoving: true
    })
  }

  const stopPeer = () => {
    // Stop peer movement
    emit('peer-moved', {
      direction: { x: 0, y: 0 },
      isMoving: false
    })
  }

  const intervene = () => {
    // Implement intervention logic here
    console.log('Peer intervention initiated')
    // You can add more specific intervention logic as needed
    emit('peer-intervention')
  }

</script>

<style scoped>

#life-tools-nav {
  max-height: 100%;
  overflow-y: auto;
}

.active {
  background-color: #4a6fa5;
  color: white;
  font: 1.2em;
}

@media (min-width: 1024px) {
    #life-tools-nav {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
        background-color: #f0f4f8;
        position: relative;
        max-height: 100%;
        overflow-y: auto;
    }

    .border {
      border-top: 1px solid rgb(210, 210, 238);
      border-right: 1px solid rgb(210, 210, 238);
      border-bottom: 1px solid rgb(210, 210, 238);
      box-shadow: 5px 0 10px rgba(17, 11, 65, 0.5);
    }

    .spiral-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
    }

    .spiral {
      --b: 15px;  /* border thickness */
      --s: 500px; /* preferred size shape */
      --c: rgba(228, 237, 247, 0.2); /* faint blue color */
      width: round(var(--s),4*var(--b));
      aspect-ratio: 1;
      border-radius: 50%;
      background:
          repeating-radial-gradient(calc(2*var(--b)) at top,#0000 -1px,var(--c) 0 calc(50% - 1px),#0000 50% calc(100% - 1px)) calc(50% + var(--b)) 100%,
          repeating-radial-gradient(calc(2*var(--b)) at bottom,var(--c) -1px,#0000 0 calc(50% - 1px),var(--c) 50% calc(100% - 1px)) 50% 0;
      background-size: 150% 50%;
      background-repeat: no-repeat;
      mask:
          radial-gradient(calc(1.5*var(--b)) at calc(100% - var(--b)/2) 0, #0000 calc(100%/3), #000 calc(100%/3 + 1px) 110%, #0000 0) calc(50% + var(--b)/2)
          100%/calc(3*var(--b)) 50% exclude no-repeat,
          conic-gradient(#000 0 0);
    }

  #mode-selector {
    margin-bottom: 1rem;
  }

  .mode-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .mode-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .mode-button:hover {
    background-color: #9fb8d4;
  }

  .mode-icon {
    font-size: 24px;
    margin-bottom: 5px;
  }

  /* Peer Navigation Styles */
  #peer-navigation {
    margin-bottom: 1rem;
  }

  .directional-buttons {
    display: grid;
    grid-template-rows: auto auto auto;
    justify-items: center;
    margin-bottom: 1rem;
  }

  .horizontal-buttons {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5rem;
  }

  .direction-button {
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .direction-button:hover {
    background-color: #9fb8d4;
  }

  .control-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .control-button {
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .control-button:hover {
    background-color: #9fb8d4;
  }

  .navigation-instructions {
    font-size: 12px;
    color: #666;
    text-align: center;
  }

  #time-cycles {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  #besearch-cycles-time {
    display: inline-grid;
    height: 28px;
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

  #cycle-periods {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    margin-bottom: 1em;
  }

  .cycle-period {
    display: inline-grid;
    height: 28px;
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
  /* Interventions Styles */
  #interventions {
    margin-bottom: 1rem;
  }
}
</style>