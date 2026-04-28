<template>
  <div class="resonance-pulse-container">
    <svg viewBox="-50 -50 100 100" class="resonance-svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle class="orbit-ring economic-ring" r="42" />
      <circle class="orbit-ring ecological-ring" r="32" />
      <circle class="orbit-ring environment-ring" :class="activeEnvType" r="22" />
      <circle class="orbit-ring metabolic-ring" r="12" />

      <line 
        v-if="hasResonance"
        x1="0" y1="0" 
        :x2="resonanceLine.x" :y2="resonanceLine.y"
        class="resonance-spoke"
      />

      <circle 
        v-for="cue in activeCues" 
        :key="cue.id"
        :class="['cue-point', cue.orbit, { 'pulse': cue.active }]" 
        :cx="cue.x" 
        :cy="cue.y" 
        r="1.5"
      />
      
      <line x1="0" y1="0" :x2="solarHand.x" :y2="solarHand.y" class="solar-hand" />
    </svg>

    <div class="resonance-pulse-container">
      <div class="pulse-legend" :class="{ 'is-visible': showLegend }">
        <div v-for="ring in ringInfo" :key="ring.label" class="legend-item">
          <span class="dot" :style="{ backgroundColor: ring.color }"></span>
          <span class="label">{{ ring.label }}</span>
        </div>
        <button @click="showLegend = !showLegend" class="toggle-legend-btn">?</button>
      </div>

      <svg viewBox="-50 -50 100 100" class="resonance-svg">
        </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const showLegend = ref(false);

const ringInfo = [
  { label: 'Culture', color: '#b6ff3b' },
  { label: 'Ecological', color: '#40e0ff' },
  { label: 'Environment', color: '#ffffff' },
  { label: 'Metabolic', color: '#ff4d4d' }
];

const props = defineProps({
  cues: { type: Array, default: () => [] },
  solarAngle: { type: Number, default: 0 },
  currentEnv: { type: String, default: 'indoor' }
});

// 1. Math: Map angles to X/Y coordinates
const activeCues = computed(() => {
  return props.cues.map(cue => {
    const radiusMap = { metabolic: 12, environment: 22, ecological: 32, economic: 42 };
    const r = radiusMap[cue.orbit] || 10;
    const rad = (cue.angle - 90) * (Math.PI / 180);
    return {
      ...cue,
      x: r * Math.cos(rad),
      y: r * Math.sin(rad)
    };
  });
});

// 2. Logic: Are the dots clustering?
const hasResonance = computed(() => {
  if (props.cues.length < 2) return false;
  const angles = props.cues.map(c => c.angle);
  return (Math.max(...angles) - Math.min(...angles)) < 20;
});

// 3. Logic: Draw the line toward the average of the cluster
const resonanceLine = computed(() => {
  if (!hasResonance.value) return { x: 0, y: 0 };
  const avgAngle = props.cues.reduce((acc, c) => acc + c.angle, 0) / props.cues.length;
  const rad = (avgAngle - 90) * (Math.PI / 180);
  return { x: 42 * Math.cos(rad), y: 42 * Math.sin(rad) };
});

const solarHand = computed(() => {
  const rad = (props.solarAngle - 90) * (Math.PI / 180);
  return { x: 45 * Math.cos(rad), y: 45 * Math.sin(rad) };
});

const activeEnvType = computed(() => props.currentEnv || 'indoor');
</script>

<style scoped>
.resonance-pulse-container {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.resonance-svg {
  width: 100%;
  height: 100%;
  overflow: visible; /* Ensure glows aren't clipped */
}

.orbit-ring {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2); /* Increased opacity */
  stroke-width: 0.8; /* Doubled thickness for visibility */
  transition: stroke 0.5s ease;
}

/* Specific ring accents to make them distinct */
.metabolic-ring { stroke: rgba(255, 77, 77, 0.3); }
.ecological-ring { stroke: rgba(64, 224, 255, 0.3); }
.economic-ring { stroke: rgba(182, 255, 59, 0.3); }


/* Ensure these class names match the 'orbit' property in your data exactly */
.cue-point.metabolic  { fill: #ff4d4d !important; }
.cue-point.environment { fill: #ffffff !important; }
.cue-point.ecological { fill: #40e0ff !important; }
.cue-point.economic   { fill: #b6ff3b !important; }

/* If they are still black, it might be because the 'orbit' property 
   in your JS is capitalized or slightly different (e.g., 'Economic' vs 'economic') */



/* The NEW Environment Layer accents */
.environment-ring.indoor { stroke: #00f2ff; stroke-width: 1.2; opacity: 0.8; stroke-dasharray: 2 2; }
.environment-ring.natural { stroke: #b6ff3b; stroke-width: 1.2; opacity: 0.8; }
.environment-ring.river { stroke: #4d94ff; stroke-width: 1.2; opacity: 0.8; }

.resonance-spoke { stroke: #fff; stroke-width: 0.8; filter: url(#glow); }
.solar-hand { stroke: #00f2ff; stroke-width: 0.4; stroke-dasharray: 1 1; }

/* Ensure dots are large enough to see */
.cue-point { r: 2; filter: drop-shadow(0 0 3px currentColor); }
</style>