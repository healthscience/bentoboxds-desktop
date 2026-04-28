<template>
  <div
    class="prime-interface"
    :class="[
      activeWorld,
      {
        'is-zen': isInitialState,
        'is-interplay': orbitStore.isInterplayActive,
      },
    ]"
    :style="dynamicGridStyle"
    @mousemove="handleGlobalDrag"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
  >
    <!-- Background Layers -->
    <div class="world-surface"></div>
    <div class="heli-pulse"></div>
    <!-- World auras for active instruments -->
    <div
      v-for="(pos, id) in orbitStore.tools"
      :key="'aura-' + id"
      class="aura-layer instrument-aura"
      :style="{
        opacity: orbitStore.isInterplayActive ? 0.6 : 0,
        left: pos.x + '%',
        top: pos.y + '%',
        transform: 'translate(-50%, -50%)',
      }"
    ></div>

    <LeftPanel
      v-model="activeWorld"
      class="left-rail-area"
      :width="panelWidth"
      :isOpen="isLifeToolsOpen"
      @update:width="(val) => (panelWidth = val)"
      @update:isOpen="(val) => (isLifeToolsOpen = val)"
      @startDrag="startDraggingLeft"
      @start-drawing="handleStartDrawing"
      @start-tagging="handleStartTagging"
      @save-cue="handleSaveCue"
    />

    <main class="orbit-stage">
      <div class="bento-layout-engine" :style="bentoLayoutStyle">
        <!-- TOP ROW -->
        <div class="bento-row top-row" :style="topRowStyle">
          <!-- NOW ME (Top Left) -->
          <div
            v-if="activeQuadrants.includes('now-me')"
            class="bento-cell now-me-cell"
          >
            <OrbitHUD v-if="!isInitialState" />

            <div class="interface-layer">
              <transition name="sov-fade">
                <LaunchpadStack
                  v-if="isInitialState || isDemoMode"
                  :mode="currentMode"
                  :extractedData="mappedLenses"
                  @launch="launchDemo"
                  @reset="exitToZen"
                />
              </transition>
            </div>

            <WorldCanvas
              ref="worldCanvasRef"
              class="world-canvas-layer"
              :class="{ 'besearch-active': isBesearchMode }"
              :activeWorld="activeWorld"
              :showTools="!isInitialState"
            />

            <div class="fuse-container">
              <BesearchFuse
                v-if="!isInitialState && storeAI.currentMode === 'besearch'"
              />
            </div>
          </div>

          <!-- Vertical Divider for Top Row -->
          <div
            v-if="
              activeQuadrants.includes('now-me') &&
              activeQuadrants.includes('future-me')
            "
            class="bento-divider vertical"
            @mousedown="startBentoDividerDrag"
          ></div>

          <!-- FUTURE ME (Top Right) -->
          <div
            v-if="activeQuadrants.includes('future-me')"
            class="bento-cell future-me-cell"
          >
            <div class="future-indicator">FUTURE ME</div>
            <OrbitHUD v-if="!isInitialState" />

            <div class="interface-layer">
              <transition name="sov-fade">
                <LaunchpadStack
                  v-if="isInitialState || isExtracting || isDemoMode"
                  :mode="currentMode"
                  :extractedData="mappedLenses"
                  @launch="launchDemo"
                  @reset="exitToZen"
                />
              </transition>
            </div>

            <WorldCanvas
              class="world-canvas-layer"
              :activeWorld="activeWorld"
              :showTools="!isInitialState"
            />

            <div class="fuse-container">
              <BesearchFuse
                v-if="!isInitialState && storeAI.currentMode === 'besearch'"
              />
            </div>
          </div>
        </div>

        <!-- Horizontal Divider -->
        <div
          v-if="
            (activeQuadrants.includes('now-me') ||
              activeQuadrants.includes('future-me')) &&
            (activeQuadrants.includes('now-us') ||
              activeQuadrants.includes('future-us'))
          "
          class="bento-divider horizontal"
          @mousedown="startBentoVerticalDividerDrag"
        ></div>

        <!-- BOTTOM ROW -->
        <div class="bento-row bottom-row" :style="bottomRowStyle">
          <!-- NOW US (Bottom Left) -->
          <div
            v-if="activeQuadrants.includes('now-us')"
            class="bento-cell now-us-cell"
          >
            <div class="future-indicator us">NOW US</div>
            <OrbitHUD v-if="!isInitialState" />

            <div class="interface-layer">
              <transition name="sov-fade">
                <LaunchpadStack
                  v-if="isInitialState || isExtracting || isDemoMode"
                  :mode="currentMode"
                  :extractedData="mappedLenses"
                  @launch="launchDemo"
                  @reset="exitToZen"
                />
              </transition>
            </div>

            <WorldCanvas
              class="world-canvas-layer"
              :activeWorld="activeWorld"
              :showTools="!isInitialState"
            />

            <div class="fuse-container">
              <BesearchFuse
                v-if="!isInitialState && storeAI.currentMode === 'besearch'"
              />
            </div>
          </div>

          <!-- Vertical Divider for Bottom Row -->
          <div
            v-if="
              activeQuadrants.includes('now-us') &&
              activeQuadrants.includes('future-us')
            "
            class="bento-divider vertical"
            @mousedown="startBentoDividerDrag"
          ></div>

          <!-- FUTURE US (Bottom Right) -->
          <div
            v-if="activeQuadrants.includes('future-us')"
            class="bento-cell future-us-cell"
          >
            <div class="future-indicator us">FUTURE US</div>
            <OrbitHUD v-if="!isInitialState" />

            <div class="interface-layer">
              <transition name="sov-fade">
                <LaunchpadStack
                  v-if="isInitialState || isExtracting || isDemoMode"
                  :mode="currentMode"
                  :extractedData="mappedLenses"
                  @launch="launchDemo"
                  @reset="exitToZen"
                />
              </transition>
            </div>

            <WorldCanvas
              class="world-canvas-layer"
              :activeWorld="activeWorld"
              :showTools="!isInitialState"
            />

            <div class="fuse-container">
              <BesearchFuse
                v-if="!isInitialState && storeAI.currentMode === 'besearch'"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <RightPanel
      v-model:mode="rightPanelMode"
      class="right-panel-area"
      :width="chatWidth"
      :isOpen="isChatOpen"
      :isInitialState="isInitialState"
      :isInterplayActive="orbitStore.isInterplayActive"
      :data="extractedData"
      @update:isOpen="(val) => (isChatOpen = val)"
      @update:width="(val) => (chatWidth = val)"
      @startDrag="startChatDrag"
    />

    <BottomPanel
      class="bottom-panel-area"
      :height="bottomHeight"
      :isOpen="isBottomOpen"
      :isDragging="draggingMode === 'bottom'"
      @update:height="(val) => (bottomHeight = val)"
      @update:isOpen="(val) => (isBottomOpen = val)"
      @startDrag="startBottomDrag"
    />

    <!-- Global Return to Besearch/Sculpting Buttons - Top Middle -->
    <div
      v-if="
        storeBesearch.wasBesearchCycleOpen ||
        storeBesearch.wasSculptingLayerOpen
      "
      class="global-return-overlay"
    >
      <button
        v-if="storeBesearch.wasBesearchCycleOpen"
        class="return-btn cycle-btn"
        @click="storeBesearch.restoreBesearchCycle()"
      >
        <span class="icon">🔄</span>
        <span class="text">Return to Besearch Cycle</span>
      </button>

      <button
        v-if="storeBesearch.wasSculptingLayerOpen"
        class="return-btn sculpting-btn"
        @click="storeBesearch.restoreSculptingLab()"
      >
        <span class="icon">🛠️</span>
        <span class="text">Return to Sculpting Lab</span>
      </button>
    </div>

    <BesearchLayer />

    <SculptingLayer />

    <div
      class="bento-box-container"
      :class="{ 'docked-position': isBentoDocked }"
    >
      <BentoBox
        v-model:activeQuadrants="activeQuadrants"
        :docked="isBentoDocked"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { useChatStore } from "@/stores/chatStore.js";
