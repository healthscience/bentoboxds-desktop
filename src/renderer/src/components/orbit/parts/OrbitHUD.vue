<template>
  <div id="orbit-hud" :class="{ 'is-expanded': isExpanded }">
    <div class="hud-top">
      <div class="hud-metrics">
        <div class="metric">
          <span>Be</span><strong>{{ activeLifeStrapName }}</strong>
        </div>
        <div class="metric">
          <span>{{ isExpanded ? "LIFE-STRAPS" : "L-S" }}</span
          ><strong>{{ countLifeStraps }}</strong>
        </div>
        <template v-if="isExpanded">
          <div class="metric"><span>BESEARCH</span><strong>0</strong></div>
          <div class="metric"><span>DIALOGUE</span><strong>0</strong></div>
          <div class="metric"><span>CUES</span><strong>0</strong></div>
        </template>
        <template v-else>
          <div class="metric"><span>BES</span><strong>0</strong></div>
        </template>
      </div>

      <div v-if="isExpanded" class="metric altruism-metric">
        <span>Altrusim</span><strong>help 20%</strong>
      </div>

      <button class="hud-toggle" @click="isExpanded = !isExpanded">
        {{ isExpanded ? "<" : ">" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { libraryStore } from "@/stores/libraryStore.js";

const storeAI = aiInterfaceStore();
const storeLibrary = libraryStore();

const isExpanded = ref(false);

/* Get the active life-strap name */
const activeLifeStrapName = computed(() => {
  return storeAI.lifeStrapID?.slice(-8);
});

const countLifeStraps = computed(() => {
  return storeLibrary.straps.length;
});
</script>

<style scoped>
#orbit-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 500;
}

.hud-visor-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  /* 1. THE POLARIZED TINT */
  background: radial-gradient(
    circle at center,
    transparent 40%,
    rgba(0, 80, 150, 0.03) 100%
  );
  /* 2. THE INNER LENS REFLECTION */
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  /* 3. PERIPHERAL DISTORTION (The 'Goggle' Frame) */
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.1);
}

.hud-top {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 0.5rem 1.5rem;
  margin: 0.5rem auto;
  width: fit-content;
  background: var(--color-background-soft);
  opacity: 0.9;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid var(--color-border);
  z-index: 10;
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

#orbit-hud.is-expanded .hud-top {
  gap: 4rem;
  padding: 1rem 3rem;
  margin: 1rem auto;
  border-radius: 16px;
}

.hud-metrics {
  display: flex;
  gap: 2rem;
  transition: gap 0.3s ease;
}

#orbit-hud.is-expanded .hud-metrics {
  gap: 4rem;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.metric span {
  font-size: 0.55rem;
  font-weight: 800;
  color: var(--sov-accent);
  letter-spacing: 0.1em;
  margin-bottom: 0.15rem;
  transition: font-size 0.3s ease;
}

#orbit-hud.is-expanded .metric span {
  font-size: 0.6rem;
  margin-bottom: 0.25rem;
}

.metric strong {
  font-size: 0.9rem;
  color: rgb(34, 13, 228);
  font-family: "Space Mono", monospace;
  transition: font-size 0.3s ease;
}

#orbit-hud.is-expanded .metric strong {
  font-size: 1.1rem;
}

.hud-toggle {
  background: rgba(158, 113, 231, 0.2);
  border: 1px solid rgba(158, 113, 231, 0.3);
  color: #6b4fb8;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: "Space Mono", monospace;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.hud-toggle:hover {
  background: rgba(158, 113, 231, 0.4);
  transform: scale(1.1);
}
</style>
