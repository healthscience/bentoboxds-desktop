<template>
  <div
    class="besearch-lens-grid full-lab-view"
    :class="{ 'has-selection': hasSelection }"
  >
    <!-- Pillar 1: Capacity -->
    <div
      class="lens-box capacity zone"
      @drop="onDrop($event, 'capacity')"
      @dragover.prevent
      @click="
        storeBesearch.openBesearchLayer({
          capacity: capacityItems[0]?.value || 'New Besearch',
        })
      "
    >
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>capacity</h3>
      </header>
      <p class="probe-text" v-if="hasSelection">
        Physics & Vitality: How does this impact your performance/body?
      </p>

      <LensColumn
        :groups="[{ id: 'capacity', title: 'Capacity', items: capacityItems }]"
        @dragstart="onDragStart"
        @unmap="unmapFragment"
        @select="
          (val) =>
            storeBesearch.openBesearchLayer({
              capacity: val || 'New Besearch',
            })
        "
      />
    </div>

    <!-- Pillar 2: Context -->
    <div class="lens-box context zone active-lab">
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>context</h3>
      </header>
      <p class="probe-text" v-if="hasSelection">
        Body, Buildings, Location & Where does this happen?
      </p>

      <div class="context-sections">
        <LensColumn
          :groups="[
            { id: 'peer', title: 'Body/Peer', items: bodyPeerItems },
            {
              id: 'environment',
              title: 'Building Environment',
              items: environmentItems,
            },
            { id: 'earth', title: 'Earth Scales', items: earthItems },
          ]"
          @dragstart="onDragStart"
          @unmap="unmapFragment"
          @select="(val) => handleCueSpace(val)"
          @drop="onDrop"
        />
      </div>
    </div>

    <!-- Pillar 3: Heli (H) -->
    <div
      class="lens-box heli-pillar zone"
      @drop="onDrop($event, 'heli')"
      @dragover.prevent
    >
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>Heli (H)</h3>
      </header>

      <div class="heli-visual-wrapper">
        <HeliStart :mini="true" />
      </div>

      <div class="context-sections">
        <LensColumn
          :groups="[
            {
              id: 'orbits',
              title: 'Orbits (Age)',
              items: heliItems.filter((i) => i.label === 'Orbit Target'),
              class: [
                'heli-well',
                { 'pulse-active': heliMathGhost?.unit === 'orbits' },
              ],
            },
            {
              id: 'days',
              title: 'Solar Days (Rhythms)',
              items: heliItems.filter((i) => i.label === 'Rhythm'),
              class: 'heli-well',
            },
            {
              id: 'arcs',
              title: 'Arcs (Performance)',
              items: heliItems.filter((i) => i.label === 'Performance'),
              class: 'heli-well',
            },
          ]"
          @dragstart="onDragStart"
          @unmap="unmapFragment"
          @select="(val) => handleCueSpace(val)"
          @drop="onDrop"
          @dragover="(e, id) => handleDragOverHeli(e, id)"
          @dragleave="handleDragLeaveHeli"
        >
          <template #group-prepend="{ group }">
            <div class="ghost-math" v-if="group.id === 'orbits' && orbitsMath">
              {{ orbitsMath }}
            </div>
            <div
              class="ghost-math"
              v-if="group.id === 'arcs' && heliMathGhost?.unit === 'arcs'"
            >
              {{ heliMathGhost.text }}
            </div>
          </template>
        </LensColumn>
      </div>
    </div>

    <!-- Pillar 4: Attunement & Coherence -->
    <div
      class="lens-box coherence zone"
      @click="assignSelectedTo('attunement')"
    >
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>Attunement & coherence</h3>
      </header>

      <div class="emulation-meter">
        <div class="meter-label">Emulation Stability</div>
        <div class="meter-bar">
          <div
            class="meter-fill"
            :style="{
              width: lenses?.pillars?.coherence?.isStable ? '100%' : '35%',
            }"
          ></div>
        </div>
      </div>

      <div class="whole-resonance">
        <MiniWhole @click="handleWholeExpand()"></MiniWhole>
        <div class="stability-readout">
          {{
            lenses?.pillars?.coherence?.isStable
              ? "Stable"
              : "Awaiting Alignment"
          }}
        </div>
      </div>

      <!-- Attunement Text Bucket -->
      <LensColumn
        :groups="[
          { id: 'attunement', title: 'Attunement', items: attunementItems },
        ]"
        @dragstart="onDragStart"
        @unmap="unmapFragment"
        @select="(val) => handleCueSpace(val)"
        @drop="onDrop"
      />
    </div>

    <!-- Residue Dock (Full Width Bottom Tray) -->
    <div
      class="residue-dock"
      @drop="onDrop($event, 'residue')"
      @dragover.prevent
    >
      <h4 class="dock-label">Unmapped Fragments</h4>
      <div class="bubble-stream">
        <button
          v-for="word in unmappedFragments"
          :key="word"
          class="fragment-bubble"
          :class="{ selected: selectedWord === word }"
          draggable="true"
          @dragstart="onDragStart($event, word)"
          @click="selectedWord = word"
        >
          {{ word }}
        </button>
        <div v-if="!unmappedFragments?.length" class="empty-dock">
          All fragments aligned.
        </div>
      </div>
    </div>

    <!-- modals for tools -->
    <BentoSpace></BentoSpace>
    <WholeResonance v-if="wholeResStatus === true"></WholeResonance>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BentoSpace from "@/components/bentospace/spaceTemplate.vue";
