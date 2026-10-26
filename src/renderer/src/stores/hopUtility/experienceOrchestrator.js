'use strict'

/**
 * ExperienceOrchestrator
 *
 * Centralized coordination for cross-store lifecycle transitions.
 * Drives the visibility, layout, and data context for:
 * - Left Panel (LifeTools / Story Lists)
 * - Right Panel (Beebee Chat / Interplay Dialogue)
 * - Bottom Panel (Lens / HUD / Coherence Ledger)
 * - Stage (Orrery / Emulation Worlds)
 */
export class ExperienceOrchestrator {
  constructor(stores) {
    this.stores = stores; // Expects { ai, besearch, library, chat, loom, lifestrap }
  }

  /**
   * Sync the layout configuration across UI zones
   */
  syncLayout({ left, right, bottom, mode, context, world }) {
    /*console.log('sync mode EOrch')
    console.log(left)
    console.log(right)
    console.log(bottom)
    console.log(mode)
    console.log(context)
    console.log(world) */
    const { ai, chat, besearch, library } = this.stores;

    if (mode !== undefined) ai.currentMode = mode;
    if (context !== undefined) ai.beebeeContext = context;
    if (world !== undefined) this.orchestrateWorldChange(world);

    // Left Panel (LifeTools / Lists)
    if (library && left !== undefined) {
      library.isLifeToolsOpen = !!left;
    }

    // Right Panel (Beebee Chat)
    if (chat && right !== undefined) {
      chat.isChatOpen = !!right;
      chat.chatWidth = right ? 380 : 0;
      if (!right) chat.isUnrolled = false;
      ai.bentochatState = !!right;
    }

    // Bottom Panel (HUD/Lens)
    if (besearch && bottom !== undefined) {
      if (bottom === false) {
        besearch.showBottomPanel = false;
        besearch.setHUUDState('default', false);
        ai.showLifestapLens = true;
      } else {
        besearch.showBottomPanel = true;
        besearch.bottomHeight = (bottom === 'lens' || bottom === true) ? 400 : 600;
        let targetMode = bottom === true ? besearch.besearchMode : bottom;
        if (targetMode === 'default') {
          targetMode = 'lens';
        }
        besearch.setHUUDState(targetMode, true);
        ai.showLifestapLens = false;
      }
    }
  }

  /* world orchestration */
  orchestrateWorldChange(world) {
    const { ai, besearch } = this.stores;
    if (!world) return;
    
    ai.activeWorld = world;

    // Define default besearch sections based on the active world
    const worldModeMap = {
      orbit: 'lens',
      body: 'graft',
      earth: 'heli'
    };

    const targetMode = worldModeMap[world] || 'lens';
    
    // Update the HUD state to reflect the world's default besearch part
    // Keep it open if it's currently open, else just prep it for when they do open
    if (besearch.showBottomPanel) {
      this.setHUUDState(targetMode, true);
    } else {
      // Just change the underlying mode in the store without popping it open
      besearch.besearchMode = targetMode;
      besearch.setHUUDLayer(targetMode === 'graft' ? 'lab' : targetMode === 'heli' ? 'heli' : 'lens');
    }
  }

  /**
   * Panel Toggles
   */
  toggleBottomPanel() {
    const { besearch } = this.stores;
    const isCurrentlyOpen = besearch.showBottomPanel;
    this.syncLayout({ bottom: !isCurrentlyOpen });
    return !isCurrentlyOpen;
  }

  toggleLeftPanel() {
    const { library } = this.stores;
    const isCurrentlyOpen = library.isLifeToolsOpen;
    this.syncLayout({ left: !isCurrentlyOpen });
    return !isCurrentlyOpen;
  }

  toggleRightPanel() {
    const { chat } = this.stores;
    const isCurrentlyOpen = chat.isChatOpen;
    this.syncLayout({ right: !isCurrentlyOpen });
    return !isCurrentlyOpen;
  }

  openChatPanel(width = 380) {
    const { ai } = this.stores;
    this.syncLayout({ right: true });
    this.stores.chat.chatWidth = width;
    this.stores.chat.isUnrolled = true;

    if (!ai.chatAttention || ai.chatAttention === 'new') {
      ai.chatAttention = ai.activeLifeStrapID || 'chat';
    }

    if (ai.activeLifeStrapID && (ai.beebeeContext === 'chat' || !ai.beebeeContext)) {
      ai.beebeeContext = 'lifestrap';
    }
  }

