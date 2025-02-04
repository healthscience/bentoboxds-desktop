<template>
  <div id="experiment-builder-header">Module Builder</div>
  <div id="experiment-holder">
    <div id="modules-available"
      v-on:dragover.prevent
      v-on:drop="handleDrop($event, 'modules-available')"
    >
      <div class="mod-active" 
          v-for="(element) in storeLibrary.genesisModules"
          :key="element.key"
          draggable="true"
          v-on:dragstart="handleDragStart($event, element)"
        >
          {{ element.name }}
      </div>
    </div>
    <div id="modules-selected"
      v-on:dragover.prevent
      v-on:drop="handleDrop($event, 'modules-selected')"
    >
      <div class="mod-selected"
        v-for="newMod in storeLibrary.newModuleList" 
        draggable="true"
        v-on:dragstart="handleDragStart($event, newMod)"
      >
        <div class="mod-option-holder"
        >
          <component :is="componentsNew[newMod.name]" :refFocus="storeLibrary.moduleNxpActive"></component>
      </div>
      </div>
    </div>
    <div id="refcontract-selected"
      v-on:dragover.prevent
      v-on:drop="handleDrop($event, 'refcontract-selected')"
    >
      <div id="check-lib" v-if="libraryAvailable.length > 0">
        <div class="ref-selected"
          v-for="newRef in libraryAvailable" 
          draggable="true"
          v-on:dragstart="handleDragRefStart($event, newRef)"
        >
          ref-- {{ newRef.value.refcontract }}
          <div v-if="newRef.value.concept">{{ newRef.value.concept.name }}</div>
          <div v-if="newRef.value.computational" class="contract-name">{{ newRef.value.computational.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed } from 'vue'

import NxpQuestion from '@/components/dataspace/modules/nxpQuestion.vue'
import NxpPackaging from '@/components/dataspace/modules/nxpDevice.vue'
import NxpDapp from '@/components/dataspace/modules/nxpDapp.vue'
import NxpCompute from '@/components/dataspace/modules/nxpCompute.vue'
import NxpControl from '@/components/dataspace/modules/nxpControl.vue'
import NxpVisualise from '@/components/dataspace/modules/nxpBuildVisualise.vue'

import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()
  const componentsNew = shallowRef({ question: NxpQuestion, packaging: NxpPackaging, compute: NxpCompute, visualise: NxpVisualise })

  let refDrop = ref(false)

  /* computed */
  const libraryAvailable = computed (() => {
    if (Object.keys(storeLibrary.publicLibrary).length > 0) {
      return storeLibrary.publicLibrary.referenceContracts[storeLibrary.moduleNxpActive]
    } else {
      return []
    }
  })


  const handleDragStart = (event, itemData) => {
    event.dataTransfer.setData('application/json', JSON.stringify(itemData))
  }

  const handleDragRefStart = (event, itemData) => {
    refDrop.value = true
    event.dataTransfer.setData('application/json', JSON.stringify(itemData))
  }

  const handleDrop = (event, targetContainer) => {
    if (refDrop.value === false) {
      const itemData = JSON.parse(event.dataTransfer.getData('application/json'))
      if (itemData.ref !== true) {
        if (targetContainer === 'modules-selected') {
          // set as active module contract type
          setModType(itemData)
          storeLibrary.newModuleList = storeLibrary.newModuleList.filter(i => i.id !== itemData.id)
          storeLibrary.newModuleList.push(itemData)
          // remove from available list
          storeLibrary.genesisModules = storeLibrary.genesisModules.filter(i => i.id !== itemData.id)
        } else if (targetContainer === 'modules-available') {
          storeLibrary.genesisModules = storeLibrary.genesisModules.filter(i => i.id !== itemData.id)
          storeLibrary.genesisModules.push(itemData)
          // remove from selected list
          storeLibrary.newModuleList = storeLibrary.newModuleList.filter(i => i.id !== itemData.id)
        }
      }
    } else {
      handleRefDrop(event, targetContainer)
    }
  }

  const handleRefDrop = (event, targetContainer) => {
    let dropItem = JSON.parse(event.dataTransfer.getData('application/json'))
    console.log(dropItem)
    // match to module and add
    if (dropItem?.value?.refcontract === 'question') {
      storeLibrary.newnxp.questionLive.push(dropItem)
    } else if (dropItem?.value?.refcontract === 'packaging') {
      storeLibrary.newnxp.packagingLive.push(dropItem)
    } else if (dropItem?.value?.refcontract === 'compute') {
     storeLibrary.newnxp.computeLive.push(dropItem)
    } else if (dropItem?.value?.refcontract === 'visualise') {
      storeLibrary.newnxp.visualiseLive.push(dropItem)
    }
    refDrop.value = false
  }

  const setModType = (item) => {
    if (item?.name) {
      if (item.name === 'packaging') {
        storeLibrary.moduleNxpActive = 'packaging'
      } else {
        storeLibrary.moduleNxpActive = item.name
      }
    } else {
      storeLibrary.moduleNxpActive = item.refcontract
    }
  }


</script>


<style scoped>

@media (min-width: 1024px) {

  #experiment-builder-header {
    font-weight: bold;
  }

  #experiment-holder {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    column-gap: 120px;
  }

  #modules-available {
    display: grid;
    grid-template-columns: 1fr;
    align-items: end;
    border: 1px solid lightblue;
    padding: 2em;
  }

  #modules-selected {
    display: grid;
    grid-template-columns: 1fr;
    border: 1px solid orange;
    padding: 2em;
  }

  .mod-active {
    background-color: antiquewhite;
    width: 80%;
    max-height: 100px;
    margin: 0.5em;
  }

  .mod-selected {
    background-color: orange;
    width: 80%;
    margin: 0.5em;
  }

  .mod-option-holder {
    min-height: 120px;
    border: 1px solid orange;
  }

  #refcontract-selected {
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    border: 1px solid grey;
    padding: 1em;
    height: inherit;
    border: 1px solid blue;
  }

  .ref-selected {
    display: grid;
    border: 1px solid grey;
    height: 60px;
  }

  .contract-name {
    font-weight: bold;
  }

}

</style>