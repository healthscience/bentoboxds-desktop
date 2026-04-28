<script setup>
// No props needed for now
</script>

<template>
  <div class="depth-layer cellular-layer">
    <div class="cell-placeholder">
      CELLULAR EMULATION
    </div>
  </div>
</template>

<style scoped>
.cellular-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.cell-placeholder {
  width: 150px;
  height: 150px;
  background-color: #2c3e50;
  border-radius: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ecf0f1;
  font-weight: bold;
  text-align: center;
  padding: 15px;
  box-shadow: 0 0 20px rgba(0,0,0,0.4);
  border: 2px dashed rgba(255,255,255,0.3);
}
</style>