  toggleChatUnroll() {
    const { ai, chat } = this.stores;
    chat.isUnrolled = !chat.isUnrolled;

    if (chat.isUnrolled) {
      if (!ai.chatAttention) {
        ai.chatAttention = ai.activeLifeStrapID || ai.liveBspace?.cueid || 'chat';
      }
      if (ai.activeLifeStrapID && ai.beebeeContext === 'chat') {
        ai.beebeeContext = 'lifestrap';
      }
      ai.bentochatState = true;
    }
  }

  setHUUDState(mode, forceOpen = true) {
    const { besearch, ai } = this.stores;
    let targetMode = mode;
    if (forceOpen && targetMode === 'default') {
      targetMode = 'lens';
    }
    besearch.setHUUDState(targetMode, forceOpen);
    if (forceOpen) {
      ai.showLifestapLens = false;
      besearch.showBottomPanel = true;
    }
  }

  /**
   * Application State Transitions
   */
  enterDashboardState() {
    const { ai } = this.stores;
    ai.liveBspace = null;
    
    this.syncLayout({
      left: true,
      right: false,
      bottom: false,
      mode: 'browsing',
      context: 'catalog',
      world: 'orbit'
    });

    if (ai.storeOrrery && typeof ai.storeOrrery.viewMacroOverview === 'function') {
      ai.storeOrrery.viewMacroOverview();
    }
  }

  handleLifestrapSelection(strapData) {
    const { besearch, loom, chat } = this.stores;
    let lsKey = strapData.key;
    
    this.activateLifestrapState(lsKey);
    besearch.loadCyclesForLifestrap(lsKey);
    loom.applyStrapTexture(lsKey, strapData);

    const hasChatHistory = (chat.chatHistory[lsKey] || []).some(m => m.context === 'lensing');
    const chatContext = hasChatHistory ? 'lensing' : 'lifestrap';

    this.syncLayout({
      left: false,
      right: false,
      bottom: false,
      mode: 'active',
      context: chatContext,
      world: 'orbit'
    });

    this.syncEmulationStage(lsKey, strapData);
  }

  syncEmulationStage(lsKey, strapData) {
    const { ai, loom } = this.stores;
    if (ai.storeOrrery && typeof ai.storeOrrery.setActiveEmulationContext === 'function') {
      const texture = loom?.lifestrapTexture?.key === lsKey ? loom.lifestrapTexture : null;
      ai.storeOrrery.setActiveEmulationContext({
        key: lsKey,
        metadata: strapData,
        pillars: texture?.pillars || null,
        cycles: texture?.cycles || null
      });
    }
  }

  onLifestrapArrived(strap) {
    const { ai, chat } = this.stores;
    const isNew = ai.isNewLifestrap(strap.key);

    this.activateLifestrapState(strap.key);

    if (isNew) {
      ai.isInitialState = false;
      this.syncLayout({
        left: false,
        right: true,
        bottom: 'lens',
        mode: 'lensing',
        context: 'lensing',
        world: 'orbit'
      });
    } else {
      if (!chat.chatHistory[strap.key]) {
        chat.chatHistory[strap.key] = [];
      }
    }
  }

  activateLifestrapState(lsKey) {
    const { ai } = this.stores;
    if (!lsKey) return;

    const PLACEHOLDERS = ['prime-life-strap', 'new-ls', 'new-life-strap'];
    const incomingIsPlaceholder = PLACEHOLDERS.includes(lsKey);
    const currentIsRealKey = ai.activeLifestrapKey && !PLACEHOLDERS.includes(ai.activeLifestrapKey);

    if (incomingIsPlaceholder && currentIsRealKey) {
      return;
    }

    ai.activeLifestrapKey = lsKey;
    ai.activeLifeStrapID = lsKey;
    ai.activeContractKey = lsKey;
    ai.chatAttention = lsKey;
  }

  onTextureWeaved(texture) {
    const { ai } = this.stores;
    ai.isInitialState = false; 
    const isNew = ai.isNewLifestrap(texture.key);
    
    if (texture.key) {
      this.activateLifestrapState(texture.key);
    }

    if (isNew) {
      this.syncLayout({
        left: false,
        right: true,
        bottom: 'lens',
        mode: 'extracting',
        context: 'lensing',
        world: 'orbit'
      });
      ai.newLifestrap = false;
    }
  }

