<template>
  <div id="life-tools-nav" v-bind:class="{ border: props.isExpanded === true }">
    <div class="spiral-container">
      <div class="spiral"></div>
    </div>
    <div id="mode-selector">
      <h3>Worlds</h3>
      <div class="world-switcher">
        <div
          v-for="world in worlds"
          :key="world.id"
          class="world-icon"
          :class="{ active: modelValue === world.id }"
          @click="selectWorld(world.id)"
        >
          {{ world.icon }}
        </div>
        <div
          class="world-icon sculpting-trigger"
          @click="storeBesearch.openSculptingLayer()"
          title="Sculpting Lab"
        >
          🛠️
        </div>
      </div>
      <div id="world-tools">
        <div class="orbit-tools" v-if="activeWorld === 'orbit'">
          Orbit tools please
        </div>
        <div
          class="orbit-tools"
          v-if="activeWorld === 'body' || activeWorld === 'earth'"
        >
          <div class="mode-toggle">
            <button
              :class="{ active: storeAI.interactionMode === 'lens' }"
              @click="storeAI.interactionMode = 'lens'"
            >
              🔍 Lens
            </button>
            <button
              :class="{ active: storeAI.interactionMode === 'tools' }"
              @click="storeAI.interactionMode = 'tools'"
            >
              ✏️ Tools
            </button>
          </div>

          <div v-if="storeAI.interactionMode === 'tools'" class="drawing-tools">
            <button @click="startDrawing">
              {{
                activeWorld === "earth"
                  ? "📏 Trace River / building"
                  : "Draw Cue Area"
              }}
            </button>

            <button v-if="activeWorld === 'earth'" @click="startTagging">
              🎯 Tag Location
            </button>

            <div
              class="cue-selection"
              v-if="hasDrawing && activeWorld === 'body'"
            >
              <label for="cue-select">Select Cue:</label>
              <select id="cue-select" v-model="selectedCueId">
                <option value="" disabled>-- Choose a Cue --</option>
                <option
                  v-for="cue in storeCues.cuesList"
                  :key="cue.key"
                  :value="cue.key"
                >
                  {{ cue.value.concept.name }}
                </option>
              </select>
            </div>

            <button
              v-if="activeWorld === 'body'"
              @click="saveCueLocation"
              :disabled="!hasDrawing || !selectedCueId"
            >
              Save Location
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Life-Strap Section -->
    <div class="accordion-section">
      <button
        class="accordion-header"
        @click="toggleSection('lifestrap')"
        :class="{ active: expandedSection === 'lifestrap' }"
      >
        <span>Life-straps</span>
        <span class="toggle-icon">{{
          expandedSection === "lifestrap" ? "▼" : "▶"
        }}</span>
      </button>
      <div v-if="expandedSection === 'lifestrap'" class="accordion-content">
        <div class="new-lifestrap-story">
          <button new-lifestrap-story @click="newLifeStrapStory()">
            New LifeStrap Story
          </button>
        </div>
        <LifeStrapNode
          v-for="strap in storeLibrary.straps"
          :key="strap.key"
          :strap="strap"
          :expanded="props.isExpanded"
          @select="handleStrapSelect"
          @delete="handleStrapDelete"
        />
      </div>
    </div>

    <!-- Attunement Section -->
    <div class="accordion-section">
      <button
        class="accordion-header"
        @click="toggleSection('interventions')"
        :class="{ active: expandedSection === 'interventions' }"
      >
        <span>Attunement</span>
        <span class="toggle-icon">{{
          expandedSection === "interventions" ? "▼" : "▶"
        }}</span>
      </button>
      <div v-if="expandedSection === 'interventions'" class="accordion-content">
        <attunement-type></attunement-type>
      </div>
    </div>

    <!-- Besearch Section -->
    <div class="accordion-section">
      <button
        class="accordion-header"
        @click="toggleSection('besearch')"
        :class="{ active: expandedSection === 'besearch' }"
      >
        <span>Besearch</span>
        <span class="toggle-icon">{{
          expandedSection === "besearch" ? "▼" : "▶"
        }}</span>
      </button>
      <div v-if="expandedSection === 'besearch'" class="accordion-content">
        <besearch-controls />
      </div>
    </div>

    <!-- Instruments Section -->
    <div class="accordion-section">
      <button
        class="accordion-header"
        @click="toggleSection('instruments')"
        :class="{ active: expandedSection === 'instruments' }"
      >
        <span>Instruments</span>
        <span class="toggle-icon">{{
          expandedSection === "instruments" ? "▼" : "▶"
        }}</span>
      </button>
      <div v-if="expandedSection === 'instruments'" class="accordion-content">
        <BentoInstruments />
      </div>
    </div>

    <!-- Navigation Section -->
    <div class="accordion-section">
      <button
        class="accordion-header"
        @click="toggleSection('navigation')"
        :class="{ active: expandedSection === 'navigation' }"
      >
        <span>Navigation</span>
        <span class="toggle-icon">{{
          expandedSection === "navigation" ? "▼" : "▶"
        }}</span>
      </button>
      <div
        v-if="expandedSection === 'navigation'"
        class="accordion-content"
        id="peer-navigation"
      >
        <div class="directional-buttons">
          <button @click="movePeer('up')" class="direction-button up">↑</button>
          <div class="horizontal-buttons">
            <button @click="movePeer('left')" class="direction-button left">
              ←
            </button>
            <button @click="movePeer('right')" class="direction-button right">
              →
            </button>
          </div>
          <button @click="movePeer('down')" class="direction-button down">
            ↓
          </button>
        </div>
        <div class="control-buttons">
          <button @click="startPeer" class="control-button">Start</button>
          <button @click="stopPeer" class="control-button">Stop</button>
          <button @click="intervene" class="control-button">Attunement</button>
        </div>
        <div class="navigation-instructions">
          <p>Use arrow keys or buttons to navigate the peer</p>
        </div>
      </div>
    </div>

    <!-- Time Section -->
    <!--<div class="accordion-section">
      <button
        class="accordion-header"
        @click="toggleSection('time')"
        :class="{ active: expandedSection === 'time' }"
      >
        <span>Time</span>
        <span class="toggle-icon">{{
          expandedSection === "time" ? "▼" : "▶"
        }}</span>
      </button>
      <div
        v-if="expandedSection === 'time'"
        class="accordion-content"
        id="time-cycles"
      >
        <button id="besearch-cycles-time" @click="besearchTime()">time</button>
        <div id="cycle-periods" v-if="btoolsTime === true">
          <div class="cycle-period">1 cycles</div>
          <div class="cycle-period">10 cycles</div>
          <div class="cycle-period">20 cycles</div>
          <div class="cycle-period">30 cycles</div>
          <div class="cycle-period">1 orbit year</div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import LifeStrapNode from "@/components/orbit/lifetools/LifeStrapNode.vue";
