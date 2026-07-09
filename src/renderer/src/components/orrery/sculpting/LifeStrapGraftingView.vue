<template>
  <div class="lifestrap-grafting-view">
    <div class="view-header">
      <h4>Main Grafting Horizon</h4>
      <div class="status-badge">Simulation Active</div>
    </div>

    <div class="grafting-stage">
      <svg
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid meet"
        class="graft-svg"
      >
        <!-- Background Grid -->
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              stroke-width="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- Mock Cardiovascular System -->
        <!-- Central Heart -->
        <g class="heart-node">
          <circle
            cx="400"
            cy="200"
            :r="30 + pulse * 5"
            fill="rgba(255, 50, 50, 0.2)"
            stroke="#ff3232"
            stroke-width="2"
          />
          <circle
            cx="400"
            cy="200"
            :r="15 + pulse * 3"
            fill="#ff3232"
            opacity="0.6"
          />
          <text
            x="400"
            y="250"
            text-anchor="middle"
            fill="#ff3232"
            font-size="12"
            font-weight="bold"
          >
            HEART_CORE
          </text>
        </g>

        <!-- Main Vessels -->
        <g class="vessels">
          <path
            d="M 430 200 L 600 200"
            stroke="#ff3232"
            stroke-width="4"
            fill="none"
            class="vessel-path"
          />
          <path
            d="M 370 200 L 200 200"
            stroke="#4169e1"
            stroke-width="4"
            fill="none"
            class="vessel-path"
          />

          <path
            d="M 400 170 L 400 80 L 500 80"
            stroke="#ff3232"
            stroke-width="2"
            fill="none"
          />
          <path
            d="M 400 230 L 400 320 L 300 320"
            stroke="#4169e1"
            stroke-width="2"
            fill="none"
          />
        </g>

        <!-- Graft Zone -->
        <g class="graft-zone" transform="translate(600, 200)">
          <circle
            r="50"
            fill="none"
            stroke="rgba(0, 255, 200, 0.3)"
            stroke-dasharray="4,4"
          />
          <text
            y="-60"
            text-anchor="middle"
            fill="#00ffc8"
            font-size="10"
            letter-spacing="2"
          >
            GRAFT_POINT_01
          </text>

          <!-- The Grafted Entity (Ghost or Representation) -->
          <g v-if="active" class="grafted-entity">
            <path
              d="M -20,-20 L 20,20 M -20,20 L 20,-20"
              :stroke="color"
              stroke-width="2"
            />
            <circle :r="10 + pulse * 2" :fill="color" opacity="0.4" />
          </g>
        </g>

        <!-- Blood flow particles (animated) -->
        <circle v-for="i in 5" :key="'p' + i" r="2" fill="#ff3232">
          <animateMotion
            :dur="1.5 + i * 0.2 + 's'"
            repeatCount="indefinite"
            path="M 430 200 L 600 200"
          />
        </circle>
      </svg>
    </div>

    <div class="view-footer">
      <div class="simulation-data">
        <span>Flow: {{ flowRate }} L/min</span>
        <span>|</span>
        <span>Sync: {{ syncLevel }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  strap: Object,
  color: {
    type: String,
    default: "#00ffc8",
  },
  active: Boolean,
});

const pulse = ref(0);
const flowRate = ref(5.2);
const syncLevel = ref(92);
let animationId = null;

onMounted(() => {
  const animate = (time) => {
    pulse.value = Math.sin(time / 200) * 0.5 + 0.5;
    animationId = requestAnimationFrame(animate);
  };
  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
});
</script>

<style scoped>
.lifestrap-grafting-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(10, 10, 20, 0.6);
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
  color: #4169e1;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.status-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  background: rgba(65, 105, 225, 0.1);
  color: #4169e1;
  border-radius: 10px;
  border: 1px solid rgba(65, 105, 225, 0.3);
}

.grafting-stage {
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.graft-svg {
  width: 100%;
  height: 100%;
  max-height: 100%;
}

.vessel-path {
  filter: blur(1px);
}

.heart-node {
  filter: drop-shadow(0 0 10px rgba(255, 50, 50, 0.5));
}

.view-footer {
  padding: 8px 15px;
  background: rgba(0, 0, 0, 0.3);
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.simulation-data {
  display: flex;
  gap: 15px;
}

.grafted-entity {
  filter: drop-shadow(0 0 8px currentColor);
}
</style>
