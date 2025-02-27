<template>
  <div id="media-box">
    <div id="media-bar" >
      <div id="box-bar">
        <!--mediaContext.value.concept.media></div>
    </vue-plyr>{{ mediaContext }} -->
        BentoMedia Bar
      </div>
      <div id="decision-tools">
        <button @click="addCueDecision()">+ decision</button>
        <div id="bento-cue-decicion" v-if="spaceDecision === true">
            <decision-cue></decision-cue>
        </div>
      </div>
    </div>
    <vue-plyr>
      <div data-plyr-provider="youtube" :data-plyr-embed-id=mediaContext.value.concept.media></div>
    </vue-plyr>
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
    bsmedia: String
  })

  /* methods */
  const addCueDecision = () => {
    spaceDecision.value = !spaceDecision.value
    // storeAI.decisionDoughnutCue = !storeAI.decisionDoughnutCue
  }

  /* computed */
  const mediaContext = computed(() => {
    let matchMed = {}
    for (let med of storeCues.mediaMatch[storeAI.liveBspace.cueid]) {
      if (med.key === props.bsmedia) {
        matchMed = med
      }
    }
    return matchMed
  })

</script>

<style scoped>
.active {
  background-color: darkblue;
  border: 1px solid lightblue;
}

@media (min-width: 1024px) {

  #media-box {
    height: 300px;
    width: 100%;
  }

  .active {
    background-color: darkblue;
    border: 1px solid lightblue;
  }

  #media-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color:  rgb(141, 145, 226);
  }

}

</style>