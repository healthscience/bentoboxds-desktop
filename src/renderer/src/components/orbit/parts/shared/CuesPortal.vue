<template>
  <div class="cues-portal">
    <div v-if="storeOrrery.isSeeding" class="seeding-status pulse">
      seeding biology knowledge... {{ storeOrrery.seedingProgress }}%
    </div>
    <!-- Category Sections -->
    <div class="portal-sections">
      <section v-for="cat in categories" :key="cat.id" class="category-section" :class="{ expanded: expandedCategory === cat.id }">
        <header class="category-header" @click="toggleExpand(cat.id)">
          <h4>{{ cat.label }}</h4>
          <span class="expand-icon">{{ expandedCategory === cat.id ? '−' : '+' }}</span>
        </header>

        <div v-if="expandedCategory === cat.id" class="category-content">
          <div class="category-filter">
            <AlphabetFilter v-model="categoryFilters[cat.id]" showReset />
          </div>

          <div class="cues-grid">
            <button
              v-for="cue in getFilteredCues(cat.id)"
              :key="cue.key"
              class="cue-chip"
              draggable="true"
              @dragstart="onDragStart($event, cue.value.concept.name)"
              @click="$emit('select', cue)"
            >
              {{ cue.value.concept.name }}
            </button>
            <div v-if="getFilteredCues(cat.id).length === 0" class="empty-state">
              No cues matching '{{ categoryFilters[cat.id] }}'
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Global Find Cue -->
    <!-- Removed to simplify as per request to focus on categories -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AlphabetFilter from '@/components/shared/AlphabetFilter.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

const storeCues = cuesStore()
import { orreryStore } from '@/stores/orreryStore.js'

const storeOrrery = orreryStore()
const storeLibrary = libraryStore()

const emit = defineEmits(['dragstart', 'select'])

const expandedCategory = ref(null)
const categories = [
  { id: 'body', label: 'Body' },
  { id: 'environment', label: 'Environment (buildings)' },
  { id: 'earth', label: 'Earth' },
  { id: 'all', label: 'All Cues' }
]

const categoryFilters = ref({
  body: '',
  environment: '',
  earth: '',
  all: ''
})

/* Mock Grouping Logic */
const groupedCues = computed(() => {
  const all = storeCues.cuesList || []
  return {
    body: all.filter(c => {
      const label = c.value?.concept?.settings?.label || ''
      return label === 'Activity' || label === 'Body/Peer' || !label // Default to body if unknown
    }),
    environment: all.filter(c => {
      const label = c.value?.concept?.settings?.label || ''
      return label === 'Space' || label === 'Environment'
    }),
    earth: all.filter(c => {
      const label = c.value?.concept?.settings?.label || ''
      return label === 'Temporal' || label === 'Earth Scales'
    }),
    all: all
  }
})

const toggleExpand = (catId) => {
  if (expandedCategory.value === catId) {
    expandedCategory.value = null
  } else {
    expandedCategory.value = catId
  }
}

const getFilteredCues = (catId) => {
  const cues = groupedCues.value[catId] || []
  const letter = categoryFilters.value[catId]
  if (!letter) return cues
  return cues.filter(c => 
    c.value.concept.name.toLowerCase().startsWith(letter.toLowerCase())
  )
}

const onDragStart = (event, word) => {
  emit('dragstart', { event, word })
}
</script>

<style scoped>
.cues-portal {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
  color: #1a202c;
  font-family: "Space Mono", monospace;
}

.seeding-status {
  padding: 8px;
  color: #3b82f6;
  font-weight: bold;
  text-align: center;
  font-size: 0.8rem;
  border: 1px dashed #3b82f6;
  border-radius: 8px;
  margin: 0 16px;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

.pulse {
  animation: pulse 2s infinite ease-in-out;
}

.portal-sections {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-right: 10px;
}

.category-header {
  margin-bottom: 0;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  z-index: 5;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}

.category-header:hover {
  background: rgba(59, 130, 246, 0.05);
}

.category-header h4 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.9rem;
  color: #3b82f6;
}

.expand-icon {
  font-size: 1.2rem;
  color: #3b82f6;
  font-weight: bold;
}

.category-content {
  padding: 12px 0;
}

.category-filter, .alphabet-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 0 16px 12px 16px;
}

.cues-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 16px;
}

.cue-chip {
  padding: 6px 12px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: grab;
  transition: all 0.2s;
}

.cue-chip:hover {
  background: rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.cue-chip:active {
  cursor: grabbing;
}

.empty-state {
  font-size: 0.75rem;
  opacity: 0.5;
  padding: 8px;
}

.portal-footer {
  padding-top: 16px;
  border-top: 2px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.global-find {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.global-find .label {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #718096;
}
</style>
