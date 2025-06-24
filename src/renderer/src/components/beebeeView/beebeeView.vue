<template>
  <div id="beebee-shaper">
    <div id="beebee-bentos" v-if="viewMinimal === false">
      <button id="cues-button" class="cue-agent" @click="openBentoAgent('cues')" :class="{ active: agentActive === 'cues' }">Cues</button>
      <button id="flake-button" class="cue-agent" @click="openBentoAgent('flake')" :class="{ active: agentActive === 'flake' }">Flake</button>
      <button id="besearch-button" class="cue-agent" @click="openBentoAgent('besearch')" :class="{ active: agentActive === 'besearch' }">Besearch</button>
      <button id="graph-button" class="cue-agent" @click="openBentoAgent('graph')" :class="{ active: agentActive === 'graph' }">Graph</button>
      <button id="diary-button" class="cue-agent" @click="openBentoAgent('diary')" :class="{ active: agentActive === 'diary' }">Diary</button>
    </div>
    <div id="beebee-agent" @mouseup.prevent="EndDrag()" @mousemove.prevent="OnDrag($event)" @mouseover.prevent="setMoveCursor($event)">
      <div id="bento-history" ref="historyQuants">
        <div id="bento-menu-items">
          <div class="history-menu">
            <button @click="historyType()" class="button-chat-menu" v-bind:class="{ active: historyList === true }">Chat</button>
          </div>
          <div class="history-menu">
            <button id="space-button-menu" @click="historyCuesType()" class="button-chat-menu" v-bind:class="{ active: historyCuesList === true }">Spaces</button>
          </div>
          <div class="history-menu">
            <button id="body-image" @click="viewBody()" class="button-chat-menu" :class="{ active: bodyDiagramShow === true }">Body</button>
             <Teleport to="body">
                <div id="body-daigram-interactive">
                  <body-diagram v-if="bodyDiagramShow === true"></body-diagram>
                </div>
            </Teleport>
          </div>
          <div class="history-menu">
            <button id="library-button-menu"@click="openLibrary()" class="button-chat-menu" v-bind:class="{ active: viewLibrary === true }">Library</button>
          </div>
        </div>
        <div id="submenu-active">
          <div id="active-history-menu" v-if="historyList ===  true">
            <chat-menu ></chat-menu>
          </div>
          <div id="active-space-history" v-if="historyCuesList ===  true">
            <space-menu></space-menu>
          </div>
        </div>
      </div>
      <div id="bento-menu-holder"  ref="sliderQuants"  @mousedown.prevent="setMove($event)" @mouseover.prevent="setMoveCursor($event)" @mouseup.prevent="EndDrag()">
      </div>
      <div id="beebee-bento-chat">
        <div class="beebee-home">
          <beebee-chat></beebee-chat>
        </div>
      </div>
    </div>
    <bento-cues></bento-cues>
    <bento-besearch v-if="agentActive === 'besearch'"></bento-besearch>
    <bento-flake></bento-flake>
    <bento-space></bento-space>
    <bento-graph v-if="bentoGraphStatus === true"></bento-graph>
    <bento-diary></bento-diary>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BodyDiagram from '@/components/beebeeView/diagrams/bodyDiagram.vue'
