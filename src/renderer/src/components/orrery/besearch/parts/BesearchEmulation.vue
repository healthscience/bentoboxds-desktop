<template>
  <div class="emulation-grid">
    <section
      class="lab-bay scribe-bay"
      v-if="!storeBesearch.isEmulationActive"
    >
      <header class="bay-header">
        <h4>The Scribe (Evidence)</h4>
      </header>
      <div class="evidence-log-v2">
        <div
          v-for="(log, i) in logs"
          :key="i"
          class="log-entry"
        >
          <span class="log-time">[{{ new Date().toLocaleTimeString() }}]</span>
          {{ log }}
        </div>
      </div>
    </section>

    <section class="lab-bay seer-bay">
      <header class="bay-header">
        <h4>The Seer (Projection)</h4>
      </header>
      <div class="visual-projection-v2">
        <div class="orgo-wave" :style="waveStyle"></div>
        <div class="gelle-aura" :style="auraStyle"></div>
        <div class="emulation-overlay" v-if="isTriPointLocked">
          <button
            v-if="!storeBesearch.isEmulationActive"
            class="launch-btn-large"
            @click="launchEmulation"
          >
            Initiate Body Emulation
          </button>
          <button
            v-else
            class="launch-btn-large set-braid-btn"
            @click="storeBesearch.commitStrandToBraid()"
          >
            Set Braid
          </button>
        </div>
        <div
          class="emulation-live"
          v-if="storeBesearch.isEmulationActive"
        >
          <OrganSurface
            :linked-cue="{
              name: besearchContext.capacity || 'Heart',
            }"
            organ-color="#00ffcc"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { besearchStore } from "@/stores/besearchStore.js";
import { useOrgoStore } from "@/stores/orgoStore.js";
import { useGelleStore } from "@/stores/gelleStore.js";
import OrganSurface from "@/components/orrery/worlds/body/organSurface.vue";

const storeBesearch = besearchStore();
const orgoStore = useOrgoStore();
const gelleStore = useGelleStore();

const props = defineProps({
  logs: {
    type: Array,
    default: () => []
  }
});

const besearchContext = computed(() => storeBesearch.activeBesearchContext);

const isStageCompleted = (stage) => {
  const ctx = storeBesearch.activeBesearchContext;
  if (stage === "capacity") return !!(ctx.capacity && ctx.context && ctx.attunement);
  if (stage === "logic") return orgoStore.activeOrgos.length > 0 || gelleStore.activeGelles.length > 0;
  if (stage === "heli") return !!(ctx.orbits || ctx.days || ctx.arcs);
  return false;
};

const isTriPointLocked = computed(() => {
  return isStageCompleted("capacity") && isStageCompleted("logic") && isStageCompleted("heli");
});

const waveStyle = computed(() => {
  const orgo = orgoStore.activeOrgos[0];
  if (!orgo) return { height: "0%" };
  return {
    height: `${orgo.params.amplitude || 50}%`,
    opacity: 0.7,
  };
});

const auraStyle = computed(() => {
  const gelle = gelleStore.activeGelles[0];
  if (!gelle) return { opacity: 0 };
  return {
    opacity: gelle.grafts.length * 0.2 + 0.2,
  };
});

const launchEmulation = () => {
  storeBesearch.startEmulation();
};
</script>

<style scoped>
.emulation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.lab-bay {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
}
.bay-header h4 {
  margin: 0 0 15px 0;
  font-size: 0.8rem;
  color: #00ffcc;
}
.evidence-log-v2 {
  height: 200px;
  overflow-y: auto;
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  color: #4caf50;
}
.visual-projection-v2 {
  height: 250px;
  background: #0a0c0e;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}
.orgo-wave {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(0deg, rgba(0, 255, 204, 0.2), transparent);
  transition: height 0.3s;
}
.gelle-aura {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(0, 255, 204, 0.1) 0%, transparent 70%);
  transition: opacity 0.3s;
}
.emulation-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.launch-btn-large {
  padding: 12px 24px;
  background: #00ffcc;
  color: #000;
  border: none;
  border-radius: 30px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.4);
}
.emulation-live {
  width: 100%;
  height: 100%;
}
</style>
