<template>
  <div id="max-chart">
    <Bar v-if="loaded" id="inter-chart-id"  ref="chartspace" :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { ref, computed, onMounted } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale )

  const chartspace = ref(null)
  let data = ref({})
  let options = ref({})
  let loaded = ref(false)

  onMounted(() => {
    data.value = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
        },
      ],
    };


  options.value = {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (e) => {
        console.log('click bar')
        // console.log(Object.keys(chartspace.value.chart.$context.chart.tooltip))
        // console.log(chartspace)
        const chart = chartspace
        console.log(
          chartspace.value.chart.$context.chart.tooltip.dataPoints
          /*chart.getElementsAtEventForMode(
            e,
            'nearest',
            { intersect: true },
            false
          ) */
        ) 
      },
    };

    loaded.value = true
  })
</script>

<style scoped>

#max-chart {
  height: 40vh;
  width: 50vw;
}

#inter-chart-id {
  height: 500px;
  width: 600px;
}

</style>