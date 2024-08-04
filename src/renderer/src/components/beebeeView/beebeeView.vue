<template>
  <div id="beebee-shaper">
    <div class="bento-history">
      <div id="bento-ai-diary">
        <button id="diary-button" @click="openBentoDiary()" :class="{ active: diaryActive === true }">Diary</button>

      </div>
      <div class="history-buttons">
        <div class="history">
          <button @click="historyType('history')" class="button-chat-menu" v-bind:class="{ active: historyList === 'history' }">Chat</button>
        </div>
        <div class="spaces">
          <button @click="historyType('space')" class="button-chat-menu" v-bind:class="{ active: historyList === 'space' }">Spaces</button>
        </div>
      </div>
      <chat-menu v-if="historyActive ===  true"></chat-menu>
      <space-menu v-if="historyActive !==  true"></space-menu>
    </div>
    <div class="bentospace">
      <div class="beebee-home">
        <beebee-chat></beebee-chat>
       </div>
       <bento-space></bento-space>
       <bento-diary></bento-diary>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChatMenu from '@/components/beebeeView/navigation/chatMenu.vue'
import SpaceMenu from '@/components/beebeeView/navigation/spaceMenu.vue'
import BeebeeChat from '@/components/beebeehelp/chatInterface.vue'
import BentoSpace from '@/components/bentospace/spaceTemplate.vue'
import BentoDiary from '@/components/bentodiary/diaryTemplate.vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { computed } from 'vue'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let diaryActive = ref(false)

  const historyActive = computed(() => {
    return storeBentobox.historyActive
  })

  const historyList = computed(() => {
    return storeAI.historyList
  })


  let historyType = (type) => {
    storeAI.historyList = type
    storeBentobox.historyActive = !storeBentobox.historyActive // true
  }

  const openBentoDiary = () => {
    diaryActive.value = !diaryActive.value
    storeAI.bentodiaryState = !storeAI.bentodiaryState
  }

</script>

<style scoped>
#beebee-shaper {
  display: grid;
  grid-template-columns: 1fr;
  top: 0%;
  width: 90vw;
  height: 94vh;
}

.bento-history {
  margin-top: 5%;
  height: auto;
  display: grid;
  justify-content: center;
}

.history-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.history {
  display: relative;
  align-items: top;
  height: 1em;
}
.spaces {
  display: relative;
  height: 2em;
}


.active {
  background-color: rgb(113, 172, 114);
}

.bentospace {
  display: grid;
  grid-template-columns: 1fr;
  height: 80vh;
  width: 90vw;
  padding-top: 2px;
  transform-origin: left top;
  border: 0px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
}

.beebee-home {
  display: grid;
  height: 90vh;
}

.button-chat-menu {
  width: 120px;
}

  @media (min-width: 1024px) {

    #beebee-shaper {
      display: grid;
      grid-template-columns: 1fr 7fr;
      height: 90vh;
      width: 100%;
      border: 0px dashed rgb(0, 15, 128);
      
    }

    .bento-history {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 10fr;
      margin-top: 8.5em;
      height: 60vh;
    }

    #bento-ai-diary {
      margin-top: 2em;
      margin-bottom: 2em;
    }

    .history-buttons {
      display: grid;
      grid-template-columns: 1fr;
    }

    .history {
      position: relative;
      height: 2em;
    }

    .spaces {
      position: relative;
      height: 2em;
      border: 0px dashed blue;
    }
    .bentospace {
      display: grid;
      grid-template-columns: 1fr;
      border: 2px solid green;
      height: 80vh;
      width: 100%;
      margin-top: 8.5em;
      transform-origin: left top;
      border: 0px solid orange;
      background-color: #fff4f4;
      background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
      background-size: 60px 60px, 60px 60px;
    }
    .beebee-home {
      display: grid;
      grid-template-columns: 1fr;
      border: 0px dashed rgb(207, 108, 21);
    }

    .button-chat-menu {
      width: 180px;
    }

  }
</style>