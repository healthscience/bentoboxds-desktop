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
          <div id="status-agent">Status: {{ agent.active }}</div>
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

  let swarmState = ref(true)
  let agentStatus = ref({})
  agentStatus['cale-gpt4all'] = false
  agentStatus['cale-evolution'] = true

  /* computed */
  const agentList = computed(() => {
  return storeAccount.agentList
})

  /* methods */
  let startAgentlearn = (agent, action) => {
    if (action === 'start') {
      let learnMessage = {}
      learnMessage.type = 'bbai'
      learnMessage.reftype = 'ignore'
      learnMessage.action = 'learn-agent-start'
      learnMessage.data = { model: agent}
      learnMessage.bbid = ''
      storeAccount.sendMessageHOP(learnMessage)
    } else if (action === 'stop') {
      let learnMessage = {}
      learnMessage.type = 'bbai'
      learnMessage.reftype = 'ignore'
      learnMessage.action = 'learn-agent-stop'
      learnMessage.data = { model: agent}
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
}

</style>
