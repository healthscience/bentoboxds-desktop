<template>
  <div id="ai-interaction">
    <div class="agent-feedback-progress" v-for="agentFeedback of agentProgressUpdate">
      <div class="progress-feedback" v-if="agentFeedback.show === true">
      {{ agentFeedback.feedback }}
      </div>
    </div>
    <div id="input-tools">
      <form id="ask-ai-form" @submit.prevent="storeAI.submitAsk()">
        <label for="askname"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
        <textarea rows="14" cols="10" wrap="soft" id="askinput" name="ainame" placeholder="Ask the health oracle anything." v-model="storeAI.askQuestion.text" autofocus>
        </textarea>
      </form>
      <button id="natlang-ask" type="submit" v-if="beebeeAIStatus.active === true" @click="storeAI.submitAsk">
        BeeBee
      </button>
      <div id="agent-tools">
        <div id="agent-status" v-bind:class="{ active: agentStatus }" @mouseover="showAgents" @mouseleave="hideAgents">@a</div>
        <div id="agent-list" v-if="modelLoadingStatus === false && agentsActive === true">
          LLM is active
        </div>
        <div id="loading-agent" class="blink_me" v-if="modelLoadingStatus === true">
          Loading
        </div>
      </div>
    </div>
    <div id="tool-agents">
      <div id="tools-list">
          <div id="upload-link" class="tool-type" @click="toolAgent('upload')">@upload</div>
          <div class="tool-type" @click="toolAgent('library')">@library</div>
      </div>
    </div>
    <data-box v-if="dataBoxStatus === true"></data-box>
  </div>
</template>

<script setup>
import DataBox from '@/components/dataspace/dataBox.vue'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref, computed, watch } from 'vue'

  const storeLibrary = libraryStore()
  const storeAI = aiInterfaceStore()

  const props = defineProps({
    prompt: Object,
    chatcontext: String
   })

   let agentsActive = ref(false)
  // For watching the entire object
  /*
  watch(
    () => storeAI.agentProgress,
    (newValue) => {
      console.log('agentProgress changed:', newValue)
      // Your logic here
    },
    { deep: true }
  )

  // For watching a specific property
  const specificProperty = computed(() => storeAI.agentProgress[storeAI.chatAttention])
  watch(
    specificProperty,
    (newValue) => {
      console.log('Specific property changed:', newValue)
      // Your logic here
    },
    { immediate: true }
  ) */

  /* computed */
  const beebeeAIStatus = computed(() => {
    return storeAI.helpchatAsk
  })

  const agentProgressUpdate = computed(() => {
    if (storeAI.agentProgress[storeAI.chatAttention] !== undefined) {
      let chatFeedback = storeAI.agentProgress[storeAI.chatAttention]
      let feedbackKeys = Object.keys(chatFeedback)
      let agentProgressFeeback = []
      for (let feedAgent of feedbackKeys) {
        if (chatFeedback[feedAgent].show === true) {
          agentProgressFeeback.push(chatFeedback[feedAgent])
        }
      }
      return agentProgressFeeback
    } else {
      return []
    }
  })

  const modelLoadingStatus = computed(() => {
    return storeAI.modelLoading
  })
  const agentStatus = computed(() => { 
    return storeAI.agentStatus
  })

  // a computed ref
  const dataBoxStatus = computed(() => {
    return storeAI.dataBoxStatus
  })

  /* methods */
  const showAgents = () => {
    agentsActive.value = true
  }

  const hideAgents = () => {
    agentsActive.value = false
  }

  const toolAgent = (tool) => {
    if (tool === 'upload') {
      storeAI.dataBoxStatus = true
      storeLibrary.uploadStatus = true
      storeLibrary.libraryStatus = false
    } else if (tool === 'library') {
      storeAI.dataBoxStatus = true
      storeAI.uploadStatus = false
      storeLibrary.libraryStatus = true
    }
  }

</script>

<style scoped>

#ai-interaction {
  display: grid;
  grid-template-columns: 1fr;
}

#input-tools {
    display: grid;
    grid-template-columns: 1fr;
  }

#askinput {
  font-size: 1.2em;
  height:4em;
  width: 100%;
}

#tool-agents {
  display: grid;
  grid-template-columns: 1fr;
}

#tools-list {
  justify-self: end;
  margin-right: 1em;
  color: rgb(125, 137, 204);
}

.tool-type {
  display: inline-block;
  margin-right: 1em;
  cursor: pointer;
}

#natlang-ask {
  height: 60px;
}

#agent-status {
  color: lightgray;
}

#agent-status.active {
  color: rgb(113, 172, 114);
}

.blink_me {
  animation: blinker 2s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

@keyframes gentleFlash {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

.progress-feedback {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  font-size: 1.1em;
  animation: gentleFlash 2s ease-in-out infinite;
}


@media (min-width: 1024px) {
  #ai-interaction {
    display: grid;
    grid-template-columns: 1fr;
  }

  #input-tools {
    display: grid;
    grid-template-columns: 8fr 1fr 1fr;
  }

  #tool-agents {
    display: grid;
    grid-template-columns: 8fr 1fr 1fr;
  }

  #tools-list {
    justify-self: end;
    margin-right: 1em;
    color:  rgb(125, 137, 204);
  }

  .tool-type {
    display: inline-block;
    margin-right: 1em;
    cursor: pointer;
  }

  #askinput {
    font-size: 1.2em;
    padding-left: 1em;
    height:4em;
    width: 100%;
    opacity: 100%;
  }

  #natlang-ask {
    height: auto;
  }

  #agent-status {
    margin-left: .6em;
    color: lightgray;
  }

  #agent-status.active {
    color: rgb(113, 172, 114);
    font-weight: bold;
  }

  .blink_me {
    margin-left: .6em;
    animation: blinker 2s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

}

</style>