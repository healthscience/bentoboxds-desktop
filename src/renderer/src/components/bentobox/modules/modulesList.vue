<template>
  <div id="modules-list-box">
    <div class="module-box">
      <div class="module-header">Data</div>
        <div id="data-module">data reference contract</div>
      </div>
    <div class="module-box">
      <div class="module-header">Compute</div>
      <div id="computes-list">
        <div class="compute-header">NOW</div>
        <div class="compute-ref-contracts">
           Observation - view compute reference contract
        </div>
      </div>
      <div id="computes-list-future">
        <div class="compute-header">FUTURE {{ modelUpdate }}</div>
        <div class="compute-ref-contracts">
          Linear regression
          <div class="compute-stages">
            <div class="stage-compute-task">train</div>
            <div class="stage-compute-task">predict</div>
            <div class="stage-compute-task">evaluate</div>
          </div>
        </div>
        <div class="compute-ref-contracts">
          Auto regression
          <div class="compute-stages">
            <div class="stage-compute-task">
              <button class="button-evolution" @click="trainStart()">Begin-Evolution</button>
              <button class="button-evolution" @click="trainNetworkStart()">Begin-Network-Evolution</button></div>
            <div class="stage-compute-task">predict</div>
            <div class="stage-compute-task">evaluate</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module-box">
      <div class="module-header">Visualisation</div>
      <div id="data-module">data reference contract</div>
    </div>
    <div class="module-box">
      <div class="module-header">Other modules</div>
      <div id="data-module">action prescire video exerseise etc.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
 
  /* props */
  const props = defineProps({
    bboxid: String
  })


  /* computed */
  const modelUpdate = computed (() => {
    return storeAI.boxModelUpdate[props.bboxid]
  })

  /*
  * library summary

  const boxLibrarySummary = computed(() => {
    console.log('toooools')
    console.log(props.bboxid)
    console.log(storeAI.boxLibSummary)
    let NXPcontract = {}
    NXPcontract.key = Object.keys(storeAI.boxLibSummary[props.bboxid]?.data)
    let modKeys = []
    for (let mod of storeAI?.boxLibSummary[props.bboxid]?.data[NXPcontract.key].modules) {
      modKeys.push(mod.key)
    }
    NXPcontract.modules = modKeys
    return NXPcontract
  })  */

  /* methods */
  const trainStart = () => {
    let aiMessage = {}
    aiMessage.type = 'bbai'
    aiMessage.reftype = 'ai'
    aiMessage.action = 'agent-task'
    aiMessage.task = 'cale-evolution'
    aiMessage.data = {}
    aiMessage.bbid = props.bboxid
    storeAI.prepareAI(aiMessage)
  }

  const trainNetworkStart = () => {
    let aiMessage = {}
    aiMessage.type = 'bbai'
    aiMessage.reftype = 'ai'
    aiMessage.action = 'agent-network-task'
    aiMessage.task = 'cale-evolution'
    aiMessage.data = {}
    aiMessage.bbid = props.bboxid
    storeAI.prepareAI(aiMessage)
  }

</script>

<style scoped>
#modules-list-box {
  display: grid;
  grid-template-columns: 1fr;
  background-color: antiquewhite;
  border: 1px solid rgb(141, 145, 226);
}

@media (min-width: 1024px) {
  #modules-list-box {
    display: grid;
    grid-template-columns: 1fr;
    background-color: antiquewhite;
    border: 1px solid rgb(141, 145, 226);
  }

  .module-box {
    display: grid;
    grid-template-columns: 1fr;
    border: 1px solid lightblue;
    margin: 1em;
    padding: 1em;
  }

  .compute-ref-contracts {
    border-bottom: 1px solid blue;
    padding-bottom: 2em;
  }

  .compute-stages {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .compute-header {
    font-weight: bold;
  }

  .stage-compute-task {
    display: grid;
    grid-template-columns: 1fr;
  }

  .button-evolution {
    margin: 0.2em;
    width: 80%;
  }
}
</style>
