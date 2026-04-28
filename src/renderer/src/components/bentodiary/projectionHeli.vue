<template>
  <div class="heli-wrapper">
    <transition name="heli-zoom">
      <div v-if="!isCalibrated" class="heli-modal-overlay">
        <div class="calibration-card">
          <header class="modal-header">
            <div class="orb-icon"></div>
            <h2>Heli Initialization2</h2>
            <p>Sync your origin with the solar orbit.</p>
          </header>
          <div class="form-grid">
            <div class="input-group">
              <label>Arrival Date</label>
              <input type="date" v-model="birthDate" @input="updatePreview" />
            </div>
            <div class="input-group">
              <label>Arrival Time (UTC)</label>
              <input type="time" v-model="birthTime" @input="updatePreview" />
            </div>
          </div>
          <button class="init-button" :disabled="tempSignature === null" @click="lockSignature">
            ENTER THE ORBIT
          </button>
        </div>
      </div>
    </transition>

    <div v-if="isCalibrated" class="heli-main-layout">
      
      <aside class="heli-sidebar">
        <div class="bento-card">
          <header class="card-header">Navigator</header>
          <div class="nav-group">
            <label>Solar Day Stepper</label>
            <div class="stepper">
              <button @click="adjustProjection(-1)">-</button>
              <input type="number" :value="daySeeker" @input="e => handleManualInput(e.target.value)" />
              <button @click="adjustProjection(1)">+</button>
            </div>
          </div>
          <div class="bundle-row">
            <button @click="adjustProjection(10)" class="bundle-btn">+10d</button>
            <button @click="adjustProjection(30)" class="bundle-btn">+30d</button>
          </div>
          <div class="status-zone">
            <span :class="['status-tag', { active: isProjecting }]">
              {{ isProjecting ? `PROJECTING +${daySeeker}d` : 'LIVE SYNC' }}
            </span>
          </div>
        </div>

        <div class="bento-card manifest-area" v-if="committedEvents.length > 0">
          <label class="card-header">Active Manifest</label>
          <div class="manifest-scroll">
            <div v-for="e in committedEvents" :key="e.id" class="manifest-item" @click="jumpToEvent(e)">
              <div class="manifest-info">
                <strong>{{ e.label }}</strong>
                <small>{{ new Date(e.ts).toLocaleDateString() }}</small>
              </div>
              <span class="mini-degree">{{ e.dailyDegree.toFixed(0) }}°</span>
            </div>
          </div>
        </div>
      </aside>

      <section class="clock-display">
        <div class="orbital-grid">
          <svg viewBox="0 0 100 100" class="heli-svg">
            <circle cx="50" cy="50" r="30" class="atmosphere-glow" :style="{ opacity: lightIntensity / 100 }" />

            <circle cx="50" cy="50" r="46" class="track-line track-outer" />
            <circle cx="50" cy="50" r="36" class="track-line track-inner" />
            
            <path :d="describeArc(50, 50, 46, 0, currentYearlyDegree)" class="arc-yearly" />
            <path 
              v-for="day in 365" 
              :key="day"
              :d="describeArc(50, 50, 46, (day-1) * 0.9863, day * 0.9863)"
              :class="day * 0.9863 <= currentYearlyDegree ? 'cell-passed' : 'cell-future'"
            />

            <path 
              v-if="projectionActive"
              d="M 12 -33 A 35 35 0 0 1 25 -24" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.05)" 
              stroke-width="4" 
              stroke-dasharray="2 2"
            />

            <g :transform="`rotate(${storedSignature}, 50, 50)`">
              <line x1="50" y1="4" x2="50" y2="14" class="tether-birth" />
              <circle cx="50" cy="4" r="3" class="birth-outer-orb" />
              <rect x="49.2" y="2" width="1.6" height="8" class="birth-needle" rx="0.8" />
            </g>

            <g v-for="e in committedEvents" :key="e.id">
              <line 
                :x1="getRadialX(50, 46, e.yearlyDegree)" 
                :y1="getRadialY(50, 46, e.yearlyDegree)"
                :x2="getRadialX(50, 36, e.dailyDegree)" 
                :y2="getRadialY(50, 36, e.dailyDegree)" 
                class="tether-event-bridge" 
              />
              <g :transform="`rotate(${e.yearlyDegree}, 50, 50)`">
                <circle cx="50" cy="4" r="2" class="event-yearly-ghost" />
              </g>
              <g :transform="`rotate(${e.dailyDegree}, 50, 50)`">
                <circle cx="50" cy="14" r="2.8" class="event-ghost" />
              </g>
            </g>

            <line 
              :x1="getRadialX(50, 46, projectionTargetYearly)" 
              :y1="getRadialY(50, 46, projectionTargetYearly)"
              :x2="getRadialX(50, 36, activeDailyDegree)" 
              :y2="getRadialY(50, 36, activeDailyDegree)" 
              class="tether-bridge" 
            />

            <g v-if="projectionActive" class="projection-layer">
              <path 
                :d="projectionArcPath" 
                fill="none" 
                stroke="rgba(64, 224, 255, 0.4)" 
                stroke-width="3" 
                stroke-dasharray="2 2"
                filter="blur(1px)"
              />
              
              <text 
                v-bind="polarToCartesian(projectionStartAngle - 5)"
                font-size="2" 
                fill="rgba(255,255,255,0.3)"
                text-anchor="end"
              >
                PROJECTION: MORNING FLOW
              </text>
            </g>

            <g :transform="`rotate(${projectionTargetYearly}, 50, 50)`">
              <line x1="50" y1="2" x2="50" y2="6" class="sun-whisper-line" />
              <circle cx="50" cy="4" r="3.5" class="sun-outer-marker" />
            </g>
            <g :transform="`rotate(${currentYearlyDegree}, 50, 50)`">
              <circle cx="50" cy="4" r="4" class="sun-glow" />
              <circle cx="50" cy="4" r="2.2" class="sun-core" />
            </g>
            <g :transform="`rotate(${activeDailyDegree}, 50, 50)`">
              <circle cx="50" cy="14" r="5" :class="['sun-glow', { colliding: hasCollision }]" />
              <circle cx="50" cy="14" r="2.2" class="sun-core" />
            </g>
          </svg>

          <div class="sun-readout">
            <div class="cycles-whole">{{ activeCycles.whole }}</div>
            <div class="cycles-decimal">.{{ activeCycles.decimal }}</div>
            <div class="date-label">{{ projectedDateString }}</div>
          </div>
        </div>
      </section>

      <aside class="heli-sidebar">
        <div class="bento-card scheduler" v-if="isProjecting">
          <header class="card-header">Commit Anchor</header>
          <div class="input-group">
            <label>Event Name</label>
            <input type="text" v-model="newEventLabel" placeholder="Solar Sync..." />
          </div>
          <div class="input-group">
            <label>Peer Sync</label>
            <select @change="e => selectedPeerId = e.target.value" :value="selectedPeerId">
              <option value="">Private Orbit</option>
              <option v-for="p in knownPeers" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
          <div v-if="hasCollision" class="collision-alert">RESONANCE COLLISION</div>
          <button class="primary-btn" :disabled="hasCollision" @click="confirmEvent">LOCK ANCHOR</button>
          <button class="secondary-btn" @click="resetToNow">COLLAPSE TO PRESENT</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { diaryStore } from '@/stores/diaryStore.js';

