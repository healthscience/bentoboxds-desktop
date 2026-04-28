import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from "vue";
import { BesearchCanvasManager } from "../canvas/managers/BesearchCanvasManager.js";
import { besearchStore } from "../stores/besearchStore.js";

export function useBesearchCanvas(
  canvasRef,
  onZoomChange = null,
  autoInit = true
) {
  // Reactive state
  const canvasState = reactive({
    isInitialized: false,
    currentMode: "cues",
    zoom: 1,
    pan: { x: 0, y: 0 },
  });
  // Canvas manager instance
  let canvasManager = null;
  // Initialize canvas
  const initializeCanvas = async () => {
    if (canvasManager) {
      canvasManager.destroy();
      canvasManager = null;
      canvasState.isInitialized = false;
    }
    if (!canvasRef.value) {
      // Don't warn, as this might be expected if the canvas is in a modal that isn't open yet
      return;
    }

    try {
      // Wait for canvas to have valid dimensions
      const dimensions = await waitForValidDimensions(canvasRef.value);
      if (!dimensions) {
        // console.error('Canvas failed to get valid dimensions after timeout')
        return;
      }
      const storeBesearch = besearchStore();
      // Load data from HOP before initializing canvas
      // await storeBesearch.loadFromHOP()
      canvasManager = new BesearchCanvasManager(canvasRef.value, storeBesearch);
      // Set up event listeners
      canvasManager.on("intervention-selected", (intervention) => {
        storeBesearch.setSelectedIntervention(intervention);
      });
      canvasManager.on("category-selected", (category) => {
        storeBesearch.setSelectedCategory(category);
      });
      canvasManager.on("cycle-edit", (cycle) => {
        // Handle cycle editing - could emit to parent component
        // For now, we'll handle this in the component
      });
      // Listen for zoom changes to keep canvasState.zoom in sync
      canvasManager.on("zoom-changed", (zoom) => {
        canvasState.zoom = zoom;
        // Call the callback if provided
        if (onZoomChange) {
          onZoomChange(zoom);
        }
      });
      canvasState.isInitialized = true;
      // Start the canvas
      canvasManager.start();
    } catch (error) {
      console.error("Failed to initialize canvas:", error);
    }
  };

  onMounted(() => {
    // console.log('useBesearchCanvas onMounted, autoInit:', autoInit)
    if (autoInit) {
      initializeCanvas();
    }
  });

  /**
   * Wait for canvas to have valid dimensions
   * Returns dimensions once canvas has non-zero width and height
   */
  const waitForValidDimensions = (canvas, maxAttempts = 20, delayMs = 50) => {
    return new Promise((resolve) => {
      let attempts = 0;
      const checkDimensions = () => {
        if (!canvas) {
          resolve(null);
          return;
        }
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          resolve({ width: rect.width, height: rect.height });
          return;
        }
        attempts++;
        if (attempts >= maxAttempts) {
          // console.warn('Canvas dimensions check timed out after', attempts, 'attempts')
          resolve(null);
          return;
        }
        setTimeout(checkDimensions, delayMs);
      };
      checkDimensions();
    });
  };

  // Mode operations
  const setMode = (mode) => {
    if (canvasManager) {
      canvasManager.setMode(mode);
      canvasState.currentMode = mode;
    }
  };

  // Peer operations
  const updatePeerPosition = (position) => {
    if (canvasManager) {
      canvasManager.updatePeerPosition(position);
    }
  };

  const updatePeerDirection = (direction) => {
    if (canvasManager) {
      canvasManager.updatePeerDirection(direction);
    }
  };

  // Cycle operations
  const addCycle = (cycleData) => {
    if (canvasManager) {
      canvasManager.addCycle(cycleData);
    }
  };

  const removeCycle = (cycleId) => {
    if (canvasManager) {
      canvasManager.removeCycle(cycleId);
    }
  };

  // Intervention operations
  const addIntervention = (interventionData) => {
    if (canvasManager) {
      canvasManager.addIntervention(interventionData);
    }
  };

  const removeIntervention = (interventionId) => {
    if (canvasManager) {
      canvasManager.removeIntervention(interventionId);
    }
  };

  // Viewport operations
  const zoomIn = () => {
    if (canvasManager && canvasManager.stateManager) {
      canvasManager.stateManager.zoomIn();
      canvasState.zoom = canvasManager.stateManager.zoom;
    }
  };

  const zoomOut = () => {
    if (canvasManager && canvasManager.stateManager) {
      canvasManager.stateManager.zoomOut();
      canvasState.zoom = canvasManager.stateManager.zoom;
    }
  };

  const resetZoom = () => {
    if (canvasManager && canvasManager.stateManager) {
      canvasManager.stateManager.resetZoom();
      canvasState.zoom = canvasManager.stateManager.zoom;
    }
  };

  // Get canvas manager for direct access if needed
  const getCanvasManager = () => {
    return canvasManager;
  };

  // Cleanup
  const destroy = () => {
    if (canvasManager) {
      canvasManager.destroy();
      canvasManager = null;
      canvasState.isInitialized = false;
    }
  };

  // Lifecycle
  onMounted(async () => {
    await nextTick();
    initializeCanvas();
  });

  onUnmounted(() => {
    // destroy()
  });

  return {
    // State
    canvasState,
    // Initialization
    initializeCanvas,
    destroy,
    // Mode
    setMode,
    // Peer
    updatePeerPosition,
    updatePeerDirection,
    // Cycles
    addCycle,
    removeCycle,
    // Interventions
    addIntervention,
    removeIntervention,
    // Viewport
    zoomIn,
    zoomOut,
    resetZoom,
    // Direct access
    getCanvasManager,
  };
}
