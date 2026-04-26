<template>
    <div id="cue-cloning" class="clone-options">
        <div id="selct-cues">
            Please select a default cues
            <button id="cues-gaia" @click="activateCues('gaia')">Gaia</button>
            <button id="cues-default" @click="activateCues('aging')">Aging</button>
            <button id="cues-default" @click="activateCues('planet')">Planet</button>
            <button id="cues-default" @click="activateCues('body')">Body</button>
            <button id="cues-default" @click="activateCues('body-biomarkers')">Biomarkers Human body</button>
        </div>
        <div id="new-cue-space">
          <form id="add-cue-form" @submit.prevent="cueCloneNew()">
            <label for="cloning">Enter clone key</label>
            <input type="input" id="cuecloneadd" name="cuenclone" placeholder="clone key" v-model="cueClone" autofocus>
          </form>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { cuesStore } from '@/stores/cuesStore.js'
  
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()

  let cueClone = ref('')

  /* computed */
  const bentoCuesStatus = computed(() => {
    return storeAI.bentocuesState
  })

  /* methods */
  const cueCloneNew = () => {
    
  }

  const activateCues = (cueReq) => {
    // inform library to prepare gaia datatype contracts
    if (cueReq == 'gaia') {
      storeCues.prepareGaia()
    } else if (cueReq == 'aging') {
      storeCues.prepareAging()
    } else if (cueReq == 'planet') {
      storeCues.preparePlanet()
    } else if (cueReq == 'body') {
      storeCues.prepareBody()
    } else if (cueReq == 'body-biomarkers') { 
      storeCues.prepareBodyBiomarkers()
    }
  }

</script>

<style scoped>

#cue-cloning {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 2em;
}

.active {
background-color: rgb(113, 172, 114);
}

  @media (min-width: 1024px) {

    #bento-cloning {
      display: grid;
      grid-template-columns: 3fr 1fr;
      border: 1px solid green;
    }

  }
</style>