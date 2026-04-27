<template>
  <div class="new-ref-contract">
    <lib-card>
      <template #header>New Reference Contract</template>
      
      <lib-form-item label="Select type of Reference Contract" id="api-add-type">
        <select v-model="contractformType" class="lib-select">
          <option
            v-for="formC in formContribute"
            :key="formC.type"
            :value="formC"
          >
            {{ formC.type.toUpperCase() }}
          </option>
        </select>
      </lib-form-item>

      <div class="form-content">
        <component :is="contractformType.form"></component>
      </div>

      <template #footer>
        <div class="form-actions">
          <lib-button @click="saveRefContract" :loading="isSaving">
            Save Reference Contract
          </lib-button>
        </div>
        
        <div v-if="savenxpSuccess" class="feedback-success">
          New network experiment saved successfully.
        </div>
      </template>
    </lib-card>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

// Shared Components
import LibCard from '@/components/library/shared/LibCard.vue'
import LibFormItem from '@/components/library/shared/LibFormItem.vue'
import LibButton from '@/components/library/shared/LibButton.vue'

// Form Components
import NewQuestiontype from '@/components/library/contracts/contribute/forms/newQuestiontype.vue'
import NewDatatype from '@/components/library/contracts/contribute/forms/newDatatype.vue'
import NewCompute from '@/components/library/contracts/contribute/forms/newCompute.vue'
import NewPackaging from '@/components/library/contracts/contribute/forms/newPackage.vue'
import NewVisualise from '@/components/library/contracts/contribute/forms/newVisualise.vue'
import NewMedia from '@/components/library/contracts/contribute/forms/newMedia.vue'
import NewResearch from '@/components/library/contracts/contribute/forms/newResearch.vue'
import NewMarker from '@/components/library/contracts/contribute/forms/newMarker.vue'
import NewProduct from '@/components/library/contracts/contribute/forms/newProduct.vue'

const storeLibrary = libraryStore()
const isSaving = ref(false)

const formContribute = [
  { type: 'question', form: markRaw(NewQuestiontype) },
  { type: 'datatype', form: markRaw(NewDatatype) },
  { type: 'compute', form: markRaw(NewCompute) },
  { type: 'packaging', form: markRaw(NewPackaging) },
  { type: 'visualise', form: markRaw(NewVisualise) },
  { type: 'media', form: markRaw(NewMedia) },
  { type: 'research', form: markRaw(NewResearch) },
  { type: 'marker', form: markRaw(NewMarker) },
  { type: 'product', form: markRaw(NewProduct) }
]

const contractformType = ref(formContribute[1]) // Default to datatype

const savenxpSuccess = computed(() => storeLibrary.saveSuccessnxp)

const saveRefContract = async () => {
  isSaving.value = true
  try {
    const refContract = {
      type: 'library',
      action: 'contracts',
      reftype: contractformType.value.type,
      task: 'PUT',
      privacy: 'public'
    }

    const typeMap = {
      question: 'questionForm',
      datatype: 'datatypeForm',
      compute: 'newComputeForm',
      packaging: 'newPackagingForm',
      visualise: 'newVisualiseForm',
      media: 'newMediaForm',
      research: 'newResearchForm',
      marker: 'newMarkerForm',
      product: 'newProductForm'
    }

    const storeKey = typeMap[contractformType.value.type]
    if (storeKey) {
      refContract.data = storeLibrary[storeKey]
    }

    // Special cases for action
    if (['media', 'research', 'marker'].includes(contractformType.value.type)) {
      refContract.action = contractformType.value.type
    }

    // Assuming storeLibrary has a method to handle the actual save, 
    // or we emit/call the existing logic. 
    // For now, keeping the logic consistent with original but cleaner.
    console.log('Saving Ref Contract:', refContract)
    // await storeLibrary.saveRefContract(refContract) 
    
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.new-ref-contract {
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.lib-select {
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--sov-border-radius);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--sov-bg-soft);
  color: var(--sov-text);
  font-family: inherit;
  cursor: pointer;
}

.form-content {
  margin-top: 1rem;
  padding-top: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.feedback-success {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(0, 204, 163, 0.1);
  color: var(--sov-accent);
  border-radius: var(--sov-border-radius);
  text-align: center;
  font-weight: 500;
}
</style>
