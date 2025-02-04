<template>
  <div v-if="stageActive === true" class="stage-build-holder">
    <div id="setup-path-tools">
      <div id="start-new-path">
        <form id="stage-name">
          <label>Stage Name</label>
          <input name="stagename" v-model="stageName">
          <label for="stagetype-select">type</label>
          <select class="select-stage-id" id="stage-mapping-build" @change="statetypeSelect" v-model="stageType">
            <!-- <option value="none" selected="">please select</option> -->
            <option v-for="stype in stagetypeList" :key="stype.id" :value="stype">
              {{ stype.name }}
            </option>
          </select>
        </form>
      </div>
      <!--stage component one -->
      <div id="stage-component-one">
        <div class="component-type" v-if="stageType.id === 0" >
          text box - please write story
          <form id="stage_form" name="stage_form" method="post" action="#">
            <div class="message-text">
              <textarea class="prompt-width" required="" v-model="stageTextmessage" placeholder="write message"></textarea>
            </div>
          </form>
        </div>
        <div class="component-type" v-if="stageType.id === 1" >
          data
        </div>
        <div class="component-type" v-if="stageType.id === 2" >
          Image
        </div>
        <div v-if="stageType.id === 3" >
          <header>Experiment</header>
          <form id="experiment_form" name="experiment_form" method="post" action="#">
            <div class="stage-experiment">
              <input required="" v-model="stageExperiment" @change="experimentLookup" placeholder="experiment reference">
            </div>
          </form>
        </div>
        <div class="component-type" v-if="stageType.id === 4">
          Select a cue or build a new cue
          <cues-prepared></cues-prepared>
          <button id="new-cue-stage" @click="newCueButton()">+ Cue</button>{{ newcueStage  }}DD
          <new-cue v-if="newcueStage === true"></new-cue>
        </div>
        <div class="component-type" v-if="stageType.id === 5">
          Prompt and chat:
            <!--beebee chat-->
            <div class="prompt-text">
              <textarea class="prompt-width" required="" v-model="stagePrompt" placeholder="write prompt"></textarea>
            </div>
            <div id="chat-opening-path">
              <input required="" v-model="stageTextmessage" @change="experimentLookup" placeholder="agent message .. .. .">
            </div>
            Reply
            <beebee-ai></beebee-ai>
        </div>
      </div>
       <!-- add another component to stage-->
      <div id="stage-component-two" v-if="activeCompTwo">
        <form id="stage-name">
          <label for="stagetype-select">Add another component type:</label>
          <select class="select-stage-id" id="stage-mapping-build" @change="statetypeSelect" v-model="stageTypeTwo">
            <!-- <option value="none" selected="">please select</option> -->
            <option v-for="stype in stagetypeList" :key="stype.id" v-bind:value="stype">
              {{ stype.name }}
            </option>
          </select>
        </form>
        <!-- stage component two -->
        <div v-if="stageTypeTwo.id === 0" >
          text box - please write story
          <form id="stage_form" name="stage_form" method="post" action="#">
            <div class="prompt-text">
              <textarea required="" v-model="stageText" placeholder="write prompt"></textarea>
            </div>
          </form>
        </div>
        <div class="component-type" v-if="stageTypeTwo.id === 1" >
          data
        </div>
        <div class="component-type" v-if="stageTypeTwo.id === 2" >
          Image
        </div>
        <div class="component-type" v-if="stageTypeTwo.id === 3" >
          <header>Experiment</header>
          <form id="experiment_form" name="experiment_form" method="post" action="#">
            <div class="stage-experiment">
              <input required="" v-model="stageExperiment" @change="experimentLookup" placeholder="experiment reference">
            </div>
          </form>
        </div>
        <div class="component-type" v-if="stageTypeTwo.id === 4">
          Select a cue or build a new cue
          <cues-prepared></cues-prepared>
          <new-cue v-if="newcueStage === true"></new-cue>
        </div>
        <div class="component-type" v-if="stageTypeTwo.id === 5">
          Prompt and chat
            <!--beebee chat-->
            <div id="chat-opening-path">
              <input required="" v-model="stagePromptwo" @change="experimentLookup" placeholder="prompt message">
            </div>
            <beebee-ai></beebee-ai>
        </div>
      </div>
      <div id="stage-button">
        <button @click.prevent="saveStage" id="save-stage-button">Save stage</button>
      </div>
    </div>
    <div id="stage-display-preview" v-if="stageActive === true">
      <header>Stage preview area {{ stageID }} </header>
        <div>
          Path: {{ storeCues.pathName }}  Stage: {{ stageName }}
        </div>
        <div>
          Type: {{ stageType }}
        </div>
        <div>
          Text: {{ stageText }}
        </div>
        <div>
          Experiment Reference {{ stageExperiment }}
        </div>
    </div>
  </div>
