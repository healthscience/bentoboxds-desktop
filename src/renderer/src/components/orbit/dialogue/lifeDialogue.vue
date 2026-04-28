<template>
  <div id="life-dialogue">
    <div id="chatspace-modal-header">
      <div id="spacechat">CueChat # {{ storeAI.liveBspace.name }}</div>
      <div
        id="return-modal-close"
        :class="{ 'active-history': chatHistoryStatus }"
        @click="chatHistoryMenu()"
      >
        History
      </div>
    </div>
    <div class="space-chat">
      <chat-menu v-if="chatHistoryStatus === true"></chat-menu>
      <div class="context-content">
        <chat-interface
          :context-filter="{
            type: 'chatspace',
            id: storeAI.liveBspace?.cueid || storeAI.liveBspace?.spaceid,
          }"
        ></chat-interface>
      </div>
    </div>
    <div class="chat-input">
      <input-box></input-box>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import ChatInterface from "@/components/beebeehelp/chatInterface.vue";
import inputBox from "@/components/beebeehelp/inputBox.vue";
import ChatMenu from "@/components/beebeeView/navigation/chatMenu.vue";

import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { useChatStore } from "@/stores/chatStore.js";

const storeAI = aiInterfaceStore();
const storeChat = useChatStore();
let previousContext = null;
let chatHistoryStatus = ref(false);

// Watch for history status changes to expand the right panel
watch(chatHistoryStatus, (isOpen) => {
  if (isOpen) {
    // Expand panel to accommodate 250px menu + existing chat area
    // Assuming base chat area is around 380px, we add 250px
    storeChat.chatWidth = storeChat.chatWidth + 250;
  } else {
    // Shrink back
    storeChat.chatWidth = Math.max(380, storeChat.chatWidth - 250);
  }
});

/* computed */
const bentochatStatus = computed(() => {
  return storeAI.bentochatState;
});

onMounted(() => {
  previousContext = storeAI.beebeeContext;
  storeAI.beebeeContext = "chatspace";
  // Ensure the space chat is present in the chat menu with timestamps
  const cueId = storeAI.liveBspace?.cueid || storeAI.liveBspace?.spaceid;
  const name = storeAI.liveBspace?.name;
  const contractKey = storeAI.liveBspace?.contract_key;
  const lifeStrapID = storeAI.liveBspace?.lifeStrapID || cueId;

  if (cueId) {
    storeAI.setActiveLifeStrap(lifeStrapID, contractKey);
    storeAI.ensureSpaceChatInMenu(cueId, name);
  }
});

onBeforeUnmount(() => {
  storeAI.beebeeContext = previousContext || "chat";
});

/* methods */
const chatHistoryMenu = () => {
  // storeAI.bentochatState = !storeAI.bentochatState
  storeAI.historyList = true;
  chatHistoryStatus.value = !chatHistoryStatus.value;
};
</script>

<style scoped>
#life-dialogue {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 88vh;
  width: 100%;
  overflow: hidden;
  margin-bottom: 60px; /* Force margin to sit above Bento quadrants */
}

.chat-input {
  border-top: 1px solid #eee;
  padding: 8px;
  background: white;
  z-index: 10;
}

.space-chat {
  display: grid;
  grid-template-columns: v-bind('chatHistoryStatus ? "250px" : "0px"') 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-template-areas: "chat-menu context-content";
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: grid-template-columns 0.3s ease;
}

.context-content {
  grid-area: context-content;
  overflow-y: auto;
  height: 100%;
  width: 100%;
}

.chat-menu {
  grid-area: chat-menu;
  overflow-y: auto;
  height: 100%;
  width: 100%;
}

#chatspace-modal-header {
  display: grid;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

#spacechat {
  font-size: 1.2em;
  font-weight: bold;
}

#return-modal-close {
  cursor: pointer;
  padding: 5px 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

#return-modal-close.active-history {
  background-color: #4caf50;
  color: white;
}
</style>
