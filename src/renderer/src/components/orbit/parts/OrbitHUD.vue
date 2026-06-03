<template>
  <div
    id="orbit-hud"
    :class="{
      'is-expanded': isExpanded,
      'lens-active': storeBesearch.besearchMode !== 'default',
      'has-strand': storeBesearch.strandMode,
    }"
  >
    <div class="hud-container">
      <div class="hud-top">
        <!-- 1. World / Context Icon -->
        <div class="hud-world-icon" @click="rotateHUUD">
          <span v-if="huudContext === 'world'">{{ worldIcon }}</span>
          <span v-else-if="huudContext === 'lens'">🔍</span>
          <span v-else-if="huudContext === 'lab'">🛠️</span>
          <span v-else-if="huudContext === 'heli'">☀️</span>
        </div>

        <div class="hud-metrics">
          <!-- Layer 1: World Context -->
          <template v-if="huudContext === 'world'">
            <div class="metric be-metric" @click="toggleLensLayer">
              <span>Be</span><strong>{{ activeLifeStrapName }}</strong>
            </div>
            <div class="metric">
              <span>WORLD</span><strong>{{ activeWorldLabel }}</strong>
            </div>
            <template v-if="activeWorld === 'orbit'">
              <div class="metric">
                <span>LIFE-STRAPS</span><strong>{{ countLifeStraps }}</strong>
              </div>
            </template>
            <template v-else-if="activeWorld === 'body'">
              <div class="metric"><span>VITALS</span><strong>NOMINAL</strong></div>
            </template>
            <template v-else-if="activeWorld === 'earth'">
              <div class="metric"><span>SCALE</span><strong>TERRAIN</strong></div>
            </template>
          </template>

          <!-- Layer 2: Lens / Story Context -->
          <template v-else-if="huudContext === 'lens'">
            <div class="metric story-summary" :class="{ long: isStoryLong }">
              <span>STORY</span><strong>{{ storySummary }}</strong>
            </div>
            <div class="metric">
              <span>STRANDS</span><strong>{{ strandCount }}</strong>
            </div>
            <div class="metric">
              <span>ATTUNE</span><strong>{{ attunementCount }}</strong>
            </div>
            <div class="metric">
              <span>CYCLES</span><strong>{{ cycleCount }}</strong>
            </div>
          </template>

          <!-- Layer 3: Sculpting Lab -->
          <template v-else-if="huudContext === 'lab'">
            <div class="metric"><span>LAB</span><strong>SCULPTING</strong></div>
            <div class="metric"><span>SEEDS</span><strong>4</strong></div>
            <div class="metric"><span>TUNING</span><strong>ACTIVE</strong></div>
          </template>

          <!-- Layer 4: Heli Projection -->
          <template v-else-if="huudContext === 'heli'">
            <div class="metric"><span>HELI</span><strong>PROJECTION</strong></div>
            <div class="metric"><span>PROJECTS</span><strong>2 ACTIVE</strong></div>
          </template>
        </div>

        <div class="hud-actions">
          <div class="rotation-controls">
            <button class="hud-rotate up" @click="storeBesearch.rotateHUUD('up')">
              ▲
            </button>
            <button
              class="hud-rotate down"
              @click="storeBesearch.rotateHUUD('down')"
            >
              ▼
            </button>
          </div>
          <button class="hud-toggle" @click="isExpanded = !isExpanded">
            {{ isExpanded ? "<" : ">" }}
          </button>
          <button
            class="hud-expand-down"
            :class="{ active: storeBesearch.besearchMode !== 'default' }"
            @click="toggleLensLayer"
          >
            {{ storeBesearch.besearchMode === "default" ? "↓" : "↑" }}
          </button>
        </div>
      </div>

      <!-- Persistent Line 2: Besearch Cycle & Workflow -->
      <div v-if="storeBesearch.besearchMode !== 'default'" class="hud-strand-line besearch-second-line">
        <div class="besearch-branding" @click="toggleLensLayer">
          <img src="@/assets/besearch-cycle.png" class="besearch-icon" />
          <span class="besearch-label">Besearch</span>
        </div>

        <div class="besearch-toggles">
          <div class="strand-toggle-wrapper">
            <span class="strand-label">Strand</span>
            <div 
              class="strand-slider" 
              :class="{ active: storeBesearch.strandMode }"
              @click="storeBesearch.strandMode = !storeBesearch.strandMode"
            >
              <div class="slider-knob"></div>
            </div>
          </div>

          <button 
            v-if="storeBesearch.strandMode"
            class="new-strand-btn"
            @click="storeBesearch.createNewCycle"
          >
            + NEW STRAND
          </button>

          <div class="strand-toggle-wrapper orgo-logic-wrapper">
            <span class="strand-label">Orgo</span>
            <div 
              class="strand-slider orgo-slider" 
              :class="{ active: storeBesearch.isOrgoLogic }"
              @click="storeBesearch.isOrgoLogic = !storeBesearch.isOrgoLogic"
            >
              <div class="slider-knob"></div>
            </div>
          </div>
        </div>

        <div class="workflow-stages">
          <div 
            v-for="stage in stages" 
            :key="stage.id"
            class="workflow-stage"
            :class="{ active: currentBesearchMode === stage.mode }"
            @click="setHUUDState(stage.mode)"
          >
            <span class="stage-number">{{ stage.id }}</span>
            <span class="stage-name">{{ stage.name }}</span>
            <span v-if="stage.id < 6" class="stage-arrow">──►</span>
          </div>
        </div>
      </div>

      <!-- Persistent Line 3: Cycle / Strand Context -->
      <div 
        v-if="storeBesearch.besearchMode !== 'default' && storeBesearch.strandMode" 
        class="hud-strand-line besearch-third-line"
        :class="{ expanded: storeBesearch.isCycleLineExpanded }"
      >
        <div class="cycle-active-info" @click="storeBesearch.isCycleLineExpanded = !storeBesearch.isCycleLineExpanded">
          <div class="cycle-badge" :class="{ 'is-active': true }">
            <span class="cycle-id">{{ activeCycleSummary.id }}</span>
            <span class="cycle-name">{{ activeCycleSummary.name }}</span>
          </div>
          
          <div class="cycle-preview">
            <div class="preview-group strands">
              <span v-for="s in displayStrands" :key="s" class="preview-tag strand">{{ s }}</span>
            </div>
            <div class="preview-group attunes">
              <span v-for="a in displayAttunements" :key="a" class="preview-tag attune">{{ a }}</span>
            </div>
          </div>
          
          <span class="expansion-arrow">{{ storeBesearch.isCycleLineExpanded ? '▲' : '▼' }}</span>
        </div>

        <!-- Expanded Cycle List -->
        <transition name="cycle-list-slide">
          <div v-if="storeBesearch.isCycleLineExpanded" class="cycle-selection-list">
            <div 
              v-for="cycle in inactiveCycles" 
              :key="cycle.id"
              class="cycle-list-item"
              @click="storeBesearch.setActiveCycle(cycle.id)"
            >
              <span class="item-name">{{ cycle.name }}</span>
              <div class="item-preview">
                {{ cycle.state.lens.selectedCues.slice(0, 2).join(', ') }}
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { loomStore } from "@/stores/loomStore.js";
import { libraryStore } from "@/stores/libraryStore.js";
import { besearchStore } from "@/stores/besearchStore.js";

