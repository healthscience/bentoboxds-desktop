<template>
  <div id="world-holder" @mousemove="handleMouseMove" @click="toggleFixed">
    <!-- Left Pane: Static Anatomical Map -->
    <div class="pane left-pane" @click="handleMapClick">
      <img src="@/assets/human-diagram.png" alt="Human Anatomy Map" class="anatomy-map" />
    </div>

    <!-- Right Pane: Physics Sandbox -->
    <div class="pane right-pane" ref="physicsContainer">
      <div id="three-canvas-container" ref="threeCanvasContainer"></div>
      <div class="evolution-stats" v-if="curator">
        <div class="stats-row">Gen: {{ curator.generation }} | Best Fitness: {{ bestFitness.toFixed(2) }}</div>
        <button class="evolve-toggle-btn" @click="toggleEvolution">
          {{ isEvolving ? '⏹ STOP EVOLUTION' : '▶ START EVOLUTION' }}
        </button>
      </div>
      <div id="besearch-world-container" ref="canvasContainer">
        <canvas id="besearch-world" ref="canvasbe"></canvas>
      </div>
    </div>

    <!-- Lens HUD (Floating) -->
    <div 
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

      <div class="fixed-indicator" v-if="isFixed && !isLocked">
        📍 FIXED (Click world to release)
      </div>
    </div>

    <!-- Depth Layers (Biomarker/Cellular) -->
    <OrganSurface 
      v-if="zoomDepth === 1" 
      :linked-cue="linkedCue" 
      :organ-color="organColor" 
    />

    <!-- Cellular Layer -->
    <CellularSurface v-if="zoomDepth === 2" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onUpdated, reactive, watch, nextTick } from 'vue'
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

