<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-chat :show="bentochatStatus" @close="closeBentoChat">
      <template #header>
        <!-- The code below goes into the header slot -->
        <div id="chatspace-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoChat"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="spacechat">CueChat # {{ storeAI.liveBspace.name }}</div>
          <div id="return-modal-close" @click="closeBentoChat">return</div>
        </div>
      </template>
      <template #body>
        <div id="chatspace-conversation">
          <conversation-messages></conversation-messages>
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
import ConversationMessages from '@/components/beebeehelp/conversationFlow.vue'
import ModalChat from '@/components/beebeehelp/chatModal.vue' 
import inputBox from '@/components/beebeehelp/inputBox.vue'
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'


  const storeAI = aiInterfaceStore()

  /* computed */
  const bentochatStatus = computed(() => {
    return storeAI.bentochatState
  })

  /* methods */
  const closeBentoChat = () => {
    storeAI.bentochatState = !storeAI.bentochatState
    // save the current layout on close
    // storeBentobox.saveLayoutSpace(storeAI.liveBspace.spaceid)
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

@media (min-width: 1024px) {



}

</style>