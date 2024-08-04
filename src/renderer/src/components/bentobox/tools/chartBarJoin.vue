<template>
  <div id="chart-toolbar">
    <div class="network-tools">
      <div id="chart-options">
        <div class="chart-calendar-update">
          <select v-model="selectedTimeFormat" @change.prevent="setTimeFormat()">
            <option class="data-vis-action" v-for="tfoption in timeformatoptions" :value="tfoption.value">
            {{ tfoption.text }}
            </option>
          </select>
        </div>
        <div>
          <button class="data-vis-action" @click.prevent="labelsSelect()" v-bind:class="{ active: showLabels }">Labels</button>
          <button class="data-vis-action" @click.prevent="tidySelect()"  v-bind:class="{ active: tidyData }">Tidy</button>
        </div>
      </div>
    </div>
    <div id="chart-style-tools" class="network-tools">
        <button class="chart-type" @click.prevent="chartSelect('bar')" v-bind:class="{ active: chartStyleActive === 'bar' }">Bar</button>
        <button class="chart-type" @click.prevent="chartSelect('line')" v-bind:class="{ active: chartStyleActive === 'line' }">Line</button>
        <button class="chart-type" @click.prevent="chartSelect('simulation')" v-bind:class="{ active: chartStyleActive === 'simulation' }">Simulation</button>
        <button class="chart-type" @click.prevent="chartSelect('table')" v-bind:class="{ active: chartStyleActive === 'table' }">Table</button>
      <!--<li>
        <button @click.prevent="chartSelect()">Mixed</button>
      </li>
      <div>
        <button @click.prevent="labelsSelect()">Labels</button>
      </div>-->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { accountStore } from '@/stores/accountStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  
  const selectedChartnumber = ref('singlechart')
  const tidyData = ref(false)
  const showLabels = ref(false)
  const chartStyleActive = ref('bar')
  const selectedTimeFormat = ref('timeseries')

  const props = defineProps({
    bboxid: String
  })

  const timeformatoptions = ref([
    { text: 'Time series', value: 'timeseries', id: 0 },
    { text: 'Overlay', value: 'overlay', id: 1 }
  ])


/* methods */
const setTimeFormat = () => {
  storeLibrary.joinOptions.timeformat = selectedTimeFormat.value
}

const labelsSelect = () => {
  // this.liveData.data.chartOptions.legend.display = !this.liveData.data.chartOptions.legend.display
  showLabels.value = !showLabels.value
  storeLibrary.joinOptions.showlabels = showLabels.value
}

const tidySelect = () => {
  tidyData.value = !tidyData.value
  libraryStore.tidyOption = tidyData.value
  storeLibrary.joinOptions.tidy = tidyData.value
}

const chartSelect = (chartStyle) => {
  chartStyleActive.value = chartStyle
  storeLibrary.joinOptions.chartstyle = chartStyleActive.value

}

/*  computed */
const boxSettings = computed(() => {
  return storeBentobox.boxToolStatus[props.bboxid]
})

const visToolbarStatus = computed(() => {
  return storeBentobox.bbToolbarOpendata[props.bboxid]
})

</script>


<style scoped>

#vis-tools {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  background-color:rgb(224, 227, 243);
  z-index: 12;
}

@media (min-width: 1024px) {

  #chart-toolbar {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #vis-tools {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 1fr 1fr;
  }

  #grap-map {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .network-tools {
    border: 1px solid rgb(171, 171, 227);
  }

  .context-network {
    margin-top: 1em;
    margin-left: 2em;
  }

  .data-vis-action, .chart-calendar-update {
    margin-left: 10px;
  }

  .active {
    background-color: rgb(113, 172, 114);
    border: 1px solid green;
  }
}

</style>