import { GeneticCurator } from '@/systems/body-evolution/genetic-curator.js'
import { BodyVessel } from '@/systems/body-evolution/foundation-physics.js'
import { useEvolutionRenderer } from '@/composables/useEvolutionRenderer.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeAccount = accountStore()
  const storeBentobox = bentoboxStore()
  const storeBesearch = besearchStore()
  const storeLibrary = libraryStore()

  const curator = ref(null)
  const isEvolving = ref(false)
  const bestFitness = ref(0)
  const threeCanvasContainer = ref(null)

  // Initialize Physics and Renderer
  const vessel = new BodyVessel()
  useEvolutionRenderer(threeCanvasContainer, vessel)

  onMounted(async () => {
    curator.value = new GeneticCurator(vessel)
    
    await nextTick()
    if (threeCanvasContainer.value) {
      // console.log('Three canvas container ready:', threeCanvasContainer.value.clientWidth, threeCanvasContainer.value.clientHeight)
    }
  })

  const toggleEvolution = () => {
    if (isEvolving.value) {
      curator.value.stopEvolution()
    } else {
      curator.value.startEvolution()
    }
    isEvolving.value = !isEvolving.value
  }

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    // console.log(`Map clicked at: ${x.toFixed(2)}, ${y.toFixed(2)}`)
  }

  const { lensPos, isLocked, isFixed, zoomDepth, linkedCue, handleMouseMove, toggleLock, toggleFixed } = useLensStability();

  const drawingCanvas = ref(null);
  const isDrawing = ref(false);
  const drawPoints = ref([]);

  const startDraw = (e) => {
    isDrawing.value = true;
    const rect = drawingCanvas.value.getBoundingClientRect();
    drawPoints.value = [{ x: e.clientX - rect.left, y: e.clientY - rect.top }];
  };

  const draw = (e) => {
    if (!isDrawing.value) return;
    const rect = drawingCanvas.value.getBoundingClientRect();
    const ctx = drawingCanvas.value.getContext('2d');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawPoints.value.push({ x, y });
    
    ctx.clearRect(0, 0, drawingCanvas.value.width, drawingCanvas.value.height);
    ctx.beginPath();
    ctx.strokeStyle = '#00ffc8';
    ctx.lineWidth = 3;
    ctx.moveTo(drawPoints.value[0].x, drawPoints.value[0].y);
    for (let i = 1; i < drawPoints.value.length; i++) {
      ctx.lineTo(drawPoints.value[i].x, drawPoints.value[i].y);
    }
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawing.value = false;
    if (drawPoints.value.length > 0) {
      hasDrawing.value = true;
    }
  };

  const hasDrawing = ref(false);

  const depthName = computed(() => ['SURFACE', 'BIOMARKER', 'CELLULAR'][zoomDepth.value]);

  const organColor = computed(() => {
    if (!linkedCue.value) return 'rgba(100, 100, 100, 0.5)';
    const colors = {
      'Heart': 'rgba(255, 50, 50, 0.6)',
      'Liver': 'rgba(150, 75, 0, 0.6)',
      'Pancreas': 'rgba(255, 200, 0, 0.6)',
      'Lungs': 'rgba(200, 200, 255, 0.6)'
    };
    return colors[linkedCue.value.name] || 'rgba(0, 255, 200, 0.4)';
  });

  const maskStyle = computed(() => ({
    'background': (zoomDepth.value === 0 && storeAI.interactionMode === 'lens')
      ? `radial-gradient(circle 250px at ${lensPos.value.x}px ${lensPos.value.y}px, transparent 0%, rgba(0,0,0,0.4) 100%)`
      : 'transparent',
    'width': '100%',
    'height': '100%',
    'pointer-events': 'none'
  }));

  const hudStyle = computed(() => ({
    transform: `translate(${lensPos.value.x}px, ${lensPos.value.y}px)`
  }));


  // Canvas references
  const canvasbe = ref(null)
  const canvasContainer = ref(null)

  // Initialize 3D Body (Disabled for now)
  // const { isInitialized: isThreeInitialized, updateMetabolism } = useThreeBody(threeCanvasContainer, zoomDepth, lensPos, linkedCue)
  const isThreeInitialized = ref(false)
  const updateMetabolism = () => {}

  const bodyState = reactive({
    heartRate: 72
  });

  const updateBody = () => {
    updateMetabolism({
      heartRate: bodyState.heartRate
    });
  };

  // Panel management
  const isLifeToolsOpen = ref(false)
  const isDragging = ref(false)
  const startX = ref(0)
  const currentX = ref(0)
  const panelWidth = ref(300) // Default panel width

  // Zoom display
  const zoomPercentage = ref(100)

  // Intervention toolbar refs
  const showInterventionToolbar = ref(false)
  const interventionToolbarRef = ref(null)

  // ResizeObserver reference for cleanup
  let resizeObserver = null
  let lastKnownSize = { width: 0, height: 0 }
  let isResizing = false

  // Use the new canvas composable
  const {
    canvasState,
    setMode,
    updatePeerPosition,
    updatePeerDirection,
    addIntervention,
    getCanvasManager,
    initializeCanvas,
    destroy
  } = useBesearchCanvas(canvasbe, (zoom) => {
    // Callback to update zoom percentage when zoom changes from any source
    zoomPercentage.value = Math.round(zoom * 100)
  }, false)

  const saveCueLocation = (cueId) => {
    // Logic to save the cue
    hasDrawing.value = false;
    const ctx = drawingCanvas.value.getContext('2d');
    ctx.clearRect(0, 0, drawingCanvas.value.width, drawingCanvas.value.height);
    drawPoints.value = [];
  };

  defineExpose({ canvasbe, saveCueLocation })

  /* on mount */
  onMounted(async () => {
    // Canvas initialization is now handled by the useBesearchCanvas composable
    // Add ResizeObserver to handle window resize
    // Watch the canvas container instead of the canvas itself
    // This ensures we detect when the container grows/shrinks
    if (canvasContainer.value) {
      resizeObserver = new ResizeObserver((entries) => {
        if (isResizing) {
          return
        }
        for (const entry of entries) {
          const newWidth = entry.contentRect.width
          const newHeight = entry.contentRect.height
          
          // Only resize if dimensions actually changed significantly (more than 5px)
          // This prevents the feedback loop from setupCanvas
          if (Math.abs(newWidth - lastKnownSize.width) > 5 ||
              Math.abs(newHeight - lastKnownSize.height) > 5) {
            lastKnownSize = { width: newWidth, height: newHeight }
            isResizing = true
            const manager = getCanvasManager()
            if (manager) {
              // Call the full handleResize method which includes re-centering
              manager.handleResize()
            }
            // Reset flag after a delay
            setTimeout(() => {
              isResizing = false
            }, 200)
          }
        }
      })
      resizeObserver.observe(canvasContainer.value)
      // Store initial size
      const rect = canvasContainer.value.getBoundingClientRect()
      lastKnownSize = { width: rect.width, height: rect.height }
    }

    // Initialize canvas if activeWorld is body
    if (storeAI.activeWorld === 'body') {
      await nextTick();
      await initializeCanvas();
    }
  })

  /* on unmount */
  onUnmounted(() => {
    // Disconnect ResizeObserver
    /* if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    } */
  })

  /* computed */
  const bentochatStatus = computed(() => {
    return storeAI.bentochatState
  })

  const bentoBesearchStatus = computed(() => {
    return storeAI.bentobesearchState
  })

  const currentZIndex = computed(() => {
    return storeBentobox.isBentospaceActive ? 1100 : 1300
  })

  const selectedIntervention = computed(() => storeBesearch.selectedIntervention)
  const selectedCategory = computed(() => storeBesearch.selectedCategory)
  const nexusWorld = computed(() => storeBesearch.nexusContext.world)
  const storeCanvasMode = computed(() => storeBesearch.canvasState.currentMode)
  const activeWorld = computed(() => {
    const mode = canvasState.currentMode
    if (mode === 'cues') return 'cues'
    if (mode === 'body') return 'body'
    if (mode === 'earth') return 'earth'
    return null
  })


  watch(() => storeAI.interactionMode, (newMode) => {
    if (newMode === 'tools') {
      nextTick(() => {
        if (drawingCanvas.value) {
          drawingCanvas.value.width = drawingCanvas.value.offsetWidth;
          drawingCanvas.value.height = drawingCanvas.value.offsetHeight;
        }
      });
    }
  });

  // Watch for activeWorld changes to initialize canvas
  watch(() => storeAI.activeWorld, async (newWorld) => {
    if (newWorld === 'body') {
      await nextTick();
      await nextTick();
      await initializeCanvas();
    } else {
      destroy();
    }
  }, { immediate: true })

  // Watch for modal visibility to ensure canvas is properly initialized
  watch(bentoBesearchStatus, async (isOpen) => {
    if (isOpen) {
      // Wait a bit for the modal to fully render
      await nextTick()
      await nextTick() // Double nextTick to ensure DOM is fully updated
      await initializeCanvas()
      if (canvasbe.value) {
        const rect = canvasbe.value.getBoundingClientRect()
      }
      // Log the current canvas state when modal opens
      const manager = getCanvasManager()
      if (manager && manager.stateManager) {
        // Restore saved canvas state
        const canvasState = storeBesearch.canvasState;
        // Update manager state
        manager.stateManager.setMode(canvasState.currentMode);
        manager.stateManager.zoom = canvasState.zoom;
        manager.stateManager.panOffset = { ...canvasState.panOffset };
        manager.stateManager.setViewport(canvasState.viewport.x, canvasState.viewport.y);
        // Restore peer position
        if (manager.peer) {
          const peerPosition = storeBesearch.getPeerPosition();
          manager.peer.setPosition(peerPosition.x, peerPosition.y);
          manager.stateManager.centerOn(manager.peer);
        }
        // Ensure renderer has fresh dimensions after modal open
        manager.handleResize()
        manager.render()
      }
    } else {
      destroy()
    }
  })

  // Watch for intervention selections from store
  watch(selectedIntervention, (newIntervention) => {
    if (newIntervention) {
      if (newIntervention.type === 'create') {
        // Handle create new intervention
      } else {
        // Show intervention in toolbar
        showInterventionToolbar.value = true
        interventionToolbarRef.value?.showIntervention(newIntervention)
      }
    }
  })

  watch(selectedCategory, (newCategory) => {
    if (newCategory) {
      // Show category in toolbar
      showInterventionToolbar.value = true
      interventionToolbarRef.value?.showCategory(newCategory)
    }
  })

  watch(nexusWorld, (newWorld) => {
    if (newWorld && canvasState.currentMode !== newWorld) {
      setMode(newWorld)
    }
  })

  watch(storeCanvasMode, (newMode) => {
    if (newMode && canvasState.currentMode !== newMode) {
      canvasState.currentMode = newMode
      setMode(newMode)
    }
  })

  watch(zoomDepth, (newDepth) => {
    const manager = getCanvasManager()
    if (manager && manager.stateManager) {
      manager.stateManager.setEmulationDepth(newDepth)
    }
    
    if (newDepth > 0 && linkedCue.value) {
      // Mock message to HOP
      /* storeAI.addSystemMessage({
        role: 'system',
        content: `Depth transition: Activating ${newDepth === 1 ? 'Biomarker' : 'Cellular'} emulation for ${linkedCue.value.name}.`
      }); */
    }
  })

  // Canvas initialization is now handled by useBesearchCanvas composable
  /* methods */
  const setShowBeeBee = () => {
    storeAI.bentochatState = !storeAI.bentochatState
  }

  /** peer nav in canvas space **/
  // Handle peer movement events from life tools
  const handlePeerMoved = (peerData) => {
    // Delegate to canvas manager
    updatePeerDirection(peerData.direction)
  }

  // Handle mode changes from life tools
  const handleModeChange = (mode) => {
    setMode(mode)
    // close the lifetools
    isLifeToolsOpen.value = false
  }

   /* zoom controls */
  const zoomIn = () => {
    const manager = getCanvasManager()
    if (manager && manager.stateManager) {
      manager.stateManager.zoomIn()
      // Update zoom percentage display
      zoomPercentage.value = Math.round(manager.stateManager.zoom * 100)
      canvasState.zoom = manager.stateManager.zoom
    }
  }

  const zoomOut = () => {
    const manager = getCanvasManager()
    if (manager && manager.stateManager) {
      manager.stateManager.zoomOut()
      // Update zoom percentage display
      zoomPercentage.value = Math.round(manager.stateManager.zoom * 100)
      canvasState.zoom = manager.stateManager.zoom
    }
  }

  /* methods */