import { besearchStore } from "@/stores/besearchStore.js";
import { libraryStore } from "@/stores/libraryStore.js";
import { diaryStore } from "@/stores/diaryStore.js";

// Sub-components
import LeftPanel from "@/components/orbit/parts/LeftPanel.vue";
import RightPanel from "@/components/orbit/parts/RightPanel.vue";
import BottomPanel from "@/components/orbit/parts/BottomPanel.vue";
import WorldCanvas from "@/components/orbit/parts/WorldCanvas.vue";
import OrbitHUD from "@/components/orbit/parts/OrbitHUD.vue";
import LaunchpadStack from "@/components/orbit/parts/LaunchpadStack.vue";
import BesearchFuse from "@/components/orbit/besearch/BesearchFuse.vue";
import BesearchLayer from "@/components/orbit/besearch/besearchLayer.vue";
import SculptingLayer from "@/components/orbit/sculpting/sculptingLayer.vue";
import BentoBox from "@/components/orbit/parts/BentoBox.vue";

import { useOrbitStore } from "@/stores/orbitStore.js";

const storeDiary = diaryStore();
const storeLibrary = libraryStore();
const storeAI = aiInterfaceStore();
const storeChat = useChatStore();
const storeBesearch = besearchStore();
const orbitStore = useOrbitStore();
const worldCanvasRef = ref(null);

