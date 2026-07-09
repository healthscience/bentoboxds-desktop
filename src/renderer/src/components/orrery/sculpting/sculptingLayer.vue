<template>
  <transition name="sculpt-slide">
    <div
      v-if="isOpen"
      class="sculpting-layer smelter-v2"
      :class="{ 
        'dark-theme': isDarkMode,
        'is-embedded': storeBesearch.besearchMode === 'graft'
      }"
    >
      <header class="sculpt-header">
        <div class="header-left">
          <div class="lab-branding">
            <span class="pulse-dot"></span>
            <span class="branding-label">Sculpting Lab</span>
          </div>
        </div>
        <div class="header-center"></div>
        <div class="header-right">
          <div class="gifting-actions">
            <button class="sculpt-btn primary">GIFT TO COMMONS</button>
            <button class="sculpt-btn secondary">CHECK COMPATIBILITY</button>
          </div>
          <!-- 2.3 The Lens (Right Panel: The Seer) -->
          <aside class="lab-panel seer-panel">
            <header class="panel-header">
              <div class="header-flex">
                <h5>The Lens</h5>
                <button
                  class="close-lab-panel"
                  @click="closeLayer"
                  title="Close Sculpting Lab"
                >
                  ✕
                </button>
              </div>
            </header>
          </aside>
        </div>
      </header>

      <div class="lab-workspace">
        <!-- 2.1 The Palette (Left Panel: Seeding Logic) -->
        <aside class="orgo-drawer" :class="{ open: isDrawerOpen }">
          <header class="drawer-header" @click="isDrawerOpen = !isDrawerOpen">
            <h5>Logic Seeds</h5>
            <span class="toggle-icon">{{ isDrawerOpen ? "←" : "→" }}</span>
          </header>
          <div class="seed-list">
            <div class="seed-section">
              <h6>Orgos</h6>
              <div
                v-for="seed in orgoStore.availableSeeds"
                :key="seed.id"
                class="seed-item"
                draggable="true"
                @dragstart="handleSeedDragStart($event, seed, 'orgo')"
              >
                <div class="seed-icon">{{ seed.icon }}</div>
                <div class="seed-info">
                  <span class="seed-name">{{ seed.name }}</span>
                </div>
              </div>
            </div>
            <div class="seed-section">
              <h6>Gelles</h6>
              <div
                v-for="texture in gelleStore.availableTextures"
                :key="texture.id"
                class="seed-item"
                draggable="true"
                @dragstart="handleSeedDragStart($event, texture, 'gelle')"
              >
                <div class="seed-icon">{{ texture.icon }}</div>
                <div class="seed-info">
                  <span class="seed-name">{{ texture.name }}</span>
                </div>
              </div>
            </div>
            <div class="seed-section">
              <h6>Instruments</h6>
              <div
                v-for="device in activeInstruments"
                :key="device.id"
                class="seed-item device"
                draggable="true"
                @dragstart="handleInstrumentDragStart($event, device)"
                @click="snapOrgoToDevice(device)"
              >
                <div class="seed-icon">
                  <div
                    class="device-status-dot"
                    :class="{ online: device.online }"
                  ></div>
                </div>
                <div class="seed-info">
                  <span class="seed-name">{{ device.name }}</span>
                  <span class="seed-type">{{ device.type }}</span>
                </div>
              </div>
            </div>

            <div class="sculpt-actions-bottom">
              <button class="sculpt-btn secondary small">
                [Search Commons]
              </button>
              <button class="sculpt-btn secondary small">[Author Seed]</button>
            </div>
          </div>
        </aside>

        <!-- 2.2 The Canvas (Center Stage: The Braid) -->
        <main class="lab-space-v2">
          <div class="canvas-stage-v2">
            <div class="horizon-container">
              <LifeStrapHorizon :strap="activeStrapData" />
            </div>

            <div class="logic-braid-wrapper">
              <div class="logic-braid-top">
                <!-- A. The Orgo Bay -->
                <section
                  class="lab-bay orgo-bay"
                  @drop.prevent="handleSeedDrop($event, 'orgo')"
                  @dragover.prevent
                >
                  <header class="bay-header">
                    <h4>Orgo (Structural)</h4>
                  </header>

                  <div v-if="activeOrgos.length === 0" class="bay-placeholder">
                    Drag Orgo Seeds Here
                  </div>

                  <div
                    v-for="orgo in activeOrgos"
                    :key="orgo.instanceId"
                    class="active-instance mini"
                  >
                    <div class="instance-header">
                      <span class="instance-name">{{ orgo.name }}</span>
                    </div>
                    <div class="tuning-controls mini">
                      <div
                        class="slider-group"
                        v-for="(val, key) in orgo.params"
                        :key="key"
                      >
                        <input
                          type="range"
                          v-model="orgo.params[key]"
                          min="0"
                          :max="key === 'damping' ? 1 : 100"
                          :step="key === 'damping' ? 0.01 : 1"
                          @input="
                            logMutation('orgo', orgo.instanceId, key, val)
                          "
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <!-- B. The Gelle Pocket -->
                <section
                  class="lab-bay gelle-pocket"
                  @drop.prevent="handleSeedDrop($event, 'gelle')"
                  @dragover.prevent
                >
                  <header class="bay-header">
                    <h4>Gelle (Adaptive)</h4>
                  </header>

                  <div v-if="activeGelles.length === 0" class="bay-placeholder">
                    Drag Gelle Textures Here
                  </div>

                  <div
                    v-for="gelle in activeGelles"
                    :key="gelle.instanceId"
                    class="active-instance mini"
                  >
                    <div
                      class="graft-zone mini"
                      @drop.prevent="handleGraftDrop($event, gelle.instanceId)"
                      @dragover.prevent
                    >
                      <canvas
                        v-if="gelle.id === 'platonic_solid'"
                        :ref="(el) => setGelleCanvas(el, gelle.instanceId)"
                        class="gelle-polyhedron-canvas"
                      ></canvas>
                      <div
                        v-for="graft in gelle.grafts"
                        :key="graft"
                        class="graft-bubble mini"
                      >
                        {{ graft }}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- C. The Instrument Dock (Dropped Devices) -->
              <section
                class="lab-bay instrument-dock-zone"
                @drop.prevent="handleInstrumentDrop($event)"
                @dragover.prevent
              >
                <header class="bay-header">
                  <h4>Instrument Dock (Evidence)</h4>
                </header>

                <div
                  v-if="droppedInstruments.length === 0"
                  class="bay-placeholder"
                >
                  Drag Instruments here to ground logic
                </div>

                <div class="dropped-instruments-list">
                  <div
                    v-for="device in droppedInstruments"
                    :key="device.id"
                    class="instrument-item dropped"
                  >
                    <div
                      class="device-status"
                      :class="{ online: device.online }"
                    ></div>
                    <div class="device-info">
                      <span class="device-name">{{ device.name }}</span>
                      <span class="device-type">{{ device.type }}</span>
                    </div>
                    <button class="snap-btn" @click="snapOrgoToDevice(device)">
                      SNAP
                    </button>
                    <button
                      class="remove-btn"
                      @click="removeInstrument(device.id)"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { besearchStore } from "@/stores/besearchStore.js";
