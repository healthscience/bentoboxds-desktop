<template>
  <!-- Besearch Cycle Toolbar -->
  <div class="cycle-toolbar">
    <div class="toolbar-header">
      <h3>{{ selectedCycle?.name || 'Besearch Cycle' }}</h3>
      <button class="close-btn" @click="closeCycleToolbar()">✕</button>
    </div>  
    <div class="toolbar-content">
      <div class="cycle-info">
        <div class="info-field">
          <label>Name:</label>
          <input v-model="cycleEditData.name" type="text" class="input-field" />
        </div>
        <div class="info-field">
          <label>Description:</label>
          <textarea v-model="cycleEditData.description" class="textarea-field" rows="3"></textarea>
        </div>
        <div class="info-field">
          <label>ResonAgent Status:</label>
          <select v-model="cycleEditData.active" class="select-field">
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>
      </div>
      <div class="linked-interventions">
        <h4>Linked Interventions ({{ cycleResonance.length }})</h4>
        <div v-if="cycleResonance.length" class="interventions-list">
          <div v-for="intervention in cycleResonance" :key="intervention.id" class="linked-item">
            <span>{{ intervention.name }}</span>
            <span class="status-badge" :class="getStatusClass(intervention.status)">
              {{ intervention.status }}
            </span>
          </div>
        </div>
        <div v-else class="empty-state">
          No interventions linked yet. Drag interventions near this cycle to link them.
        </div>
      </div>
    </div>
    <div class="toolbar-actions">
      <button class="action-btn primary" @click="saveCycleChanges()">Save Changes</button>
      <button class="action-btn" @click="duplicateCycle()">Duplicate</button>
      <button class="action-btn danger" @click="deleteCycle()">Delete</button>
    </div>
  </div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { besearchStore } from '@/stores/besearchStore.js'

const storeBesearch = besearchStore()

let cycleEditData = ref({
  name: '',
  description: '',
  active: true
})

/* computed */
const selectedCycle = computed(() => {
  console.log('selectedIntervention', storeBesearch.selectedIntervention)
  cycleEditData.value.name = storeBesearch.selectedIntervention?.name || ''
  cycleEditData.value.description = storeBesearch.selectedIntervention?.description || ''
  cycleEditData.value.active = storeBesearch.selectedIntervention?.active || true
  return storeBesearch.selectedIntervention || []
})

const cycleResonance = computed(() => {
   return []
})

/* methods */
const saveCycleChanges = () => {
  // save update
}

const duplicateCycle = () => {
  // duplicate cycle
}

  const deleteCycle = () => {
  // delete cycle
}

const getStatusClass = (status) => {
  return status === 'active' ? 'status-active' : 'status-inactive'
}

const closeCycleToolbar = () => {
  console.log('closeCycleToolbar')
  storeBesearch.selectedIntervention = null
  storeBesearch.showBesearchDetail = false
  storeBesearch.bottomHeight = 20
}

</script>

<style scoped>
  /* Cycle Toolbar Styles */
.cycle-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 2px solid #e0e0e0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 50vh;
  height: 50vh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.cycle-toolbar .toolbar-header {
  display: grid;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.cycle-toolbar .toolbar-header h3 {
  margin: 0;
  font-size: 20px;
}

.cycle-toolbar .close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px 8px;
}

.cycle-toolbar .close-btn:hover {
  color: #333;
}

.cycle-toolbar .toolbar-content {
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  display: grid;
  gap: 24px;
}

.cycle-toolbar .cycle-info {
  display: grid;
  grid-template-columns: 1fr 2fr 200px;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.cycle-toolbar .info-field {
  display: grid;
  grid-direction: column;
  gap: 8px;
}

.cycle-toolbar .info-field label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.cycle-toolbar .input-field,
.cycle-toolbar .textarea-field,
.cycle-toolbar .select-field {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.cycle-toolbar .input-field:focus,
.cycle-toolbar .textarea-field:focus,
.cycle-toolbar .select-field:focus {
  outline: none;
  border-color: #007bff;
}

.cycle-toolbar .textarea-field {
  resize: vertical;
  min-height: 60px;
}

.cycle-toolbar .linked-interventions {
  grid: 1;
}

.cycle-toolbar .linked-interventions h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.cycle-toolbar .interventions-list {
  display: grid;
  grid-direction: column;
  gap: 8px;
}

.cycle-toolbar .linked-item {
  display: grid;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.cycle-toolbar .linked-item span:first-child {
  font-weight: 500;
}

.cycle-toolbar .status-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.cycle-toolbar .status-working {
  background: #d4edda;
  color: #155724;
}

.cycle-toolbar .status-experimentation {
  background: #fff3cd;
  color: #856404;
}

.cycle-toolbar .status-no-effect {
  background: #f8d7da;
  color: #721c24;
}

.cycle-toolbar .status-pending {
  background: #e2e3e5;
  color: #383d41;
}

.cycle-toolbar .empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 8px;
}

.cycle-toolbar .toolbar-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.cycle-toolbar .action-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.cycle-toolbar .action-btn:hover {
  background: #f8f9fa;
}

.cycle-toolbar .action-btn.primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.cycle-toolbar .action-btn.primary:hover {
  background: #0056b3;
}

.cycle-toolbar .action-btn.danger {
  color: #dc3545;
  border-color: #dc3545;
}

.cycle-toolbar .action-btn.danger:hover {
  background: #dc3545;
  color: white;
}

  @media (min-width: 1024px) {

  }
</style>