</script>

<style scoped>
#world-holder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  background: #050505;
  overflow: hidden;
}

.pane {
  flex: 1;
  height: 100%;
  position: relative;
  border: 1px solid rgba(0, 255, 200, 0.1);
}

.left-pane {
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
}

.anatomy-map {
  max-height: 90%;
  max-width: 90%;
  object-fit: contain;
  opacity: 0.8;
}

.map-overlay {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  pointer-events: none;
}

.anchor-point {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #00ffc8;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  cursor: pointer;
  box-shadow: 0 0 10px #00ffc8;
  transition: transform 0.2s;
}

.anchor-point:hover {
  transform: translate(-50%, -50%) scale(1.5);
}

.anchor-label {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  color: #00ffc8;
  font-size: 10px;
  text-transform: uppercase;
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 4px;
  border-radius: 4px;
}

.right-pane {
  background: #000;
  position: relative;
  overflow: hidden;
  flex: 1;
  height: 100%;
}

#three-canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
}

.evolution-stats {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #00ffc8;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.8);
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #00ffc8;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.evolve-toggle-btn {
  background: #00ffc8;
  color: black;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 10px;
  border-radius: 2px;
}

.evolve-toggle-btn:hover {
  background: #00ccaa;
}

.lens-hud {
  position: absolute;
  pointer-events: none;
  z-index: 100;
}


