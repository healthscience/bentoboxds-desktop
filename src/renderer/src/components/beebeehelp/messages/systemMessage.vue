<template>
  <div class="system-message">
    <div v-if="message.action === 'agent-response'">
      {{ message.data }}
    </div>
    <div v-else-if="message.action === 'hop-learn-feedback'">
      {{ message.data.agent }} Please start the LLM in accounts settings.
    </div>
    <div v-else>
      <div class="system-text">
        {{ message?.data?.text }} - {{ message.data?.type }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: Object
})
</script>

<style scoped>
.system-message {
  padding: 1em;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 0.5em 0;
  border-left: 4px solid #007bff;
}

.system-text {
  color: #333;
  font-size: 14px;
}
</style>