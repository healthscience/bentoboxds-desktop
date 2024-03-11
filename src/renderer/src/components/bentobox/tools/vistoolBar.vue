<template>
  <div id="vis-tools">
    <div class="network-tools">
      <div class="context-network">ng
        <!--<button @click.prevent="setNetworkgraph('networkview')">{{ network.text }}</button>-->
      </div>
      <div class="context-network">nm
        <!--<button @click.prevent="setNetworkmap('mapview')">{{ mapButton.text }}</button>-->
      </div>
    </div>
    <div class="network-tools">
      <calendar-tool :bboxid="props.bboxid"></calendar-tool>
    </div>
    <div class="network-tools">
      <div id="chart-options">
        <div class="chart-update">
          <select v-model="selectedTimeFormat" @change.prevent="setTimeFormat()">
            <option v-for="tfoption in timeformatoptions" v-bind:value="tfoption.value" :key='tfoption.id' :selected="selectedChartnumber">
            {{ tfoption.text }}
            </option>
          </select>
        </div>
        <div>
          <button @click.prevent="labelsSelect()">Labels</button>
        </div>
      </div>
    </div>
    <div id="chart-style-tools" class="network-tools">
        <button class="chart-type" @click.prevent="chartSelect()">Bar</button>
        <button class="chart-type" @click.prevent="chartSelect()">Line</button>
      <!--<li>
        <button @click.prevent="chartSelect()">Mixed</button>
      </li>
      <div>
        <button @click.prevent="labelsSelect()">Labels</button>
      </div>-->
    </div>
    <div class="network-tools">
      <button href="#" id="opendata-space" @click.prevent="openDataToolbar()">open data</button>
    </div>
  </div>
  <div class="network-tools" v-if="boxSettings !== undefined" id="open-knowledge">
    <opendata-tool v-if="boxSettings?.opendatatools?.active === true" :bboxid="props.bboxid" :toolInfo="boxSettings"></opendata-tool>
  </div>
  <!--<div id="feedback-time" v-if="feedbackmessage !== 'clear'" v-bind:class="{ active: feedbackActive }">
    {{ feedbackmessage }}
  </div>-->
</template>

<script setup>
import CalendarTool from '@/components/bentobox/tools/calendarTools.vue'
import OpendataTool from '@/components/bentobox/tools/opendataTools.vue'
import { ref, computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  const selectedChartnumber = ref('singlechart')

  const props = defineProps({
    bboxid: String
  })

const timeformatoptions = ref([
  { text: 'Time series', value: 'timeseries', id: 0 },
  { text: 'Overlay', value: 'overlay', id: 1 }
])

const selectedTimeFormat = ref('timeseries')

/* methods */
const openDataToolbar = () => {
  console.log('open data')
  console.log(storeBentobox.boxToolStatus)
  console.log(props.bboxid)
  storeBentobox.boxToolStatus[props.bboxid].opendatatools.active = !storeBentobox.boxToolStatus[props.bboxid].opendatatools.active
}

const setTimeFormat = () => {
  console.log('set time format')
}

const labelsSelect = () => {
  // this.liveData.data.chartOptions.legend.display = !this.liveData.data.chartOptions.legend.display
  let legendContext = {}
  legendContext.shellID = '' // this.shellID
  legendContext.moduleCNRL = '' // this.moduleCNRL
  legendContext.moduleType = '' // this.moduleType
  legendContext.mData = '' // his.mData
  // this.$store.dispatch('actionLegendStatus', legendContext)
}

const chartSelect = () => {
  console.log('char ttype')
}

/*  computed */
const boxSettings = computed(() => {
  return storeBentobox.boxToolStatus[props.bboxid]
})

const openDataLive = computed(() => {
  return storeBentobox.openDatatools[props.bboxid]
})

const visToolbarStatusLive = computed(() => {
  return storeBentobox.vistoolsStatus[props.bboxid]
})

</script>


<style scoped>

#vis-tools {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {

  #vis-tools {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  }

  .network-tools {
    border: 1px solid blue;
  }

}

</style>