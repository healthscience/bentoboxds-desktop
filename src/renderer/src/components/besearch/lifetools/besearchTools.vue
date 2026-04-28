<template>
  <div id="besearch-tools">
    <h3>Besearch</h3>
    <div class="besearch-control-buttons">
      <button @click="besearchTool('create')" class="control-button">Create</button>
      <button @click="besearchTool('start')" class="control-button">Start</button>
      <button @click="besearchTool('stop')" class="control-button">Stop</button>
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits([''])


  /** methods */


</script>

<style scoped>


@media (min-width: 1024px) {
  
}
</style>