import BesearchControls from "@/components/orbit/lifetools/besearchControls.vue";
import AttunementType from "@/components/besearch/attunement/attunementType.vue";
import BentoInstruments from "@/components/orbit/instruments/bentoInstruments.vue";

import { libraryStore } from "@/stores/libraryStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { besearchStore } from "@/stores/besearchStore.js";
import { cuesStore } from "@/stores/cuesStore.js";

const storeLibrary = libraryStore();
const storeAI = aiInterfaceStore();
const storeBesearch = besearchStore();
const storeCues = cuesStore();

const expandedSection = ref(null);

/** Handle section toggle */
const toggleSection = (section) => {
  expandedSection.value = expandedSection.value === section ? null : section;
};

/* props */
const props = defineProps({
  modelValue: String, // Active World
  isExpanded: Boolean,
  currentWidth: Number,
});

// EMITS: Notify PrimeInterface
const emit = defineEmits([
  "mode-selected",
  "peer-moved",
  "update:modelValue",
  "update:width",
  "update:isOpen",
  "startDrag",
  "start-drawing",
  "start-tagging",
  "save-cue",
  "lifestrap-selected",
]);

/** Handle life-strap selection */
const handleStrapSelect = (strapData) => {
  // Update AIstore with active life-strap info
  storeAI.setActiveLifeStrap(strapData);

  /*
    make routine within aiStore?
   if (strapData.activeCues && strapData.activeCues.length > 0) {
    for (const cue of strapData.activeCues) {
      // Handle "capacity-orbits" format
      if (cue.startsWith("capacity-")) {
        lensData.capacity.push(cue.replace("capacity-", ""));
      } else if (cue.startsWith("context-")) {
        lensData.context.push(cue.replace("context-", ""));
      } else if (cue.startsWith("coherence-")) {
        lensData.coherence.push(cue.replace("coherence-", ""));
      } else {
        // Handle simple cue like "posture" - add to capacity as default
        lensData.capacity.push(cue);
      }
    }
  } else if (strapData.name) {
    // Fallback: extract keywords from name
    const name = strapData.name.toLowerCase();
    if (name.includes("swim") || name.includes("swimming")) {
      lensData.capacity.push("400m Performance");
      lensData.context.push("Aquatic Environment");
    }
    if (name.includes("posture")) {
      lensData.capacity.push("Spinal Alignment");
      lensData.context.push("Sitting Position");
    }
    if (name.includes("longevity")) {
      lensData.capacity.push("Cellular Resilience");
      lensData.coherence.push("Metabolic Balance");
    }
  }

  storeAI.digestInput = lensData;

  // Also set the chat attention to the life-strap ID so chat switches to that
  storeAI.chatAttention = strapData.id;
  storeAI.beebeeContext = "lifestrap";

  // Open the bottom panel to show detail
  storeBesearch.showBottomPanel = true;
  storeBesearch.bottomHeight = 400;

  // Emit to parent components (for worlds switching)
  emit("lifestrap-selected", strapData);
  */
};

