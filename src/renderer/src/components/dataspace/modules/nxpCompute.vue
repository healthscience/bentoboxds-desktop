<template>
  <div id="compute-nxp-buid">
    <header>COMPUTE contract(s)</header>
    <div id="prime-compute" v-if="props.refFocus === 'compute'">
      <form id="compute_form" name="compute_form" method="post" action="#">
        <div id="add-newref-compute">
          <div class="compute-item">
            <div class="computeref-add" id="newref-compute" >
              Contract:<input v-model="computeRefCont" placeholder="Reference Contract">
            </div>
            <button type="button" class="computeref-add" id="compute-btn" @click="refContractLookup()">Lookup</button>
          </div>
          <div id="contract-summary" v-if="computesource.length > 0">
            <div v-for="cs of computesource">
              <div class="compute-refspace">
                <div class="compute-refcontract">
                  {{ cs.key }}
                </div>
                <div class="compute-refcontract">
                  {{ cs.value.computational.name }}
                </div>
                <div class="compute-refcontract">
                  {{ cs.value.computational.description}}
                </div>
                <div class="compute-refcontract">
                  {{ cs.value.computational.code }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div id="view-controls-compute">
      </div>
    </div>
    <div v-else>
      <div class="compute-refcontract">
          {{ computesource[0]?.value.computational.name  }}
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  let computeRefCont = ref('')

  const props = defineProps({
    refFocus: String
  })

  /* computed */
  const refContractCompute = computed (() => {
    return {}
  })

  const computesource = computed (() => {
    return storeLibrary.newnxp.computeLive
  })

  /* method */
  const refContractLookup = (contract) => {
    console.log('look up contract')
  }

</script>

<style scoped>

  @media (min-width: 1024px) {

    #compute-nxp-buid {
      display: grid;
      grid-template-columns: 1fr;
    }

    #prime-compute {
      margin: 1em;
    }

    .compute-refspace {
      background-color: white;
      padding: 10px;
    }
    .compute-refcontract {
      font-size: 1em;
      padding: 10px;
      background-color: bisque;
      width: 96%;
    }

    .add-newref-compute {
      display: grid;
      grid-template-columns: 1fr;
    }

    .compute-item {
      display: grid;
      grid-template-columns: 5fr 1fr;
      justify-content: center;
    }

    .computeref-add {
      display: grid;
      grid-template-columns: 1fr;
    }

    #contract-summary {
      display: grid;
      grid-template-columns: 1fr;
      border: 3px solid orange;      
    }

    #newref-compute {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-self: end;
      justify-self: end;
    }

    #compute-btn {
      display: grid;
      align-self: start;
      justify-self: start;
    }
  }
</style>
