<template>
  <div id="modules-list-box">
    <div>Data library source</div>
    <div>compute  train predict evalute</div>
    <div>vis</div>
    <div>action prescire video exerseise etc.</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

   const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  
  /* computed */
  const start = computed(() => {
    return 3
  })

  /* methods */
  const sss = () => {
  }

</script>

<style scoped>
#modules-list-box {
  background-color: antiquewhite; 
}

@media (min-width: 1024px) {
  #modules-list-box {
    background-color: antiquewhite; 
  }
}
</style>
