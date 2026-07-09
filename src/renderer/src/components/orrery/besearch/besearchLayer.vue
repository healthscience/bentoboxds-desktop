<template>
  <transition name="besearch-slide">
    <div
      v-if="isOpen"
      class="besearch-layer smelter-v2"
      :class="{ 
        'dark-theme': isDarkMode,
        'besearch-active': storeBesearch.besearchMode === 'besearch'
      }"
    >
      <div class="besearch-header-status">
        <div class="header-left">
          <span class="besearch-title">Besearch cycle</span>
        </div>
        <div class="status-summary">
          <div
            class="summary-item"
            :class="{ ok: isStageCompleted('capacity') }"
            @click="besearchContext.capacity = true"
          >
            <span class="label">Capacity</span>
            <div class="mini-progress">
              <div
                class="fill"
                :style="{ width: isStageCompleted('capacity') ? '100%' : '0%' }"
              ></div>
            </div>
            <span class="value">{{ besearchContext.capacity || "None" }}</span>
          </div>
          <div class="summary-item" :class="{ ok: isStageCompleted('logic') }" @click="besearchContext.logic = true">
            <span class="label">Logic</span>
            <div class="mini-progress">
              <div
                class="fill"
                :style="{ width: isStageCompleted('logic') ? '100%' : '0%' }"
              ></div>
            </div>
            <span class="value"
              >{{ activeOrgos.length + activeGelles.length }} Nodes</span
            >
          </div>
          <div class="summary-item" :class="{ ok: isStageCompleted('heli') }" @click="besearchContext.heli = true">
            <span class="label">Heli</span>
            <div class="mini-progress">
              <div
                class="fill"
                :style="{ width: isStageCompleted('heli') ? '100%' : '0%' }"
              ></div>
            </div>
            <span class="value">
              {{ isStageCompleted("heli") ? "Complete" : "Pending" }}
            </span>
          </div>
        </div>
        <div class="header-right">
          <button class="collapse-btn" @click="storeBesearch.isBesearchExpanded = false" title="Collapse Besearch">
            <span class="icon">▼</span>
          </button>
        </div>
      </div>

      <div class="besearch-collapsed-bar" v-if="!storeBesearch.isBesearchExpanded" @click="storeBesearch.isBesearchExpanded = true">
        <span class="collapsed-title">Besearch cycle</span>
        <button class="expand-btn">
          <span class="icon">▲</span>
          <span>Expand</span>
        </button>
      </div>

      <div class="besearch-layer-content" v-show="storeBesearch.isBesearchExpanded">

        <div class="besearch-controls-top" v-if="storeBesearch.besearchMode !== 'besearch'">

        <div class="thread-indicator">
          <span class="pulse-dot"></span>
          {{ activeThread }}
        </div>

        <div class="controls-right">
          <div class="besearch-branding">
            <span class="branding-label">Besearch Cycle</span>
            <div
              class="cycle-toggle"
              :class="{ playing: isCyclePlaying }"
              @click="toggleCycle"
              title="Toggle Besearch Cycle"
            >
              <img
                src="@/assets/besearch-cycle.png"
                alt="Besearch Cycle"
                class="cycle-icon"
              />
              <span class="cycle-status-icon">{{
                isCyclePlaying ? "⏸" : "▶"
              }}</span>
            </div>
          </div>
          <button class="close-layer" @click="closeLayer">✕</button>
        </div>
      </div>

      <div class="smelter-container" :class="[`stage-${currentStage}`]">
        <!-- New Stage Tabs Sidebar -->
        <nav class="stage-tabs">
          <div 
            v-for="(stage, idx) in ['logic', 'heli', 'emulation']" 
            :key="stage"
            class="stage-tab"
            :class="{ 
              active: reviewStage === stage,
              completed: isStageCompleted(stage),
              locked: isStageLocked(stage)
            }"
            @click="!isStageLocked(stage) && (reviewStage = stage)"
          >
            <div class="tab-num">0{{ idx + 1 }}</div>
            <div class="tab-label">{{ stage }}</div>
            <div class="tab-status" v-if="isStageCompleted(stage)">✓</div>
          </div>
        </nav>

        <main class="lab-space">
          <div class="action-grid">
            <!-- Stage 01: Logic / Sculpting Lab -->
            <div 
              v-if="reviewStage === 'logic'" 
              class="action-row"
            >
              <div class="action-main">
                <div class="action-header">
                  <span class="action-num">01</span>
                  <h3>Logic Braid</h3>
                </div>
                <p class="action-desc">Orgo, Gelle & Tiny Devices alignment</p>
                <button 
                  class="action-btn" 
                  @click="storeBesearch.openSculptingLayer()"
                >
                  Go to Sculpting Lab
                </button>
              </div>
              <div class="action-status">
                <span class="status-label">Status</span>
                <span class="status-value" :class="logicStatus.class">
                  {{ logicStatus.text }}
                </span>
              </div>
            </div>

            <!-- Stage 02: Heli Projection -->
            <div 
              v-else-if="reviewStage === 'heli'" 
              class="action-row"
            >
              <div class="action-main">
                <div class="action-header">
                  <span class="action-num">02</span>
                  <h3>Heli Projection</h3>
                </div>
                <p class="action-desc">Temporal resonance & orbital mapping</p>
                <button 
                  class="action-btn" 
                  @click="goToHeliProjection"
                >
                  Go to Heli Projection
                </button>
              </div>
              <div class="action-status">
                <span class="status-label">Status</span>
                <span class="status-value" :class="heliStatus.class">
                  {{ heliStatus.text }}
                </span>
                <div class="status-summary-mini" v-if="isStageCompleted('heli')">
                  {{ heliSummary }}
                </div>
              </div>
            </div>

            <!-- Stage 03: Body Emulation -->
            <div 
              v-else-if="reviewStage === 'emulation'" 
              class="action-row"
            >
              <div class="action-main">
                <div class="action-header">
                  <span class="action-num">03</span>
                  <h3>Body Emulation</h3>
                </div>
                <p class="action-desc">Full spectrum behavioral simulation</p>
                <button 
                  class="action-btn" 
                  @click="goToEmulationWorld"
                >
                  Go to Emulation World
                </button>
              </div>
              <div class="action-status">
                <span class="status-label">Status</span>
                <span class="status-value">
                  {{ isStageCompleted('emulation') ? 'Ready' : 'Pending' }}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { besearchStore } from "@/stores/besearchStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { useOrgoStore } from "@/stores/orgoStore.js";
