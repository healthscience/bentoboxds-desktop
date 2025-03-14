<template>
  <div class="live-drop-zone" @mouseover="hoverCheck(sis)">
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
let newChatname = ref('')

const historyActive = computed(() => {
  return storeBentobox.historyActive
})

const historyList = computed(() => {
  return storeAI.historyList
})

const chatList = computed(() => {
  return storeBentobox.chatList
})

const attentionChat = computed(() => {
  return storeAI.chatAttention
})

const hoverCheck = (sis) => {
  // console.log('hover id')
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

const saveChatHistory = (chat) => {
  let saveBentoBoxsetting = {}
  saveBentoBoxsetting.type = 'bentobox'
  saveBentoBoxsetting.reftype = 'chat-history'
  saveBentoBoxsetting.action = 'save'
  saveBentoBoxsetting.task = 'save'
  saveBentoBoxsetting.data = chat
  saveBentoBoxsetting.bbid = ''
  storeAI.prepareChatBentoBoxSave(saveBentoBoxsetting)
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

</script>

<style scoped>

.create-chat {
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

.save-chat-history, .delete-chat-history {
  display: grid;
  height: 50%;
  align-self: center;
}

/* .history-list:first-child {
  background-color: green;
} */

.live-drop-zone {
  display: block;
  height: 2em;
}

  @media (min-width: 1024px) {

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

    #message-question {
      text-align: center;
    }
  }
</style>