const store = diaryStore();

const isCalibrated = ref(false);
const isProjecting = ref(false);
const daySeeker = ref(0);
const birthDate = ref('');
const birthTime = ref('12:00');
const tempSignature = computed(() => store.tempSignature);
const storedSignature = ref(0);
const birthTimestamp = ref(0);
  // This toggle controls whether the "Future Ghost Arcs" are visible
const projectionActive = ref(true);


// Define the window for tomorrow's swim (e.g., 08:00 to 09:30)
const projectionStartAngle = 120; // Degrees
const projectionEndAngle = 150;   // Degrees
const radius = 36;                // Outer Ring

const polarToCartesian = (angle) => {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad)
  };
};

const projectionArcPath = computed(() => {
  const start = polarToCartesian(projectionStartAngle);
  const end = polarToCartesian(projectionEndAngle);
  
  // SVG Arc command: Move to start, then draw arc to end
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
});





const currentYearlyDegree = computed(() => store.currentVector);
const currentDailyDegree = computed(() => (store.currentVector * 365.24) % 360);

const nowTs = ref(Date.now());
const projectedTs = ref(Date.now());

const projectionTargetYearly = computed(() => store.projectionData.yearly);
const projectionTargetDaily = computed(() => store.projectionData.daily);

const committedEvents = ref([]);
const newEventLabel = ref('');
const selectedPeerId = ref("");
const knownPeers = [{ id: 'dc_peer', name: 'Aris (DC)' }];

