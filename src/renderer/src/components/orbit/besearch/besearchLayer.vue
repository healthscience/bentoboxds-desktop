<template>
  <transition name="besearch-slide">
    <div
      v-if="isOpen"
      class="besearch-layer smelter-v2"
      :class="{ 'dark-theme': isDarkMode }"
    >
      <div class="besearch-controls-top">
        <div class="controls-left">
          <div class="progress-nav">
            <div
              v-for="(stage, idx) in ['capacity', 'logic', 'heli', 'emulation']"
              :key="stage"
              class="stage-node"
              :class="{
                active: currentStage === stage,
                completed: isStageCompleted(stage),
                locked: isStageLocked(stage),
              }"
              @click="setStage(stage)"
            >
              <span class="stage-number">{{ idx + 1 }}</span>
              <span class="stage-label">{{ stage }}</span>
              <div v-if="idx < 3" class="stage-connector"></div>
            </div>
          </div>
        </div>

        <div class="thread-indicator">
          <span class="pulse-dot"></span>
          {{ activeThread }}
        </div>

        <div class="controls-right">
          <div
            class="braiding-mode-toggle"
            @click="storeBesearch.toggleBraidingMode()"
            :class="{ active: storeBesearch.isBraidingMode }"
          >
            <span class="toggle-label">Braiding</span>
            <div class="toggle-switch">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="besearch-branding">
            <span class="branding-label">Besearch Cycle</span>
            <div
              class="cycle-toggle"
              :class="{ playing: isCyclePlaying }"
              @click="toggleCycle"
              title="Toggle Besearch Cycle"
            >
              <img
                src="@/assets/besearch-cycle.png"
                alt="Besearch Cycle"
                class="cycle-icon"
              />
              <span class="cycle-status-icon">{{
                isCyclePlaying ? "⏸" : "▶"
              }}</span>
            </div>
          </div>
          <button class="close-layer" @click="closeLayer">✕</button>
        </div>
      </div>

      <!-- besearch stage any order can be filled in -->

      <div class="smelter-container" :class="[`stage-${currentStage}`]">
        <!-- 1. The Orgo Drawer (Seeding Logic) -->
        <aside
          v-if="currentStage === 'logic' || currentStage === 'capacity'"
          class="orgo-drawer"
          :class="{ open: isDrawerOpen }"
        >
          <header class="drawer-header" @click="isDrawerOpen = !isDrawerOpen">
            <h5>
              {{
                currentStage === "capacity" ? "Context Seeds" : "Logic Seeds"
              }}
            </h5>
            <button
              class="sculpt-shortcut"
              @click="storeBesearch.openSculptingLayer()"
              title="Open Sculpting Lab"
            >
              🛠️
            </button>
            <span class="toggle-icon">{{ isDrawerOpen ? "←" : "→" }}</span>
          </header>
          <div class="seed-list">
            <div v-if="currentStage === 'capacity'" class="seed-section">
              <h6>Residue Bubbles</h6>
              <div class="bubble-stream mini">
                <div
                  v-for="word in unmappedFragments"
                  :key="word"
                  class="residue-bubble"
                  draggable="true"
                  @dragstart="handleResidueDragStart($event, word)"
                >
                  {{ word }}
                </div>
              </div>

              <h6>Body Cues</h6>
              <div class="bubble-stream mini">
                <div
                  v-for="word in ['skin', 'eyes', 'heart', 'knee', 'muscle']"
                  :key="word"
                  class="residue-bubble body-cue"
                  draggable="true"
                  @dragstart="handleResidueDragStart($event, word)"
                >
                  {{ word }}
                </div>
              </div>

              <h6>Building Environment</h6>
              <div class="bubble-stream mini">
                <div
                  v-for="word in [
                    'swimming pool',
                    'home',
                    'flat',
                    'office',
                    'factory',
                    'shopping centre',
                  ]"
                  :key="word"
                  class="residue-bubble env-cue"
                  draggable="true"
                  @dragstart="handleResidueDragStart($event, word)"
                >
                  {{ word }}
                </div>
              </div>

              <h6>Earth</h6>
              <div class="bubble-stream mini">
                <div
                  v-for="word in [
                    'trees',
                    'grass',
                    'river',
                    'air quality',
                    'farming',
                  ]"
                  :key="word"
                  class="residue-bubble earth-cue"
                  draggable="true"
                  @dragstart="handleResidueDragStart($event, word)"
                >
                  {{ word }}
                </div>
              </div>
            </div>
            <template v-else>
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
            </template>
          </div>
        </aside>

        <main class="lab-space">
          <!-- Stage 1: Capacity / Context / Attunement -->
          <template v-if="currentStage === 'capacity'">
            <section
              class="lab-bay capacity-bay"
              @drop.prevent="handleCapacityDrop($event)"
              @dragover.prevent
            >
              <header class="bay-header">
                <h4>1. Capacity</h4>
              </header>

              <div class="selection-list" v-if="storeBesearch.isBraidingMode">
                <LensColumn
                  :groups="[
                    {
                      id: 'capacity',
                      title: 'Capacity',
                      items: availableCapacityItems,
                    },
                  ]"
                  :selected-value="besearchContext.capacity"
                  :show-remove="false"
                  @select="selectCapacity"
                />
              </div>

              <div v-else class="capacity-focus-wrapper">
              <div class="capacity-focus" v-if="besearchContext.capacity">
                  <div class="cue-word-large">
                    {{ besearchContext.capacity }}
                  </div>
                <p class="cue-description">Resonance Anchor</p>
              </div>
              <div v-else class="bay-placeholder">
                Drag a residue bubble here
              </div>
              </div>
            </section>

            <section class="lab-bay context-bay">
              <header class="bay-header">
                <h4>2. Context</h4>
              </header>
              <LensColumn
                :groups="[
                  { id: 'peer', title: 'Body/Peer', items: availablePeerItems },
                  {
                    id: 'environment',
                    title: 'Building Environment',
                    items: availableEnvironmentItems,
                  },
                  {
                    id: 'earth',
                    title: 'Earth Scales',
                    items: availableEarthItems,
                  },
                ]"
                :selected-value="besearchContext.context"
                :show-remove="true"
                @select="selectContext"
                @unmap="unmapToResidue"
                @drop="handleContextDrop"
              />
            </section>

            <section class="lab-bay attunement-bay">
              <header class="bay-header">
                <h4>3. Attunement</h4>
              </header>
              <LensColumn
                :groups="[
                  {
                    id: 'attunement',
                    title: 'Attunement',
                    items: availableAttunementItems,
                  },
                ]"
                :selected-value="besearchContext.attunement"
                :show-remove="true"
                :show-set-strand="false"
                @select="selectAttunement"
                @unmap="unmapToResidue"
                @drop="handleAttunementDrop"
              >
                <template #item-append="{ item, active }">
                  <div
                    v-if="
                      active &&
                      besearchContext.capacity &&
                      besearchContext.context
                    "
                    class="item-actions-inline"
                  >
                    <div class="strategy-selector-inline">
                      <button
                        v-for="s in ['Prevention', 'Repair', 'Rejuvenation']"
                        :key="s"
                        :class="{ active: besearchContext.strategy === s }"
                        @click.stop="updateBesearchStrategy(s)"
                        :title="s"
                      >
                        {{ s[0] }}
                      </button>
                    </div>
                    <button
                      class="set-strand-btn-inline"
                      :class="{ 'ready-success': besearchContext.strategy }"
                      @click.stop="setStage('logic')"
                    >
                      Set Strand
                    </button>
                  </div>
                </template>
              </LensColumn>
            </section>
          </template>

          <!-- Stage 2: Logic Braid -->
          <template v-if="currentStage === 'logic'">
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
                    Drag Orgo Seeds
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
                    Drag Gelle Textures
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
                  Drag Instruments from Logic Seeds here
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
          </template>

          <!-- Stage 3: Heli -->
          <template v-if="currentStage === 'heli'">
            <section class="lab-bay heli-center">
              <header class="bay-header">
                <h4>Heli Clock (Future Project)</h4>
              </header>
              <div class="heli-clock-view">
                <HeliClock :mini="false" />

                <div class="heli-sectors-grid">
                  <!-- Orbits Sector -->
                  <div
                    class="heli-sector orbit-sector"
                    @drop.prevent="handleHeliSectorDrop($event, 'orbits')"
                    @dragover.prevent
                  >
                    <header class="sector-header">
                      <h5>Orbits</h5>
                    </header>
                    <div class="active-item-list">
                      <div class="heli-active-item constant">
                        <span class="item-label">Horizon:</span>
                        <span class="item-value">Age</span>
                      </div>
                      <div
                        class="heli-active-item"
                        v-if="besearchContext.orbits"
                      >
                        <span class="item-label">Target:</span>
                        <span class="item-value">{{
                          besearchContext.orbits
                        }}</span>
                      </div>
                      <div v-else class="sector-placeholder">
                        Drop for Orbits
                      </div>
                    </div>
                  </div>

                  <!-- Solar Days Sector -->
                  <div
                    class="heli-sector days-sector"
                    @drop.prevent="handleHeliSectorDrop($event, 'days')"
                    @dragover.prevent
                  >
                    <header class="sector-header">
                      <h5>Solar Days (Rhythms)</h5>
                    </header>
                    <div class="sector-value" v-if="besearchContext.days">
                      {{ besearchContext.days }}
                    </div>
                    <div v-else class="sector-placeholder">
                      Drop for Rhythms
                    </div>
                  </div>

                  <!-- Arcs Sector -->
                  <div
                    class="heli-sector arcs-sector"
                    @drop.prevent="handleHeliSectorDrop($event, 'arcs')"
                    @dragover.prevent
                  >
                    <header class="sector-header">
                      <h5>Arcs (Performance)</h5>
                    </header>
                    <div class="sector-value" v-if="besearchContext.arcs">
                      {{ besearchContext.arcs }}
                    </div>
                    <div v-else class="sector-placeholder">Drop for Arcs</div>
                  </div>
                </div>

                <div
                  class="heli-projection-mock"
                  v-if="
                    besearchContext.orbits ||
                    besearchContext.days ||
                    besearchContext.arcs
                  "
                >
                  <h5>Future Projection Mock</h5>
                  <div class="mock-data-viz">
                    <div
                      class="viz-line"
                      v-for="i in 5"
                      :key="i"
                      :style="{
                        width: Math.random() * 100 + '%',
                        opacity: 1 - i * 0.15,
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </section>
          </template>

          <!-- Stage 4: Emulation Testing -->
          <template v-if="currentStage === 'emulation'">
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
                    v-for="(log, i) in evidenceLogs"
                    :key="i"
                    class="log-entry"
                  >
                    <span class="log-time"
                      >[{{ new Date().toLocaleTimeString() }}]</span
                    >
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
        </main>
      </div>

      <!-- footer replaced by stage logic or kept for global actions -->
      <footer class="besearch-footer">
        <div class="status-summary">
          <div
            class="summary-item"
            :class="{ ok: isStageCompleted('capacity') }"
          >
            <span class="label">Capacity</span>
            <div class="mini-progress">
              <div
                class="fill"
                :style="{ width: isStageCompleted('capacity') ? '100%' : '0%' }"
              ></div>
            </div>
            <span class="value">{{ besearchContext.capacity || "None" }}</span>
          </div>
          <div class="summary-item" :class="{ ok: isStageCompleted('logic') }">
            <span class="label">Logic</span>
            <div class="mini-progress">
              <div
                class="fill"
                :style="{ width: isStageCompleted('logic') ? '100%' : '0%' }"
              ></div>
            </div>
            <span class="value"
              >{{ activeOrgos.length + activeGelles.length }} Nodes</span
            >
          </div>
          <div class="summary-item" :class="{ ok: isStageCompleted('heli') }">
            <span class="label">Heli</span>
            <div class="mini-progress">
              <div
                class="fill"
                :style="{ width: isStageCompleted('heli') ? '100%' : '0%' }"
              ></div>
            </div>
            <span class="value">
              {{ isStageCompleted("heli") ? "Complete" : "Pending" }}
            </span>
          </div>
        </div>
      </footer>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { besearchStore } from "@/stores/besearchStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { useOrgoStore } from "@/stores/orgoStore.js";
