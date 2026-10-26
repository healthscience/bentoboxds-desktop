<template>
  <div id="world-holder" @mousemove="onWorldMouseMove" @click="onWorldClick">
    <OrbitHUD />
    <BodyNavigation 
      v-model:isOpen="isMapOpen" 
      @select-organ="handleOrganNavigation" 
      @draw-complete="handleDrawComplete"
      ref="bodymapContainer"
    />

    <div class="pane right-pane" ref="physicsContainer">
      <!-- 3D Emulation Layer -->
      <div id="three-canvas-container" ref="threeCanvasContainer"></div>
      
      <!-- 2D Besearch/UI Layer -->
      <div id="besearch-world-container" ref="canvasContainer">
        <canvas id="besearch-world" ref="canvasbe"></canvas>
      </div>
    </div>

    <div 
      v-if="storeAI.interactionMode !== 'tools'"
      class="lens-hud" 
      :style="hudStyle"
      :class="{ 'is-locked': isLocked, 'is-fixed': isFixed }"
      @click.stop
    >
      <div class="strap-status" v-if="linkedCue">
        {{ linkedCue.name }} | {{ depthName }}
      </div>
      
      <div class="fixed-indicator" v-if="isFixed">
        LENS FIXED
      </div>

      <div class="depth-control">
        <input 
          type="range" 
          min="0" 
          max="2" 
          step="1" 
          v-model.number="zoomDepth"
          orient="vertical"
        />
        <span class="depth-label">{{ depthName }}</span>
      </div>

      <button class="lock-btn" @click.stop="toggleLock">
        {{ isLocked ? '🔓 UNLOCK' : '🔒 LOCK' }}
      </button>

      <div class="lens-contextual-tools" v-if="linkedCue">
        <div class="context-title">{{ linkedCue.name }} Controls</div>
        
        <div v-if="zoomDepth === 1" class="tool-group">
          <span class="depth-tag">Organ Layer Interplay</span>
          <div v-if="linkedCue.name === 'Heart'" class="action-buttons">
            <button @click="triggerIntervention('pace_maker')">⚡ Pace Rhythm</button>
            <button @click="triggerIntervention('stroke_volume')">🩸 Adjust Volume</button>
          </div>
          <div v-else-if="linkedCue.name === 'Liver'" class="action-buttons">
            <button @click="triggerIntervention('enzyme_flush')">🧪 Enzyme Flush</button>
            <button @click="triggerIntervention('glycogen_release')">🔋 Release Glycogen</button>
          </div>
          <div v-else class="action-buttons">
            <button @click="triggerIntervention('generic_stabilize')">🛡️ Stabilize Local Peer</button>
          </div>
        </div>

        <div v-if="zoomDepth === 2" class="tool-group">
          <span class="depth-tag">Cellular Layer Metabolism</span>
          <div class="action-buttons cellular">
            <button @click="triggerIntervention('atp_boost')">🔋 ATP Acceleration</button>
            <button @click="triggerIntervention('ion_gate_toggle')">🌐 Toggle Ion Gates</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Body layers: Organ / Cellular -->
    <OrganSurface v-if="zoomDepth === 1" :linked-cue="linkedCue" :organ-color="organColor" />
    <CellularSurface v-if="zoomDepth === 2" />
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import OrbitHUD from '@/components/orrery/parts/huud/OrbitHUD.vue'
import BodyNavigation from './body/BodyNavigation.vue'
import OrganSurface from './body/organSurface.vue'
import CellularSurface from './body/cellularSurface.vue'

import { cuesStore } from '@/stores/cuesStore.js'
import { accountStore } from '@/stores/accountStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { besearchStore } from '@/stores/besearchStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { useBesearchCanvas } from '@/composables/useBesearchCanvas.js'
import { useLensStability } from '@/composables/useLensStability.js'

// The pure JS Body Emulation Rig
import { BodyEmulationRig } from '@/systems/body/BodyEmulationRig.js'