import { useGelleStore } from "@/stores/gelleStore.js";

import BesearchLogic from "./parts/BesearchLogic.vue";
import BesearchDevices from "./parts/BesearchDevices.vue";
import BesearchHeli from "./parts/BesearchHeli.vue";
import BesearchEmulation from "./parts/BesearchEmulation.vue";

const storeBesearch = besearchStore();
const storeAI = aiInterfaceStore();
const orgoStore = useOrgoStore();
const gelleStore = useGelleStore();

const isDarkMode = ref(false);
const isCyclePlaying = ref(false);

const toggleCycle = () => {
  storeBesearch.isBesearchLayerOpen = false;
  storeBesearch.wasBesearchCycleOpen = true;
  storeAI.activeLifeStrapID = "";
  storeAI.activeContractKey = "";
  storeBesearch.showBottomPanel = false;
  storeBesearch.selectedIntervention = null;
  storeBesearch.showBesearchDetail = false;
  storeAI.showLifestapLens = true;
  storeBesearch.bottomHeight = 60;
  storeAI.currentMode = "besearch";
  isCyclePlaying.value = !isCyclePlaying.value;
  evidenceLogs.value.push(
    `Besearch Cycle ${isCyclePlaying.value ? "activated" : "paused"}`,
  );
};

onMounted(() => {
  const theme = document.documentElement.getAttribute("data-theme");
  isDarkMode.value = theme === "dark";
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "data-theme") {
        const newTheme = document.documentElement.getAttribute("data-theme");
        isDarkMode.value = newTheme === "dark";
      }
    });
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
});

const isOpen = computed(() => storeBesearch.isBesearchLayerOpen);
const currentStage = computed(() => storeBesearch.currentBesearchStage);
const reviewStage = ref(currentStage.value);

// Watch for stage changes to auto-switch reviewStage
watch(currentStage, (newStage) => {
  reviewStage.value = newStage;
});

const activeThread = computed(() => storeBesearch.activeBesearchThread);
const isDrawerOpen = ref(true);
const evidenceLogs = ref([
  "Awaiting data ingestion...",
  "Scanning resonance patterns...",
]);

const activeOrgos = computed(() => orgoStore.activeOrgos);
const activeGelles = computed(() => gelleStore.activeGelles);

const logicStatus = computed(() => {
  const isCompleted = isStageCompleted('logic');
  const hasStarted = activeOrgos.value.length > 0 || activeGelles.value.length > 0;
  
  if (isCompleted) return { text: 'Complete', class: 'status-complete' };
  if (hasStarted) return { text: 'Graft in Progress', class: 'status-progress' };
  return { text: 'Not Grafted', class: 'status-pending' };
});

const heliStatus = computed(() => {
  const isCompleted = isStageCompleted('heli');
  if (isCompleted) return { text: 'Heli Set', class: 'status-complete' };
  return { text: 'Pending', class: 'status-pending' };
});

const heliSummary = computed(() => {
  const ctx = storeBesearch.activeBesearchContext;
  const parts = [];
  if (ctx.orbits) parts.push(`${ctx.orbits} Orbits`);
  if (ctx.days) parts.push(`${ctx.days} Days`);
  if (ctx.arcs) parts.push(`${ctx.arcs} Arcs`);
  return parts.length > 0 ? parts.join(' / ') : 'Default Calibration';
});

