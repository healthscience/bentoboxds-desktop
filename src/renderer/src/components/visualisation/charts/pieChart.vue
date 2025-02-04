<template>
  <div id="interact-cues">
    <Pie
      v-if="loaded"
      id="pie-chart-id"
      ref="chartspace"
      :data="props.chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as  ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { ref, computed, onMounted } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore()

ChartJS.register(ArcElement, Tooltip, Legend) // 

  const props = defineProps({
    chartData: Object
  })

  const chartspace = ref(null)
  let loaded = ref(false)
  let chartOptions = ref({})

  onMounted(() => {
    chartOptions = {
      cutout: '50%',
      responsive: true,
      maintainAspectRatio: false,
      onClick: (e) => {
        console.log('cue interact click')
        // console.log(e)
        console.log(chartspace.value.chart.$context.chart.tooltip.dataPoints)
      }
    }

    loaded.value = true
  })


  const pieCilckplease = (e) => {
    console.log('p[ie clickc]')
    console.log(e)
  }

</script>

<style scoped>
  @media (min-width: 1024px) {

  #interact-cue {
    border: 1px solid blue;
  }

  #pie-chart-id {
    display: relative;
    height: 90%;
    width: 90%;
  }

}

</style>