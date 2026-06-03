<template>
  <div
    class="bottom-panel overlay-blur"
    :class="{ 'is-dragging': isDragging }"
    :style="{ height: height + 'px' }"
  >
    <button
      @mousedown.stop="handleMouseDown"
      @click.stop="handleToggle"
      class="bottom-toggle-button"
    >
      <div class="handle-bar"></div>
    </button>

    <div
      v-show="
        height > 80 ||
        storeBesearch.isSieveExpanded === true ||
        storeBesearch.besearchMode !== 'default'
      "
      class="bottom-panel-content"
      ref="contentArea"
    >
      <!-- Show besearch detail when intervention is selected -->
      <besearch-detail v-if="showBesearchDetail === true"></besearch-detail>

      <!-- Multi-Layer Workflow Container -->
      <div class="dual-layer-container">
        <!-- Sidebar Navigation -->
        <div class="bottom-sidebar">
          <div 
            class="vertical-tab" 
            :class="{ active: storeBesearch.besearchMode === 'lens' || storeBesearch.besearchMode === 'default' }"
            @click="storeBesearch.setHUUDState('lens')"
          >
            <span>LENS</span>
          </div>
          <div 
            class="vertical-tab" 
            :class="{ active: storeBesearch.besearchMode === 'heli' }"
            @click="storeBesearch.setHUUDState('heli')"
          >
            <span>HELI</span>
          </div>
          <div 
            class="vertical-tab" 
            :class="{ active: storeBesearch.besearchMode === 'attunement' }"
            @click="storeBesearch.setHUUDState('attunement')"
          >
            <span>ATTUNE</span>
          </div>
          <div 
            class="vertical-tab" 
            :class="{ active: storeBesearch.besearchMode === 'graft' }"
            @click="storeBesearch.setHUUDState('graft')"
          >
            <span>GRAFT</span>
          </div>
          <div 
            class="vertical-tab" 
            :class="{ active: storeBesearch.besearchMode === 'emulation' }"
            @click="storeBesearch.setHUUDState('emulation')"
          >
            <span>EMU</span>
          </div>
          <div 
            class="vertical-tab" 
            :class="{ active: storeBesearch.besearchMode === 'tinker' }"
            @click="storeBesearch.setHUUDState('tinker')"
          >
            <span>TINKER</span>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="active-section-content">
          <!-- 1. The Lens Section -->
          <div 
            v-show="storeBesearch.besearchMode === 'lens' || storeBesearch.besearchMode === 'default'"
            ref="lensSection" 
            class="lens-section" 
          >
            <LifestrapLens :lenses="extractedData" />
          </div>

          <!-- 2. The Heli Section -->
          <div v-show="storeBesearch.besearchMode === 'heli'" class="heli-section">
            <HeliProjectionLayer />
          </div>

          <!-- 3. The Attunement Section -->
          <div v-show="storeBesearch.besearchMode === 'attunement'" class="attunement-section">
            <AttunementLayer />
          </div>

          <!-- 4. The Graft Section -->
          <div v-show="storeBesearch.besearchMode === 'graft'" class="graft-section">
            <GraftLayer />
          </div>

          <!-- 5. Emulation CueCubes -->
          <div v-show="storeBesearch.besearchMode === 'emulation'" class="emulation-section">
            <CuecubeLayer />
          </div>

          <!-- 6. The Tinkering Section -->
          <div v-show="storeBesearch.besearchMode === 'tinker'" class="tinker-section">
            <TinkerLayer />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import BesearchDetail from "@/components/besearch/attunement/besearchDetail.vue";
import LifestrapLens from "@/components/orbit/parts/LifestrapLens.vue";
import AttunementLayer from "@/components/orbit/parts/attunement/AttunementLayer.vue";
import HeliProjectionLayer from "@/components/orbit/parts/heli/HeliProjectionLayer.vue";
import GraftLayer from "@/components/orbit/parts/graft/GraftLayer.vue";
import CuecubeLayer from "@/components/orbit/parts/emulation/CuecubeLayer.vue";
import TinkerLayer from "@/components/orbit/parts/tinker/TinkerLayer.vue";
import BesearchLayer from "@/components/orbit/besearch/besearchLayer.vue";

import { besearchStore } from "@/stores/besearchStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { loomStore } from "@/stores/loomStore.js";

const storeBesearch = besearchStore();
const storeAI = aiInterfaceStore();
const storeLoom = loomStore();

const currentStage = computed(() => storeBesearch.currentBesearchStage);

const props = defineProps({
  height: Number,
  isOpen: Boolean,
  isDragging: Boolean,
});

const emit = defineEmits(["startDrag", "update:height", "update:isOpen"]);

const dragStartTime = ref(0);
const lensSection = ref(null);
const contentArea = ref(null);
let resizeObserver = null;

/* computed */
const showBesearchDetail = computed(() => {
  return storeBesearch.showBesearchDetail;
});

const hasActiveIntervention = computed(() => {
  return storeBesearch.hasActiveIntervention;
});

