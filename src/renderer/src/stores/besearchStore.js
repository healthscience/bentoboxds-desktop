import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useSocketStore } from "@/stores/socket.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { loomStore } from "@/stores/loomStore.js";

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
    isAttunementLayerOpen: false,
    isGraftLayerOpen: false,
    isAttunementExpanded: true,
    isGraftExpanded: true,
    isSculptingLayerOpen: false,
    isHeliProjectOpen: false,
    wasSculptingLayerOpen: false,
    wasBesearchCycleOpen: false,
    showBottomPanel: false,
    bottomHeight: 60,
    // Expansion states for the dual-layer view

    isLensExpanded: false,
    isBesearchExpanded: true,
    isLogicExpanded: true,
    isDevicesExpanded: true,
    isHeliExpanded: true,
    isEmulationExpanded: true,
    activeBesearchThread: "besearch:prime:longevity_65",
    currentBesearchStage: "capacity", // capacity, logic, heli, emulation
    besearchMode: "default", // default, lens, besearch
    isSieveExpanded: false,
    activeSeeds: {
      orgos: [],
      gelles: [],
    },
    besearchThread: [],
    activeBesearchContext: {
      capacity: null,
      logic: null,
      heli: null,
      context: null,
      attunement: null,
      orbits: 65,
      days: null,
      arcs: null,
      strategy: null,
      story: "",
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
    strandMode: false, // false = OFF, true = ON (isStranded)
    isOrgoLogic: false, // false = OFF, true = ON
    huudLayerIndex: 0,
    huudContext: "world", // world, lens, lab, heli, emulation
    previousHUUDContext: "world",
    // Besearch Cycles (Strands)
    activeCycleId: null,
    isCycleLineExpanded: false,
    besearchCycles: [],
    cyclesCache: {}, // lifeStrapID -> array of cycles
  }),
  getters: {
    aiStore: () => aiInterfaceStore(),
    loomStore: () => loomStore(),
    activeCycle: (state) => {
      return state.besearchCycles.find(c => c.id === state.activeCycleId) || null;
    },
    evaluateConduction: (state) => {
      if (!state.strandMode) return null;

      const loom = loomStore();
      const capacityStrands = (loom.lifestrapTexture?.pillars?.capacity || [])
        .filter((item) => item.activeStrand);
      const contextStrands = (loom.lifestrapTexture?.pillars?.context || [])
        .filter((item) => item.activeStrand);

      const allStrandedCues = [...capacityStrands, ...contextStrands];

      if (!state.isOrgoLogic) {
        // Implied Matrix: Variables are co-equal peers
        return {
          type: "CO_EQUAL_FIELD",
          nodes: allStrandedCues.map((c) => c.value),
        };
      }

      // Implied Sequence: Order matters, process linearly
      return {
        type: "DIRECTIONAL_PIPELINE",
        pipeline: allStrandedCues.map((c) => c.value),
      };
    },
    canEnterBench: (state) => {
      const loom = loomStore();
      const pillars = loom.lifestrapTexture?.pillars;
      const hasCapacity = pillars?.capacity?.length > 0;
      const hasContext = pillars?.context?.length > 0;
      return hasCapacity && hasContext;
    },
    besearchCyclesNormalized: (state) => {
      return state.besearchCyles.map((entry, index) => {
        const value = entry?.value || entry || {};
        return {
          hopKey: entry?.key,
          seq: entry?.seq ?? index,
          id: value.id || entry?.key || "cycle-" + index,
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
        return { success: true, message: "operation saved successfully" };
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
      const aiStore = aiInterfaceStore();
      if (aiStore.activeLifeStrapID) {
        aiStore.activeLifeStrapID = "";
        aiStore.activeContractKey = "";
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
      this.setHUUDState("lens");
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
    openHeliProject() {
      this.isHeliProjectOpen = true;
    },
    closeHeliProject() {
      this.isHeliProjectOpen = false;
    },
    restoreSculptingLab() {
      const aiStore = aiInterfaceStore();
      aiStore.currentMode = "orbit";
      this.isSculptingLayerOpen = true;
      this.wasSculptingLayerOpen = false;
    },
    restoreBesearchCycle() {
      const aiStore = aiInterfaceStore();
      aiStore.currentMode = "orbit";
      this.isBesearchLayerOpen = true;
      this.wasBesearchCycleOpen = false;

      // Restore lens and bottom panel state
      aiStore.showLifestapLens = false;
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
    transitionToBench() {
      this.setHUUDState("besearch");
    },
    transitionToSieve() {
      this.setHUUDState("lens");
    },
    setHUUDState(mode, forceOpen = true) {
      const aiStore = aiInterfaceStore();
      this.besearchMode = mode;
      
      if (mode === "default") {
        this.isBesearchLayerOpen = false;
        this.isAttunementLayerOpen = false;
        this.isGraftLayerOpen = false;
        this.isSculptingLayerOpen = false;
        this.isSieveExpanded = false;
        this.isLensExpanded = false;
        this.showBottomPanel = false;
        this.bottomHeight = 60;
        aiStore.showLifestapLens = true; // "collapsed" legacy behavior
        this.setHUUDLayer(this.previousHUUDContext || "world");
      } else if (mode === "lens") {
        this.previousHUUDContext = this.huudContext !== "lens" ? this.huudContext : this.previousHUUDContext;
        if (aiStore.currentMode === "zen") {
          aiStore.currentMode = "extracting";
        }
        this.isBesearchLayerOpen = false;
        this.isAttunementLayerOpen = false;
        this.isGraftLayerOpen = false;
        this.isSculptingLayerOpen = false;
        this.isSieveExpanded = true;
        this.isLensExpanded = true;
        
        if (forceOpen) {
          this.showBottomPanel = true;
          this.bottomHeight = window.innerHeight * 0.82;
        }
        
        aiStore.showLifestapLens = false; // Show lens content
        this.setHUUDLayer("lens");
      } else if (mode === "attunement") {
        if (aiStore.currentMode === "zen") {
          aiStore.currentMode = "extracting";
        }
        this.isBesearchLayerOpen = false; 
        this.isAttunementLayerOpen = true;
        this.isGraftLayerOpen = false;
        this.isHeliProjectOpen = true;
        this.isSculptingLayerOpen = false;
        this.isAttunementExpanded = true;
        this.isHeliExpanded = false;
        this.isSieveExpanded = false;
        this.isLensExpanded = false;
        
        if (forceOpen) {
          this.showBottomPanel = true;
          this.bottomHeight = window.innerHeight * 0.82;
        }
        
        aiStore.showLifestapLens = true; 
        this.setHUUDLayer("lens");
      } else if (mode === "graft") {
        if (aiStore.currentMode === "zen") {
          aiStore.currentMode = "extracting";
        }
        this.isBesearchLayerOpen = false;
        this.isAttunementLayerOpen = false;
        this.isGraftLayerOpen = true;
        this.isHeliProjectOpen = true;
        this.isSculptingLayerOpen = false;
        this.isGraftExpanded = true;
        this.isAttunementExpanded = false;
        this.isHeliExpanded = false;
        this.isSieveExpanded = false;
        this.isLensExpanded = false;

        if (forceOpen) {
          this.showBottomPanel = true;
          this.bottomHeight = window.innerHeight * 0.82;
        }

        aiStore.showLifestapLens = true;
        this.setHUUDLayer("lens");
      } else if (mode === "heli") {
        if (aiStore.currentMode === "zen") {
          aiStore.currentMode = "extracting";
        }
        this.isBesearchLayerOpen = false;
        this.isAttunementLayerOpen = true;
        this.isGraftLayerOpen = false;
        this.isHeliProjectOpen = true;
        this.isSculptingLayerOpen = false;
        this.isAttunementExpanded = false;
        this.isHeliExpanded = true;
        this.isSieveExpanded = false;
        this.isLensExpanded = false;

        if (forceOpen) {
          this.showBottomPanel = true;
          this.bottomHeight = window.innerHeight * 0.85;
        }

        aiStore.showLifestapLens = true;
        this.setHUUDLayer("lens");
      } else if (mode === "emulation") {
        this.isBesearchLayerOpen = false;
        this.isAttunementLayerOpen = false;
        this.isGraftLayerOpen = false;
        this.isHeliProjectOpen = false;
        this.isSculptingLayerOpen = false;
        
        if (forceOpen) {
          this.showBottomPanel = true;
          this.bottomHeight = window.innerHeight * 0.82;
        }
        
        aiStore.showLifestapLens = true;
        this.setHUUDLayer("lab");
      } else if (mode === "tinker") {
        this.isBesearchLayerOpen = false;
        this.isAttunementLayerOpen = false;
        this.isGraftLayerOpen = false;
        this.isHeliProjectOpen = false;
        this.isSculptingLayerOpen = false;
        
        if (forceOpen) {
          this.showBottomPanel = true;
          this.bottomHeight = window.innerHeight * 0.82;
        }
        
        aiStore.showLifestapLens = true;
        this.setHUUDLayer("lab");
      } else if (mode === "besearch") {
        if (aiStore.currentMode === "zen" || aiStore.currentMode === "extracting") {
          aiStore.currentMode = "active";
        }
        this.isBesearchLayerOpen = true;
        this.isAttunementLayerOpen = true;
        this.isGraftLayerOpen = true;
        this.isHeliProjectOpen = true;
        this.isSculptingLayerOpen = false;
        this.isAttunementExpanded = false;
        this.isHeliExpanded = false;
        this.isSieveExpanded = false;
        this.isLensExpanded = false;
        this.isBesearchExpanded = true;
        this.isLogicExpanded = true;
        this.isEmulationExpanded = false;
        this.currentBesearchStage = "logic";
        
        if (forceOpen) {
          this.showBottomPanel = true;
          this.bottomHeight = window.innerHeight * 0.85;
        }
        
        aiStore.showLifestapLens = true; 
        this.setHUUDLayer("lab");
      }
    },

    toggleBesearchExpansion() {
      this.isBesearchExpanded = !this.isBesearchExpanded;
    },
    rotateHUUD(direction) {
      const layers = ["world", "lens", "lab", "heli"];
      const count = layers.length;
      if (direction === "up") {
        this.huudLayerIndex = (this.huudLayerIndex - 1 + count) % count;
      } else {
        this.huudLayerIndex = (this.huudLayerIndex + 1) % count;
      }
      this.huudContext = layers[this.huudLayerIndex];
    },
    setHUUDLayer(layerName) {
      const layers = ["world", "lens", "lab", "heli"];
      const index = layers.indexOf(layerName);
      if (index !== -1) {
        this.huudLayerIndex = index;
        this.huudContext = layers[index]; 
      } else {
        console.error("HUD: Unknown layerName:", layerName);
      }
    },
    // Besearch Cycle Management
    loadCyclesForLifestrap(lifeStrapId) {
      const aiStore = aiInterfaceStore();
      
      // 1. Save current cycles to cache for previous ID if it exists
      const currentID = aiStore.activeLifeStrapID;
      if (currentID) {
        this.cyclesCache[currentID] = [...this.besearchCycles];
      }

      // 2. Load new cycles from cache
      if (this.cyclesCache[lifeStrapId]) {
        this.besearchCycles = [...this.cyclesCache[lifeStrapId]];
        if (this.besearchCycles.length > 0) {
          this.setActiveCycle(this.besearchCycles[0].id);
        } else {
          this.clearActiveStrandFlags();
        }
      } else {
        // No cycles for this lifestrap yet
        this.besearchCycles = [];
        this.clearActiveStrandFlags();
      }
      
      this.isCycleLineExpanded = false;
    },
    clearActiveStrandFlags() {
      const loom = loomStore();
      this.activeCycleId = null;
      if (loom.lifestrapTexture?.pillars) {
        Object.keys(loom.lifestrapTexture.pillars).forEach(pillarKey => {
          if (Array.isArray(loom.lifestrapTexture.pillars[pillarKey])) {
            loom.lifestrapTexture.pillars[pillarKey].forEach(item => {
              item.activeStrand = false;
            });
          }
        });
      }
    },
    createNewCycle() {
      const id = "strand-" + Math.random().toString(36).substr(2, 9);
      const newCycle = {
        id: id,
        name: "Strand " + (this.besearchCycles.length + 1),
        state: {
          lens: { selectedCues: [] },
          heli: { daySeeker: 0, isProjecting: false },
          attunement: { slots: [{ label: "Set Attunement", value: "", type: "" }] },
          grafting: { activeOrgos: [], activeGelles: [], droppedInstruments: [] },
          emulation: { depth: 0 },
          tinkering: { stability: 98.4, iterations: 42 }
        }
      };
      this.besearchCycles.push(newCycle);
      this.setActiveCycle(id);
      return newCycle;
    },
    setActiveCycle(id) {
      const loom = loomStore();
      
      this.activeCycleId = id;
      const cycle = this.activeCycle;
      if (!cycle) return;

      if (loom.lifestrapTexture?.pillars) {
        const selectedCues = cycle.state.lens.selectedCues || [];
        
        Object.keys(loom.lifestrapTexture.pillars).forEach(pillarKey => {
          if (Array.isArray(loom.lifestrapTexture.pillars[pillarKey])) {
            loom.lifestrapTexture.pillars[pillarKey].forEach(item => {
              item.activeStrand = selectedCues.includes(item.value);
            });
          }
        });
      }
    },
    syncActiveCycleState(section, data) {
      const cycle = this.activeCycle;
      if (!cycle) return;
      
      cycle.state[section] = {
        ...cycle.state[section], 
        ...data
      };
    },
    initializeDefaultCycle() {
      if (this.besearchCycles.length === 0) {
        this.createNewCycle();
      }
    }
  },
});
