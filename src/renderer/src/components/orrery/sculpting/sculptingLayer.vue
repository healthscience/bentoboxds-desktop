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
            <!-- Button is now optional since the spine is reactive, but kept for manual checks -->
            <button v-if="activeTab === 'exoCue'" class="sculpt-btn secondary" @click="evaluatePeerConfidence()">CHECK COMPATIBILITY</button>
            <button v-if="activeTab === 'exoCue'" class="sculpt-btn primary" :disabled="!graftingConfidence.executable" @click="makeGraftExocue()">GRAFT exoCue</button>
            <button v-if="activeTab === 'HOPstory'" class="sculpt-btn primary" @click="makeHOPstory()">Send HOPstory</button>
          </div>
          <div id="feedback-save-exocue" v-if="exocueContractFeedback === true">
            Feedback message.
          </div>
          <!-- 2.3 The Lens (Right Panel: The Seer) -->
          <aside class="lab-panel seer-panel">
            <header class="panel-header">
              <div class="header-flex">
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
        <aside class="orgo-drawer" :class="{ open: isDrawerOpen, 'builder-expanded': newOGrefcont }">
          <header class="drawer-header" @click="isDrawerOpen = !isDrawerOpen">
            <h5>Grafting Seeds</h5>
            <span class="toggle-icon">{{ isDrawerOpen ? "←" : "→" }}</span>
          </header>
          <div class="drawer-content-container">
            <div class="seed-list" v-if="!showCuesPortal">
              <div class="seed-section">
                <div id="orgo-menu">
                  <h6>exoCues</h6>
                </div>
                <div
                  v-for="exocue in storeExoCue.organelles"
                  :key="exocue.key"
                  class="seed-item"
                  draggable="true"
                  @dragstart="handleSeedDragStart($event, exocue, 'exocue')"
                >
                  <div class="seed-info">
                    <span class="seed-name">{{ getDirectValue(exocue.contract.value.concept.cue)?.value.concept.datatype.concept.name }}</span>
                    <span class="seed-edit">
                      <button @click.stop="toggleOrgoEdit(exocue.contract.key)">...</button>
                      <button v-if="editingOrgoKey === exocue.contract.key" class="delete-btn" @click.stop="deleteOrgo(exocue.contract.key)">Delete</button>
                    </span>
                  </div>
                </div>
              </div>
              <div class="seed-section">
                <div id="orgo-menu">
                  <h6>Orgos</h6>
                  <div id="new-orgo" @click.stop="buildOrgoGelleContract('orgo')">new</div>
                </div>
                <div
                  v-for="seed in storeOrgo.orgoMorphogens"
                  :key="seed.key"
                  class="seed-item"
                  draggable="true"
                  @dragstart="handleSeedDragStart($event, seed, 'orgo')"
                >
                  <div class="seed-info">
                    <span class="seed-name">{{ getOrgoValue(seed).value.concept.datatype.concept.name }}</span>
                    <span class="seed-edit">
                      <button @click.stop="toggleOrgoEdit(seed.contract.key)">...</button>
                      <button v-if="editingOrgoKey === seed.contract.key" class="delete-btn" @click.stop="deleteOrgo(seed.contract.key)">Delete</button>
                    </span>
                  </div>
                </div>
              </div>
              <div class="seed-section">
                <div id="orgo-menu">
                  <h6>Gelle</h6>
                  <div id="new-orgo" @click.stop="buildOrgoGelleContract('gelle')">new</div>
                </div>
                <div
                  v-for="texture in gelleStore.gelleMorphogens"
                  :key="texture.key"
                  class="seed-item"
                  draggable="true"
                  @dragstart="handleSeedDragStart($event, texture, 'gelle')"
                >
                  <div class="seed-info">
                    <span class="seed-name">{{ getGelleValue(texture).value.concept.datatype.concept.name }}</span>
                    <span class="seed-edit">
                      <button @click.stop="toggleGelleEdit(texture.id)">...</button>
                      <button v-if="editingGelleId === texture.id" class="delete-btn" @click.stop="deleteGelle(texture.id)">Delete</button>
                    </span>
                  </div>
                </div>
              </div>
              <div class="seed-section">
                <div id="instruments-menu">
                  <h6>Instruments</h6>
                  <div id="new-orgo" @click.stop="builNewInstrument('instrument')">new</div>
                  <div
                    v-if="storeLibrary.privateFileIndex.length > 0" v-for="file in storeLibrary.privateFileIndex"
                    :key="file.path"
                    class="seed-item"
                    draggable="true"
                    @dragstart="handleInstrumentDragStart($event, file, 'file')"
                    @click="snapOrgoToDevice(device)"
                  >
                    <div class="seed-info">
                      <span class="seed-name">{{ file.customMetadata.type.name }}</span>
                      <span class="seed-edit">
                        Edit
                      </span>
                    </div>
                  </div>

                </div>
                <div
                  v-for="device in activeInstruments"
                  :key="device.contract.key"
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
                    <span class="seed-name">{{ device.contract.value.concept.name }}</span>
                  </div>
                </div>
              </div>

              <div class="sculpt-actions-bottom">
                <button class="sculpt-btn secondary small">
                  [Search Commons]
                </button>
                <button class="sculpt-btn secondary small" @click.stop="buildOrgoGelleContract('orgo')">
                  [Author Seed]
                </button>
              </div>
            </div>
            <div id="cues-by-category" v-else >
              <CuesPortal @dragstart="handleCueDragStart" @select="handleCueSelect" />
            </div>
            <!-- expand out build contract tools for new orgo gelle -->
            <div id="contract-builders"> 
              <transition name="slide-panel">
                <div id="build-orgo-gelle" v-if="newOGrefcont === true && selectedOGtype === 'orgo'">
                  <build-orgo @close="closeRoutine" @save="handleSaveNewSeed" @toggle-cues="showCuesPortal = !showCuesPortal" :incomingCue="selectedCue"></build-orgo>
                </div>
              </transition>
              <transition name="slide-panel">
                <div id="build-orgo-gelle" v-if="newOGrefcont === true && selectedOGtype === 'gelle'">
                  <build-gelle @close="closeRoutine" @save="handleSaveNewSeed"></build-gelle>
                </div>
              </transition>
            </div>
          </div>
        </aside>

        <!-- 2.2 The Canvas (Center Stage: The Braid) -->
        <main class="lab-space-v2">
          <!-- new two tabs exoCue HOPstory -->
          <div class="tabs-container">
            <button class="tab-btn" :class="{ active: activeTab === 'exoCue' }" @click="activeTab = 'exoCue'">exoCue</button>
            <button class="tab-btn" :class="{ active: activeTab === 'HOPstory' }" @click="activeTab = 'HOPstory'">HOPstory</button>
          </div>

          <div class="canvas-stage-v2" v-if="activeTab === 'exoCue'">
            <section id="exocue-ref-contract">
              <div>exoCue Name: <span v-if="validCueOrgoGellPair.length > 0">{{ getDirectValue(validCueOrgoGellPair).value.concept.datatype.concept.name }}</span><span v-else class="pending-cue">Pending Pairing...</span></div>
              <div v-if="validationReason" class="validation-error">{{ validationReason }}</div>
            </section>
            
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
                      <span class="instance-name">{{ getOrgoValue(orgo).value.concept.datatype.concept.name }}</span>
                    </div>
                    <div class="instance-header">
                      <div class="orgo-gelle-contracts">
                        <div class="contract-item">
                          Inputs: <span class="instance-name">{{ orgo.contract.value.computational.conduction_map.inputs }}</span>
                        </div>
                        <div class="contract-item">
                          Outputs: <span class="instance-name">{{ orgo.contract.value.computational.conduction_map.outputs }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="instance-header">
                      <span class="instance-name">{{ orgo.contract.value.computational.executable }}</span>
                    </div>
                    <bento-code-editor :modelValue="orgo.contract.value.computational.executable" @update:modelValue="orgoExecutableCode = $event" />
                  </div>
                </section>

                <!-- THE VALIDATION SPINE -->
                <div class="validation-spine">
                  <div class="indicator-group" title="Cues Match">
                    <div class="indicator" :class="{ active: graftingConfidence.coherence }"></div>
                    <span class="indicator-label">Cue</span>
                  </div>
                  <div class="indicator-group" title="Conduction Map & I/O Valid">
                    <div class="indicator" :class="{ active: graftingConfidence.conduction }"></div>
                    <span class="indicator-label">Cond</span>
                  </div>
                  <div class="indicator-group" title="Syntax Ready for Orrery">
                    <div class="indicator" :class="{ active: graftingConfidence.executable }"></div>
                    <span class="indicator-label">Exe</span>
                  </div>
                </div>

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
                      <div class="instance-header">
                        <span class="instance-name">{{ getGelleValue(gelle).value.concept.datatype.concept.name }}</span>
                      </div>
                      <div class="instance-header">
                        <div class="orgo-gelle-contracts">
                          <div class="contract-item">
                            Inputs: <span class="instance-name">{{ gelle.contract.value.computational.conduction_map.inputs }}</span>
                          </div>
                          <div class="contract-item">
                            Outputs: <span class="instance-name">{{ gelle.contract.value.computational.conduction_map.outputs }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="instance-header">
                        <span class="instance-name">{{ gelle.contract.value.computational.executable }}</span>
                      </div>
                      <bento-code-editor :modelValue="gelle.contract.value.computational.executable" @update:modelValue="gelleExecutableCode = $event" />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <!-- HOPstory tab content -->
          <div class="hopstory-stage" v-if="activeTab === 'HOPstory'">
            <div class="lab-bay hopstory-bay" @drop.prevent="handleHopstoryDrop($event, 'exoCue')" @dragover.prevent>
              <header class="bay-header">
                <h4>exoCue</h4>
              </header>
              <div v-if="hopstoryItems.exoCue.length === 0" class="bay-placeholder">
                Drop exoCue Here
              </div>
              <div v-for="key in hopstoryItems.exoCue" :key="key" class="active-instance mini">
                <span class="instance-name">{{ key }}</span>
              </div>
            </div>

            <div class="lab-bay hopstory-bay" @drop.prevent="handleHopstoryDrop($event, 'Instrument')" @dragover.prevent>
              <header class="bay-header">
                <h4>Instrument</h4>
              </header>
              <div v-if="hopstoryItems.Instrument.length === 0" class="bay-placeholder">
                Drop Instrument Here
              </div>
              <div v-for="key in hopstoryItems.Instrument" :key="key" class="active-instance mini">
                <span class="instance-name">{{ key }}</span>
              </div>
            </div>

            <div class="lab-bay hopstory-bay" @drop.prevent="handleHopstoryDrop($event, 'emulation')" @dragover.prevent>
              <header class="bay-header">
                <h4>Emulation World</h4>
              </header>
              <div v-if="hopstoryItems.emulation.length === 0" class="bay-placeholder">
                Drop Emulation World Here
              </div>
              <div class="">emulation: {{ storeAI.activeWorld }}</div>
              <div v-for="key in hopstoryItems.emulation" :key="key" class="active-instance mini">
                <span class="instance-name">{{ key }}</span>
              </div>
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
import { useOrgoStore } from '@/stores/orgoStore.js'
import { useExocueStore } from '@/stores/exocueStore.js'
import { useGelleStore } from '@/stores/gelleStore.js'
import { useOverlayStore }from '@/stores/overlayStore.js' 
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { libraryStore } from "@/stores/libraryStore.js";

import BuildOrgo from "@/components/orrery/sculpting/build/orgoBuild.vue"
import BuildGelle from "@/components/orrery/sculpting/build/gelleBuild.vue"
import LifeStrapHorizon from "@/components/orrery/sculpting/LifeStrapHorizon.vue";
import CuesPortal from "@/components/orrery/parts/shared/CuesPortal.vue";
import BentoCodeEditor from "@/components/orrery/sculpting/build/codeView.vue"
import { lifestrapStore } from "@/stores/lifestrapStore.js";

const storeBesearch = besearchStore();
const storeCues = cuesStore();
const storeOrgo = useOrgoStore();
const gelleStore = useGelleStore();
const storeExoCue = useExocueStore()
const storeOverlay = useOverlayStore()
const storeAI = aiInterfaceStore();
const storeLifestrap = lifestrapStore();
const storeLibrary = libraryStore();

const isDarkMode = ref(false);
const isDrawerOpen = ref(true);
const newOGrefcont = ref(false)
const selectedOGtype = ref('')
const showCuesPortal = ref(false);
const selectedCue = ref('');
const editingOrgoKey = ref(null);
const editingGelleId = ref(null);
const validCueOrgoGellPair = ref('');
const validationReason = ref('');
let storyInstrument = ref(null)
let storyExocue = ref(null)

/* computed */
const exocueContractFeedback = (() => {
  return storeLibrary.contractExocueSuccess
})

const graftingConfidence = computed(() => {
  return storeExoCue.matchConfidence
});

const getOrgoValue = (item) => {
  const cueKey = item.contract.value.concept.orgocue;
  if (!cueKey) return '';
  return storeCues.getFullCue(cueKey) ?? '';
};

const getGelleValue = (item) => {
  const cueKey = item.contract.value.concept.gellecue;
  if (!cueKey) return '';
  return storeCues.getFullCue(cueKey) ?? '';
};

const getDirectValue = (itemKey) => {
  const cueKey = itemKey
  if (!cueKey) return '';
  return storeCues.getFullCue(cueKey) ?? '';
};

const toggleOrgoEdit = (key) => {
  editingOrgoKey.value = editingOrgoKey.value === key ? null : key;
};

const toggleGelleEdit = (id) => {
  editingGelleId.value = editingGelleId.value === id ? null : id;
};

const deleteOrgo = (key) => {
  editingOrgoKey.value = null;
  storeLibrary.deleteSeedContract(key, 'orgo')
};

const deleteGelle = (key) => {
  editingGelleId.value = null;
  storeLibrary.deleteSeedContract(key, 'gelle')
};

const handleCueDragStart = ({ event, word }) => {
  event.dataTransfer.setData("application/besearch-cue", word);
};

const handleCueSelect = (cue) => {
  selectedCue.value = cue.contract.value.concept.datatype.concept.name;
};

const isOpen = computed(() => {
  if (storeBesearch.besearchMode === 'graft') return true;
  return storeBesearch.isSculptingLayerOpen;
});

const activeOrgos = computed(() => storeOrgo.activeOrgos);
const activeGelles = computed(() => gelleStore.activeGelles);
const activeInstruments = computed(() => storeOverlay.conductionData);

const droppedInstruments = ref([]); 

const activeTab = ref('exoCue');
const hopstoryItems = ref({
  exoCue: [],
  Instrument: [],
  emulation: []
});

const handleHopstoryDrop = (e, part) => {
  let instrumentChosen = ''
  if (part === 'exoCue') {
    instrumentChosen = storyExocue.value;
  } else if (part === 'Instrument') {
    instrumentChosen = storyInstrument.value;
  }
  hopstoryItems.value[part].push(instrumentChosen)
};

const closeLayer = () => {
  storeBesearch.setHUUDState('lens');
};

const buildOrgoGelleContract = (refType) => {
  isDrawerOpen.value = true;
  selectedOGtype.value = refType
  newOGrefcont.value = true
  showCuesPortal.value = true
};

const handleSaveNewSeed = (seedData) => {
  newOGrefcont.value = false;
  selectedOGtype.value = '';
};

const handleSeedDragStart = (e, seed, type) => {
  storyExocue.value = seed.contract.key
};

const handleSeedDrop = (e, targetType) => {
  const rawData = e.dataTransfer.getData("application/besearch-seed");
  if (!rawData) return;
  const data = JSON.parse(rawData);
  if (data.type === targetType) {
    if (targetType === "orgo") {
      storeOrgo.instantiateOrgo(data.contract.key);
    } else {
      gelleStore.graftGelle(data.contract.key);
    }
  }
};

const handleInstrumentDragStart = (e, device) => {
  storyInstrument.value = device
  e.dataTransfer.setData(
    "application/besearch-instrument",
    JSON.stringify(device),
  );
};

const handleInstrumentDrop = (e, file) => {
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
};

const handleGraftDrop = (e, instanceId) => {
  const word = e.dataTransfer.getData("text/plain");
  if (word) {
    // Handling drops natively
  }
};

const snapOrgoToDevice = (device) => {
  if (activeOrgos.value.length > 0) {
    const firstOrgo = activeOrgos.value[0];
    firstOrgo.params.amplitude = 75;
    firstOrgo.params.wavelength = 40;
  }
};

// 3-Part Validation Evaluator
const evaluatePeerConfidence = () => {
  // Reset states
  storeExoCue.matchConfidence = { coherence: false, conduction: false, executable: false };
  validCueOrgoGellPair.value = '';
  validationReason.value = '';

  if (activeOrgos.value.length === 0 || activeGelles.value.length === 0) {
    return { valid: false, reason: 'Grafting requires at least one Orgo and one Gelle.' };
  }

  const allCues = [];

  // Gather & initial structural checks for Orgos
  for (const orgo of activeOrgos.value) {
    const cue = orgo.contract?.value?.concept?.orgocue;
    if (!cue) {
      validationReason.value = 'An Orgo is missing a concept cue.';
      return { valid: false, reason: validationReason.value };
    }
    allCues.push(cue);
  }

  // Gather & initial structural checks for Gelles
  for (const gelle of activeGelles.value) {
    const cue = gelle.contract?.value?.concept?.gellecue;
    if (!cue) {
      validationReason.value = 'A Gelle is missing a concept cue.';
      return { valid: false, reason: validationReason.value };
    }
    allCues.push(cue);
  }

  // Stage 1: Coherence Check
  const anchorCue = allCues[0];
  const isCoherent = allCues.every(cue => cue === anchorCue);

  if (!isCoherent) {
    validationReason.value = 'Concept Mismatch: All components must share the same cue.';
    return { valid: false, reason: validationReason.value };
  }
  
  storeExoCue.matchConfidence.coherence = true;
  const allComponents = [...activeOrgos.value, ...activeGelles.value];

  // Stage 2: Conduction Check
  const hasValidConduction = allComponents.every(compWrapper => {
    const comp = compWrapper.contract?.value?.computational;
    const hasConduction = comp?.conduction_map && Object.keys(comp.conduction_map).length > 0;
    const hasIO = comp?.inputs?.length > 0 && comp?.outputs?.length > 0;
    return hasConduction || hasIO;
  });

  if (!hasValidConduction) {
    validationReason.value = 'A component is missing inputs, outputs, or a conduction map.';
    return { valid: false, reason: validationReason.value };
  }
  
  storeExoCue.matchConfidence.conduction = true;

  // Stage 3: Executable Code Check (Pre-Orrery syntax check)
  const hasValidCode = allComponents.every(compWrapper => {
    const comp = compWrapper.contract?.value?.computational;
    if (!comp?.executable || comp.executable.trim() === '') {
      validationReason.value = `A component has a blank executable code block.`;
      return false;
    }
    try {
      new Function(comp.executable);
      return true;
    } catch (error) {
      validationReason.value = `Syntax error: ${error.message}`;
      return false;
    }
  });

  /*if (!hasValidCode) {
    return { valid: false, reason: validationReason.value };
  }*/
  
  storeExoCue.matchConfidence.executable = true;

  // 4. Success! Resolve human-readable name and clear errors
  const fullCue = storeCues.getFullCue(anchorCue);
  validCueOrgoGellPair.value = fullCue?.concept?.datatype?.concept?.name || anchorCue;
  validationReason.value = ''; 

  return { valid: true, cue: anchorCue };
};

// Reactively watch for state changes to automatically run validation
watch(
  [() => storeOrgo.activeOrgos, () => gelleStore.activeGelles],
  () => {
    evaluatePeerConfidence();
  },
  { deep: true }
);

watch(
  () => storeBesearch.activeCycleId,
  (newId) => {
    const cycle = storeBesearch.activeCycle;
    if (cycle && cycle.state.grafting) {
      storeOrgo.activeOrgos = JSON.parse(JSON.stringify(cycle.state.grafting.activeOrgos || []));
      gelleStore.activeGelles = JSON.parse(JSON.stringify(cycle.state.grafting.activeGelles || []));
      droppedInstruments.value = JSON.parse(JSON.stringify(cycle.state.grafting.droppedInstruments || []));
    }
  },
  { immediate: true }
);

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
  
  evaluatePeerConfidence(); // Initial evaluation check
});

