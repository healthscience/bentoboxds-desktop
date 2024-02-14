<template>
  <div id="beebee-shaper">
    <div class="bento-history">
      <div class="history-buttons">
        <div class="history">
          <button @click="historyType('history')" class="button-chat-menu" v-bind:class="{ active: historyList === 'history' }">Chat</button>
        </div>
        <div class="spaces">
          <button @click="historyType('space')" v-bind:class="{ active: historyList === 'space' }">Spaces</button>
        </div>
      </div>
      <div class="live-drop-zone" v-if="historyActive ===  true" @mouseover="hoverCheck(sis)">
        <div v-if="historyList === 'history'">
          <button class="create-chat" @click="newChatchannel">
            + create chat
          </button>
          <div id="chat-form-save" v-if="saveChat">
            <form id="ask-ai-form" @submit.prevent="saveChatname()">
            <label for="chatname"></label>
            <input type="input" id="newchat" name="newchat" placeholder="chat name" v-model="newChatname">
            <button id="save-chat-name" type="submit">
              add
            </button>
          </form>
          </div>
          <div class="history-list" v-for="his in chatList">
            <button class="flat-history" v-bind:class="{ active: his.active }" @click="selectChat(his)"> {{ his.name }} </button>
            <button class="save-chat-history" @click="saveChatHistory(his)">save</button>
            <button class="delete-chat-history" @click="deleteChatHistory(his)">Del</button>
          </div>
        </div>
        <div v-else>
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
               class="flat-history"  v-bind:class="{ active: sis.active }" @click="bentoSpaceOpen(sis)" @mouseover="hoverCheck(sis)" @mousemove="moveCheck(sis)"> {{ sis.name }}
             </button> <!--@mouseup="dropBBox"-->
            <button class="save-chat-history" @click="saveSpaceHistory(sis)">save</button>
            <button class="delete-chat-history" @click="deleteSpaceHistory(sis)">Del</button>
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
import hashObject from 'object-hash'
import BeebeeChat from '@/components/beebeehelp/chatInterface.vue'
import BentoSpace from '@/components/bentospace/spaceTemplate.vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref, computed } from 'vue'

const storeAI = aiInterfaceStore()
const storeBentobox = bentoboxStore()

let saveChat = ref(false)
let saveSpace = ref(false)
let newChatname = ref('')
let newSpacename = ref('')


const historyActive = computed(() => {
  return storeBentobox.historyActive
})

const historyList = computed(() => {
  return storeAI.historyList
})

const chatList = computed(() => {
  return storeBentobox.chatList
})

const spaceList = computed(() => {
  return storeBentobox.spaceList
})

const attentionChat = computed(() => {
  return storeAI.chatAttention
})

let historyType = (type) => {
  storeAI.historyList = type
  storeBentobox.historyActive = true
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

const selectChat = (chat) => {
  storeAI.chatAttention = chat.chatid
  // setup historypair
  storeAI.setupChatHistory(chat)
  // make button green
  let chatLiveList = []
  for (let chi of storeBentobox.chatList) {
    if (chi.chatid === chat.chatid) {
      chi.active = true
      chatLiveList.push(chi)
    } else {
      chi.active = false
      chatLiveList.push(chi)
    }
  }
  storeBentobox.chatList = chatLiveList
}

const newChatchannel = () => {
  saveChat.value = !saveChat.value
}

const saveChatname = () => {
  saveChat.value = !saveChat.value
  // uuid for chat
  let chatID = hashObject(newChatname.value + new Date())
  let newChatItem = {}
  newChatItem.name = newChatname.value
  newChatItem.chatid = chatID
  newChatItem.active = false
  storeBentobox.chatList.push(newChatItem)
  //setup chat history holder
  storeAI.setupChatHistory(newChatItem)
  newChatname.value = ''
  // set as the active chat
  storeAI.chatAttention = chatID
  let chatLiveList = []
  for (let chi of storeBentobox.chatList) {
    if (chi.chatid === chatID) {
      chi.active = true
      chatLiveList.push(chi)
    } else {
      chi.active = false
      chatLiveList.push(chi)
    }
  }
  storeBentobox.chatList = chatLiveList
}

const newSpacemenu = () => {
  saveSpace.value = !saveSpace.value
}

const bentoSpaceOpen = (spaceID) => {
  storeAI.bentospaceState = !storeAI.bentospaceState
  storeAI.liveBspace = spaceID
  // storeAI.beebeeChatLog = false
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
}

const saveChatHistory = (chat) => {
  let saveBentoBoxsetting = {}
  saveBentoBoxsetting.type = 'bentobox'
  saveBentoBoxsetting.reftype = 'chat-history'
  saveBentoBoxsetting.action = 'save'
  saveBentoBoxsetting.task = 'save'
  saveBentoBoxsetting.data = chat
  saveBentoBoxsetting.bbid = ''
  storeAI.prepareBentoBoxSave(saveBentoBoxsetting)
}

const deleteChatHistory = (chat) => {
  // remove form chat list and delete message
  let updateChatlist = []
  for (let ch of storeBentobox.chatList) {
    if (ch.chatid !== chat.chatid) {
      updateChatlist.push(ch)
    }
  }
  storeBentobox.chatList = updateChatlist
  let delBentoBoxsetting = {}
  delBentoBoxsetting.type = 'bentobox'
  delBentoBoxsetting.reftype = 'chat-history'
  delBentoBoxsetting.action = 'delete'
  delBentoBoxsetting.task = 'delete'
  delBentoBoxsetting.data = chat
  delBentoBoxsetting.bbid = ''
  storeAI.sendMessageHOP(delBentoBoxsetting)
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
  margin-top: 1em;
  background-color: white;
  border: 1px dashed grey;
  margin-bottom: 1em;
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


    .menulive {
      background-color: 1px solid green;
    }

    .history {
      position: relative;
      height: 2em;
    }

    .history-list {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr;
    }

    .history-list:hover {
      background-color: blue;
    }

    #chat-form-save, #space-form-save {
      margin-bottom: 1em;
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