import { useGelleStore } from "@/stores/gelleStore.js";
import HeliClock from "@/components/orbit/clock/HeliClock.vue";
import OrganSurface from "@/components/orbit/worlds/body/organSurface.vue";
import LensColumn from "@/components/orbit/parts/shared/LensColumn.vue";

const storeBesearch = besearchStore();
const storeAI = aiInterfaceStore();
const orgoStore = useOrgoStore();
const gelleStore = useGelleStore();
const router = useRouter();

const isDarkMode = ref(false);
const isCyclePlaying = ref(false);

const toggleCycle = () => {
  // close besearh cycle and lower lifestrap lens but keep track add button to besearch fuse
  storeBesearch.isBesearchLayerOpen = false;
  storeBesearch.wasBesearchCycleOpen = true;

  // Clear active life strap and close bottom panel
  storeAI.activeLifeStrapID = "";
  storeAI.activeContractKey = "";
  storeBesearch.showBottomPanel = false;
  storeBesearch.selectedIntervention = null;
  storeBesearch.showBesearchDetail = false;

  // Collapse lifestrap lens (shows collapsed bar)
  storeAI.showLifestapLens = true;

  // Set bottom height to collapsed state (60px)
  storeBesearch.bottomHeight = 60;

  // Show besearch fuse by switching mode
  storeAI.currentMode = "besearch";

  isCyclePlaying.value = !isCyclePlaying.value;
  evidenceLogs.value.push(
    `Besearch Cycle ${isCyclePlaying.value ? "activated" : "paused"}`,
  );
};

