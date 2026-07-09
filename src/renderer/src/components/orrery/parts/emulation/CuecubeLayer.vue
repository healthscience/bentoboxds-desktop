<template>
  <div class="cuecube-layer-container">
    <div class="lens-box coherence standalone-layer">
      <header class="lens-header standalone-header">
        <div class="header-main">
          <div class="header-left">
            <span class="pulse-dot"></span>
            <h3>Emulation: CueCubes</h3>
          </div>
        </div>
      </header>
      <div class="emulation-content">
        <div class="cube-grid">
          <div v-for="i in 8" :key="i" class="cue-cube" :style="{ animationDelay: (i * 0.2) + 's' }">
            <div class="cube-face"></div>
          </div>
        </div>
        <div class="pulse-metrics">
          <div class="metric-item">
            <span class="label">Emulation Depth</span>
            <span class="value">{{ storeBesearch.canvasState.emulationDepth }}m</span>
          </div>
          <div class="metric-item">
            <span class="label">Pulse Rate</span>
            <span class="value">72 BPM</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue";
import { besearchStore } from "@/stores/besearchStore.js";
const storeBesearch = besearchStore();

const syncDepth = (val) => {
  storeBesearch.syncActiveCycleState('emulation', { depth: val });
};

watch(
  () => storeBesearch.activeCycleId,
  (newId) => {
    const cycle = storeBesearch.activeCycle;
    if (cycle && cycle.state.emulation) {
      storeBesearch.canvasState.emulationDepth = cycle.state.emulation.depth || 0;
    }
  },
  { immediate: true }
);

// Watch for depth changes (e.g. from sliders or other tools)
watch(() => storeBesearch.canvasState.emulationDepth, (newVal) => {
  syncDepth(newVal);
});
</script>

<style scoped>
.cuecube-layer-container {
  width: 100%;
  margin-top: 10px;
}

.standalone-layer {
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #a685ff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #1a202c;
}

.lens-header h3 {
  color: #a685ff !important;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.emulation-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.cube-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.cue-cube {
  width: 40px;
  height: 40px;
  background: rgba(166, 133, 255, 0.2);
  border: 1px solid #a685ff;
  border-radius: 8px;
  animation: cube-pulse 2s infinite ease-in-out;
}

@keyframes cube-pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 15px #a685ff; }
}

.pulse-metrics {
  display: flex;
  gap: 40px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-item .label {
  font-size: 0.65rem;
  font-weight: 900;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-item .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  font-family: "Space Mono", monospace;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #a685ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #a685ff;
}
</style>