const closeRoutine = () => {
  newOGrefcont.value = false;
  selectedOGtype.value = ''
  showCuesPortal.value = false
}

const makeGraftExocue = () => {
  // extract contract key only for save
  let orgoKeys = []
  let gelleKeys = []
  for (let aOrg of activeOrgos.value) {
    orgoKeys.push(aOrg.instanceId)
  }
  for (let aGelle of activeGelles.value) {
    gelleKeys.push(aGelle.instanceId)
  }
  let exoCueInfo = {}
  exoCueInfo.cue = validCueOrgoGellPair.value
  exoCueInfo.orgo = orgoKeys
  exoCueInfo.gelle = gelleKeys
  storeLibrary.prepareExocueContract(exoCueInfo)
}

const makeHOPstory = () => {
  // Structure the payload for the HOPstory from collected state
  let hopstoryData = {
    exoCue: hopstoryItems.value.exoCue,
    Instrument: hopstoryItems.value.Instrument,
    emulation: storeAI.activeWorld // hopstoryItems.value.emulation 
  }
  storeAI.prepareHOPstory(hopstoryData)
}

const builNewInstrument = () => {
  // open library
  storeLibrary.libraryStatus = true;
  storeAI.dataBoxStatus = true;
  storeAI.uploadStatus = false;
}

