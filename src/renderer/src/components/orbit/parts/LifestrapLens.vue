<template>
  <transition name="lens-slide">
    <div
      class="besearch-lens-grid full-lab-view"
      :class="{ 
        'has-selection': hasSelection,
        'pane-expanded': isPortalExpanded,
        'is-bar': storeBesearch.besearchMode === 'besearch' && !storeBesearch.isLensExpanded
      }"
    >

      <!-- Left Pane: Cues Portal -->
      <div class="sieve-pane narrative-pane" v-show="storeBesearch.isLensExpanded || storeBesearch.besearchMode !== 'besearch'">
        <header class="pane-header">
          <div class="header-content">
            <span class="pulse-dot"></span>
            <h3>Cues Portal</h3>
          </div>
          <button 
            class="expand-toggle"
            :class="{ active: isPortalExpanded }"
            @click="isPortalExpanded = !isPortalExpanded"
            title="Expand View"
          >
            <span v-if="!isPortalExpanded">⤢</span>
            <span v-else>⤡</span>
          </button>
        </header>
        
        <div class="narrative-content-split">
          <div class="story-canvas-wrapper portal-host">
            <CuesPortal 
              @dragstart="onPortalDragStart"
              @select="handleCueSelection"
            />
          </div>

          <div class="residue-dock-inline">
            <h4 class="dock-label">Unmapped Fragments</h4>
            <div class="bubble-stream mini">
              <button
                v-for="(word, index) in unmappedFragments"
                :key="word + '-' + index"
                class="fragment-bubble"
                :class="{ selected: selectedWord === word }"
                draggable="true"
                @dragstart="onDragStart($event, word)"
                @click="selectedWord = word"
              >
                {{ word }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Pane: Sieve Columns -->
      <div class="sieve-pane columns-pane" v-show="storeBesearch.isLensExpanded || storeBesearch.besearchMode !== 'besearch'">
        <div class="pane-header-actions">
          <header class="pane-header">
            <span class="pulse-dot"></span>
            <h3>Sieve Columns</h3>
          </header>
          
          <div class="action-group">
            <button 
              class="enter-bench-btn"
              :class="{ active: storeBesearch.canEnterBench }"
              @click="handleAttunementTrigger"
            >
              Set Heli
            </button>

            <button 
              class="collapse-lens-btn"
              @click="handleAttunementTrigger"
              title="Collapse Lens"
            >
              ▼
            </button>
          </div>
        </div>

        <div class="columns-grid">
          <!-- Pillar 1: Capacity -->
          <div
            class="lens-box capacity zone"
            :class="{ 'active-zone': activeZone === 'capacity' }"
            @drop.prevent="onDrop($event, 'capacity')"
            @dragover.prevent="onDragOver($event, 'capacity')"
            @dragleave="onDragLeave"
          >
            <header class="lens-header">
              <h3>capacity</h3>
            </header>
            <LensColumn
              :groups="[{ id: 'capacity', title: 'Capacity', items: capacityItems }]"
              :show-item-labels="true"
              :strand-mode="storeBesearch.strandMode"
              :is-orgo-logic="storeBesearch.isOrgoLogic"
              @dragstart="onDragStart"
              @unmap="unmapFragment"
              @select="selectCapacity"
              @drop="onDrop"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
              @reorder="handleReorder"
            />
          </div>

          <!-- Pillar 2: Context -->
          <div 
            class="lens-box context zone"
            :class="{ 'active-zone': activeZone === 'context' }"
            @drop.prevent="onDrop($event, 'context')"
            @dragover.prevent="onDragOver($event, 'context')"
            @dragleave="onDragLeave"
          >
            <header class="lens-header">
              <h3>context</h3>
            </header>
            <LensColumn
              :groups="[
                { id: 'peer', title: 'Body/Peer', items: bodyPeerItems },
                { id: 'environment', title: 'Building Environment', items: environmentItems },
                { id: 'earth', title: 'Earth Scales', items: earthItems },
              ]"
              :show-item-labels="true"
              :strand-mode="storeBesearch.strandMode"
              :is-orgo-logic="storeBesearch.isOrgoLogic"
              @dragstart="onDragStart"
              @unmap="unmapFragment"
              @select="handleCueSpace"
              @drop="onDrop"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
              @reorder="handleReorder"
            />
          </div>
        </div>
      </div>

      <!-- Modals for tools -->
      <BentoSpace></BentoSpace>
      <WholeResonance v-if="wholeResStatus === true"></WholeResonance>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BentoSpace from "@/components/bentospace/spaceTemplate.vue";
