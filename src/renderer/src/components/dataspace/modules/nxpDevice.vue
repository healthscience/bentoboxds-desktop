<template>
  <div id="device-add-nxp">
    <header>DATA PACKAGING</header>
      <div>
        <div class="data-refspace" v-if="props.refFocus === 'packaging'">
          <div v-for="pack of refContractPackage"> 
            <div class="refcontract-summary" v-if="pack.value">
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
          <div  class="device-item">
            Reference Contract:
            <input v-model="storeLibrary.newPackaging" placeholder="Reference Contract">
            <button type="button" class="btn" @click="refContractLookup()">Lookup</button>
          </div>
        </div>
        <div v-else >
          <div class="ref-pair">
                {{ refContractPackage[0]?.value.concept.name }}
              </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  const props = defineProps({
    refFocus: String
  })

  const refContractPackage = computed (() => {
    return storeLibrary.newnxp.packagingLive
  })
  
</script>

<style scoped>

@media (min-width: 1024px) {
  .data-refspace {
    display: grid;
    grid-template-columns: 1fr;
    padding: 10px;
  }

  .refcontract-summary {
    width: inherit;
    border: 1px solid white;
  }

  .ref-pair {
    font-size: 1.2em;
    padding: 4px;
    background-color: bisque;
    width: 96%;
  }
}
</style>
