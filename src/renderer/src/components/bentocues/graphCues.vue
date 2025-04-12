<template>
  <Teleport to="body">
    <modal-cues :show="bentoGraphStatus" @close="closeBentoGraph">
      Cues
      <template #header>
        <div id="graph-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoGraph"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="cues-context">Graphs</div>
          <div id="return-modal-close" @click="closeBentoGraph">return</div>
        </div>
      </template>
      <template #body>
        <div class="main">
          <beebee-ai></beebee-ai>
          <button id="open-beebee" @click.prevent="setShowBeeBee">beebee</button>
          <div id="graph-toolbar">
            <button 
              class="graph-type-button" 
              :class="{ selected: isButtonSelected('social') }"
              @click="graphSelect('social')"
            >
              Peers
            </button>
            <button 
              class="graph-type-button" 
              :class="{ selected: isButtonSelected('cues') }"
              @click="graphSelect('cues')"
            >
              Cues
            </button>
            <button 
              class="graph-type-button" 
              :class="{ selected: isButtonSelected('N=1') }"
              @click="graphSelect('N=1')"
            >
              N=1's
            </button>
          </div>
          <div id="display-graph">
            <div id="graph-holder" v-if="graphType == 'social'">
              <social-graph></social-graph>
            </div>
            <div id="graph-holder" v-if="graphType == 'cues'">
              <cues-mind></cues-mind>
            </div>
            <div id="graph-holder" v-if="graphType == 'N=1'">
              Network experiments coming soon
            </div>
          </div>
        </div>
      </template>
      <template #footer>
      </template>
    </modal-cues>
  </Teleport>
</template>

<script setup>
import SocialGraph from '@/components/toolbars/account/graphs/socialGraph.vue'
import CuesMind from '@/components/bentocues/graphs/cuesMind.vue'
import { ref, computed, onMounted } from 'vue'
import ModalCues from '@/components/bentocues/cuesModal.vue'
import BeebeeAi from '@/components/beebeehelp/spaceChat.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let graphType = ref('cues')

  /* on mount */
  onMounted(() => {
  })

  /* computed */
  const bentoGraphStatus = computed(() => {
    return storeAI.bentographState
  })


  /* methods */
  const closeBentoGraph = () => {
    storeAI.beebeeContext = 'chat'
    storeAI.bentographState = !storeAI.bentographState
  }

  const setShowBeeBee = () => {
    // beebeeSpace.value = !beebeeSpace.value
    storeAI.bentochatState = !storeAI.bentochatState
  }

  const graphSelect = (type) => {
    graphType.value = type
  }

  const isButtonSelected = (type) => {
    return graphType.value === type
  }

</script>

<style scoped>

#graph-toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.main {
  display: grid;
  grid-template-columns: 1fr;
}

.graph-type-button {
  font-size: 1.2em;
  width: 120px;
  padding: 8px;
  margin: 4px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.graph-type-button:hover {
  background-color: #e0e0e0;
}

.graph-type-button.selected {
  background-color: #4CAF50;
  color: white;
}

#open-beebee {
    position: fixed;
    bottom: 10px;
    right: 120px;
    z-index: 31;
    display: grid;
    justify-content: center;
    place-self: start;
    align-self: start;
    height: 2em;
    width: 5em;
    background-color: white;
  }

  #display-graph {
    display: grid;
    grid-template-columns: 1fr;
    margin: 2em;
  }

  #graph-holder {
    position: relative;
    display: grid;
    width: 100%;
    height: 100%;
  }

  #graph-modal-header {
    display: grid;
    grid-template-columns: 1fr 8fr 1fr;
  }

  .btn-green {
    display: inline-grid;
    height: 28px;
    margin-right: .4em;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 1024px) {

    #bento-graph {
      display: grid;
      grid-template-columns: 3fr 1fr;
      border: 1px solid green;
      height: 100%;
    }

    #graph-holder {
      position: relative;
      display: grid;
      width: 900px;
      height: 500px;
    }
    
    #return-modal-close {
      text-align: right;
    }

    /*  fliters  */
    #filter-cues {
      margin-left: 2em;
    }

    #graph-modal-header {
      display: grid;
      grid-template-columns: 1fr 8fr 1fr;
    }

    .btn-green {
      display: inline-grid;
      height: 28px;
      margin-right: .4em;
      background-color: #b8cde2;
      color: #140d6b;
      border: none;
      border-radius: 4px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

  }

</style>