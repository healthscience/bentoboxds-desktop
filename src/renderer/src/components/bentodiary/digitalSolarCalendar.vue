<template>
  <div class="heli-container">
    <div class="orbital-grid">
      
      <svg viewBox="0 0 100 100" class="layer progress-ring-svg">
        <path 
          v-for="day in 365" 
          :key="day"
          :d="describeArc(50, 50, 42, (day-1) * 0.986, day * 0.986)"
          :class="{
            'cell-passed': (day * 0.986) <= currentDegree,
            'cell-future': (day * 0.986) > currentDegree,
            'cell-birth': isBirthCell(day)
          }"
        />
      </svg>

      <div class="layer markers-container">
        <div class="marker birth-signature" :style="birthMarkerStyle"></div>
        <div class="marker current-position" :style="currentMarkerStyle"></div>
      </div>
      
      <div class="center-sun">
        <span class="degree-text">{{ currentDegree.toFixed(2) }}°</span>
        <span class="label">ORBIT</span>
      </div>
    </div>

    <div class="solar-stats">
      <h3>Solar Age: {{ solarAge.toFixed(6) }}</h3>
      <p>{{ (lightPotential * 100).toFixed(1) }}% Light Potential</p>
      <p class="status">{{ isClimbing ? '↑ Ascending' : '↓ Descending' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  birthDate: { type: String, default: '1973-06-16' },
  birthDegree: { type: Number, default: 85.3 }
});

const now = ref(new Date());
let timer = null;

// --- MATH UTILITIES (Declared as const to expose to template) ---

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
};

const isBirthCell = (day) => {
  const cellStart = (day - 1) * 0.986;
  const cellEnd = day * 0.986;
  return props.birthDegree >= cellStart && props.birthDegree < cellEnd;
};

// --- CORE CALCULATIONS ---

const calculateSolarDegree = (date) => {
  const startOfYear = new Date(date.getFullYear(), 2, 20); 
  const diffInMs = date - startOfYear;
  const daysSinceEquinox = diffInMs / (1000 * 60 * 60 * 24);
  let degree = (daysSinceEquinox * 0.985602) % 360;
  return degree < 0 ? degree + 360 : degree;
};

const currentDegree = computed(() => calculateSolarDegree(now.value));

const solarAge = computed(() => {
  const birth = new Date(props.birthDate);
  const totalYears = now.value.getFullYear() - birth.getFullYear();
  const degreeDiff = (currentDegree.value - props.birthDegree) / 360;
  return totalYears + degreeDiff;
});

const lightPotential = computed(() => {
  return (Math.sin((currentDegree.value) * (Math.PI / 180)) + 1) / 2;
});

const isClimbing = computed(() => {
  return currentDegree.value > 270 || currentDegree.value < 90;
});

// --- DYNAMIC STYLES ---

const currentMarkerStyle = computed(() => ({
  transform: `rotate(${currentDegree.value}deg) translateY(-140px)`
}));

const birthMarkerStyle = computed(() => ({
  transform: `rotate(${props.birthDegree}deg) translateY(-140px)`,
  border: '2px dashed #ffd700'
}));

onMounted(() => {
  timer = setInterval(() => { now.value = new Date(); }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.heli-container {
  display: grid;
  grid-template-rows: auto auto;
  gap: 24px;
  justify-items: center;
  padding: 40px;
  background: #fdfdfd;
  border-radius: 32px;
  color: #2c3e50;
  width: fit-content;
}

.orbital-grid {
  display: grid;
  grid-template-areas: "content";
  place-items: center;
  width: 340px;
  height: 340px;
  background: radial-gradient(circle, #ffffff 0%, #f4f7f9 100%);
  border-radius: 50%;
  border: 1px solid #e1e8ed;
}

.layer {
  grid-area: content;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.progress-ring-svg {
  z-index: 1;
}

.markers-container {
  z-index: 2;
  position: relative;
}

.center-sun {
  grid-area: content;
  z-index: 3;
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  border: 2px solid #f1f1f1;
  display: grid;
  place-content: center;
  text-align: center;
}

path {
  fill: none;
  stroke-width: 5;
  transition: stroke 0.4s ease;
}

.cell-passed {
  stroke: #4facfe;
  stroke-opacity: 0.7;
}

.cell-future {
  stroke: #e1e8ed;
}

.cell-birth {
  stroke: #ffd700 !important;
  stroke-width: 8;
}

.marker {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  margin-top: -6px;
  border-radius: 50%;
}

.current-position {
  background: #ffeb3b;
  box-shadow: 0 0 15px #fbc02d;
}

.degree-text {
  font-size: 1.4rem;
  font-weight: 800;
  color: #2c3e50;
}

.label {
  font-size: 0.7rem;
  letter-spacing: 2px;
  opacity: 0.6;
}

.solar-stats {
  display: grid;
  gap: 8px;
  text-align: center;
}

.status {
  font-weight: 700;
  color: #4facfe;
}
</style>