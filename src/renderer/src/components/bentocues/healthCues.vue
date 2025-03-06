<template>


<Teleport to="body">
    <modal-cues :show="bentoCuesStatus" @close="closeBentoCues">
      Cues
      <template #header>
        <div id="cues-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoCues"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="cues-context">Cues</div>
          <div id="return-modal-close" @click="closeBentoCues">return</div>
        </div>
      </template>
      <template #body>
        <div id="bento-cues">
          <beebee-ai></beebee-ai>
          <button id="open-beebee" @click.prevent="setShowBeeBee">beebee</button>
          <div id="cues-wheel">
            <div id="wheel-tools">
              <button class="cue-select-btn" id="decision-start" @click="selectWheel('cues')" v-bind:class="{ active: cueAction === 'cues' }">Cues</button>
              <button class="cue-select-btn" id="decision-start" @click="selectWheel('newcue')" v-bind:class="{ active: cueAction === 'newcue' }">+ Cue</button>
              <button class="cue-select-btn" id="decision-start" @click="selectWheel('newrelationships')" v-bind:class="{ active: cueAction === 'newrelationship' }">+ Relationships</button>
              <button class="cue-select-btn" id="bentopath" @click="selectWheel('bentopath')" v-bind:class="{ active: cueAction === 'bentopath' }">Paths</button>
              <button class="cue-select-btn" id="newbentopath" @click="selectWheel('newbentopath')" v-bind:class="{ active: cueAction === 'newbentopath' }">+ Path</button>
              <button class="cue-select-btn" id="decision-start" @click="selectWheel('decision')" v-bind:class="{ active: cueAction === 'decision' }">+ Decision</button>
              <button class="cue-select-btn" id="decision-start" @click="selectWheel('clone')" v-bind:class="{ active: cueAction === 'clone' }">Clone</button>
            </div>
            <!-- existing cues -->
            <cues-prepared v-if="cueAction === 'cues'"></cues-prepared>
            <!-- view bento paths -->
            <path-view v-if="cueAction === 'bentopath'"></path-view>
            <!-- new bentopath -->
            <bento-path v-if="cueAction === 'newbentopath'"></bento-path>
            <!-- new cue -->
            <new-cue v-if="cueAction === 'newcue'"></new-cue>
            <!-- new relationships -->
            <new-relationships v-if="cueAction === 'newrelationships'"></new-relationships>
            <!-- decision cues -->
            <decision-cue v-if="cueAction === 'decision'"></decision-cue>
            <!-- clone cue -->
            <clone-cue v-if="cueAction === 'clone'"></clone-cue>
          </div>
          <!--<div id="filter-cues">
            <header>Filters</header>
            <div id="slider-holder">
              <div class="container" style="margin-left: 0px">
                <br>
                Motivation
                <br>
                <input class="range vertical-lowest-first" type="range" min="0" max="1" step="0.1" value="1">
                <br>
              </div>
              <div class="container">
                <br>
                Price
                <br>
                <input class="range vertical-heighest-first" type="range" min="0" max="1" step="0.1" value="1">
                <br>
              </div>
              <div class="container">
                <br>
                Biomarkers
                <br>
                <button id="biomarkerSwitch" @click="biomarkerSwitch()">{{ bioMarker.name }}</button>
                <br>
              </div>
              <div class="container" style="margin-right: 0px">
                <br>
                Devices
                <br>
                <input class="range vertical-heighest-first round" type="range" min="0" max="1" step="0.1" value="1">
                <br>
              </div>
              <div class="container" style="margin-right: 0px">
                <br>
                Science
                <br>
                <input class="range vertical-heighest-first round" type="range" min="0" max="1" step="0.1" value="1">
                <br>
              </div>
            </div>
          </div>-->
        </div>
      </template>
      <template #footer>
      </template>
    </modal-cues>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import BeebeeAi from '@/components/beebeehelp/spaceChat.vue'