const goToHeliProjection = () => {
  storeBesearch.currentBesearchStage = 'heli';
  storeBesearch.isHeliExpanded = true;
};

const goToEmulationWorld = () => {
  storeBesearch.currentBesearchStage = 'emulation';
  storeBesearch.isEmulationExpanded = true;
};

const isTriPointLocked = computed(() => {
  return (
    isStageCompleted("capacity") &&
    isStageCompleted("logic") &&
    isStageCompleted("heli")
  );
});

const isStageCompleted = (stage) => {
  const ctx = storeBesearch.activeBesearchContext;
  if (stage === "capacity")
    return !!(ctx.capacity);
  if (stage === "logic")
    return !!(ctx.logic) || activeOrgos.value.length > 0 || activeGelles.value.length > 0;
  if (stage === "heli") return !!(ctx.heli) || !!(ctx.orbits || ctx.days || ctx.arcs);
  if (stage === "emulation") return isTriPointLocked.value;
  return false;
};

const isStageLocked = (stage) => {
  if (stage === "emulation") {
    return (
      !isStageCompleted("capacity") ||
      !isStageCompleted("logic") ||
      !isStageCompleted("heli")
    );
  }
  return false;
};

const setStage = (stage) => {
  if (!isStageLocked(stage)) {
    storeBesearch.currentBesearchStage = stage;
    // Automatically expand the new stage
    if (stage === 'logic') {
      storeBesearch.isLogicExpanded = true;
      storeBesearch.isHeliExpanded = false;
      storeBesearch.isEmulationExpanded = false;
    } else if (stage === 'heli') {
      storeBesearch.isLogicExpanded = false;
      storeBesearch.isHeliExpanded = true;
      storeBesearch.isEmulationExpanded = false;
    } else if (stage === 'emulation') {
      storeBesearch.isLogicExpanded = false;
      storeBesearch.isHeliExpanded = false;
      storeBesearch.isEmulationExpanded = true;
    }
  }
};

const besearchContext = computed(() => storeBesearch.activeBesearchContext);

const activeInstruments = ref([
  { id: "polar-h10", name: "Polar H10", type: "HRM", online: true },
  { id: "withings-body", name: "Withings Body+", type: "Scale", online: true },
]);

const handleInstrumentDragStart = (e, device) => {
  e.dataTransfer.setData(
    "application/besearch-instrument",
    JSON.stringify(device),
  );
};

const handleSeedDragStart = (e, seed, type) => {
  e.dataTransfer.setData(
    "application/besearch-seed",
    JSON.stringify({ ...seed, type }),
  );
};

const snapOrgoToDevice = (device) => {
  evidenceLogs.value.push(`Snapping to ${device.name}...`);
  if (activeOrgos.value.length > 0) {
    const firstOrgo = activeOrgos.value[0];
    firstOrgo.params.amplitude = 75;
    firstOrgo.params.wavelength = 40;
    evidenceLogs.value.push(
      `${firstOrgo.name} frequency aligned to Peer rhythm.`,
    );
  }
};

const closeLayer = () => {
  storeBesearch.closeBesearchLayer();
  storeBesearch.besearchMode = "resting";
  storeAI.showLifestapLens = false;
  if (storeBesearch.wasSculptingLayerOpen) {
    storeBesearch.isSculptingLayerOpen = true;
    storeBesearch.wasSculptingLayerOpen = false;
  }
};
</script>

<style scoped>
.action-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.action-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.dark-theme .action-row {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.action-main {
  flex: 1;
}

.action-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.action-num {
  font-family: "Space Mono", monospace;
  font-size: 1rem;
  color: #00796b;
  opacity: 0.5;
}

.dark-theme .action-num {
  color: #00ffcc;
}

.action-header h3 {
  margin: 0;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 800;
  color: #2d3748;
}

.dark-theme .action-header h3 {
  color: #e2e8f0;
}

.action-desc {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 25px;
}

.dark-theme .action-desc {
  color: #a0aec0;
}

.action-btn {
  padding: 12px 24px;
  background: #00ffcc;
  color: #1a202c;
  border: none;
  border-radius: 30px;
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 255, 204, 0.2);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 255, 204, 0.3);
}

.action-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 150px;
}

.status-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #718096;
  opacity: 0.6;
}

.status-value {
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: uppercase;
}