const storeCues = cuesStore()
const storeAI = aiInterfaceStore()
const storeAccount = accountStore()
const storeBentobox = bentoboxStore()
const storeBesearch = besearchStore()
const storeLibrary = libraryStore()

// DOM Refs
const threeCanvasContainer = ref(null)
const physicsContainer = ref(null)
const bodymapContainer = ref(null)
const canvasbe = ref(null)
const canvasContainer = ref(null)

// Emulation State
const emulationRig = shallowRef(null)
let emulationFrameId = null

// Safeflow-ecs Reference Buffer
// In production, this array buffers direct from your HOP peer stream
// Safeflow-ecs Reference Buffer
const ecsBuffer = new Float32Array(1024) 

// Seed the buffer with valid Identity Quaternions [x:0, y:0, z:0, w:1] 
// so we don't feed math errors to three.js before the real HOP peer connects.
for (let i = 0; i < ecsBuffer.length; i += 12) {
  ecsBuffer[i + 3] = 1; // Set the real quaternion 'w' component to 1
}

const entityMap = {
  'core': 0,
  'spine': 1,
  'head': 2,
  'leftArm': 3,
  'rightArm': 4,
  'leftLeg': 5,
  'rightLeg': 6
}

// Map synchronization state
const isMapOpen = ref(false)
const zoomPercentage = ref(100)

const emit = defineEmits(['draw-complete'])

const handleDrawComplete = () => {
  emit('draw-complete')
}

const startDrawing = () => {
  if (bodymapContainer.value) {
    bodymapContainer.value.startDrawing()
  }
}

const saveCueLocation = (cueId) => {
  if (bodymapContainer.value) {
    bodymapContainer.value.saveCueLocation(cueId)
  }
}

// Emulation Render Loop
const tickEmulation = () => {
  if (emulationRig.value) {
    // Pass the latest buffered spatial truth to the rig
    emulationRig.value.emulate(ecsBuffer, entityMap)
  }
  emulationFrameId = requestAnimationFrame(tickEmulation)
}

onMounted(async () => {
  // 1. Initialize the 3D Emulation Layer
  if (threeCanvasContainer.value) {
    emulationRig.value = new BodyEmulationRig(threeCanvasContainer.value)
    tickEmulation()
  }

  // 2. Initialize the 2D Besearch Canvas
  if (storeAI.activeWorld === 'body') {
    await nextTick()
    await initializeCanvas()
  }
})

onUnmounted(() => {
  if (emulationFrameId) {
    cancelAnimationFrame(emulationFrameId)
  }
})

// Handle incoming organ targeting event passed from Navigation Component
const handleOrganNavigation = (organName) => {
  if (linkedCue.value) {
    linkedCue.value.name = organName
  } else {
    storeBesearch.canvasState.selectedOrgan = organName
  }

  // Cascade depth directly down to Organ Interplay Surface
  zoomDepth.value = 1

  // Tell the spatial canvas coordinate manager to refocus perspective tracking onto the peer
  const manager = getCanvasManager()
  if (manager) {
    const peerInstance = manager.getPeerByName?.(organName) || manager.peer
    if (peerInstance) {
      manager.stateManager?.centerOn(peerInstance)
    }
    manager.handleResize()
    manager.render()
  }
}

const triggerIntervention = (type) => {
  addIntervention({
    type: type,
    target: linkedCue.value?.name,
    depth: zoomDepth.value,
    timestamp: Date.now()
  })
  
  // NOTE: This is where you will eventually pulse the intervention back 
  // into the safeflow-ecs contract buffer via HOP, allowing the network 
  // to register the state change.
}

const { lensPos, isLocked, isFixed, zoomDepth, linkedCue, handleMouseMove, toggleLock, toggleFixed } = useLensStability()

const onWorldMouseMove = (e) => {
  if (storeAI.interactionMode === 'tools') return
  handleMouseMove(e)
}

