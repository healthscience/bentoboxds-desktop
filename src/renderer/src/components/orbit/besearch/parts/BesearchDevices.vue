<template>
  <section
    class="lab-bay instrument-dock-zone"
    @drop.prevent="handleInstrumentDrop($event)"
    @dragover.prevent
  >
    <header class="bay-header">
      <h4>Tiny Devices (Evidence)</h4>
    </header>

    <div
      v-if="droppedInstruments.length === 0"
      class="bay-placeholder"
    >
      Drag Instruments from Logic Seeds here
    </div>

    <div class="dropped-instruments-list">
      <div
        v-for="device in droppedInstruments"
        :key="device.id"
        class="instrument-item dropped"
      >
        <div
          class="device-status"
          :class="{ online: device.online }"
        ></div>
        <div class="device-info">
          <span class="device-name">{{ device.name }}</span>
          <span class="device-type">{{ device.type }}</span>
        </div>
        <button class="snap-btn" @click="snapOrgoToDevice(device)">
          SNAP
        </button>
        <button
          class="remove-btn"
          @click="removeInstrument(device.id)"
        >
          ✕
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useOrgoStore } from "@/stores/orgoStore.js";

const orgoStore = useOrgoStore();
const droppedInstruments = ref([]);

const handleInstrumentDrop = (e) => {
  const dataRaw = e.dataTransfer.getData("application/besearch-instrument");
  if (!dataRaw) return;
  const device = JSON.parse(dataRaw);
  if (!droppedInstruments.value.find((d) => d.id === device.id)) {
    droppedInstruments.value.push(device);
  }
};

const removeInstrument = (id) => {
  droppedInstruments.value = droppedInstruments.value.filter(
    (d) => d.id !== id,
  );
};

const snapOrgoToDevice = (device) => {
  if (orgoStore.activeOrgos.length > 0) {
    const firstOrgo = orgoStore.activeOrgos[0];
    firstOrgo.params.amplitude = 75;
    firstOrgo.params.wavelength = 40;
  }
};
</script>

<style scoped>
.lab-bay {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
}
.bay-header h4 {
  margin: 0 0 15px 0;
  font-size: 0.8rem;
  color: #00ffcc;
}
.bay-placeholder {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #718096;
  font-size: 0.8rem;
}
.dropped-instruments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.instrument-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: 8px;
}
.device-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef5350;
}
.device-status.online {
  background: #00ffcc;
  box-shadow: 0 0 5px #00ffcc;
}
.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.device-name {
  font-size: 0.8rem;
  font-weight: bold;
}
.device-type {
  font-size: 0.6rem;
  opacity: 0.6;
}
.snap-btn {
  background: transparent;
  border: 1px solid #00ffcc;
  color: #00ffcc;
  font-size: 0.6rem;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
}
.remove-btn {
  background: transparent;
  border: none;
  color: #ef5350;
  cursor: pointer;
}
</style>
