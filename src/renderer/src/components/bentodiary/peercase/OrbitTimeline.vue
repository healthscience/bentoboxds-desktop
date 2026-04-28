<template>
  <div class="great-orbit-view glass-panel">
    <div class="projection-header">
      <h4>Great Orbit Projection: 2026—2036</h4>
      <p class="subtitle">Trajectory for 400m IM Longevity</p>
    </div>

    <div class="timeline-slider">
      <input type="range" min="0" max="10" v-model.number="yearsOut" />
      <div class="year-display">Orbit +{{ yearsOut }} ({{ 2026 + yearsOut }})</div>
    </div>

    <div class="stats-grid">
      <div class="stat-box">
        <span class="label">Projected 200m Pace</span>
        <span class="value">{{ projection.formattedPace }}</span>
      </div>
      <div class="stat-box">
        <span class="label">Efficiency Factor</span>
        <span class="value">{{ Math.round(projection.resonanceCapacity) }}%</span>
      </div>
    </div>

    <div class="beebee-insight">
      <p><strong>BeeBee:</strong> "In Orbit {{ yearsOut }}, your Butterfly leg will rely 15% more on 
      <em>Consilience (Timing)</em> than <em>Metabolic Force</em>. Focus on the glide."</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { calculateGreatOrbit } from './GreatOrbitProjection.js';

const yearsOut = ref(0);
const current200mPace = 195; // 3:15 in seconds

const projection = computed(() => {
  return calculateGreatOrbit(current200mPace, yearsOut.value);
});
</script>

<style scoped>
.great-orbit-view { padding: 1.2rem; border-top: 2px solid #b6ff3b; }
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
.stat-box { background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; }
.label { font-size: 0.6rem; text-transform: uppercase; opacity: 0.6; display: block; }
.value { font-size: 1.2rem; color: #b6ff3b; font-weight: bold; }
.beebee-insight { font-style: italic; font-size: 0.8rem; border-left: 2px solid #40e0ff; padding-left: 10px; }
</style>