ca<template>
  <Teleport to="body">
    <div v-if="show" class="besearch-create-form-overlay" @click="closeForm">
      <div class="besearch-create-form" @click.stop>
        <div class="form-header">
          <h3>Create New Besearch Cycle</h3>
          <button class="close-btn" @click="closeForm">✕</button>
        </div>

        <form class="create-form">
          <div class="form-group">
            <label for="cycleName">Besearch Cycle Name</label>
            <input
              id="cycleName"
              v-model="formData.name"
              type="text"
              placeholder="Enter cycle name"
              required
              class="form-input"
            />
          </div>
        <div class="form-group">
          <label for="cycleDescription">Description</label>
          <textarea
            id="cycleDescription"
            v-model="formData.description"
            placeholder="Describe the intervention"
            required
            class="form-textarea"
            rows="3"
          />
        </div>
        <div class="form-group">
          <label for="besearchCategory">Category</label>
          <select
            id="besearchCategory"
            v-model="formData.category"
            required
            class="form-select"
          >
            <option value="">Select category</option>
            <option value="prevention">Prevention</option>
            <option value="repair">Repair</option>
            <option value="rejuvenation">Rejuvenation</option>
            <option value="rejuvenation">Statistics</option>
            <option value="rejuvenation">DML</option>
            <option value="experimental">Experimental</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="form-group">
          <label for="networkExperiment">Network Experiment</label>
          <select
            id="networkExperiment"
            v-model="formData.networkExperiment"
            required
            class="form-select"
          >
            <option value="">Select experiment</option>
            <option
              v-for="experiment in networkExperiments"
              :key="experiment.id"
              :value="experiment.id"
            >
              {{ experiment.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <button @click="getComputeContracts()">Get compute contracts</button>
          <div id="compute-contract-options" v-if="formData?.networkExperiment?.length > 0">
            <label for="computeContract">Computation</label>
            <select
              id="computeContract"
              v-model="formData.computeContractId"
              :required="computeOptions.length > 0"
              class="form-select"
            >
              <option value="">Select computation</option>
              <option
                v-for="compute in computeOptions"
                :key="compute.key"
                :value="compute.key"
              >
                {{ compute.value.computational.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="marker">Marker</label>
          <select
            id="marker"
            v-model="formData.marker"
            required
            class="form-select"
          >
            <option value="">Select marker</option>
            <option value="none">none</option>
            <option
              v-for="marker in markers"
              :key="marker.key"
              :value="marker.id"
            >
              {{ marker.value.concept.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="frequency">Frequency of Cycle</label>
          <select
            id="frequency"
            v-model="formData.frequency"
            required
            class="form-select"
          >
            <option value="">Select frequency</option>
            <option value="solar-cycle">Solar cycle</option>
            <option value="earth-cycle">Great orbit</option>
            <option value="solar-sector">Sector</option>
            <option value="solar-arc">Arc</option>            
            <option value="custom">Custom sector</option>
          </select>
        </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click.prevent="closeForm">Cancel</button>
            <button type="submit" class="save-btn" @click.prevent="saveBesearch()">Create</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps, onActivated, watch, nextTick } from 'vue'
import { besearchStore } from '@/stores/besearchStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    initialData: {
      type: Object,
      default: () => ({})
    }
  })

  const emit = defineEmits(['close', 'save'])

  const storeBesearch = besearchStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()

  const formData = ref({
    name: '',
    description: '',
    category: '',
    status: '',
    networkExperiment: '',
    computeContractId: '',
    marker: '',
    frequency: ''
  })
  const didSetDefaultCompute = ref(false)
  let computeOptions = ref([])

  onActivated(() => {
    applyInitialData()
  })

  watch(
    () => props.show,
    async (isOpen) => {
      if (!isOpen) return
      await nextTick()
      applyInitialData()
    }
  )

  watch(
    () => props.initialData,
    async () => {
      if (!props.show) return
      await nextTick()
      applyInitialData()
    },
    { deep: true }
  )

  /* computed */
  const networkExperiments = computed(() => {
    return storeLibrary.peerExperimentList?.data || []
  })
  
  const markers = computed(() => {
    // sort into alphabetical order
    const contracts = storeCues.markerList
    // Sort the contracts by name in ascending order
    const sortedContracts = contracts.sort((a, b) => {
      if (a.type < b.type) return -1
      if (a.type > b.type) return 1
      return 0
    })
    return sortedContracts
  })

  /* methods */
  const applyInitialData = () => {
    console.log('apply initial data')
    console.log(props.initialData)
    if (props.initialData) {
      formData.value = { ...props.initialData }
      if (props.initialData.computeContractId) {
        didSetDefaultCompute.value = true
      }
    }
  }

  const saveBesearch = () => {
    console.log('save besearch')
    emit('save', { ...formData.value })
    emit('close') // Close the overlay after successful submission
    resetForm()
    // console.log(isFormVal.value)
    /* if (isFormVal.value) {
      console.log('form is valid')
      // emit('save', { ...formData.value })
      // emit('close') // Close the overlay after successful submission
      // resetForm()
    } */
  }

  const closeForm = () => {
    emit('close')
    resetForm()
  }

  const resetForm = () => {
    formData.value = {
      name: '',
      description: '',
      category: '',
      status: '',
      networkExperiment: '',
      computeContractId: '',
      marker: '',
      frequency: ''
    }
    didSetDefaultCompute.value = false
  }

  const getComputeContracts = () => {
    console.log('click get update contracts+++++++++++++')
    console.log(storeLibrary.publicLibrary.referenceContracts.compute)
    let computeRefList = []
    /* let computeInfo = storeLibrary.contractInfoGetAsk({ context: { type: 'network-experiment', contractid: formData.value.networkExperiment }, asked: { style: 'reference', type: 'compute' }})
    console.log('compute reference contracts ooooooooooooooo')
    console.log(computeInfo)
    computeRefList.push(computeInfo)
    console.log('compute reference contracts')
    console.log(computeRefList) */
    // get all compute reference contracts in library
    computeRefList = storeLibrary.publicLibrary.referenceContracts.compute
    console.log('compute reference contracts')
    console.log(computeRefList)
    computeOptions.value = computeRefList || []
  }

</script>

<style scoped>

.besearch-create-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  align-items: center;
  justify-content: center;
  z-index: 30000;
}

.besearch-create-form {
  position: relative;
  z-index: 30001;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: min(92vw, 760px);
  max-width: 760px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.form-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.create-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-textarea {
  resize: vertical;
}

.form-select {
  cursor: pointer;
}

.form-actions {
  display: grid;
  grid-template-columns: auto auto;
  gap: 12px;
  justify-content: end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.cancel-btn,
.save-btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
}

.cancel-btn {
  background: white;
  color: #666;
}

.cancel-btn:hover {
  background: #f8f9fa;
  color: #333;
}

.save-btn {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.save-btn:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.save-btn:disabled {
  background: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .besearch-create-form {
    width: 95%;
    margin: 20px;
  }

  .form-header,
  .create-form {
    padding: 16px;
  }

  .form-actions {
    grid-template-columns: 1fr;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}
</style>
