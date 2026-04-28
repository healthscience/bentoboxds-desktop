/**
 * HOPDataBridge - Handles communication between canvas and HOP data store
 */
import { watch } from 'vue';

export class HOPDataBridge {
  constructor(besearchStore) {
    this.besearchStore = besearchStore;
    this.eventListeners = new Map();
    this.setupStoreListeners();
  }

  /**
   * Set up listeners for store changes
   */
  setupStoreListeners() {
    if (!this.besearchStore) {
      return;
    }

    let lastSignature = this.getCyclesSignature(this.getBesearchCycles());

    watch(
      () => this.besearchStore.besearchCyles?.length || 0,
      () => {
        const cycles = this.besearchStore.besearchCyles || [];
        const signature = this.getCyclesSignature(cycles);
        if (signature !== lastSignature) {
          lastSignature = signature;
          this.emit('cycles-updated', this.getBesearchCycles());
        }
      },
      { deep: false }
    );
  }

  getCyclesSignature(cycles = []) {
    if (cycles.length === 0) {
      return '0';
    }
    const lastCycle = cycles[cycles.length - 1];
    const lastKey = lastCycle?.key || lastCycle?.id || lastCycle?.value?.id || '';
    const lastUpdated = lastCycle?.updatedAt || lastCycle?.value?.updatedAt || '';
    return `${cycles.length}:${lastKey}:${lastUpdated}`;
  }

  /**
   * Get besearch cycles from store
   */
  getBesearchCycles() {
    return this.besearchStore?.besearchCyclesNormalized || this.besearchStore?.besearchCyles || [];
  }

  /**
   * Get interventions from store
   */
  getInterventions() {
    return this.besearchStore?.interventions || [];
  }

  /**
   * Get canvas state from store
   */
  getCanvasState() {
    const store = this.besearchStore
    if (!store) return {
      peerPosition: { x: 100, y: 100 },
      peerDirection: { x: 0, y: 0 },
      viewport: { x: 0, y: 0 },
      currentMode: 'cues',
      zoom: 1.0,
      panOffset: { x: 0, y: 0 },
      emulationDepth: 0
    }
    const canvasState = {
      peerPosition: store.getPeerPosition(),
      peerDirection: store.canvasState.peerDirection,
      viewport: store.canvasState.viewport,
      currentMode: store.canvasState.currentMode,
      zoom: store.canvasState.zoom,
      panOffset: store.canvasState.panOffset,
      emulationDepth: store.canvasState.emulationDepth || 0
    };
    return canvasState;
  }

  /**
   * Update peer position in store
   */
  updatePeerPosition(position) {
    if (this.besearchStore) {
      this.besearchStore.updatePeerPosition(position);
    }
  }

  /**
   * Update peer direction in store
   */
  updatePeerDirection(direction) {
    if (this.besearchStore) {
      this.besearchStore.updatePeerDirection(direction);
    }
  }

  /**
   * Update viewport in store
   */
  updateViewport(viewport) {
    if (this.besearchStore) {
      this.besearchStore.updateViewport(viewport);
    }
  }

  /**
   * Update zoom in store
   */
  updateZoom(zoom) {
    if (this.besearchStore) {
      this.besearchStore.updateZoom(zoom);
    }
  }

  /**
   * Update pan offset in store
   */
  updatePanOffset(panOffset) {
    if (this.besearchStore) {
      this.besearchStore.updatePanOffset(panOffset);
    }
  }

  /**
   * Add intervention to store
   */
  addIntervention(intervention) {
    if (this.besearchStore) {
      this.besearchStore.addIntervention(intervention);
    }
  }

  /**
   * Update intervention in store
   */
  updateIntervention(interventionId, updates) {
    if (this.besearchStore) {
      this.besearchStore.updateIntervention(interventionId, updates);
    }
  }

  /**
   * Remove intervention from store
   */
  removeIntervention(interventionId) {
    if (this.besearchStore) {
      this.besearchStore.removeIntervention(interventionId);
    }
  }

  /**
   * Add besearch cycle to store
   */
  addBesearchCycle(cycle) {
    console.log('Adding besearch cycle to store:', cycle);
    if (this.besearchStore) {
      // this.besearchStore.addBesearchCycle(cycle);
    }
  }

  /**
   * Update besearch cycle in store
   */
  updateBesearchCycle(cycleId, updates) {
    if (this.besearchStore) {
      this.besearchStore.updateBesearchCycle(cycleId, updates);
    }
  }

  /**
   * Remove besearch cycle from store
   */
  removeBesearchCycle(cycleId) {
    if (this.besearchStore) {
      this.besearchStore.removeBesearchCycle(cycleId);
    }
  }

  /**
   * Save cycle to HOP
   */
  saveCycleToHOP(cycle) {
    if (this.besearchStore) {
      this.besearchStore.saveToHOP(cycle);
    }
  }

  /**
   * Get selected intervention from store
   */
  getSelectedIntervention() {
    return this.besearchStore?.selectedIntervention;
  }

  /**
   * Get selected category from store
   */
  getSelectedCategory() {
    return this.besearchStore?.selectedCategory;
  }

  /**
   * Set event listener
   */
  on(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType).add(callback);
  }

  /**
   * Remove event listener
   */
  off(eventType, callback) {
    if (this.eventListeners.has(eventType)) {
      this.eventListeners.get(eventType).delete(callback);
    }
  }

  /**
   * Emit event to listeners
   */
  emit(eventType, data) {
    if (this.eventListeners.has(eventType)) {
      this.eventListeners.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${eventType} event listener:`, error);
        }
      });
    }
  }

  /**
   * Save current canvas state to HOP
   */
  saveCanvasState() {
    if (this.besearchStore) {
      this.besearchStore.saveToHOP({
        type: 'canvas-state',
        data: this.besearchStore.canvasState
      });
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.eventListeners.clear();
  }
}

export default HOPDataBridge;
