<template>
  <svg 
    class="path-tool-svg"
    @mousedown="startDrawing"
    @mousemove="doDrawing"
    @mouseup="stopDrawing"
  >
    <polyline 
      :points="pointsString" 
      class="active-trace" 
    />
  </svg>
</template>

<script setup>
import { ref, computed } from 'vue';
const emit = defineEmits(['path-complete']);

const points = ref([]);
const isDragging = ref(false);

const pointsString = computed(() => points.value.map(p => `${p.x},${p.y}`).join(' '));

const startDrawing = (e) => {
  isDragging.value = true;
  points.value = [{ x: e.offsetX, y: e.offsetY }];
};

const doDrawing = (e) => {
  if (!isDragging.value) return;
  points.value.push({ x: e.offsetX, y: e.offsetY });
};

const stopDrawing = () => {
  isDragging.value = false;
  if (points.value.length > 5) {
    emit('path-complete', [...points.value]);
  }
};
</script>

<style scoped>
.path-tool-svg {
  width: 100%;
  height: 100%;
  cursor: crosshair;
}
.active-trace {
  fill: none;
  stroke: #00ffc8;
  stroke-width: 3;
  stroke-dasharray: 4;
}
</style>