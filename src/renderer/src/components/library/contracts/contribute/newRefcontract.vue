<template>
  <div id="newapi-view">new
    <!-- <div id="new-rfheader">New Reference Contract</div> -->
    <div id="newapi_form" name="newapi_form">
      <div class="api-form-item">
        <div id="form-api-section">
          <label class="select-api-id" for="api-add-type">Select type of Reference Contract</label>
          <select v-model="contractformType" class="select-api-id">
            <option
             v-for="formC in formContribute"
              :key="formC"
              :value=formC 
             >
              {{ formC.type }}
            </option>
          </select>
        </div>
      </div>
      <component :is="contractformType.form" ></component>
      <div class="api-form-item">
        <button class="submit-save" type="submit"  id="save-new-refcontract" @click.prevent="saveRefContract()">Save reference contract</button>
        <!-- <button class="submit" type="submit" id="check-new-refcontract" @click.prevent="checkRefContract()">Check Contract</button>
        <button class="submit" type="submit" id="network-library-submit" @click.prevent="networkLibraryRefContract()" >Submit to network library</button> -->
      </div>
      <div v-if="savenxpSuccess" class="newnxp-form-feeback">
        <div id="hop-feedback">
          New network experiment saved.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NewQuestiontype from '@/components/library/contracts/contribute/forms/newQuestiontype.vue'
import NewDatatype from '@/components/library/contracts/contribute/forms/newDatatype.vue'
import NewCompute from '@/components/library/contracts/contribute/forms/newCompute.vue'
import NewUnits from '@/components/library/contracts/contribute/forms/newUnits.vue'
import NewPackaging from '@/components/library/contracts/contribute/forms/newPackage.vue'
import NewVisualise from '@/components/library/contracts/contribute/forms/newVisualise.vue'

import { libraryStore } from '@/stores/libraryStore.js'
import { ref, computed, markRaw} from 'vue'

const storeLibrary = libraryStore()

const formContribute = [
  { type: 'question', form: markRaw(NewQuestiontype) },
  { type: 'datatype', form: markRaw(NewDatatype) },
  { type: 'compute', form: markRaw(NewCompute) },
  /* { type: 'units', form: shallowRef(NewUnits }, */
  { type: 'packaging', form: markRaw(NewPackaging) },
  { type: 'visualise', form: markRaw(NewVisualise) }
]

  let contractformType = ref(markRaw({ type: 'question', form: NewDatatype }))

  /* computed */
  
  const savenxpSuccess = computed(() => {
    return storeLibrary.saveSuccessnxp
  })

  /* methods */
  const saveRefContract = () => {
    // pull together other parts of refcontract
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = contractformType.value.type
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    if (contractformType.value.type === 'question') {
      refContract.data = storeLibrary.questionForm
    } else if (contractformType.value.type === 'datatype') {
      refContract.data = storeLibrary.datatypeForm
    } else if (contractformType.value.type === 'compute') {
      refContract.data = storeLibrary.newComputeForm
    } else if (contractformType.value.type === 'packaging') {
      refContract.data = storeLibrary.newPackagingForm
    } else if (contractformType.value.type === 'visualise') {
      refContract.data = storeLibrary.newVisualiseForm
    }
    storeLibrary.sendMessage(refContract)
    // reset the form data
    if (contractformType.value.type === 'question') {
    storeLibrary.questionForm = { primary: null, name: '' }
    } else if (contractformType.value.type === 'datatype') {
      storeLibrary.datatypeForm =
      {
        primary: Boolean,
        name: '',
        description: '',
        wiki: '',
        rdf: '',
        measurement: '',
        datatypeType: ''
      }
    } else if (contractformType.value.type === 'compute') {
      storeLibrary.newComputeForm = 
      {
        primary: Boolean,
        name: '',
        description: '',
        dtprefix: '',
        code: '',
        hash: ''
      }
    } else if (contractformType.value.type === 'packaging') {
      storeLibrary.newPackagingForm =
      {
        authrequired: false,
        type: '',
        filename: '',
        path: '',
        sqlitetablename: '',
        baseapi: '',
        jsonpath: '',
        authtoken: '',
        apicolumns: [],
        apicolHolder: [[]],
        catHolder: {},
        tidyHolder: {},
        catCount: 0,
        tidyCount: 0,
        category: {},
        tidy: {},
        device:
        {
          id: '',
          device_name: '',
          device_manufacturer: '',
          device_mac: '',
          device_type: '',
          device_model: '',
          query: '',
          location_lat: '',
          location_long: '',
          firmware: '',
          mobileapp: ''
        }
      }
      storeLibrary.newLists = {}
    } else if (contractformType.value.type === 'visualise') {
      storeLibrary.newVisualiseForm = 
      {
        primary: Boolean,
        name: '',
        description: '',
        structureName: '',
        visHolder: []
      }
    }
  }
</script>

<style scoped>

@media (min-width: 1024px) {
  #newapi-view {
    display: grid;
    justify-content: center;
    background-color: #EBE7E0;
    border: 4px solid lightgrey;
    padding: 10px;
  }

  #newapi_form {
    display: grid;
    grid-template-columns: 1fr;
    width: 90%;
    justify-content: center;
    align-content: center;
    min-width: 360px;
  }

  .api-form-item {
    display: grid;
    grid-template-columns: 1fr;
    padding-bottom: 2em;
  }

  #form-api-section {
    font-size: 1.2em;
  }

  .select-api-id {
    width: 50%;
    font-size: 1.2em;
  }

  label {
    margin-bottom: .5em;
  }

  #save-new-refcontract {
    display: grid;
    text-align: center;
    font-size: 2em;
  }
}
</style>
