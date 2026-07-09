<template>
  <div class="heli-wrapper" @click.self="emit('close')">
    <button class="close-btn" @click="emit('close')">×</button>
    <HeliGenesis v-if="!isCalibrated" @calibrated="isProjecting === false" />

    <div v-if="isCalibrated" class="heli-main-layout">
      
      <aside class="heli-sidebar left">
        <div class="bento-card">
          <header class="card-header">Navigator</header>
          <div class="stepper">
            <button @click="adjustProjection(-1)">−</button>
            <input type="number" :value="daySeeker" @input="e => handleManualInput(e.target.value)" />
            <button @click="adjustProjection(1)">+</button>
          </div>
          <div class="status-zone">
            <span :class="['status-tag', { active: isProjecting }]">
              {{ isProjecting ? `PROJECTING +${daySeeker}d` : 'LIVE SYNC' }}
            </span>
          </div>
        </div>
      </aside>

      <!-- heli clock display -->
      <section class="clock-display">
        <HeliClock 
          :is-projecting="isProjecting"
          :day-seeker="daySeeker"
        />

        <div class="clock-actions">
          <button class="action-btn" @click="storeDiary.heliClockSet = false">
            ⚙️ RE-CALIBRATE GENESIS
          </button>
        </div>
      </section>

      <aside class="heli-sidebar right">
        <div class="bento-card" v-if="isProjecting">
          <header class="card-header">Commit Anchor</header>
          <input type="text" v-model="newEventLabel" placeholder="Solar Event..." class="anchor-input" />
          <button class="primary-btn" @click="confirmEvent">LOCK ANCHOR</button>
          <button class="secondary-btn" @click="resetToNow">COLLAPSE</button>
        </div>
      </aside>

      <!--<aside class="heli-legend-left">
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
      </aside>-->

      <!--<aside class="heli-legend-right">
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
      </aside>-->

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HeliGenesis from '@/components/orrery/clock/HeliGenesis.vue';
import HeliClock from '@/components/orrery/clock/HeliClock.vue';
import { diaryStore } from '@/stores/diaryStore.js';

const storeDiary = diaryStore();
const emit = defineEmits(['close']);

const isProjecting = ref(false);
const daySeeker = ref(0);
const newEventLabel = ref('');

const isCalibrated = computed(() => storeDiary.heliClockSet);
const storedSignature = computed(() => storeDiary.orbitSignature);

const activeCycles = computed(() => storeDiary.heliSignature.age);

const projectedDateString = computed(() => {
  const ts = Date.now() + (daySeeker.value * 86400000);
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
});

const adjustProjection = (d) => { daySeeker.value += d; sync(); };
const handleManualInput = (v) => { daySeeker.value = parseInt(v) || 0; sync(); };
const sync = () => {
  isProjecting.value = daySeeker.value !== 0;
  storeDiary.sendMessageHOP({ type: 'heli-project', timestamp: Date.now() + (daySeeker.value * 86400000) });
};
const resetToNow = () => { daySeeker.value = 0; isProjecting.value = false; };
const confirmEvent = () => { resetToNow(); };
</script>

<style scoped>
.heli-wrapper {
  position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center;
  background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px); font-family: 'Inter', sans-serif;
}
.close-btn {
  position: absolute; top: 2rem; right: 2rem; width: 40px; height: 40px;
  border-radius: 50%; border: none; background: white; color: #1e293b;
  font-size: 1.5rem; cursor: pointer; display: flex; align-items: center;
  justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.2s ease; z-index: 10000;
}
.close-btn:hover { transform: scale(1.1); background: #f1f5f9; }
.heli-main-layout {
  display: grid; grid-template-columns: 300px 1fr 300px; width: 95vw; height: 90vh; 
  padding: 2rem; border-radius: 40px; align-items: center;
}
.clock-display { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.orbital-grid { position: relative; width: 100%; max-width: 550px; }
.heli-svg { width: 100%; overflow: visible; }

/* Rings & Wedges */
.track-bg { fill: none; stroke: #f1f5f9; stroke-width: 4; }
.wedge-year { fill: none; stroke: #3b82f6; stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset 0.5s ease; }
.wedge-day { fill: none; stroke: #fbbf24; stroke-width: 6; stroke-linecap: round; }

/* Typography */
.sun-readout-overlay {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -44%);
  text-align: center; pointer-events: none;
}
.cycles-whole { font-size: 7.5rem; font-weight: 900; line-height: 0.7; color: #1e293b; letter-spacing: -5px; }
.cycles-decimal { font-size: 1.8rem; font-weight: 700; color: #cbd5e1; font-family: 'Space Mono', monospace; margin-top: 0.5rem; }
.date-pill {
  margin-top: 2rem; background: white; padding: 6px 16px; border-radius: 12px;
  font-size: 0.75rem; font-weight: 800; color: #64748b; box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

/* Sidebar & Styling */
.heli-sidebar { display: flex; flex-direction: column; gap: 2rem; }
.bento-card { background: white; padding: 1.5rem; border-radius: 28px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
.card-header { font-weight: 800; font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 1.5rem; }
.stepper { display: flex; align-items: center; gap: 0.5rem; background: #f1f5f9; padding: 0.6rem; border-radius: 14px; }
.stepper button { width: 38px; height: 38px; border-radius: 10px; border: none; background: white; cursor: pointer; font-weight: bold; }
.stepper input { width: 70px; text-align: center; background: transparent; border: none; font-weight: 800; font-family: 'Space Mono', monospace; font-size: 1.1rem; }
.primary-btn { background: #0f172a; color: white; width: 100%; padding: 1.2rem; border-radius: 18px; border: none; font-weight: 800; cursor: pointer; }
.action-btn { background: #f1f5f9; color: #94a3b8; border: none; padding: 0.8rem 1.6rem; border-radius: 14px; font-weight: 800; font-size: 0.7rem; cursor: pointer; margin-top: 4rem; }
.status-tag { padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.65rem; font-weight: 800; background: #f1f5f9; color: #64748b; margin-top: 1rem; display: inline-block; }
.status-tag.active { background: #3b82f6; color: white; }
.anchor-input { width: 100%; padding: 1rem; border-radius: 14px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; margin-bottom: 1.5rem; }
</style>