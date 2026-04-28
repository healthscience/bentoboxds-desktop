<template>
  <div id="interventions">
    <h3>Interventions</h3>
    <div class="intervention-categories">
    <!-- Prevention Category -->
    <div class="intervention-category">
        <button class="category-header" @click="toggleCategory('prevention')" :class="{ active: expandedCategory === 'prevention' }">
        <span class="intervention-icon">🛡️</span>
        <span>Prevention</span>
        <span class="toggle-icon">{{ expandedCategory === 'prevention' ? '▼' : '▶' }}</span>
        </button>
        <div v-if="expandedCategory === 'prevention'" class="intervention-list">
        <div 
            v-for="intervention in preventionInterventions" 
            :key="intervention.id"
            class="intervention-item"
            :class="{ selected: selectedIntervention?.id === intervention.id }"
            @click="selectIntervention(intervention)"
        >
            <span class="intervention-name">{{ intervention.name }}</span>
            <span class="intervention-cycles" v-if="intervention.besearchCycles?.length">
            ({{ intervention.besearchCycles.length }} cycles)
            </span>
        </div>
        </div>
    </div>
    <!-- Repair Category -->
    <div class="intervention-category">
        <button class="category-header" @click="toggleCategory('repair')" :class="{ active: expandedCategory === 'repair' }">
        <span class="intervention-icon">🔧</span>
        <span>Repair</span>
        <span class="toggle-icon">{{ expandedCategory === 'repair' ? '▼' : '▶' }}</span>
        </button>
        <div v-if="expandedCategory === 'repair'" class="intervention-list">
        <div 
            v-for="intervention in repairInterventions" 
            :key="intervention.id"
            class="intervention-item"
            :class="{ selected: selectedIntervention?.id === intervention.id }"
            @click="selectIntervention(intervention)"
        >
            <span class="intervention-name">{{ intervention.name }}</span>
            <span class="intervention-cycles" v-if="intervention.besearchCycles?.length">
            ({{ intervention.besearchCycles.length }} cycles)
            </span>
        </div>
        </div>
    </div>
    <!-- Rejuvenation Category -->
    <div class="intervention-category">
        <button class="category-header" @click="toggleCategory('rejuvenation')" :class="{ active: expandedCategory === 'rejuvenation' }">
        <span class="intervention-icon">✨</span>
        <span>Rejuvenation</span>
        <span class="toggle-icon">{{ expandedCategory === 'rejuvenation' ? '▼' : '▶' }}</span>
        </button>
        <div v-if="expandedCategory === 'rejuvenation'" class="intervention-list">
        <div 
            v-for="intervention in rejuvenationInterventions" 
            :key="intervention.id"
            class="intervention-item"
            :class="{ selected: selectedIntervention?.id === intervention.id }"
            @click="selectIntervention(intervention)"
        >
            <span class="intervention-name">{{ intervention.name }}</span>
            <span class="intervention-cycles" v-if="intervention.besearchCycles?.length">
            ({{ intervention.besearchCycles.length }} cycles)
            </span>
        </div>
        </div>
    </div>
    </div>
    
    <div class="intervention-actions">
    <button class="action-button" @click="createIntervention" title="Create new intervention">
        <span>➕ Add</span>
    </button>
    </div>
</div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { besearchStore } from '@/stores/besearchStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore()
const storeBesearch = besearchStore()

let selectedIntervention = ref(null)
let expandedCategory = ref(null)

// No longer need to emit events - using store-based communication

  /* mock data */
  // Sample intervention data - this would come from a store/API
const preventionInterventions = ref([
  // Human Health
  {
    id: 'prev-1',
    name: 'Fasting Mimicking Diet',
    description: '5-day low calorie plant-based diet',
    biomarkers: ['IGF-1', 'Glucose', 'Ketones', 'CRP'],
    besearchCycles: ['cycle-1', 'cycle-3']
  },
  {
    id: 'prev-2',
    name: 'Intermittent Fasting 16:8',
    description: 'Daily 16-hour fasting window',
    biomarkers: ['Insulin', 'Glucose', 'HbA1c'],
    besearchCycles: ['cycle-2']
  },
  {
    id: 'prev-3',
    name: 'Caloric Restriction',
    description: '20% reduction in daily calories',
    biomarkers: ['Weight', 'BMI', 'Leptin'],
    besearchCycles: []
  },
  // Built Environment
  {
    id: 'prev-4',
    name: 'Home Insulation Upgrade',
    description: 'Improve thermal insulation to reduce energy loss and maintain healthy indoor temperature',
    biomarkers: ['Indoor Air Quality', 'Temperature Stability', 'Energy Usage', 'Respiratory Health'],
    besearchCycles: ['cycle-7']
  },
  // Nature
  {
    id: 'prev-5',
    name: 'Stop Sewage Pollution',
    description: 'Prevent local sewage discharge into river system',
    biomarkers: ['Water Quality Index', 'E.coli Levels', 'Dissolved Oxygen', 'Biodiversity Index'],
    besearchCycles: ['cycle-8', 'cycle-9']
  }
])