const getRadialX = (cx, r, deg) => cx + r * Math.sin(deg * Math.PI / 180);
const getRadialY = (cy, r, deg) => cy - r * Math.cos(deg * Math.PI / 180);

const activeDailyDegree = computed(() => isProjecting.value ? projectionTargetDaily.value : currentDailyDegree.value);

const hasCollision = computed(() => {
  if (!isProjecting.value) return false;
  return committedEvents.value.some(e => Math.abs(e.dailyDegree - projectionTargetDaily.value) < 2.5);
});

const syncFromDays = () => {
  isProjecting.value = daySeeker.value !== 0;
  projectedTs.value = Date.now() + (daySeeker.value * 86400000);
  
  store.sendMessageHOP({
    type: 'heli-project',
    timestamp: projectedTs.value
  });
};

const handleManualInput = (val) => {
  daySeeker.value = parseInt(val) || 0;
  syncFromDays();
};

const adjustProjection = (days) => { daySeeker.value += days; syncFromDays(); };

const confirmEvent = () => {
  if (hasCollision.value) return;
  // Capture BOTH yearly and daily positions for the archive
  committedEvents.value.push({ 
    id: Date.now(), 
    dailyDegree: projectionTargetDaily.value, 
    yearlyDegree: projectionTargetYearly.value,
    label: newEventLabel.value || 'Sync Anchor', 
    ts: projectedTs.value 
  });
  resetToNow();
};

const resetToNow = () => { isProjecting.value = false; daySeeker.value = 0; newEventLabel.value = ''; selectedPeerId.value = ''; };

const jumpToEvent = (e) => {
  isProjecting.value = true;
  projectedTs.value = e.ts;
  store.setProjectionData({ yearly: e.yearlyDegree, daily: e.dailyDegree });
  daySeeker.value = Math.round((e.ts - Date.now()) / 86400000);
};

const lightIntensity = computed(() => {
  const diff = Math.abs(180 - activeDailyDegree.value);
  return Math.max(0, 100 - (diff * 0.75));
});

const activeCycles = computed(() => {
  const msInYear = 31556925216;
  const target = isProjecting.value ? projectedTs.value : nowTs.value;
  const total = (target - birthTimestamp.value) / msInYear;
  return { whole: Math.floor(total), decimal: (total % 1).toFixed(6).split('.')[1] || '000000' };
});

const projectedDateString = computed(() => new Date(projectedTs.value).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));

onMounted(() => {
  const sig = localStorage.getItem('heli_sig_v9');
  const ts = localStorage.getItem('heli_ts_v9');
  if (sig && ts) {
    storedSignature.value = parseFloat(sig);
    birthTimestamp.value = parseInt(ts);
    isCalibrated.value = true;
  }
});

const updatePreview = () => {
  if (!birthDate.value) return;
  const ts = new Date(`${birthDate.value}T${birthTime.value}:00Z`).getTime();
  store.sendMessageHOP({
    type: 'heli-calculate',
    timestamp: ts,
    action: 'get-signature'
  });
};

const lockSignature = () => {
  console.log('locking signature2')
  const ts = new Date(`${birthDate.value}T${birthTime.value}:00Z`).getTime();
  storedSignature.value = tempSignature.value || 0;
  birthTimestamp.value = ts;
  localStorage.setItem('heli_sig_v9', storedSignature.value.toString());
  localStorage.setItem('heli_ts_v9', ts.toString());
  isCalibrated.value = true;
};