import WholeResonance from "@/components/consilience/wholeResonance.vue";
import LensColumn from "@/components/orbit/parts/shared/LensColumn.vue";
import CuesPortal from "@/components/orbit/parts/shared/CuesPortal.vue";

import { besearchStore } from "@/stores/besearchStore.js";
import { cuesStore } from "@/stores/cuesStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { loomStore } from "@/stores/loomStore.js";
import { diaryStore } from "@/stores/diaryStore.js";

const storeCues = cuesStore();
const storeAI = aiInterfaceStore();
const storeLoom = loomStore();
const storeDiary = diaryStore();
const storeBesearch = besearchStore();

const handleAttunementTrigger = () => {
  storeBesearch.setHUUDState('heli');
  storeBesearch.setHUUDLayer("lens");
};

const props = defineProps({
  lenses: {
    type: Object,
    default: () => ({
      pillars: {
        capacity: [],
        context: [],
        heli: [],
        attunement: [],
        coherence: { isStable: false, resonance: 0 },
      },
      residue: [],
      key: "",
    }),
  },
});

/* serious intent state */
const selectedWord = ref(null);
const hasSelection = computed(() => !!selectedWord.value);
const activeZone = ref(null);
const isPortalExpanded = ref(false);

/* computed */
const wholeResStatus = computed(() => storeAI.bentoflakeState);

const highlightedTokens = computed(() => {
  const story = storeBesearch.activeBesearchContext.story || "";
  return story.split(/\s+/).filter(word => word.length > 3 && word.charAt(0) === word.charAt(0).toUpperCase());
});

const unmappedFragments = computed(() => storeLoom.unmappedFragments);

const capacityItems = computed(() => storeLoom.capacityItems);

const contextItems = computed(() => storeLoom.contextItems);

const attunementItems = computed(() => {
  return [
    { label: "Attunement", value: "Prevention" },
    { label: "Attunement", value: "Repair" },
    { label: "Attunement", value: "Rejuvenate" },
  ];
});

const selectedAttunement = computed(() => {
  const items = storeLoom.attunementItems || [];
  return items.length > 0 ? items[0].value : null;
});

const bodyPeerItems = computed(() => {
  const items = contextItems.value || [];
  return items.filter(
    (i) => i.label === "Activity" || i.label === "Body/Peer" || i.label === "Extracted",
  );
});
const environmentItems = computed(() => {
  const items = contextItems.value || [];
  return items.filter(
    (i) => i.label === "Space" || i.label === "Environment" || i.label === "Extracted",
  );
});
const earthItems = computed(() => {
  const items = contextItems.value || [];
  return items.filter(
    (i) => i.label === "Temporal" || i.label === "Earth Scales" || i.label === "Extracted",
  );
});

/* methods */
const selectAttunement = (val) => {
  storeLoom.updateResonWeight(val, "attunement", "Attunement");
};

const selectCapacity = (val) => {
  if (storeBesearch.strandMode) {
    const items = storeLoom.lifestrapTexture?.pillars?.capacity || [];
    const item = items.find(i => i.value === val);
    if (item) {
      item.activeStrand = !item.activeStrand;
      
      // Sync with active cycle
      syncLensToCycle();
    }
    return;
  }
  storeBesearch.activeBesearchContext.capacity = val;
};

const syncLensToCycle = () => {
  if (!storeBesearch.activeCycle) return;
  
  const selectedCues = [];
  const pillars = storeLoom.lifestrapTexture?.pillars || {};
  Object.values(pillars).forEach(pillar => {
    if (Array.isArray(pillar)) {
      pillar.forEach(item => {
        if (item.activeStrand) selectedCues.push(item.value);
      });
    }
  });
  
  storeBesearch.syncActiveCycleState('lens', { selectedCues });
};

const handleReorder = ({ oldGroupId, newGroupId, oldIndex, newIndex, value }) => {
  const getZone = (id) => {
    if (['peer', 'environment', 'earth', 'context'].includes(id)) return 'context';
    if (id === 'capacity') return 'capacity';
    return null;
  };

  const oldZone = getZone(oldGroupId);
  const newZone = getZone(newGroupId);

  if (!oldZone || !newZone) return;

  if (oldZone === newZone) {
    // Internal reorder within the same pillar
    storeLoom.reorderStrandCues(oldZone, oldIndex, newIndex);
  } else {
    // Cross-pillar move (e.g. Capacity to Context)
    // 1. Remove from old pillar
    const oldPillar = storeLoom.lifestrapTexture.pillars[oldZone];
    const item = oldPillar.splice(oldIndex, 1)[0];
    
    // 2. Add to new pillar at new index
    const newPillar = storeLoom.lifestrapTexture.pillars[newZone];
    newPillar.splice(newIndex, 0, item);
    
    // 3. Sync
    storeLoom.syncAttunement(item.value, newZone, item.label);
  }
};