#three-canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* Behind the 2D canvas */
  pointer-events: none; /* Let clicks pass through to 2D canvas for now, or handle raycasting later */
}

#besearch-world-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none; /* Let clicks pass to 3D canvas */
}

#besearch-world {
  display: block;
  width: 100%;
  height: 100%;
  background: transparent !important;
  pointer-events: none;
}

.depth-layer {
  grid-area: 1 / 1;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 20;
  background: rgba(0, 0, 0, 0.8);
}

#drawing-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  z-index: 15;
}

.drawing-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #00ffc8;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  pointer-events: none;
}

.organ-placeholder, .cell-placeholder {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  animation: pulse-glow 2s infinite alternate;
}

@keyframes pulse-glow {
  from { box-shadow: 0 0 10px rgba(0, 255, 200, 0.2); }
  to { box-shadow: 0 0 30px rgba(0, 255, 200, 0.5); }
}

/* Lens HUD Styles */
.lens-hud {
  position: absolute;
  top: -125px; /* Offset to sit above the lens circle */
  left: -125px;
  width: 250px;
  height: 250px;
  pointer-events: none;
  z-index: 100;
  border: 2px solid rgba(0, 255, 200, 0.3);
  border-radius: 50%;
  transition: border-color 0.3s;
}

.lens-hud.is-locked { 
  border-color: #ff4400; 
  box-shadow: 0 0 20px rgba(255, 68, 0, 0.4);
}

.lens-hud.is-fixed {
  border-color: #00ffc8;
  box-shadow: 0 0 20px rgba(0, 255, 200, 0.4);
}

.fixed-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #00ffc8;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  pointer-events: none;
  text-shadow: 0 0 5px black;
  white-space: nowrap;
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
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
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

#besearch-holder {
  display: grid;
  grid-template-columns: auto 1fr !important; /* Force responsive columns */
  grid-row: 1; /* First row in modal-body grid */
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
  position: relative;
  min-height: 0; /* Critical for grid children to shrink properly */
  min-width: 0;
}

#cycle-periods {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  justify-items: center;
  margin-bottom: 1em;
}

