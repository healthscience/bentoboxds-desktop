<template>
  <div class="mock-controls glass-panel">
    <div class="flex-row">
      <button @click="startMock" :disabled="isPlaying" class="btn-run">
        {{ isPlaying ? 'Replaying...' : '▶ Mock 200m Endurance Set' }}
      </button>
      <button @click="stopMock" class="btn-stop">Stop</button>
    </div>
    
    <div v-if="isPlaying" class="playback-monitor">
      <span class="timer">T-{{ currentTime }}s</span>
      <span class="hr-read">{{ currentHR }} BPM</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { generateMockSession } from './MockPolarData.js';

const emit = defineEmits(['tick']);
const isPlaying = ref(false);
const currentTime = ref(0);
const currentHR = ref(0);
let interval = null;

const startMock = () => {
  const sessionData = generateMockSession();
  isPlaying.value = true;
  currentTime.value = 0;

  interval = setInterval(() => {
    if (currentTime.value >= sessionData.length) {
      stopMock();
      return;
    }
    
    const dataPoint = sessionData[currentTime.value];
    currentHR.value = dataPoint.actualHR;
    
    // Emit the intensity to the Parent (SwimEmulator)
    emit('tick', dataPoint);
    
    currentTime.value++;
  }, 100); // 10x speed for testing
};

const stopMock = () => {
  clearInterval(interval);
  isPlaying.value = false;
};
</script>