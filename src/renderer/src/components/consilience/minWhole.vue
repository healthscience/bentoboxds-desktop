<template>
  <div class="min-whole">mini
    <svg viewBox="0 0 100 100" class="mini-wheel">
      <path
        v-for="(seg, index) in segments"
        :key="index"
        :d="describeArc(50, 50, 45, index * angle, (index + 1) * angle)"
        :fill="seg.color"
        stroke="white"
        stroke-width="0.5"
      />
      <circle cx="50" cy="50" r="15" fill="blue" />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'

const storeCues = cuesStore()

const segments = computed(() => {
  const list = [ { cue: 'resonance', cuecolor: 'red' }, { cue: 'segments', cuecolor: 'green' }, { cue: 'soon', cuecolor: 'orange' }] // storeCues.cuesFlakeList
  const status = storeCues.flakeCues
  
  if (!list || list.length === 0) {
    return [{ color: '#e0e0e0' }] // Default segment if no data
  }

  return list.map(item => {
    const cueStatus = status[item.cue] || []
    const color = cueStatus.length > 0 ? cueStatus[0].cuecolor : '#e0e0e0'
    return { ...item, color }
  })
})

const angle = computed(() => {
  return segments.value.length > 0 ? 360 / segments.value.length : 360
})

// SVG Arc helper
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  // Handle full circle case
  if (endAngle - startAngle >= 360) {
    return [
      "M", x, y - radius,
      "A", radius, radius, 0, 1, 1, x, y + radius,
      "A", radius, radius, 0, 1, 1, x, y - radius,
      "Z"
    ].join(" ");
  }

  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
}
</script>

<style scoped>
.min-whole {
  width: 220px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mini-wheel {
  width: 100%;
  height: 100%;
}
</style>