/** Handle life-strap deletion */
const handleStrapDelete = (strapKey) => {
  console.log("Life strap delete requested for key:", strapKey);
  // Optional: Add confirmation dialog here
  storeLibrary.removeLSContract(strapKey, "private");
};

let btoolsTime = ref(false);
let selectedMode = ref("cues");

const worlds = [
  { id: "orbit", label: "Standard Orbit", icon: "🌌" },
  { id: "body", label: "Human Body", icon: "👤" },
  { id: "earth", label: "Earth Context", icon: "🌍" },
];

/* computed */
const activeWorld = computed(() => {
  return storeAI.activeWorld;
});

/** methods */
const besearchTime = () => {
  btoolsTime.value = !btoolsTime.value;
};

const newLifeStrapStory = () => {
  console.log("new life strap story");
  // clear worlds and go back to orbit resonancePulse ghost mode
  // open up beebee with lifestrap reply, please tell me about a life-strap story
  storeAI.newLifestrap = true;
  storeAI.beebeeContext = "lifestrap";
  storeAI.chatAttention = "new";
  // send save message to HOP
  // storeLibrary.createLifeStrap();
  storeAI.currentMode = "zen";
  // clear input
  storeAI.askQuestion.text = "";
};

const selectMode = (mode) => {
  selectedMode.value = mode;
  // Emit event to parent component to update canvas
  emit("mode-selected", mode);
};

const selectWorld = (worldId) => {
  emit("update:modelValue", worldId);
  storeAI.currentMode = false;
  storeAI.interactionMode = "lens"; // Reset to lens on world change
  if (worldId === "body") {
    storeBesearch.setNexusWorld("body");
  } else if (worldId === "orbit") {
    console.log("orbit");
    storeAI.currentMode = "zen";
  }
};

// Peer navigation methods
const movePeer = (direction) => {
  let peerDirection = { x: 0, y: 0 };

  switch (direction) {
    case "up":
      peerDirection.y = -1;
      break;
    case "down":
      peerDirection.y = 1;
      break;
    case "left":
      peerDirection.x = -1;
      break;
    case "right":
      peerDirection.x = 1;
      break;
  }

  // Emit event with direction
  emit("peer-moved", {
    direction: peerDirection,
    isMoving: true,
  });

  // Reset direction after a short delay to simulate button press
  setTimeout(() => {
    emit("peer-moved", {
      direction: { x: 0, y: 0 },
      isMoving: false,
    });
  }, 100);
};

const startPeer = () => {
  // Start peer movement with current direction (if any)
  emit("peer-moved", {
    direction: { x: 0, y: 0 }, // No specific direction, just start
    isMoving: true,
  });
};

const stopPeer = () => {
  // Stop peer movement
  emit("peer-moved", {
    direction: { x: 0, y: 0 },
    isMoving: false,
  });
};

const intervene = () => {
  // Implement intervention logic here
  console.log("Peer intervention initiated");
  // You can add more specific intervention logic as needed
  emit("peer-intervention");
};

const hasDrawing = ref(false);
const selectedCueId = ref("");

const startDrawing = () => {
  console.log("Start drawing mode");
  hasDrawing.value = true; // Mocking completion for now
  emit("start-drawing");
};

const startTagging = () => {
  console.log("Start tagging mode");
  emit("start-tagging");
};

const saveCueLocation = () => {
  console.log("Save cue location", selectedCueId.value);
  emit("save-cue", selectedCueId.value);
  hasDrawing.value = false;
  selectedCueId.value = "";
};
</script>

