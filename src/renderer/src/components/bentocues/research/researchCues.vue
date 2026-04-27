<template>
  <h3>Research tools</h3>
  <div id="bento-research-cues">
    <form id="add-research-form" @submit.prevent="researchAdd()">
      <label for="research"></label>
      <input type="input" id="research-add" name="research" placeholder="add research url" v-model="researchURLadd" autofocus>
    </form>
    <button id="bento-research-task" type="submit" @click.prevent="researchAdd()">
      + add paper
    </button>
  </div>
  <div id="research-paper-list" v-if="researchPapers?.length > 0">
    <div id="research-paper-select" v-for="pap in researchPapers" :value="pap.id">
      <button class="research-paper-item" @click="viewResearch(pap.value.concept.research)">
        {{ pap.value.concept.research }}
      </button>
      <button class="research-paper-source" @click="viewSourcePaper(pap.value.concept.research)">
        View source
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { cuesStore } from '@/stores/cuesStore.js'

  const storeLibrary = libraryStore()
  const storeAI = aiInterfaceStore()
  const storeCues = cuesStore()
  const storeBentobox = bentoboxStore()

  let researchURLadd = ref('')
  let spaceResearch = ref(false)

  /* props */
  const props = defineProps({
    spaceid: String
  })

  /* computed */
  const researchMedia = computed(() => {
    return storeBentobox.researchMedia[props.spaceid]
  })

  const researchPapers = computed(() => {
    return storeCues.researchPapers[props.spaceid]
  })

  /* methods */
  const researchAdd = () => {
    // need to add to space history TODO make save entry
    // const spaceList.push(research info for this space only ie context)
    // assume youtube and extract id
    if (researchURLadd.value.length > 0) {
      let newResearch = { cueid: storeAI.liveBspace.cueid, research: researchURLadd.value }
      // if first time setup object
      if (storeCues.researchPapers[storeAI.liveBspace.cueid] === undefined) {
        storeCues.researchPapers[storeAI.liveBspace.cueid] = []
      }
      // storeCues.researchPapers[storeAI.liveBspace.cueid].push({ key: 'rtemp', value: { concept: { spaceid: storeAI.liveBspace.cueid, research: researchURLadd.value }}})
      // save to store
      const cueRContract = {}
      cueRContract.type = 'library'
      cueRContract.action = 'research'
      cueRContract.reftype = 'research-cues'
      cueRContract.task = 'PUT'
      cueRContract.privacy = 'public'
      cueRContract.data = newResearch
      storeLibrary.sendMessage(cueRContract)
      researchURLadd.value = ''
    }
  }

  const viewResearch = (paper) => {
    if (paper.length > 0) {
      // check if holder setup
      if (storeBentobox.locationRbox[storeAI.liveBspace.cueid] === undefined) {
        storeBentobox.locationRbox[storeAI.liveBspace.cueid] = {}
      }
      storeBentobox.setLocationRbox(storeAI.liveBspace.cueid, paper)
      if (storeBentobox.researchMedia[storeAI.liveBspace.cueid]) {
        storeBentobox.researchMedia[storeAI.liveBspace.cueid].push({  key: paper, tag: 'paper', id: paper })
      } else {
        storeBentobox.researchMedia[storeAI.liveBspace.cueid] = []
        storeBentobox.researchMedia[storeAI.liveBspace.cueid].push({ key: paper, tag: 'paper', id: paper })
      }
    } else {
      console.log('empty URL')
    }
    //  need to emit to close one component up
    // spaceResearch.value = false
  }

  const viewSourcePaper = (paper) => {
    // visit source in new tab
    window.open(paper, '_blank')
  }

</script>

<style scoped>

#bento-research-task {
  margin-top: 1em;
}

@media (min-width: 1024px) {


}

</style>