import ChatMenu from '@/components/beebeeView/navigation/chatMenu.vue'
import BentoCues from '@/components/bentocues/healthCues.vue'
import BentoBesearch from '@/components/besearch/besearchCycle.vue'
import BentoFlake from '@/components/bentocues/flakeCues.vue'
import BentoGraph from '@/components/bentocues/graphCues.vue'
import SpaceMenu from '@/components/beebeeView/navigation/spaceMenu.vue'
import BeebeeChat from '@/components/beebeehelp/chatInterface.vue'
import BentoSpace from '@/components/bentospace/spaceTemplate.vue'
import BentoDiary from '@/components/bentodiary/diaryTemplate.vue'
import { accountStore } from '@/stores/accountStore.js'
import { cuesStore } from '@/stores/cuesStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { computed } from 'vue'

  const storeAccount = accountStore()
  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()

  let agentActive = ref('')
  let viewLibrary = ref(false)
  let historyQuants = ref(null)
  let sliderQuants = ref(null)
  let historyWidth = ref(200)
  let newWidth = ref(0)
  let isResizing = ref(false)
  let startX = ref(0)
  let startWidth = ref(0)
  let agentMargin = ref(126)
  let chatMargin = ref(12)

  /* computed */
  const viewMinimal = computed(() => {
    if (storeAccount.viewMode === true) {
      agentMargin.value = 10
      chatMargin.value = 44
    } else {
      agentMargin.value = 126
      chatMargin.value = 12
    }
    return storeAccount.viewMode
  })

  const bodyDiagramShow = computed(() => {
    return storeAI.bodyDiagramShow
  })

  const bentoGraphStatus = computed(() => {
    return storeAI.bentographState
  })

  const historyList = computed(() => {
    return storeAI.historyList
  })

  const historyCuesList = computed(() => {
    return storeAI.historyCuesList
  })

  /* methods */
  const setMove = async (event) => {
    isResizing.value = true
    startX.value = event.clientX
    SetCursor("ew-resize")
    event.preventDefault()
  }

  const setMoveCursor = async (event) => {
    SetCursor("ew-resize")
    event.preventDefault()
  }


  const OnDrag = async (event) => {
    if (isResizing.value === true) {
      let newWidth = event.clientX
      historyWidth.value = Math.max(200, Math.min(newWidth, 800)) 
      event.preventDefault()
    }
  }

  const EndDrag = () => {
    isResizing.value = false
    SetCursor("default")
    event.preventDefault()
  }

  const SetCursor = (cursor) => {
    let page = sliderQuants.value
    page.style.cursor = cursor
  }

  const historyType = (type) => {
    storeAI.historyList = !storeAI.historyList
    storeAI.historyCuesList = false
  }

  const historyCuesType = () => {
    storeAI.historyCuesList = !storeAI.historyCuesList
    storeAI.historyList = false
    storeCues.historyCuesStatus = true
  }

  const openBentoAgent = (agent) => {
    agentActive.value = agent
    if (agent === 'cues') {
      storeAI.bentocuesState = !storeAI.bentocuesState
      storeAI.historyCuesList = true
    } else if (agent === 'flake') {
      storeCues.liveCueContext = 'flake'
      storeAI.bentoflakeState = !storeAI.bentoflakeState
    } else if (agent === 'besearch') {
      storeAI.bentobesearchState = !storeAI.bentobesearchState
    } else if (agent === 'graph') {
      storeAI.bentographState = !storeAI.bentographState
    } else if (agent === 'diary') {
      storeAI.bentodiaryState = !storeAI.bentodiaryState
    }
  }

  const viewBody = () => {
    storeAI.bodyDiagramShow = !storeAI.bodyDiagramShow
  }

  const openLibrary = () => {
    viewLibrary.value = false //  !viewLibrary.value
    storeAI.dataBoxStatus = true
    storeAI.uploadStatus = false
    storeLibrary.libraryStatus = true
  }

</script>

<style scoped>
#beebee-shaper {
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
  width: 100%;
}

#bento-menu-items {
  display: grid;
  grid-template-columns: 1fr;
  width: 200px;
  height: 160px;
  margin-top: v-bind(chatMargin + 'px');
}

#beebee-agent {
  display: grid;
  grid-template-columns: 1fr .1fr 6fr; /* Initial layout: main chat takes remaining space, history menu is 300px wide */
  grid-template-rows: 100vh; /* Full height */
  height: 100vh; /* Adjust as needed */
}

#bento-history {
  display: grid;
  grid-template-columns: 1fr;
  min-width: 60px; /* Minimum width */
  width: v-bind(historyWidth + 'px');
  overflow-x: hidden; /* Enable scrolling if content overflows */
  transition: width 0.3s; /* Smooth transition for width change */
  border-left: 1px solid #ccc; /* Optional: Add a border for separation */
  align-content: start;
}