const describeArc = (x, y, r, start, end) => {
  const rad = (deg) => (deg - 90) * Math.PI / 180.0;
  const s = { x: x + r * Math.cos(rad(end)), y: y + r * Math.sin(rad(end)) };
  const e = { x: x + r * Math.cos(rad(start)), y: y + r * Math.sin(rad(start)) };
  const largeArc = (end - start + 360) % 360 <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
};
</script>

<style scoped>
.heli-wrapper { display: grid; place-items: center; min-height: 100vh; background: #fafafa; font-family: 'Inter', sans-serif; color: #1e293b; }
.heli-main-layout { display: grid; grid-template-columns: 320px 1fr 320px; gap: 2rem; width: 100%; max-width: 1400px; padding: 2rem; align-items: center; }
.bento-card { background: white; padding: 1.5rem; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
.card-header { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 1rem; }

.orbital-grid { display: grid; grid-template-areas: "stack"; place-items: center; width: 480px; height: 480px; }
.heli-svg { grid-area: stack; width: 100%; height: 100%; overflow: visible; }

.track-line { fill: none; stroke: #f1f5f9; }
.track-outer { stroke-width: 1; }
.track-inner { stroke-width: 4; }
.cell-passed { stroke: #4facfe; stroke-width: 2; fill: none; }
.cell-future { stroke: #e1e8ed; stroke-width: 2; fill: none; }
.arc-yearly { fill: none; stroke: #3b82f6; stroke-width: 2.5; opacity: 0.4; }
.atmosphere-glow { fill: #fbbf24; filter: blur(20px); transition: 0.5s; }

/* BIRTH MARKER */
.birth-needle { fill: #f59e0b; }
.birth-outer-orb { fill: none; stroke: #f59e0b; stroke-width: 1; }
.tether-birth { stroke: #f59e0b; stroke-width: 0.5; stroke-dasharray: 1 1; }

/* DUAL SUN ELEMENTS */
.sun-whisper-line { stroke: #3b82f6; stroke-width: 1.5; stroke-linecap: round; }
.sun-outer-marker { fill: white; stroke: #3b82f6; stroke-width: 1.5; }
.tether-bridge { stroke: #fbce1e; stroke-width: 0.75; stroke-dasharray: 2 2; opacity: 0.6; }
.sun-glow { fill: #fbce1e; fill-opacity: 0.4; }
.sun-core { fill: white; stroke: #fbce1e; stroke-width: 2; }

/* EVENT ELEMENTS */
.event-ghost { fill: white; stroke: #8b5cf6; stroke-width: 1.5; stroke-dasharray: 2 1; }
.event-yearly-ghost { fill: #8b5cf6; opacity: 0.4; stroke: white; stroke-width: 0.5; }
.tether-event-bridge { stroke: #8b5cf6; stroke-width: 0.5; stroke-dasharray: 1 1; opacity: 0.25; }

.sun-readout { grid-area: stack; text-align: center; pointer-events: none; }
.cycles-whole { font-size: 6rem; font-weight: 900; line-height: 0.8; }
.cycles-decimal { color: #3b82f6; font-family: 'Space Mono'; font-weight: 700; font-size: 1.2rem; }
.date-label { margin-top: 1rem; font-size: 0.8rem; font-weight: 800; color: #94a3b8; }

.stepper { display: grid; grid-template-columns: 40px 1fr 40px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.stepper button { background: #f8fafc; border: none; font-weight: bold; cursor: pointer; }
.stepper input { border: none; text-align: center; width: 100%; }
.primary-btn { background: #0f172a; color: white; border: none; padding: 1rem; border-radius: 12px; font-weight: 800; width: 100%; cursor: pointer; margin-top: 1rem; }
.secondary-btn { background: transparent; color: #94a3b8; border: none; padding: 0.5rem; font-size: 0.7rem; font-weight: 700; width: 100%; cursor: pointer; }
.status-tag { font-size: 0.65rem; font-weight: 800; padding: 4px 8px; border-radius: 6px; background: #f1f5f9; color: #94a3b8; }
.status-tag.active { background: #dcfce7; color: #15803d; }
.heli-modal-overlay { position: fixed; inset: 0; background: white; z-index: 1000; display: grid; place-items: center; }
.calibration-card { width: 360px; text-align: center; display: grid; gap: 1.5rem; }
</style>