<template>
  <div class="besearch-logic-wrapper">
    <div class="logic-braid-top">
      <!-- A. The Orgo Bay -->
      <section
        class="lab-bay orgo-bay"
        @drop.prevent="handleSeedDrop($event, 'orgo')"
        @dragover.prevent
      >
        <header class="bay-header">
          <h4>Orgo (Structural)</h4>
        </header>

        <div v-if="activeOrgos.length === 0" class="bay-placeholder">
          Drag Orgo Seeds
        </div>

        <div
          v-for="orgo in activeOrgos"
          :key="orgo.instanceId"
          class="active-instance mini"
        >
          <div class="instance-header">
            <span class="instance-name">{{ orgo.name }}</span>
          </div>
          <div class="tuning-controls mini">
            <div
              class="slider-group"
              v-for="(val, key) in orgo.params"
              :key="key"
            >
              <input
                type="range"
                v-model="orgo.params[key]"
                min="0"
                :max="key === 'damping' ? 1 : 100"
                :step="key === 'damping' ? 0.01 : 1"
                @input="logMutation('orgo', orgo.instanceId, key, val)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- B. The Gelle Pocket -->
      <section
        class="lab-bay gelle-pocket"
        @drop.prevent="handleSeedDrop($event, 'gelle')"
        @dragover.prevent
      >
        <header class="bay-header">
          <h4>Gelle (Adaptive)</h4>
        </header>

        <div v-if="activeGelles.length === 0" class="bay-placeholder">
          Drag Gelle Textures
        </div>

        <div
          v-for="gelle in activeGelles"
          :key="gelle.instanceId"
          class="active-instance mini"
        >
          <div
            class="graft-zone mini"
            @drop.prevent="handleGraftDrop($event, gelle.instanceId)"
            @dragover.prevent
          >
            <canvas
              v-if="gelle.id === 'platonic_solid'"
              :ref="(el) => setGelleCanvas(el, gelle.instanceId)"
              class="gelle-polyhedron-canvas"
            ></canvas>
            <div
              v-for="graft in gelle.grafts"
              :key="graft"
              class="graft-bubble mini"
            >
              {{ graft }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { besearchStore } from "@/stores/besearchStore.js";
import { useOrgoStore } from "@/stores/orgoStore.js";
import { useGelleStore } from "@/stores/gelleStore.js";

const storeBesearch = besearchStore();
const orgoStore = useOrgoStore();
const gelleStore = useGelleStore();

const activeOrgos = computed(() => orgoStore.activeOrgos);
const activeGelles = computed(() => gelleStore.activeGelles);

const gelleCanvases = ref({});
const gelleAnimations = ref({});

const handleSeedDrop = (e, targetType) => {
  const data = JSON.parse(e.dataTransfer.getData("application/besearch-seed"));
  if (data.type === targetType) {
    if (targetType === "orgo") {
      orgoStore.instantiateOrgo(data.id);
    } else {
      gelleStore.graftGelle(data.id);
    }
  }
};

const handleGraftDrop = (e, instanceId) => {
  const word = e.dataTransfer.getData("text/plain");
  if (word) {
    gelleStore.addGraft(instanceId, word);
  }
};

const logMutation = (type, instanceId, key, value) => {
  storeBesearch.updateBesearchThread({
    component: type,
    instance: instanceId,
    property: key,
    value: value,
  });
};

const setGelleCanvas = (el, instanceId) => {
  if (el) {
    gelleCanvases.value[instanceId] = el;
    initGellePolyhedron(el, instanceId);
  } else {
    delete gelleCanvases.value[instanceId];
    if (gelleAnimations.value[instanceId]) {
      cancelAnimationFrame(gelleAnimations.value[instanceId]);
      delete gelleAnimations.value[instanceId];
    }
  }
};

const initGellePolyhedron = (canvas, instanceId) => {
  const ctx = canvas.getContext("2d");
  const phi = (1 + Math.sqrt(5)) / 2;
  const vertices = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ];

  let angle = 0;
  const project = (v, scale) => {
    const x = v[0] * Math.cos(angle) - v[2] * Math.sin(angle);
    const z = v[0] * Math.sin(angle) + v[2] * Math.cos(angle);
    const y = v[1] * Math.cos(0.5) - z * Math.sin(0.5);
    return { x: x * scale, y: y * scale };
  };

  const render = () => {
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const scale = (Math.min(width, height) / 2) * 0.8;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);
    angle += 0.01;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const d2 = Math.pow(vertices[i][0] - vertices[j][0], 2) +
                   Math.pow(vertices[i][1] - vertices[j][1], 2) +
                   Math.pow(vertices[i][2] - vertices[j][2], 2);
        if (d2 < 4.1 && d2 > 3.9) {
          const p1 = project(vertices[i], scale);
          const p2 = project(vertices[j], scale);
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
    }
    ctx.stroke();
    ctx.restore();
    gelleAnimations.value[instanceId] = requestAnimationFrame(render);
  };
  render();
};

onUnmounted(() => {
  Object.values(gelleAnimations.value).forEach(cancelAnimationFrame);
});
</script>

<style scoped>
.logic-braid-top {
  display: flex;
  gap: 20px;
}
.lab-bay {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
}
.bay-header h4 {
  margin: 0 0 15px 0;
  font-size: 0.8rem;
  color: #00ffcc;
}
.bay-placeholder {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #718096;
  font-size: 0.8rem;
}
.active-instance {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}
.instance-name {
  font-weight: bold;
  font-size: 0.8rem;
  color: #e0e0e0;
}
.graft-zone {
  min-height: 150px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 10px;
}
.gelle-polyhedron-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.graft-bubble {
  background: rgba(0, 255, 204, 0.1);
  border: 1px solid #00ffcc;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.7rem;
  color: #00ffcc;
  position: relative;
  z-index: 1;
}
</style>
