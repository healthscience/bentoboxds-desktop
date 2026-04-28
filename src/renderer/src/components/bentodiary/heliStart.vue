<template>
  <!--<div class="heli-wrapper">-->
  <div class="heli-wrapper">
    <transition name="heli-zoom">
      <div v-if="!isCalibrated" class="heli-modal-overlay">
        <div class="calibration-card">
          <header class="modal-header">
            <div class="orb-icon"></div>
            <h2>Heli Initialization1</h2>
            <p>Sync your physical origin with the solar orbit.</p>
          </header>
          <div class="form-grid">
            <div class="input-group">
              <label>Old World Birth Date</label>
              <input type="date" v-model="birthDate" @input="updatePreview" />
            </div>
            <div class="input-group">
              <label>Arrival Time (UTC)</label>
              <input type="time" v-model="birthTime" @input="updatePreview" />
            </div>
          </div>
          <button class="init-button" :disabled="tempSignature === false" @click="lockSignature">
            ENTER THE ORBIT
          </button>
        </div>
      </div>
    </transition>

    <div v-if="isCalibrated" class="heli-main-layout">
      
      <aside class="heli-legend-left">
        <div class="legend-item">
          <span class="degree-mark">0°</span>
          <div class="legend-text"><strong>Vernal Origin</strong><p>Spring Equinox reset.</p></div>
        </div>
        <div class="legend-item">
          <span class="degree-mark">90°</span>
          <div class="legend-text"><strong>Estival Peak</strong><p>Summer Solstice.</p></div>
        </div>
        <div class="legend-item">
          <div class="icon-container"><div class="signature-needle-key"></div><div class="signature-ring-key"></div></div>
          <div class="legend-text"><strong>Your Signature</strong><p>Arrival: {{ storedSignature.toFixed(4) }}°</p></div>
        </div>
      </aside>

      <section class="clock-display">
        <div class="orbital-grid">
          <svg viewBox="0 0 100 100" class="heli-svg">
            <circle cx="50" cy="50" r="42" class="track-bg" />
            <path :d="describeArc(50, 50, 42, 0, currentDegree)" class="progress-path" />
            <g :transform="`rotate(${storedSignature} 50 50)`">
              <line x1="50" y1="4" x2="50" y2="14" class="signature-needle" />
              <circle cx="50" cy="8" r="3.5" class="signature-ring-target" />
            </g>
            <g :transform="`rotate(${currentDegree} 50 50)`">
              <circle cx="50" cy="8" r="4" class="current-glow" />
              <circle cx="50" cy="8" r="2.2" class="current-dot-core" />
            </g>
          </svg>

          <div class="sun-core">
            <div class="cycles-whole">{{ precisionCycles.whole }}</div>
            <div class="cycles-decimal">.{{ precisionCycles.decimal }}</div>
            <div class="cycles-label">EARTH ORBITS</div>
            <div class="degree-sub">{{ currentDegree.toFixed(4) }}°</div>
          </div>
        </div>
        <button class="recalibrate-trigger" @click="resetCalibration">Adjust Origin</button>
      </section>

      <aside class="heli-legend-right">
        <div class="legend-item">
          <span class="degree-mark">180°</span>
          <div class="legend-text"><strong>Autumnal Pivot</strong><p>Fall Equinox.</p></div>
        </div>
        <div class="legend-item">
          <span class="degree-mark">270°</span>
          <div class="legend-text"><strong>Hibernal Rest</strong><p>Winter Solstice.</p></div>
        </div>
        <div class="legend-item">
          <div class="icon-container"><div class="current-dot-key"></div></div>
          <div class="legend-text"><strong>Current Orbit</strong><p>Real-time solar progress.</p></div>
        </div>
      </aside>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { diaryStore } from '@/stores/diaryStore.js';

const store = diaryStore();

defineProps({
  mini: { type: Boolean, default: false },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 }
});

const isCalibrated = ref(false);
const birthDate = ref('');
const birthTime = ref('12:00');
const storedSignature = ref(0);
const birthTimestamp = ref(0);
const nowTs = ref(Date.now());

onMounted(() => {
  const savedSig = localStorage.getItem('heli_sig_v2');
  const savedTs = localStorage.getItem('heli_birth_ts');
  if (savedSig && savedTs) {
    storedSignature.value = parseFloat(savedSig);
    birthTimestamp.value = parseInt(savedTs);
    isCalibrated.value = true;
  }
});

/* computed */
const currentDegree = computed(() => store.currentVector);
const tempSignature = computed(() => store.tempSignature);

const precisionCycles = computed(() => {
  if (!birthTimestamp.value) return { whole: '0', decimal: '0000' };
  const msInYear = 31556925216; // Tropical Year
  const total = (Date.now() - birthTimestamp.value) / msInYear;
  
  return {
    whole: Math.floor(total).toString(),
    decimal: (total % 1).toFixed(6).split('.')[1] // 6 decimals for smooth visual "ticking"
  };
});

/* methods */
const handleClockClick = () => {
  console.log('click');
  clickCount++;
  
  if (clickCount === 1) {
    clickTimer = setTimeout(() => {
      if (clickCount === 1) {
        // --- SINGLE CLICK ACTION ---
        emit('select'); 
      }
      clickCount = 0;
    }, 250); // The "window" for the second click
  } else if (clickCount === 2) {
    // --- DOUBLE CLICK ACTION ---
    clearTimeout(clickTimer);
    console.log('double click');
    clickCount = 0;
    emit('expand');
  }
};

const updatePreview = () => {
  if (!birthDate.value) return;
  const ts = new Date(`${birthDate.value}T${birthTime.value}:00Z`).getTime();
  // Request signature from HOP
  store.sendMessageHOP({
    type: 'heli-calculate',
    timestamp: ts,
    action: 'get-signature'
  });
};

