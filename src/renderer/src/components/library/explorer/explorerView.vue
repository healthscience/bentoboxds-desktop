<template>
  Explorer view
  <contract-viewer></contract-viewer>
</template>

<script setup>
import ContractViewer from '@/components/library/contracts/viewer/referenceModule.vue'
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()
  
</script>

<style scoped>

</style>
