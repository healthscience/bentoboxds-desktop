<template>
  <div v-if="storeAI.startChat === true">
    <welcome-view></welcome-view>
  </div>
  <div v-else-if="storeAccount.orbitLive === true">
    <prime-interface></prime-interface>
  </div>
  <div v-else-if="storeAccount.orbitLive === false">
    <beebee-view></beebee-view>
  </div>
  <div v-else>BentoBoxDS is broken, Sorry.</div>
  <div v-if="sendSocket.connection_error || sendSocket.connection_loss">
    <connection-status></connection-status>
  </div>

</template>

<script setup>
import WelcomeView from '@/components/welcome/WelcomeView.vue'
import BeebeeView from '@/components/beebeeView/beebeeView.vue'
import ConnectionStatus from '@/components/welcome/connectionStatus.vue'

import { useSocketStore } from '@/stores/socket.js'
import { accountStore } from '../stores/accountStore'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import PrimeInterface from '../components/orbit/PrimeInterface.vue'

const sendSocket = useSocketStore()
const storeAccount = accountStore()
const storeAI = aiInterfaceStore()

</script>

<style scoped>

</style>