#submenu-active {
  margin-top: 12px;
  overflow-y: scroll;
}

#bento-menu-holder {
  width: 2px;
  height: 100%;
  background-color:rgb(164, 164, 212);
  border: 1px solid blue;
  z-index: 10;
}

#history-buttons {
  display: grid;
  grid-template-columns: 1fr;
  min-width: 160px;
}

.history-menu {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
}

#active-history-menu {
  display: grid;
  grid-template-columns: 1fr;;
}

#active-space-history{
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid red;
}

.active {
  background-color: rgb(128, 170, 115);
}

.beebee-home {
  display: grid;
  grid-template-columns: 1fr;
}

.button-chat-menu {
  width: 90%;
  background-color: #b8cde2;
  color: #140d6b;
  border: none;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button-chat-menu:active {
  background-color: #004494;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

#beebee-bentos {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 2em;
  margin-bottom: 2em;
  z-index: 23;
}

.cue-agent {
  display: inline-grid;
  margin-right: .4em;
  background-color: #b8cde2;
  color: #140d6b;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cue-agent:hover {
    background-color: #2a82e0;
    transform: translateY(-2px);
}

.cue-agent:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}

#beebee-bento-chat {
  display: grid;
  grid-template-columns: 1fr;
  overflow-y: auto; /* Enable scrolling if content overflows */
}

  @media (min-width: 1024px) {

    #beebee-shaper {
      display: grid;
      grid-template-columns: 1fr;
      height: 100%;
      width: 100%;
    }

  #beebee-bentos {
      position: fixed;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      width: 94%;
      height: 26px;
      margin-top: 5em;
      margin-bottom: 2em;
      z-index: 23;
    }

    #bento-menu-items {
      display: grid;
      grid-template-columns: 1fr;
      width: 200px;
      height: 160px;
      margin-top: v-bind(chatMargin + 'px');
    }

    #beebee-agent {
      display: grid;
      grid-template-columns: 1fr .01fr 6fr; /* Initial layout: history menu is 300px wide, main chat takes remaining space */
      height: 80vh; /* Adjust as needed */
      margin-top: v-bind(agentMargin + 'px');
    }

    #bento-history {
      display: grid;
      grid-template-columns: 1fr;
      width: v-bind(historyWidth + 'px');
      overflow: hidden;
      transition: width 0.3s; /* Smooth transition for width change */
      position: relative;
      z-index: 10; /* Ensure it is on top */
    }

    #submenu-active {
      margin-top: v-bind(chatMargin + 'px');
      overflow-y: scroll;
    }

    #history-buttons {
      display: grid;
      grid-template-columns: 1fr;
      min-width: 160px;
      height: 140px;
    }

    .history-menu {
      position: relative;
      display: grid;
      grid-template-columns: 1fr;
      height: 28px;
      margin-bottom: .5em;
    }

    #active-history-menu {
      display: grid;
      grid-template-columns: 1fr;
      height: 100%;
    }

    #bento-menu-holder {
      width: 2px;
      height: 100%;
      background-color:rgb(164, 164, 212);
      z-index: 10;
    }

    .beebee-home {
      display: grid;
      grid-template-columns: 1fr;
    }

    .button-chat-menu {
      width: 90%;
      background-color: #b8cde2;
      color: #140d6b;
      border: none;
      border-radius: 4px;
      padding: 2px 4px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .button-chat-menu:active {
      background-color: #004494;
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .active {
      background-color: rgb(128, 170, 115);
    }

    #body-daigram-interactive {
      position: absolute;
      left: 210px;
      top: 0;
      background-color: white;
      border: 2px solid rgb(69, 69, 230);
      /* background-color: white; */
      z-index: 88;
    }

  #beebee-bento-chat {
      display: grid;
      grid-template-columns: 1fr;
      overflow-y: scroll;
    }

  }
</style>