const lockSignature = () => {
  console.log('locking signature');
  const ts = new Date(`${birthDate.value}T${birthTime.value}:00Z`).getTime();
  // We assume the preview updated tempSignature via a socket response or we calculate locally if simple
  // For now, let's assume we need to wait for HOP or use a simplified local calc if allowed.
  // The user said "message calls to HOP made".
  storedSignature.value = tempSignature.value || 0; 
  birthTimestamp.value = ts;
  localStorage.setItem('heli_sig_v2', storedSignature.value.toString());
  localStorage.setItem('heli_birth_ts', ts.toString());
  isCalibrated.value = true;
};

const resetCalibration = () => {
  isCalibrated.value = false;
  localStorage.removeItem('heli_sig_v2');
  localStorage.removeItem('heli_birth_ts');
};

const polarToCartesian = (cx, cy, r, deg) => {
  const rad = (deg - 90) * Math.PI / 180.0;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (x, y, r, start, end) => {
  const s = polarToCartesian(x, y, r, end);
  const e = polarToCartesian(x, y, r, start);
  const largeArc = (end - start + 360) % 360 <= 180 ? "0" : "1";
  return ["M", s.x, s.y, "A", r, r, 0, largeArc, 0, e.x, e.y].join(" ");
};
</script>

<style scoped>
/* GRID WRAPPER */
.heli-wrapper {
  display: grid;
  place-items: center;
  min-height: 50vh;
  background: #fdfdfd;
  font-family: 'Inter', sans-serif;
}

/* MODAL & DASHBOARD LAYOUT (Grid Only) */
.heli-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  display: grid; place-items: center; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); z-index: 999;
}
.calibration-card { display: grid; gap: 1.5rem; padding: 3rem; background: white; border-radius: 40px; box-shadow: 0 40px 100px rgba(0,0,0,0.1); width: 400px; text-align: center; }

.heli-main-layout {
  display: grid;
  grid-template-columns: 260px minmax(400px, 1fr) 260px;
  grid-template-areas: "left center right";
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.heli-legend-left { grid-area: left; display: grid; gap: 2rem; padding-left: 2rem; }
.heli-legend-right { grid-area: right; display: grid; gap: 2rem; padding-right: 2rem; }

.clock-display { grid-area: center; display: grid; place-items: center; }

.orbital-grid {
  display: grid;
  grid-template-areas: "stack";
  place-items: center;
  width: 420px;
  height: 420px;
}

.heli-svg { grid-area: stack; width: 100%; height: 100%; overflow: visible; }

/* PRECISION SUN CORE GRID */
.sun-core {
  grid-area: stack;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto auto;
  align-items: end;
  justify-content: center;
  pointer-events: none;
}

.cycles-whole {
  grid-column: 1;
  font-size: 6rem;
  font-weight: 900;
  line-height: 0.8;
  color: #0f172a;
}

.cycles-decimal {
  grid-column: 2;
  font-size: 1.5rem;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  color: #3b82f6;
  padding-bottom: 0.8rem;
  padding-left: 4px;
}

.cycles-label {
  grid-column: 1 / span 2;
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 4px;
  text-align: center;
  margin: 1rem 0 0.5rem;
}

.degree-sub {
  grid-column: 1 / span 2;
  font-size: 1.1rem;
  font-family: 'Space Mono', monospace;
  font-weight: 600;
  color: #64748b;
  text-align: center;
}

/* VISUAL ELEMENTS (Icons, Marks, Markers) */
.legend-item { display: grid; grid-template-columns: 60px 1fr; gap: 1rem; }
.degree-mark { display: grid; place-items: center; background: #eff6ff; color: #3b82f6; font-family: 'Space Mono'; padding: 4px; border-radius: 6px; font-size: 0.8rem; }
.legend-text strong { font-size: 0.8rem; text-transform: uppercase; }
.legend-text p { font-size: 0.7rem; color: #64748b; }

.icon-container { display: grid; place-items: center; position: relative; height: 32px; }
.signature-needle-key { width: 3px; height: 14px; background: #f59e0b; border-radius: 2px; }
.signature-ring-key { position: absolute; width: 20px; height: 20px; border: 1.5px dashed #f59e0b; border-radius: 50%; }
.current-dot-key { width: 12px; height: 12px; background: white; border: 2px solid #fbce1e; border-radius: 50%; box-shadow: 0 0 10px #fbce1e; }

.track-bg { fill: none; stroke: #f1f5f9; stroke-width: 2; }
.cell-passed { stroke: #4facfe; stroke-width: 2; fill: none; }
.cell-future { stroke: #e1e8ed; stroke-width: 2; fill: none; }
.progress-path { fill: none; stroke: #3b82f6; stroke-width: 4; stroke-linecap: round; }
.signature-needle { stroke: #f59e0b; stroke-width: 2; }
.signature-ring-target { fill: none; stroke: #f59e0b; stroke-width: 1; stroke-dasharray: 1, 2; }
.current-dot-core { fill: white; stroke: #fbce1e; stroke-width: 2; }
.current-glow { fill: #fbce1e; fill-opacity: 0.3; filter: blur(4px); }

.init-button { background: #0f172a; color: white; border: none; padding: 1rem; border-radius: 12px; font-weight: 800; }
.recalibrate-trigger { background: none; border: none; color: #cbd5e1; text-decoration: underline; margin-top: 2rem; cursor: pointer; }

@media (max-width: 1000px) {
  .heli-main-layout { grid-template-columns: 1fr; grid-template-areas: "center" "left" "right"; }
}
</style>