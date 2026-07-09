<template>
  <div class="tiny-device-ghost">
    <svg viewBox="0 0 200 200" class="ghost-svg">
      <defs>
        <filter id="tiny-ghost-blur">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
        </filter>
        <radialGradient id="device-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(184, 205, 226, 0.4)" />
          <stop offset="100%" stop-color="rgba(184, 205, 226, 0)" />
        </radialGradient>
      </defs>

      <!-- Breathing Ring -->
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="url(#device-grad)"
        stroke="rgba(74, 111, 165, 0.3)"
        stroke-width="1.5"
        stroke-dasharray="4 4"
        class="pulse-ring"
        filter="url(#tiny-ghost-blur)"
      />

      <!-- Central Icon -->
      <text
        x="100"
        y="115"
        font-size="60"
        text-anchor="middle"
        class="device-icon"
      >
        📱
      </text>
    </svg>

    <!-- Device Label -->
    <div class="device-info">
      <span class="device-name">{{ name }}</span>
      <span class="device-tag">TINY DEVICE</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  name: { type: String, default: "Pulse-Anchor 01" },
});
</script>

<style scoped>
.tiny-device-ghost {
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ghost-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.pulse-ring {
  transform-origin: center;
  animation: breathe 4s infinite ease-in-out;
}

.device-icon {
  filter: drop-shadow(0 0 10px rgba(74, 111, 165, 0.4));
  user-select: none;
}

.device-info {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.device-name {
  font-size: 10px;
  font-weight: 800;
  color: #140d6b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.device-tag {
  font-size: 8px;
  color: #4a6fa5;
  font-weight: 600;
  letter-spacing: 1px;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.8;
  }
}
</style>