import MiniWhole from "@/components/consilience/minWhole.vue";
import WholeResonance from "@/components/consilience/wholeResonance.vue";
import HeliStart from "@/components/orbit/clock/HeliStart.vue";
import LensColumn from "@/components/orbit/parts/shared/LensColumn.vue";

import { besearchStore } from "@/stores/besearchStore.js";
import { cuesStore } from "@/stores/cuesStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { diaryStore } from "@/stores/diaryStore.js";

const storeCues = cuesStore();
const storeAI = aiInterfaceStore();
const storeDiary = diaryStore();

const props = defineProps({
  lenses: {
    type: Object,
    default: () => ({
      pillars: {
        capacity: [],
        context: [],
        heli: [],
        coherence: { isStable: false, resonance: 0 },
      },
      residue: [],
      key: "",
    }),
  },
});

const storeBesearch = besearchStore();

/* serious intent state */
const selectedWord = ref(null);
const hasSelection = computed(() => !!selectedWord.value);
const heliMathGhost = ref(null);

/* computed */
const wholeResStatus = computed(() => storeAI.bentoflakeState);

const unmappedFragments = computed(() => {
  console.log(
    "[LifestrapLens] Computing unmappedFragments:",
    props.lenses?.residue,
  );
  return props.lenses?.residue || [];
});

const capacityItems = computed(() => {
  console.log(
    "[LifestrapLens] Computing capacityItems:",
    props.lenses?.pillars?.capacity,
  );
  return props.lenses?.pillars?.capacity || [];
});
const contextItems = computed(() => {
  console.log(
    "[LifestrapLens] Computing contextItems:",
    props.lenses?.pillars?.context,
  );
  return props.lenses?.pillars?.context || [];
});
const heliItems = computed(() => {
  console.log(
    "[LifestrapLens] Computing heliItems:",
    props.lenses?.pillars?.heli,
  );
  return props.lenses?.pillars?.heli || [];
});

const attunementItems = computed(() => {
  console.log(
    "[LifestrapLens] Computing attunementItems:",
    props.lenses?.pillars?.attunement,
  );
  return props.lenses?.pillars?.attunement || [];
});

const bodyPeerItems = computed(() =>
  contextItems.value.filter(
    (i) => i.label === "Activity" || i.label === "Body/Peer",
  ),
);
const environmentItems = computed(() =>
  contextItems.value.filter(
    (i) => i.label === "Space" || i.label === "Environment",
  ),
);
const earthItems = computed(() =>
  contextItems.value.filter(
    (i) => i.label === "Temporal" || i.label === "Earth Scales",
  ),
);

