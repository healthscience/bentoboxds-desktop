<template>
  <div class="bento-instruments">
    <div
      v-for="instrument in availableInstruments"
      :key="instrument.id"
      class="instrument-item"
      :class="{ active: isInstrumentActive(instrument.id) }"
      draggable="true"
      @dragstart="handleDragStart($event, instrument.id)"
    >
      <div class="instrument-info">
        <span class="instrument-icon">{{ instrument.icon }}</span>
        <div class="instrument-details">
          <span class="instrument-name">{{ instrument.name }}</span>
          <span
            class="instrument-status"
            v-if="isInstrumentActive(instrument.id)"
          >
            Active
          </span>
        </div>
      </div>
      <button
        class="add-btn"
        @click="toggleInstrument(instrument.id)"
        :title="
          isInstrumentActive(instrument.id)
            ? 'Remove from world'
            : 'Add to world'
        "
      >
        {{ isInstrumentActive(instrument.id) ? "−" : "+" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useOrbitStore } from "@/stores/orbitStore.js";

const orbitStore = useOrbitStore();

const availableInstruments = [
  {
    id: "heli",
    name: "Heli Clock",
    icon: "🕒",
    description: "Time-based projection",
  },
  {
    id: "pulse",
    name: "Resonance Pulse",
    icon: "💓",
    description: "Vibration and resonance",
  },
  {
    id: "filter",
    name: "Filter Context",
    icon: "⚗️",
    description: "Contextual filtering",
  },
  {
    id: "cube",
    name: "Cue Cube",
    icon: "🧊",
    description: "Data storage cube",
  },
  { id: "tiny", name: "Tiny Devices", icon: "📱", description: "Data sources" },
];

const isInstrumentActive = (id) => {
  return orbitStore.isInstrumentActive(id);
};

const toggleInstrument = (id) => {
  if (orbitStore.isInstrumentActive(id)) {
    orbitStore.toggleInstrument(id);
  } else {
    // Add to the left-hand side (x=10, y=50)
    orbitStore.addInstrument(id, 10, 50);
  }
};

const handleDragStart = (event, id) => {
  event.dataTransfer.setData("instrumentId", id);
  event.dataTransfer.effectAllowed = "move";
  // We can also trigger the store's drag start if we want immediate feedback
  // orbitStore.startDragging(id);
};
</script>

<style scoped>
.bento-instruments {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.instrument-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: grab;
}

.instrument-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.instrument-item.active {
  border-color: #4a6fa5;
  background: rgba(74, 111, 165, 0.1);
}

.instrument-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.instrument-icon {
  font-size: 20px;
}

.instrument-details {
  display: flex;
  flex-direction: column;
}

.instrument-name {
  font-size: 14px;
  font-weight: 500;
  color: #140d6b;
}

.instrument-status {
  font-size: 10px;
  color: #4a6fa5;
  font-weight: bold;
  text-transform: uppercase;
}

.add-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #b8cde2;
  color: #140d6b;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: #9fb8d4;
  transform: scale(1.1);
}

.instrument-item.active .add-btn {
  background: #e2b8b8;
  color: #6b0d0d;
}
</style>
