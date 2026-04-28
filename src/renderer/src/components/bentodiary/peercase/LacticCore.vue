<template>
  <div class="lactic-monitor">
    <div class="metabolic-sun" :style="sunStyle">
      <span class="mmol">{{ stats.level }}</span>
      <span class="unit">mmol/L</span>
    </div>

    <div class="biomarker-reads">
      <div class="read">
        <label>Lactate Debt</label>
        <div class="progress-bar">
          <div class="fill" :style="{ width: stats.efficiencyLoss + '%' }"></div>
        </div>
      </div>
      <p v-if="stats.isRedlining" class="alert">⚠️ CRITICAL ACIDITY: Stroke efficiency dropping!</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['stats']);

const sunStyle = computed(() => {
  const intensity = Math.min(props.stats.level / 8, 1); // Cap at 8mmol
  return {
    background: `radial-gradient(circle, rgba(255, 69, 0, ${intensity}) 0%, rgba(0,0,0,0) 70%)`,
    boxShadow: `0 0 ${props.stats.level * 5}px rgba(255, 69, 0, 0.4)`
  };
});
</script>

<style scoped>
.mmol { font-size: 1.2rem; font-weight: bold; color: #ff4500; }
.unit { font-size: 0.5rem; opacity: 0.6; }
.progress-bar { width: 100%; height: 4px; background: #222; margin-top: 5px; }
.fill { height: 100%; background: #ff4500; transition: width 0.3s; }
.alert { font-size: 0.6rem; color: #ff4500; text-transform: uppercase; margin-top: 8px; animation: blink 1s infinite; }
@keyframes blink { 50% { opacity: 0.3; } }


.metabolic-sun {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Ensure it has a base presence even at low levels */
  background: rgba(255, 69, 0, 0.1); 
  border: 2px solid rgba(255, 69, 0, 0.4);
  position: relative;
  z-index: 10;
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Add a "Pulsing Aura" for when you hit the redline */
.metabolic-sun.redlining {
  animation: pulse-debt 1.5s infinite;
  border-color: #ff4500;
}

@keyframes pulse-debt {
  0% { transform: scale(1); box-shadow: 0 0 10px #ff4500; }
  50% { transform: scale(1.1); box-shadow: 0 0 30px #ff4500; }
  100% { transform: scale(1); box-shadow: 0 0 10px #ff4500; }
}

</style>