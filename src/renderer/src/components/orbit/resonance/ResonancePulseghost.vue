<template>
  <div class="pulse-container" :style="{ left: x + '%', top: y + '%' }">
    <svg viewBox="0 0 200 200" class="ghost-svg">
      <defs>
        <filter id="ghost-blur">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
        </filter>
      </defs>
      <circle
        cx="100"
        cy="100"
        r="70"
        fill="rgba(59, 130, 246, 0.01)"
        stroke="url(#pulse-grad)"
        stroke-width="2"
        filter="url(#ghost-blur)"
        class="pulse-ring"
      />
      <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(59, 130, 246, 0.2)" />
        <stop offset="50%" stop-color="rgba(59, 130, 246, 0.8)" />
        <stop offset="100%" stop-color="rgba(59, 130, 246, 0.2)" />
      </linearGradient>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const showLegend = ref(false);

const ringInfo = [
  { label: "Culture", color: "#b6ff3b" },
  { label: "Ecological", color: "#40e0ff" },
  { label: "Environment", color: "#ffffff" },
  { label: "Metabolic", color: "#ff4d4d" },
];

const props = defineProps({
  cues: { type: Array, default: () => [] },
  solarAngle: { type: Number, default: 0 },
  currentEnv: { type: String, default: "indoor" },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
});

// 1. Math: Map angles to X/Y coordinates
const activeCues = computed(() => {
  return props.cues.map((cue) => {
    const radiusMap = {
      metabolic: 12,
      environment: 22,
      ecological: 32,
      economic: 42,
    };
    const r = radiusMap[cue.orbit] || 10;
    const rad = (cue.angle - 90) * (Math.PI / 180);
    return {
      ...cue,
      x: r * Math.cos(rad),
      y: r * Math.sin(rad),
    };
  });
});

// 2. Logic: Are the dots clustering?
const hasResonance = computed(() => {
  if (props.cues.length < 2) return false;
  const angles = props.cues.map((c) => c.angle);
  return Math.max(...angles) - Math.min(...angles) < 20;
});

// 3. Logic: Draw the line toward the average of the cluster
const resonanceLine = computed(() => {
  if (!hasResonance.value) return { x: 0, y: 0 };
  const avgAngle =
    props.cues.reduce((acc, c) => acc + c.angle, 0) / props.cues.length;
  const rad = (avgAngle - 90) * (Math.PI / 180);
  return { x: 42 * Math.cos(rad), y: 42 * Math.sin(rad) };
});

const solarHand = computed(() => {
  const rad = (props.solarAngle - 90) * (Math.PI / 180);
  return { x: 45 * Math.cos(rad), y: 45 * Math.sin(rad) };
});

const activeEnvType = computed(() => props.currentEnv || "indoor");
</script>

<style scoped>
.pulse-container {
  position: absolute;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%); /* Center on its coordinates */
  pointer-events: auto;
  display: grid;
  place-items: center;
}
.pulse-ring {
  transform-origin: center;
  animation: breathe 4s infinite ease-in-out;
}
@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}

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
.metabolic-ring {
  stroke: rgba(255, 77, 77, 0.3);
}
.ecological-ring {
  stroke: rgba(64, 224, 255, 0.3);
}
.economic-ring {
  stroke: rgba(182, 255, 59, 0.3);
}

/* Ensure these class names match the 'orbit' property in your data exactly */
.cue-point.metabolic {
  fill: #ff4d4d !important;
}
.cue-point.environment {
  fill: #ffffff !important;
}
.cue-point.ecological {
  fill: #40e0ff !important;
}
.cue-point.economic {
  fill: #b6ff3b !important;
}

/* If they are still black, it might be because the 'orbit' property 
   in your JS is capitalized or slightly different (e.g., 'Economic' vs 'economic') */

/* The NEW Environment Layer accents */
.environment-ring.indoor {
  stroke: #00f2ff;
  stroke-width: 1.2;
  opacity: 0.8;
  stroke-dasharray: 2 2;
}
.environment-ring.natural {
  stroke: #b6ff3b;
  stroke-width: 1.2;
  opacity: 0.8;
}
.environment-ring.river {
  stroke: #4d94ff;
  stroke-width: 1.2;
  opacity: 0.8;
}

.resonance-spoke {
  stroke: #fff;
  stroke-width: 0.8;
  filter: url(#glow);
}
.solar-hand {
  stroke: #00f2ff;
  stroke-width: 0.4;
  stroke-dasharray: 1 1;
}

/* Ensure dots are large enough to see */
.cue-point {
  r: 2;
  filter: drop-shadow(0 0 3px currentColor);
}
</style>
