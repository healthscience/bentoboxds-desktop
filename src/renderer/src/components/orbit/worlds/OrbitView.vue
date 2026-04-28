<template>
  <div class="orbit-view">
    <Teleport to="body">
      <ProjectionHeli
        v-if="heliClockExpand"
        :contract-key="storeAI.contract_key"
        @close="handleExpand"
      />
    </Teleport>

    <!-- Resonance Expansion Teleport -->
    <Teleport to="body">
      <div
        v-if="orbitStore.expandedPulse"
        class="resonance-expanded-wrapper"
        @click.self="handlePulseExpand"
      >
        <button class="close-btn" @click="handlePulseExpand">×</button>
        <div class="expanded-pulse-container">
          <ResonancePulse />
        </div>
      </div>
    </Teleport>

    <!-- Tiny Device Expansion Teleport -->
    <Teleport to="body">
      <div
        v-if="orbitStore.expandedTinyDevice"
        class="device-expanded-wrapper"
        @click.self="handleTinyExpand"
      >
        <ExpandDevice @close="handleTinyExpand" />
      </div>
    </Teleport>

    <div class="orbit-stage">
      <OrbitHUD />

      <div
        class="world-canvas"
        :class="{ 'dragging-active': orbitStore.draggingToolId }"
        @dragover.prevent
        @drop="handleDrop"
      >
        <!-- TINY DEVICES -->
        <div
          class="tool-grab-wrapper"
          :class="{ dragging: orbitStore.draggingToolId === 'tiny' }"
          :style="{
            left: (orbitStore.tools.tiny?.x || 10) + '%',
            top: (orbitStore.tools.tiny?.y || 40) + '%',
            zIndex: orbitStore.draggingToolId === 'tiny' ? 2500 : 1500,
          }"
          @mousedown="startDragging($event, 'tiny')"
          @dblclick="handleTinyExpand"
        >
          <TinyDevice />
        </div>

        <!-- CUE-CUBES -->
        <div
          class="tool-grab-wrapper"
          :class="{ dragging: orbitStore.draggingToolId === 'cube' }"
          :style="{
            left: (orbitStore.tools.cube?.x || 10) + '%',
            top: (orbitStore.tools.cube?.y || 20) + '%',
            zIndex: orbitStore.draggingToolId === 'cube' ? 2500 : 1500,
          }"
          @mousedown="startDragging($event, 'cube')"
        >
          <span class="label">CUE-CUBES</span>
          <CubeStructure />
        </div>

        <!-- RESONANCE -->
        <div
          class="tool-grab-wrapper"
          :class="{ dragging: orbitStore.draggingToolId === 'pulse' }"
          :style="{
            left: (orbitStore.tools.pulse?.x || 50) + '%',
            top: (orbitStore.tools.pulse?.y || 40) + '%',
            zIndex: orbitStore.draggingToolId === 'pulse' ? 2500 : 1500,
          }"
          @mousedown="startDragging($event, 'pulse')"
          @dblclick="handlePulseExpand"
        >
          <span class="label">RESONANCE</span>
          <div id="pulse-state" v-if="pulseState === 'ghost'">
            <ResonancePulseghost />
          </div>
          <div v-else>
            <ResonancePulse />
          </div>
        </div>

        <!-- FILTER -->
        <div
          class="tool-grab-wrapper"
          :class="{ dragging: orbitStore.draggingToolId === 'filter' }"
          :style="{
            left: (orbitStore.tools.filter?.x || 70) + '%',
            top: (orbitStore.tools.filter?.y || 45) + '%',
            zIndex: orbitStore.draggingToolId === 'filter' ? 2500 : 1500,
          }"
          @mousedown="startDragging($event, 'filter')"
        >
          <span class="label">FILTER</span>
          <FilterContext />
        </div>

        <!-- HELI-CLOCK -->
        <div
          class="tool-grab-wrapper"
          :class="{ dragging: orbitStore.draggingToolId === 'heli' }"
          :style="{
            left: (orbitStore.tools.heli?.x || 90) + '%',
            top: (orbitStore.tools.heli?.y || 16) + '%',
            zIndex: orbitStore.draggingToolId === 'heli' ? 2500 : 1500,
          }"
          @mousedown="startDragging($event, 'heli')"
        >
          <span class="label">HELI-CLOCK</span>
          <StartClock :mini="isMini" @expand="handleExpand()" />
          <!--<span class="status"
            >COORD: {{ Math.round(orbitStore.tools.heli.x) }},{{
              Math.round(orbitStore.tools.heli.y)
            }}</span
          >-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";
import StartClock from "@/components/orbit/clock/HeliStart.vue";
import ProjectionHeli from "@/components/orbit/clock/projectionHeli.vue";
import ResonancePulse from "@/components/orbit/resonance/ResonancePulse.vue";
import ResonancePulseghost from "@/components/orbit/resonance/ResonancePulseghost.vue";
import CubeStructure from "@/components/orbit/cueCude/cubeStructure.vue";
import FilterContext from "@/components/orbit/filter/contextFilter.vue";
import OrbitHUD from "@/components/orbit/parts/OrbitHUD.vue";
import TinyDevice from "@/components/orbit/devices/tinyDevice.vue";
import ExpandDevice from "@/components/orbit/devices/expandDevice.vue";