.status-pending { color: #718096; }
.status-progress { color: #ff8000; }
.status-complete { color: #00796b; }

.dark-theme .status-complete { color: #00ffcc; }

.status-summary-mini {
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  color: #4a5568;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 5px;
}

.dark-theme .status-summary-mini {
  color: #a0aec0;
  background: rgba(255, 255, 255, 0.05);
}

.besearch-layer-content {
  display: contents;
}

.besearch-header-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 20;
}

.dark-theme .besearch-header-status {
  background: rgba(20, 20, 25, 0.95);
  border-bottom: 1px solid rgba(0, 255, 204, 0.2);
}

.besearch-title {
  font-family: "Space Mono", monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: #2d3748;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark-theme .besearch-title {
  color: #00ffcc;
}

.status-summary {
  display: flex;
  gap: 24px;
  flex: 1;
  justify-content: center;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.mini-progress {
  width: 40px;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.dark-theme .mini-progress {
  background: rgba(255, 255, 255, 0.1);
}

.fill {
  height: 100%;
  background: #cbd5e0;
  transition: width 0.3s ease;
}

.summary-item.ok .fill {
  background: #00796b;
}

.dark-theme .summary-item.ok .fill {
  background: #00ffcc;
}

.summary-item .value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
}

.dark-theme .summary-item .value {
  color: #a0aec0;
}

.collapse-btn, .expand-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  font-size: 0.8rem;
  font-weight: 600;
  transition: color 0.2s;
}

.collapse-btn:hover, .expand-btn:hover {
  color: #2d3748;
}

.dark-theme .collapse-btn, .dark-theme .expand-btn {
  color: #a0aec0;
}

.dark-theme .collapse-btn:hover, .dark-theme .expand-btn:hover {
  color: #00ffcc;
}

.besearch-collapsed-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.2s;
}

.besearch-collapsed-bar:hover {
  background: #f7fafc;
}

.dark-theme .besearch-collapsed-bar {
  background: rgba(20, 20, 25, 0.95);
  border-bottom: 1px solid rgba(0, 255, 204, 0.2);
}

.dark-theme .besearch-collapsed-bar:hover {
  background: rgba(30, 30, 35, 0.95);
}

.collapsed-title {
  font-family: "Space Mono", monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #2d3748;
  text-transform: uppercase;
}

.dark-theme .collapsed-title {
  color: #00ffcc;
}

.besearch-layer {
  position: relative;
  width: 100%;
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(35px) saturate(200%) brightness(1.1);
  -webkit-backdrop-filter: blur(35px) saturate(200%) brightness(1.1);
  z-index: 10;
  display: flex;
  flex-direction: column;
  color: #1a202c;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 1;
  pointer-events: auto;
}

.besearch-layer.besearch-active {
  /* No transform needed when embedded */
}

.besearch-slide-enter-from,
.besearch-slide-leave-to {
  opacity: 0;
}

.besearch-layer.dark-theme {
  background: rgba(10, 10, 15, 0.98);
  color: #f0f0f0;
  border-top: 1px solid rgba(0, 255, 204, 0.3);
}

.besearch-controls-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dark-theme .besearch-controls-top {
  background: rgba(20, 20, 25, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.branding-label {
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
  color: #2d3748;
}

.dark-theme .branding-label {
  color: #00ffcc;
}

.lab-space {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 200px;
  gap: 20px;
  padding: 30px;
  overflow-y: auto;
  background: #f7f9fc;
}

.dark-theme .lab-space {
  background: transparent;
}

.step-header h4 {
  margin: 0;
  flex: 1;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #2d3748;
  font-weight: 800;
}

.dark-theme .step-header h4 {
  color: #e2e8f0;
}

.summary-item .label {
  color: #4a5568;
  font-weight: 800;
}

.dark-theme .summary-item .label {
  color: #a0aec0;
}


.expand-sieve-btn {
  background: rgba(0, 255, 204, 0.1);
  border: 1px solid rgba(0, 255, 204, 0.3);
  color: #00ffcc;
  font-size: 0.65rem;
  padding: 4px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 800;
  transition: all 0.2s;
}

.expand-sieve-btn:hover {
  background: rgba(0, 255, 204, 0.2);
  transform: scale(1.05);
}

.beebee-dialogue-roll {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 40px;
  background: linear-gradient(180deg, rgba(0, 255, 204, 0.12) 0%, transparent 100%);
  border-bottom: 1px solid rgba(0, 255, 204, 0.2);
  margin-bottom: 10px;
}

.beebee-avatar {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(0, 255, 204, 0.4));
  animation: hover-float 3s infinite ease-in-out;
}

@keyframes hover-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(5deg); }
}

.beebee-message {
  font-family: "Space Mono", monospace;
  font-size: 0.95rem;
  color: #00ffcc;
  font-style: normal;
  margin: 0;
  line-height: 1.4;
  text-shadow: 0 0 5px rgba(0, 255, 204, 0.3);
}

.roll-down-enter-active, .roll-down-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 100px;
  overflow: hidden;
}

.roll-down-enter-from, .roll-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}

.besearch-layer.dark-theme {
  background: rgba(5, 5, 10, 0.98);
  color: #e0e0e0;
  border-top: 1px solid rgba(0, 255, 204, 0.2);
}