const handleTokenClick = (token) => {
  selectedWord.value = token;
  // Visual feedback placeholder for floating
};

const handleCueSelection = (cue) => {
  // Logic to show "full cues" - for now just logs or can trigger modal
};

const onPortalDragStart = ({ event, word }) => {
  onDragStart(event, word);
};

const onDragStart = (e, word) => {
  selectedWord.value = word;
  e.dataTransfer.setData("text/plain", word);
  e.dataTransfer.effectAllowed = "move";
};

const onDragOver = (e, zone) => {
  activeZone.value = zone;
  e.dataTransfer.dropEffect = "move";
};

const onDragLeave = () => {
  activeZone.value = null;
};

const onDrop = (e, zone) => {
  const word = e.dataTransfer.getData("text/plain");
  if (!word) return;
  
  // Map sub-group IDs to main zones
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
    // Single Selection: Remove existing attunement first
    const existing = storeLoom.lifestrapTexture?.pillars?.attunement || [];
    existing.forEach(item => {
      storeLoom.updateResonWeight(item.value, "residue");
    });
    label = "Attunement";
  }

  if (targetZone === "capacity") {
    label = "Capacity";
  }

  commitAlignment(word, targetZone, label);
  activeZone.value = null;
  selectedWord.value = null;
};

const commitAlignment = (word, zone, label = null) => {
  storeLoom.updateResonWeight(word, zone, label);
};

const unmapFragment = (word) => {
  storeLoom.updateResonWeight(word, "residue");
};

const handleCueSpace = (spaceID) => {
  if (storeBesearch.strandMode) {
    const context = storeLoom.lifestrapTexture?.pillars?.context || [];
    const item = context.find(i => i.value === spaceID);
    if (item) {
      item.activeStrand = !item.activeStrand;
      syncLensToCycle();
    }
    return;
  }
  storeCues.cueContext = "space";
  storeAI.beebeeContext = "chatspace";
  storeAI.bentospaceState = !storeAI.bentospaceState;
  storeAI.liveBspace = spaceID;
};

onMounted(() => {
  // Initialize context
});
</script>

<style scoped>
.full-lab-view {
  --sov-accent: #3b82f6;
  --sov-capacity: #00c8ff;
  --sov-context: #00ffcc;
  --sov-coherence: #a685ff;
  --sov-text: #1a202c;
  
  height: 100%;
  width: 100%;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  z-index: 10;
  padding: 10px;
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  pointer-events: auto;
}

.besearch-lens-grid.is-bar {
  grid-template-columns: 1fr;
  height: 40px;
  padding: 0 20px;
  gap: 0;
  background: rgba(26, 32, 44, 0.9);
  border-bottom: 1px solid rgba(0, 255, 204, 0.3);
  display: grid;
  align-items: center;
}

.lens-bar-controls {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  cursor: pointer;
  color: #00ffcc;
  font-family: "Space Mono", monospace;
}

.bar-title {
  font-weight: 800;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
}

.bar-summary {
  display: grid;
  grid-auto-flow: column;
  gap: 15px;
}

