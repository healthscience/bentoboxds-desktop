<template>
  <div class="heli-clock-wrapper" :class="{ 'is-mini': mini }" @mousedown.stop @mouseup.stop @click.stop="handleClockClick()">
    <svg viewBox="0 0 100 100" class="heli-svg" preserveAspectRatio="xMidYMid meet">
      <circle class="base-ring" cx="50" cy="50" r="45" />
      
      <line class="clock-hand" x1="50" y1="50" x2="50" y2="15" />

      <transition name="fade-detail">
        <g v-if="!mini" class="event-layers">
          <circle class="inner-ring" cx="50" cy="50" r="35" />
          <text x="50" y="45" class="label">ORBIT</text>
          <text x="50" y="58" class="value">08:42</text>
        </g>
      </transition>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['expand', 'select']);
let clickCount = 0;
let clickTimer = null;

defineProps({
  mini: { type: Boolean, default: false },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 }
});


/* computed */


/* methods */
const handleClockClick = () => {
  console.log('click');
  clickCount++;
  
  if (clickCount === 1) {
    clickTimer = setTimeout(() => {
      if (clickCount === 1) {
        // --- SINGLE CLICK ACTION ---
        emit('select'); 
      }
      clickCount = 0;
    }, 250); // The "window" for the second click
  } else if (clickCount === 2) {
    // --- DOUBLE CLICK ACTION ---
    clearTimeout(clickTimer);
    console.log('double click');
    clickCount = 0;
    emit('expand');
  }
};
</script>

<style scoped>
.heli-clock-wrapper {
  width: 240px;
  height: 240px;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.base-ring {
  fill: none;
  stroke: var(--sov-accent);
  stroke-width: 1.5;
  transition: stroke-width 0.8s ease;
}

.clock-hand {
  stroke: var(--resonance-color, #00ffc8);
  stroke-width: 2;
  stroke-linecap: round;
}

.inner-ring {
  fill: none;
  stroke: rgba(255,255,255,0.1);
  stroke-width: 0.5;
  stroke-dasharray: 2 2;
}

/* Mini Mode overrides */
.is-mini .base-ring { stroke-width: 4; opacity: 0.5; }
.is-mini .clock-hand { stroke-width: 4; }

.label { fill: var(--sov-text); font-size: 5px; text-anchor: middle; opacity: 0.6; }
.value { fill: white; font-size: 8px; text-anchor: middle; font-weight: bold; }

/* Transition for the legends/details */
.fade-detail-enter-active, .fade-detail-leave-active {
  transition: opacity 0.5s ease;
}
.fade-detail-enter-from, .fade-detail-leave-to {
  opacity: 0;
}
</style>
