<template>
  <div id="compute-nxp-buid">
    <header>COMPUTE used to produce results:</header>
    <div id="prime-compute">
      <form id="compute_form" name="compute_form" method="post" action="#">
        <div id="add-newref-compute">
          <div class="compute-item">
            <div class="computeref-add" id="newref-compute" >
              Reference Contract:<input v-model="computeRefCont" placeholder="Reference Contract">
            </div>
            <button type="button" class="computeref-add" id="compute-btn" @click="refContractLookup()">Lookup</button>
          </div>
          <div id="contract-summary" v-if="computesource.length > 0">{{ computesource }}
            <div v-for="cs of computesource" :key="cs.id">
              <div class="compute-refspace" v-if="refContractCompute[cs]">
                <div class="compute-refcontract">
                  {{ refContractCompute[cs].option.key }} -
                </div>
                <div class="compute-refcontract">
                  {{ refContractCompute[cs].option.value.computational.name }} -
                </div>
                <div class="compute-refcontract">
                  {{ refContractCompute[cs].option.value.computational.description}} -
                </div>
                <div class="compute-refcontract">
                  {{ refContractCompute[cs].option.value.computational.code }} -
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div id="view-controls-compute">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { libraryStore } from '@/stores/libraryStore.js'


  const storeLibrary = libraryStore()

  let computeRefCont = ref('')
  /* computed */
  const refContractCompute = computed (() => {
    return {}
  })

  const computesource = computed (() => {
    return storeLibrary.buildNewExperiment
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

    .compute-summary {
      display: block;
      margin: 2em;
    }

    .compute-refspace {
      background-color: white;
      padding: 10px;
    }
    .compute-refcontract {
      font-size: 1.2em;
      padding: 10px;
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