/* BentoBox State */
const activeQuadrants = ref(["now-me"]);
const bentoSplitRatio = ref(50); // Percentage for vertical split
const bentoVerticalSplitRatio = ref(50); // Percentage for horizontal split
const isDraggingBentoDivider = ref(false);
const isDraggingBentoVerticalDivider = ref(false);

/* computed */
const extractedData = computed(() => storeAI.digestInput);
const activeWorld = computed({
  get: () => storeAI.activeWorld,
  set: (val) => (storeAI.activeWorld = val),
});

const isBottomOpen = computed({
  get: () => {
    return (
      storeBesearch.showBottomPanel ||
      !!storeAI.activeLifeStrapID ||
      storeBesearch.hasActiveIntervention
    );
  },
  set: (val) => {
    storeBesearch.showBottomPanel = val;
  },
});

watch(
  isBottomOpen,
  (val) => {
    orbitStore.isInterplayActive = val;
    if (val) {
      // Set to 82vh when interplay is active
      storeBesearch.bottomHeight = window.innerHeight * 0.82;
    }
  },
  { immediate: true },
);

const bottomHeight = computed(() => {
  return storeBesearch.bottomHeight;
});

// Watch for store changes to trigger the "Extracting" state automatically
watch(
  () => storeAI.digestInput,
  (newData) => {
    if (newData && currentMode.value === "zen") {
      // handleUserInput();
    }
  },
  { deep: true },
);

/* panel settins */
const isLifeToolsOpen = ref(false);
const rightPanelMode = ref("chat");

const panelWidth = ref(30);
const draggingMode = ref(null);

// 1. Add 'extracting' to the modes
// const currentMode = ref('zen'); // 'zen', 'demo', 'extracting', or 'active'

/* computed */
const isInitialState = computed(() => {
  return storeAI.currentMode === "zen";
});

const isDemoMode = computed(() => storeAI.currentMode === "demo");
const isExtracting = computed(() => storeAI.currentMode === "extracting");
const currentMode = computed(() => storeAI.currentMode);

const isChatOpen = computed({
  get: () => storeChat.isChatOpen,
  set: (val) => (storeChat.isChatOpen = val),
});

const isBentoDocked = computed(() => {
  return isChatOpen.value || storeAI.showBbNexus;
});

const chatWidth = computed({
  get: () => storeChat.chatWidth,
  set: (val) => (storeChat.chatWidth = val),
});

/* methods */
const handleSaveCue = (cueId) => {
  if (worldCanvasRef.value) {
    worldCanvasRef.value.saveCue(cueId);
  }
};

const handleStartDrawing = () => {
  if (worldCanvasRef.value) {
    worldCanvasRef.value.startDrawing();
  }
};

const handleStartTagging = () => {
  if (worldCanvasRef.value) {
    worldCanvasRef.value.startTagging();
  }
};

