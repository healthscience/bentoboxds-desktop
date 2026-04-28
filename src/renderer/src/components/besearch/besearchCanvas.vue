<template>
  <div
    class="besearch-stage"
    @mousemove="handleGlobalDrag"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
  >
    <div
      v-if="storeBesearch.besearchCyclesNormalized.length === 0"
      class="empty-state"
    >
      No Besearch Cycles Found. Please Create one in LifeTools.
    </div>
    <!-- BESEARCH CYCLES -->
    <div
      v-for="cycle in storeBesearch.besearchCyclesNormalized"
      :key="cycle.id"
      class="tool-grab-wrapper cycle-node"
      :class="{ dragging: draggingId === cycle.id }"
      :style="{
        left: cycle.x + '%',
        top: cycle.y + '%',
        zIndex: draggingId === cycle.id ? 2500 : 1500,
      }"
      @mousedown="startDragging($event, cycle.id, 'cycle')"
    >
      <div class="cycle-core">
        <span class="label">{{ cycle.name }}</span>
        <!-- Orbiting Icon -->
        <div class="orbit-path">
          <div class="orbiting-icon">
            <img
              src="@/assets/besearch-cycle.png"
              alt="icon"
              v-if="hasBesearchIcon"
            />
            <div class="icon-placeholder" v-else></div>
          </div>
        </div>
      </div>

      <!-- Linked Interventions Rings -->
      <div
        v-for="(link, idx) in cycle.linkedInterventions"
        :key="idx"
        class="linked-ring"
        :style="{
          width: 120 + idx * 20 + 'px',
          height: 120 + idx * 20 + 'px',
        }"
      ></div>
    </div>

    <!-- INTERVENTIONS -->
    <div
      v-for="intervention in storeBesearch.canvasState.interventions"
      :key="intervention.id"
      class="tool-grab-wrapper intervention-node"
      :class="{ dragging: draggingId === intervention.id }"
      :style="{
        left: intervention.x + '%',
        top: intervention.y + '%',
        zIndex: draggingId === intervention.id ? 2500 : 1500,
      }"
      @mousedown="startDragging($event, intervention.id, 'intervention')"
    >
      <span class="label">{{ intervention.name || "Intervention" }}</span>
      <div
        class="intervention-core"
        :style="{ backgroundColor: intervention.color || '#3b82f6' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { besearchStore } from "@/stores/besearchStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";

const storeBesearch = besearchStore();
const storeAI = aiInterfaceStore();

const draggingId = ref(null);
const draggingType = ref(null);
const hasBesearchIcon = ref(false);

/* CORE DRAG ENGINE */
const startDragging = (e, id, type) => {
  if (e.button !== 0) return;
  draggingId.value = id;
  draggingType.value = type;
  document.body.style.cursor = "grabbing";
};

const handleGlobalDrag = (e) => {
  if (!draggingId.value) return;

  const stage = document.querySelector(".besearch-stage");
  if (!stage) return;

  const bounds = stage.getBoundingClientRect();
  const x = ((e.clientX - bounds.left) / bounds.width) * 100;
  const y = ((e.clientY - bounds.top) / bounds.height) * 100;

  if (draggingType.value === "cycle") {
    storeBesearch.updateBesearchCycle(draggingId.value, { x, y });
  } else if (draggingType.value === "intervention") {
    storeBesearch.updateIntervention(draggingId.value, { x, y });
  }
};

const stopDragging = () => {
  draggingId.value = null;
  draggingType.value = null;
  document.body.style.cursor = "default";
};

onMounted(() => {
  console.log("BesearchCanvas mounted");
  hasBesearchIcon.value = true;
});
</script>

<style scoped>
.besearch-stage {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  color: #140d6b;
  font-weight: bold;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
}

.tool-grab-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: grab;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.tool-grab-wrapper:active {
  cursor: grabbing;
}

.cycle-node .cycle-core {
  width: 100px;
  height: 100px;
  background: white;
  border: 2px solid #2196f3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.2);
  position: relative;
  z-index: 2;
}

.cycle-node .label {
  font-size: 10px;
  font-weight: 800;
  color: #140d6b;
  text-align: center;
  padding: 0 5px;
}

/* Orbiting Icon Animation */
.orbit-path {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  pointer-events: none;
  animation: orbit-rotation 10s linear infinite;
}

.orbiting-icon {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.orbiting-icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.icon-placeholder {
  width: 12px;
  height: 12px;
  background: #2196f3;
  border-radius: 50%;
}

@keyframes orbit-rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Linked Rings */
.linked-ring {
  position: absolute;
  border: 1px solid rgba(33, 150, 243, 0.3);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

/* Intervention Node */
.intervention-node .intervention-core {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;
}

.intervention-node .label {
  font-size: 9px;
  text-transform: uppercase;
  font-weight: 800;
  color: #aaa;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 10px;
}

.tool-grab-wrapper.dragging {
  filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.4));
  transform: translate(-50%, -50%) scale(1.05);
}
</style>
