<template>
  <div class="orbital-grid">
    <svg viewBox="0 0 100 100" class="heli-svg">
      <defs>
        <filter id="sunGlow"><feGaussianBlur in="SourceGraphic" stdDeviation="1.5" /></filter>
        <radialGradient id="skyGradientClock" cx="50%" cy="50%" r="50%">
          <stop offset="0%" :stop-color="isDaylight ? '#fbbf24' : '#6366f1'" stop-opacity="0.1" />
          <stop offset="100%" :stop-color="isDaylight ? '#fbbf24' : '#0f172a'" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="sunriseGradientClock" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#fbbf24" />
        </linearGradient>
        <linearGradient id="sunsetGradientClock" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fbbf24" />
          <stop offset="100%" stop-color="#6366f1" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill="url(#skyGradientClock)" />
      <path :d="describeArc(50, 50, 48, 90, 270)" fill="#cbd5e1" fill-opacity="0.25" />

      <g class="day-ticks" stroke="#cbd5e1" stroke-width="0.3">
        <line v-for="n in 72" :key="n"
          x1="50" y1="6" x2="50" y2="9"
          :transform="`rotate(${n * 5}, 50, 50)`"
          :opacity="n * 5 <= displayYearly ? 1 : 0.2"
        />
      </g>

      <g v-if="storedSignature?.birthorbital !== undefined" 
         :transform="`rotate(${storedSignature.birthorbital}, 50, 50)`">
         <line x1="50" y1="6" x2="50" y2="14" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" />
         <circle cx="50" cy="6" r="2" fill="#f59e0b" />
         <text y="3" x="50" font-size="2.8" font-weight="900" text-anchor="middle" fill="#f59e0b" style="text-transform: uppercase;">Genesis</text>
      </g>

      <g class="markers" stroke="#94a3b8" stroke-width="0.6" opacity="0.6">
        <line x1="50" y1="2" x2="50" y2="8" />   <line x1="98" y1="50" x2="92" y2="50" /> <line x1="50" y1="99" x2="50" y2="92" /> <line x1="1" y1="50" x2="8" y2="50" />
      </g>

      <g class="rings">
        <circle cx="50" cy="50" r="44" class="track-bg" />
        <path :d="describeArc(50, 50, 44, 0, displayYearly)" class="wedge-year" />
        
        <g :transform="`rotate(${displayYearly}, 50, 50)`">
          <circle cx="50" cy="6" r="2.5" fill="white" stroke="#3b82f6" stroke-width="1.2" />
        </g>

        <circle cx="50" cy="50" r="36" class="track-bg" />
        
        <path 
          :d="describeArc(50, 50, 36, 180, (displayDaily + 180) % 360)" 
          class="wedge-day" 
        />
        
        <path 
          v-if="isProjecting"
          :d="describeArc(50, 50, 36, (displayDaily + 180) % 360, 540)" 
          class="ghost-track" 
          fill="none" 
          stroke="#fbbf24" 
          stroke-width="1.5" 
          stroke-dasharray="1, 3" 
          opacity="0.4"
        />
      </g>

      <g class="horizon-zones" opacity="0.2">
        <path 
          v-if="storedSignature?.sunrise"
          :d="describeArc(50, 50, 48, storedSignature.sunrise - 15, storedSignature.sunrise + 15)" 
          fill="url(#sunriseGradientClock)" 
        />

        <path 
          v-if="storedSignature?.sunset"
          :d="describeArc(50, 50, 48, storedSignature.sunset - 15, storedSignature.sunset + 15)" 
          fill="url(#sunsetGradientClock)" 
        />
      </g>
    </svg>

    <div class="sun-readout-overlay">
      <div class="cycles-whole">{{ activeCycles?.whole || 0 }}</div>
      <div class="cycles-decimal">.{{ activeCycles?.fraction || '000000' }}</div>
      <div class="date-pill" v-if="showDate">{{ dateString }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { diaryStore } from '@/stores/diaryStore.js';

const props = defineProps({
  isProjecting: Boolean,
  daySeeker: Number,
  showDate: {
    type: Boolean,
    default: true
  }
});

const storeDiary = diaryStore();

const storedSignature = computed(() => storeDiary.orbitSignature);
const displayDaily = computed(() => (props.isProjecting ? storeDiary.projectionData?.daily : storeDiary.heliSignature.daily) || 0);
const displayYearly = computed(() => (props.isProjecting ? storeDiary.projectionData?.yearly : storeDiary.heliSignature.yearly) || 0);
const activeCycles = computed(() => storeDiary.heliSignature.age);

const isDaylight = computed(() => {
  const deg = (displayDaily.value + 180) % 360;
  return deg > 270 || deg < 90;
});

const dateString = computed(() => {
  const ts = Date.now() + (props.daySeeker * 86400000);
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
});

const describeArc = (x, y, r, start, end) => {
  const rad = (deg) => (deg - 90) * Math.PI / 180.0;
  const s = { x: x + r * Math.cos(rad(end)), y: y + r * Math.sin(rad(end)) };
  const e = { x: x + r * Math.cos(rad(start)), y: y + r * Math.sin(rad(start)) };
  const largeArc = (end - start + 360) % 360 <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
};
</script>

<style scoped>
.orbital-grid { position: relative; width: 100%; }
.heli-svg { width: 100%; overflow: visible; }

/* Rings & Wedges */
.track-bg { fill: none; stroke: #f1f5f9; stroke-width: 4; }
.wedge-year { fill: none; stroke: #3b82f6; stroke-width: 4; stroke-linecap: round; }
.wedge-day { fill: none; stroke: #fbbf24; stroke-width: 6; stroke-linecap: round; }

/* Readout Overlay */
.sun-readout-overlay {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -44%);
  text-align: center; pointer-events: none;
}
.cycles-whole { font-size: 7.5rem; font-weight: 900; line-height: 0.7; color: #1e293b; letter-spacing: -5px; }
.cycles-decimal { font-size: 1.8rem; font-weight: 700; color: #cbd5e1; font-family: 'Space Mono', monospace; margin-top: 0.5rem; }
.date-pill {
  margin-top: 2rem; background: white; padding: 6px 16px; border-radius: 12px;
  font-size: 0.75rem; font-weight: 800; color: #64748b; box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

/* Responsive adjustments for size */
:deep(.cycles-whole) { font-size: inherit; }
</style>