const onWorldClick = (e) => {
  if (storeAI.interactionMode === 'tools') return
  toggleFixed(e)
}

const depthName = computed(() => ['SURFACE', 'BIOMARKER', 'CELLULAR'][zoomDepth.value])

const organColor = computed(() => {
  if (!linkedCue.value) return 'rgba(100, 100, 100, 0.5)'
  const colors = {
    'Heart': 'rgba(255, 50, 50, 0.6)',
    'Liver': 'rgba(150, 75, 0, 0.6)',
    'Pancreas': 'rgba(255, 200, 0, 0.6)',
    'Lungs': 'rgba(200, 200, 255, 0.6)'
  }
  return colors[linkedCue.value.name] || 'rgba(0, 255, 200, 0.4)'
})

const hudStyle = computed(() => ({
  transform: `translate(${lensPos.value.x}px, ${lensPos.value.y}px)`
}))

const {
  canvasState,
  setMode,
  addIntervention,
  getCanvasManager,
  initializeCanvas,
  destroy
} = useBesearchCanvas(canvasbe, (zoom) => {
  zoomPercentage.value = Math.round(zoom * 100)
}, false)

defineExpose({ canvasbe, startDrawing, saveCueLocation })

watch(() => storeAI.activeWorld, async (newWorld) => {
  if (newWorld === 'body') {
    await nextTick()
    await initializeCanvas()
  } else {
    destroy()
  }
}, { immediate: true })
</script>

<style scoped>
#world-holder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: var(--color-background);
  background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: hidden;
}

.right-pane {
  background: transparent;
  overflow: hidden;
  position: absolute;
  inset: 0;
}

.lens-hud {
  position: absolute;
  top: -125px;
  left: -125px;
  width: 250px;
  height: 250px;
  pointer-events: none;
  z-index: 100;
  border: 2px solid rgba(0, 255, 200, 0.3);
  border-radius: 50%;
}

.lens-contextual-tools {
  position: absolute;
  bottom: -155px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background: rgba(5, 10, 10, 0.95);
  border: 1px solid rgba(0, 255, 200, 0.4);
  border-radius: 6px;
  padding: 10px;
  font-family: monospace;
  pointer-events: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

.context-title {
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 4px;
  margin-bottom: 6px;
  text-align: center;
}

.tool-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.depth-tag {
  color: rgba(0, 255, 200, 0.7);
  font-size: 9px;
  text-transform: uppercase;
  text-align: center;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-buttons button {
  background: rgba(0, 255, 200, 0.1);
  color: #00ffc8;
  border: 1px solid rgba(0, 255, 200, 0.3);
  padding: 5px;
  font-size: 10px;
  font-family: monospace;
  cursor: pointer;
  border-radius: 3px;
  text-align: left;
  transition: all 0.2s;
}

.action-buttons button:hover {
  background: rgba(0, 255, 200, 0.25);
  border-color: #00ffc8;
  color: #fff;
  padding-left: 8px;
}

.action-buttons.cellular button {
  border-color: rgba(255, 150, 0, 0.4);
  color: #ff9600;
  background: rgba(255, 150, 0, 0.05);
}

.action-buttons.cellular button:hover {
  border-color: #ff9600;
  background: rgba(255, 150, 0, 0.15);
}

#three-canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

#besearch-world-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

#besearch-world {
  display: block;
  width: 100%;
  height: 100%;
  background: transparent !important;
  pointer-events: none;
}

.depth-control {
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 8px;
  color: white;
  z-index: 101;
}

.depth-control input[type=range][orient=vertical] {
  writing-mode: bt-lr;
  -webkit-appearance: slider-vertical;
  width: 8px;
  height: 100px;
  padding: 0 5px;
}

.depth-label {
  margin-top: 10px;
  font-size: 12px;
  font-weight: bold;
}

.lock-btn {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 15px;
  border-radius: 15px;
  cursor: pointer;
}

.lock-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.strap-status {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #00ffc8;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  white-space: nowrap;
}
</style>