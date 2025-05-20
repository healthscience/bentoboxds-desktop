<template>
  <div id="cues-decision-flow">
  <beebee-ai v-if="beebeeCues"></beebee-ai>
  <h3>Decision cue</h3>
  <div id="decision-doughnut-cues">
    <div id="doughnut-size">
      <pie-chartcues v-if="cuesDecision.labels.length > 0" :cueType="'simple'" :chartData="cuesDecision" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
    </div>
    <div id="cue-drill-in">
      decision cue -- {{ cueActive }}
      <div id="cue-type" v-if="cueActive.length > 0 && decisionCues[cueActive] !== undefined">
        <pie-chartcues :chartData="decisionCues[cueActive]" :options="{}" @segmentClick="cueSelect" ></pie-chartcues>
      </div>
    </div>
  </div>
  <div id="decision-reason">
    <div id="positive-reason" class="reason-container">
      <div id="peer-add-positive">
        <h3>Postive</h3>
        <div id="positive-holder">
          <form id="add-positive-form" @submit.prevent="positiveAdd()">
            <label for="benefit"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
            <input type="input" id="positiveadd" name="cuepositive" placeholder="positive expectations" v-model="positivePeeradd" autofocus>
          </form>
          <button id="natlang-ask" type="submit" @click="positiveAdd()">
            + add
          </button>
        </div>
      </div>
      <div class="decision-elements" v-for="ditem of oracleItems">
        <button class="decision-element-btn" @click="addDecisionElement(ditem)">{{ ditem.label }}</button>
      </div>
    </div>
    <div id="negative-reason" class="reason-container">
      <h3>Concerns</h3>
      <div id="peer-add-concern">
        <div id="concern-holder">
          <form id="add-positive-form" @submit.prevent="concernAdd()">
            <label for="benefit"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
            <input type="input" id="positiveadd" name="cuepositive" placeholder="positive expectations" v-model="concernPeeradd" autofocus>
          </form>
          <button id="natlang-ask" type="submit" @click.prevent="concernAdd()">
            + add
          </button>
        </div>
        <div id="decision-risks">
        <div class="decision-elements" v-for="ditem of oracleConerns">
          <button class="decision-element-btn" @click.prevent="addDecisionElement(ditem)">{{ ditem.label }}</button>
        </div>
      </div>
      </div>
    </div>
  </div>
  <div id="decision-biomarkers" v-if="bioMarker.state === true">
    <h3>Biomarkers</h3>
    <div id="positive-reason" class="reason-container">
      <h3>Postive</h3>
      <div class="decision-elements" v-for="ditem of oracleBioMItems">
        <button class="decision-element-btn" @click="addDecisionElement(ditem)">{{ ditem.label }}</button>
      </div>
    </div>
    <div id="negative-reason" class="reason-container">
      <h3>Concerns</h3>
      <div id="decision-risks">
        <div class="decision-elements" v-for="ditem of oracleBioMConerns">
          <button class="decision-element-btn" @click="addDecisionElement(ditem)">{{ ditem.label }}</button>
        </div>
      </div>
    </div>
  </div>
  <div id="decision-risk">
    <h3>Risk expectations</h3>
  </div>
  <div id="decision-make">
    <h3>Make decision</h3>
  </div>
  <div id="decision-diary">
    <h3>Time line diary</h3>
      MINI CALENDAR MODAL view
  </div>
  <div id="decision-diary">
    <h3>Recomend network N=1 boards</h3>
  </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BeebeeAi from '@/components/beebeehelp/inputBox.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'  // pieChart.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let cuesDecision = ref({ labels: [], datasets: [] })
  let cueActive = ref('decision')
  let positivePeeradd = ref('')
  let concernPeeradd = ref('')
  let bioMarker = ref({ name: 'Off', state: false })
  let beebeeCues = ref(false)

  /* computed */
  const decisionDlive = computed(() => {
    return storeAI.decisionDoughnutCue
  })

  const oracleItems = computed(() => {
    return storeAI.oracleData.elements
  })

  const oracleConerns = computed(() => {
    return storeAI.oracleData.concerns
  })

  const decisionCues = computed(() => {
    let testPie = {}
    testPie['muscle mass'] = {
      labels: ['movement', 'strength', 'immunine system', 'bone density', 'grip', 'heart cardio'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113'],
        data: [36, 36, 36, 36, 36, 36]
        }
      ]}
      testPie['brain'] = {
      labels: ['fog', 'concentration', 'better sleep', 'prevent cog decline'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992'],
        data: [36, 36, 36, 36]
        }
      ]}
    return testPie
  })

  /* methods */
  const addDecisionElement = (ditem) => {
    // add data to doughnut
    let updatePie = {}
    updatePie.labels = []
    updatePie.datasets = []
    // current labels
    let currentLabels = cuesDecision.value.labels
    let currentDatasets = cuesDecision.value.datasets
    let newColor
    let newData
    // new array for color and data
    if (currentDatasets.length === 0) {
      newColor = [ditem.datasets.backgroundColor]
      newData = [ditem.datasets.data]
    } else {
      let existing = currentDatasets[0]
      newColor = existing['backgroundColor'].concat([ditem.datasets.backgroundColor])
      newData = existing['data'].concat([ditem.datasets.data])
    }
    // add to arrays
    currentLabels.push(ditem.label)
    currentDatasets = [{ backgroundColor: newColor, data: newData }]
    let updatePieObj = {}
    updatePieObj.labels = currentLabels
    updatePieObj.datasets = currentDatasets
    cuesDecision.value = updatePieObj
  }

  const positiveAdd =  () => {
    let newPositve = { label: positivePeeradd.value, datasets: { backgroundColor: '#6ab866', data: 30 }}
    addDecisionElement(newPositve)
    storeAI.oracleData.elements.push(newPositve)
  }

  const concernAdd =  () => {
    let newConcern = { label: concernPeeradd.value, datasets: { backgroundColor: '#deb8bd', data: 30 }}
    addDecisionElement(newConcern)
    storeAI.oracleData.concerns.push(newConcern)
  }

  const cueSelect = (cueID, segID) => {
    cueActive.value = segID.label
    if (segID.label === 'Blood') {
      spaceSelect('b6e81d8bed9758b538aa25c13239968813b17f5a', segID.label)
    } else if (segID.label === 'Hotel1') {
      spaceSelect('6b58a76357424b4a7382f3c891b07db74c8d871a', segID.label)
    } else if (segID.label === 'Freshwater change') {
      spaceSelect('9e71b5fc3f1ea1c4e08a75478ef2ffcb7b43d7ff', segID.label)
    } else if (segID.label === 'immunine system') {
      spaceSelect('9e71b5fc3f1ea1c4e08a75478ef2ffcb7b43d7ff', segID.label)
    }
  }

</script>

<style>

@media (min-width: 1024px) {

  #cues-decision-flow {
    display: grid;
    grid-template-columns: 1fr;
    border: 1px solid red;
    width: 60vw;
    height: 80vh;
    background: rgb(176, 176, 204);
    opacity: .9;
    overflow-y: scroll;
  }

  #decision-doughnut-cues {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #decision-reason {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .reason-container {
    background-color: white;
  }

  #positive-holder, #concern-holder{
    display: grid;
    grid-template-columns: 5fr 1fr;
    width: 80%;
  }
}

</style>