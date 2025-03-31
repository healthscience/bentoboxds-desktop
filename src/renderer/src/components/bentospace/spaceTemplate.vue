<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-space :show="bentospaceStatus" @close="closeBentoSpace">
      <template #header>
        <!-- The code below goes into the header slot -->
        <div id="space-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoSpace"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="cue-space-header">
            <div id="space-cue-title">BentoSpace # {{ storeAI.liveBspace.name }}</div>
            <div id="space-cueid"> - {{ storeAI.liveBspace.cueid }}</div>
            <div id="space-shared-cueid"> - {{ storeAI.sharePeer[storeAI.liveBspace.cueid] }}</div>
          </div>
          <div id="return-modal-close" @click="closeBentoSpace">return</div>
        </div>
      </template>
      <template #body>
        <beebee-ai></beebee-ai>
        <button id="open-beebee" @click.prevent="setShowBeeBee">beebee</button>
        <div id="space-toolbar">
          <!--<div id="beebee-help"></div>-->
          <div id="cues-connector">
            <button class="space-agent" @click="cueConnect()" v-bind:class="{ active: cuesTools === true }">Cues</button>
          </div>
          <div id="decision-tools">
            <button class="space-agent" @click="addCueDecision()" v-bind:class="{ active: spaceDecision === true }">+ decision</button>
            <img class="cues-holitic-wheel" src="../.././assets/cues-holistic-icon.png" alt="cues" @click=cuesHolistic()>
          </div>
          <div id="add-context">
            <button class="space-agent" @click="contextAdd()" v-bind:class="{ active: contextTools === true }">+ content</button>
          </div>
          <div id="share-network">
            <button class="space-agent" @click="shareSpace()" v-bind:class="{ active: shareTools === true }">+ share</button>
          </div>
          <div id="space-bar">space bar</div>
          <div class="scale-item scalebuttons">
            <label>Scale</label>
            <!--<input type="range" min="0.1" max="2" step="0.1" v-model.number="scalelocal" @change="setzoomScale">-->
            <button class="point-change" @click="setzoomScale(-0.05)">-</button>
            {{ Math.round(zoomscaleValue * 100) }} %
            <button class="point-change" @click="setzoomScale(0.05)">+</button>
          </div>
        </div>
        <div id="space-context-tools" v-if="contextTools === true">
          <div id="n1-tools">
            <button @click="openLibrary()" v-bind:class="{ active: spaceN1setup === true }">+ N=1</button>
            <div id="bento-n1" v-if="spaceN1setup === true">
              <div id="create-new-n1">
                <button class="button-lib-data" @click="nxpAdd">
                  + new experiment
                </button>
              </div>
              <libraryexp-view v-if="storeLibrary.libPeerview === true"></libraryexp-view>
              <newnxp-view v-if="storeLibrary.newNXP === true"></newnxp-view>
            </div>
          </div>
          <div id="media-tools">
            <button @click="addCueMedia()" v-bind:class="{ active: spaceMedia === true }">+ media</button>
            <div id="bento-cue-media" v-if="spaceMedia === true">
              <media-cue></media-cue>
            </div>
          </div>
          <div id="research-tools">
            <button @click="addCueResearch()" v-bind:class="{ active: spaceResearch === true }">+ research</button>
            <div id="bento-cue-research" v-if="spaceResearch === true">
                <research-cue :spaceid="storeAI.liveBspace.spaceid"></research-cue>
            </div>
          </div>
          <div id="marker-tools">
            <button @click="addCueMarker()" v-bind:class="{ active: spaceMarker === true }">+ marker</button>
            <div id="bento-cue-marker" v-if="spaceMarker === true">
                <marker-cue></marker-cue>
            </div>
          </div>
          <div id="product-tools">
            <button @click="addCueProduct()" v-bind:class="{ active: spaceProduct === true }">+ product</button>
            <div id="bento-cue-product" v-if="spaceProduct === true">
                <product-cue></product-cue>
            </div>
          </div>
        </div>
        <div id="share-protocol" v-if="shareTools === true">
          <header>Share protocol</header>
          <share-protocol :bboxid="''" :shareType="'cue-space'"></share-protocol>
        </div>
        <div id="bentospace-holder" v-dragscroll.noleft.noright="true" @click="whereMinmap($event)">
          <div id="bento-space" v-bind:style="{ transform: 'scale(' + zoomscaleValue + ')' }">
            <div id="cues-context-tools" v-if="cuesTools === true">
              <!-- existing cues -->
             <cues-prepared v-if="wheelType === 'cues'"></cues-prepared>
            </div>
            <div id="bento-cue-decicion" v-if="spaceDecision === true">
              <decision-cue></decision-cue>
            </div>
            <!-- location for bentobox - es -->
            <div id="space-bento-items">
              <div id="bento-layout" v-for="bbox in storeAI.bentoboxList[storeAI.liveBspace.cueid]">
                <bento-boxspace :bboxid="bbox.bboxid" :contractid="bbox.contract"></bento-boxspace>
              </div>
              <!--video / image /  decision  / cues etc  to compliment bentobox-->
              <div id="bento-media-space" v-for="bmedia in storeBentobox.videoMedia[storeAI.liveBspace.cueid]">
                <media-space :bstag="bmedia.tag" :bsmedia="bmedia.key"></media-space>
              </div>
              <!-- research media -->
              <div id="bento-research-space" v-for="rmedia in storeBentobox.researchMedia[storeAI.liveBspace.cueid]">
                <research-space :bstag="rmedia.tag" :bsmedia="rmedia.key"></research-space>
              </div>
                <!-- marker -->
                <div id="bento-research-space" v-for="mkmedia in storeBentobox.markerMedia[storeAI.liveBspace.spaceid]">
                <marker-space :bstag="mkmedia.tag" :bsmedia="mkmedia.key"></marker-space>
              </div>
              <!-- product -->
              <div id="bento-product-space" v-for="mkproduct in storeBentobox.productMedia[storeAI.liveBspace.cueid]">
                <product-space :bstag="mkproduct.tag" :bsmedia="mkproduct.key"></product-space>
              </div>
            </div>
          </div>
        </div>
        <mininav-map :spaceid="storeAI.liveBspace.spaceid" :bboxid="'null'"></mininav-map>
      </template>
      <template #footer>
      </template>
    </modal-space>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalSpace from '@/components/bentospace/spaceModal.vue'