  enterSpaceContext(spaceData) {
    const { ai } = this.stores;
    if (!spaceData) return;

    const cueId = spaceData.cueid || spaceData.spaceid;
    if (cueId) {
      ai.beebeeContext = "chatspace";
      const name = spaceData.name;
      const contractKey = spaceData.contract_key;
      const lifeStrapID = spaceData.lifeStrapID || ai.activeLifeStrapID || cueId;

      ai.setActiveLifeStrap(lifeStrapID, contractKey);
      ai.ensureSpaceChatInMenu(cueId, name);
    }
  }

  exitSpaceContext(previousContext) {
    this.stores.ai.beebeeContext = previousContext || "chat";
  }

  resetToZen() {
    this.syncLayout({ left: false, right: false, bottom: false, mode: 'zen', world: 'orbit' });
    this.stores.ai.isInitialState = true;
  }

  /* Lens Interactions */
  selectLensCapacity(val) {
    const { besearch, loom } = this.stores;
    if (!loom) return;
    if (besearch.strandMode) {
      const items = loom.lifestrapTexture?.pillars?.capacity || [];
      const item = items.find(i => i.value === val);
      if (item) {
        item.activeStrand = !item.activeStrand;
        this.syncLensToCycle();
      }
      return;
    }
    besearch.activeBesearchContext.capacity = val;
  }

  syncLensToCycle() {
    const { besearch, loom } = this.stores;
    if (!besearch.activeCycle) return;
    
    const selectedCues = [];
    const pillars = loom.lifestrapTexture?.pillars || {};
    Object.values(pillars).forEach(pillar => {
      if (Array.isArray(pillar)) {
        pillar.forEach(item => {
          if (item.activeStrand) selectedCues.push(item.value);
        });
      }
    });
    
    besearch.syncActiveCycleState('lens', { selectedCues });
  }

  handleLensReorder({ oldGroupId, newGroupId, oldIndex, newIndex, value }) {
    const { loom } = this.stores;
    if (!loom) return;
    const getZone = (id) => {
      if (['peer', 'environment', 'earth', 'context'].includes(id)) return 'context';
      if (id === 'capacity') return 'capacity';
      return null;
    };

    const oldZone = getZone(oldGroupId);
    const newZone = getZone(newGroupId);

    if (!oldZone || !newZone) return;

    if (oldZone === newZone) {
      loom.reorderStrandCues(oldZone, oldIndex, newIndex);
    } else {
      const oldPillar = loom.lifestrapTexture.pillars[oldZone];
      const item = oldPillar.splice(oldIndex, 1)[0];
      const newPillar = loom.lifestrapTexture.pillars[newZone];
      newPillar.splice(newIndex, 0, item);
      loom.syncAttunement(item.value, newZone, item.label);
    }
  }

  handleFragmentDrop(word, zone) {
    const { loom } = this.stores;
    if (!loom || !word) return;
    
    let targetZone = zone;
    let label = null;

    if (['peer', 'environment', 'earth', 'context'].includes(zone)) {
      targetZone = 'context';
      if (zone === 'peer') label = 'Body/Peer';
      else if (zone === 'environment') label = 'Building Environment';
      else if (zone === 'earth') label = 'Earth Scales';
      else label = 'Activity';
    }

    if (targetZone === "attunement") {
      const existing = loom.lifestrapTexture?.pillars?.attunement || [];
      existing.forEach(item => {
        loom.updateResonWeight(item.value, "residue");
      });
      label = "Attunement";
    }

    if (targetZone === "capacity") {
      label = "Capacity";
    }

    loom.updateResonWeight(word, targetZone, label);
  }

  toggleCueSpace(spaceID) {
    const { besearch, loom, ai, cues } = this.stores;
    if (besearch.strandMode) {
      const context = loom.lifestrapTexture?.pillars?.context || [];
      const item = context.find(i => i.value === spaceID);
      if (item) {
        item.activeStrand = !item.activeStrand;
        this.syncLensToCycle();
      }
      return;
    }
    if (cues) cues.cueContext = "space";
    ai.beebeeContext = "chatspace";
    ai.bentospaceState = !ai.bentospaceState;
    ai.liveBspace = spaceID;
  }
}

export default ExperienceOrchestrator;