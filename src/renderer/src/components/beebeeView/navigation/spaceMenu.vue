<template>
  <div id="space-menu">
    <button class="create-space" @click="saveSpacename()">
      + create space
    </button>
    <div id="space-form-save" v-if="saveSpace">
      <!--<form id="ask-ai-form" @submit.prevent="saveSpacename()">
        <label for="spacename"></label>
        <input type="input" id="newspace" name="newspace" placeholder="space name" v-model="newSpacename">
        <button id="save-space-name" type="submit">
          add
        </button>
      </form>-->
    </div>
    <div id="cues-history" @click="showHistoryCues()" v-bind:class="{ active: historyCues }">
      History
    </div>
    <div id="history-menu" v-if="historyCues === true">
      <button @click="setTimeFilter('current')">Today</button>
      <button @click="setTimeFilter('thisWeek')">This Week</button>
      <button @click="setTimeFilter('thisMonth')">This Month</button>
    </div>
    <div id="cues-time-segments" v-if="historyCues === true">
      <div id="cues-history-segments">
        <div id="current-cues" v-if="expandTimeCues === 'current'">
          <div class="history-cue-seg">current</div>
          <div class="latest-pop-list" v-for="cue in cueSpaceHistory">
              <button class="cue-hist-btn" @click="bentoSpaceOpen(cue, 'history')">{{ cue.value.concept.name }}</button>
          </div>
        </div>
        <div id="weekly-cues" v-if="expandTimeCues === 'thisWeek'">
          Week
        </div>
        <div id="current-cues" v-if="expandTimeCues === 'thisMonth'">
          Month
        </div>
      </div>
    </div>
    <div class="history-list" v-for="sis in spaceListHistory">
      <button
          class="flat-history"  v-bind:class="{ active: sis?.active }" @click="bentoSpaceOpen(sis, 'history')" @mouseover="hoverCheck(sis)" @mousemove="moveCheck(sis)"> {{ sis.value.concept.name }}
        </button>
      <button class="save-space-history" @click="saveSpaceHistory(sis)">save</button>
      <button class="delete-space-history" @click="deleteSpaceHistory(sis)">Del</button>
    </div>
    <div id="cues-holder" @click="showExpandCues()" v-bind:class="{ active: expandCues }">
      Cues 
    </div>
    <div id="show-cues" v-if="expandCues === true">
      <div class="cues-list" v-for="cue in cuesList">
        <div id="cue-holistic">
          <button class="flat-history"  v-bind:class="{ active: cue?.active }" @click="bentoSpaceOpen(cue)" @mouseover="hoverCheck(cue)" @mousemove="moveCheck(cue)"> {{ cue.name }}
          </button>
          <span id="drill-cue" v-if="cue.expand === true">
            <button class="drill-cue-history" @click="drillCue(cue)">c-></button>     
          </span>
          <button class="save-chat-history" @click="saveSpaceHistory(cue)">save</button>
          <button class="delete-chat-history" @click="deleteSpaceHistory(cue)">Del</button>
        </div>
        
        <div id="gule-cues" v-if="glueTarget[cue.cueid] === true">
          <div class="cues-list-expand" v-for="cues in selectCuesActive[cue.cueid]">
            <div id="cue-holistic" v-if="cue.gluedown === glueName">
              <button class="flat-history"  v-bind:class="{ active: cues?.active }" @click="bentoSpaceOpen(cues)" @mouseover="hoverCheck(cues)" @mousemove="moveCheck(cues)"> {{ cues.name }}
              </button>
              <span id="drill-cue" v-if="cues.expand === true">
                <!--<button class="drill-cue-history" @click="drillCue(cues)">c-></button>-->     
              </span>
              <button class="save-chat-history" @click="saveSpaceHistory(cues)">save</button>
              <button class="delete-chat-history" @click="deleteSpaceHistory(cues)">Del</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="marker-holder" @click="showExpandMarkers()" v-bind:class="{ active: expandMarkers }">
      Markers
    </div>
    <div id="show-markers" v-if="expandMarkers === true">
      Coming soon
    </div>
  </div>
</template>