import CuesPrepared from '@/components/bentocues/prepareCues.vue'
import LibraryexpView from '@/components/dataspace/experimentNXPView.vue'
import NewnxpView from '@/components/dataspace/newnxpView.vue'
import BentoBoxspace from '@/components/bentobox/bentoboxSpace.vue'
import MediaSpace from '@/components/bentospace/video/mediaSpace.vue'
import ResearchSpace from '@/components/bentospace/research/researchSpace.vue'
import MarkerSpace from '@/components/bentospace/marker/markerSpace.vue'
import ProductSpace from '@/components/bentospace/product/productSpace.vue'
import DecisionCue from '@/components/bentocues/decisions/decisionCues.vue'
import MediaCue from '@/components/bentocues/media/mediaCues.vue'
import ResearchCue from '@/components/bentocues/research/researchCues.vue'
import MarkerCue from '@/components/bentocues/marker/markerCues.vue'
import ProductCue from '@/components/bentocues/product/productCues.vue'
import BeebeeAi from '@/components/beebeehelp/spaceChat.vue'
import ShareProtocol from '@/components/bentobox/tools/shareForm.vue'
import MininavMap from '@/components/bentospace/map/mininavMap.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { mapminiStore } from '@/stores/mapStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  const storeMmap = mapminiStore()

  let mouseLive = ref(
    {
      x: 10,
      y: 10
    }
  )
  let wheelType = ref('cues')
  let cuesTools = ref(false)
  let contextTools = ref(false)
  let shareTools = ref(false)
  let spaceN1setup = ref(false)
  let spaceMedia = ref(false)
  let spaceDecision = ref(false)
  let spaceResearch = ref(false)
  let spaceMarker = ref(false)
  let spaceProduct = ref(false)

  /* computed */
  const bentospaceStatus = computed(() => {
    return storeAI.bentospaceState
  })

  const zoomscaleValue = computed(() => {
    return storeBentobox.scaleZoom
  })

  /* methods */
  const setShowBeeBee = () => {
    storeAI.bentochatState = !storeAI.bentochatState
  }

  const closeBentoSpace = () => {
    storeAI.beebeeContext = 'chat'
    storeAI.bentospaceState = !storeAI.bentospaceState
    storeCues.cueContext = 'cueall'
    // save the current layout on close
    storeBentobox.saveLayoutSpace(storeAI.liveBspace.cueid)
    // save the latest on close
    saveSpaceHistory(storeAI.liveBspace)
    // save the latest chat on close
    saveChatHistory(storeAI.liveBspace)
    // close the chat
    storeAI.bentochatState = false
  }

  const saveSpaceHistory = (space) => {
    let saveBentoBoxsetting = {}
    saveBentoBoxsetting.type = 'bentobox'
    saveBentoBoxsetting.reftype = 'space-history'
    saveBentoBoxsetting.action = 'save'
    saveBentoBoxsetting.task = 'save'
    saveBentoBoxsetting.data = space
    saveBentoBoxsetting.bbid = ''
    storeAI.prepareSpaceSave(saveBentoBoxsetting)
  }

  const saveChatHistory = (chat) => {
    let saveBentoBoxsetting = {}
    saveBentoBoxsetting.type = 'bentobox'
    saveBentoBoxsetting.reftype = 'chat-history'
    saveBentoBoxsetting.action = 'save'
    saveBentoBoxsetting.task = 'save'
    saveBentoBoxsetting.data = { chatid: chat.cueid, name: chat.name, active: false }
    saveBentoBoxsetting.bbid = ''
    storeAI.prepareChatBentoBoxSave(saveBentoBoxsetting)
  }

  const setzoomScale = (change) => {
    storeBentobox.scaleZoom = storeBentobox.scaleZoom + change
  }

  const whereMinmap = (mo) => {
    mouseLive.x = mo.offsetX
    mouseLive.y = mo.offsetY
    // if click on minimap do not send
    if (mo.target.id !== 'minimap') {
      storeMmap.actionPostionCoordMouse(mouseLive)
    }
  }

  const cuesHolistic = () => {
    storeCues.liveCueContext = 'flake'
    storeAI.bentoflakeState = !storeAI.bentoflakeState
  }

  const addBentoN1 = () => {
    spaceN1setup.value = !spaceN1setup.value
    storeLibrary.libPeerview = !storeLibrary.libPeerview
    // prepare public library for table list view
    if (storeLibrary.publicLibrary.referenceContracts !== undefined) {
      storeLibrary.prepPublicNXPlist()
    }
  }

  const nxpAdd = () => {
    storeLibrary.newNXP = !storeLibrary.newNXP
    // send message to HOP to create genesis NXP contract structure
    if (storeLibrary.newNXP === true) {
      // setup gensis open tools data structure
      let modSettings = {}
      modSettings.xaxis = ['time'] // mod.value.info.settings.xaxis
      modSettings.yaxis = ['333']
      modSettings.category = []
      storeBentobox.openDataSettings['genesis-123579'] = modSettings
      storeLibrary.prepareGenesisModContracts()
      storeLibrary.saveSuccessnxp = false
    }
  }

  const openLibrary = () => {
    // need to set context to library
    spaceN1setup.value = !spaceN1setup.value
    storeLibrary.inContext = 'space'
    // storeAI.dataBoxStatus = true
    storeAI.uploadStatus = false
    storeLibrary.libraryStatus = true
    storeLibrary.libPeerview = true
    storeLibrary.newNXP = true
  }

  const addCueDecision = () => {
    spaceDecision.value = !spaceDecision.value
    // storeAI.decisionDoughnutCue = !storeAI.decisionDoughnutCue
  }

  const addCueMedia = () => {
    spaceMedia.value = !spaceMedia.value
  }

  const addCueResearch = () => {
    spaceResearch.value = !spaceResearch.value
  }

  const addCueMarker = () => {
    spaceMarker.value = !spaceMarker.value
    // check if measure glue has any existing relationships
    storeCues.cueGluePrepare('measure') 
  }

  const addCueProduct = () => {
    spaceProduct.value = !spaceProduct.value
  }

  const cueConnect = () => {
    storeCues.cueContext = 'space'
    // prepare cue wheel
    // cueid and spaceid  mix need to standardise
    let cueIDactive = ''
    if (storeAI.liveBspace.spaceid !== undefined) {
      cueIDactive = storeAI.liveBspace.spaceid
    } else {
      cueIDactive = storeAI.liveBspace.cueid
    }
    let cueContract = storeCues.cueUtil.cueMatch(cueIDactive, storeCues.cuesList)
    storeCues.cueDisplayBuilder(storeAI.liveBspace.spaceid, cueContract, {})
    cuesTools.value = !cuesTools.value
  }

  const contextAdd = () => {
    contextTools.value = !contextTools.value
  }

  const shareSpace = () => {
    shareTools.value = !shareTools.value
  }