const orbitsMath = computed(() => {
  if (heliMathGhost.value?.unit === "orbits") return heliMathGhost.value.text;
  return null;
});

/* methods */
const performHeliMath = (word, unit) => {
  const currentHeliAge = storeDiary.heliSignature?.age?.whole || 52;
  const val = parseFloat(word);

  if (isNaN(val)) return null;

  if (unit === "orbits") {
    const delta = val - currentHeliAge;
    return {
      delta,
      unit: "orbits",
      text: `${delta >= 0 ? "+" : ""}${delta.toFixed(2)} Orbits`,
    };
  }

  if (unit === "arcs") {
    return {
      value: val,
      unit: "arcs",
      text: `${val} Arcs Threshold`,
    };
  }

  return null;
};

const handleDragOverHeli = (e, unit) => {
  if (!selectedWord.value) return;
  const math = performHeliMath(selectedWord.value, unit);
  if (math) {
    heliMathGhost.value = math;
  }
};

const handleDragLeaveHeli = () => {
  heliMathGhost.value = null;
};

const handleCueSpace = (spaceID) => {
  // does this cue exist in library?
  let lookupLibrarCue = {}; // storeCues.queryLibrary(spaceID)
  let context = "new"; //  temp fix
  if (lookupLibrarCue) {
    // prepare chat for space
    let newChatItem = {};
    newChatItem.name = spaceID.name;
    newChatItem.chatid = spaceID.cueid;
    newChatItem.active = true;
    //setup chat history holder
    storeAI.setupChatHistory(newChatItem);
    storeAI.chatAttention = spaceID.cueid;
    // temp  if history cue the make stucture for space
    if (context === "history") {
      storeAI.liveBspace = {
        name: spaceID.value.concept.name,
        spaceid: spaceID.key,
        cueid: spaceID.key,
        gluedown: "down",
        active: true,
        expand: true,
      };
      spaceID.name = spaceID.value.concept.name;
      spaceID.cueid = spaceID.key;
    } else {
      storeAI.liveBspace = spaceID;
    }
  } else {
    // new space
  }
  storeCues.cueContext = "space";
  storeAI.beebeeContext = "chatspace";
  storeAI.bentospaceState = !storeAI.bentospaceState;
};

const addCueLifestap = (lensType) => {
  // open cue modal
  storeAI.cueAction = "cues";
  storeAI.bentocuesState = true;
};

const handleWholeExpand = () => {
  storeCues.liveCueContext = "flake";
  storeAI.bentoflakeState = !storeAI.bentoflakeState;
};

/* serious intent interactions */
const onDragStart = (e, word) => {
  selectedWord.value = word;
  e.dataTransfer.setData("text/plain", word);
};

const onDrop = (e, zone) => {
  const word = e.dataTransfer.getData("text/plain");
  // Determine default label for drop
  let label = null;
  if (zone === "peer") label = "Activity";
  if (zone === "environment") label = "Space";
  if (zone === "earth") label = "Temporal";
  if (zone === "orbits") label = "Orbit Target";
  if (zone === "days") label = "Rhythm";
  if (zone === "arcs") label = "Performance";
  if (zone === "attunement") label = "Attunement";

  commitAlignment(word, zone, label);
  heliMathGhost.value = null;
};

const assignSelectedTo = (zone, label = null) => {
  if (!selectedWord.value) return;
  commitAlignment(selectedWord.value, zone, label);
  selectedWord.value = null; // Clear selection after assignment
  heliMathGhost.value = null;
};

const commitAlignment = (word, zone, label = null) => {
  // If heli zone, perform math and update store
  const math = performHeliMath(word, zone);
  if (math) {
    if (zone === "orbits") storeAI.setEmulationHorizon(math.delta);
    if (zone === "arcs") storeAI.setPerformanceVelocity(math.value);
  }

  storeAI.updateResonWeight(word, zone, label);
};

const unmapFragment = (word) => {
  storeAI.updateResonWeight(word, "residue");
};
</script>

<style scoped>
.full-lab-view {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 2000;
  padding: 20px 20px 20px 60px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  box-sizing: border-box;
}

