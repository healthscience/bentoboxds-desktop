<template>
  <div class="tuning-panel glass-panel">
    <h4 class="panel-title">Tuning Peer Resonance</h4>
    
    <div class="control-group">
      <label>Heart Rate (Angle: {{ angles.hrv }}°)</label>
      <input type="range" min="0" max="360" v-model.number="angles.hrv" @input="update" />
    </div>

    <div class="control-group">
      <label>Stroke Efficiency (Angle: {{ angles.stroke }}°)</label>
      <input type="range" min="0" max="360" v-model.number="angles.stroke" @input="update" />
    </div>

    <div class="control-group">
      <label>Drag Coefficient (Angle: {{ angles.drag }}°)</label>
      <input type="range" min="0" max="360" v-model.number="angles.drag" @input="update" />
    </div>

    <div class="tuning-footer">
      <button @click="autoAlign" class="btn-resonance">Force Consilience</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const emit = defineEmits(['update-angles']);

const angles = reactive({
  hrv: 120,
  stroke: 130,
  drag: 140
});

const update = () => {
  emit('update-angles', { ...angles });
};

const autoAlign = () => {
  angles.hrv = 150;
  angles.stroke = 150;
  angles.drag = 150;
  update();
};
</script>

<style scoped>
.tuning-panel {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Inter', sans-serif;
}
.panel-title { font-size: 0.7rem; text-transform: uppercase; color: #40e0ff; margin-bottom: 1rem; }
.control-group { margin-bottom: 1rem; }
label { display: block; font-size: 0.75rem; margin-bottom: 0.3rem; opacity: 0.7; }
input[type=range] { width: 100%; accent-color: #40e0ff; }
.btn-resonance {
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 1px solid #b6ff3b;
  color: #b6ff3b;
  cursor: pointer;
  font-size: 0.7rem;
  transition: all 0.3s;
}
.btn-resonance:hover { background: #b6ff3b; color: black; }
</style>