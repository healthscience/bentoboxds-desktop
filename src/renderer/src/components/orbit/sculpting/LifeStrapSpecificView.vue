<template>
  <div class="lifestrap-specific-view">
    <div class="view-header">
      <h4>Specific View: {{ strapName }}</h4>
      <div class="status-badge">Isolated Development</div>
    </div>

    <div class="canvas-container" ref="canvasContainer">
      <!-- Ported icosahedron renderer for isolated orgo/gelle -->
      <canvas ref="canvasRef" class="isolation-canvas"></canvas>
    </div>

    <div class="view-footer">
      <div class="controls">
        <button class="mini-btn">Pulse Test</button>
        <button class="mini-btn">Stability: {{ stability }}%</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const props = defineProps({
  strap: Object,
  color: {
    type: String,
    default: "#00ffc8",
  },
});

const canvasRef = ref(null);
const canvasContainer = ref(null);
const stability = ref(85);
let animationId = null;

const strapName = computed(
  () => props.strap?.value?.concept?.story?.slice(0, 30) || "New Orgo/Gelle",
);

// Simple icosahedron renderer based on organSurface logic
const renderer = {
  ctx: null,
  phi: (1 + Math.sqrt(5)) / 2,
  vertices: [],
  angle: 0,

  init(canvas) {
    this.ctx = canvas.getContext("2d");
    const p = this.phi;
    this.vertices = [
      [-1, p, 0],
      [1, p, 0],
      [-1, -p, 0],
      [1, -p, 0],
      [0, -1, p],
      [0, 1, p],
      [0, -1, -p],
      [0, 1, -p],
      [p, 0, -1],
      [p, 0, 1],
      [-p, 0, -1],
      [-p, 0, 1],
    ];
  },

  project(v, scale) {
    const x = v[0] * Math.cos(this.angle) - v[2] * Math.sin(this.angle);
    const z = v[0] * Math.sin(this.angle) + v[2] * Math.cos(this.angle);
    const y = v[1] * Math.cos(0.5) - z * Math.sin(0.5);
    return { x: x * scale, y: y * scale };
  },

  render(width, height, pulseValue, color) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    const scale = (Math.min(width, height) / 8) * pulseValue;
    const centerX = width / 2;
    const centerY = height / 2;

    this.angle += 0.015;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;

    ctx.beginPath();
    for (let i = 0; i < this.vertices.length; i++) {
      for (let j = i + 1; j < this.vertices.length; j++) {
        const d2 =
          Math.pow(this.vertices[i][0] - this.vertices[j][0], 2) +
          Math.pow(this.vertices[i][1] - this.vertices[j][1], 2) +
          Math.pow(this.vertices[i][2] - this.vertices[j][2], 2);
        if (d2 < 4.1 && d2 > 3.9) {
          const p1 = this.project(this.vertices[i], scale);
          const p2 = this.project(this.vertices[j], scale);
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
    }
    ctx.stroke();
    ctx.restore();
  },
};

onMounted(() => {
  if (canvasRef.value) {
    renderer.init(canvasRef.value);

    const animate = (time) => {
      const width = (canvasRef.value.width = canvasContainer.value.clientWidth);
      const height = (canvasRef.value.height =
        canvasContainer.value.clientHeight);
      const pulseValue = 1.0 + Math.sin(time / 200) * 0.1;
      renderer.render(width, height, pulseValue, props.color);
      animationId = requestAnimationFrame(animate);
    };
    animate();
  }
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
});
</script>

<style scoped>
.lifestrap-specific-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  overflow: hidden;
}

.view-header {
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-header h4 {
  margin: 0;
  font-size: 0.9rem;
  color: var(--sov-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.status-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  background: rgba(0, 255, 200, 0.1);
  color: #00ffc8;
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 200, 0.3);
}

.canvas-container {
  flex-grow: 1;
  position: relative;
  min-height: 0;
}

.isolation-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.view-footer {
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
}

.controls {
  display: flex;
  gap: 10px;
}

.mini-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.mini-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
