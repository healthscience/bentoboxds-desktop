<template>
  <div v-if="storeAI.startChat === true">
    <welcome-view></welcome-view>
  </div>
  <div v-else>
    <beebee-view></beebee-view>
  </div>
</template>

<script setup>
import WelcomeView from '@/components/welcome/WelcomeView.vue'
import BeebeeView from '@/components/beebeeView/beebeeView.vue'

import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()

</script>

<style scoped>

</style>