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
          v-on:dragover.prevent
          v-on:drop="handleRefDrop($event, 'mod-option-holder')"
        >
          <component :is="componentsNew[newMod.name]"></component>
      </div>
      </div>
    </div>
    <div id="refcontract-selected"
      v-on:dragover.prevent
      v-on:drop="handleDrop($event, 'refcontract-selected')"
    >
      <div class="ref-selected"
        v-for="newRef in storeLibrary.refcontractOption" 
        draggable="true"
        v-on:dragstart="handleDragStart($event, newRef)"
      >
        ref-- {{ newRef.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed } from 'vue'

// import draggable from 'vuedraggable'
import NxpQuestion from '@/components/dataspace/modules/nxpQuestion.vue'
import NxpDevice from '@/components/dataspace/modules/nxpDevice.vue'
import NxpDapp from '@/components/dataspace/modules/nxpDapp.vue'
import NxpCompute from '@/components/dataspace/modules/nxpCompute.vue'
import NxpControl from '@/components/dataspace/modules/nxpControl.vue'
import NxpVisualise from '@/components/dataspace/modules/nxpBuildVisualise.vue'

import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAI = aiInterfaceStore()
  const bboxStore = bentoboxStore()
  const storeLibrary = libraryStore()
  const componentsNew = shallowRef({ question: NxpQuestion, data: NxpDevice, compute: NxpCompute, visualise: NxpVisualise })

  let refDrop = ref(false)

  /* computed */
  const libraryAvailable = computed (() => {
  })


  const handleDragStart = (event, itemData) => {
    event.dataTransfer.setData('application/json', JSON.stringify(itemData))
  }

  const handleDrop = (event, targetContainer) => {
    console.log('dropH')
    if (refDrop.value === false) {
      console.log('false through')
      const itemData = JSON.parse(event.dataTransfer.getData('application/json'))
      console.log('iteme tyoep')
      console.log(itemData)
      if (itemData.ref !== true) {
        if (targetContainer === 'modules-selected') {
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
    }
  }

  const handleRefDrop = (event, targetContainer) => {
    console.log('drop REF')
    event.preventDefault()
    console.log(event)
    refDrop.value = true
    // add to module
    storeLibrary.buildNewExperiment.push('refcontract')
    // return drop value
    refDrop.value = false
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
    margin: 0.5em;
  }

  .mod-selected {
    background-color: orange;
    width: 80%;
    margin: 0.5em;
  }

  .mod-option-holder {
    min-height: 120px;
  }

  #refcontract-selected {
    display: grid;
    grid-template-columns: 1fr;
    border: 1px solid grey;
    padding: 1em;
    height: 60px;
  }

}

</style>