<template>
  <div id="device-add-nxp">
      <div  class="device-item">
        Reference Contract:
        <input v-model="storeLibrary.newPackaging" placeholder="Reference Contract">
        <button type="button" class="btn" @click="refContractLookup()">Lookup</button>
      </div>
      <div>
        <div class="data-refspace">
          <div v-for="pack of refContractPackage">  {{ refContractPackage }}
            <div v-if="pack.value">
              <div class="ref-pair">
                {{ pack.key }}
              </div>
              <div class="ref-pair">
                {{ pack.value.concept.name }}
              </div>
              <div class="ref-pair">
                {{ pack.value.concept.description}}
              </div>
              <div class="ref-pair">
                {{ pack.value.concept.api }}
              </div>
              <div class="ref-pair">
                {{ pack.value.concept.apipath}}
              </div>
              <div class="ref-pair" v-for="colpair in pack.value.concept.tablestructure" :key="colpair.refcontract">
                {{ colpair.refcontract }} - {{ colpair.column }}
              </div>
              <div class="ref-pair" v-for="cat in pack.value.concept.category" :key="cat.id">
                {{ cat.category }} - {{ cat.column }}
              </div>
              <div class="ref-pair" v-for="tidy in pack.value.concept.tidy" :key="tidy.id">
                {{ tidy.tidy }} - {{ tidy.tidydatatype }} - {{ tidy.tidycode }}
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { libraryStore } from '@/stores/libraryStore.js'


  const storeLibrary = libraryStore()

  const refContractPackage = computed (() => {
    return storeLibrary.newnxp.packagingLive
  })
  
</script>

<style scoped>

@media (min-width: 1024px) {
  .data-refspace {
    display: grid;
    grid-template-columns: 1fr;
    background-color: white;
    padding: 10px;
  }

  .ref-pair {
    font-size: 1.2em;
    padding: 4px;
  }
}
</style>
