<template>
  <footer class="status-fuse">
    <div class="fuse-grid">
      <div
        v-for="(stage, key) in stages"
        :key="key"
        class="fuse-segment"
        :class="status[key] ? 'fuse-active' : 'fuse-hollow'"
        @click="$emit('switch-world', stage.worldTarget)"
      >
        <div class="segment-content">
          <span class="label">{{ stage.label }}</span>
          <span class="status-indicator">{{ stage.subText }}</span>
        </div>
        <div v-if="status[key]" class="glow-line"></div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { besearchStore } from "@/stores/besearchStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";

const storeBesearch = besearchStore();
const storeAI = aiInterfaceStore();

defineProps({
  status: {
    type: Object,
    default: () => ({
      context: false,
      research: false,
      models: false,
      emulation: false,
    }),
  },
  cueCount: { type: Number, default: 0 },
});

const stages = {
  context: {
    label: "Context",
    subText: "EARTH / GENESIS",
    worldTarget: "earth",
  },
  research: { label: "Research", subText: "CUE SPACE", worldTarget: "orbit" },
  models: { label: "Models", subText: "BODY / BIO-LOGIC", worldTarget: "body" },
  emulation: { label: "Emulation", subText: "RESONANCE", worldTarget: "orbit" },
};

const handleReturnToSculpting = () => {
  storeAI.currentMode = "orbit"; // Return to normal orbit mode
  storeBesearch.isSculptingLayerOpen = true;
  storeBesearch.wasSculptingLayerOpen = false;
};

const handleReturnToCycle = () => {
  storeAI.currentMode = "orbit"; // Return to normal orbit mode
  storeBesearch.isBesearchLayerOpen = true;
  storeBesearch.wasBesearchCycleOpen = false;

  // Restore lens and bottom panel state
  storeAI.showLifestapLens = false;
  storeBesearch.showBottomPanel = true;
  storeBesearch.bottomHeight = window.innerHeight * 0.82;
};
</script>

<style scoped>
.status-fuse {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  padding: 6px;
  height: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.fuse-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  width: 100%;
  height: 100%;
}

.fuse-segment {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 4px;
}

.fuse-hollow {
  background: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.fuse-active {
  background: #1e293b;
  color: #ffffff;
  border: 1px solid rgba(59, 130, 246, 0.6);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 0 8px rgba(59, 130, 246, 0.2);
}

.glow-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #3b82f6;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
  border-radius: 0 0 4px 4px;
}

.segment-content {
  text-align: center;
  z-index: 2;
  padding: 4px;
}

.label {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.status-indicator {
  display: block;
  font-size: 0.55rem;
  margin-top: 1px;
  opacity: 0.8;
  font-family: "Inter", sans-serif;
  font-weight: 600;
}

.fuse-segment:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.fuse-hollow:hover {
  background: #ffffff;
}

.fuse-active:hover {
  background: #0f172a;
}
</style>
