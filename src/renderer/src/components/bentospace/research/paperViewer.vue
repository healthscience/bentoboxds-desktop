<template>
  <div id="research-box">
    <div id="research-bar" >
      <div id="box-bar">
        Research Bar
      </div>
      <div id="decision-tools">
        <button @click="addCueDecision()">+ decision</button>
        <div id="bento-cue-decicion" v-if="spaceDecision === true">
            <decision-cue></decision-cue>
        </div>
      </div>
    </div>
    <div id="paper-viewer" v-if="researchContent !== undefined">
      NB: research paper may need to be view only at source.
      <iframe id="paper-view" ref="paperpub" :src="researchContent.value.concept.research"></iframe>
    </div>
  </div>
</template>

<script setup>
import DecisionCue from '@/components/bentocues/decisions/decisionCues.vue'
import { ref, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  let spaceDecision = ref(false)
  
  const props = defineProps({
    bstag: String,
    bsresearch: String
  })

  /* methods */
  const addCueDecision = () => {
    spaceDecision.value = !spaceDecision.value
    // storeAI.decisionDoughnutCue = !storeAI.decisionDoughnutCue
  }


  /* computed */
  const researchContent = computed(() => {
    let paperMatch = {}
    for (let research of storeCues.researchPapers[storeAI.liveBspace.cueid]) {
      if (research.key === props.bsresearch) {
        paperMatch = research
      }
    }
    return paperMatch
  })

</script>

<style scoped>
.active {
  background-color: darkblue;
  border: 1px solid lightblue;
}

@media (min-width: 1024px) {

  #research-box {
    height: 300px;
    width: 100%;
  }

  .active {
    background-color: darkblue;
    border: 1px solid lightblue;
  }

  #research-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color:  rgb(141, 145, 226);
  }

  #paper-view {
    width: 100%;
    height: 100%;
  }

}

</style>