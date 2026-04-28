<template>
  <!--<div class="heli-wrapper">-->
  <div
    class="heli-clock-wrapper"
    :class="{ 'is-mini': mini }"
    @click="handleClockClick"
  >
    <transition name="heli-zoom">
      <div v-if="isCalibrated === false" class="heli-main-layout">
        <div class="calibration-card">
          <button
            class="init-button"
            :disabled="tempSignature === false"
            @click="setClock()"
          >
            SET CLOCK
          </button>
        </div>
      </div>
    </transition>

    <transition>
      <div id="mini-heli" v-if="isCalibrated === true" class="heli-main-layout">
        <section class="clock-display">
          <div class="orbital-grid">
            <!-- heli clock svg -->
            <svg viewBox="0 0 100 100" class="heli-svg">
              <defs>
                <filter id="sunGlow">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
                </filter>
                <radialGradient id="skyGradient" cx="50%" cy="50%" r="50%">
                  <stop
                    offset="0%"
                    :stop-color="isDaylight ? '#fbbf24' : '#6366f1'"
                    stop-opacity="0.1"
                  />
                  <stop
                    offset="100%"
                    :stop-color="isDaylight ? '#fbbf24' : '#0f172a'"
                    stop-opacity="0"
                  />
                </radialGradient>
              </defs>

              <circle cx="50" cy="50" r="48" fill="url(#skyGradient)" />

              <path
                :d="describeArc(50, 50, 48, 90, 270)"
                fill="#cbd5e1"
                fill-opacity="0.25"
              />

              <g class="day-ticks" stroke="#cbd5e1" stroke-width="0.3">
                <line
                  v-for="n in 72"
                  :key="n"
                  x1="50"
                  y1="6"
                  x2="50"
                  y2="9"
                  :transform="`rotate(${n * 5}, 50, 50)`"
                  :opacity="n * 5 <= displayYearly ? 1 : 0.2"
                />
              </g>

              <g
                v-if="storedSignature?.birthorbital !== undefined"
                :transform="`rotate(${storedSignature.birthorbital}, 50, 50)`"
              >
                <line
                  x1="50"
                  y1="6"
                  x2="50"
                  y2="14"
                  stroke="#f59e0b"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <circle cx="50" cy="6" r="2" fill="#f59e0b" />
                <text
                  y="3"
                  x="50"
                  font-size="2.8"
                  font-weight="900"
                  text-anchor="middle"
                  fill="#f59e0b"
                  style="text-transform: uppercase"
                >
                  Genesis
                </text>
              </g>

              <g class="rings">
                <circle cx="50" cy="50" r="44" class="track-bg" />
                <path
                  :d="describeArc(50, 50, 44, 0, displayYearly)"
                  class="wedge-year"
                />

                <g :transform="`rotate(${displayYearly}, 50, 50)`">
                  <circle
                    cx="50"
                    cy="6"
                    r="2.5"
                    fill="white"
                    stroke="#3b82f6"
                    stroke-width="1.2"
                  />
                </g>

                <circle cx="50" cy="50" r="36" class="track-bg" />

                <path
                  :d="describeArc(50, 50, 36, 180, (displayDaily + 180) % 360)"
                  class="wedge-day"
                />

                <path
                  :d="describeArc(50, 50, 36, (displayDaily + 180) % 360, 540)"
                  class="ghost-track"
                  fill="none"
                  stroke="#fbbf24"
                  stroke-width="1.5"
                  stroke-dasharray="1, 3"
                  opacity="0.4"
                />
              </g>
            </svg>

            <!-- inner info -->
            <div class="sun-readout-overlay">
              <div class="cycles-whole">{{ activeCycles?.whole || 0 }}</div>
              <div class="cycles-decimal">
                .{{ activeCycles?.fraction || "000000" }}
              </div>
              <div class="cycles-label">EARTH ORBITS</div>
            </div>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { diaryStore } from "@/stores/diaryStore.js";
import { useOrbitStore } from "@/stores/orbitStore.js";

const storeDiary = diaryStore();
const storeOrbit = useOrbitStore();

const emit = defineEmits(["expand", "select"]);

defineProps({
  mini: { type: Boolean, default: false },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
});

let clickCount = 0;
let clickTimer = null;
const isProjecting = ref(false);

onMounted(() => {});