onMounted(() => {
  const theme = document.documentElement.getAttribute("data-theme");
  isDarkMode.value = theme === "dark";

  // Watch for theme changes on the html element
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

const isOpen = computed(() => storeBesearch.isBesearchLayerOpen);
const currentStage = computed(() => storeBesearch.currentBesearchStage);

const activeThread = computed(() => storeBesearch.activeBesearchThread);
const unmappedFragments = computed(
  () => storeAI.lifestrapTexture?.residue || [],
);

const isDrawerOpen = ref(true);
const isFoldExpanded = ref(false);
const evidenceLogs = ref([
  "Awaiting data ingestion...",
  "Scanning resonance patterns...",
]);

const activeOrgos = computed(() => orgoStore.activeOrgos);
const activeGelles = computed(() => gelleStore.activeGelles);

const isTriPointLocked = computed(() => {
  return (
    isStageCompleted("capacity") &&
    isStageCompleted("logic") &&
    isStageCompleted("heli")
  );
});

const isStageCompleted = (stage) => {
  const ctx = storeBesearch.activeBesearchContext;
  if (stage === "capacity")
    return !!(ctx.capacity && ctx.context && ctx.attunement);
  if (stage === "logic")
    return activeOrgos.value.length > 0 || activeGelles.value.length > 0;
  if (stage === "heli") return !!(ctx.orbits || ctx.days || ctx.arcs);
  if (stage === "emulation") return isTriPointLocked.value;
  return false;
};

const isStageLocked = (stage) => {
  if (stage === "emulation") {
    return (
      !isStageCompleted("capacity") ||
      !isStageCompleted("logic") ||
      !isStageCompleted("heli")
    );
  }
  return false;
};

const setStage = (stage) => {
  if (!isStageLocked(stage)) {
    storeBesearch.currentBesearchStage = stage;
  }
};

const besearchContext = computed(() => storeBesearch.activeBesearchContext);

const availablePeerItems = computed(() =>
  (storeAI.lifestrapTexture.pillars.context || []).filter(
    (i) => i.label === "Activity" || i.label === "Body/Peer",
  ),
);
const availableEnvironmentItems = computed(() =>
  (storeAI.lifestrapTexture.pillars.context || []).filter(
    (i) =>
      i.label === "Space" ||
      i.label === "Environment" ||
      i.label === "Building Environment",
  ),
);
const availableEarthItems = computed(() =>
  (storeAI.lifestrapTexture.pillars.context || []).filter(
    (i) => i.label === "Temporal" || i.label === "Earth Scales",
  ),
);

const availableCapacityItems = computed(
  () => storeAI.lifestrapTexture.pillars.capacity || [],
);

const availableAttunementItems = computed(
  () => storeAI.lifestrapTexture.pillars.attunement || [],
);

const selectCapacity = (word) => {
  storeBesearch.activeBesearchContext.capacity = word;
};

const selectContext = (word) => {
  storeBesearch.activeBesearchContext.context = word;
};

const selectAttunement = (word) => {
  storeBesearch.activeBesearchContext.attunement = word;
};

const handleCapacityDrop = (e) => {
  const word = e.dataTransfer.getData("text/plain");
  if (word) {
    storeBesearch.activeBesearchContext.capacity = word;
    evidenceLogs.value.push(`Capacity anchor set to: ${word}`);
  }
};

const handleContextDrop = (e, groupId) => {
  const word = e.dataTransfer.getData("text/plain");
  if (word) {
    let label = "Activity";
    if (groupId === "environment") label = "Space";
    if (groupId === "earth") label = "Temporal";

    storeAI.updateResonWeight(word, groupId, label);
    evidenceLogs.value.push(`Context bucket added to ${groupId}: ${word}`);
  }
};

const handleAttunementDrop = (e) => {
  const word = e.dataTransfer.getData("text/plain");
  if (word) {
    storeAI.updateResonWeight(word, "attunement", "Attunement");
    evidenceLogs.value.push(`Attunement bucket added: ${word}`);
  }
};

const unmapToResidue = (word) => {
  storeAI.updateResonWeight(word, "residue");
  evidenceLogs.value.push(`Moved ${word} back to library`);
};

const handleHeliSectorDrop = (e, sector) => {
  const word = e.dataTransfer.getData("text/plain");
  if (word) {
    storeBesearch.activeBesearchContext[sector] = word;
    evidenceLogs.value.push(`Heli ${sector} sector updated: ${word}`);
  }
};

const activeInstruments = ref([
  { id: "polar-h10", name: "Polar H10", type: "HRM", online: true },
  { id: "withings-body", name: "Withings Body+", type: "Scale", online: true },
]);

// Cross-thread damping logic
watch(
  activeGelles,
  (newGelles) => {
    const repairActive = newGelles.some((g) => g.strategy === "Repair");
    if (repairActive) {
      activeOrgos.value.forEach((orgo) => {
        orgo.params.damping = Math.min(1, orgo.params.damping + 0.1);
        evidenceLogs.value.push(`Global Damping increased via Repair Gelle`);
      });
    }
  },
  { deep: true },
);

const droppedInstruments = ref([]);

const handleInstrumentDrop = (e) => {
  const dataRaw = e.dataTransfer.getData("application/besearch-instrument");
  if (!dataRaw) return;
  const device = JSON.parse(dataRaw);
  if (!droppedInstruments.value.find((d) => d.id === device.id)) {
    droppedInstruments.value.push(device);
    evidenceLogs.value.push(`Instrument docked: ${device.name}`);
  }
};

const handleInstrumentDragStart = (e, device) => {
  e.dataTransfer.setData(
    "application/besearch-instrument",
    JSON.stringify(device),
  );
};

const removeInstrument = (id) => {
  droppedInstruments.value = droppedInstruments.value.filter(
    (d) => d.id !== id,
  );
};

const handleSeedDragStart = (e, seed, type) => {
  e.dataTransfer.setData(
    "application/besearch-seed",
    JSON.stringify({ ...seed, type }),
  );
};

const handleSeedDrop = (e, targetType) => {
  const data = JSON.parse(e.dataTransfer.getData("application/besearch-seed"));
  if (data.type === targetType) {
    if (targetType === "orgo") {
      orgoStore.instantiateOrgo(data.id);
    } else {
      gelleStore.graftGelle(data.id);
    }
    evidenceLogs.value.push(`Instantiated ${data.name}`);
  }
};

const handleResidueDragStart = (e, word) => {
  e.dataTransfer.setData("text/plain", word);
};

const handleGraftDrop = (e, instanceId) => {
  const word = e.dataTransfer.getData("text/plain");
  if (word) {
    gelleStore.addGraft(instanceId, word);
    evidenceLogs.value.push(`Grafted residue: ${word}`);
  }
};

const updateBesearchStrategy = (strategy) => {
  storeBesearch.activeBesearchContext.strategy = strategy;
  logMutation("context", "global", "strategy", strategy);
};

const updateGelleStrategy = (instanceId, strategy) => {
  gelleStore.updateStrategy(instanceId, strategy);
};

const snapOrgoToDevice = (device) => {
  evidenceLogs.value.push(`Snapping to ${device.name}...`);
  // Mock snap logic
  if (activeOrgos.value.length > 0) {
    const firstOrgo = activeOrgos.value[0];
    firstOrgo.params.amplitude = 75;
    firstOrgo.params.wavelength = 40;
    evidenceLogs.value.push(
      `${firstOrgo.name} frequency aligned to Peer rhythm.`,
    );
  }
};

const logMutation = (type, instanceId, key, value) => {
  storeBesearch.updateBesearchThread({
    component: type,
    instance: instanceId,
    property: key,
    value: value,
  });
};

const toggleFold = () => {
  if (isTriPointLocked.value) {
    isFoldExpanded.value = !isFoldExpanded.value;
  }
};

const launchEmulation = () => {
  storeBesearch.startEmulation();
  evidenceLogs.value.push("Body Emulation started...");
};

const setGelleCanvas = (el, instanceId) => {
  if (el) {
    gelleCanvases.value[instanceId] = el;
    initGellePolyhedron(el, instanceId);
  } else {
    delete gelleCanvases.value[instanceId];
    if (gelleAnimations.value[instanceId]) {
      cancelAnimationFrame(gelleAnimations.value[instanceId]);
      delete gelleAnimations.value[instanceId];
    }
  }
};

const gelleCanvases = ref({});
const gelleAnimations = ref({});

const initGellePolyhedron = (canvas, instanceId) => {
  const ctx = canvas.getContext("2d");
  const phi = (1 + Math.sqrt(5)) / 2;
  const vertices = [
    [-1, phi, 0],
    [1, phi, 0],
    [-1, -phi, 0],
    [1, -phi, 0],
    [0, -1, phi],
    [0, 1, phi],
    [0, -1, -phi],
    [0, 1, -phi],
    [phi, 0, -1],
    [phi, 0, 1],
    [-phi, 0, -1],
    [-phi, 0, 1],
  ];

  let angle = 0;

  const project = (v, scale) => {
    const x = v[0] * Math.cos(angle) - v[2] * Math.sin(angle);
    const z = v[0] * Math.sin(angle) + v[2] * Math.cos(angle);
    const y = v[1] * Math.cos(0.5) - z * Math.sin(0.5);
    return { x: x * scale, y: y * scale };
  };

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  };

  resize();

  const render = () => {
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    // Scale to fill the dropzone (using 80% of min dimension to ensure it fits nicely)
    const scale = (Math.min(width, height) / 2) * 0.8;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Glow
    const glow = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      scale * 1.5,
    );
    glow.addColorStop(0, "rgba(0, 255, 204, 0.1)");
    glow.addColorStop(1, "rgba(0, 255, 204, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);

    angle += 0.01;

    ctx.strokeStyle = isDarkMode.value ? "#00ffcc" : "#00796b";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.shadowBlur = 10;
    ctx.shadowColor = ctx.strokeStyle;

    ctx.beginPath();
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const d2 =
          Math.pow(vertices[i][0] - vertices[j][0], 2) +
          Math.pow(vertices[i][1] - vertices[j][1], 2) +
          Math.pow(vertices[i][2] - vertices[j][2], 2);

        if (d2 < 4.1 && d2 > 3.9) {
          const p1 = project(vertices[i], scale);
          const p2 = project(vertices[j], scale);
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
    }
    ctx.stroke();
    ctx.restore();

    gelleAnimations.value[instanceId] = requestAnimationFrame(render);
  };

  render();
};

const closeLayer = () => {
  storeBesearch.closeBesearchLayer();
  if (storeBesearch.wasSculptingLayerOpen) {
    storeBesearch.isSculptingLayerOpen = true;
    storeBesearch.wasSculptingLayerOpen = false;
  }
};

const waveStyle = computed(() => {
  const orgo = activeOrgos.value[0];
  if (!orgo) return { height: "0%" };
  return {
    height: `${orgo.params.amplitude || 50}%`,
    opacity: 0.7,
  };
});

const auraStyle = computed(() => {
  const gelle = activeGelles.value[0];
  if (!gelle) return { opacity: 0 };
  return {
    opacity: gelle.grafts.length * 0.2 + 0.2,
  };
});
</script>

<style scoped>
.besearch-layer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 84vh;
  background: #fdfcfb;
  backdrop-filter: blur(30px);
  z-index: 5000;
  display: flex;
  flex-direction: column;
  color: #1a202c;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  transition:
    background 0.3s,
    color 0.3s;
}

