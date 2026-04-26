<template>
<VueDatePicker v-model="date" range />
</template>

<script setup>
// import { DateTime, Interval } from 'luxon'
import { ref, onMounted } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()

  let date = ref()
  let boxDaterange = ref([])

</script>

<style scoped>
</style>