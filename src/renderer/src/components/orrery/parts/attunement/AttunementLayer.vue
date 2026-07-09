<template>
  <div v-if="storeBesearch.isAttunementLayerOpen || storeBesearch.besearchMode === 'heli' || storeBesearch.besearchMode === 'graft'" class="attunement-layer-container">
    <!-- 1. The Full Attunement View -->
    <div v-if="storeBesearch.isAttunementExpanded" class="lens-box coherence standalone-attunement">
      <header class="lens-header standalone-header">
        <div class="header-main">
          <div class="header-left">
            <span class="pulse-dot"></span>
            <h3>Attunement</h3>
            <div v-if="activeStrandItems.length > 0" class="strand-context-mini">
              <span class="label">Strand:</span>
              <span class="value">{{ activeStrandItems.join(", ") }}</span>
            </div>
            <button class="add-btn" @click="addAttunementSlot" title="Add Attunement Slot">+</button>
          </div>
          <div class="header-right">
            <button class="collapse-btn" @click="storeBesearch.isAttunementExpanded = false">▼</button>
          </div>
        </div>
      </header>

      <div class="attunement-content">
        <div class="attunement-slots">
          <div 
            v-for="(slot, index) in attunementSlots" 
            :key="index"
            class="attunement-slot-item"
          >
            <div class="slot-main-row">
              <button 
                class="set-attunement-btn" 
                :class="{ 'has-content': slot.label !== 'Set Attunement' }"
                @click="handleSlotClick(index)"
              >
                <span class="slot-icon">🎯</span>
                <span class="slot-label">{{ slot.label }}</span>
              </button>

              <select 
                v-model="slot.type" 
                class="type-select"
                @change="syncWithStore"
              >
                <option value="" disabled selected>Select Option</option>
                <option v-for="opt in actions" :key="opt" :value="opt">{{ opt }}</option>
              </select>

              <button class="lab-btn" @click="openGraftingSection" title="Set Graft">
                Set Graft ➔
              </button>

              <div class="slot-more-menu">
                <button class="more-btn" @click="toggleSlotMenu(index)">•••</button>
                <div v-if="activeMenuIndex === index" class="dropdown-menu">
                  <button @click="handleSlotClick(index)">✎ Edit</button>
                  <button @click="deleteAttunement(index)">× Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. The Attunement Bar (Collapsed) -->
    <div 
      v-else 
      class="attunement-collapsed-bar"
      @click="storeBesearch.isAttunementExpanded = true"
    >
      <div class="bar-content">
        <span class="bar-label">▼ Attunement</span>
        <div class="bar-summary">
          <span v-for="(slot, i) in activeSlots" :key="slot.label + '-' + i" class="summary-tag">
            {{ slot.label }}
          </span>
        </div>
        <button class="expand-icon">▲</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { loomStore } from "@/stores/loomStore.js";
import { besearchStore } from "@/stores/besearchStore.js";
import { useChatStore } from "@/stores/chatStore.js";
import { useOrbitStore } from "@/stores/orbitStore.js";

const storeAI = aiInterfaceStore();
const storeLoom = loomStore();
const storeBesearch = besearchStore();
const storeChat = useChatStore();
const orbitStore = useOrbitStore();

const actions = ["Improve", "Prevention", "Repair", "Rejuvenation"];
const activeMenuIndex = ref(null);

// Initial slots
const attunementSlots = ref([
  { label: "Set Attunement", value: "", type: "" }
]);

// Watch for cycle changes to restore local state
watch(
  () => storeBesearch.activeCycleId,
  (newId) => {
    const cycle = storeBesearch.activeCycle;
    if (cycle && cycle.state.attunement?.slots) {
      attunementSlots.value = JSON.parse(JSON.stringify(cycle.state.attunement.slots));
    }
  },
  { immediate: true }
);

const activeSlots = computed(() => attunementSlots.value.filter(s => s.label !== "Set Attunement"));

const activeStrandItems = computed(() => {
  const conduction = storeBesearch.evaluateConduction;
  if (!conduction) return [];
  return conduction.nodes || conduction.pipeline || [];
});

const addAttunementSlot = () => {
  attunementSlots.value.push({ label: "Set Attunement", value: "", type: "" });
};

const handleSlotClick = (index) => {
  console.log("Attunement slot clicked:", index);
  storeAI.attunementActiveIndex = index;
  storeAI.beebeeSidebarPrompt = "Please write about an attunement goals, targets or outcomes etc";
  storeAI.beebeeSidebarOpen = true;
  
  // Ensure interplay (ribbon mode) is active
  orbitStore.isInterplayActive = true;
  
  // Unroll the ribbon
  storeChat.isUnrolled = true;
  activeMenuIndex.value = null;
};

const toggleSlotMenu = (index) => {
  activeMenuIndex.value = activeMenuIndex.value === index ? null : index;
};

const openGraftingSection = () => {
  storeBesearch.setHUUDState('graft');
};

const openSculptingLab = () => {
  storeBesearch.setHUUDState('besearch');
};

const handleBeebeeInput = (event) => {
  const { text, activeIndex } = event.detail;
  if (activeIndex !== null && attunementSlots.value[activeIndex]) {
    const words = text.split(/\s+/);
    const label = words.slice(0, 4).join(" ");
    
    attunementSlots.value[activeIndex] = {
      label: label,
      value: text,
      type: attunementSlots.value[activeIndex]?.type || ""
    };
    syncWithStore();
  }
};