const storeAI = aiInterfaceStore();
const storeLoom = loomStore();
import { lifestrapStore } from "@/stores/lifestrapStore.js";

const storeLifestrap = lifestrapStore();
const storeLibrary = libraryStore();
const storeBesearch = besearchStore();

const isExpanded = ref(false);

const stages = [
  { id: 1, name: "Grounded", mode: "lens" },
  { id: 2, name: "Heli", mode: "heli" },
  { id: 3, name: "Attunement", mode: "attunement" },
  { id: 4, name: "Grafting", mode: "graft" },
  { id: 5, name: "Emulation", mode: "emulation" },
  { id: 6, name: "Tinkering", mode: "tinker" }
];

const currentBesearchMode = computed(() => storeBesearch.besearchMode);
const huudContext = computed(() => storeBesearch.huudContext);
const activeWorld = computed(() => storeAI.activeWorld);

const activeCycleSummary = computed(() => {
  const cycle = storeBesearch.activeCycle;
  if (!cycle) return { id: 'N/A', name: 'NO ACTIVE STRAND' };
  return {
    id: cycle.id.slice(-4).toUpperCase(),
    name: cycle.name
  };
});

const displayStrands = computed(() => {
  return storeBesearch.activeCycle?.state.lens.selectedCues.slice(0, 3) || [];
});

