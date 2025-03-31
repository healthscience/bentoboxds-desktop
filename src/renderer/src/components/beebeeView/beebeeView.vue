<template>
  <div id="beebee-shaper">
    <div id="beebee-bentos">
      <button id="cues-button" class="cue-agent" @click="openBentoAgent('cues')" :class="{ active: agentActive === 'cues' }">Cues</button>
      <button id="flake-button" class="cue-agent" @click="openBentoAgent('flake')" :class="{ active: agentActive === 'flake' }">Flake</button>
      <button id="besearch-button" class="cue-agent" @click="openBentoAgent('besearch')" :class="{ active: agentActive === 'besearch' }">Besearch</button>
      <button id="graph-button" class="cue-agent" @click="openBentoAgent('graph')" :class="{ active: agentActive === 'graph' }">Graph</button>
      <button id="diary-button" class="cue-agent" @click="openBentoAgent('diary')" :class="{ active: agentActive === 'diary' }">Diary</button>
    </div>
    <div id="beebee-agent">
      <div id="bento-history">
        <div id="history-buttons">
          <div class="history-menu">
            <button @click="historyType('history')" class="button-chat-menu" v-bind:class="{ active: historyList === 'history' }">Chat</button>
          </div>
          <div class="history-menu">
            <button id="space-button-menu" @click="historyType('space')" class="button-chat-menu" v-bind:class="{ active: historyList === 'space' }">Spaces</button>
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
        <div id="active-history-menu">
          <chat-menu v-if="historyList ===  'history'"></chat-menu>
          <space-menu v-if="historyList ===  'space'"></space-menu>
        </div>
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
import { cuesStore } from '@/stores/cuesStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { computed } from 'vue'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()

  let agentActive = ref('')
  let viewLibrary = ref(false)

  /* computed */
  const bodyDiagramShow = computed(() => {
    return storeAI.bodyDiagramShow
  })

  const bentoGraphStatus = computed(() => {
    return storeAI.bentographState
  })

  const historyActive = computed(() => {
    return storeBentobox.historyActive
  })

  const historyList = computed(() => {
    return storeAI.historyList
  })

  /* methods */
  const historyType = (type) => {
    storeAI.historyList = type
    storeBentobox.historyActive = !storeBentobox.historyActive // true
  }

  const openBentoAgent = (agent) => {
    agentActive.value = agent
    if (agent === 'cues') {
      storeAI.bentocuesState = !storeAI.bentocuesState
      storeAI.historyList = 'cue'
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

#beebee-agent {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 7fr;
}

#bento-history {
  display: grid;
  grid-template-columns: 1fr;
  height: 120px;
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
  grid-template-columns: 1fr;
}

.active {
  background-color: rgb(128, 170, 115);
}

.beebee-home {
  display: grid;
  grid-template-columns: 1fr;
  border: 0px dashed rgb(207, 108, 21);
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
  height: 80vh;
  width: 90vw;
  padding-top: 2px;
  transform-origin: left top;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px; 
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

    #beebee-agent {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 7fr;
      margin-top: 9.5em;
    }

    #bento-history {
      display: grid;
      grid-template-columns: 1fr;
      height: 100%;
      align-content: start;
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

    .beebee-home {
      display: grid;
      grid-template-columns: 1fr;
      border: 0px dashed rgb(207, 108, 21);
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
      height: 80vh;
      width: 100%;
      transform-origin: left top;
      background-color: #fff4f4;
      background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
      background-size: 60px 60px, 60px 60px;
    }

  }
</style>