onMounted(() => {
  window.addEventListener('beebee-input-submitted', handleBeebeeInput);
});

onUnmounted(() => {
  window.removeEventListener('beebee-input-submitted', handleBeebeeInput);
});

const deleteAttunement = (index) => {
  attunementSlots.value[index] = { label: "Set Attunement", value: "", type: "" };
  activeMenuIndex.value = null;
  syncWithStore();
};

const selectAction = (action) => {
  storeLoom.updateResonWeight(action, "attunement", "Attunement");
};

const buildBesearchCycles = () => {
  storeBesearch.setHUUDState('besearch');
};

const syncWithStore = () => {
  const activeAttunements = attunementSlots.value
    .filter(slot => slot.label !== "Set Attunement")
    .map(slot => ({ 
      label: slot.type || "Attunement", 
      value: slot.label, 
      type: slot.type
    }));
  
  // Sync to Active Cycle (Strand)
  if (storeBesearch.activeCycle) {
    storeBesearch.syncActiveCycleState('attunement', { 
      slots: JSON.parse(JSON.stringify(attunementSlots.value)) 
    });
  }

  if (activeAttunements.length > 0) {
    // Sync each active one
    activeAttunements.forEach(item => {
      storeLoom.updateResonWeight(item.value, "attunement", item.label);
    });
  } else {
    const existing = storeLoom.lifestrapTexture?.pillars?.attunement || [];
    existing.forEach(item => {
      storeLoom.updateResonWeight(item.value, "residue");
    });
  }
};
</script>

<style scoped>
.attunement-layer-container {
  width: 100%;
  margin-top: 10px;
}

.standalone-attunement {
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #a685ff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #1a202c;
  position: relative;
  z-index: 1;
}

/* Standalone header override */
.lens-header h3 {
  color: #a685ff !important;
}

.lens-header {
  margin-bottom: 20px;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.attunement-content {
  display: flex;
  gap: 30px;
}

.attunement-slots {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.attunement-slot-item {
  width: 100%;
}

.slot-main-row {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.type-select {
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(166, 133, 255, 0.3);
  border-radius: 12px;
  color: #1a202c;
  font-weight: 600;
  outline: none;
}

.lab-btn {
  background: #1a202c;
  color: #00ffcc;
  border: 1px solid #00ffcc;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.lab-btn:hover {
  background: #00ffcc;
  color: #1a202c;
}

.slot-more-menu {
  position: relative;
}

.more-btn {
  background: transparent;
  border: none;
  color: #718096;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px 10px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #1a202c;
  border: 1px solid rgba(166, 133, 255, 0.3);
  border-radius: 8px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 10;
  min-width: 100px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dropdown-menu button {
  background: transparent;
  border: none;
  color: white;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.85rem;
}

.dropdown-menu button:hover {
  background: rgba(166, 133, 255, 0.2);
}

.set-attunement-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(166, 133, 255, 0.3);
  border-radius: 12px;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s;
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.set-attunement-btn.has-content {
  background: rgba(166, 133, 255, 0.1);
  border-style: solid;
  border-color: #a685ff;
  color: #1a202c;
}

.slot-actions {
  display: flex;
  gap: 5px;
}

.action-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  opacity: 0.6;
}

.action-icon:hover {
  opacity: 1;
}

.attunement-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.attunement-collapsed-bar {
  background: rgba(166, 133, 255, 0.1);
  border: 1px solid rgba(166, 133, 255, 0.3);
  border-radius: 12px;
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bar-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.bar-label {
  font-weight: 700;
  color: #a685ff;
  font-size: 0.9rem;
}

.bar-summary {
  display: flex;
  gap: 8px;
  margin-left: 15px;
}

.summary-tag {
  background: rgba(166, 133, 255, 0.2);
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 0.7rem;
  color: #1a202c;
}

.add-btn {
  background: #a685ff;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.strand-context-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 255, 204, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 204, 0.2);
  margin-left: 10px;
}

.strand-context-mini .label {
  font-size: 0.6rem;
  font-weight: 900;
  color: #00ffcc;
  text-transform: uppercase;
}

.strand-context-mini .value {
  font-size: 0.7rem;
  color: #1a202c;
  font-family: "Space Mono", monospace;
}

.build-besearch-btn {
  background: #1a202c;
  color: #00ffcc;
  border: 1px solid #00ffcc;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  cursor: pointer;
}

.collapse-btn, .expand-icon {
  background: transparent;
  border: none;
  color: #a685ff;
  cursor: pointer;
  font-size: 1.1rem;
}

/* Beebee Overlay */
.beebee-prompt-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  z-index: 100;
}

.beebee-bubble {
  background: #1a202c;
  border: 1px solid #a685ff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.beebee-bubble p {
  color: #a685ff;
  font-family: "Space Mono", monospace;
  margin-bottom: 20px;
}

.input-wrapper input {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(166,133,255,0.3);
  padding: 12px;
  color: #1a202c;
  border-radius: 10px;
  outline: none;
}

.beebee-slide-enter-active {
  animation: slide-down 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes slide-down {
  from { transform: translate(-50%, -150%); opacity: 0; }
  to { transform: translate(-50%, -50%); opacity: 1; }
}
/* Beebee cleanup - styles moved to beebeeView.vue */
</style>
