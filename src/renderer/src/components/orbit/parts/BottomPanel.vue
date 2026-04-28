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
        storeAI.activeLifeStrapID ||
        storeBesearch.showBesearchDetail
      "
      class="bottom-panel-content"
      ref="contentArea"
    >
      <!-- Show besearch detail when intervention is selected -->
      <besearch-detail v-if="showBesearchDetail === true"></besearch-detail>

      <!-- Always show LifestrapLens - collapsible when besearch intervention is active -->
      <div ref="lensSection" class="lens-section">
        <div
          v-if="isLensCollapsed === true"
          class="lens-collapsed-bar"
          @click="expandLens"
        >
          <span class="lens-label">▼ Life-strap Lens</span>
        </div>
        <LifestrapLens v-else :lenses="extractedData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import BesearchDetail from "@/components/besearch/attunement/besearchDetail.vue";
import LifestrapLens from "@/components/orbit/parts/LifestrapLens.vue";

import { besearchStore } from "@/stores/besearchStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";

const storeBesearch = besearchStore();
const storeAI = aiInterfaceStore();

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
  await nextTick();
  if (contentArea.value) {
    const isLabView = !!storeAI.activeLifeStrapID && !storeAI.showLifestapLens;
    const maxHeight = window.innerHeight * 0.82;

    if (isLabView) {
      storeBesearch.bottomHeight = maxHeight;
      emit("update:height", maxHeight);
      return;
    }

    const contentHeight = contentArea.value.scrollHeight;
    const totalHeight = Math.min(contentHeight + 40, maxHeight);

    if (totalHeight > 60) {
      emit("update:height", totalHeight);
    }
  }
};

onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    if (storeAI.activeLifeStrapID || storeBesearch.showBesearchDetail) {
      updatePanelHeight();
    }
  });
  if (contentArea.value) {
    resizeObserver.observe(contentArea.value);
  }
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
    if (newVal) {
      storeAI.showLifestapLens = false;
      // If we have an active life strap, ensure panel is open
      if (!props.isOpen) {
        emit("update:isOpen", true);
      }
      updatePanelHeight();
    }
  },
  { immediate: true },
);

watch(
  () => storeBesearch.showBesearchDetail,
  (newVal) => {
    if (newVal && storeAI.activeLifeStrapID) {
      storeAI.showLifestapLens = true;
    }
    updatePanelHeight();
  },
);

const extractedData = computed(() => {
  return storeAI.digestInput;
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

const handleToggle = (e) => {
  // Prevent default if it's a click to avoid side effects
  const duration = Date.now() - dragStartTime.value;

  // If it was a quick click (duration < 250ms), toggle the panel
  if (duration < 250) {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentlyOpen =
      storeBesearch.showBottomPanel ||
      !!storeAI.activeLifeStrapID ||
      storeBesearch.hasActiveIntervention;

    if (isCurrentlyOpen) {
      // Force close by clearing all triggering states
      storeBesearch.showBottomPanel = false;
      storeAI.activeLifeStrapID = "";
      storeAI.activeContractKey = "";
      storeBesearch.selectedIntervention = null;
      storeBesearch.showBesearchDetail = false;
      // Set height to collapsed state (60px)
      storeBesearch.bottomHeight = 60;
      emit("update:height", 60);
      emit("update:isOpen", false);
    } else {
      // Open the panel
      storeBesearch.showBottomPanel = true;
      updatePanelHeight();
      emit("update:isOpen", true);
    }
  }
};
</script>

<style scoped>
.bottom-panel {
  /* ... positional styles ... */

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
  padding: 20px;
}

.lens-section {
  margin-bottom: 16px;
}

.lens-section.collapsed {
  margin-bottom: 8px;
}

.lens-collapsed-bar {
  background: rgba(158, 113, 231, 0.2);
  border: 1px solid rgba(158, 113, 231, 0.4);
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  display: block;
  width: 80%;
  margin: 0 auto;
  text-align: center;
}

.lens-collapsed-bar:hover {
  background: rgba(158, 113, 231, 0.3);
}

.lens-label {
  color: #6b4fb8;
  font-weight: 500;
  font-size: 14px;
}
</style>
