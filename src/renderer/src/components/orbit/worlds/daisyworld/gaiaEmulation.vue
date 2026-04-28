<template>
  <div class="gaia-container" ref="container">
    <canvas ref="canvas"></canvas>
    <div class="info-overlay">
      <div class="distance-label">Distance: {{ distanceAU }} AU</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
const container = ref(null);
const distanceAU = ref(1.0); // Mock value

let animationFrame = null;

const draw = () => {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  const { width, height } = canvas.value;

  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  // Draw Sun
  ctx.beginPath();
  ctx.arc(centerX - 150, centerY, 40, 0, Math.PI * 2);
  ctx.fillStyle = '#ffcc00';
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#ffcc00';
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw Earth
  ctx.beginPath();
  ctx.arc(centerX + 150, centerY, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#2277ff';
  ctx.fill();

  // Draw Distance Line
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(centerX - 110, centerY);
  ctx.lineTo(centerX + 138, centerY);
  ctx.strokeStyle = 'rgba(0, 255, 200, 0.5)';
  ctx.stroke();
  ctx.setLineDash([]);

  animationFrame = requestAnimationFrame(draw);
};

const handleResize = () => {
  if (container.value && canvas.value) {
    canvas.value.width = container.value.clientWidth;
    canvas.value.height = container.value.clientHeight;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  draw();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.gaia-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: radial-gradient(circle at center, #001122 0%, #000000 100%);
}

canvas {
  display: block;
}

.info-overlay {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #00ffc8;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 15px;
  border-radius: 10px;
}
</style>