</script>

<style scoped>
/* Tabs and HOPstory Styles */
.tabs-container {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 25px;
}

.tab-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #00796b;
  background: transparent;
  color: #00796b;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Space Mono", monospace;
  text-transform: uppercase;
}

.tab-btn.active {
  background: #00796b;
  color: white;
}

.dark-theme .tab-btn {
  border-color: #00ffcc;
  color: #00ffcc;
}

.dark-theme .tab-btn.active {
  background: #00ffcc;
  color: #000;
}

.hopstory-stage {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}

/* Base Layer Styles */
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
  border: 2px solid darkblue;
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

.header-right {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 20px;
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
  height: 100%;
}

.orgo-drawer {
  width: 60px;
  background: rgba(237, 233, 225, 0.9);
  backdrop-filter: blur(5px);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.dark-theme .orgo-drawer {
  background: rgba(10, 10, 15, 0.9);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.orgo-drawer.open {
  width: 340px;
}

.orgo-drawer.open.builder-expanded {
  width: 760px;
}

.drawer-content-container {
  display: flex;
  width: 820px;
  height: 100%;
  overflow: hidden;
}

#orgo-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

#orgo-menu h6 {
  margin: 0;
}

#new-orgo {
  font-size: 0.65rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #00796b;
  cursor: pointer;
  background: rgba(0, 121, 107, 0.08);
  padding: 2px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.dark-theme #new-orgo {
  color: #00ffcc;
  background: rgba(0, 255, 204, 0.08);
}

