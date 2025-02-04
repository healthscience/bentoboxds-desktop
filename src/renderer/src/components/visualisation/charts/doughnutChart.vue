<template>
  <div id="interact-cue">
    <Pie  v-if="loaded" id="inter-chart-id"  ref="chartspace" :data="props.chartData" :options="options" />
  </div>
</template>

<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { ref, onMounted, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'

  const storeCues = cuesStore()

  ChartJS.register(ArcElement, Tooltip, Legend)

  const emit = defineEmits(['segmentClick'])
  
  const props = defineProps({
    cueType: String,
    chartData: {
      type: Object,
      required: true
    }
  })

const chartspace = ref(null)
  let options = ref({})
  let loaded = ref(false)

  onMounted(() => {
    options = {
      cutout: '40%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          display: true,
        },
        datalabels: {
          formatter: function(value, context) {
            return 1
          },
          color: 'white',
          font: {
            weight: 'bold',
            size: 18
          },
          padding: 4,
         }
      },
      onClick: (e) => {
        // console.log(Object.keys(chartspace.value.chart.$context.chart.tooltip))
        // console.log(chartspace)
        let chart = chartspace
        /* console.log(
          chartspace.value.chart.$context.chart.tooltip.dataPoints
          /*chart.getElementsAtEventForMode(
            e,
            'nearest',
            { intersect: true },
            false
          ) */
        // )
        emit('segmentClick', props.cueType, chartspace.value.chart.$context.chart.tooltip.dataPoints[0])
        // storeCues.activeCueSegment = { type: props.cueType, selection: chartspace.value.chart.$context.chart.tooltip.dataPoints[0] }
      },
    }

    loaded.value = true
  })

  /* computed */
  const updateChartData = computed(() => {
    return props.chartData
  })

  const updateDough = computed(() => {
    return storeCues.activeDougnnutData
  })


</script>

<style scoped>

#interact-cue {
  height: 40vh;
  width: 30vw;
  border: 0px solid red;
}

</style>