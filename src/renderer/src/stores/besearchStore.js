import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useSocketStore } from "@/stores/socket.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";

export const besearchStore = defineStore("besearchstore", {
  state: () => ({
    socketStore: new useSocketStore(),
    besearchHistoryStatus: false,
    besearchCyles: [],
    spaceLocation: [],
    interventions: [],
    markers: [],
    networkExperiments: [],
    // UI state for component communication
    selectedIntervention: null,
    selectedCategory: null,
    showCreateForm: false,
    showBesearchDetail: false,
    isBesearchLayerOpen: false,
    isSculptingLayerOpen: false,
    wasSculptingLayerOpen: false,
    wasBesearchCycleOpen: false,
    showBottomPanel: false,
    bottomHeight: 60,
    activeBesearchThread: "besearch:prime:longevity_65",
    currentBesearchStage: "capacity", // capacity, logic, heli, emulation
    activeSeeds: {
      orgos: [],
      gelles: [],
    },
    besearchThread: [],
    activeBesearchContext: {
      capacity: null,
      context: null,
      attunement: null,
      orbits: 65,
      days: null,
      arcs: null,
      strategy: null,
    },
    braidStrands: [],
    // bbNexus shared context payload

    nexusContext: {
      world: "cues",
      cueId: null,
      spaceId: null,
      bentoboxId: null,
      source: "besearch",
    },
    // Canvas state persistence
    canvasState: {
      peerPositions: {
        cues: { x: 400, y: 300 }, // Center of typical screen
        body: { x: 400, y: 300 },
        earth: { x: 400, y: 300 },
      },
      currentMode: "cues",
      emulationDepth: 0,
      peerDirection: "down",
      interventions: [],
      viewport: { x: 0, y: 0 }, // For game-world scrolling
      zoom: 1.0,
      panOffset: { x: 0, y: 0 },
      showBottomPanel: false,
      bottomHeight: 60,
      worldBounds: { width: 5000, height: 5000 }, // Large game world
    },
    isEmulationActive: false,
    emulationPulse: 1.0,
    emulationPulseInterval: null,
    isBraidingMode: false,
  }),
  getters: {
    besearchCyclesNormalized: (state) => {
      return state.besearchCyles.map((entry, index) => {
        const value = entry?.value || entry || {};
        return {
          hopKey: entry?.key,
          seq: entry?.seq ?? index,
          id: value.id || entry?.key || `cycle-${index}`,
          name: value.name || "New Cycle",
          description: value.description || "",
          category: value.category || "custom",
          status: value.status || "pending",
          networkExperimentId:
            value.networkExperimentId || value.networkExperiment || "",
          markerIds: value.markerIds || value.marker || [],
          consilience: value.consilience || [],
          besearchCycles: value.besearchCycles || [],
          createdAt: value.createdAt,
          updatedAt: value.updatedAt,
          x: value.x ?? 200,
          y: value.y ?? 200,
          active: value.active !== false,
          linkedInterventions: value.linkedInterventions || [],
        };
      });
    },
    interventionsByCategory: (state) => {
      const grouped = {
        prevention: [],
        repair: [],
        rejuvenation: [],
        experimental: [],
        custom: [],
      };
      for (const intervention of state.interventions) {
        const category = intervention.category || "custom";
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(intervention);
      }
      return grouped;
    },
    activeNetworkExperiments: (state) => {
      return state.networkExperiments.map((nxp) => ({
        id: nxp.id,
        name: nxp.name,
        cueId: nxp.cueId,
        status: nxp.status,
      }));
    },
    availableMarkers: (state) => {
      return state.markers.map((marker) => ({
        id: marker.id,
        name: marker.name,
        cueId: marker.cueId,
        datatype: marker.datatype,
      }));
    },
    hasActiveIntervention: (state) => {
      return (
        state.selectedIntervention !== null &&
        state.selectedIntervention !== undefined
      );
    },
  },
  actions: {
    openCreateForm() {
      this.showCreateForm = true;
    },
    closeCreateForm() {
      this.showCreateForm = false;
    },
    // Save besearch data to HOP with specific action
    saveToHOP(besearchData) {
      try {
        // Prepare message for HOP
        let bcContract = {
          type: "library",
          action: "besearch",
          reftype: "besearch-create",
          task: "PUT",
          privacy: "private",
          data: besearchData,
        };
        // Send via socket to HOP
        this.socketStore.send_message(bcContract);
        return { success: true, message: `operation saved successfully` };
      } catch (error) {
        console.error("Error saving to HOP:", error);
        return { success: false, message: "Failed to save: " + error.message };
      }
    },
    // delete besearch item
    deleteBesearch(besearchItem) {
      try {
        // Prepare message for HOP
        let bcContract = {
          type: "library",
          action: "besearch",
          reftype: "besearch-cycle",
          task: "DEL",
          privacy: "private",
          data: besearchItem,
        };
        // Send via socket to HOP
        this.socketStore.send_message(bcContract);
        // remove from besearch history
        this.besearchCyles = this.besearchCyles.filter(
          (item) => item.key !== besearchItem.id,
        );
      } catch (error) {
        console.error("Error saving to HOP:", error);
      }
    },
    // Load besearch data from HOP
    async loadFromHOP() {
      try {
        const socketStore = this.socketStore;

        // Prepare query message for HOP
        let queryContract = {
          type: "besearch",
          action: "besearch-cycle",
          reftype: "train-hopquery",
          task: "GET",
          privacy: "private",
          data: {
            operation: "load",
            timestamp: new Date().toISOString(),
          },
        };
        if (socketStore.connection_ready) {
          socketStore.send_message(queryContract);
          return { success: true, message: "Load request sent" };
        } else {
          console.warn("Socket not ready, cannot load from HOP");
          return {
            success: false,
            message: "Connection not ready, please try again",
          };
        }
      } catch (error) {
        console.error("Error loading from HOP:", error);
        return { success: false, message: "Failed to load: " + error.message };
      }
    },
    // Process reply from HOP
    processReply(replyData) {
      // saved or start data
      if (replyData.action === "besearch-history") {
        this.besearchCyles = replyData.data;
      } else if (replyData.action === "besearch-contract") {
        // add besearch item to besearch world canvas
        console.log("besearch contract reply saved");
        console.log(replyData);
        const savedEntry = replyData.data?.data || replyData.data || replyData;
        const normalizedEntry =
          savedEntry?.key && savedEntry?.value
            ? savedEntry
            : {
                key: savedEntry?.key || savedEntry?.id,
                value: savedEntry?.value || savedEntry,
              };
        this.besearchCyles.push(normalizedEntry);
        /* try {
          if (replyData.data && replyData.data.besearchCycles) {
            // Update besearch cycles
            this.besearchCyles = replyData.data.besearchCycles
          }
          if (replyData.data && replyData.data.interventions) {
            this.interventions = replyData.data.interventions
          }
          if (replyData.data && replyData.data.markers) {
            this.markers = replyData.data.markers
          }
          if (replyData.data && replyData.data.networkExperiments) {
            this.networkExperiments = replyData.data.networkExperiments
          }
          if (replyData.data && replyData.data.canvasState) {
            // Update canvas state
            this.canvasState = { ...this.canvasState, ...replyData.data.canvasState }
          }
          this.isLoaded = true
          this.isLoading = false
          this.loadError = null
          return { success: true, message: 'Data loaded successfully' }
        } catch (error) {
          console.error('Error processing HOP reply:', error)
          this.isLoading = false
          this.loadError = 'Failed to process reply: ' + error.message
          return { success: false, message: 'Failed to process reply: ' + error.message }
        }*/
      }
    },
    updatePeerPosition(position) {
      if (this.canvasState.peerPositions[this.canvasState.currentMode]) {
        this.canvasState.peerPositions[this.canvasState.currentMode] = {
          ...position,
        };
      } else {
        this.canvasState.peerPositions[this.canvasState.currentMode] = {
          ...position,
        };
      }
    },
    getPeerPosition(mode = null) {
      const targetMode = mode || this.canvasState.currentMode;
      const position = this.canvasState.peerPositions[targetMode] || {
        x: 800,
        y: 450,
      };
      return position;
    },
    setCurrentMode(mode) {
      this.canvasState.currentMode = mode;
    },
    updatePeerDirection(direction) {
      this.canvasState.peerDirection = direction;
    },
    updateViewport(viewport) {
      this.canvasState.viewport = { ...viewport };
    },
    updateZoom(zoom) {
      this.canvasState.zoom = zoom;
    },
    updatePanOffset(panOffset) {
      this.canvasState.panOffset = { ...panOffset };
    },
    updateBesearchCycle(cycleId, updates) {
      const index = this.besearchCyles.findIndex((entry) => {
        const value = entry?.value || entry || {};
        return value.id === cycleId || entry?.key === cycleId;
      });
      if (index === -1) return;

      const entry = this.besearchCyles[index];
      const value = entry?.value || entry || {};
      const updatedValue = {
        ...value,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      const updatedEntry = entry?.value
        ? { ...entry, value: updatedValue }
        : { ...updatedValue, key: entry?.key || updatedValue.id };

      this.besearchCyles.splice(index, 1, updatedEntry);
    },
    saveCyclePositionsToHOP() {
      const payload = this.besearchCyclesNormalized.map((cycle) => ({
        id: cycle.id,
        x: cycle.x,
        y: cycle.y,
        linkedInterventions: cycle.linkedInterventions || [],
        updatedAt: new Date().toISOString(),
      }));
      this.saveToHOP({
        type: "besearch-cycle-positions",
        cycles: payload,
      });
    },
    addIntervention(intervention) {
      this.canvasState.interventions.push(intervention);
    },
    updateIntervention(id, updates) {
      const index = this.canvasState.interventions.findIndex(
        (i) => i.id === id,
      );
      if (index !== -1) {
        this.canvasState.interventions[index] = {
          ...this.canvasState.interventions[index],
          ...updates,
        };
      }
    },
    removeIntervention(id) {
      this.canvasState.interventions = this.canvasState.interventions.filter(
        (i) => i.id !== id,
      );
    },
    // UI state management for component communication
    setSelectedIntervention(intervention) {
      // Clear any active life-strap when selecting an intervention
      // This ensures the bottom panel shows the besearch detail
      const storeAI = aiInterfaceStore();
      if (storeAI.activeLifeStrapID) {
        storeAI.activeLifeStrapID = "";
        storeAI.activeContractKey = "";
      }
      this.selectedIntervention = intervention;
      this.showBesearchDetail = true;
      this.showBottomPanel = true;
      this.bottomHeight = 600;
    },
    setSelectedCategory(category) {
      this.selectedCategory = category;
    },
    clearSelection() {
      this.selectedIntervention = null;
      this.selectedCategory = null;
    },
    setNexusContext(context) {
      this.nexusContext = { ...this.nexusContext, ...context };
    },
    setNexusWorld(world) {
      this.nexusContext.world = world;
      this.canvasState.currentMode = world;
    },
    setNexusSource(source) {
      this.nexusContext.source = source;
    },
    setNexusCue(cueId) {
      this.nexusContext.cueId = cueId;
    },
    setNexusSpace(spaceId) {
      this.nexusContext.spaceId = spaceId;
    },
    setNexusBentobox(bentoboxId) {
      this.nexusContext.bentoboxId = bentoboxId;
    },
    openBesearchLayer(context = null) {
      if (context) {
        this.activeBesearchContext = {
          ...this.activeBesearchContext,
          ...context,
        };
      }
      if (this.isSculptingLayerOpen) {
        this.wasSculptingLayerOpen = true;
        this.isSculptingLayerOpen = false;
      }
      this.isBesearchLayerOpen = true;
    },
    closeBesearchLayer() {
      this.isBesearchLayerOpen = false;
      // No longer automatically restoring here to avoid double-triggering
      // The individual components (besearchLayer and BesearchFuse) handle restoration
    },
    openSculptingLayer() {
      this.isSculptingLayerOpen = true;
    },
    closeSculptingLayer() {
      this.isSculptingLayerOpen = false;
    },
    restoreSculptingLab() {
      const storeAI = aiInterfaceStore();
      storeAI.currentMode = "orbit";
      this.isSculptingLayerOpen = true;
      this.wasSculptingLayerOpen = false;
    },
    restoreBesearchCycle() {
      const storeAI = aiInterfaceStore();
      storeAI.currentMode = "orbit";
      this.isBesearchLayerOpen = true;
      this.wasBesearchCycleOpen = false;

      // Restore lens and bottom panel state
      storeAI.showLifestapLens = false;
      this.showBottomPanel = true;
      this.bottomHeight = window.innerHeight * 0.82;
    },
    updateBesearchThread(mutation) {
      this.besearchThread.push({
        thread: this.activeBesearchThread,
        ...mutation,
        timestamp: new Date().toISOString(),
      });
      // Commit mutation to Hyperbee via saveToHOP
      this.saveToHOP({
        type: "besearch-thread-mutation",
        thread: this.activeBesearchThread,
        mutation: mutation,
      });
    },
    setActiveThread(threadKey) {
      this.activeBesearchThread = threadKey;
    },
    verifyTriPointLock() {
      const { capacity, context, orbits, days, arcs } =
        this.activeBesearchContext;
      return !!(capacity && context && (orbits || days || arcs));
    },
    startEmulation() {
      if (this.emulationPulseInterval) return;
      this.isEmulationActive = true;

      const bpm = 72;
      const bps = bpm / 60;
      const period = 1000 / bps;
      let startTime = Date.now();

      const updatePulse = () => {
        if (!this.isEmulationActive) {
          if (this.emulationPulseInterval) {
            cancelAnimationFrame(this.emulationPulseInterval);
            this.emulationPulseInterval = null;
          }
          return;
        }

        const time = Date.now() - startTime;
        const t = (time % period) / period;
        let pulseValue = 1.0;

        if (t < 0.15) {
          pulseValue = 1.0 + Math.sin((t / 0.15) * Math.PI) * 0.15;
        } else if (t > 0.25 && t < 0.4) {
          pulseValue = 1.0 + Math.sin(((t - 0.25) / 0.15) * Math.PI) * 0.1;
        } else {
          pulseValue = 1.0;
        }

        this.emulationPulse = pulseValue;
        this.emulationPulseInterval = requestAnimationFrame(updatePulse);
      };

      this.emulationPulseInterval = requestAnimationFrame(updatePulse);
    },
    stopEmulation() {
      this.isEmulationActive = false;
      if (this.emulationPulseInterval) {
        cancelAnimationFrame(this.emulationPulseInterval);
        this.emulationPulseInterval = null;
      }
      this.emulationPulse = 1.0;
    },
    toggleBraidingMode() {
      this.isBraidingMode = !this.isBraidingMode;
    },
    commitStrandToBraid() {
      // Push current context as a completed strand
      this.braidStrands.push({
        ...this.activeBesearchContext,
        timestamp: new Date().toISOString(),
      });

      // Reset context for next strand
      this.activeBesearchContext = {
        capacity: null,
        context: null,
        attunement: null,
        orbits: 65,
        days: null,
        arcs: null,
        strategy: this.activeBesearchContext.strategy,
      };

      // Reset stage to start over
      this.currentBesearchStage = "capacity";
      this.stopEmulation();
    },
  },
});
