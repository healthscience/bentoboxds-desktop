<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="props.chartData"
  />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import 'chartjs-adapter-luxon'
import { ref, computed } from 'vue'


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
    chartData: Object
  })
  
  /*
  // const dataValues = ref([2, 4, 7])
  const dataValues = computed(() => {
    console.log(storeAI.tempNumberData)
    return storeAI.tempNumberData
  })

  const dataLabel = computed(() => {
    console.log(storeAI.tempLabelData)
    return storeAI.tempLabelData
  })

  const chartData = computed(() => {
    return {
      labels: dataLabel.value, // [ 'January', 'February', 'March' ],
      datasets: [ { data: dataValues.value } ]
    }
   })
  */
  const chartOptions = computed(() => {
    return {
      responsive: true,
      maintainAspectRatio: true,
      options: {
        scales: {
          x: {
            type: 'time',
            /* time: {
              unit: 'month'
            } */
            time: {
              displayFormats: {
               quarter: 'MMM YYYY'
              }
            }
          }
        }
      }
    }
  })
</script>

<style scoped>

</style>