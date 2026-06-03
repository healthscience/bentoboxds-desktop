<template>
  <section class="lab-bay heli-center">
    <div class="heli-clock-view">
      <HeliClock :mini="false" />

      <div class="heli-sectors-grid">
        <!-- Orbits Sector -->
        <div
          class="heli-sector orbit-sector"
          @drop.prevent="handleHeliSectorDrop($event, 'orbits')"
          @dragover.prevent
        >
          <header class="sector-header">
            <h5>Orbits</h5>
          </header>
          <div class="active-item-list">
            <div class="heli-active-item constant">
              <span class="item-label">Horizon:</span>
              <span class="item-value">Age</span>
            </div>
            <div
              class="heli-active-item"
              v-if="besearchContext.orbits"
            >
              <span class="item-label">Target:</span>
              <span class="item-value">{{ besearchContext.orbits }}</span>
            </div>
            <div v-else class="sector-placeholder">Drop for Orbits</div>
          </div>
        </div>

        <!-- Solar Days Sector -->
        <div
          class="heli-sector days-sector"
          @drop.prevent="handleHeliSectorDrop($event, 'days')"
          @dragover.prevent
        >
          <header class="sector-header">
            <h5>Solar Days (Rhythms)</h5>
          </header>
          <div class="sector-value" v-if="besearchContext.days">
            {{ besearchContext.days }}
          </div>
          <div v-else class="sector-placeholder">Drop for Rhythms</div>
        </div>

        <!-- Arcs Sector -->
        <div
          class="heli-sector arcs-sector"
          @drop.prevent="handleHeliSectorDrop($event, 'arcs')"
          @dragover.prevent
        >
          <header class="sector-header">
            <h5>Arcs (Performance)</h5>
          </header>
          <div class="sector-value" v-if="besearchContext.arcs">
            {{ besearchContext.arcs }}
          </div>
          <div v-else class="sector-placeholder">Drop for Arcs</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { besearchStore } from "@/stores/besearchStore.js";
import HeliClock from "@/components/orbit/clock/HeliClock.vue";

const storeBesearch = besearchStore();
const besearchContext = computed(() => storeBesearch.activeBesearchContext);

const handleHeliSectorDrop = (e, sector) => {
  const word = e.dataTransfer.getData("text/plain");
  if (word) {
    storeBesearch.activeBesearchContext[sector] = word;
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
.heli-clock-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.heli-sectors-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: 100%;
}
.heli-sector {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.sector-header h5 {
  margin: 0 0 10px 0;
  font-size: 0.7rem;
  color: #00ffcc;
  text-transform: uppercase;
}
.active-item-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.heli-active-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}
.item-label {
  opacity: 0.6;
}
.item-value {
  color: #00ffcc;
  font-weight: bold;
}
.sector-value {
  font-size: 1.2rem;
  color: #00ffcc;
  text-align: center;
}
.sector-placeholder {
  font-size: 0.7rem;
  color: #718096;
  text-align: center;
  font-style: italic;
}
</style>
