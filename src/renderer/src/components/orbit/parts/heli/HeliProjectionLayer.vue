<template>
  <div v-if="storeBesearch.isHeliProjectOpen" class="heli-layer-container">
    <!-- 1. Full Heli Projection View -->
    <div v-if="storeBesearch.isHeliExpanded" class="lens-box coherence standalone-heli">
      <header class="lens-header standalone-header">
        <div class="header-main">
          <div class="header-left">
            <span class="pulse-dot"></span>
            <h3>Heli Projection</h3>
            <div class="status-zone" v-if="isProjecting">
              <span class="status-tag active">PROJECTING +{{ daySeeker }}d</span>
            </div>
            <div class="date-pill">{{ projectedDateString }}</div>
          </div>
          <div class="header-right">
            <button class="attunement-trigger-btn" @click="storeBesearch.setHUUDState('attunement')">
              Set Attunement ➔
            </button>
            <button class="collapse-btn" @click="storeBesearch.isHeliExpanded = false">▼</button>
          </div>
        </div>
      </header>

      <div class="heli-content">
        <div class="clock-section">
          <HeliClock 
            :is-projecting="isProjecting"
            :day-seeker="daySeeker"
            :show-date="false"
          />
        </div>

        <div class="controls-section">
          <div class="navigator-card">
            <header class="card-header">Navigator</header>
            <div class="stepper">
              <button @click="adjustProjection(-1)">−</button>
              <input type="number" :value="daySeeker" @input="e => handleManualInput(e.target.value)" />
              <button @click="adjustProjection(1)">+</button>
            </div>
            <button class="reset-btn" @click="resetToNow" v-if="isProjecting">Return to Live Sync</button>
          </div>
          
          <div class="anchor-card" v-if="isProjecting">
            <header class="card-header">Commit Anchor</header>
            <input type="text" v-model="newEventLabel" placeholder="Solar Event..." class="anchor-input" />
            <button class="primary-btn" @click="confirmEvent">LOCK ANCHOR</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Heli Bar (Collapsed) -->
    <div 
      v-else 
      class="heli-collapsed-bar"
      @click="storeBesearch.isHeliExpanded = true"
    >
      <div class="bar-content">
        <span class="bar-label">▼ Heli Projection</span>
        <div class="bar-summary">
          <span class="summary-tag">Cycle {{ activeCycles?.whole || 0 }}</span>
          <span class="summary-tag" v-if="isProjecting">Projecting +{{ daySeeker }}d</span>
          <span class="summary-tag" v-else>Live Sync</span>
        </div>
        <button class="expand-icon">▲</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { besearchStore } from "@/stores/besearchStore.js";
import { diaryStore } from "@/stores/diaryStore.js";
import HeliClock from "@/components/orbit/clock/HeliClock.vue";

const storeBesearch = besearchStore();
const storeDiary = diaryStore();

const isProjecting = ref(false);
const daySeeker = ref(0);
const newEventLabel = ref("");

const storedSignature = computed(() => storeDiary.orbitSignature);
const activeCycles = computed(() => storeDiary.heliSignature.age);

const projectedDateString = computed(() => {
  const ts = Date.now() + (daySeeker.value * 86400000);
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
});

const adjustProjection = (d) => { daySeeker.value += d; sync(); };
const handleManualInput = (v) => { daySeeker.value = parseInt(v) || 0; sync(); };
const sync = () => {
  isProjecting.value = daySeeker.value !== 0;
  
  // Sync to active cycle
  if (storeBesearch.activeCycle) {
    storeBesearch.syncActiveCycleState('heli', {
      daySeeker: daySeeker.value,
      isProjecting: isProjecting.value
    });
  }

  storeDiary.sendMessageHOP({ type: "heli-project", timestamp: Date.now() + (daySeeker.value * 86400000) });
};
const resetToNow = () => { daySeeker.value = 0; isProjecting.value = false; sync(); };
const confirmEvent = () => { resetToNow(); };

// Watch for cycle changes
watch(
  () => storeBesearch.activeCycleId,
  (newId) => {
    const cycle = storeBesearch.activeCycle;
    if (cycle && cycle.state.heli) {
      daySeeker.value = cycle.state.heli.daySeeker || 0;
      isProjecting.value = cycle.state.heli.isProjecting || false;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.heli-layer-container {
  width: 100%;
  margin-top: 10px;
}

.standalone-heli {
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #f59e0b;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #1a202c;
  position: relative;
  z-index: 1;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.lens-header h3 {
  color: #f59e0b !important;
  margin: 0;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 800;
  background: rgba(166, 133, 255, 0.1);
  color: #a685ff;
}

.status-tag.active {
  background: #3b82f6;
  color: white;
}

.date-pill {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #718096;
}

.attunement-trigger-btn {
  background: #1a202c;
  color: #a685ff;
  border: 1px solid #a685ff;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.attunement-trigger-btn:hover {
  background: #a685ff;
  color: #1a202c;
}

.heli-content {
  display: flex;
  gap: 40px;
  align-items: center;
  margin-top: 20px;
}

.clock-section {
  flex: 1;
  max-width: 350px;
}

.orbital-grid {
  position: relative;
  width: 100%;
}

.heli-svg {
  width: 100%;
  overflow: visible;
}

.track-bg { fill: none; stroke: rgba(255, 255, 255, 0.1); stroke-width: 4; }
.wedge-year { fill: none; stroke: #3b82f6; stroke-width: 4; stroke-linecap: round; }
.wedge-day { fill: none; stroke: #fbbf24; stroke-width: 6; stroke-linecap: round; }

.sun-readout-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -44%);
  text-align: center;
  pointer-events: none;
}

.cycles-whole { font-size: 4rem; font-weight: 900; line-height: 0.7; color: #1a202c; letter-spacing: -2px; }
.cycles-decimal { font-size: 1rem; font-weight: 700; color: #718096; font-family: "Space Mono", monospace; margin-top: 0.2rem; }

.controls-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.navigator-card, .anchor-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 15px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.card-header {
  font-weight: 800;
  font-size: 0.65rem;
  color: #718096;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 12px;
}

.stepper button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: white;
  cursor: pointer;
  font-weight: bold;
}

.stepper input {
  width: 60px;
  text-align: center;
  background: transparent;
  border: none;
  font-weight: 800;
  font-family: "Space Mono", monospace;
  font-size: 1rem;
  color: #1a202c;
}

.reset-btn {
  margin-top: 10px;
  background: transparent;
  border: 1px solid rgba(166, 133, 255, 0.3);
  color: #a685ff;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
}

.anchor-input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #1a202c;
  font-weight: 600;
  margin-bottom: 12px;
}

.primary-btn {
  background: #1a202c;
  color: white;
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: none;
  font-weight: 800;
  cursor: pointer;
}

.heli-collapsed-bar {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 12px;
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bar-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.bar-label {
  font-weight: 700;
  color: #f59e0b;
  font-size: 0.9rem;
}

.bar-summary {
  display: flex;
  gap: 8px;
  margin-left: 15px;
}

.summary-tag {
  background: rgba(245, 158, 11, 0.2);
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 0.7rem;
  color: #1a202c;
}

.collapse-btn, .expand-icon {
  background: transparent;
  border: none;
  color: #f59e0b;
  cursor: pointer;
  font-size: 1.1rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #f59e0b;
  border-radius: 50%;
  box-shadow: 0 0 10px #f59e0b;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
