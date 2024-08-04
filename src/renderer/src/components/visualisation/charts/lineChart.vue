<template>
  <Line
    id="line-chartline-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { Chart as  ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore()

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)


const props = defineProps({
    chartData: Object
  })

  const chartOptions = computed(() => {
    return {
      type: 'line',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: storeAI.boxSettings.legends,
          position: 'top',
        },
        title: {
          display: true,
          text: 'BentoBoxDS-charting'
        }
      },
      options: {
        scales: {
          x: {
            type: 'time',
            /* time: {
              unit: 'month'
            }
            time: {
              displayFormats: {
               quarter: 'MMM YYYY'
              }
            } */
          },
          y: {
            beginAtZero: true
          }
        }
      }
    }
  })
</script>

<style scoped>
  @media (min-width: 1024px) {

  #line-chart-id {
    display: relative;
    height: 90%;
    width: 90%;
  }

}

</style>