</script>

<style scoped>

.active {
  background-color: rgb(113, 172, 114);
}

#cue-space-header {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

#space-cue-title {
  color: darkblue;
  font-weight: bold;
}

#space-cueid {
  color: #5254ab;
  font-size: .8em;
}

/* shared cue from network */
#space-shared-cueid {
  color: #5254ab;
  font-size: .8em;
  background-color: #a6d697;
}

#space-toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr 1fr;
  background-color: rgb(217, 226, 245);
}

#cues-context-tools {
  display: absolute;
  left: 0;
  top: 0;
  border: 1px solid lightgrey;
  height: 460px;
  width: 460px;
  background-color: white;
}

#space-context-tools {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  margin-top: 1em;
  margin-bottom: .6em;
}

#bentospace-holder {
  border: 0px solid red;;
}

#decision-tools {
  display: grid;
  grid-template-columns: 4fr 1fr;
  height: 32px;
}

.cues-holitic-wheel {
  width: 28px;
  height: 28px;
}

#bento-space {
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid green;
  height: 80vh;
  width: 100%;
  margin-top: 0.1em;
  transform-origin: left top;
  border: 1px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
}

#return-modal-close {
  text-align: right;
}

#share-protocol {
  margin: 1em;
  width: 40vw;
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

/* n1 */
#n1-tools {
  width: 20vw;
  border: 1px solid lightgray;
}