#canvas-container {
  grid-area: 1 / 1;
  position: relative;
  width: 100% !important;
  height: 100% !important;
  overflow: visible; /* Ensure zoom controls stay visible */
  min-height: 0; /* Critical for grid children to shrink properly */
  min-width: 0; /* Critical for grid children to shrink properly */
  max-width: 100%;
  max-height: 100%;
}

#mode-display {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  z-index: 15;
  text-transform: capitalize;
}

#zoom-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  z-index: 15;
}

.zoom-btn {
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.zoom-btn:hover {
  background-color: rgba(255, 255, 255, 1);
}

.zoom-display {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  min-width: 50px;
  text-align: center;
}

#besearch-world {
  display: block !important; /* Force block display, override any global grid styles */
  border: 1px solid rgb(163, 155, 201);
  border-radius: 2%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: white;
  width: 100% !important;
  height: 100% !important;
  box-sizing: border-box; /* Include border in dimensions */
  max-width: 100%;
  max-height: 100%;
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

#life-tools-container {
  position: relative;
  height: 100%;
  min-width: 50px;
  grid-column: 1; /* Explicitly place in first column */
  z-index: 20; /* Higher than canvas */
}

#life-tools-besearch {
  position: absolute;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  z-index: 60; /* Higher than toggle button */
  overflow-y: auto;
  max-height: 100%;
}

#life-tools-besearch.open {
  left: 0;
}

.toggle-life-tools-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 40;
  cursor: pointer;
  transition: all 0.3s ease;
  display: grid;
  align-items: center;
  justify-content: center;
}


.toggle-life-tools-button.panel-open {
  background-color: rgba(59, 130, 246, 0.9);
}

.toggle-life-tools-button.panel-open .tear {
  background-color: #1e40af;
  border-color: #1e40af;
}

.key-to-life {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.tear {
  width: 40px;
  height: 40px;
  border-radius: 0 50% 50% 50%;
  border: 3px solid #3b82f6;
  transform: rotate(45deg);
  background-color: #3b82f6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.key-head {
  position: absolute;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  display: grid;
  place-items: center;
  z-index: 10;
}

.transparent {
  background-color: rgba(255, 255, 255, 0.4);
}

#beebee-agent {
  grid-row: 2; /* Second row in modal-body grid */
  border: 2px solid rgb(202, 199, 241);
}


  @media (min-width: 1024px) {
    #besearch-holder {
      display: grid;
      width: 100%;
      height: 100%;
      position: relative;
    }

    #cycle-periods {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      justify-items: center;
      margin-bottom: 1em;
    }

    #canvas-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    #mode-display {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      color: #333;
      z-index: 15;
      text-transform: capitalize;
    }

    #besearch-world {
      display: grid;
      grid-template-columns: 1fr;
      border: 1px solid rgb(205, 218, 243); /* Make border more visible for debugging */
      border-radius: 2%;
      width: 100%;
      height: 100%;
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

    #life-tools-container {
      position: relative;
    }

    #life-tools-besearch {
      position: absolute;
      top: 0;
      left: -520px;
      width: 540px;
      height: 100%;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      transition: left 0.3s ease;
      z-index: 60;
      overflow-y: auto;
      max-height: 100%;
    }

    #life-tools-besearch.open {
      left: 0;
    }

    .toggle-life-tools-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 60px;
      height: 60px;
      background-color: transparent;
      border: none;
      border-radius: 50%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 40;
      cursor: pointer;
      transition: all 0.3s ease;
      display: grid;
      align-items: center;
      justify-content: center;
    }

    .toggle-life-tools-button.panel-open {
      background-color: rgba(59, 130, 246, 0.9);
    }
    
    .toggle-life-tools-button.panel-open .tear {
      background-color: #1e40af;
      border-color: #1e40af;
    }

    .key-to-life {
      position: relative;
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
    }

    .tear {
      width: 40px;
      height: 40px;
      border-radius: 0 50% 50% 50%;
      border: 3px solid #3b82f6;
      transform: rotate(45deg);
      background-color: #3b82f6;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .key-head {
      position: absolute;
      font-size: 12px;
      font-weight: bold;
      color: white;
      text-transform: uppercase;
      display: grid;
      place-items: center;
      z-index: 10;
    }

    .transparent {
      background-color: rgba(255, 255, 255, 0.9) !important;
      background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px) !important;
      background-size: 20px 20px !important;
    }

    #open-beebee {
      position: fixed;
      bottom: 10px;
      right: 120px;
      z-index: 31;
      display: grid;
      justify-content: center;
      place-self: start;
      align-self: start;
      height: 2em;
      width: 5em;
      background-color: white;
    }
  }

</style>
