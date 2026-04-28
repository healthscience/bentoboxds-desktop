<template>
  <div class="algotecture-container" ref="container">
    <canvas ref="canvas"></canvas>
    <div class="ui-overlay">
      <h3>Algotecture Space</h3>
      <p>3D Building Mock</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
const container = ref(null);

let animationFrame = null;

const draw = () => {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  const { width, height } = canvas.value;

  ctx.clearRect(0, 0, width, height);

  const state = {
    zoom: 1,
    offset: { x: width / 2, y: height / 2 + 50 } // Offset slightly down to center the building
  };

  /**
   * Projects 3D coordinates (x, y, z) to 2D Canvas space
   * Uses a standard isometric transformation
   */
  function project(x, y, z) {
    return {
      px: (x - y) * Math.cos(0.4636) + state.offset.x,
      py: (x + y) * Math.sin(0.4636) - z + state.offset.y
    };
  }

  function shadeColor(color, percent) {
    let num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
  }

  function drawBuilding(x, y, bWidth, bLength, bHeight, color = '#4a9eff') {
    // Define the 8 corners of the box
    const points = [
      project(x, y, 0),               // 0: Bottom-Front
      project(x + bWidth, y, 0),        // 1: Bottom-Right
      project(x + bWidth, y + bLength, 0), // 2: Bottom-Back
      project(x, y + bLength, 0),       // 3: Bottom-Left
      project(x, y, bHeight),          // 4: Top-Front
      project(x + bWidth, y, bHeight),   // 5: Top-Right
      project(x + bWidth, y + bLength, bHeight), // 6: Top-Back
      project(x, y + bLength, bHeight)   // 7: Top-Left
    ];

    const drawFace = (indices, faceColor) => {
      ctx.beginPath();
      ctx.moveTo(points[indices[0]].px, points[indices[0]].py);
      indices.forEach(i => ctx.lineTo(points[i].px, points[i].py));
      ctx.closePath();
      ctx.fillStyle = faceColor;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.stroke();
    };

    // Render faces (Order matters for depth: Back to Front)
    drawFace([0, 1, 5, 4], color); // Right side
    drawFace([1, 2, 6, 5], shadeColor(color, -20)); // Back side
    drawFace([4, 5, 6, 7], shadeColor(color, 20));  // Top (Roof)
  }

  // Initialize Building at "Birth Location"
  // Using slightly smaller dimensions to ensure it fits well
  drawBuilding(-25, -25, 50, 50, 100);

  animationFrame = requestAnimationFrame(draw);
};

const handleResize = () => {
  if (container.value && canvas.value) {
    const rect = container.value.getBoundingClientRect();
    canvas.value.width = rect.width;
    canvas.value.height = rect.height;
    draw();
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  setTimeout(handleResize, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.algotecture-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #050505;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.ui-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #00ffc8;
  pointer-events: none;
}

.ui-overlay h3 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.ui-overlay p {
  margin: 5px 0 0;
  opacity: 0.6;
  font-size: 12px;
}
</style>
