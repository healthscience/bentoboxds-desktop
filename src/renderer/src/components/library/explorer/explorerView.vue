<template>
  <div id="explorer-view-main">
    <library-cues></library-cues>
  </div>
</template>

<script setup>
import LibraryCues from '@/components/library/explorer/libraryCues.vue'
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()
  
</script>

<style scoped>
#explorer-view-main {
  width: 100%;
}
</style>
