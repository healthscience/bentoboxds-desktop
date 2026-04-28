<template>
  <div class="cellular-layer glass-panel">
    <div class="micro-resonance-viz">
      <div class="mitochondria-gate" :style="gateStyle"></div>
      <div class="label">Mitochondrial Flux: {{ cellStats?.mitochondrialFlux || 0 }}%</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['cellStats']);

// 1. Fix the "NaN" and define the animation speed
const shimmerSpeed = computed(() => {
  // If flux is NaN or 0, we provide a default "resting" speed
  const flux = parseFloat(props.cellStats?.mitochondrialFlux) || 50;
  // Higher flux = faster, smoother vibration. Strained = slow/stuttering.
  const speed = 2 - (flux / 100); 
  return `${Math.max(0.2, speed)}s`;
});

// 2. Define the gateStyle that the template is looking for
const gateStyle = computed(() => {
  const flux = parseFloat(props.cellStats?.mitochondrialFlux) || 50;
  const stressColor = props.cellStats?.cellularStress === 'High' ? '#ff4500' : '#b6ff3b';
  
  return {
    borderColor: stressColor,
    boxShadow: `0 0 ${flux / 5}px ${stressColor}`,
    opacity: flux / 100
  };
});
</script>