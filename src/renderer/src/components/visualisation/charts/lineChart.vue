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
  /*
  // const dataValues = ref([2, 4, 7])
  const dataValues = computed(() => {
    return storeAI.tempNumberData
  })

  const dataLabel = computed(() => {
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
      maintainAspectRatio: true
    }
  })
</script>

<style scoped>

</style>