const launchDemo = (type) => {
  storeAI.currentMode = "demo"; // This triggers the "Three Cs" in Launchpad
  storeAI.activeWorld = type;

  // Also push the demo text into the store so the Lenses have data
  if (type === "oribt") {
    storeAI.beebeeDigest("I want to swim 400m in 10 orbits...", true);
  } else if (type === "body") {
    storeDiary.zoomDepth = 1;
    storeBesearch.setNexusWorld("body");
  } else if (type === "earth") {
    storeBesearch.setNexusWorld("earth");
    storeDiary.zoomDepth = 0;
    storeDiary.currentLayer = "terrain";
  } else if (type === "daisy") {
    storeAI.activeWorld = "earth";
    storeDiary.zoomDepth = 2;
  }
  // open the lens ie. bottom panel
  storeBesearch.showBottomPanel = true;
};

// 3. Update the Reset handler
const exitToZen = () => {
  storeBesearch.showBottomPanel = false;
  storeAI.currentMode = "zen";
  storeAI.activeWorld = "orbit";
  storeChat.chatWidth = 10;
  storeChat.isChatOpen = false;
  panelWidth.value = 30;
  // Clear the store input if needed
  storeAI.digestInput = null;
};

// Inside PrimeInterface.vue <script setup>
const extractionLenses = computed(() => {
  return {
    capacity: storeAI.digestInput?.constraints
      ? [storeAI.digestInput.constraints]
      : [],
    coherence: storeAI.digestInput?.content
      ? [storeAI.digestInput.content]
      : [],
    context: storeAI.digestInput?.context ? [storeAI.digestInput.context] : [],
  };
});

// Map the 3 Cs to the Lenses
const mappedLenses = computed(() => {
  const input = storeAI.digestInput;
  if (!input) return { capacity: [], coherence: [], context: [], heli: [] };

  // New pillars structure
  if (input.pillars) {
    return {
      capacity: input.pillars.capacity || [],
      coherence: input.pillars.coherence ? [input.pillars.coherence] : [],
      context: input.pillars.context || [],
      heli: input.pillars.heli || [],
    };
  }

  // Legacy structure
  return {
    capacity: input.capacity || [],
    coherence: input.coherence || [],
    context: input.context || [],
    heli: [],
  };
});

/* drag handlers */
const startDraggingLeft = () => {
  draggingMode.value = "left";
  document.body.style.cursor = "ew-resize";
};
const startChatDrag = () => {
  draggingMode.value = "right";
  document.body.style.cursor = "ew-resize";
};
const startBottomDrag = () => {
  draggingMode.value = "bottom";
  document.body.style.cursor = "ns-resize";
};

const startBentoDividerDrag = () => {
  isDraggingBentoDivider.value = true;
  document.body.style.cursor = "ew-resize";
};

const startBentoVerticalDividerDrag = () => {
  isDraggingBentoVerticalDivider.value = true;
  document.body.style.cursor = "ns-resize";
};

const handleGlobalDrag = (e) => {
  if (orbitStore.draggingToolId) {
    document.documentElement.style.setProperty("--aura-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--aura-y", `${e.clientY}px`);
  }

  if (isDraggingBentoDivider.value) {
    const stage = document.querySelector(".orbit-stage");
    if (stage) {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      bentoSplitRatio.value = Math.max(
        10,
        Math.min(90, (x / rect.width) * 100),
      );
    }
    return;
  }
  if (isDraggingBentoVerticalDivider.value) {
    const stage = document.querySelector(".orbit-stage");
    if (stage) {
      const rect = stage.getBoundingClientRect();
      const y = e.clientY - rect.top;
      bentoVerticalSplitRatio.value = Math.max(
        10,
        Math.min(90, (y / rect.height) * 100),
      );
    }
    return;
  }
  if (!draggingMode.value) return;
  if (draggingMode.value === "left") {
    panelWidth.value = Math.max(
      30,
      Math.min(e.clientX, window.innerWidth * 0.4),
    );
    isLifeToolsOpen.value = panelWidth.value > 150;
  } else if (draggingMode.value === "right") {
    const newWidth = window.innerWidth - e.clientX;
    storeChat.chatWidth = Math.max(
      0,
      Math.min(newWidth, window.innerWidth * 0.5),
    );
    storeChat.isChatOpen = storeChat.chatWidth > 150;
  } else if (draggingMode.value === "bottom") {
    const newHeight = window.innerHeight - e.clientY;
    storeBesearch.bottomHeight = Math.max(
      12,
      Math.min(newHeight, window.innerHeight * 0.8),
    );
    storeBesearch.showBottomPanel = storeBesearch.bottomHeight > 100;
  }
};

