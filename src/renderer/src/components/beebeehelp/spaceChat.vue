<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-chat :show="bentochatStatus" @close="closeBentoChat">
      <template #header>
        <!-- The code below goes into the header slot -->
        <div id="chatspace-modal-header">
           <div id="spacechat">CueChat # {{ storeAI.liveBspace.name }}</div>
        </div>
      </template>
      <template #body>
        <div class="space-chat">
          <div class="context-content">
            <chat-interface :context-filter="{ type: 'chatspace', id: storeAI.liveBspace?.cueid || storeAI.liveBspace?.spaceid }"></chat-interface>
          </div>
        </div>
        <div class="chat-input">
          <input-box></input-box>
        </div>
      </template>
      <template #footer>
      </template>
    </modal-chat>
  </Teleport>
</template>

<script setup>
import ModalChat from '@/components/beebeehelp/chatModal.vue' 
import ChatInterface from '@/components/beebeehelp/chatInterface.vue'
import inputBox from '@/components/beebeehelp/inputBox.vue'
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore()
let previousContext = null

/* computed */
const bentochatStatus = computed(() => {
  return storeAI.bentochatState
})

onMounted(() => {
  previousContext = storeAI.beebeeContext
  storeAI.beebeeContext = 'chatspace'
  // Ensure the space chat is present in the chat menu with timestamps
  const cueId = storeAI.liveBspace?.cueid || storeAI.liveBspace?.spaceid
  const name = storeAI.liveBspace?.name
  const contractKey = storeAI.liveBspace?.contract_key
  const lifeStrapID = storeAI.liveBspace?.lifeStrapID || cueId

  if (cueId) {
    storeAI.setActiveLifeStrap(lifeStrapID, contractKey)
    storeAI.ensureSpaceChatInMenu(cueId, name)
  }
})

onBeforeUnmount(() => {
  storeAI.beebeeContext = previousContext || 'chat'
})

/* methods */
const closeBentoChat = () => {
  storeAI.bentochatState = !storeAI.bentochatState
}
</script>

<style scoped>
#chatspace-modal-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.btn-green {
  display: inline;
  width: 120px;
}

#spacechat {
  display: inline;
  font-size: 1.2em;
  font-weight: bold;
}

#return-modal-close {
  text-align: right;
}

.space-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.context-selector {
  display: flex;
  justify-content: space-around;
  padding: 1em;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.context-selector button {
  padding: 0.5em 1em;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.context-selector button.active {
  background-color: #007bff;
  color: white;
}

.context-content {
  flex: 1;
  padding: 1em;
  overflow-y: auto;
}

  .chat-input {
    position: fixed;
    bottom: 26px;
  }

@media (min-width: 1024px) {
  #chatspace-modal-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    z-index: 1299;
  }

  .btn-green {
    display: inline;
    width: 120px;
    height: 30px;
  }

  #spacechat {
    display: inline;
    font-size: 1.2em;
    font-weight: bold;
  }

  #return-modal-close {
    text-align: right;
  }

  .chat-input {
    position: fixed;
    bottom: 32px;
  }

  .space-chat {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .context-selector {
    display: flex;
    justify-content: space-around;
    padding: 1em;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ccc;
  }

  .context-selector button {
    padding: 0.5em 1em;
    background-color: #e0e0e0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .context-selector button.active {
    background-color: #007bff;
    color: white;
  }

  .context-content {
    flex: 1;
    padding: 1em;
    overflow-y: auto;
  }
}
</style>