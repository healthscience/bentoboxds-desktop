<template>
  <div id="modules-list-box">
    <div class="module-box">
      <div class="module-header">beSearch</div>
      <div id="besearch-module">
        <div class="besearch-status">
          Status: {{ beSearchStatus }}
        </div>
        <div class="besearch-time-period">
          Time Period: {{ beSearchTimePeriod }}
        </div>
        <div class="besearch-interventions" v-if="beSearchInterventions.length > 0">
          Interventions:
          <ul>
            <li v-for="intervention in beSearchInterventions" :key="intervention.id">
              {{ intervention.name }}
            </li>
          </ul>
        </div>
        <besearch-tools>Tools</besearch-tools>
      </div>
    </div>
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
import BesearchTools from '@/components/besearch/lifetools/besearchTools.vue'
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
    return {} // storeAI.boxModelUpdate[props.bboxid]
  })

  const beSearchStatus = computed(() => {
    return {} // storeAI.beSearchStatus[props.bboxid]
  })

  const beSearchTimePeriod = computed(() => {
    return {} // storeAI.beSearchTimePeriod[props.bboxid]
  })

  const beSearchInterventions = computed(() => {
    return {} // storeAI.beSearchInterventions[props.bboxid] || []
  })


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
    background-color: rgb(208, 209, 224);
    border: 1px solid rgb(141, 145, 226);
  }

  @media (min-width: 1024px) {
    #modules-list-box {
      display: grid;
      grid-template-columns: 1fr;
      background-color: rgb(200, 201, 214);
      border: 1px solid rgb(141, 145, 226);
    }

    .module-box {
      display: grid;
      grid-template-columns: 1fr;
      border: 1px solid lightblue;
      margin: 1em;
      padding: 1em;
      background-color: rgba(173, 216, 230, 0.5); /* Faint blue background */
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

    .besearch-status {
      font-weight: bold;
      margin-bottom: 0.5em;
    }

    .besearch-time-period {
      margin-bottom: 0.5em;
    }

    .besearch-interventions {
      margin-bottom: 0.5em;
    }

    .besearch-interventions ul {
      list-style-type: none;
      padding-left: 1em;
    }

    .besearch-interventions li {
      margin-bottom: 0.2em;
    }
  }
</style>