import { cuesStore } from "@/stores/cuesStore.js";
import { useOrgoStore } from "@/stores/orgoStore.js";
import { useGelleStore } from "@/stores/gelleStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { libraryStore } from "@/stores/libraryStore.js";
import LifeStrapHorizon from "@/components/orrery/sculpting/LifeStrapHorizon.vue";

const storeBesearch = besearchStore();
const storeCues = cuesStore();
const orgoStore = useOrgoStore();
const gelleStore = useGelleStore();
const storeAI = aiInterfaceStore();
import { lifestrapStore } from "@/stores/lifestrapStore.js";

const storeLifestrap = lifestrapStore();
const storeLibrary = libraryStore();

const isDarkMode = ref(false);
const isDrawerOpen = ref(true);

const isOpen = computed(() => {
  if (storeBesearch.besearchMode === 'graft') return true;
  return storeBesearch.isSculptingLayerOpen;
});

const activeOrgos = computed(() => orgoStore.activeOrgos);
const activeGelles = computed(() => gelleStore.activeGelles);

const activeStrapData = computed(() => {
  return (
    storeLifestrap.straps.find((s) => s.key === storeAI.activeLifeStrapID) ||
    storeLifestrap.straps.find((s) => s.id === storeAI.activeLifeStrapID)
  );
});