</template>

<script setup>
import CuesPrepared from '@/components/bentocues/prepareCues.vue' 
import BeebeeAi from '@/components/beebeehelp/inputBox.vue'
import NewCue from '@/components/bentocues/buildcue/newCue.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { ref, computed, onMounted } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  const props = defineProps({
    stageID: Object,
    stageActive: null
  })

  let newcueStage = ref(false)
  let stageName = ref('')
  let stageType = ref({})
  let stageTypeTwo = ref({})
  let activeCompTwo = ref(false)
  let stagetypeList = 
    ref([
      { id: 5, name: 'Prompt' },
      { id: 4, name: 'Cue wheel' },
      { id: 0, name: 'Text' },
      { id: 1, name: 'Data' },
      { id: 2, name: 'Image' },
      { id: 3, name: 'Experiment' },
      { id: 6, name: 'Questionnaire' }
    ])
  let stageText = ref('')
  let stagePrompt = ref('')
  let stageTextmessage = ref('')
  let stageExperiment = ref('')
  let stageExperimenttwo = ref('')
  let stagePromptwo = ref('')

   /* computed */   
  const liveStageCount = computed(() => {
    return storeCues.stageCount
  })

  const cuesHolistic = computed(() => {
    return storeCues.hopCues
  })


   /* methods */
  const newCueButton = () => {
    console.log('clicck')
    newcueStage.value = !newcueStage.value
  }

  const saveStage = () => {
    console.log('save stage')
    // save story name and create holder for story
    if (storeCues.stageCount === 0) {
      storeCues.pathRefContracts[storeCues.pathName] = {}
    }
    storeCues.stageCount++
    let pathSummary = {}
    pathSummary.stagename = stageName
    pathSummary.stagetype = stageType
    pathSummary.stagetypetwo = stageTypeTwo
    pathSummary.stageid = storeCues.stageCount
    pathSummary.promptone = stagePrompt
    pathSummary.prompottwo = stagePromptwo
    storeCues.bentopathStages.push(pathSummary)
    // clear the forms
    // stageType.value = ''
    // stageText.value = ''
    // stageName.value = ''
    // stageExperiment.value = ''
    // stageExperimenttwo.value = ''
  }

  const statetypeSelect = () => {
    activeCompTwo.value = true
  }

  const experimentLookup = () => {
    console.log('lookup reference contract')
    console.log(stageExperiment.value)
  }

  const cueSelect = () => {
    // import full cue builld component
  }

</script>

<style scoped>

#setup-path-tools {
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid lightgrey;
  min-height: 100vh;
}

#start-new-path {
  display: grid;
  grid-template-columns: 1fr;
  margin: 20px;
  height: 4vh;
}

.component-type {
  display: grid;
  grid-template-columns: 1fr;
  margin: 20px;
}

.prompt-text, .prompt-width {
  display: grid;
  grid-template-columns: 1fr;
}

textarea {
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 1em;
}

#stage-component-one, #stage-component-two {
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
}

#stage-display-preview {
  display: grid;
  grid-template-columns: 1fr;
  margin: 20px;
  border: 2px solid lightgrey;
}

#chat-opening-path {
  display: grid;
  width: 60vw;
  height: 100%;
  margin-bottom: 20px;
}

#chat-opening-path input {
  font-size: 1.4em;
}

#path-buttons {
  display: grid;
  grid-template-columns: 1fr;
  height: 200px;
}

#save-stage-button {
  display: grid;
  grid-template-columns: 1fr;
  width: 20vw;
  height: 2em;
  font-size: 1.2em;
  margin-top: 1em;
}

#complete-path-button {
  display: grid;
  grid-template-columns: 1fr;
  width: 20vw;
  height: 2em;
  font-size: 1.2em;
  margin-top: 1em;
}

@media (min-width: 1024px) {

  
}
</style>