const isLensCollapsed = computed(() => {
  return storeAI.showLifestapLens;
});

const updatePanelHeight = async () => {
  // We now rely on setHUUDState to manage panel heights centrally
};

onMounted(() => {
  // Height is now managed by the store's bottomHeight
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

// Watch for changes in active life strap or intervention to update collapse state
watch(
  () => storeAI.activeLifeStrapID,
  (newVal) => {
    // Handled by ExperienceOrchestrator
  },
  { immediate: true },
);

watch(
  () => storeBesearch.showBesearchDetail,
  (newVal) => {
    // Handled by ExperienceOrchestrator or setHUUDState
  },
);

const extractedData = computed(() => {
  return storeLoom.digestInput;
});

/* methods */

const handleMouseDown = (e) => {
  dragStartTime.value = Date.now();
  emit("startDrag");
};

const expandLens = () => {
  storeAI.showLifestapLens = false;
  storeBesearch.showBesearchDetail = false;
  updatePanelHeight();
};

const openLens = () => {
  storeBesearch.setHUUDState('lens');
};

const handleToggle = (e) => {
  const duration = Date.now() - dragStartTime.value;

  if (duration < 250) {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentlyOpen = storeBesearch.showBottomPanel;

    if (isCurrentlyOpen) {
      storeBesearch.setHUUDState('default');
      emit("update:isOpen", false);
    } else {
      storeBesearch.setHUUDState('lens');
      emit("update:isOpen", true);
    }
  }
};
</script>

<style scoped>
.bottom-panel {
  /* ... positional styles ... */
  position: relative;
  z-index: 100;

  /* 1. THE TINT: Extreme transparency. 
     0.03 is almost invisible, but provides just enough 'surface' 
     for the eye to see the glass. */
  background: rgba(255, 255, 255, 0.03);

  /* 2. THE OPTICAL STACK:
     - blur(35px): Strong enough to melt the clock rings into glows.
     - saturate(300%): TRIPLE the saturation. This forces the blue and 
       yellow to stay vivid even when blurred.
     - contrast(1.1): Sharpens the difference between the blue ring 
       and the dark items.
     - brightness(1.0): Keep this at 1.0. Any higher and the light 
       colors turn into a white void. */
  backdrop-filter: blur(35px) saturate(300%) brightness(1) contrast(1.1);
  -webkit-backdrop-filter: blur(35px) saturate(300%) brightness(1) contrast(1.1);

  /* 3. BORDER & SHADOW:
     This is where we get the 'light' back without washing out the colors. */
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 -10px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);

  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
/*
.bottom-panel {
   ... positional styles ... 
  background: transparent; /* Move background to pseudo-element 
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
}
*/
/* This layer specifically "lifts" the darks without affecting the whites as much */
.bottom-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.03);
  mix-blend-mode: plus-lighter;
  pointer-events: none;
  z-index: -1;
}

/* This layer adds the 'sheen' and the top border */
.bottom-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
}

.bottom-panel.is-dragging {
  transition: none;
}

.bottom-toggle-button {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  background: rgba(158, 113, 231, 0.6);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  cursor: ns-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.5);
  z-index: 10000;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bottom-toggle-button:hover {
  background: rgba(158, 113, 231, 0.8);
  box-shadow:
    0 10px 30px rgba(158, 113, 231, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.7);
  transform: translateX(-50%) scale(1.1);
}

.bottom-toggle-button:hover {
  background: rgba(158, 113, 231, 0.5);
  box-shadow:
    0 6px 20px rgba(158, 113, 231, 0.3),
    inset 0 0 15px rgba(255, 255, 255, 0.6);
  transform: translateX(-50%) scale(1.05);
}

.handle-bar {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  background: transparent;
}

.bottom-panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 0; /* Changed from 20px to allow full width for bar */
}

.dual-layer-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 0;
  overflow: hidden;
}

.bottom-sidebar {
  width: 44px;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.95); /* Deep dark background */
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 10px;
  flex-shrink: 0;
  backdrop-filter: blur(20px);
}

.vertical-tab {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  padding: 20px 5px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.15em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 3px solid transparent;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.vertical-tab:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.vertical-tab.active {
  color: #00ffcc; /* Besearch high-visibility cyan */
  background: rgba(0, 255, 204, 0.15);
  border-right: 3px solid #00ffcc;
}

.active-section-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.lens-section, .attunement-section, .heli-section, .graft-section, .emulation-section, .tinker-section {
  height: 100%;
}

.besearch-part-section {
  margin-bottom: 12px;
}

.besearch-bar {
  background: rgba(0, 255, 204, 0.1);
  border-color: rgba(0, 255, 204, 0.3);
}

.besearch-bar .lens-label {
  color: #00ffcc;
}

.besearch-expanded-content {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
}

.part-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.part-header h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #00ffcc;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.collapse-icon {
  color: #718096;
  font-size: 0.8rem;
}
</style>
