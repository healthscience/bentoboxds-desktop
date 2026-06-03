<template>
  <div class="graft-layer-container">
    <SculptingLayer />
  </div>
</template>

<script setup>
import SculptingLayer from "@/components/orbit/sculpting/sculptingLayer.vue";
</script>

<style scoped>
.graft-layer-container {
  width: 100%;
  height: 80vh;
  margin-top: 10px;
  overflow: auto;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

:deep(.sculpting-layer) {
  position: relative !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1 !important;
  transform: none !important;
}
</style>
