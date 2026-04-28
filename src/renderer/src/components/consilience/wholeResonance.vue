<template>
  <Teleport to="body">
    <modal-cues :show="bentoFlakeStatus" :z-index="currentZIndex" @close="closeBentoFlake">
      Cues
      <template #header>
        <div id="flake-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoFlake"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="cues-context">Flake</div>
          <div id="return-modal-close" @click="closeBentoFlake">return</div>
        </div>
      </template>
      <template #body>
        <div class="main">
          <div id="cues-holistic">
            <div id="cues-connector">
              <button class="flake-agent" @click="cueConnect()" v-bind:class="{ active: cuesTools === true }">Cues</button>
            </div>
            <div id="cues-connector">
              <button class="flake-agent" @click="cueCorridor()" v-bind:class="{ active: cuesCorridor === true }">Corridor</button>
            </div>
            <div id="juv-holder">
             <button class="flake-agent" id="health-rejuvenation" @click="juvCycle()">Rejuvenation</button>
            </div>
            <div id="opti-holder">
             <button  class="flake-agent" id="health-optimisation" @click="optiCycle()">Optimisation</button>
            </div>
            <div id="stacks-holder">
              <button  class="flake-agent" id="stacks-optimisation" @click="stackProtocols()">Protocols</button>
              <div id="stack-types" v-if="stacksOpen === true">
                Markers Product - supplements  Treatments etc.
              </div>
            </div>
          </div>
          <div id="cues-context-flake">
            <div id="cues-context-tools" v-if="cuesTools === true">
              <!-- existing cues -->
              <cues-prepared v-if="wheelType === 'cues'"></cues-prepared>
            </div>
            <div id="cues-corridor-tools" v-if="cuesCorridor === true">
              <!-- cues over time past future corridors of life -->
              Coming soon cues over time, past, present and future
            </div>
            <beebee-ai></beebee-ai>
            <button id="open-beebee" @click.prevent="setShowBeeBee">beebee</button>
            <div id="bento-flake">
              <!-- make three by three grid to postion branches from -->
              <div class="center-grid"></div>
              <div class="center-grid"></div>
              <div class="center-grid"></div>
              <div class="center-grid"></div>
              <div id="center-flake" class="center-grid singularity">
                <div class="cue-holistic" v-if="cueBalance.length > 0">
                  <div class="cues-segs" v-for="cue of cuesFlakesH" :style="cue.style">
                      -----
                    <div class="branch-holder">
                      <div class="branch-holder-under">
                        <!-- under balance-->
                      </div>
                      <div class="branch-holder-balance">
                        <div class="branch-quant">
                          <div class="cues-status flake-cue" v-for="cstatus of cuesStatusH[cue.cue]"  :style="{ backgroundColor: cstatus.cuecolor }" @click="viewCueHex(cstatus)" @mouseover="setHexTooltip(cstatus)" @mouseleave="showTooltip = false">
                            {{ cstatus.name}}
                          </div>
                          <div class="branch-name">
                            {{ cue.name }}
                            <div class="tooltip" v-if="showTooltip === true && cueBranch === cue.cue">
                              {{ tooltipHex }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="branch-holder-over">
                        <!-- over balance-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="center-grid"></div>
              <div class="center-grid"></div>
              <div class="center-grid"></div>
              <div class="center-grid"></div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        Flake hex
      </template>
    </modal-cues>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import BeebeeAi from '@/components/beebeehelp/spaceChat.vue'
import ModalCues from '@/components/bentocues/flakeModal.vue'
import CuesPrepared from '@/components/bentocues/prepareCues.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let cuesTools = ref(false)
  let cuesCorridor = ref(false)
  let wheelType = ref('cues')
  let stacksOpen = ref(false)
  let showTooltip = ref(false)
  let tooltipHex = ref('')
  let cueBranch = ref(false)

  /* computed */
  const currentZIndex = computed(() => {
    return storeBentobox.isBentospaceActive ? 900 : 1100
  })

  const cueBalance = computed(() => {
    return storeCues.activeCue
  })

  const bentoFlakeStatus = computed(() => {
    return storeAI.bentoflakeState
  })

  const cuesFlakesH = computed(() => {
    return storeCues.cuesFlakeList
  })

  const cuesStatusH = computed(() => {
    return storeCues.flakeCues
  })

  /* methods */
  const closeBentoFlake = () => {
    storeAI.bentoflakeState = !storeAI.bentoflakeState
    storeCues.liveCueContext = 'menu'
  }

  const setHexTooltip = (hex) => {
    showTooltip.value = true
    if (hex.name !== 'in-progress') {
      tooltipHex.value = hex.branchname
      cueBranch.value = hex.branch
    } else {
      tooltipHex.value =  hex.branchname
      cueBranch.value = hex.cue
    }
  }

  const stackProtocols = () => {
    stacksOpen.value = !stacksOpen.value
  }

  const cueConnect = () => {
    cuesTools.value = !cuesTools.value
    cueConnect.value = !cueConnect.value
  }

  const cueCorridor = () => {
    cuesCorridor.value = !cuesCorridor.value
  }

  const viewCueHex = (cue) => {
    storeAI.beebeeContext = 'bentoflake'
    storeBentobox.isBentospaceActive = true
    storeAI.bentospaceState = !storeAI.bentospaceState
    let cueName = ''
    if (cue.branch === cue.cue) {
      cueName = cue.name
    } else {
      // look up cue name from branch incoming
      let cueContract = storeCues.cueUtil.cueMatch(cue.branch, storeCues.cuesList)
      cueName = cueContract.value.concept.name
    }

    let tempSpace = {}
    tempSpace.active = true
    tempSpace.name = cueName
    tempSpace.spaceid = cue.branch
    tempSpace.cueid = cue.branch
    tempSpace.gluedown = 'down'
    tempSpace.expand = true
    storeAI.liveBspace = tempSpace // cue.spaceID
    // make button green
    let spaceLiveList = []
    storeBentobox.spaceList = spaceLiveList
  }

  const setShowBeeBee = () => {
    // beebeeSpace.value = !beebeeSpace.value
    storeAI.bentochatState = !storeAI.bentochatState
  }

  const juvCycle = () => {
    storeAI.liveBspace = { name: 'juv' }
    setShowBeeBee()
  }

  const optiCycle = () => {
    storeAI.liveBspace = { name: 'opti' }
    setShowBeeBee()
  }

</script>

<style scoped>

#cues-holistic {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  background-color: rgb(226, 230, 243);
  text-align: center;
}