const activeInstruments = ref([
  { id: "polar-h10", name: "Polar H10", type: "HRM", online: true },
  { id: "withings-body", name: "Withings Body+", type: "Scale", online: true },
]);

const droppedInstruments = ref([]);

const closeLayer = () => {
  storeBesearch.setHUUDState('lens');
};

const openHeli = () => {
  storeBesearch.setHUUDLayer("heli");
};

const handleSeedDragStart = (e, seed, type) => {
  e.dataTransfer.setData(
    "application/besearch-seed",
    JSON.stringify({ ...seed, type }),
  );
};

const handleSeedDrop = (e, targetType) => {
  const rawData = e.dataTransfer.getData("application/besearch-seed");
  if (!rawData) return;
  const data = JSON.parse(rawData);
  if (data.type === targetType) {
    if (targetType === "orgo") {
      orgoStore.instantiateOrgo(data.id);
    } else {
      gelleStore.graftGelle(data.id);
    }
  }
};

const handleInstrumentDragStart = (e, device) => {
  e.dataTransfer.setData(
    "application/besearch-instrument",
    JSON.stringify(device),
  );
};

const handleInstrumentDrop = (e) => {
  const dataRaw = e.dataTransfer.getData("application/besearch-instrument");
  if (!dataRaw) return;
  const device = JSON.parse(dataRaw);
  if (!droppedInstruments.value.find((d) => d.id === device.id)) {
    droppedInstruments.value.push(device);
  }
};

const removeInstrument = (id) => {
  droppedInstruments.value = droppedInstruments.value.filter(
    (d) => d.id !== id,
  );
  syncGraftToCycle();
};

const syncGraftToCycle = () => {
  if (!storeBesearch.activeCycle) return;
  storeBesearch.syncActiveCycleState('grafting', {
    activeOrgos: JSON.parse(JSON.stringify(orgoStore.activeOrgos)),
    activeGelles: JSON.parse(JSON.stringify(gelleStore.activeGelles)),
    droppedInstruments: JSON.parse(JSON.stringify(droppedInstruments.value))
  });
};

const handleGraftDrop = (e, instanceId) => {
  const word = e.dataTransfer.getData("text/plain");
  if (word) {
    gelleStore.addGraft(instanceId, word);
    syncGraftToCycle();
  }
};

const snapOrgoToDevice = (device) => {
  if (activeOrgos.value.length > 0) {
    const firstOrgo = activeOrgos.value[0];
    firstOrgo.params.amplitude = 75;
    firstOrgo.params.wavelength = 40;
    syncGraftToCycle();
  }
};

const logMutation = (type, instanceId, key, value) => {
  storeBesearch.updateBesearchThread({
    component: type,
    instance: instanceId,
    property: key,
    value: value,
  });
  syncGraftToCycle();
};

const gelleCanvases = ref({});

// Watch for cycle changes
watch(
  () => storeBesearch.activeCycleId,
  (newId) => {
    const cycle = storeBesearch.activeCycle;
    if (cycle && cycle.state.grafting) {
      // Direct mutation of stores to restore state
      orgoStore.activeOrgos = JSON.parse(JSON.stringify(cycle.state.grafting.activeOrgos || []));
      gelleStore.activeGelles = JSON.parse(JSON.stringify(cycle.state.grafting.activeGelles || []));
      droppedInstruments.value = JSON.parse(JSON.stringify(cycle.state.grafting.droppedInstruments || []));
    }
  },
  { immediate: true }
);

// Watch for seed drops
watch([() => orgoStore.activeOrgos, () => gelleStore.activeGelles], () => {
  syncGraftToCycle();
}, { deep: true });

