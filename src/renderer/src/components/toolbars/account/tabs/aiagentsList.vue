<template>
  <div id="aiagents-lists">
    <div class="list-space" id="agent-list">
      <div class="ai-agent-introduction">
        beebee will learn from other AI agents.
      </div>
      <div class="ai-agent-list" v-for="agent of agentList">
        <div class="agent-name">{{ agent.name }} </div>
        <div class="agent-description">local machine learning</div>
        <div class="agent-active" v-bind:class="{ active: agent.active }">
          <div v-if="agent.loading === true">
            <div class="loading-agent blink_me">Loading</div>
          </div>
          <div id="status-agent  blink_me">Status: {{ agent.active }}</div>
          <button v-if="agent.active === false" id="start-llm-learn" @click="startAgentlearn(agent.name, 'start')">Begin</button>
          <button v-else="agent.active === true" id="start-llm-learn" @click="startAgentlearn(agent.name, 'stop')">Stop</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()

  /* computed */
  const agentList = computed(() => {
  return storeAccount.agentList
})

  /* methods */
  let startAgentlearn = (agentChoice, action) => {
    if (action === 'start') {
      // display loading animation
      for (let agent of storeAccount.agentList) {
        if (agent.name === agentChoice) {
          agent.loading = true
        }
      }
      let learnMessage = {}
      learnMessage.type = 'bbai'
      learnMessage.reftype = 'ignore'
      learnMessage.action = 'learn-agent-start'
      learnMessage.data = { model: agentChoice}
      learnMessage.bbid = ''
      storeAccount.sendMessageHOP(learnMessage)
    } else if (action === 'stop') {
      for (let agent of storeAccount.agentList) {
        if (agent.name === 'cale-gpt4all') {
          agent.loading = false
        }
      }
      let learnMessage = {}
      learnMessage.type = 'bbai'
      learnMessage.reftype = 'ignore'
      learnMessage.action = 'learn-agent-stop'
      learnMessage.data = { model: agentChoice}
      learnMessage.bbid = ''
      storeAccount.sendMessageHOP(learnMessage)
    }

}

</script>

<style scoped>
#agents-lists {
  display: block;
  height: auto;
}

.active {
  background-color: green;
}
@media (min-width: 1024px) {

  .ai-agent-introduction {
    width: 80%;
    text-wrap: wrap;
    padding: 2em;
  }

  .ai-agent-list {
    display: grid;
    width: 80%;
    grid-template-columns: 2fr 2fr 1fr;
    border-bottom: 1px solid lightgrey;
    margin-bottom: 1em;
  }

  .active {
    background-color: green;
    color: white;
    font-weight: bold;
  }

  .blink_me {
    animation: blinker 2s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
}

</style>
