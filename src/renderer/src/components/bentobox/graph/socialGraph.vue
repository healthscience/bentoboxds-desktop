<template>
  <div id="social-graph">
    <div id="">
      Graphcial of social network
    </div>
    <div id="social-network-list">
      <header>Peers {{ socialGraphList }}</header>
      <div class="graph-peer" v-for="sg in socialGraphList" :key="sg.key">
        {{ sg }}
      </div>
     </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { accountStore } from '@/stores/accountStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  const storeAccount = accountStore()

  /* computed */
  const socialGraphList = computed(() => {
    return storeAccount.warmPeers
  })

</script>


<style>
</style>