.besearch-controls-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.controls-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.controls-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.thread-indicator {
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: #00796b;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.besearch-branding {
  display: flex;
  align-items: center;
  gap: 12px;
}

.branding-label {
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
  color: #2d3748;
  opacity: 0.8;
}

.cycle-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 20px;
  background: #f7fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  user-select: none;
}

.cycle-toggle:hover {
  background: #edf2f7;
  border-color: rgba(0, 0, 0, 0.1);
}

.cycle-toggle.playing {
  background: #e6fffa;
  border-color: #00796b;
  box-shadow: 0 0 10px rgba(0, 121, 107, 0.1);
}

.cycle-icon {
  height: 18px;
  width: auto;
  opacity: 0.7;
  transition: all 0.3s;
}

.playing .cycle-icon {
  opacity: 1;
  filter: drop-shadow(0 0 5px rgba(0, 121, 107, 0.3));
  animation: slow-rotate 4s linear infinite;
}

.cycle-status-icon {
  font-size: 0.8rem;
  color: #4a5568;
}

.playing .cycle-status-icon {
  color: #00796b;
}

@keyframes slow-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Transition for the lab sliding from bottom */
.besearch-slide-enter-active,
.besearch-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.besearch-slide-enter-from,
.besearch-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.dark-theme .besearch-branding .branding-label {
  color: #e0e0e0;
}

.dark-theme .cycle-toggle {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .cycle-toggle.playing {
  background: rgba(0, 255, 204, 0.05);
  border-color: #00ffcc;
}

.dark-theme .cycle-status-icon {
  color: #e0e0e0;
}

.dark-theme .playing .cycle-status-icon {
  color: #00ffcc;
}

.dark-theme .besearch-controls-top {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.thread-indicator {
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: #00796b;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.dark-theme .thread-indicator {
  color: #00ffcc;
  font-weight: 400;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #00796b;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 121, 107, 0.3);
  animation: pulse 2s infinite;
}

.dark-theme .pulse-dot {
  background: #00ffcc;
  box-shadow: 0 0 10px #00ffcc;
}

.besearch-sequential-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.besearch-step {
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  background: #ffffff;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.dark-theme .besearch-step {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.besearch-step.collapsed {
  opacity: 0.8;
}

.besearch-step.locked {
  opacity: 0.3;
  pointer-events: none;
}

.step-header {
  padding: 15px 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.02);
}

.dark-theme .step-header {
  background: rgba(255, 255, 255, 0.05);
}

.step-num {
  font-family: "Space Mono", monospace;
  font-size: 0.8rem;
  color: #00796b;
  opacity: 0.5;
}

.dark-theme .step-num {
  color: #00ffcc;
}

.step-header h4 {
  margin: 0;
  flex: 1;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #2d3748;
}

.dark-theme .step-header h4 {
  color: #e0e0e0;
}

.step-status {
  color: #00796b;
  font-weight: bold;
}

.dark-theme .step-status {
  color: #00ffcc;
}

.step-toggle {
  background: transparent;
  border: none;
  color: #718096;
  cursor: pointer;
}

.step-content {
  padding: 20px;
}

.step-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.next-step-btn {
  padding: 10px 20px;
  background: #00ffcc;
  color: #1a202c;
  border: none;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.75rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.next-step-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 204, 0.3);
}

.smelter-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* New Stage Tabs Sidebar Styles */
.stage-tabs {
  width: 60px;
  background: rgba(0, 0, 0, 0.02);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  z-index: 10;
}

.dark-theme .stage-tabs {
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.stage-tab {
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  border-left: 3px solid transparent;
}

.stage-tab.active {
  background: #ffffff;
  border-left-color: #00796b;
}

.dark-theme .stage-tab.active {
  background: rgba(255, 255, 255, 0.05);
  border-left-color: #00ffcc;
}

.stage-tab.locked {
  opacity: 0.2;
  cursor: not-allowed;
}

.stage-tab.completed {
  color: #00796b;
}

.dark-theme .stage-tab.completed {
  color: #00ffcc;
}

.tab-num {
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 5px;
  opacity: 0.5;
}

.active .tab-num {
  opacity: 1;
}

.tab-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  font-weight: 800;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  letter-spacing: 0.1em;
}

