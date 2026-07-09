<template>
  <div class="reference-contract-list">
    <div class="list-header">
      <h4>{{ title }}</h4>
      <span class="count-badge" v-if="contracts.length > 0">{{ filteredContracts.length }} of {{ contracts.length }}</span>
    </div>

    <!-- A to Z Alphabet Filter -->
    <div class="filter-section">
      <AlphabetFilter v-model="liveLetter" size="md" showReset>
        <template #extra>
          <button class="clear-all-filter-btn" v-if="liveLetter" @click="liveLetter = ''">
            Clear Filter
          </button>
        </template>
      </AlphabetFilter>
    </div>

    <!-- Empty State -->
    <div v-if="contracts.length === 0" class="empty-state">
      No {{ title.toLowerCase() }} available.
    </div>

    <div v-else-if="filteredContracts.length === 0" class="empty-state">
      No {{ title.toLowerCase() }} match the selected filter letter "{{ liveLetter.toUpperCase() }}".
    </div>

    <!-- Active List -->
    <div class="contract-list" v-else>
       <div class="contract-card" :class="{ expanded: expandedCards[contract.key] }" v-for="contract in filteredContracts" :key="contract.key">
          <div class="contract-card-header" @click="toggleCard(contract.key)">
             <strong>{{ contract.value?.concept?.name || 'Unknown' }}</strong>
             <button class="expand-btn">
               {{ expandedCards[contract.key] ? 'Collapse ▲' : 'Expand ▾' }}
             </button>
          </div>
          <p class="contract-description">{{ contract.value?.concept?.description }}</p>
          
          <div v-if="expandedCards[contract.key]" class="contract-details">
             <div class="detail-row" v-if="contract.value?.concept?.wiki || contract.value?.concept?.rdf">
               <span class="detail-label">Links:</span>
               <div class="detail-links">
                 <a v-if="contract.value.concept.wiki" :href="contract.value.concept.wiki" target="_blank" class="detail-link">Wikipedia</a>
                 <a v-if="contract.value.concept.rdf" :href="contract.value.concept.rdf" target="_blank" class="detail-link">DBPedia</a>
               </div>
             </div>

             <div class="detail-row" v-if="contract.value?.space?.concept">
               <span class="detail-label">Space:</span>
               <span class="detail-badge">{{ contract.value.space.concept }}</span>
             </div>

             <div class="detail-row" v-if="contract.value?.time">
               <span class="detail-label">Metrics:</span>
               <div class="detail-metrics">
                 <div>Created: <span class="metric-value">{{ contract.value.time.createTimestamp }}</span></div>
                 <div>Last: <span class="metric-value">{{ contract.value.time.lastTimestamp }}</span></div>
                 <div>Frequency: <span class="metric-value">{{ contract.value.time.frequencyCount }}</span></div>
               </div>
             </div>

             <div class="detail-raw">
               <div class="raw-header">Raw Contract Details</div>
               <pre class="json-block">{{ JSON.stringify(contract, null, 2) }}</pre>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AlphabetFilter from '@/components/shared/AlphabetFilter.vue'

const props = defineProps({
  contracts: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Contracts'
  }
})

const liveLetter = ref('')
const expandedCards = ref({})

const toggleCard = (key) => {
  expandedCards.value[key] = !expandedCards.value[key]
}

// Filter contracts by letter
const filteredContracts = computed(() => {
  if (!liveLetter.value) {
    return props.contracts
  }
  return props.contracts.filter(contract => {
    const name = contract.value?.concept?.name || ''
    return name && typeof name === 'string' && name.toLowerCase().charAt(0) === liveLetter.value.toLowerCase()
  })
})
</script>

<style scoped>
.reference-contract-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 0.5rem;
}

.list-header h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.count-badge {
  font-size: 0.75rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 10px;
  border-radius: 20px;
}

.filter-section {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.clear-all-filter-btn {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #ef4444;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  margin-left: 8px;
}

.clear-all-filter-btn:hover {
  background: #dc2626;
}

.empty-state {
  padding: 3rem 2rem;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

.contract-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.contract-card {
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: all 0.2s ease-in-out;
}

.contract-card.expanded {
  border-color: var(--sov-accent, #3b82f6);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.contract-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.contract-card strong {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.expand-btn {
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}

.expand-btn:hover {
  background: #e2e8f0;
  color: #334155;
}

.contract-description {
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
  color: #475569;
}

.contract-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  font-size: 0.85rem;
}

.detail-label {
  font-weight: 600;
  color: #64748b;
  width: 100px;
  flex-shrink: 0;
}

.detail-links {
  display: flex;
  gap: 0.5rem;
}

.detail-link {
  font-size: 0.75rem;
  color: #2563eb;
  text-decoration: none;
  background: #eff6ff;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #dbeafe;
}

.detail-link:hover {
  background: #dbeafe;
}

.detail-badge {
  font-size: 0.75rem;
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-weight: 500;
}

.detail-metrics {
  display: flex;
  gap: 1.5rem;
  color: #475569;
}

.metric-value {
  font-family: monospace;
  font-weight: 600;
  color: #1e293b;
}

.detail-raw {
  margin-top: 0.5rem;
}

.raw-header {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.json-block {
  background: #1e293b;
  color: #f1f5f9;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-family: monospace;
  overflow-x: auto;
  margin: 0;
  max-height: 250px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}
</style>