.summary-chip {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.summary-chip.capacity { color: #00c8ff; }
.summary-chip.context { color: #00ffcc; }
.summary-chip.attunement { color: #a685ff; }

.expansion-toggle {
  background: transparent;
  border: none;
  color: #00ffcc;
  cursor: pointer;
}

.besearch-lens-grid.pane-expanded {
  grid-template-columns: 1.5fr 1fr;
}

.pane-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin-bottom: 15px; /* Reduced from 25px */
}

.header-content {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 12px;
}

.expand-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #3b82f6;
  border-radius: 8px;
  width: 28px; /* Slightly smaller */
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.expand-toggle:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.expand-toggle.active {
  background: #3b82f6;
  color: white;
}

.columns-grid {
  display: grid;
  grid-template-rows: repeat(auto-fill, minmax(80px, auto));
  gap: 20px;
  overflow-y: auto;
  padding-right: 10px;
  min-height: 200px;
  pointer-events: auto; /* Ensure clicks reach the columns */
}

.lens-box {
  padding: 12px 20px; /* Reduced vertical padding from 20px */
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ccc;
  border-radius: 16px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-height: 80px; /* Reduced from 100px */
  color: #1a202c; /* Ensure text color is visible */
}

.lens-slide-enter-from,
.lens-slide-leave-to {
  transform: translateY(100%);
}

.sieve-pane {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pane-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  flex-shrink: 0;
}

.pane-header h3 {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 900;
  margin: 0;
  font-size: 1.1rem;
  color: #3b82f6;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.narrative-content-split {
  display: grid;
  grid-template-rows: 60% 40%;
  gap: 20px;
  min-height: 0;
}

.story-canvas-wrapper {
  height: 100%;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.residue-dock-inline {
  height: 100%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  flex-shrink: 0;
  overflow-y: auto;
}

.story-canvas-wrapper.portal-host {
  padding: 0;
  background: white;
  display: grid;
  grid-template-rows: 1fr;
}

.story-input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  padding: 24px;
  color: #1a202c;
  font-family: "Space Mono", monospace;
  font-size: 1.2rem;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.token-overlay {
  position: absolute;
  top: 24px;
  left: 24px;
  right: 24px;
  bottom: 24px;
  pointer-events: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, auto));
  gap: 5px;
}

.story-token {
  padding: 2px 8px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.4);
  border-radius: 4px;
  color: #2563eb;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Space Mono", monospace;
  font-size: 1rem;
}

.story-token:hover {
  background: rgba(59, 130, 246, 0.35);
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.residue-dock-inline {
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  flex-shrink: 0;
}

.pane-header-actions {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin-bottom: 15px; /* Reduced from 25px */
  gap: 15px;
}

.strand-toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.strand-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #718096;
  font-weight: 700;
}

.strand-slider {
  width: 34px;
  height: 18px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.strand-slider.active {
  background: #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}

.orgo-slider.active {
  background: #a685ff;
  box-shadow: 0 0 10px rgba(166, 133, 255, 0.4);
}

.slider-knob {
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.strand-slider.active .slider-knob {
  left: 17px;
}

.action-group {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 10px;
}

.collapse-lens-btn {
  background: transparent;
  border: none;
  color: #718096;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.collapse-lens-btn:hover {
  color: #00ffcc;
  transform: translateY(2px);
}

.enter-bench-btn {
  padding: 8px 16px; /* Reduced from 12px 24px */
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #718096;
  border-radius: 20px; /* Reduced from 30px */
  font-weight: 900;
  font-size: 0.75rem; /* Reduced from 0.85rem */
  text-transform: uppercase;
  letter-spacing: 0.1em; /* Reduced from 0.15em */
  cursor: not-allowed;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.enter-bench-btn.active {
  background: #1a202c;
  color: #00ffcc;
  border-color: #00ffcc;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(0, 255, 204, 0.3), 0 0 5px rgba(0, 255, 204, 0.5);
  animation: pulse-glow 2s infinite ease-in-out;
}

@keyframes pulse-glow {
  0% { box-shadow: 0 0 10px rgba(0, 255, 204, 0.3), 0 0 2px rgba(0, 255, 204, 0.2); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 204, 0.5), 0 0 8px rgba(0, 255, 204, 0.4); }
  100% { box-shadow: 0 0 10px rgba(0, 255, 204, 0.3), 0 0 2px rgba(0, 255, 204, 0.2); }
}

.enter-bench-btn.active:hover {
  transform: translateY(-1px) scale(1.02); /* More subtle */
  box-shadow: 0 0 25px rgba(0, 255, 204, 0.6);
  background: #2d3748;
}

.columns-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  flex: 1;
  padding-right: 10px;
}

.lens-box {
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ccc;
  border-radius: 16px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.lens-box > * {
  flex-shrink: 0;
}

.lens-box .lens-column-content {
  flex: 1;
}

.lens-box.active-zone {
  background: rgba(0, 255, 204, 0.05);
  border-color: #00ffcc;
}

.capacity { border-top-color: #00c8ff; }
.context { border-top-color: #00ffcc; }
.coherence { border-top-color: #a685ff; }

.lens-header h3 {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  margin-bottom: 8px; /* Reduced from 15px */
  color: #1a202c;
}

.fragment-bubble {
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1a202c;
  cursor: grab;
  transition: all 0.3s;
}

.fragment-bubble:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 10px #3b82f6;
}

.dock-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.5;
  margin-bottom: 12px;
  color: #1a202c;
}

.bubble-stream.mini {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8px;
}
.attunement-entry-trigger {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(166, 133, 255, 0.1);
  border: 1px dashed rgba(166, 133, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.attunement-entry-trigger:hover {
  background: rgba(166, 133, 255, 0.2);
  transform: translateY(-2px);
}

.trigger-icon {
  font-size: 1.5rem;
}

.trigger-text {
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  color: #a685ff;
}
</style>
