<template>
  <header>Network Library</header>
  <contract-explorer></contract-explorer>
</template>

<script setup>
import ContractExplorer from '@/components/library/explorer/explorerView.vue'
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()
  
</script>

<style scoped>

</style>
