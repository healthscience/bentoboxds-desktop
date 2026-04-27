<template>
  <div id="marker-box">
    <div id="marker-bar">
      <div id="box-bar" >
        Marker Bar
      </div>
      <div id="decision-tools">
        <button @click="addCueDecision()">+ decision</button>
        <div id="bento-cue-decicion" v-if="spaceDecision === true">
            <decision-cue></decision-cue>
        </div>
      </div>
      <div id="add-nxp-bentobox">
        <button @click="openLibrary()">+ N=1 BentoBox</button>
      </div>
    </div>
    <div id="marker-content">
      <div class="marker-content">
        Marker: {{ props.bstag }} : {{ markerMatchContract.value.concept.name }}
      </div>
      <div class="marker-content">
        LAB: {{ markerMatchContract.value.concept.lab }}
      </div>
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


  /* computed */
  const markerMatchContract = computed(() => {
    let cueContract = {}
    for (let marker of storeCues.cueMatchMarkersLive) {
      if (marker[0].key === props.bsresearch) {
        cueContract = marker[0]
      }
    }
    return cueContract
  })

  /* methods */
  const addCueDecision = () => {
    spaceDecision.value = !spaceDecision.value
    // storeAI.decisionDoughnutCue = !storeAI.decisionDoughnutCue
  }

  const openLibrary = () => {
    // need to set context to library
    storeLibrary.inContext = 'space'
    storeAI.dataBoxStatus = true
    storeAI.uploadStatus = false
    storeLibrary.libraryStatus = true
    storeLibrary.libPeerview = true
    storeLibrary.newNXP = true
  }

</script>

<style scoped>
.active {
  background-color: darkblue;
  border: 1px solid lightblue;
}


#marker-content {
  height: inherit;
  width: inherit;
}

@media (min-width: 1024px) {

  #marker-box {
    height: 300px;
    width: 100%;
  }

  .active {
    background-color: darkblue;
    border: 1px solid lightblue;
  }

  #marker-bar {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color:  rgb(141, 145, 226);
  }

}

</style>