#new-orgo:hover {
  background: rgba(0, 121, 107, 0.15);
  transform: scale(1.05);
}

.dark-theme #new-orgo:hover {
  background: rgba(0, 255, 204, 0.15);
}

#build-orgo-gelle {
  flex-shrink: 0;
  padding: 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.3);
  overflow-y: auto;
}

.dark-theme #build-orgo-gelle {
  border-left-color: rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.1);
}

#cues-by-category {
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid darkgoldenrod;
  width: 340px;  
}

/* builder forms */
#contract-builders {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  border: 2px solid red;
}

/* Slide Panel Transition */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.slide-panel-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-panel-leave-to {
  transform: translateX(-20px);
  opacity: 0;
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
  width: 340px;
  flex-shrink: 0;
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

.seed-info {
  display: grid;
  grid-template-columns: 4fr 1fr;
  width: 100%;
  align-items: center;
}

.seed-edit {
  display: flex;
  gap: 5px;
}

.seed-edit button {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  cursor: pointer;
  padding: 2px 6px;
  font-size: 0.7rem;
}

.dark-theme .seed-edit button {
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.seed-edit button.delete-btn {
  background: #ef5350;
  color: white;
  border: none;
}

.seed-item {
  display: grid;
  grid-template-columns: 1fr;
  width: 280px;
  overflow-x: hidden;
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

.seed-name {
  display: grid;
  width: 200px;
  overflow-x: hidden;
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
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 40px;
}

.canvas-stage-v2 {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 40px;
}

/* ExoCue Status Block */
#exocue-ref-contract {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 15px 25px;
  font-family: "Space Mono", monospace;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark-theme #exocue-ref-contract {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.pending-cue {
  color: #888;
  font-style: italic;
  font-weight: normal;
}

.validation-error {
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: normal;
}

/* Updated Logic Braid Layout to include the Spine */
.logic-braid-wrapper {
  display: grid;
  gap: 20px;
}

.logic-braid-top {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: stretch;
}

/* Validation Spine Styles */
.validation-spine {
  width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background: #111;
  border-radius: 25px;
  padding: 20px 5px;
  border: 2px solid #333;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}

.dark-theme .validation-spine {
  background: #0a0a0a;
  border-color: #222;
}

.indicator-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.indicator {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #333;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.indicator.active {
  background: #4ade80;
  box-shadow: 0 0 14px rgba(74, 222, 128, 0.8);
}

.indicator-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #888;
  font-family: "Space Mono", monospace;
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

.sculpt-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #888 !important;
  color: #888 !important;
}

.sculpt-btn.primary {
  background: #00796b;
  color: white;
}

.sculpt-btn.primary:disabled {
  background: #555 !important;
  color: #aaa !important;
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
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
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
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.7rem;
  cursor: pointer;
}

.remove-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  opacity: 0.5;
}

.remove-btn:hover {
  opacity: 1;
  color: #ef5350;
}
</style>