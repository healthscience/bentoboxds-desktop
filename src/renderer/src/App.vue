<template>
  <div class="app-container">
    <toolbar-main class="app-header"></toolbar-main>
    <div class="app-content">
      <data-box></data-box>
      <router-view/>
    </div>
  </div>
</template>

<script setup>
import ToolbarMain from '@/components/toolbars/mainTools.vue'
import DataBox from '@/components/dataspace/dataBox.vue'
import { RouterView } from 'vue-router'
import { useSocketStore } from '@/stores/socket.js'

  const storeWebsocket = useSocketStore()
  storeWebsocket.init_chat()

</script>

<style>
  /* Global reset for full screen */
  html, body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  #app {
    height: 100vh;
    width: 100vw;
  }
</style>

<style scoped>
  .app-container {
    display: grid;
    grid-template-rows: var(--header-height, 60px) 1fr;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .app-header {
    grid-row: 1;
  }

  .app-content {
    grid-row: 2;
    overflow: hidden;
    position: relative;
  }
</style>
