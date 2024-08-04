<template>
  <div id="space-menu">
    <button class="create-space" @click="newSpacemenu">
      + create space
    </button>
    <div id="space-form-save" v-if="saveSpace">
      <form id="ask-ai-form" @submit.prevent="saveSpacename()">
        <label for="spacename"></label>
        <input type="input" id="newspace" name="newspace" placeholder="space name" v-model="newSpacename">
        <button id="save-space-name" type="submit">
          add
        </button>
      </form>
    </div>
    <div class="history-list" v-for="sis in spaceList">
      <button
          class="flat-history"  v-bind:class="{ active: sis?.active }" @click="bentoSpaceOpen(sis)" @mouseover="hoverCheck(sis)" @mousemove="moveCheck(sis)"> {{ sis.name }}
        </button> <!--@mouseup="dropBBox"-->
      <button class="save-chat-history" @click="saveSpaceHistory(sis)">save</button>
      <button class="delete-chat-history" @click="deleteSpaceHistory(sis)">Del</button>
    </div>
  </div>
</template>

<script setup>
import hashObject from 'object-hash'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref, computed } from 'vue'

const storeAI = aiInterfaceStore()
const storeBentobox = bentoboxStore()

let saveChat = ref(false)
let saveSpace = ref(false)
let newChatname = ref('')
let newSpacename = ref('')


const spaceList = computed(() => {
  return storeBentobox.spaceList
})


const hoverCheck = (sis) => {
  // console.log('hover id')
  // console.log(sis)
}

const moveCheck = (sis) => {
  // console.log('move id')
  // console.log(sis)
}

const newSpacemenu = () => {
  saveSpace.value = !saveSpace.value
}

const bentoSpaceOpen = (spaceID) => {
  storeAI.bentospaceState = !storeAI.bentospaceState
  storeAI.liveBspace = spaceID
  // make button green
  let spaceLiveList = []
  for (let spi of storeBentobox.spaceList) {
    if (spi.spaceid === spaceID.spaceid) {
      spi.active = true
      spaceLiveList.push(spi)
    } else {
      spi.active = false
      spaceLiveList.push(spi)
    }
  }
  storeBentobox.spaceList = spaceLiveList
}

const saveSpacename = () => {
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
  console.log('dleelel sapce')
  console.log(delBentoBoxsetting)
  storeAI.sendMessageHOP(delBentoBoxsetting)
}
</script>

<style scoped>
.spaces {
  display: relative;
  height: 2em;
}

.create-space {
  margin-top: 1em;
  background-color: white;
  border: 1px dashed grey;
  margin-bottom: 1em;
}

.flat-history {
  background-color: rgb(178, 188, 227);
  border: 0px;
  margin: .4em;
  padding: .5em;
}

.active {
  background-color: rgb(113, 172, 114);
}

/* .history-list:first-child {
  background-color: green;
} */

.live-drop-zone {
  display: block;
  height: 2em;
}

  @media (min-width: 1024px) {

    .menulive {
      background-color: 1px solid green;
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

  }
</style>