const repairInterventions = ref([
  // Human Health
  {
    id: 'repair-1',
    name: 'PEMF Joint Therapy',
    description: 'Pulsed electromagnetic field for joints',
    biomarkers: ['CRP', 'IL-6', 'Range of Motion'],
    besearchCycles: ['cycle-4']
  },
  {
    id: 'repair-2',
    name: 'Red Light Therapy',
    description: 'Near-infrared light treatment',
    biomarkers: ['Collagen', 'Wound Healing Rate'],
    besearchCycles: []
  },
  // Built Environment
  {
    id: 'repair-3',
    name: 'Roof Tile Restoration',
    description: 'Fix and improve roofing tiles to prevent leaks and improve weather resistance',
    biomarkers: ['Structural Integrity', 'Water Damage Prevention', 'Indoor Humidity', 'Mold Risk'],
    besearchCycles: ['cycle-10']
  },
  // Nature
  {
    id: 'repair-4',
    name: 'Dam Removal Project',
    description: 'Remove obsolete dams from river basin to restore natural water flow',
    biomarkers: ['Fish Migration Routes', 'Sediment Flow', 'River Temperature', 'Aquatic Biodiversity'],
    besearchCycles: ['cycle-11', 'cycle-12']
  }
])

const rejuvenationInterventions = ref([
  // Human Health
  {
    id: 'rejuv-1',
    name: 'Exosome Therapy',
    description: 'Stem cell-derived exosomes',
    biomarkers: ['Telomere Length', 'Senescent Cells', 'NAD+'],
    besearchCycles: ['cycle-5', 'cycle-6']
  },
  {
    id: 'rejuv-2',
    name: 'NAD+ IV Therapy',
    description: 'Intravenous NAD+ infusion',
    biomarkers: ['NAD+ Levels', 'ATP', 'Mitochondrial Function'],
    besearchCycles: []
  },
  // Built Environment
  {
    id: 'rejuv-3',
    name: 'Solar Panel Installation',
    description: 'Add solar panels to old home for renewable energy generation',
    biomarkers: ['Carbon Footprint', 'Energy Independence', 'Air Quality Impact', 'Grid Resilience'],
    besearchCycles: ['cycle-13']
  },
  // Nature
  {
    id: 'rejuv-4',
    name: 'River Valley Rewilding',
    description: 'Restore upper river basin valley to natural ecosystem',
    biomarkers: ['Species Diversity', 'Carbon Sequestration', 'Soil Health', 'Watershed Function'],
    besearchCycles: ['cycle-14', 'cycle-15', 'cycle-16']
  }
])

  /* methods */
  const toggleCategory = (category) => {
    expandedCategory.value = expandedCategory.value === category ? null : category
    // Set category in store instead of emitting
    storeBesearch.setSelectedCategory(category)
  }

  const selectIntervention = (intervention) => {
    selectedIntervention.value = intervention
    // Set intervention in store instead of emitting
    storeBesearch.setSelectedIntervention(intervention)
    storeBesearch.showBesearchDetail = true
    storeAI.showLifestapLens = true
  }

  const createIntervention = () => {
    // Set create action in store
    storeBesearch.setSelectedIntervention({ type: 'create' })
  }

</script>

<style scoped>

  @media (min-width: 1024px) {
      .intervention-categories {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .intervention-category {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .category-header {
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

  .category-header:hover {
    background-color: #9fb8d4;
  }

  .category-header.active {
    background-color: #8fa9c6;
  }

  .intervention-icon {
    font-size: 18px;
    margin-right: 8px;
  }

  .toggle-icon {
    font-size: 12px;
    margin-left: auto;
  }

  .intervention-list {
    background-color: rgba(255, 255, 255, 0.05);
    max-height: 200px;
    overflow-y: auto;
  }

  .intervention-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .intervention-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .intervention-item.selected {
    background-color: rgba(76, 175, 80, 0.2);
    font-weight: 500;
  }

  .intervention-name {
    flex: 1;
  }

  .intervention-cycles {
    font-size: 10px;
    color: #666;
    margin-left: 8px;
  }

  .intervention-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .action-button {
    flex: 1;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .action-button:hover {
    background-color: #45a049;
  }
  }

</style>