<style scoped>
#life-tools-nav {
  height: auto;
  min-height: 100%;
}

.active {
  background-color: #4a6fa5;
  color: white;
  font: 1.2em;
}

@media (min-width: 1024px) {
  #life-tools-nav {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background-color: #f0f4f8;
    position: relative;
    height: auto;
    min-height: 100%;
    box-sizing: border-box;
  }

  .border {
    border-top: 1px solid rgb(210, 210, 238);
    border-right: 1px solid rgb(210, 210, 238);
    border-bottom: 1px solid rgb(210, 210, 238);
    box-shadow: 5px 0 10px rgba(17, 11, 65, 0.5);
  }

  .spiral-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }

  .spiral {
    --b: 15px; /* border thickness */
    --s: 500px; /* preferred size shape */
    --c: rgba(228, 237, 247, 0.2); /* faint blue color */
    width: round(var(--s), 4 * var(--b));
    aspect-ratio: 1;
    border-radius: 50%;
    background:
      repeating-radial-gradient(
          calc(2 * var(--b)) at top,
          #0000 -1px,
          var(--c) 0 calc(50% - 1px),
          #0000 50% calc(100% - 1px)
        )
        calc(50% + var(--b)) 100%,
      repeating-radial-gradient(
          calc(2 * var(--b)) at bottom,
          var(--c) -1px,
          #0000 0 calc(50% - 1px),
          var(--c) 50% calc(100% - 1px)
        )
        50% 0;
    background-size: 150% 50%;
    background-repeat: no-repeat;
    mask:
      radial-gradient(
          calc(1.5 * var(--b)) at calc(100% - var(--b) / 2) 0,
          #0000 calc(100% / 3),
          #000 calc(100% / 3 + 1px) 110%,
          #0000 0
        )
        calc(50% + var(--b) / 2) 100% / calc(3 * var(--b)) 50% exclude no-repeat,
      conic-gradient(#000 0 0);
  }

  #mode-selector {
    display: grid;
    grid-template-rows: auto auto auto;
    margin-top: 0px;
    margin-bottom: 1rem;
  }

  .mode-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .mode-button {
    display: grid;
    grid-template-rows: auto auto;
    align-items: center;
    justify-content: center;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px;
    font-size: 12px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .mode-button:hover {
    background-color: #9fb8d4;
  }

  .mode-icon {
    font-size: 24px;
    margin-bottom: 5px;
  }

  /* Accordion Styles */
  .accordion-section {
    margin-bottom: 0.5rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    padding: 10px 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .accordion-header:hover {
    background-color: #9fb8d4;
  }

  .accordion-header.active {
    background-color: #8fa9c6;
  }

  .toggle-icon {
    font-size: 12px;
    margin-left: auto;
  }

  .accordion-content {
    background-color: rgba(255, 255, 255, 0.05);
    padding: 10px;
    max-height: 400px;
    overflow-y: auto;
  }

  .placeholder-content {
    font-size: 12px;
    color: #666;
    font-style: italic;
    padding: 10px;
  }

  /* Peer Navigation Styles */
  #peer-navigation {
    margin-bottom: 0rem;
  }

  .directional-buttons {
    display: grid;
    grid-template-rows: auto auto auto;
    justify-items: center;
    margin-bottom: 1rem;
  }

  .horizontal-buttons {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5rem;
  }

  .direction-button {
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .direction-button:hover {
    background-color: #9fb8d4;
  }

  .control-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .control-button {
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .control-button:hover {
    background-color: #9fb8d4;
  }

  .navigation-instructions {
    font-size: 12px;
    color: #666;
    text-align: center;
  }

  #time-cycles {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  #besearch-cycles-time {
    display: inline-grid;
    height: 28px;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  #cycle-periods {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    margin-bottom: 1em;
  }

  .cycle-period {
    display: inline-grid;
    height: 28px;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  /* Interventions Styles */
  #interventions {
    margin-bottom: 0rem;
  }

  .world-switcher {
    display: grid;
    grid-template-columns: auto auto auto auto;
    padding: 10px;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 12px;
    margin: 1rem 0;
  }

  .mode-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
    margin-bottom: 10px;
  }

  .mode-toggle button {
    padding: 8px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    border-radius: 4px;
  }

  .mode-toggle button.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .drawing-tools {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .drawing-tools button {
    padding: 10px;
    background: #b8cde2;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .drawing-tools button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cue-selection {
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: white;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  .cue-selection select {
    padding: 5px;
    border-radius: 4px;
  }
}
</style>