/*  media bar  */
#bento-media {
  position: absolute;
  z-index: 33;
  top: 10;
  left: 20;
  border-bottom: 1px solid lightgrey;
  border-left: 1px solid lightgrey;
  border-right: 1px solid lightgrey;
  padding: 1em;
  background: rgb(190, 190, 243);
  width: 300px;
  opacity: .8;
}

/* decision tools */
#bento-cue-decicion {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 33;
  width: auto;
  border-bottom: 1px solid lightgrey;
  border-left: 1px solid lightgrey;
  border-right: 1px solid lightgrey;
  padding: 1em;
  background: rgb(176, 176, 204);
  opacity: .98;
}

.space-agent {
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

.space-agent:hover {
    background-color: #2a82e0;
    transform: translateY(-2px);
}

.space-agent:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}

  @media (min-width: 1024px) {

    #space-modal-header {
      display: grid;
      grid-template-columns: 1fr 8fr 1fr;
    }

    #bentospace-holder {
      height: 80vh;
      width: 100%;
      overflow: scroll;
    }

    #bento-space {
      height: 998vh;
      width: 998vw;
      z-index: 2;
    }

    #space-bento-items {
      position: relative;
    }

    #space-modal-header {
      display: grid;
      grid-template-columns: 1fr 8fr 1fr;

    }

    #return-modal-close {
      justify-content: right;
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

  .scale-item {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr 1fr;
    justify-self: end;
  }

  #bento-layout {
    position: relative;
    border: 3px solid purple;
    height: 1px;
    width: 1px;
  }

  #bento-media-space {
    position: relative;
    border: 2px solid green;
    height: 1px;
    width: 1px;
  }

  /* n1 */
  #n1-tools {
    width: 20vw;
    border: 0px solid lightgray;
  }

  #bento-n1 {
    position: absolute;
    z-index: 33;
    width: 80vw;
    border: 0px solid lightgray;
  }

  /*  media bar  */
  #bento-media {
    position: absolute;
    z-index: 33;
    top: 10;
    left: 20;
    border-bottom: 1px solid lightgrey;
    border-left: 1px solid lightgrey;
    border-right: 1px solid lightgrey;
    padding: 1em;
    background: rgb(176, 176, 204);
    width: 300px;
    opacity: .8;
  }

  /* decision tools */
  #bento-cue-decicion {
    position: absolute;
    z-index: 33;
    width: auto;
    height: auto;
    margin-left: 0px;
    border-bottom: 1px solid lightgrey;
    border-left: 1px solid lightgrey;
    border-right: 1px solid lightgrey;
    padding: 1em;
    background: rgb(176, 176, 204);
    opacity: .98;
  }

  /* research tools */
  #bento-cue-research {
    position: absolute;
    z-index: 33;
    width: auto;
    height: auto;
    margin-left: -120px;
    border-bottom: 1px solid lightgrey;
    border-left: 1px solid lightgrey;
    border-right: 1px solid lightgrey;
    padding: 1em;
    background: rgb(176, 176, 204);
    opacity: .98;
  }

  .active {
    background-color: rgb(113, 172, 114);
  }

}

</style>
