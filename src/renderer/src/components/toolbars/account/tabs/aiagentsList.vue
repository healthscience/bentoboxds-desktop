<template>
  <div id="aiagents-lists">
    <div class="list-space" id="agent-list">
      <div class="ai-agent-introduction">
        beebee orchestrates and learns from AI agents.
      </div>
      <div id="evolutionary-agent" class="agent-header">Evolutionary</div>
      <div class="ai-agent-list" v-for="agent of agentList">
        <div class="agent-name">{{ agent.name }} </div>
        <div class="agent-description">Evolutionary Learning Agent</div>
        <div class="agent-active" v-bind:class="{ active: agent.active }">
          <div v-if="agent.loading === true">
            <div class="loading-agent blink_me">Loading</div>
          </div>
          <div id="status-agent  blink_me">Status: {{ agent.active }}</div>
          <button v-if="agent.active === false" id="start-agent-learn" @click="startAgentlearn(agent.name, 'start')">Begin</button>
          <button v-else="agent.active === true" id="start-agent-learn" @click="startAgentlearn(agent.name, 'stop')">Stop</button>
          <div class="onstart-agent">
            <!--Load on start:<input type="checkbox" v-model="agent.onstart" :id="agent.onstart"/>-->
          </div>
        </div>
      </div>
    </div>
    <div class="llm-model-agent">
      <div id="llm-models" class="agent-header">Large Language Model</div>
      <div class="ai-agent-list">
        <div class="agent-name" v-if="storeAI.agentModelDefault.length !== 0">
          {{ defaultLLM.value.concept.agent }} -- {{ defaultLLM.value.concept.name }}
          <button id="change-default-model" @click="updateDefaultModel()">Change</button>
        </div>
        <div v-else="defaultLLM?.first === true">
           {{ defaultLLM.message }}
           <button id="change-default-model" @click="updateDefaultModel()">Select model</button>
        </div>
        <div class="agent-description">Chat agent</div>
        <div class="agent-active" v-if="defaultLLM?.first !== 'undefined' && storeAI.agentModelDefault.length !== 0">
          <div class="active-status"  v-bind:class="{ active: storeAI.agentStatus }">
            <div v-if="modelLoadingStatus === true">
              <div class="loading-agent blink_me">Loading</div>
            </div>
            <div id="status-agent  blink_me">Status: {{ defaultLLM?.value?.computational?.active }}</div>
            <button v-if="defaultLLM?.value?.computational?.active !== false" id="start-agent-learn" @click="startAgentlearn(defaultLLM.model, 'start')">Begin</button>
            <button v-if="defaultLLM?.value?.computational?.active === true" id="start-agent-learn" @click="startAgentlearn(defaultLLM.model, 'stop')">Stop</button>
            <div class="onstart-agent"  v-if="storeAI.agentModelDefault.length !== 0">
              Load on start:<input type="checkbox" v-model="defaultLLM.value.computational.onstart" :id="defaultLLM.value.computational.onstart" @change="setOnStartModel()"/>
            </div>
          </div>
        </div>
      </div>
      <div id="select-default-model" v-if="changeLLM === true">
        <div id="select-new-model">
          <div class="agent-description">LLM models available:</div>
          <div class="model-chosen-custom">
            <select v-model="modelInfo">
              <option v-for="model of LLMsAvailable"  :value="model">{{ model.model }}</option>
            </select>
          </div>
        </div>
        <div id="modal-description">
          <div id="model-description-summary">{{ modelInfo.name }} {{ modelInfo.description }}</div>
          <div id="model-install-info">
            Running a Large Language Model requires a relative new computer, with a GPU performace will be better.  Installing a model involves downloading a large file, which may take some time.
          </div>
            <button id="change-default-model" @click="setDefaultModel()">Set this model as default</button>
        </div>
      </div>
    </div>
    <div class="select-agent-type">
      <div id="llm-models" class="agent-header">Time series</div>
      Coming soon
    </div>
    <div class="select-agent-type">
      <div id="llm-models" class="agent-header">Media</div>
      Coming soon
    </div>
    <div class="select-agent-type">
      <div id="llm-models" class="agent-header">Research</div>
      Coming soon
    </div>
    <div class="select-agent-type">
      <div id="llm-models" class="agent-header">Markers</div>
      Coming soon
    </div>
    <div class="select-agent-type">
      <div id="llm-models" class="agent-header">Product</div>
      Coming soon
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()

  let changeLLM = ref(false)
  let modelInfo = ref({})

  /* computed */
  const defaultLLM = computed(() => {
    if (storeAI.agentModelDefault.length === 0) {
      return { first: true, message: 'please select a LLM model' }
    } else {
      let agentDefault = {}
      for (let agent of storeAI.agentModelDefault) {
        if (agent?.value?.computational?.active === true) {
          agentDefault = agent
        }
      }
      if (Object.keys(agentDefault).length === 0) {
        agentDefault = storeAI.agentModelDefault[0]
      }
      return agentDefault
    }
  })

  const modelLoadingStatus = computed(() => {
    return storeAI.modelLoading
  })

  const agentList = computed(() => {
    return storeAI.agentList
  })

  const LLMsAvailable = computed(() => {
    return storeAI.llmModelsList
  })

  /* methods */
  let startAgentlearn = (agentChoice, action) => {
    if (action === 'start') {
      storeAI.sendModelControl(defaultLLM.value.value.computational, 'learn-agent-start')
      storeAI.modelLoading = true
    } else if (action === 'stop') {
      storeAI.sendModelControl(defaultLLM.value.value.computational, 'learn-agent-stop')
    }
  }

  const setDefaultModel = () => {
    // storeAI.agentModelDefault = []
    // keep track of previous model
    storeAI.previousLLM = defaultLLM.value
    let tempModelContract = {}
    tempModelContract.key = modelInfo.value.model
    tempModelContract.value = {}
    tempModelContract.value.concept = modelInfo.value
    // save and on success set as default
    storeAI.prepareModelContract(modelInfo.value)  
    changeLLM.value = !changeLLM.value
  }

  const setOnStartModel = () => {
   // update contract to deafult
   let activeStatus = true
   let startStatus = false
   if (defaultLLM.value.value.computational.onstart !== false) {
    startStatus = true
   }
   storeAI.prepareUpdateModelContract(defaultLLM.value, activeStatus, startStatus)  
  }

  const updateDefaultModel = () => {
    changeLLM.value = !changeLLM.value
  }


</script>

<style scoped>
#agents-lists {
  display: block;
  height: auto;
}

.select-agent-type {
  display: grid;
  grid-template-columns: 1fr;
  margin: .6em;
  border-bottom: 1px solid lightgrey;
}

.agent-header {
  font-weight: bold;
}

#select-default-model {
  display: grid;
  grid-template-columns: 1fr;
  width: 80%;
  padding-left: 2em;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 1em;
}

#modal-description {
  border: 1px solid lightgrey;
  width: 80%;
  padding: 1em;
  margin: 1em;
}

#model-description-summary {
  padding-top: 1em;
}

.active {
  padding: .4em;
  background-color: rgb(113, 172, 114);
}

#model-install-info {
  padding: .6em;
  color:rgb(84, 84, 233)
}

@media (min-width: 1024px) {

  .ai-agent-introduction {
    width: 80%;
    text-wrap: wrap;
    padding: 2em;
  }

  .ai-agent-list {
    display: grid;
    width: 90%;
    grid-template-columns: 2fr 2fr 1fr;
    border-bottom: 1px solid lightgrey;
    margin-bottom: 1em;
    padding-left: 1em;
  }

  .active {
    background-color: rgb(113, 172, 114);
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