onMounted(() => {
  const theme = document.documentElement.getAttribute("data-theme");
  isDarkMode.value = theme === "dark";

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "data-theme") {
        const newTheme = document.documentElement.getAttribute("data-theme");
        isDarkMode.value = newTheme === "dark";
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
});
</script>

<style scoped>
.sculpting-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fdfcfb;
  background-image: radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  z-index: 10000;
  display: grid;
  grid-template-rows: auto 1fr;
  color: #1a202c;
  transition:
    background 0.3s,
    color 0.3s;
  padding-top: 0;
}

.sculpting-layer.is-embedded {
  position: relative !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1 !important;
  top: auto !important;
  left: auto !important;
}

.sculpt-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 10px 30px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
}

.dark-theme .sculpt-header {
  background: rgba(10, 10, 15, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sculpting-layer.dark-theme {
  background: rgba(5, 5, 10, 0.98);
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.05) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
  color: #e0e0e0;
}

.header-center {
  display: grid;
  justify-items: center;
}

.workflow-breadcrumb {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.03);
  padding: 8px 20px;
  border-radius: 30px;
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
}

.dark-theme .workflow-breadcrumb {
  background: rgba(255, 255, 255, 0.05);
}

.crumb {
  opacity: 0.4;
  font-weight: 400;
}

.crumb.active {
  opacity: 0.8;
  color: #00796b;
}

.dark-theme .crumb.active {
  color: #00ffcc;
}

.crumb.current {
  opacity: 1;
  font-weight: 700;
  color: #00796b;
}

.dark-theme .crumb.current {
  color: #00ffcc;
}

.crumb-separator {
  opacity: 0.2;
}

.header-actions {
  display: grid;
  grid-auto-flow: column;
  gap: 15px;
}

.header-right {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 20px;
}

.nav-action-btn {
  background: transparent;
  border: 1px solid rgba(0, 121, 107, 0.3);
  color: #00796b;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.dark-theme .nav-action-btn {
  border-color: rgba(0, 255, 204, 0.3);
  color: #00ffcc;
}

.nav-action-btn:hover {
  background: rgba(0, 121, 107, 0.05);
  border-color: #00796b;
}

.dark-theme .nav-action-btn:hover {
  background: rgba(0, 255, 204, 0.05);
  border-color: #00ffcc;
}

.nav-action-btn.primary {
  background: #00796b;
  color: white;
  border-color: #00796b;
}

.dark-theme .nav-action-btn.primary {
  background: #00ffcc;
  color: #000;
  border-color: #00ffcc;
}

.nav-action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 121, 107, 0.2);
}

.dark-theme .nav-action-btn.primary:hover {
  box-shadow: 0 4px 12px rgba(0, 255, 204, 0.2);
}

.lab-branding {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 12px;
}

.branding-label {
  font-family: "Space Mono", monospace;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  background: #00796b;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 121, 107, 0.5);
  animation: pulse 2s infinite;
}

.dark-theme .pulse-dot {
  background: #00ffcc;
  box-shadow: 0 0 10px #00ffcc;
}

.lab-workspace {
  display: grid;
  grid-template-columns: auto 1fr;
  overflow: hidden;
}

.orgo-drawer {
  width: 60px;
  background: rgba(237, 233, 225, 0.9);
  backdrop-filter: blur(5px);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: grid;
  grid-template-rows: auto 1fr;
}

