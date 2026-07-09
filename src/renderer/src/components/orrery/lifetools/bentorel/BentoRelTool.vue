<template>
  <div class="bento-rel-tool">
    <!-- Mode Controls -->
    <div class="tool-header">
      <h3>BentoRel Module v1</h3>
      <div class="toggle-group">
        <button 
          :class="{ active: currentMode === 'tabular' }" 
          @click="currentMode = 'tabular'"
        >
          Tabular Matrix
        </button>
        <button 
          :class="{ active: currentMode === 'contextual' }" 
          @click="currentMode = 'contextual'"
        >
          In-Place Context
        </button>
      </div>
    </div>

    <!-- MODE 1: THREE-COLUMN STRUCTURAL MATRIX -->
    <div v-if="currentMode === 'tabular'" class="matrix-grid">
      <!-- Left Column: Source Cues -->
      <div class="matrix-column">
        <h4>Source Cue / Biomarker</h4>
        <div class="list-wrapper">
          <div 
            v-for="cue in availableCues" 
            :key="'src-' + cue.id"
            :class="{ selected: activeRelation.sourceId === cue.id }"
            @click="activeRelation.sourceId = cue.id"
            class="cue-item"
          >
            {{ cue.label }} <span class="tag">{{ cue.type }}</span>
          </div>
        </div>
      </div>

      <!-- Center Column: Relation Primitives -->
      <div class="matrix-column central-conduit">
        <h4>Relationship Type</h4>
        <div class="list-wrapper">
          <div 
            v-for="relType in relationshipTypes" 
            :key="relType.value"
            :class="{ selected: activeRelation.type === relType.value }"
            @click="activeRelation.type = relType.value"
            class="rel-type-item"
          >
            {{ relType.label }}
          </div>
        </div>
        <button 
          :disabled="!isRelationReady" 
          @click="commitRelation" 
          class="commit-btn"
        >
          Forge Relation 🔗
        </button>
      </div>

      <!-- Right Column: Target Cues / Table Columns -->
      <div class="matrix-column">
        <h4>Target Destination</h4>
        <div class="list-wrapper">
          <div 
            v-for="cue in availableCues" 
            :key="'tgt-' + cue.id"
            :class="{ selected: activeRelation.targetId === cue.id }"
            @click="activeRelation.targetId = cue.id"
            class="cue-item"
          >
            {{ cue.label }} <span class="tag">{{ cue.type }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 2: IN-PLACE CONTEXTUAL / HIERARCHY SELECTOR -->
    <div v-if="currentMode === 'contextual'" class="context-panel">
      <p class="instruction-text">
        Select an isolated cue block to establish its positional hierarchy and parent alignment.
      </p>
      
      <div class="selector-row">
        <label>Focus Cue:</label>
        <select v-model="contextState.selectedCueId">
          <option value="" disabled>Choose a cue node...</option>
          <option v-for="cue in availableCues" :key="cue.id" :value="cue.id">
            {{ cue.label }}
          </option>
        </select>
      </div>

      <div v-if="contextState.selectedCueId" class="hierarchy-builder">
        <div class="action-card">
          <h5>Nest Under Parent (Hierarchy)</h5>
          <select v-model="contextState.parentId" @change="assignHierarchy">
            <option value="">[ No Parent - Core Root ]</option>
            <option 
              v-for="cue in remainingCues" 
              :key="'parent-' + cue.id" 
              :value="cue.id"
            >
              {{ cue.label }}
            </option>
          </select>
        </div>

        <div class="action-card">
          <h5>Sequence Order</h5>
          <div class="order-controls">
            <button @click="adjustOrder(-1)">▲ Move Up</button>
            <span class="order-badge">Rank Index: {{ getCurrentRank }}</span>
            <button @click="adjustOrder(1)">▼ Move Down</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

// V1 Reactive Cues-Mantle Interface Props or Emit mappings
const props = defineProps({
  availableCues: { type: Array, required: true }, // Array of { id, label, type }
  relationsStore: { type: Array, required: true } // Array of current { source, target, type }
});

const emit = defineEmits(['relationForged', 'hierarchyUpdated']);

const currentMode = ref('tabular'); // 'tabular' or 'contextual'

// State configuration for Mode 1
const activeRelation = reactive({
  sourceId: '',
  targetId: '',
  type: 'maps_to_column'
});

const relationshipTypes = [
  { label: 'Maps to DB Column', value: 'maps_to_column' },
  { label: 'Modulates State', value: 'modulates' },
  { label: 'Is Sub-Cadence Of', value: 'is_sub_cadence_of' },
  { label: 'Triggers Emulation', value: 'triggers_emulation' }
];

// State configuration for Mode 2
const contextState = reactive({
  selectedCueId: '',
  parentId: ''
});

// Computed properties for validation
const isRelationReady = computed(() => {
  return activeRelation.sourceId && 
         activeRelation.targetId && 
         activeRelation.sourceId !== activeRelation.targetId;
});

const remainingCues = computed(() => {
  return props.availableCues.filter(c => c.id !== contextState.selectedCueId);
});

const getCurrentRank = computed(() => {
  const cue = props.availableCues.find(c => c.id === contextState.selectedCueId);
  return cue?.rank || 0;
});

// Structural Actions
function commitRelation() {
  if (!isRelationReady.value) return;
  
  const payload = { ...activeRelation, timestamp: Date.now() };
  emit('relationForged', payload);
  
  // Clear choices for next cycle
  activeRelation.sourceId = '';
  activeRelation.targetId = '';
}

// Spatial Hierarchy Actions
function assignHierarchy() {
  emit('hierarchyUpdated', {
    cueId: contextState.selectedCueId,
    parentId: contextState.parentId,
    action: 'reparent'
  });
}

function adjustOrder(direction) {
  emit('hierarchyUpdated', {
    cueId: contextState.selectedCueId,
    direction: direction,
    action: 'reorder'
  });
}
</script>

<style scoped>
.bento-rel-tool {
  background: #121214;
  color: #e2e8f0;
  border: 1px solid #2d3748;
  border-radius: 8px;
  padding: 16px;
  font-family: monospace;
}
.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #2d3748;
  padding-bottom: 12px;
  margin-bottom: 16px;
}
.toggle-group button {
  background: #1a202c;
  color: #a0aec0;
  border: 1px solid #4a5568;
  padding: 6px 12px;
  cursor: pointer;
}
.toggle-group button.active {
  background: #3182ce;
  color: white;
  border-color: #3182ce;
}
.matrix-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 16px;
}
.matrix-column {
  background: #1a202c;
  border-radius: 4px;
  padding: 12px;
}
.list-wrapper {
  max-height: 250px;
  overflow-y: auto;
}
.cue-item, .rel-type-item {
  padding: 8px;
  margin: 4px 0;
  background: #2d3748;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
.cue-item:hover, .rel-type-item:hover {
  background: #4a5568;
}
.cue-item.selected, .rel-type-item.selected {
  border-left: 4px solid #3182ce;
  background: #2b6cb0;
}
.central-conduit {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.commit-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 12px;
}
.commit-btn:disabled {
  background: #4a5568;
  opacity: 0.5;
  cursor: not-allowed;
}
.tag {
  font-size: 10px;
  background: #4a5568;
  padding: 2px 4px;
  border-radius: 3px;
  float: right;
}
.hierarchy-builder {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}
.action-card {
  background: #1a202c;
  padding: 12px;
  border-radius: 4px;
}
.order-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
select {
  width: 100%;
  padding: 8px;
  background: #2d3748;
  color: white;
  border: 1px solid #4a5568;
}
</style>