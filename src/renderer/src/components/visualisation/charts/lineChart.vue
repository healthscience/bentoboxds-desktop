<template>
  <Line
    id="my-chartline-id"
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
      responsive: true,
      maintainAspectRatio: false
    }
  })
</script>

<style scoped>

</style>