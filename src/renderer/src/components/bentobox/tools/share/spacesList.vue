<template>
    <div id="spaces-list">
        <select class="select-space-save" id="space-options-save" v-model="spaceSave" @change="selectBentoSpace()">
        <option selected="" v-for="sp in spaceList" :value="sp.key">
            {{ sp.value.concept.name }}
        </option>
        </select>
    </div>
</template>

<script setup>  
import { ref, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

const storeCues = cuesStore()
const storeAI = aiInterfaceStore()
const storeBentobox = bentoboxStore()

  let spaceSave = ref('')
  let shareSelect = ref(false)

  const props = defineProps({
    bboxid: String
  })

  /*  computed */
  const spaceList = computed(() => {
    // sort into alphabetical order
    const contracts = storeCues.cuesList
    // Sort the contracts by name in ascending order
    const sortedContracts = contracts.sort((a, b) => {
      if (a.value.concept.name < b.value.concept.name) return -1
      if (a.value.concept.name > b.value.concept.name) return 1
      return 0
    })
    return sortedContracts
  })

  /*
  * library summary
  */
  const expLibrarySummary = computed(() => {
    console.log(storeAI?.boxLibSummary)
    if (storeAI?.boxLibSummary[props.bboxid] === undefined) {
        console.log(' firs time use of nxp i bbox')
    } else {
      if (storeAI?.boxLibSummary[props.bboxid].data === undefined) {
      return false
      } else {
      let NXPcontract = {}
      NXPcontract.key = Object.keys(storeAI?.boxLibSummary[props.bboxid].data)
      let modKeys = []
      for (let mod of storeAI.boxLibSummary[props.bboxid].data.modules) { // [NXPcontract.key].modules) {
          if (mod !== undefined) {
          modKeys.push(mod.key)
          }
      }
      NXPcontract.modules = modKeys
      return NXPcontract
      }
    }
  })

  /* methods */
  const selectBentoSpace = () => {
    // if first time prepare a boxID
    let bidPair = {}
    if (storeAI?.boxLibSummary[props.bboxid] === undefined) {
      bidPair = { bboxid: props.bboxid, contract: props.bboxid}
    } else {
      bidPair = { bboxid: props.bboxid, contract: expLibrarySummary.value.key[0]}
    }
    // check object set in list
    if (storeAI.bentoboxList[spaceSave.value] === undefined) {
    storeAI.bentoboxList[spaceSave.value] = []
    }
    if (storeBentobox.locationBbox[spaceSave.value] === undefined) {
    storeBentobox.locationBbox[spaceSave.value] = []
    }
    storeAI.bentoboxList[spaceSave.value].push(bidPair)
    clickAddbentoSpace(props.bboxid)
    // add location default if not already set?
    storeBentobox.setLocationBbox(spaceSave.value, props.bboxid)
    spaceSave.value = 0
  }

  const clickAddbentoSpace = (boxid) => {
    // show the space list
    // shareSelect.value = !shareSelect.value  emit to close dataModal
    storeAI.prepareLibrarySummary(boxid)
  }

</script>

<style scoped>
#spaces-list {
    display: grid;
    position: relative;
    /*top: 0;
    left: -109px;
    border: 0px solid red; */
    z-index: 52;
}

.select-space-save {
  z-index: 44;
}

@media (min-width: 1024px) {
  #spaces-list {
    display: grid;
    position: relative;
    /*top: 0;
    left: -109px;
    border: 0px solid red; */
    z-index: 52;
  }

  .select-space-save {
    z-index: 44;
  }
}

</style>