#cues-context-tools {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px dashed blue;
  padding: 1em;
}

#cues-context-flake {
  display: grid;
  grid-template-columns: 1fr;
  place-self: center;
}

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

#bento-flake {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  background: #faf5ec;
  opacity: 90%;
  box-shadow: inset 0px 0px 0px 300px rgb(245, 244, 213);
}

#bento-flake-center {
  position: fixed;
  display: grid;
  border: 0px solid rgb(5, 29, 170);
  background: #eee4d2;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: 90%;
}

.container-flake {
  border: 1px solid lightgray;
  width: 30vw;
}

.cue-branch {
  display: inline;
}

#cues-one {
  transform: rotate(30deg)
}

#cues-two {
  position: relative;
  left: 100px;
  top: 0px;
  transform: rotate(320deg)
}

#cues-three {
  margin-top: 120px;
  margin-left: 0px;
  transform: rotate(-30deg)
}

#cues-four {
  position: relative;
  left: 100px;
  top: 120px;
  transform: rotate(30deg)
}

.active {
  background-color: rgb(113, 172, 114);
}

.tooltip {
  position: absolute;
  bottom: 40px; /* Position above the die */
  left: 40px;
  transform: translateX(-50%);
  background-color: #333; /* Background color */
  color: #fff; /* Text color */
  padding: 5px;
  border-radius: 5px;
  white-space: nowrap; /* Prevent text wrapping */
  z-index: 166; /* Ensure it appears above other elements */
  opacity: 0; /* Start hidden */
  transition: opacity 0.3s; /* Smooth transition */
}

.cues-status {
  position: relative;
  display: inline-grid;
  overflow: hidden;
  border: 2px solid white;
}

.cues-status:hover .tooltip {
  opacity: 1; /* Show tooltip on hover */
}

.flake-agent {
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

.flake-agent:hover {
    background-color: #2a82e0;
    transform: translateY(-2px);
}

.flake-agent:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}

#flake-modal-header {
  display: grid;
  grid-template-columns: 1fr 8fr 1fr;
}

