<template>
    <header>Board Builder</header>
    <module-builder></module-builder>
    <button class="contribute-nxp-button" @click="contributeNXP" >Contribute Board</button>
</template>

<script setup>
import { ref, computed } from 'vue'
import moduleBuilder from '@/components/dataspace/modules/moduleBuilder.vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  // a computed ref
  const peerNXPlib = computed(() => {
    return storeLibrary.peerExperimentList
  })

</script>

<style scoped>

</style>