.tab-status {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Stage Slide Transitions */
.stage-slide-enter-active,
.stage-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.stage-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.stage-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.orgo-drawer {
  width: 60px;
  background: #ede9e1;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.dark-theme .orgo-drawer {
  background: rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.orgo-drawer.open {
  width: 250px;
}

.drawer-header {
  padding: 20px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-theme .drawer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.drawer-header h5 {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 700;
  color: #4a5568;
}

.dark-theme .drawer-header h5 {
  color: #e0e0e0;
  font-weight: 400;
}

.seed-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.seed-section h6 {
  font-size: 0.65rem;
  text-transform: uppercase;
  margin-bottom: 10px;
  color: #718096;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.dark-theme .seed-section h6 {
  color: #e0e0e0;
  font-weight: 400;
}

.seed-item {
  padding: 12px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  color: #2d3748;
  transition: all 0.2s;
}

.dark-theme .seed-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
}

.seed-item:hover {
  background: #ffffff;
  border-color: #00796b;
  box-shadow: 0 4px 8px rgba(0, 121, 107, 0.1);
  transform: translateY(-1px);
}

.dark-theme .seed-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #00ffcc;
  box-shadow: none;
  transform: none;
}

.seed-icon {
  font-size: 1.2rem;
}

.lab-space {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
  overflow-y: auto;
  background: #fdfcfb;
  position: relative;
}

.dark-theme .lab-space {
  background: transparent;
}

.context-bay :deep(.variable-tag),
.attunement-bay :deep(.variable-tag) {
  cursor: pointer;
}

.context-bay :deep(.variable-tag.active),
.attunement-bay :deep(.variable-tag.active) {
  background: rgba(0, 255, 200, 0.2);
  border-color: var(--sov-accent);
}

.dark-theme .context-bay :deep(.variable-tag.active),
.dark-theme .attunement-bay :deep(.variable-tag.active) {
  background: rgba(0, 255, 204, 0.1);
  border-color: #00ffcc;
}

.lab-bay {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.dark-theme .lab-bay {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.bay-header h4 {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #2d3748;
  font-weight: 800;
}

.bay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sculpt-shortcut {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 0;
}

.sculpt-shortcut:hover {
  opacity: 1;
}

.dark-theme .bay-header h4 {
  color: #00ffcc;
  font-weight: 400;
}

.bay-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 0.85rem;
  color: #718096;
}

.dark-theme .bay-placeholder {
  border: 2px dashed rgba(255, 255, 255, 0.05);
  color: inherit;
}

.active-instance {
  background: #f7fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.dark-theme .active-instance {
  background: rgba(0, 0, 0, 0.2);
  border: none;
}

.instance-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.instance-name {
  color: #00796b;
  font-weight: 700;
  font-size: 0.9rem;
}

.dark-theme .instance-name {
  color: #00ffcc;
  font-weight: 600;
}

.instance-id {
  font-family: monospace;
  font-size: 0.65rem;
  color: #718096;
}

.dark-theme .instance-id {
  color: inherit;
  opacity: 0.5;
}

.tuning-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider-group label {
  font-size: 0.7rem;
  text-transform: capitalize;
  color: #4a5568;
  font-weight: 600;
}

.dark-theme .slider-group label {
  color: inherit;
  opacity: 0.7;
}

.strategy-selector {
  display: flex;
  gap: 8px;
  width: 100%;
}

.strategy-selector button {
  flex: 1;
  padding: 12px 8px;
  font-size: 0.65rem;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: #4a5568;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 700;
  transition: all 0.2s;
}

.dark-theme .strategy-selector button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  font-weight: 600;
}

.strategy-selector button.active {
  background: #00796b;
  color: #ffffff;
  border-color: #00796b;
}

.dark-theme .strategy-selector button.active {
  background: #00ffcc;
  color: #000;
  border-color: #00ffcc;
}

.graft-zone {
  margin-top: 15px;
  height: 300px;
  min-height: 220px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

.dark-theme .graft-zone {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.instrument-rack .instrument-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.instrument-item {
  background: #f7fafc;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  color: #2d3748;
}

.dark-theme .instrument-item {
  background: rgba(255, 255, 255, 0.03);
  color: #e0e0e0;
  border: 1px solid transparent;
}

.instrument-item:hover {
  background: #ffffff;
  border-color: #00796b;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.dark-theme .instrument-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(0, 255, 204, 0.3);
  box-shadow: none;
}

.device-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef5350;
}

.device-status.online {
  background: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}

.dark-theme .device-status.online {
  background: #00ffcc;
  box-shadow: 0 0 5px #00ffcc;
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.device-name {
  font-size: 0.85rem;
  font-weight: 700;
}

.device-type {
  font-size: 0.65rem;
  color: #718096;
}

.dark-theme .device-type {
  opacity: 0.6;
  color: inherit;
}

.snap-btn {
  background: transparent;
  border: 1.5px solid #00796b;
  color: #00796b;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
}

.dark-theme .snap-btn {
  border-color: #00ffcc;
  color: #00ffcc;
  border-width: 1px;
  font-weight: 700;
}

.gemini-fold {
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark-theme .gemini-fold {
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.gemini-fold.expanded {
  height: 400px;
}

.fold-status-bar {
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.lock-indicator {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #718096;
  font-weight: 700;
  opacity: 0.6;
}

.lock-indicator.locked {
  opacity: 1;
  color: #00796b;
}

.dark-theme .lock-indicator.locked {
  color: #00ffcc;
}

.launch-btn {
  background: #00796b;
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 121, 107, 0.2);
  transition: all 0.2s;
}

.launch-btn:hover {
  background: #00695c;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 121, 107, 0.3);
}

.dark-theme .launch-btn {
  background: #00ffcc;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
}

.dark-theme .launch-btn:hover {
  background: #00ffcc;
  transform: scale(1.02);
}

.fold-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 0 40px 40px 40px;
  height: calc(100% - 60px);
}

.scribe-pane,
.seer-pane {
  display: flex;
  flex-direction: column;
}

.evidence-log {
  flex: 1;
  background: #1a1c1e;
  border-radius: 12px;
  padding: 15px;
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  color: #4caf50;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.visual-projection {
  flex: 1;
  background: #0a0c0e;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.selection-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.selection-item {
  padding: 12px;
  background: #f7fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.2s;
}

.selection-item:hover {
  background: #edf2f7;
  border-color: rgba(0, 0, 0, 0.1);
}

.selection-item.active {
  background: #e6fffa;
  border-color: #00796b;
  box-shadow: 0 0 10px rgba(0, 121, 107, 0.1);
}

.dark-theme .selection-item {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
}

.dark-theme .selection-item.active {
  background: rgba(0, 255, 204, 0.05);
  border-color: #00ffcc;
}

.item-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #718096;
  font-weight: 700;
}

.item-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.item-actions-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.strategy-selector-inline {
  display: flex;
  gap: 2px;
}

.strategy-selector-inline button {
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 0.6rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #4a5568;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 700;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-theme .strategy-selector-inline button {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.strategy-selector-inline button.active {
  background: #00796b;
  color: #ffffff;
  border-color: #00796b;
}

.dark-theme .strategy-selector-inline button.active {
  background: #00ffcc;
  color: #000;
  border-color: #00ffcc;
}

.set-strand-btn-inline {
  background: #00796b;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.6rem;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
}

.dark-theme .set-strand-btn-inline {
  background: #00ffcc;
  color: black;
}

.set-strand-btn-inline.ready-success {
  background: #4caf50 !important;
  color: white !important;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.4);
}

.braiding-mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  background: #f7fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  transition: all 0.2s;
  margin-right: 15px;
}

.braiding-mode-toggle:hover {
  background: #edf2f7;
}

.braiding-mode-toggle.active {
  border-color: #ff8000;
  background: rgba(255, 128, 0, 0.05);
}

.toggle-label {
  font-family: "Space Mono", monospace;
  font-size: 0.65rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #4a5568;
}

.braiding-mode-toggle.active .toggle-label {
  color: #ff8000;
}

.toggle-switch {
  width: 30px;
  height: 16px;
  background: #cbd5e0;
  border-radius: 10px;
  position: relative;
  transition: all 0.2s;
}

.active .toggle-switch {
  background: #ff8000;
}

.toggle-knob {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.active .toggle-knob {
  left: 16px;
}

.dark-theme .braiding-mode-toggle {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .toggle-label {
  color: #e0e0e0;
}

.dark-theme .braiding-mode-toggle.active {
  background: rgba(255, 128, 0, 0.1);
}

.set-braid-btn {
  background: #ff8000 !important;
  box-shadow: 0 0 20px rgba(255, 128, 0, 0.3) !important;
}

.dark-theme .set-braid-btn {
  background: #ff8000 !important;
  color: white !important;
}

.empty-selection {
  font-size: 0.8rem;
  opacity: 0.5;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Scavenger Tray overrides */
.scavenger-tray {
  grid-column: span 2;
  background: #ede9e1;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
}

.dark-theme .scavenger-tray {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.scavenger-tray h5 {
  margin: 0 0 15px 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #4a5568;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.dark-theme .scavenger-tray h5 {
  color: inherit;
  font-weight: 400;
}

.bubble-stream {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.residue-bubble {
  padding: 6px 14px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  cursor: grab;
  font-size: 0.75rem;
  color: #2d3748;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.2s;
  white-space: nowrap;
  width: fit-content;
  display: inline-flex;
  align-items: center;
}

.residue-bubble:hover {
  border-color: #00796b;
  transform: translateY(-1px);
}

.dark-theme .residue-bubble {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  box-shadow: none;
  font-weight: 400;
}

.graft-bubble {
  padding: 6px 14px;
  background: #e6fffa;
  border: 1px solid #00796b;
  color: #00796b;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 700;
}

.dark-theme .graft-bubble {
  background: rgba(0, 255, 204, 0.1);
  border: 1px solid #00ffcc;
  color: #00ffcc;
  font-weight: 600;
}

.close-layer {
  background: #edf2f7;
  border: none;
  color: #4a5568;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-layer:hover {
  background: #e2e8f0;
  color: #1a202c;
}

/* Progress Nav */
.progress-nav {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stage-node {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  opacity: 0.5;
  transition: all 0.3s;
}

.stage-node.active {
  opacity: 1;
}

.stage-node.completed {
  opacity: 0.8;
  color: #00796b;
}

.dark-theme .stage-node.completed {
  color: #00ffcc;
}

.stage-node.locked {
  cursor: not-allowed;
  opacity: 0.2;
}

.stage-number {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
}

.stage-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.stage-connector {
  width: 20px;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

.dark-theme .stage-connector {
  background: rgba(255, 255, 255, 0.1);
}

/* Stage Specific Layouts */
.logic-braid-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  grid-column: 1 / -1;
}

.logic-braid-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  flex: 1;
}

.instrument-dock-zone {
  min-height: 120px;
  grid-column: 1 / -1;
}

.dropped-instruments-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.instrument-item.dropped {
  background: rgba(0, 0, 0, 0.05);
  padding: 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(0, 121, 107, 0.2);
}

.dark-theme .instrument-item.dropped {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 255, 204, 0.2);
}

.remove-btn {
  background: transparent;
  border: none;
  color: #ef5350;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 5px;
  margin-left: 5px;
}

.emulation-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  grid-column: 1 / -1;
}

.lab-bay.seer-bay {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.visual-projection-v2 {
  flex: 1;
  position: relative;
  background: #0a0c0e;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.capacity-bay,
.context-bay,
.heli-center {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.heli-center {
  grid-column: 1 / -1;
}

.capacity-focus {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.cue-word-large {
  font-size: 4rem;
  font-weight: 900;
  color: #00796b;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.dark-theme .cue-word-large {
  color: #00ffcc;
  text-shadow: 0 0 30px rgba(0, 255, 204, 0.3);
}

.active-instance.mini {
  padding: 10px;
  margin-bottom: 10px;
}

.tuning-controls.mini {
  grid-template-columns: 1fr;
  gap: 5px;
}

.strategy-selector.mini button {
  padding: 4px;
  font-size: 0.55rem;
}

.graft-zone.mini {
  min-height: 40px;
  padding: 5px;
  position: relative;
  overflow: hidden;
}

.gelle-polyhedron-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.6;
}

.graft-bubble.mini {
  padding: 2px 8px;
  font-size: 0.6rem;
}

.heli-clock-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.heli-projection-mock {
  flex: 1;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.dark-theme .heli-projection-mock {
  background: rgba(255, 255, 255, 0.02);
}

.mock-data-viz {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.viz-line {
  height: 4px;
  background: #00ffcc;
}

.heli-sectors-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.heli-sector {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 121, 107, 0.2);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  transition: all 0.3s;
}

.dark-theme .heli-sector {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(0, 255, 204, 0.2);
}

.heli-sector h5 {
  margin: 0 0 5px 0;
  font-size: 0.65rem;
  text-transform: uppercase;
  opacity: 0.7;
}

.sector-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #00796b;
}

.dark-theme .sector-value {
  color: #00ffcc;
}

.sector-placeholder {
  font-size: 0.7rem;
  opacity: 0.4;
  font-style: italic;
  margin-top: 5px;
}

.active-item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.heli-active-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 121, 107, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.dark-theme .heli-active-item {
  background: rgba(0, 255, 204, 0.05);
}

.heli-active-item.constant {
  border-left: 2px solid #00796b;
}

.dark-theme .heli-active-item.constant {
  border-left-color: #00ffcc;
}

.item-label {
  opacity: 0.6;
  font-size: 0.65rem;
  text-transform: uppercase;
}

.item-value {
  font-weight: 700;
  color: #00796b;
}

.dark-theme .item-value {
  color: #00ffcc;
}

.dark-theme .close-layer {
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
}

.dark-theme .close-layer:hover {
  background: rgba(255, 255, 255, 0.1);
}

.device-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef5350;
}

.device-status-dot.online {
  background: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}

.dark-theme .device-status-dot.online {
  background: #00ffcc;
  box-shadow: 0 0 5px #00ffcc;
}

.seed-item.device {
  cursor: pointer;
}

.seed-type {
  font-size: 0.6rem;
  opacity: 0.6;
  display: block;
}

/* Footer & Status Summary */
.besearch-footer {
  padding: 10px 30px;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.dark-theme .besearch-footer {
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.status-summary {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.summary-item.ok {
  opacity: 1;
}

.summary-item .label {
  font-size: 0.65rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #718096;
}

.dark-theme .summary-item .label {
  color: #e0e0e0;
}

.mini-progress {
  width: 60px;
  height: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.dark-theme .mini-progress {
  background: rgba(255, 255, 255, 0.1);
}

.mini-progress .fill {
  height: 100%;
  background: #00796b;
  transition: width 0.5s ease;
}

.dark-theme .mini-progress .fill {
  background: #00ffcc;
  box-shadow: 0 0 10px #00ffcc;
}

.summary-item .value {
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  font-weight: 600;
  color: #2d3748;
}

.dark-theme .summary-item .value {
  color: #e0e0e0;
}

.emulation-live {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 5;
}
</style>
