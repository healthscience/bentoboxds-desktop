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
   * 
  */
  syncLayout({ left, right, bottom, mode, context, world = 'orbit' }) {
    const { ai, chat, besearch, library } = this.stores;

    if (mode) ai.currentMode = mode;
    if (context) ai.beebeeContext = context;
    ai.activeWorld = world;

    // Left Panel (LifeTools / Lists)
    if (library && left !== null && left !== undefined) {
      library.isLifeToolsOpen = !!left;
    }

    // Right Panel (Beebee Chat)
    if (right === true) {
      chat.isChatOpen = true;
      chat.chatWidth = 380;
      chat.isUnrolled = false; 
      ai.bentochatState = true;
    } else if (right === false) {
      chat.isChatOpen = false;
      chat.chatWidth = 0;
      ai.bentochatState = false;
    }

    // Bottom Panel (HUD/Lens)
    if (bottom) {
      besearch.showBottomPanel = true;
      besearch.bottomHeight = (bottom === 'lens' || bottom === true) ? 400 : 600;
      besearch.setHUUDState(bottom === true ? 'lens' : bottom);
      ai.showLifestapLens = false;
    } else if (bottom === false) {
      besearch.showBottomPanel = false;
      besearch.setHUUDState('default');
      ai.showLifestapLens = true;
    }
  }

  /**
   * Enter the macro dashboard state to browse lists of lifestrap stories
   * 
   */
  enterDashboardState() {
    const { ai, besearch } = this.stores;
    
    // Clear targeted execution contexts
    ai.liveBspace = null;
    
    // Move layout to show choices on the left, closing operational overlays
    this.syncLayout({
      left: true,       // Open LifeTools to display lists
      right: false,     // Close Chat
      bottom: false,    // Collapse Lens back to bar
      mode: 'browsing',
      context: 'catalog',
      world: 'orbit'    // Set Orrery stage to a neutral overview macro-view
    });

    if (ai.storeOrrery && typeof ai.storeOrrery.viewMacroOverview === 'function') {
      ai.storeOrrery.viewMacroOverview();
    }
  }

  /**
   * Handle operational selection of a specific story
   */
  handleLifestrapSelection(strapData) {
    const { ai, besearch, loom, chat } = this.stores;
    let lsKey = strapData.key;
    // update active keys across all worlds and panels
    this.activateLifestrapState(lsKey);
    // update beebee chat
    this.updateBeeBeeChat(lsKey);
    // update besearch
    besearch.loadCyclesForLifestrap(lsKey);

    // check if loom data required or already available
    loom.applyStrapTexture(lsKey, strapData);

    // look to remove this logic
    const hasChatHistory = (chat.chatHistory[lsKey] || []).some(m => m.context === 'lensing');
    const chatContext = hasChatHistory ? 'lensing' : 'lifestrap';

    // Transition layout into active tracking engagement
    this.syncLayout({
      left: false,
      right: false,
      bottom: false,
      mode: 'active',
      context: chatContext,
      world: 'orbit'
    });

    // Feed data live into the Emulation stage engine
    this.syncEmulationStage(lsKey, strapData);
  }

  /**
   * Sync active variables directly into the Orrery / Emulation environment
   */
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
    const { ai, loom, chat } = this.stores;
    const isNew = ai.isNewLifestrap(strap.key);

    this.activateLifestrapState(strap.key);

    if (isNew) {
      ai.currentMode = 'lensing';
      ai.isInitialState = false;
      ai.activeWorld = "orbit";
      
      // Explicitly show initial panel setup for new generation instantly
      this.syncLayout({
        left: false,
        right: true,
        bottom: 'lens',
        mode: 'lensing',
        context: 'lensing'
      });
    } else {
      if (!chat.chatHistory[strap.key]) {
        chat.chatHistory[strap.key] = [];
      }
    }
  }


  /**
   * Safe allocation of active lifestrap state identifiers.
   * Enforces rules preventing placeholders from clobbering validated hex keys.
   */
  activateLifestrapState(lsKey) {
    const { ai } = this.stores;
    if (!lsKey) return;

    const PLACEHOLDERS = ['prime-life-strap', 'new-ls', 'new-life-strap'];
    const incomingIsPlaceholder = PLACEHOLDERS.includes(lsKey);
    const currentIsRealKey = ai.activeLifestrapKey && !PLACEHOLDERS.includes(ai.activeLifestrapKey);

    // Enforce guard rule: Never overwrite an established hex key with a placeholder
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
    ai.activeWorld = "orbit";
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
    } else {
      this.hydrateReturningPeer(texture.key);
    }
  }

  /**
   * Migrate chat history from placeholder keys to the active hex key
   * 
   * @param {string} lsKey - The active lifestrap key (hex identifier)
   * @returns {void}
   */
  hydratePeerExperience(lsKey) {
    
  }

  /* world orchestration */
  orchestrateWorldChange() {
    console.log('update world emulation and scale')
  }

  updateBeeBeeChat(lsKey) {
    console.log('update beebee chat')

  }

  openChatPanel(width = 380) {
    const { ai, chat } = this.stores;
    chat.isChatOpen = true;
    chat.chatWidth = width;
    chat.isUnrolled = true;
    ai.bentochatState = true;

    if (!ai.chatAttention || ai.chatAttention === 'new') {
      ai.chatAttention = ai.activeLifeStrapID || 'chat';
    }

    if (ai.activeLifeStrapID && (ai.beebeeContext === 'chat' || !ai.beebeeContext)) {
      ai.beebeeContext = 'lifestrap';
    }

    const strapStore = this.stores.lifestrap;
    const strap = strapStore ? strapStore.straps.find(s => s.key === ai.activeLifeStrapID) : null;
    if (strap) {
      const storyText = strap.story
        || strap.inquiry
        || strap.value?.concept?.story
        || strap.value?.concept?.inquiry
        || null;
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

  toggleBottomPanel() {
    const { besearch } = this.stores;
    const isCurrentlyOpen = besearch.showBottomPanel;

    if (isCurrentlyOpen) {
      besearch.setHUUDState('default');
      besearch.showBottomPanel = false;
    } else {
      besearch.setHUUDState('lens');
      besearch.showBottomPanel = true;
    }
    return !isCurrentlyOpen;
  }

  setHUUDState(mode, forceOpen = true) {
    const { besearch, ai } = this.stores;
    besearch.setHUUDState(mode, forceOpen);
    if (forceOpen) {
      ai.showLifestapLens = false;
      besearch.showBottomPanel = true;
    }
  }

  enterSpaceContext(spaceData) {
    const { ai, chat } = this.stores;
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
    const { ai } = this.stores;
    ai.beebeeContext = previousContext || "chat";
  }

  resetToZen() {
    this.syncLayout({ left: false, right: false, bottom: false, mode: 'zen', world: 'orbit' });
    this.stores.ai.isInitialState = true;
  }
}

export default ExperienceOrchestrator;