<script setup>
import { cuesStore } from '@/stores/cuesStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { ref, computed, onMounted } from 'vue'

  const storeLibrary = libraryStore()
  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let saveSpace = ref(false)
  let glueTarget = ref({})
  let glueName = ref('')
  let expandCues = ref(false)
  let expandMarkers = ref(false)
  let expandTimeCues = ref('current')

  /* on mount */
  onMounted(() => {
   
  })

  /*  computed  */
  const spaceListHistory = computed(() => {
    // need to format for menu display
    return storeCues.spaceListHistory
  })

  const historyCues = computed(() => {
    return storeCues.historyCuesStatus
  })

  const cueSpaceHistory = computed(() => {
    return storeCues.cuesHistoryList
  })

  const cuesList = computed(() => {
    // take curent cues filter for down cogGlue SHOULD BE DONE on start TODO
    let menuPrep = []
    for (let cue of storeCues.cuesList) {
      // does the cues the top of its path?
      if (cue.value.computational?.relationships !== undefined) {
         // what type of relationship
         let matchType = Object.keys(cue.value.computational?.relationships)
         for (let match of matchType) {
          if (match === 'down') {
            if (Object.keys(cue.value.computational?.relationships).length > 0 && cue.value.computational?.relationships?.down.length > 0) {
          menuPrep.push(
            {
              name: cue.value.concept.name,
              cueid: cue.key,
              gluedown: 'down',
              active: false,
              expand: true
            })
            } else {
            }
          } else if (match === 'up') {
          } else if (match === 'equal') {
          } else if (match === 'measure') {
          } else if (match === 'compute') {
          }
        }

      } else {
      }
    }
    return menuPrep
  })

  const selectCuesActive = computed(() => {
    return storeCues.selectCues
  })

  /* methods */
  const hoverCheck = (sis) => {
    // console.log('hover id')
    // console.log(sis)
  }

  const moveCheck = (sis) => {
    // console.log('move id')
    // console.log(sis)
  }

  const setTimeFilter = (timeFrame) => {
    expandTimeCues.value = timeFrame
  }


  const newSpacemenu = () => {
    saveSpace.value = !saveSpace.value
  }

  const showHistoryCues = () => {
    storeCues.historyCuesStatus = !storeCuees.historyCuesStatus
  }

  const showExpandCues = () => {
    expandCues.value = !expandCues.value
  }

  const showExpandMarkers = () => {
    expandMarkers.value = !expandMarkers.value
  }

  const drillCue = (cuem) => {
    let downCuesList = []
    // match to cues contract and loop over relationships
    for (let cue of storeCues.cuesList) {
      if (cue.key === cuem.cueid) {
        for (let rel of cue.value.computational.relationships['down']) {
          // match to cue contract
          let cueContract = storeCues.cueUtil.cueMatch(rel, storeCues.cuesList)
          downCuesList.push(
            {
              name: cueContract.value.concept.name,
              cueid: cueContract.key,
              gluedown: 'down',
              active: false,
              expand: true
            }
          )
        }
      }
    }
    storeCues.selectCues[cuem.cueid] = downCuesList
    if (glueTarget.value[cuem.cueid] === undefined) {
      glueTarget.value[cuem.cueid] = true
    } else {
      glueTarget.value[cuem.cueid] = !glueTarget.value[cuem.cueid]
    }
    glueName.value = cuem.gluedown
  }

  const bentoSpaceOpen = (spaceID, context) => {
    // update timestamp
    storeCues.updateCueTimestamp(spaceID.key)
    // prepare chat for space
    let newChatItem = {}
    newChatItem.name = spaceID.name
    newChatItem.chatid = spaceID.cueid
    newChatItem.active = true
    //setup chat history holder
    storeAI.setupChatHistory(newChatItem)
    storeAI.chatAttention = spaceID.cueid
    // temp  if history cue the make stucture for space
    if (context === 'history') {
      storeAI.liveBspace = {
        name: spaceID.value.concept.name,
        spaceid: spaceID.key,
        cueid: spaceID.key,
        gluedown: 'down',
        active: true,
        expand: true
      }
      spaceID.name = spaceID.value.concept.name
      spaceID.cueid = spaceID.key
    } else {
      storeAI.liveBspace = spaceID
    }
    storeCues.cueContext = 'space'
    storeAI.beebeeContext = 'chatspace'
    storeAI.bentospaceState = !storeAI.bentospaceState
    // make button green
    let spaceLiveList = []
    for (let spi of storeBentobox.spaceList) {
      if (spi.cueid === spaceID.cueid) {
        spi.active = true
        spaceLiveList.push(spi)
      } else {
        spi.active = false
        spaceLiveList.push(spi)
      }
    }
    storeBentobox.spaceList = spaceLiveList
    // prepare cue wheel context
    let cueContract = storeCues.cueUtil.cueMatch(spaceID.cueid, storeCues.cuesList)
    prepareCue(spaceID, spaceID.cueid, cueContract)
  }

  const prepareCue = (spaceID, cueKey, cueR) => {
    // reset any context
    storeCues.cueMatchMarkersLive = [] 
    storeCues.cueKnowledge = 'concept'
    storeCues.activeCue = cueKey
    storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(cueKey, cueR, {})
    // check in other context e.g. flake
    storeCues.glueRelActive = ''
    storeCues.checkCueContext()
    // look for cogGlue e.g. measure to marker
    // storeCues.cogGlueSpace(spaceID.cueid)
  }

  const saveSpacename = () => {
    // open cues in context of add cue and then return to this
    storeAI.bentocuesState = !storeAI.bentocuesState
    storeAI.cueAction = 'newcue'
    /*pre cues
    saveSpace.value = !saveSpace.value
    let spaceID = hashObject(newSpacename.value + new Date())
    let newSpaceItem = {}
    newSpaceItem.name = newSpacename.value
    newSpaceItem.spaceid = spaceID
    newSpaceItem.active = false
    storeBentobox.spaceList.push(newSpaceItem)
    storeAI.bentoboxList[spaceID] = []
    newSpacename.value = ''
    // make this the active space
    storeAI.liveBspace = newSpaceItem
    let spaceLiveList = []
    for (let spi of storeBentobox.spaceList) {
      if (spi.spaceid === spaceID) {
        spi.active = true
        spaceLiveList.push(spi)
      } else {
        spi.active = false
        spaceLiveList.push(spi)
      }
    }
    storeBentobox.spaceList = spaceLiveList
    storeBentobox.locationBbox[spaceID] = {}
    // check and update product boxes 
    // storeBentobox.locationProductbox
    */
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

  const deleteSpaceHistory = (space) => {
    // remove form chat list and delete message
    let updateSpacelist = []
    for (let sp of storeBentobox.spaceList) {
      if (sp.spaceid !== space.spaceid) {
        updateSpacelist.push(sp)
      }
    }
    storeBentobox.spaceList = updateSpacelist
    let delBentoBoxsetting = {}
    delBentoBoxsetting.type = 'bentobox'
    delBentoBoxsetting.reftype = 'space-history'
    delBentoBoxsetting.action = 'delete'
    delBentoBoxsetting.task = 'delete'
    delBentoBoxsetting.data = space
    delBentoBoxsetting.bbid = ''
    storeAI.sendMessageHOP(delBentoBoxsetting)
  }

</script>

<style scoped>
#space-menu {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 300px;
}