const stopDragging = () => {
  draggingMode.value = null;
  isDraggingBentoDivider.value = false;
  isDraggingBentoVerticalDivider.value = false;
  document.body.style.cursor = "default";
};

const dynamicGridStyle = computed(() => ({
  gridTemplateColumns: "1fr",
  gridTemplateRows: "1fr",
  gridTemplateAreas: '"stage"',
}));

const bentoLayoutStyle = computed(() => {
  const hasTop =
    activeQuadrants.value.includes("now-me") ||
    activeQuadrants.value.includes("future-me");
  const hasBottom =
    activeQuadrants.value.includes("now-us") ||
    activeQuadrants.value.includes("future-us");

  if (hasTop && hasBottom) {
    return {
      display: "grid",
      gridTemplateRows: `${bentoVerticalSplitRatio.value}% 4px 1fr`,
      height: "100%",
      width: "100%",
    };
  }
  return {
    display: "block",
    height: "100%",
    width: "100%",
  };
});

const topRowStyle = computed(() => {
  const hasNowMe = activeQuadrants.value.includes("now-me");
  const hasFutureMe = activeQuadrants.value.includes("future-me");
  if (hasNowMe && hasFutureMe) {
    return {
      display: "grid",
      gridTemplateColumns: `${bentoSplitRatio.value}% 4px 1fr`,
      height: "100%",
    };
  }
  return { height: "100%" };
});

const bottomRowStyle = computed(() => {
  const hasNowUs = activeQuadrants.value.includes("now-us");
  const hasFutureUs = activeQuadrants.value.includes("future-us");
  if (hasNowUs && hasFutureUs) {
    return {
      display: "grid",
      gridTemplateColumns: `${bentoSplitRatio.value}% 4px 1fr`,
      height: "100%",
    };
  }
  return { height: "100%" };
});
const isBesearchMode = computed(() => storeAI.currentMode === "besearch");
</script>

