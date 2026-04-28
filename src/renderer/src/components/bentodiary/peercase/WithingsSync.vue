<template>
  <div class="withings-sync glass-panel">
    <div class="sync-header">
      <span class="brand">WITHINGS</span>
      <span class="status-dot" :class="{ 'online': synced }"></span>
    </div>

    <div class="metrics-row">
      <div class="metric">
        <label>Muscle</label>
        <span class="val">{{ data.muscleMass }}kg</span>
      </div>
      <div class="metric">
        <label>Fat %</label>
        <span class="val">{{ data.fatPercent }}%</span>
      </div>
      <div class="metric">
        <label>Hydration</label>
        <span class="val" :class="{ 'warning': data.hydration < 55 }">
          {{ data.hydration }}%
        </span>
      </div>
    </div>

    <div class="impact-alert" v-if="impact.dragMultiplier !== 1">
      <p><strong>Peer Insight:</strong> Current buoyancy is 
      {{ impact.dragMultiplier < 1 ? 'Higher' : 'Lower' }} than baseline. 
      Adjusting Breaststroke drag targets.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { calculateBodyOffsets } from './WithingsBridge.js';

const synced = ref(true);


const impact = computed(() => calculateBodyOffsets(data));

const emit = defineEmits(['update-flesh']);

const data = reactive({
  muscleMass: 62.5,
  fatPercent: 21.2,
  hydration: 52.0 
});

// Send the data to the Parent so the Cellular engine can use it
const syncToParent = () => emit('update-flesh', { ...data });

onMounted(syncToParent);
// If you use the sliders to change Withings data later, this keeps it synced
watch(data, syncToParent);
</script>




<style scoped>
.withings-sync { padding: 10px; border-left: 3px solid #00f2ff; margin-bottom: 15px; }
.sync-header { display: flex; justify-content: space-between; font-size: 0.6rem; margin-bottom: 8px; }
.metrics-row { display: flex; justify-content: space-around; }
.metric { text-align: center; }
.metric label { display: block; font-size: 0.55rem; opacity: 0.5; text-transform: uppercase; }
.metric .val { font-family: 'Courier New', monospace; font-weight: bold; font-size: 0.9rem; }
.warning { color: #ff4d4d; }
.online { background: #4dff88; box-shadow: 0 0 5px #4dff88; }
.impact-alert { margin-top: 10px; font-size: 0.7rem; color: #40e0ff; opacity: 0.9; }
</style>