.dark-theme .orgo-drawer {
  background: rgba(0, 0, 0, 0.6);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.orgo-drawer.open {
  width: 280px;
}

.drawer-header {
  padding: 20px 15px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.drawer-header h5 {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 700;
  opacity: 0.8;
}

.seed-list {
  overflow-y: auto;
  padding: 20px;
  display: grid;
  align-content: start;
  gap: 25px;
}

.seed-section h6 {
  font-size: 0.65rem;
  text-transform: uppercase;
  margin-bottom: 12px;
  opacity: 0.6;
}

.seed-item {
  padding: 12px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  cursor: grab;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.dark-theme .seed-item {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.05);
}

.seed-item:hover {
  border-color: #00796b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.device-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef5350;
}

.device-status-dot.online {
  background: #4caf50;
}

.lab-space-v2 {
  overflow-y: auto;
  padding: 40px;
}

.canvas-stage-v2 {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  gap: 40px;
}

.logic-braid-wrapper {
  display: grid;
  gap: 20px;
}

.logic-braid-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.lab-bay {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 25px;
  min-height: 250px;
  display: grid;
  grid-template-rows: auto 1fr;
}

.dark-theme .lab-bay {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.05);
}

.bay-header h4 {
  margin: 0 0 20px 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 800;
  opacity: 0.8;
}

.bay-placeholder {
  display: grid;
  place-items: center;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 0.8rem;
  opacity: 0.5;
  text-align: center;
  padding: 20px;
}

.lab-panel.seer-panel {
  width: auto;
  background: transparent;
  backdrop-filter: none;
  border-left: none;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
}

.sculpt-actions-bottom {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: grid;
  gap: 10px;
}

.sculpt-btn {
  width: auto;
  white-space: nowrap;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #00796b;
  background: transparent;
  color: #00796b;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.sculpt-btn.primary {
  background: #00796b;
  color: white;
}

.dark-theme .sculpt-btn {
  border-color: #00ffcc;
  color: #00ffcc;
}

.dark-theme .sculpt-btn.primary {
  background: #00ffcc;
  color: #000;
}

.sculpt-btn.small {
  padding: 8px;
  font-size: 0.65rem;
}

.gifting-actions {
  display: grid;
  grid-auto-flow: column;
  gap: 12px;
}

.header-flex {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  width: 100%;
}

.close-lab-panel {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: inherit;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: grid;
  place-items: center;
  transition: all 0.2s;
  margin-left: 10px;
}

.close-lab-panel:hover {
  background: rgba(239, 83, 80, 0.2);
  color: #ef5350;
  transform: scale(1.1);
}

.dark-theme .close-lab-panel {
  background: rgba(255, 255, 255, 0.1);
}

.panel-header {
  padding: 0;
  border-bottom: none;
}

.dark-theme .panel-header {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.panel-content {
  padding: 0 20px;
  overflow-y: auto;
  display: grid;
  align-content: start;
}

.seer-section {
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.seer-section:last-of-type {
  border-bottom: none;
}

.seer-section h6 {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 15px;
  opacity: 0.6;
}

.dark-theme .seer-section {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.horizon-container {
  width: 100%;
  height: 600px;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Life-Strap Horizon Backdrop */
.life-strap-horizon {
  height: 40px;
  position: relative;
  display: grid;
  place-items: center;
  margin-bottom: 20px;
}

.horizon-line {
  position: absolute;
  width: 100%;
  height: 1px;
  background: currentColor;
  opacity: 0.1;
}

.horizon-label {
  padding: 0 20px;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  opacity: 0.4;
  font-weight: 700;
}

.sculpt-slide-enter-active,
.sculpt-slide-leave-active {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.sculpt-slide-enter-from,
.sculpt-slide-leave-to {
  transform: translateX(-100%);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.active-instance.mini {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
}

.dark-theme .active-instance.mini {
  background: rgba(255, 255, 255, 0.02);
}

.instance-name {
  font-weight: 700;
  font-size: 0.85rem;
  color: #00796b;
}

.gelle-polyhedron-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.4;
}

.graft-bubble.mini {
  padding: 2px 8px;
  font-size: 0.6rem;
  z-index: 2;
}

.dark-theme .instance-name {
  color: #00ffcc;
}

.tuning-controls.mini {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.instrument-item.dropped {
  background: rgba(0, 121, 107, 0.05);
  border: 1px solid rgba(0, 121, 107, 0.2);
  padding: 10px 15px;
  border-radius: 10px;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 12px;
}

.dark-theme .instrument-item.dropped {
  background: rgba(0, 255, 204, 0.05);
  border-color: rgba(0, 255, 204, 0.2);
}

.snap-btn {
  background: transparent;
  border: 1px solid currentColor;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 800;
  cursor: pointer;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #ef5350;
  cursor: pointer;
}
</style>
