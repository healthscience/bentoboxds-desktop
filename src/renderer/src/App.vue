<template>
  <div>
    hello vite electron etc.
  </div>
  <toolbar-main></toolbar-main>
  <router-view/>
</template>

<script setup>
import ToolbarMain from './components/toolbars/mainTools.vue'
import { RouterView } from 'vue-router'
import { useSocketStore } from '@/stores/socket.js'

  const storeWebsocket = useSocketStore()
  storeWebsocket.init_chat()

</script>

<style scoped>
</style>