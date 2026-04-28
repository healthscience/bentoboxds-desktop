<template>
  <div 
    class="drop-zone glass-panel"
    :class="{ 'dragging': isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <div v-if="!fileLoaded" class="prompt">
      <span class="icon">📂</span>
      <p>Drop Polar .json Session here to Replay</p>
    </div>
    
    <div v-else class="file-info">
      <span class="file-name">✅ {{ fileName }} Loaded</span>
      <button @click="startReplay" class="btn-play">▶ Start Replay</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { parsePolarJSON } from './PolarParser.js';

const emit = defineEmits(['data-ready']);
const isDragging = ref(false);
const fileLoaded = ref(false);
const fileName = ref('');

const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  fileName.value = file.name;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      const cleanedData = parsePolarJSON(data);
      fileLoaded.value = true;
      emit('data-ready', cleanedData);
    } catch (err) {
      alert("Format not recognized. Please use Polar JSON export.");
    }
  };
  reader.readAsText(file);
};
</script>

<style scoped>
.drop-zone {
  border: 2px dashed rgba(64, 224, 255, 0.3);
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}
.dragging { background: rgba(64, 224, 255, 0.1); border-color: #40e0ff; }
.btn-play {
  background: #b6ff3b;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>