/* computed */
const isCalibrated = computed(() => {
  return storeDiary.heliClockSet;
});
const currentDegree = computed(() => storeDiary.heliSignature.daily);
const tempSignature = computed(() => storeDiary.tempSignature);

const activeCycles = computed(() => {
  const total = storeDiary.heliSignature.age;
  return total;
  /*return {
    orbits: Math.floor(total),
    decimal: (total % 1).toFixed(6).split('.')[1]
  };*/
});

// --- Daily Cycle Logic ---
const storedSignature = computed(() => storeDiary.orbitSignature);
const displayDaily = computed(
  () =>
    (isProjecting.value
      ? storeDiary.projectionData?.daily
      : storeDiary.heliSignature.daily) || 0
);
const displayYearly = computed(
  () =>
    (isProjecting.value
      ? storeDiary.projectionData?.yearly
      : storeDiary.heliSignature.yearly) || 0
);
const isDaylight = computed(() => {
  const deg = (displayDaily.value + 180) % 360;
  return deg > 270 || deg < 90;
});

/* methods */
const setClock = () => {
  storeOrbit.expandedHeliClock = true;
};

const handleClockClick = () => {
  if (storeOrbit.expandedHeliClock) return;
  clickCount++;
  if (clickCount === 1) {
    clickTimer = setTimeout(() => {
      if (clickCount === 1) {
        // --- SINGLE CLICK ACTION ---
        emit("select");
      }
      clickCount = 0;
    }, 250); // The "window" for the second click
  } else if (clickCount === 2) {
    // --- DOUBLE CLICK ACTION ---
    clearTimeout(clickTimer);
    clickCount = 0;
    emit("expand");
  }
};

const describeArc = (x, y, r, start, end) => {
  const rad = (deg) => ((deg - 90) * Math.PI) / 180.0;
  const s = { x: x + r * Math.cos(rad(end)), y: y + r * Math.sin(rad(end)) };
  const e = {
    x: x + r * Math.cos(rad(start)),
    y: y + r * Math.sin(rad(start)),
  };
  const largeArc = (end - start + 360) % 360 <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
};
</script>

<style scoped>
.heli-clock-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.heli-clock-wrapper.is-mini {
  width: 160px;
  height: 160px;
}

.is-mini .heli-main-layout {
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  grid-template-areas: "center";
  gap: 0;
}

.is-mini .orbital-grid {
  width: 140px;
  height: 140px;
}

.is-mini .sun-readout-overlay {
  transform: translate(-50%, -44%) scale(0.35);
}

.is-mini .heli-main-layout,
.is-mini .orbital-grid,
.is-mini .heli-svg,
.is-mini .sun-readout-overlay,
.is-mini .cycles-whole,
.is-mini .cycles-decimal,
.is-mini .cycles-label,
.is-mini .degree-sub {
  /* Allow events to bubble to the wrapper */
  pointer-events: none;
}

.heli-clock-wrapper {
  pointer-events: auto;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Layout */
.heli-main-layout {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.clock-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.orbital-grid {
  position: relative;
  width: 100%;
  max-width: 550px;
}
.heli-svg {
  width: 100%;
  overflow: visible;
}

/* Rings & Wedges */
.track-bg {
  fill: none;
  stroke: #f1f5f9;
  stroke-width: 4;
}
.wedge-year {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}
.wedge-day {
  fill: none;
  stroke: #fbbf24;
  stroke-width: 6;
  stroke-linecap: round;
}

/* Typography */
.sun-readout-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -44%);
  text-align: center;
  pointer-events: none;
}
.cycles-whole {
  font-size: 1.9rem;
  font-weight: 900;
  line-height: 0.7;
  color: #1e293b;
  letter-spacing: -5px;
}
.cycles-decimal {
  font-size: 0.8rem;
  font-weight: 700;
  color: #cbd5e1;
  font-family: "Space Mono", monospace;
  margin-top: 0.5rem;
}

.cycles-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 4px;
  text-align: center;
  margin: 1rem 0 0.5rem;
}

.degree-sub {
  font-size: 1.1rem;
  font-family: "Space Mono", monospace;
  font-weight: 600;
  color: #64748b;
  text-align: center;
}

/* Calibration */
.calibration-card {
  display: grid;
  gap: 1.5rem;
  padding: 3rem;
  background: white;
  border-radius: 40px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}
.init-button {
  background: #0f172a;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}

@media (max-width: 1000px) {
  .heli-main-layout {
    grid-template-columns: 1fr;
  }
}
</style>
