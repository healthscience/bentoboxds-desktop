<template>
  <div v-if="storeAI.startChat === true">
    <welcome-view></welcome-view>
  </div>
  <div v-else>
    <beebee-view></beebee-view>
  </div>
  <div v-if="sendSocket.connection_error || sendSocket.connection_loss">
    <connection-status></connection-status>
  </div>
</template>

<script setup>
import WelcomeView from '@/components/welcome/WelcomeView.vue'
import BeebeeView from '@/components/beebeeView/beebeeView.vue'
import ConnectionStatus from '@/components/welcome/connectionStatus.vue'

import { useSocketStore } from '@/stores/socket.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const sendSocket = useSocketStore()
const storeAI = aiInterfaceStore()

</script>

<style scoped>

</style>