.besearch-layer.dark-theme {
  background: rgba(5, 5, 10, 0.98);
  color: #e0e0e0;
  border-top: 1px solid rgba(0, 255, 204, 0.2);
}

.besearch-controls-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.controls-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.controls-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.thread-indicator {
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: #00796b;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.besearch-branding {
  display: flex;
  align-items: center;
  gap: 12px;
}

.branding-label {
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
  color: #2d3748;
  opacity: 0.8;
}

.cycle-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 20px;
  background: #f7fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  user-select: none;
}

.cycle-toggle:hover {
  background: #edf2f7;
  border-color: rgba(0, 0, 0, 0.1);
}

.cycle-toggle.playing {
  background: #e6fffa;
  border-color: #00796b;
  box-shadow: 0 0 10px rgba(0, 121, 107, 0.1);
}

.cycle-icon {
  height: 18px;
  width: auto;
  opacity: 0.7;
  transition: all 0.3s;
}

.playing .cycle-icon {
  opacity: 1;
  filter: drop-shadow(0 0 5px rgba(0, 121, 107, 0.3));
  animation: slow-rotate 4s linear infinite;
}

.cycle-status-icon {
  font-size: 0.8rem;
  color: #4a5568;
}

.playing .cycle-status-icon {
  color: #00796b;
}

