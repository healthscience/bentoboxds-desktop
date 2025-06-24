<template>
  <div class="live-drop-zone" @mouseover="hoverCheck(sis)">
    <div v-if="historyList === true">
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
      <div class="mode-switch">
        <label for="mode">Sort by:</label>
        <select id="mode" v-model="sortMode">
          <option value="time">Time</option>
          <option value="favorites">Favorites</option>
        </select>
      </div>
      <div v-if="sortMode === 'time'">
        <div v-if="groupedChatList.thisWeek.length">
          <h3>This Week</h3>
          <div class="history-list" v-for="his in groupedChatList.thisWeek" :key="his.chatid">
            <button class="flat-history" v-bind:class="{ active: his.active }" @click="selectChat(his)"> {{ his.name }} </button>
            <button class="save-chat-history" @click="saveChatHistory(his)">save</button>
            <button class="delete-chat-history" @click="deleteChatHistory(his)">Del</button>
          </div>
        </div>
        <div v-if="groupedChatList.thisMonth.length">
          <h3>This Month</h3>
          <div class="history-list" v-for="his in groupedChatList.thisMonth" :key="his.chatid">
          <button class="flat-history" v-bind:class="{ active: his.active }" @click="selectChat(his)"> {{ his.name }} </button>
          <button class="save-chat-history" @click="saveChatHistory(his)">save</button>
          <button class="delete-chat-history" @click="deleteChatHistory(his)">Del</button>
          </div>
        </div>
        <div v-if="groupedChatList.older.length">
          <h3>Older</h3>
          <div class="history-list" v-for="his in visibleOlderChats" :key="his.chatid">
            <button class="flat-history" v-bind:class="{ active: his.active }" @click="selectChat(his)"> {{ his.name }} </button>
            <button class="save-chat-history" @click="saveChatHistory(his)">save</button>
            <button class="delete-chat-history" @click="deleteChatHistory(his)">Del</button>
          </div>
          <button v-if="!showMore && groupedChatList.older.length > 24" @click="toggleShowMore" class="show-more-button">
            Show More
          </button>
        </div>
      </div>
      <div v-else>
        <div class="history-list" v-for="his in sortedChatList" :key="his.chatid">
          <button class="flat-history" v-bind:class="{ active: his.active }" @click="selectChat(his)"> {{ his.name }} </button>
          <button class="save-chat-history" @click="saveChatHistory(his)">save</button>
          <button class="delete-chat-history" @click="deleteChatHistory(his)">Del</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import hashObject from 'object-hash'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref, computed } from 'vue'
import { DateTime } from 'luxon' // Import Luxon

const storeAI = aiInterfaceStore()
const storeBentobox = bentoboxStore()

let saveChat = ref(false)
let newChatname = ref('')
let sortMode = ref('time') // Default sort mode
let showMore = ref(false) // Track if more items should be shown

const historyList = computed(() => {
  return storeAI.historyList
})

const chatList = computed(() => {
  return storeBentobox.chatList
})

const sortedChatList = computed(() => {
  if (sortMode.value === 'time') {
    const sortedList = chatList.value.sort((a, b) => {
      const aTime = a.lastTimestamp || 0
      const bTime = b.lastTimestamp || 0
      return bTime - aTime
    })
    return sortedList
  } else if (sortMode.value === 'favorites') {
    const sortedList = chatList.value.sort((a, b) => b.useCount - a.useCount)
    return sortedList
  }
})

const groupedChatList = computed(() => {
  const now = DateTime.now()
  const thisWeek = []
  const thisMonth = []
  const older = []

  sortedChatList.value.forEach(chat => {
    if (chat.lastTimestamp !== undefined) {
      const chatDate =  DateTime.fromMillis(chat.lastTimestamp)
      const diffDays = now.diff(chatDate, 'days').days
      if (diffDays <= 7) {
        thisWeek.push(chat)
      } else if (diffDays <= 30) {
        thisMonth.push(chat)
      } else {
        older.push(chat)
      }
    }
  })

  return {
    thisWeek,
    thisMonth,
    older
  }
})

const visibleOlderChats = computed(() => {
  return showMore.value ? groupedChatList.value.older : groupedChatList.value.older.slice(0, 24)
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
      chi.createTimestamp = DateTime.now().toMillis()
      chi.lastTimestamp = DateTime.now().toMillis() // Update last used timestamp
      chi.useCount++
      chi.useCount = chi.useCount,
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
  newChatItem.createTimestamp = DateTime.now().toMillis() // Add creation timestamp
  newChatItem.lastTimestamp = DateTime.now().toMillis() // Add last used timestamp
  newChatItem.useCount = 0,
  newChatItem.favoriteCount = 0 // Add favorite count
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

const toggleShowMore = () => {
  showMore.value = !showMore.value
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
  display: grid;
  grid-template-columns: 1fr;
  height: 2em;
}

.mode-switch {
  margin-bottom: 1em;
}

.category-header {
  font-weight: bold;
  margin-top: 1em;
}

.show-more-button {
  margin-top: 1em;
  padding: 0.5em 1em;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  }

.show-more-button:hover {
  background-color: #0056b3;
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
  }

  .live-drop-zone {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
    width: 200px;
  }

  .live-drop-zone:hover {
    background-color: rgb(244, 245, 246);
  }

  #message-question {
    text-align: center;
  }
}
</style>