const displayAttunements = computed(() => {
  const slots = storeBesearch.activeCycle?.state.attunement.slots || [];
  return slots
    .filter(s => s.label !== "Set Attunement")
    .map(s => s.label)
    .slice(0, 2);
});

const inactiveCycles = computed(() => {
  return storeBesearch.besearchCycles.filter(c => c.id !== storeBesearch.activeCycleId);
});

const worldIcon = computed(() => {
  const worlds = {
    orbit: "🌌",
    body: "👤",
    earth: "🌍",
  };
  return worlds[activeWorld.value] || "🌌";
});

const activeWorldLabel = computed(() => {
  return activeWorld.value.toUpperCase();
});

const storySummary = computed(() => {
  const story = storeBesearch.activeBesearchContext.story || "";
  console.log("HUD: activeBesearchContext.story is:", story);
  if (!story) return "NO STORY";
  return story.split(/\s+/).slice(0, 4).join(" ");
});

const strandCount = computed(() => {
  const pillars = storeLoom.lifestrapTexture?.pillars || {};
  return (pillars.capacity?.length || 0) + (pillars.context?.length || 0);
});

const attunementCount = computed(() => {
  return storeLoom.lifestrapTexture?.pillars?.attunement?.length || 0;
});

const cycleCount = computed(() => {
  return storeBesearch.besearchCyles?.length || 0;
});

const hasActiveStrand = computed(() => {
  return storeBesearch.strandMode && activeStrandItems.value.length > 0;
});

const activeStrandItems = computed(() => {
  const conduction = storeBesearch.evaluateConduction;
  if (!conduction) return [];
  return conduction.nodes || conduction.pipeline || [];
});

/* Get the active life-strap name */
const activeLifeStrapName = computed(() => {
  const id = storeAI.activeLifeStrapID;
  if (!id) return "SOV-01";

  if (typeof id === "string" && id.length > 20 && !id.includes("[object")) {
    return id.slice(-8);
  }

  try {
    const key = storeAI.activeLifestrapKey || id;
    const str = typeof key === "string" ? key : String(key);

    if (str.includes("[object")) return "SOV-01";
    return str.length > 8 ? str.slice(-8) : str;
  } catch (e) {
    return "SOV-01";
  }
});

const countLifeStraps = computed(() => {
  return storeLifestrap.straps.length;
});

const setHUUDState = (mode) => {
  storeBesearch.setHUUDState(mode);
};

const toggleLensLayer = () => {
  if (storeBesearch.besearchMode === "default") {
    storeBesearch.setHUUDState("lens");
  } else {
    storeBesearch.setHUUDState("default");
  }
};

const rotateHUUD = () => {
  storeBesearch.rotateHUUD("down");
};

// Auto-expand story summary if it looks truncated
const isStoryLong = computed(() => storySummary.value.length > 20);

onMounted(() => {
  storeBesearch.initializeDefaultCycle();
});
</script>

<style scoped>
#orbit-hud {
  --hud-base-width: 650px;
  --hud-expanded-width: calc(var(--hud-base-width) * 1.4);
  
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 500;
  display: flex;
  justify-content: center;
}

.hud-container {
  margin: 0.5rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: auto;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.hud-top {
  display: grid;
  /* 
     Col 1: World Icon (Fixed)
     Col 2: Metrics (Flexible but contained)
     Col 3: Actions (Fixed)
  */
  grid-template-columns: 40px 1fr 110px;
  align-items: center;
  gap: 1rem;
  padding: 0.4rem 1.2rem;
  background: var(--color-background-soft);
  opacity: 0.95;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  
  /* Strict Fixed Widths for TOP BAR ONLY */
  width: var(--hud-base-width);
  min-width: var(--hud-base-width);
  max-width: var(--hud-base-width);
  
  box-sizing: border-box;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

#orbit-hud.is-expanded .hud-top {
  width: var(--hud-expanded-width);
  min-width: var(--hud-expanded-width);
  max-width: var(--hud-expanded-width);
}

.besearch-second-line {
  background: rgba(26, 32, 44, 0.9);
  backdrop-filter: blur(8px);
  padding: 6px 20px;
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 204, 0.2);
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 15px;
  width: auto; /* Allow to expand to full content length */
  max-width: 95vw;
  box-sizing: border-box;
  pointer-events: auto;
}

