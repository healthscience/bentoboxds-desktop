<template>
  <div id="aiagents-lists">
    <div class="list-space" id="agent-list">
      <div class="ai-agent-introduction">Coming soon: install locall LLM, time series and other AI agents. Privacy preserving machine learning.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()

  let swarmState = ref(true)

</script>

<style scoped>
#agents-lists {
  display: block;
  height: auto;
}

@media (min-width: 1024px) {

  .ai-agent-introduction {
    width: 80%;
    text-wrap: wrap;
    padding: 2em;
  }
}

</style>