import CuesPrepared from '@/components/bentocues/prepareCues.vue'
import PathView from '@/components/bentocues/bentopath/viewPath.vue'
import BentoPath from '@/components/bentocues/bentopath/storyTools.vue'
import DecisionCue from '@/components/bentocues/decisions/decisionCues.vue'
import NewCue from '@/components/bentocues/buildcue/newCue.vue'
import NewRelationships from '@/components/bentocues/relationships/newRelationships.vue'
import CloneCue from '@/components/bentocues/clone/cloneCue.vue'
import ModalCues from '@/components/bentocues/cuesModal.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  // let wheelType = ref('cues')
  let cueActive = ref('whole')
  let beebeeCues = ref(false)
  let cuesDecision = ref({ labels: [], datasets: [] })
  let bioMarker = ref({ name: 'Off', state: false })

  /* computed */
  const bentoCuesStatus = computed(() => {
    return storeAI.bentocuesState
  })

  const cueAction = computed(() => {
    return storeAI.cueAction
  })

  const decisionCues = computed(() => {
    let testPie = {}
    testPie['muscle mass'] = {
      labels: ['movement', 'strength', 'immunine system', 'bone density', 'grip', 'heart cardio'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113'],
        data: [36, 36, 36, 36, 36, 36]
        }
      ]}
      testPie['brain'] = {
      labels: ['fog', 'concentration', 'better sleep', 'prevent cog decline'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992'],
        data: [36, 36, 36, 36]
        }
      ]}
    return testPie
  })


  /* methods */
  const closeBentoCues = () => {
    storeAI.bentocuesState = !storeAI.bentocuesState
  }

  const setShowBeeBee = () => {
    storeAI.bentochatState = !storeAI.bentochatState
  }

  const cueSelect = (cueID, segID) => {
    cueActive.value = segID.label
    if (segID.label === 'Blood') {
      spaceSelect('b6e81d8bed9758b538aa25c13239968813b17f5a', segID.label)
    } else if (segID.label === 'Hotel1') {
      spaceSelect('6b58a76357424b4a7382f3c891b07db74c8d871a', segID.label)
    } else if (segID.label === 'Freshwater change') {
      spaceSelect('9e71b5fc3f1ea1c4e08a75478ef2ffcb7b43d7ff', segID.label)
    } else if (segID.label === 'immunine system') {
      spaceSelect('9e71b5fc3f1ea1c4e08a75478ef2ffcb7b43d7ff', segID.label)
    }

    // four major segments
    if (segID.label === 'Life' || segID.label === 'Nature' || segID.label === 'Environment' || segID.label === 'Culture') {
      storeAI.cueAction = 'segments'
    }
  }

  const spaceSelect = (spaceID, label) => {
    storeAI.bentospaceState = !storeAI.bentospaceState
    storeAI.liveBspace = {name: label, spaceid: spaceID}
  }

  const selectWheel = (type) => {
    // reset any active feedback or context
    storeAI.beebeeContext = ''
    storeCues.cueMatchMarkersLive = []
    storeAI.cueAction = type
    if (storeAI.cueAction === 'bentopath') {
      storeCues.pathListActive = true 
    } else if (storeAI.cueAction === 'newbentopath') {
      storeCues.bentopathState = true
    } else if (storeAI.cueAction === 'decision') {
      // bring beebee to life
      beebeeCues.value = !beebeeCues.value
      storeAI.beebeeContext = 'cues-decision'
    } else if (storeAI.cueAction === 'newcue') {
    } else {
      beebeeCues.value = false
    }
  }

  const biomarkerSwitch = () => {
    if (bioMarker.value.state === true) {
      bioMarker.value = { name: 'Off', state: false }
    } else {
      bioMarker.value = { name: 'On', state: true }
    }
  }

</script>

<style scoped>

#open-beebee {
  position: fixed;
  bottom: 10px;
  right: 120px;
  z-index: 31;
  display: grid;
  justify-content: center;
  place-self: start;
  align-self: start;
  height: 2em;
  width: 5em;
  background-color: white;
}


.active {
  background-color: rgb(113, 172, 114);
}

  @media (min-width: 1024px) {


    #bento-cues {
      display: grid;
      grid-template-columns: 3fr 1fr;
      border: 1px solid rgb(145, 138, 184);
      border-radius: 1%;
    }

    .cue-select-btn {
      margin-left: .6em;
      padding: .4em;
    }

    #cue-doughnut {
      display: grid;
      grid-template-columns: 1fr;
    }

    #new-cue-space {
      display: grid;
      grid-template-columns: 3fr 1fr 2fr;
    }

    #build-cues {
      display: grid;
      grid-template-columns: 1fr;
    }

    #add-cue-form {
      display: grid;
      align-self: end;
      margin-left: 2em;
    }

    #add-cue-form input{
      width: 40vw;
      font-size: 1.2em;
    }

    #cue-add {
      display: grid;
      justify-items: start;
      margin-left: .1em;
      font-size: 1.2em;
      width: 100px;
    }

    #wheel-tools {
      margin: 1em;
    }

    #cues-decision-flow {
      border: 0px solid red;
    }

    /* four basic quadrants */
    #decision-doughnut {
      border: 1px solid blue;
      min-height: 60vh;
    }

    #decision-doughnut-cues {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    #decision-reason {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    #decision-biomarkers {
      min-height: 10vh;
      margin:1em;
    }

    #decision-diary {
      min-height: 10vh;
      margin:1em;
    }

    .reason-container {
      padding: 1.2em;
      margin: 1.2em;
      border: 1px solid lightblue;
    }

    #peer-add-positive {
      background-color: #e6e7e7;
      display: grid;
      grid-template-columns: 2fr 1fr;
      justify-items: center;
      margin-top: 2em;
    } 

    #peer-add-concern {
      background-color: #e6e7e7;
      display: grid;
      grid-template-columns: 2fr 1fr;
      justify-items: center;
      margin-top: 2em;
    } 

    /* four basic quadrants */
    #new-doughnut-cues {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }


    #doughnut-size {
      min-height: 40vh;
      min-width: 40vw;
    }

    .pie {
      position: relative;
    }

    #cues-context {
      display: inline;
      font-size: 2em;
      padding-left: 1em
    }
    #return-modal-close {
      text-align: right;
    }

    .decision-elements {
      display: inline-block;
    }

    .decision-element-btn {
      margin-left: 1em;
      padding: .4em;
    }

    /*  fliters  */
    #filter-cues {
      margin-left: 2em;
    }

  }

</style>