import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { useOrbitStore } from "@/stores/orbitStore.js";
import { diaryStore } from "@/stores/diaryStore.js";

const storeAI = aiInterfaceStore();
const orbitStore = useOrbitStore();
const storeDiary = diaryStore();

const props = defineProps({
  mini: { type: Boolean, default: false },
});

const isMini = computed(() => props.mini || !heliClockExpand.value);

/* Computed Logic */
const pulseState = computed(() => {
  if (storeAI.currentMode === "zen") {
    return "ghost";
  } else {
    return "alive";
  }
});

const heliClockExpand = computed(() => orbitStore.expandedHeliClock);
const extractedData = computed(() => storeAI.extractedData);

/* methods*/
const handleExpand = () => {
  orbitStore.expandedHeliClock = !orbitStore.expandedHeliClock;
  if (heliClockExpand.value === true) {
    storeAI.currentMode = "projecting";
    storeAI.chatAttention = "future-timeline";
  } else {
    storeAI.currentMode = "zen";
  }
};

const handlePulseExpand = () => {
  orbitStore.expandedPulse = !orbitStore.expandedPulse;
  if (orbitStore.expandedPulse) {
    storeAI.currentMode = "projecting";
  } else {
    storeAI.currentMode = "zen";
  }
};

const handleTinyExpand = () => {
  orbitStore.toggleTinyExpand();
  if (orbitStore.expandedTinyDevice) {
    storeAI.currentMode = "projecting";
  } else {
    storeAI.currentMode = "zen";
  }
};

/* CORE DRAG ENGINE */
const handleGlobalDrag = (e) => {
  if (orbitStore.draggingToolId) {
    document.documentElement.style.setProperty("--aura-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--aura-y", `${e.clientY}px`);

    const stage = document.querySelector(".orbit-stage");
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    orbitStore.updatePosition(orbitStore.draggingToolId, x, y);
  }
};

const startDragging = (e, id) => {
  if (e.button !== 0) return; // Only left-click starts dragging
  orbitStore.startDragging(id);
  window.addEventListener("mousemove", handleGlobalDrag);
  window.addEventListener("mouseup", stopDragging);
};

const stopDragging = () => {
  orbitStore.stopDragging();
  window.removeEventListener("mousemove", handleGlobalDrag);
  window.removeEventListener("mouseup", stopDragging);
};

const handleDrop = (e) => {
  const id = e.dataTransfer.getData("instrumentId");
  if (!id) return;

  const stage = document.querySelector(".orbit-stage");
  if (!stage) return;
  const bounds = stage.getBoundingClientRect();
  const x = ((e.clientX - bounds.left) / bounds.width) * 100;
  const y = ((e.clientY - bounds.top) / bounds.height) * 100;

  orbitStore.addInstrument(id, x, y);
};

onUnmounted(() => {
  window.removeEventListener("mousemove", handleGlobalDrag);
  window.removeEventListener("mouseup", stopDragging);
});
</script>

<style scoped>
.orbit-view {
  width: 100%;
  height: 100%;
  position: relative;
}

.orbit-stage {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.world-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: transparent;
  background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: center;
  transition: background-color 0.5s ease;
}

.static-cube-nav {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 200;
}

.tool-grab-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 0.1s ease-out, background-color 0.5s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  min-width: 150px;
  min-height: 150px;
  background-color: var(--color-background-soft);
  border-radius: 50%;
}

.tool-grab-wrapper:active {
  cursor: grabbing;
  box-shadow: 0 0 40px 20px rgba(0, 120, 255, 0.15);
  background: radial-gradient(
    circle,
    rgba(0, 120, 255, 0.08) 0%,
    transparent 70%
  );
}

.label {
  font-size: 9px;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--color-text);
  opacity: 0.6;
  letter-spacing: 2px;
  margin-bottom: 8px;
  pointer-events: none;
  background: var(--color-background-mute);
  padding: 2px 8px;
  border-radius: 10px;
  backdrop-filter: blur(4px);
}

.status {
  margin-top: 8px;
  font-size: 10px;
  color: var(--aura-color, #0078ff);
  font-family: monospace;
  pointer-events: none;
  background: var(--color-background-mute);
  padding: 2px 8px;
  border-radius: 10px;
  backdrop-filter: blur(4px);
}

.tool-grab-wrapper.dragging {
  /* Dynamic shading/glow around the instrument during drag */
  filter: drop-shadow(0 0 15px rgba(0, 120, 255, 0.4));
  background: radial-gradient(
    circle,
    rgba(0, 120, 255, 0.1) 0%,
    transparent 80%
  );
}

.dragging-active .tool-grab-wrapper {
  pointer-events: none;
}

.dragging-active .tool-grab-wrapper:has(:active) {
  pointer-events: auto;
}

/* Expansion Styles */
.resonance-expanded-wrapper,
.device-expanded-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
}

.expanded-pulse-container {
  transform: scale(2.5);
}

.close-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #1e293b;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 10000;
}

.close-btn:hover {
  transform: scale(1.1);
  background: #f1f5f9;
}
</style>
