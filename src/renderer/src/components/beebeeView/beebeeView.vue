<template>
  <div id="beebee-shaper">
    <div class="bento-history">
      <div class="history-buttons">
        <div class="history">
          <button @click="historyType('history')">History</button>
        </div>
        <div class="spaces">
          <button @click="historyType('space')">Spaces</button>
        </div>
      </div>
      <div class="live-drop-zone" v-if="historyActive ===  true" @mouseover="hoverCheck(sis)">
        <div v-if="historyList === 'history'">
          <button class="create-chat">+ create chat</button>
          <div class="history-list" v-for="his in chartList">
            <button class="flat-history"> {{ his }} </button>
          </div>
        </div>
        <div v-else>
          <div class="history-list" v-for="sis in spaceList">
            <button class="flat-history" @click="bentoSpaceOpen(sis)" @mouseover="hoverCheck(sis)" @mousemove="moveCheck(sis)"> {{ sis }} </button> <!--@mouseup="dropBBox"-->
          </div>
        </div>
      </div>
    </div>
    <div class="bentospace">
      <div class="beebee-home">
        <beebee-chat></beebee-chat>
       </div>
       <bento-space></bento-space>
    </div>
  </div>
</template>

<script setup>
import BeebeeChat from '@/components/beebeehelp/chatInterface.vue'
import BentoSpace from '@/components/bentospace/spaceTemplate.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref } from 'vue'

const storeAI = aiInterfaceStore()

// const startChat = ref(true)
let historyActive = ref(false)
let historyList = ref('history')
let chartList = ref(['chat1'])
let spaceList = ref(['space1'])

let historyType = (type) => {
  historyList = type
  historyActive.value = !historyActive.value
}

const bentoSpaceOpen = (spaceID) => {
  storeAI.bentospaceState = !storeAI.bentospaceState
  storeAI.liveBspace = spaceID
  // storeAI.beebeeChatLog = false
}

const dropSpaceActive = (spaceID) => {
  storeAI.historyActive = !storeAI.historyActive
}

const dropBBox = (ev) => {
  ev.preventDefault()
  if (storeAI.longPress === true) {
    storeAI.bentoboxList[ev.target.outerText] = []
    storeAI.bentoboxList[ev.target.outerText].push(ev.target.outerText)
    storeAI.longPress = false
  }
}

const hoverCheck = (sis) => {
  // console.log('hover id')
  // console.log(sis)
}

const moveCheck = (sis) => {
  // console.log('move id')
  // console.log(sis)
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

.create-chat {
  background-color: white;
  border: 1px dashed grey;
}

.flat-history {
  background-color: rgb(110, 134, 226);
  border: 0px;
  margin: .4em;
  padding: .5em;
}

.history-list {
  display: inline-block;
}

/* .history-list:first-child {
  background-color: green;
} */

.live-drop-zone {
  display: block;
  height: 2em;
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

    .history-buttons {
      display: grid;
      grid-template-columns: 1fr;
    }

    .history {
      position: relative;
      height: 2em;
    }

    .history-list {
      display: block;
    }

    .history-list:hover {
      background-color: blue;
    }

    .spaces {
      position: relative;
      height: 2em;
      border: 0px dashed blue;
    }

    .live-drop-zone {
      height: 100%;
      border: 0px dashed rgb(228, 137, 39);
    }

    .live-drop-zone:hover {
      background-color: rgb(244, 245, 246);
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

    #message-question {
      text-align: center;
    }
    .beebee-home {
      display: grid;
      grid-template-columns: 1fr;
      border: 0px dashed rgb(207, 108, 21);
    }
  }
</style>