@keyframes slow-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.dark-theme .besearch-branding .branding-label {
  color: #e0e0e0;
}

.dark-theme .cycle-toggle {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .cycle-toggle.playing {
  background: rgba(0, 255, 204, 0.05);
  border-color: #00ffcc;
}

.dark-theme .cycle-status-icon {
  color: #e0e0e0;
}

.dark-theme .playing .cycle-status-icon {
  color: #00ffcc;
}

.dark-theme .besearch-controls-top {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.thread-indicator {
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: #00796b;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.dark-theme .thread-indicator {
  color: #00ffcc;
  font-weight: 400;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #00796b;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 121, 107, 0.3);
  animation: pulse 2s infinite;
}

.dark-theme .pulse-dot {
  background: #00ffcc;
  box-shadow: 0 0 10px #00ffcc;
}

.smelter-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.orgo-drawer {
  width: 60px;
  background: #ede9e1;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.dark-theme .orgo-drawer {
  background: rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.orgo-drawer.open {
  width: 250px;
}

.drawer-header {
  padding: 20px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-theme .drawer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.drawer-header h5 {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 700;
  color: #4a5568;
}

.dark-theme .drawer-header h5 {
  color: #e0e0e0;
  font-weight: 400;
}

.seed-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.seed-section h6 {
  font-size: 0.65rem;
  text-transform: uppercase;
  margin-bottom: 10px;
  color: #718096;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.dark-theme .seed-section h6 {
  color: #e0e0e0;
  font-weight: 400;
}

.seed-item {
  padding: 12px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  color: #2d3748;
  transition: all 0.2s;
}

.dark-theme .seed-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
}

.seed-item:hover {
  background: #ffffff;
  border-color: #00796b;
  box-shadow: 0 4px 8px rgba(0, 121, 107, 0.1);
  transform: translateY(-1px);
}

.dark-theme .seed-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #00ffcc;
  box-shadow: none;
  transform: none;
}

.seed-icon {
  font-size: 1.2rem;
}

.lab-space {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 200px;
  gap: 20px;
  padding: 30px;
  overflow-y: auto;
  background: #fdfcfb;
}

.stage-capacity .lab-space {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
}

.dark-theme .lab-space {
  background: transparent;
}

.context-bay :deep(.variable-tag),
.attunement-bay :deep(.variable-tag) {
  cursor: pointer;
}

.context-bay :deep(.variable-tag.active),
.attunement-bay :deep(.variable-tag.active) {
  background: rgba(0, 255, 200, 0.2);
  border-color: var(--sov-accent);
}

.dark-theme .context-bay :deep(.variable-tag.active),
.dark-theme .attunement-bay :deep(.variable-tag.active) {
  background: rgba(0, 255, 204, 0.1);
  border-color: #00ffcc;
}

.lab-bay {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.dark-theme .lab-bay {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.bay-header h4 {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #2d3748;
  font-weight: 800;
}

.bay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sculpt-shortcut {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 0;
}

.sculpt-shortcut:hover {
  opacity: 1;
}

.dark-theme .bay-header h4 {
  color: #00ffcc;
  font-weight: 400;
}

.bay-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 0.85rem;
  color: #718096;
}

.dark-theme .bay-placeholder {
  border: 2px dashed rgba(255, 255, 255, 0.05);
  color: inherit;
}

.active-instance {
  background: #f7fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.dark-theme .active-instance {
  background: rgba(0, 0, 0, 0.2);
  border: none;
}

.instance-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.instance-name {
  color: #00796b;
  font-weight: 700;
  font-size: 0.9rem;
}

.dark-theme .instance-name {
  color: #00ffcc;
  font-weight: 600;
}

.instance-id {
  font-family: monospace;
  font-size: 0.65rem;
  color: #718096;
}

.dark-theme .instance-id {
  color: inherit;
  opacity: 0.5;
}

.tuning-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider-group label {
  font-size: 0.7rem;
  text-transform: capitalize;
  color: #4a5568;
  font-weight: 600;
}

.dark-theme .slider-group label {
  color: inherit;
  opacity: 0.7;
}

.strategy-selector {
  display: flex;
  gap: 8px;
  width: 100%;
}

.strategy-selector button {
  flex: 1;
  padding: 12px 8px;
  font-size: 0.65rem;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: #4a5568;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 700;
  transition: all 0.2s;
}

.dark-theme .strategy-selector button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  font-weight: 600;
}

.strategy-selector button.active {
  background: #00796b;
  color: #ffffff;
  border-color: #00796b;
}

.dark-theme .strategy-selector button.active {
  background: #00ffcc;
  color: #000;
  border-color: #00ffcc;
}

.graft-zone {
  margin-top: 15px;
  height: 300px;
  min-height: 220px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

.dark-theme .graft-zone {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.instrument-rack .instrument-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.instrument-item {
  background: #f7fafc;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  color: #2d3748;
}

.dark-theme .instrument-item {
  background: rgba(255, 255, 255, 0.03);
  color: #e0e0e0;
  border: 1px solid transparent;
}

.instrument-item:hover {
  background: #ffffff;
  border-color: #00796b;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.dark-theme .instrument-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(0, 255, 204, 0.3);
  box-shadow: none;
}

.device-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef5350;
}

.device-status.online {
  background: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}

.dark-theme .device-status.online {
  background: #00ffcc;
  box-shadow: 0 0 5px #00ffcc;
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.device-name {
  font-size: 0.85rem;
  font-weight: 700;
}

.device-type {
  font-size: 0.65rem;
  color: #718096;
}

.dark-theme .device-type {
  opacity: 0.6;
  color: inherit;
}

.snap-btn {
  background: transparent;
  border: 1.5px solid #00796b;
  color: #00796b;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
}

.dark-theme .snap-btn {
  border-color: #00ffcc;
  color: #00ffcc;
  border-width: 1px;
  font-weight: 700;
}

.gemini-fold {
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark-theme .gemini-fold {
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.gemini-fold.expanded {
  height: 400px;
}

.fold-status-bar {
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.lock-indicator {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #718096;
  font-weight: 700;
  opacity: 0.6;
}

.lock-indicator.locked {
  opacity: 1;
  color: #00796b;
}

.dark-theme .lock-indicator.locked {
  color: #00ffcc;
}

.launch-btn {
  background: #00796b;
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 121, 107, 0.2);
  transition: all 0.2s;
}

.launch-btn:hover {
  background: #00695c;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 121, 107, 0.3);
}

.dark-theme .launch-btn {
  background: #00ffcc;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
}

.dark-theme .launch-btn:hover {
  background: #00ffcc;
  transform: scale(1.02);
}

.fold-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 0 40px 40px 40px;
  height: calc(100% - 60px);
}

.scribe-pane,
.seer-pane {
  display: flex;
  flex-direction: column;
}

.evidence-log {
  flex: 1;
  background: #1a1c1e;
  border-radius: 12px;
  padding: 15px;
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  color: #4caf50;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.visual-projection {
  flex: 1;
  background: #0a0c0e;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.selection-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.selection-item {
  padding: 12px;
  background: #f7fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.2s;
}

.selection-item:hover {
  background: #edf2f7;
  border-color: rgba(0, 0, 0, 0.1);
}

.selection-item.active {
  background: #e6fffa;
  border-color: #00796b;
  box-shadow: 0 0 10px rgba(0, 121, 107, 0.1);
}

.dark-theme .selection-item {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
}

.dark-theme .selection-item.active {
  background: rgba(0, 255, 204, 0.05);
  border-color: #00ffcc;
}

.item-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #718096;
  font-weight: 700;
}

.item-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.item-actions-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.strategy-selector-inline {
  display: flex;
  gap: 2px;
}

.strategy-selector-inline button {
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 0.6rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #4a5568;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 700;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-theme .strategy-selector-inline button {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.strategy-selector-inline button.active {
  background: #00796b;
  color: #ffffff;
  border-color: #00796b;
}

.dark-theme .strategy-selector-inline button.active {
  background: #00ffcc;
  color: #000;
  border-color: #00ffcc;
}

.set-strand-btn-inline {
  background: #00796b;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.6rem;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
}

.dark-theme .set-strand-btn-inline {
  background: #00ffcc;
  color: black;
}

.set-strand-btn-inline.ready-success {
  background: #4caf50 !important;
  color: white !important;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.4);
}

.braiding-mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  background: #f7fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  transition: all 0.2s;
  margin-right: 15px;
}

.braiding-mode-toggle:hover {
  background: #edf2f7;
}

.braiding-mode-toggle.active {
  border-color: #ff8000;
  background: rgba(255, 128, 0, 0.05);
}

.toggle-label {
  font-family: "Space Mono", monospace;
  font-size: 0.65rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #4a5568;
}

.braiding-mode-toggle.active .toggle-label {
  color: #ff8000;
}

.toggle-switch {
  width: 30px;
  height: 16px;
  background: #cbd5e0;
  border-radius: 10px;
  position: relative;
  transition: all 0.2s;
}

.active .toggle-switch {
  background: #ff8000;
}

.toggle-knob {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.active .toggle-knob {
  left: 16px;
}

.dark-theme .braiding-mode-toggle {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .toggle-label {
  color: #e0e0e0;
}

.dark-theme .braiding-mode-toggle.active {
  background: rgba(255, 128, 0, 0.1);
}

.set-braid-btn {
  background: #ff8000 !important;
  box-shadow: 0 0 20px rgba(255, 128, 0, 0.3) !important;
}

.dark-theme .set-braid-btn {
  background: #ff8000 !important;
  color: white !important;
}

.empty-selection {
  font-size: 0.8rem;
  opacity: 0.5;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Scavenger Tray overrides */
.scavenger-tray {
  grid-column: span 2;
  background: #ede9e1;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
}

.dark-theme .scavenger-tray {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.scavenger-tray h5 {
  margin: 0 0 15px 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #4a5568;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.dark-theme .scavenger-tray h5 {
  color: inherit;
  font-weight: 400;
}

.bubble-stream {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.residue-bubble {
  padding: 6px 14px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  cursor: grab;
  font-size: 0.75rem;
  color: #2d3748;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.2s;
  white-space: nowrap;
  width: fit-content;
  display: inline-flex;
  align-items: center;
}

.residue-bubble:hover {
  border-color: #00796b;
  transform: translateY(-1px);
}

.dark-theme .residue-bubble {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  box-shadow: none;
  font-weight: 400;
}

.graft-bubble {
  padding: 6px 14px;
  background: #e6fffa;
  border: 1px solid #00796b;
  color: #00796b;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 700;
}

.dark-theme .graft-bubble {
  background: rgba(0, 255, 204, 0.1);
  border: 1px solid #00ffcc;
  color: #00ffcc;
  font-weight: 600;
}

.close-layer {
  background: #edf2f7;
  border: none;
  color: #4a5568;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-layer:hover {
  background: #e2e8f0;
  color: #1a202c;
}

/* Progress Nav */
.progress-nav {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stage-node {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  opacity: 0.5;
  transition: all 0.3s;
}

.stage-node.active {
  opacity: 1;
}

.stage-node.completed {
  opacity: 0.8;
  color: #00796b;
}

.dark-theme .stage-node.completed {
  color: #00ffcc;
}

.stage-node.locked {
  cursor: not-allowed;
  opacity: 0.2;
}

.stage-number {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
}

.stage-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.stage-connector {
  width: 20px;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

.dark-theme .stage-connector {
  background: rgba(255, 255, 255, 0.1);
}

/* Stage Specific Layouts */
.logic-braid-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  grid-column: 1 / -1;
}

.logic-braid-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  flex: 1;
}

.instrument-dock-zone {
  min-height: 120px;
  grid-column: 1 / -1;
}

.dropped-instruments-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.instrument-item.dropped {
  background: rgba(0, 0, 0, 0.05);
  padding: 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(0, 121, 107, 0.2);
}

.dark-theme .instrument-item.dropped {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 255, 204, 0.2);
}

.remove-btn {
  background: transparent;
  border: none;
  color: #ef5350;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 5px;
  margin-left: 5px;
}

.emulation-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  grid-column: 1 / -1;
}

.lab-bay.seer-bay {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.visual-projection-v2 {
  flex: 1;
  position: relative;
  background: #0a0c0e;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.capacity-bay,
.context-bay,
.heli-center {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.heli-center {
  grid-column: 1 / -1;
}

.capacity-focus {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.cue-word-large {
  font-size: 4rem;
  font-weight: 900;
  color: #00796b;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.dark-theme .cue-word-large {
  color: #00ffcc;
  text-shadow: 0 0 30px rgba(0, 255, 204, 0.3);
}

.active-instance.mini {
  padding: 10px;
  margin-bottom: 10px;
}

.tuning-controls.mini {
  grid-template-columns: 1fr;
  gap: 5px;
}

.strategy-selector.mini button {
  padding: 4px;
  font-size: 0.55rem;
}

.graft-zone.mini {
  min-height: 40px;
  padding: 5px;
  position: relative;
  overflow: hidden;
}

.gelle-polyhedron-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.6;
}

.graft-bubble.mini {
  padding: 2px 8px;
  font-size: 0.6rem;
}

.heli-clock-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.heli-projection-mock {
  flex: 1;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.dark-theme .heli-projection-mock {
  background: rgba(255, 255, 255, 0.02);
}

.mock-data-viz {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.viz-line {
  height: 4px;
  background: #00ffcc;
}

.heli-sectors-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.heli-sector {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 121, 107, 0.2);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  transition: all 0.3s;
}

.dark-theme .heli-sector {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(0, 255, 204, 0.2);
}

.heli-sector h5 {
  margin: 0 0 5px 0;
  font-size: 0.65rem;
  text-transform: uppercase;
  opacity: 0.7;
}

.sector-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #00796b;
}

.dark-theme .sector-value {
  color: #00ffcc;
}

.sector-placeholder {
  font-size: 0.7rem;
  opacity: 0.4;
  font-style: italic;
  margin-top: 5px;
}

.active-item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.heli-active-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 121, 107, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.dark-theme .heli-active-item {
  background: rgba(0, 255, 204, 0.05);
}

.heli-active-item.constant {
  border-left: 2px solid #00796b;
}

.dark-theme .heli-active-item.constant {
  border-left-color: #00ffcc;
}

.item-label {
  opacity: 0.6;
  font-size: 0.65rem;
  text-transform: uppercase;
}

.item-value {
  font-weight: 700;
  color: #00796b;
}

.dark-theme .item-value {
  color: #00ffcc;
}

.dark-theme .close-layer {
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
}

.dark-theme .close-layer:hover {
  background: rgba(255, 255, 255, 0.1);
}

.device-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef5350;
}

.device-status-dot.online {
  background: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}

.dark-theme .device-status-dot.online {
  background: #00ffcc;
  box-shadow: 0 0 5px #00ffcc;
}

.seed-item.device {
  cursor: pointer;
}

.seed-type {
  font-size: 0.6rem;
  opacity: 0.6;
  display: block;
}

/* Footer & Status Summary */
.besearch-footer {
  padding: 10px 30px;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.dark-theme .besearch-footer {
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.status-summary {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.summary-item.ok {
  opacity: 1;
}

.summary-item .label {
  font-size: 0.65rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #718096;
}

.dark-theme .summary-item .label {
  color: #e0e0e0;
}

.mini-progress {
  width: 60px;
  height: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.dark-theme .mini-progress {
  background: rgba(255, 255, 255, 0.1);
}

.mini-progress .fill {
  height: 100%;
  background: #00796b;
  transition: width 0.5s ease;
}

.dark-theme .mini-progress .fill {
  background: #00ffcc;
  box-shadow: 0 0 10px #00ffcc;
}

.summary-item .value {
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  font-weight: 600;
  color: #2d3748;
}

.dark-theme .summary-item .value {
  color: #e0e0e0;
}

.emulation-live {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 5;
}
</style>
