<template>
  <div class="beebee-grid">
    <div class="aura-layer" :class="{ 'pulsing': isThinking }"></div>
    
    <div class="icon-layer">
      <span class="avatar-emoji"></span>
    </div>

    <div v-if="isThinking" class="status-layer">
      <div class="thinking-dot"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isThinking: Boolean
});
</script>

<style scoped>
.beebee-grid {
  display: grid;
  /* Single cell grid where everything stacks on top of each other */
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  place-items: center;
  width: 120px;
  height: 120px;
}

.aura-layer, .icon-layer, .status-layer {
  grid-column: 1;
  grid-row: 1;
}

.avatar-emoji {
  font-size: 4rem;
  z-index: 2;
}

.aura-layer {
  width: 80px;
  height: 80px;
  background: var(--sov-accent-glow);
  border-radius: 50%;
  filter: blur(20px);
  z-index: 1;
  opacity: 0.5;
  transition: var(--sov-transition-med);
}

.aura-layer.pulsing {
  animation: resonance-throb 2s infinite ease-in-out;
  background: var(--sov-gold); /* Shift to gold when processing Besearch */
  opacity: 0.8;
}

@keyframes resonance-throb {
  0% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.4); opacity: 0.7; }
  100% { transform: scale(1); opacity: 0.4; }
}

.thinking-dot {
  width: 12px;
  height: 12px;
  background: var(--sov-accent);
  border-radius: 50%;
  margin-top: 80px; /* Positioned at the 'feet' of the bee */
  border: 2px solid var(--sov-bg);
}
</style>