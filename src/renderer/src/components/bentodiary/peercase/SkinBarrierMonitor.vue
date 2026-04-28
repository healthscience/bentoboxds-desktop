<template>
  <div class="skin-barrier glass-panel" :class="{ 'warning': skinStats.stressScore > 50 }">
    <div class="flex-row">
      <h4>Skin Ecology</h4>
      <div class="intervention-toggle" @click="toggleIntervention">
        <div class="pill" :class="{ 'active': applied }">
          {{ applied ? '🛡️ Barrier Applied' : '⚠️ No Protection' }}
        </div>
      </div>
    </div>

    <div class="stress-display">
      <div class="gauge-container">
        <div class="gauge-fill" :style="{ width: skinStats.stressScore + '%' }"></div>
      </div>
      <div class="labels">
        <span>Chlorine Absorption Risk</span>
        <span>{{ skinStats.stressScore }}%</span>
      </div>
    </div>

    <p class="beebee-advice">
      <strong>BeeBee:</strong> 
      <span v-if="applied">"Barrier active. Your skin is 70% more resilient to the 400m IM chemical load."</span>
      <span v-else>"Surface hydration is low. Without a barrier, the chlorine will accelerate aging tonight."</span>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { calculateSkinStress } from './SkinEcology.js';

const props = defineProps(['hydration', 'duration']);
const applied = ref(false);

const skinStats = computed(() => {
  return calculateSkinStress(props.hydration, props.duration, applied.value);
});

const toggleIntervention = () => { applied.value = !applied.value; };
</script>

<style scoped>
.skin-barrier { border-left: 4px solid #b6ff3b; transition: all 0.3s; }
.warning { border-color: #ff4500; background: rgba(255, 69, 0, 0.05); }
.pill { padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; border: 1px solid #444; cursor: pointer; }
.pill.active { background: #b6ff3b; color: #000; border-color: #b6ff3b; }
.gauge-container { height: 6px; background: #222; border-radius: 3px; margin: 10px 0; overflow: hidden; }
.gauge-fill { height: 100%; background: #40e0ff; transition: width 0.5s ease; }
.labels { display: flex; justify-content: space-between; font-size: 0.6rem; opacity: 0.7; }
</style>