.btn-green {
  display: inline-grid;
  height: 28px;
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

  @media (min-width: 1024px) {

    #bento-flake {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      border: 1px solid lightblue;
      margin-top: 200px;
      border-radius: 50%;
      min-height: 900px;
      width: 900px;
    }

    .center-grid {
      height: 20vh;
      border: 0px solid blue;
    }

    #center-flake {
      display: grid;
    }

    .singularity {
      position: relative;
      display: grid;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: white;
    }

    .cues-segs {
      display: inline;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50vw;
      height: 10vh;
      padding-left: 100px;
      transform-origin: top left;
    }

    .branch-holder {
      display: inline-grid;
      grid-template-columns: 1fr 5fr 1fr;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      background: radial-gradient(
        circle at center,
        rgba(255, 200, 200, 0.4) 0%,
        rgba(255, 220, 200, 0.3) 30%,
        rgba(220, 255, 200, 0.3) 45%,
        rgba(200, 255, 220, 0.3) 55%,
        rgba(200, 220, 255, 0.3) 70%,
        rgba(200, 200, 255, 0.3) 90%,
        rgba(255, 200, 200, 0.4) 100%
      );
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .branch-holder-under {
      display: grid;
      grid-template-columns: 1fr;
      min-width: 60px;
      background: radial-gradient(
        circle at left center,
        rgba(255, 200, 200, 0.3) 0%,
        rgba(255, 220, 200, 0.2) 100%
      );
      position: relative;
    }
    
    .branch-holder-under::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: radial-gradient(
        circle at center,
        rgba(255, 150, 150, 0.3) 0%,
        rgba(150, 255, 150, 0.3) 50%,
        rgba(150, 150, 255, 0.3) 100%
      );
    }

    .branch-holder-balance {
      display: grid;
      grid-template-columns: 1fr;
      background: radial-gradient(
        circle at center,
        rgba(220, 255, 200, 0.25) 0%,
        rgba(200, 255, 220, 0.25) 100%
      );
      position: relative;
    }
    
    .branch-holder-balance::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: radial-gradient(
        circle at center,
        rgba(255, 150, 150, 0.3) 0%,
        rgba(150, 255, 150, 0.3) 50%,
        rgba(150, 150, 255, 0.3) 100%
      );
    }
    
    .branch-quant {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
      align-items: center;
    }
    
    .cues-status {
      display: inline-flex;
      margin: 0 2px;
    }

    .branch-holder-over {
      display: grid;
      grid-template-columns: 1fr;
      min-width: 60px;
      background: radial-gradient(
        circle at right center,
        rgba(220, 200, 255, 0.2) 0%,
        rgba(200, 200, 255, 0.3) 100%
      );
    }

    .branch-name {
      display: grid;
      justify-content: center;
    }

    .tooltip {
      position: fixed;
      bottom: -30px; /* Position above the die */
      left: 440px;
      transform: translateX(-50%);
      background-color: #7c8adb; /* Background color */
      color: #fff; /* Text color */
      padding: 5px;
      border-radius: 5px;
      white-space: nowrap; /* Prevent text wrapping */
      z-index: 66; /* Ensure it appears above other elements */
      opacity: 1; /* Start hidden */
      transition: opacity 0.3s; /* Smooth transition */
    }

    .cues-status {
      position: relative;
      display: inline-grid;
      overflow: hidden;
      border: 2px solid white;
    }

    .cues-status:hover .tooltip {
      opacity: 1; /* Show tooltip on hover */
    }

    .bento-flake-quant {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-top: 120px;
      margin-left: 80px;
    }

    /* four basic quadrants */

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

    #return-modal-close {
      text-align: right;
    }

    /*  fliters  */
    #filter-cues {
      margin-left: 2em;
    }

    /* flake */

    .main {
      display: grid;
      --s: 32px;  /* size  */
      --m: 1px;    /* margin */
      --f: calc(1.732 * var(--s) + 4 * var(--m)  - 1px);
    }

    .container {
      font-size: 0; /*disable white space between inline block element */
    }

    .flake-cue {
      width: var(--s);
      margin: var(--m);
      height: calc(var(--s)*1.1547); 
      display: inline-block;
      cursor: pointer;
      font-size:initial;
      clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
      background: red;
      margin-bottom: calc(var(--m) - var(--s)*0.2885); 
    }

    .flake-cue:nth-child(odd) {
      background:green;
    }

    .container::before {
      content: "";
      width: calc(var(--s)/2 + var(--m));
      float: left;
      height: 120%;
      shape-outside: repeating-linear-gradient(     
      #0000 0 calc(var(--f) - 3px),
      #000  0 var(--f));
    }
    #flake-modal-header {
      display: grid;
      grid-template-columns: 1fr 8fr 1fr;
    }

    .btn-green {
      display: inline-grid;
      height: 28px;
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


  }

</style>