.besearch-lens-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
  flex-grow: 1;
  overflow: visible;
  margin-bottom: 20px;
}

.lens-box {
  padding: 20px;
  border-radius: var(--sov-border-radius);
  border-top: 4px solid #ccc;
  background: transparent;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  overflow-y: auto;
}

.zone {
  cursor: pointer;
}

.zone:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: currentColor;
}

.has-selection .zone {
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.probe-text {
  font-size: 0.9rem;
  color: var(--sov-accent);
  margin-bottom: 15px;
  font-style: italic;
  animation: fadeIn 0.3s ease;
}

.probe-text-small {
  font-size: 0.75rem;
  color: var(--sov-accent);
  margin-bottom: 10px;
  opacity: 0.8;
}

.capacity {
  border-top-color: var(--sov-capacity);
}
.coherence {
  border-top-color: var(--sov-coherence);
}
.context {
  border-top-color: var(--sov-context);
}

.heli-pillar {
  border-top-color: var(--sov-earth);
}

.heli-visual-wrapper {
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.heli-well {
  position: relative;
  overflow: hidden;
}

.pulse-active {
  animation: well-pulse 1.5s infinite ease-in-out;
  border-color: var(--sov-earth);
  background: rgba(var(--sov-earth-rgb), 0.1);
}

@keyframes well-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 200, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 255, 200, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 200, 0);
  }
}

.ghost-math {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Space Mono", monospace;
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--sov-earth);
  text-shadow: 0 0 10px var(--sov-earth);
  pointer-events: none;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  padding: 5px 10px;
  border-radius: 4px;
}

.emulation-meter {
  margin-bottom: 20px;
  background: transparent;
  padding: 12px;
  border-radius: 8px;
}

.meter-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
  margin-bottom: 8px;
}

.meter-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sov-accent), var(--sov-coherence));
  transition: width 0.5s ease;
}

.lens-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.lens-header h3 {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 900;
  margin: 0;
  font-size: 1rem;
}

.whole-resonance {
  background: transparent;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.context-sections {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.coherence :deep(.context-group) {
  border-left-color: rgba(var(--sov-coherence-rgb), 0.1);
}

.coherence :deep(.group-title) {
  color: var(--sov-coherence);
}

.heli-pillar :deep(.context-group) {
  border-left-color: rgba(var(--sov-earth-rgb), 0.1);
}

.heli-pillar :deep(.group-title) {
  color: var(--sov-earth);
}

.capacity :deep(.variable-tag.assigned-tag:hover) {
  background: rgba(var(--sov-capacity-rgb), 0.15);
  border-color: var(--sov-capacity);
  color: var(--sov-capacity);
}

.context :deep(.variable-tag.assigned-tag) {
  border-color: var(--sov-context);
}

.coherence :deep(.variable-tag.assigned-tag) {
  border-color: var(--sov-coherence);
  background: rgba(var(--sov-coherence-rgb), 0.05);
}

.coherence :deep(.variable-tag.assigned-tag.active) {
  background: rgba(var(--sov-coherence-rgb), 0.2);
  border-color: var(--sov-coherence);
}

.coherence :deep(.remove-icon:hover) {
  background: var(--sov-coherence);
  color: black;
}

.residue-dock {
  grid-column: 1 / span 4;
  margin-top: 0;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  max-height: 180px;
  overflow-y: auto;
}

.dock-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.5;
  margin-bottom: 12px;
  text-align: center;
}

.bubble-stream {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.fragment-bubble {
  padding: 10px 20px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--sov-text);
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fragment-bubble:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.fragment-bubble.selected {
  background: var(--sov-accent);
  color: black;
  border-color: var(--sov-accent);
  box-shadow: 0 0 20px var(--sov-accent);
  transform: scale(1.1);
}

.empty-dock {
  opacity: 0.4;
  font-style: italic;
  font-size: 0.9rem;
}

.empty-state {
  font-size: 0.8rem;
  opacity: 0.3;
  font-style: italic;
  padding: 10px;
}

.stability-readout {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 10px currentColor;
}

.lens-actions {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.add-cue-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: var(--sov-text);
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.add-cue-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--sov-context);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
