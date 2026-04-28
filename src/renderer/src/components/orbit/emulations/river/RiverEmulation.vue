<template>
  <svg class="emulation-svg">
    <g v-for="river in strappedPaths" :key="river.id">
      <polyline :points="formatPoints(river.points)" class="river-bed" />
      
      <circle v-for="n in 5" :key="n" r="3" class="flow-particle">
        <animateMotion 
          :path="createSvgPath(river.points)" 
          :dur="`${3 + n}s`" 
          repeatCount="indefinite" 
        />
      </circle>
    </g>
  </svg>
</template>

<script setup>
defineProps({
  strappedPaths: Array
});

const formatPoints = (pts) => pts.map(p => `${p.x},${p.y}`).join(' ');

const createSvgPath = (pts) => {
  if (!pts.length) return '';
  return `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
};
</script>

<style scoped>
.emulation-svg { width: 100%; height: 100%; }

.river-bed {
  fill: none;
  stroke: rgba(0, 150, 255, 0.4);
  stroke-width: 8;
  stroke-linecap: round;
}

.flow-particle {
  fill: #fff;
  filter: drop-shadow(0 0 3px #00d4ff);
}
</style>