<style scoped>
.bento-box-container {
  position: absolute;
  bottom: 80px;
  right: 20px;
  z-index: 2000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-box-container.docked-position {
  bottom: 0px;
  right: 20px;
  width: v-bind('isChatOpen ? chatWidth + "px" : "320px"');
  padding: 0 10px 10px 10px;
  background: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
  border-radius: 8px 8px 0 0;
}

.bento-box-container.docked-position :deep(.bento-frame) {
  width: 100%;
  height: 40px;
  border-radius: 0;
  backdrop-filter: none;
  background: transparent;
}

.bento-layout-engine {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.bento-cell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: 120px 1fr 80px;
  background-color: transparent;
}

.bento-cell .interface-layer {
  grid-row: 2;
  z-index: 300;
  align-self: end;
  padding-bottom: 0px;
}

.bento-cell .world-canvas-layer {
  grid-row: 1 / span 3;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.bento-cell .world-canvas-layer.besearch-active {
  z-index: 2000;
}

.bento-cell .fuse-container {
  grid-row: 3;
  z-index: 500;
}

.bento-divider {
  background: rgba(255, 255, 255, 0.2);
  z-index: 1000;
  transition: background 0.2s;
}

.bento-divider:hover {
  background: rgba(255, 255, 255, 0.5);
}

.bento-divider.vertical {
  width: 4px;
  cursor: ew-resize;
  height: 100%;
}

.bento-divider.horizontal {
  height: 4px;
  cursor: ns-resize;
  width: 100%;
}

.future-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(75, 0, 130, 0.6);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  z-index: 1000;
  pointer-events: none;
}

.future-indicator.us {
  background: rgba(255, 191, 0, 0.6);
  color: #333;
}

.bento-row {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.prime-interface {
  display: block;
  width: 100vw;
  height: calc(100vh - var(--header-height, 60px));
  overflow: hidden;
  position: relative;
  background-color: var(--color-background-soft);
  z-index: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  /* THE COLOR PALETTE */
  --bg-base: var(--color-background-soft);
  --grid-minor: var(--color-border);
  --grid-major: var(--color-border);
  --aura-color: #0078ff;
  --heli-pulse-speed: 4s;

  --aura-x: 50%;
  --aura-y: 50%;
  transition: all 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* THE LOOM (Background Components) */
.world-surface,
.heli-pulse,
.aura-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 1. THE WORLD SURFACE */
.world-surface {
  z-index: 1;
  background-image:
    radial-gradient(rgba(200, 230, 255, 0.2) 2px, transparent 2px),
    linear-gradient(rgba(200, 230, 255, 0.05) 1.5px, transparent 1.5px),
    linear-gradient(90deg, rgba(200, 230, 255, 0.05) 1.5px, transparent 1.5px);
  background-size:
    30px 30px,
    150px 150px,
    150px 150px;
  background-position: center center;
  transition: all 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.is-interplay .world-surface {
  background-color: rgba(200, 230, 255, 0.05);
  backdrop-filter: blur(25px) saturate(180%);
}

/* 2. THE HELI-PULSE */
.heli-pulse {
  z-index: 2;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.8) 0%,
    transparent 80%
  );
  animation: pulse var(--heli-pulse-speed) infinite ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

/* 3. THE TIGHT AURA (Awareness Layer) */
.aura-layer {
  position: absolute;
  width: 400px;
  height: 400px;
  z-index: 3;
  background: radial-gradient(
    circle,
    var(--aura-color) 0%,
    rgba(0, 120, 255, 0.05) 60%,
    transparent 100%
  );
  mix-blend-mode: color-dodge;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.5s ease,
    transform 0.1s linear;
}

.aura-layer.instrument-aura {
  transition:
    opacity 0.8s ease,
    left 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
    top 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.left-rail-area {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1200;
}

.right-panel-area {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 1200;
}

.bottom-panel-area {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1200;
}

.orbit-stage {
  grid-area: stage;
  height: 100%;
  max-height: calc(100vh - var(--header-height, 60px));
  position: relative;
  z-index: 100;
  overflow: hidden;
}

.fuse-container {
  grid-row: 3;
  height: 60px;
  width: 100%;
  z-index: 500;
}

.interface-layer {
  grid-row: 2;
  z-index: 400;
  display: grid;
  place-items: center;
  align-items: end;
  pointer-events: none;
  padding-bottom: 0px;
}
.interface-layer > * {
  pointer-events: auto;
}

.extraction-lens-wrap {
  display: grid;
  grid-template-rows: auto auto;
  gap: 40px;
  width: 90%;
  max-width: 1000px;
  pointer-events: auto;
}

.extraction-footer-grid {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  align-items: center;
  gap: 80px;
  padding-top: 20px;
}

.manifest-nudge {
  font-weight: 800;
  color: #38205f;
  letter-spacing: 0.05em;
  animation: pulse-right 2s infinite ease-in-out;
}

@keyframes pulse-right {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.7;
  }
  50% {
    transform: translateX(15px);
    opacity: 1;
  }
}

.global-return-overlay {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  gap: 20px;
  pointer-events: auto;
}

.global-return-overlay .return-btn {
  background: rgba(30, 41, 59, 0.95);
  border: 2px solid #00ffcc;
  color: #00ffcc;
  padding: 12px 28px;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.global-return-overlay .return-btn:hover {
  background: #00ffcc;
  color: #1e293b;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 50px rgba(0, 255, 204, 0.5);
}

.global-return-overlay .return-btn.cycle-btn {
  border-color: #3b82f6;
  color: #3b82f6;
}

.global-return-overlay .return-btn.cycle-btn:hover {
  background: #3b82f6;
  color: #ffffff;
  box-shadow: 0 15px 50px rgba(59, 130, 246, 0.5);
}

.global-return-overlay .icon {
  font-size: 1.2rem;
}
</style>