.create-space {
  margin-top: 1em;
  background-color: white;
  border: 1px dashed grey;
  margin-bottom: 1em;
  height: 40px;
  border: 1px dashed lightblue;
}

#ask-ai-form {
  border: 1px solid lightblue;
}

#space-form-save {
  border: 1px dashed lightblue;
  height: 120px;
}

.save-chat-history {
  height: 80%;;
}

#cues-history {
  font-weight: bold;
}

.latest-pop-list {
  margin: .4em;
}

#cue-holistic {
  margin-bottom: 1em;
}

.flat-history {
  background-color: rgb(178, 188, 227);
  border: 0px;
  margin: .4em;
  padding: .5em;
}

#cues-holder, #marker-holder {
  margin-top: 1em;
  cursor: pointer;
  padding-top: .2em;
  border-top: 1px solid lightblue;
  border-bottom: 1px solid lightblue;
  height: 30px;
  font-weight: bold;
}

#show-cues {
  overflow-y: scroll;
  margin-bottom: .2em;
  border: 0px dashed black;
}

.active {
  background-color: rgb(113, 172, 114);
}

.history-list {
  height: 42px;
}

/* .history-list:first-child {
  background-color: green;
} */

.live-drop-zone {
  display: block;
  height: 2em;
}

  @media (min-width: 1024px) {

    #space-menu {
      display: grid;
      grid-template-columns: 1fr;
      min-height: 300px;
    }

    .menulive {
      background-color: 1px solid green;
    }

    .live-drop-zone {
      height: 100%;
      border: 0px dashed rgb(228, 137, 39);
    }

    .live-drop-zone:hover {
      background-color: rgb(244, 245, 246);
    }

    #gule-cues {
      position: relative;
      background-color: rgb(238, 242, 243);
    }

    .cues-list {
      position: relative;
      border-bottom: 2px dashed lightgrey;
    }

    .cues-list-expand {
      position: relative;
      border-bottom: 2px dashed lightblue;
      margin-bottom: 2em;
    }

    #show-cues {
      overflow-y: scroll;
      margin-bottom: .2em;
    }

  }
</style>