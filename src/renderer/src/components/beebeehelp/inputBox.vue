<template>
  <div id="ai-interaction">
    <form id="ask-ai-form" @submit.prevent="storeAI.submitAsk()">
      <label for="askname"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
      <input type="text-area" id="askinput" name="ainame" placeholder="What would you like to know?" v-model="storeAI.askQuestion.text" autofocus>
    </form>
    <button id="natlang-ask" type="submit" v-if="beebeeAIStatus.active === true" @click="storeAI.submitAsk">
      Ask BeeBee
    </button>
    <data-box v-if="dataBoxStatus === true"></data-box>
  </div>
</template>

<script setup>
import DataBox from '@/components/dataspace/dataBox.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { computed } from 'vue'

  const storeAI = aiInterfaceStore()

  const beebeeAIStatus = computed(() => {
    return storeAI.helpchatAsk
  })

  // a computed ref
  const dataBoxStatus = computed(() => {
    return storeAI.dataBoxStatus
  })

</script>

<style scoped>

#ai-interaction {
  display: grid;
  grid-template-columns: 1fr;
}

#askinput {
  font-size: 1.2em;
  height:4em;
  width: 100%;
}

#natlang-ask {
  height: 60px;
}

@media (min-width: 1024px) {
  #ai-interaction {
    display: grid;
    grid-template-columns: 4fr 1fr
  }

  #askinput {
    font-size: 1.2em;
    padding-left: 1em;
    height:4em;
    width: 100%;
    opacity: 100%;
  }

  #natlang-ask {
    height: auto;
  }
}

</style>