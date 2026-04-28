<template>
  <div class="world-canvas-container" :class="currentActiveWorld">
    <section class="world-layer-stack">
      <!-- orbit of cues and besearch -->
      <div v-if="currentActiveWorld === 'orbit'" class="world-view orbit-grid">
        <OrbitView />
      </div>
      <!-- human body -->
      <div v-if="currentActiveWorld === 'body'" class="world-view body-grid">
        <HumanWorld ref="humanWorldRef" />
      </div>
      <!-- earth nature & environment -->
      <div v-if="currentActiveWorld === 'earth'" class="world-view earth-grid">
        <EarthEnvironment ref="earthEnvironmentRef" />
      </div>

      <!-- Besearch Knowledge Layer -->
      <transition name="slide-left">
        <div v-if="showBesearch" class="world-view besearch-layer">
          <BesearchCanvas />
        </div>
      </transition>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import OrbitView from "@/components/orbit/worlds/OrbitView.vue";
import HumanWorld from "@/components/orbit/worlds/Cues-BodyWorld.vue";
import EarthEnvironment from "@/components/orbit/worlds/EarthEnvironment.vue";
import BesearchCanvas from "@/components/besearch/besearchCanvas.vue";

import { aiInterfaceStore } from "@/stores/aiInterface.js";

const storeAI = aiInterfaceStore();
const humanWorldRef = ref(null);
const earthEnvironmentRef = ref(null);

const props = defineProps({
  tools: Object,
  draggingId: String,
  activeWorld: String, // New Prop
});

/* computed */
const currentActiveWorld = computed(() => {
  return props.activeWorld || storeAI.activeWorld;
});

const showBesearch = computed(() => {
  return storeAI.currentMode === "besearch";
});

const saveCue = (cueId) => {
  if (humanWorldRef.value) {
    humanWorldRef.value.saveCueLocation(cueId);
  }
};

const startDrawing = () => {
  if (storeAI.activeWorld === "earth" && earthEnvironmentRef.value) {
    earthEnvironmentRef.value.startDrawing();
  }
};

const startTagging = () => {
  if (storeAI.activeWorld === "earth" && earthEnvironmentRef.value) {
    earthEnvironmentRef.value.startTagging();
  }
};

defineExpose({ saveCue, startDrawing, startTagging });
</script>

<style scoped>
/* THE STACKING CONTEXT */
.world-canvas-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  height: 100%;
  width: 100%;
  overflow: hidden;
  min-height: 0;
  position: absolute;
  top: 0;
  left: 0;
}

/* Force everything into the first cell to overlap */
.world-layer-stack,
.tool-interaction-layer {
  grid-area: 1 / 1;
  display: grid;
  height: 100%;
  width: 100%;
}

/* WORLD VIEWS: Shared Layout */
.world-view {
  grid-area: 1 / 1;
  display: grid;
  transition: opacity 0.5s ease, transform 0.5s ease;
  width: 100%;
  height: 100%;
}

/* BODY WORLD: Specific Anatomy Grid */
.body-grid {
  background: transparent;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.anatomy-silhouette {
  grid-area: torso;
  opacity: 0.2;
  filter: saturate(0.5);
}

/* EARTH WORLD: Specific Geographic Grid */
.earth-grid {
  background: transparent;
  width: 100%;
  height: 100%;
}

/* TOOL LAYER */
.tool-interaction-layer {
  z-index: 10;
  pointer-events: none;
}

.tool-wrapper {
  pointer-events: auto;
  cursor: grab;
  width: fit-content;
  height: fit-content;
}

.is-dragging {
  pointer-events: auto; /* Catch moves while dragging */
}

/* Besearch Slide-left Transition */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.besearch-layer {
  z-index: 5000; /* Extremely high to debug */
  background: rgba(255, 0, 0, 0.2); /* Red tint to verify presence */
  backdrop-filter: blur(15px);
  pointer-events: auto;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