.besearch-branding {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding-right: 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.besearch-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.besearch-label {
  font-family: "Space Mono", monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #00ffcc;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.besearch-toggles {
  display: flex;
  gap: 15px;
  padding-right: 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.strand-toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.strand-label {
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
  font-weight: 800;
}

.strand-slider {
  width: 28px;
  height: 14px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.strand-slider.active {
  background: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
}

.orgo-slider.active {
  background: #a685ff;
  box-shadow: 0 0 8px rgba(166, 133, 255, 0.4);
}

.slider-knob {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.strand-slider.active .slider-knob {
  left: 15px;
}

.new-strand-btn {
  background: rgba(0, 255, 204, 0.1);
  border: 1px dashed rgba(0, 255, 204, 0.4);
  color: #00ffcc;
  font-family: "Space Mono", monospace;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.new-strand-btn:hover {
  background: rgba(0, 255, 204, 0.2);
  transform: scale(1.05);
}

.besearch-third-line {
  background: rgba(26, 32, 44, 0.85);
  backdrop-filter: blur(12px);
  padding: 4px 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: auto;
  min-width: 400px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.cycle-active-info {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  min-height: 28px;
}

.cycle-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cycle-badge.is-active {
  background: rgba(0, 255, 204, 0.1);
  border-color: #00ffcc;
  color: #00ffcc;
}

.cycle-id {
  font-family: "Space Mono", monospace;
  font-size: 0.6rem;
  opacity: 0.6;
}

.cycle-name {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.cycle-preview {
  display: flex;
  gap: 12px;
  overflow: hidden;
}

.preview-group {
  display: flex;
  gap: 4px;
}

.preview-tag {
  font-size: 0.55rem;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.preview-tag.strand { color: #00c8ff; }
.preview-tag.attune { color: #a685ff; }

.expansion-arrow {
  font-size: 0.6rem;
  opacity: 0.5;
}

.cycle-selection-list {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: grid;
  gap: 4px;
  max-height: 150px;
  overflow-y: auto;
}

.cycle-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.cycle-list-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.item-name {
  font-size: 0.65rem;
  font-weight: 700;
  color: #718096;
}

.item-preview {
  font-size: 0.6rem;
  opacity: 0.4;
  font-family: "Space Mono", monospace;
}

.workflow-stages {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  align-items: center;
  gap: 5px;
}

.workflow-stage {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.workflow-stage.active {
  opacity: 1;
}

.workflow-stage:hover {
  opacity: 0.8;
}

.stage-number {
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  font-weight: 800;
  color: #00ffcc;
  background: rgba(0, 255, 204, 0.1);
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.workflow-stage.active .stage-number {
  background: #00ffcc;
  color: #1a202c;
  box-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
}

.stage-name {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
}

.workflow-stage.active .stage-name {
  color: #00ffcc;
}

.stage-arrow {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.2);
  margin-left: 2px;
}

.hud-world-icon {
  font-size: 1.2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transition: transform 0.2s;
  justify-self: start;
}

.hud-world-icon:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

.hud-metrics {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.metric span {
  font-size: 0.5rem;
  font-weight: 800;
  color: var(--sov-accent);
  letter-spacing: 0.1em;
  margin-bottom: 0.1rem;
  text-transform: uppercase;
  opacity: 0.7;
}

.metric strong {
  font-size: 0.85rem;
  color: #3b82f6;
  font-family: "Space Mono", monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.story-summary strong {
  font-size: 0.75rem;
}

.hud-actions {
  display: grid;
  grid-template-columns: auto auto auto;
  align-items: center;
  gap: 10px;
  border-left: 1px solid var(--color-border);
  padding-left: 15px;
  justify-self: end;
}

.rotation-controls {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hud-rotate {
  background: none;
  border: none;
  color: #718096;
  font-size: 8px;
  cursor: pointer;
  padding: 2px;
  line-height: 1;
}

.hud-rotate:hover {
  color: #3b82f6;
}

.hud-toggle,
.hud-expand-down {
  background: rgba(158, 113, 231, 0.1);
  border: 1px solid rgba(158, 113, 231, 0.2);
  color: #9e71e7;
  border-radius: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
  transition: all 0.2s;
}

.hud-expand-down.active {
  background: rgba(0, 255, 204, 0.1);
  border-color: rgba(0, 255, 204, 0.3);
  color: #00ffcc;
}

#orbit-hud.is-expanded .metric strong {
  font-size: 0.95rem;
}
</style>
