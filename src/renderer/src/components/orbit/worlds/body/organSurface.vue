<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { besearchStore } from "@/stores/besearchStore.js";

const storeBesearch = besearchStore();

const props = defineProps({
  linkedCue: {
    type: Object,
    default: null,
  },
  organColor: {
    type: String,
    default: "#ff4d4d",
  },
});

const canvasRef = ref(null);
let animationId = null;

/**
 * HOP Heart Surface: Pulsing Icosahedron Renderer
 */
const CanvasHeart = {
  ctx: null,
  width: 0,
  height: 0,
  phi: (1 + Math.sqrt(5)) / 2, // The Golden Ratio
  vertices: [],
  angle: 0,

  init(canvas) {
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    // Define the 12 vertices of an icosahedron
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

  render(pulseValue, color = "#ff4d4d") {
    if (!this.ctx) return;

    // pulseValue is driven by the resonAgent (0.8 to 1.2 scale)
    // Reduced size to 25% of previous (from /4 to /16)
    const scale = (Math.min(this.width, this.height) / 16) * pulseValue;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Background glow
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const glow = this.ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      scale * 2,
    );
    glow.addColorStop(0, "rgba(255, 77, 77, 0.15)");
    glow.addColorStop(1, "rgba(255, 77, 77, 0)");
    this.ctx.fillStyle = glow;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.save();
    this.ctx.translate(centerX, centerY);

    // Slow rotation for ambient feel
    this.angle += 0.01;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.lineJoin = "round";

    // Add glow to the lines
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = color;

    this.ctx.beginPath();

    // Project and Draw Edges
    for (let i = 0; i < this.vertices.length; i++) {
      for (let j = i + 1; j < this.vertices.length; j++) {
        const d2 =
          Math.pow(this.vertices[i][0] - this.vertices[j][0], 2) +
          Math.pow(this.vertices[i][1] - this.vertices[j][1], 2) +
          Math.pow(this.vertices[i][2] - this.vertices[j][2], 2);

        // In an icosahedron, adjacent vertices have a distance of 2
        // We use a small epsilon for floating point comparison
        if (d2 < 4.1 && d2 > 3.9) {
          const p1 = this.project(this.vertices[i], scale);
          const p2 = this.project(this.vertices[j], scale);
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
        }
      }
    }
    this.ctx.stroke();
    this.ctx.restore();

    // Labeling
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.font = 'bold 18px "Inter", sans-serif';
    this.ctx.textAlign = "center";
    this.ctx.shadowBlur = 0;
    this.ctx.fillText("HEART RESONANCE", centerX, centerY + scale + 60);
    this.ctx.font = '14px "Inter", sans-serif';
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.fillText(
      "72 BPM | RESONANCE ACTIVE",
      centerX,
      centerY + scale + 85,
    );
  },

  project(v, scale) {
    // Simple 3D to 2D rotation & projection
    // Rotate around Y axis
    const x = v[0] * Math.cos(this.angle) - v[2] * Math.sin(this.angle);
    const z = v[0] * Math.sin(this.angle) + v[2] * Math.cos(this.angle);

    // Rotate around X axis slightly for better perspective
    const y = v[1] * Math.cos(0.5) - z * Math.sin(0.5);

    // Orthographic projection
    return { x: x * scale, y: y * scale };
  },
};

const initHeart = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  CanvasHeart.init(canvas);

  const bpm = 72;
  const bps = bpm / 60;
  const period = 1000 / bps;

  const resize = () => {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    CanvasHeart.width = canvas.width;
    CanvasHeart.height = canvas.height;
  };

  window.addEventListener("resize", resize);
  resize();

  const animate = (time) => {
    // Dual-pulse logic for pulseValue (0.8 to 1.2)
    let pulseValue = 1.0;

    if (storeBesearch.isEmulationActive) {
      pulseValue = storeBesearch.emulationPulse;
    } else {
      const t = (time % period) / period;

      if (t < 0.15) {
        // First beat (lub)
        pulseValue = 1.0 + Math.sin((t / 0.15) * Math.PI) * 0.15;
      } else if (t > 0.25 && t < 0.4) {
        // Second beat (dub)
        pulseValue = 1.0 + Math.sin(((t - 0.25) / 0.15) * Math.PI) * 0.1;
      } else {
        // Resting phase with slight decay
        pulseValue = 1.0;
      }
    }

    const color = props.linkedCue?.name?.toLowerCase().includes("heart")
      ? "#ff4d4d"
      : props.organColor;
    CanvasHeart.render(pulseValue, color);

    animationId = requestAnimationFrame(animate);
  };

  animationId = requestAnimationFrame(animate);

  return () => {
    window.removeEventListener("resize", resize);
    cancelAnimationFrame(animationId);
  };
};

let cleanup = null;

onMounted(() => {
  cleanup = initHeart();
});

onUnmounted(() => {
  if (cleanup) cleanup();
});
</script>

<template>
  <div class="depth-layer biomarker-layer">
    <canvas id="besearch-world" ref="canvasRef" class="organ-canvas"></canvas>
  </div>
</template>

<style scoped>
.biomarker-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background: radial-gradient(
    circle at center,
    rgba(20, 0, 0, 0.4) 0%,
    transparent 80%
  );
}

.organ-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
