<template>
  <div class="swim-emulator bento-diary-node">
    <div class="emulator-header">
      <div class="header-main">
        <h3>🏊 Tiny Agent: Swimming Peer</h3>
        <p class="bioregion-tag">Watershed: {{ env === 'river' ? 'Upper Dee Basin' : 'Municipal Grid' }}</p>
      </div>
      <div class="status-badge" :class="{ 'resonance': globalResonance }">
        {{ globalResonance ? 'RESONANCE ACTIVE' : 'SEARCHING FOR FLOW' }}
      </div>
    </div>

    <div class="emulator-main-grid">
      
      <div class="visual-hub">
        <div class="env-picker">
          <button 
            v-for="type in ['indoor', 'natural', 'river']" 
            :key="type" 
            @click="env = type" 
            :class="{ active: env === type }"
          >
            {{ type.toUpperCase() }}
          </button>
        </div>
        
        <ResonancePulse 
          :cues="currentEntities" 
          :solarAngle="timeAngle" 
          :currentEnv="env" 
        />
        
        <div class="visual-footer">
          <StrokeToggle 
            :profiles="imProfiles" 
            :currentStroke="currentStrokeKey" 
            @change-stroke="handleStrokeChange" 
          />
          <button @click="toggleSim" class="play-btn">
            {{ running ? 'PAUSE' : 'START LAP' }}
          </button>
        </div>
      </div>

      <button @click="toggleSim" class="play-btn" style="cursor: pointer; position: relative; z-index: 999;">
        {{ running ? 'PAUSE' : 'ENTER THE ORBIT' }}
      </button>

      <div class="biotech-stack">
        <GreatOrbitp />
        
        <div class="stack-group">
          <label>Human/Flesh Hardware</label>
          <BodyHardware @update-flesh="handleFleshUpdate" />
        </div>

        <div class="stack-group">
          <label>Metabolic Engine</label>
          <LaticMet :stats="currentLacticStats" />
          <SwimWearable @tick="handleMockTick" />
        </div>

        <div class="stack-group">
          <label>Cellular Resonance</label>
          <MicroCellular :cellStats="currentCellStats" />
        </div>

        <div class="stack-group">
          <label>Environment Interface</label>
          <SkinBarrierMonitor 
            :hydration="activeFleshData.hydration" 
            :duration="60" 
          />
        </div>
      </div>
    </div>

    <div class="emulator-footer">
      <div class="input-wrapper">
        <input 
          v-model="teachInput" 
          @keyup.enter="handleTeach" 
          placeholder="@teach BeeBee (e.g., 'fatigued' or 'flow state')..." 
          class="zero-draft-input" 
        />
      </div>
      <div class="learning-log-mini">
        <p v-for="(log, index) in logs" :key="index">
          <small>[{{ log.time }}°]</small> {{ log.msg }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

// Components
import ResonancePulse from './ResonancePulse.vue';
import StrokeToggle from './StrokeToggle.vue';
import GreatOrbitp from './OrbitTimeline.vue';
import BodyHardware from './WithingsSync.vue';
import LaticMet from './LacticCore.vue';
import SwimWearable from './SessionMockTrigger.vue';
import MicroCellular from './CellularMicroWheel.vue';
import SkinBarrierMonitor from './SkinBarrierMonitor.vue';

// Logic & Seeds
import { SwimECS } from './SwimECS.js';
import { swimSeed, imProfiles } from './SwimSeed.js';
import { LacticECS } from './LacticECS.js';
import { calculateCellularResonance } from './MitoResonance.js';

// --- STATE MANAGEMENT ---
const env = ref('indoor');
const running = ref(false);
const currentStrokeKey = ref('freestyle');
const teachInput = ref('');
const logs = ref([]);
const timeAngle = ref(45);
const activeFleshData = ref({ hydration: 55 });

// Engines
const lacticEngine = new LacticECS();
let ecs = new SwimECS(swimSeed);
let timer = null;

// Reactive Stats
const currentEntities = ref(swimSeed.initial_entities);
const currentLacticStats = ref({ level: 0.5, isRedlining: false, efficiencyLoss: 0 });
const currentCellStats = ref({ mitochondrialFlux: 0, atpProduction: 'Resting', cellularStress: 'Low' });

// --- HANDLERS ---
const handleFleshUpdate = (newData) => {
  activeFleshData.value = newData;
};

const handleMockTick = (dataPoint) => {
  // 1. Biological Updates
  currentLacticStats.value = lacticEngine.update(dataPoint.intensity, currentStrokeKey.value);
  currentCellStats.value = calculateCellularResonance(
    currentLacticStats.value.level, 
    activeFleshData.value.hydration
  );

  // 2. Supply Chain & Energy Calculations
  const outsideAirTemp = 4; // Simulated Aboyne morning
  const chlorineStats = calculateChlorineImpact(env.value, 60);
  const thermalStats = calculateThermalDebt(env.value, outsideAirTemp);
  
  // 3. Update the Visual Cues on the Pulse Wheel
  currentEntities.value.forEach(cue => {
    if (cue.id === 'chlorine-debt') {
      cue.active = env.value === 'indoor';
      if (cue.active) cue.angle = (timeAngle.value + 45) % 360;
    }
    
    if (cue.id === 'thermal-grid-draw') {
      cue.active = env.value === 'indoor';
      if (cue.active) cue.angle = (timeAngle.value - 30) % 360;
    }
  });

  // 4. BeeBee "Systemic" Awareness
  if (running.value && env.value === 'indoor') {
    const totalCarbon = thermalStats.carbonWeightGrams;
    if (totalCarbon > 500 && Math.random() > 0.95) { // Occasional log
       logs.value.unshift({ 
         time: "ECO", 
         msg: `BeeBee: High thermal debt detected. Indoor environment is consuming ${totalCarbon}g CO2/hr.` 
       });
    }
  }
};


  const handleStrokeChange = (key) => {
    currentStrokeKey.value = key;
    logs.value.unshift({ 
      time: Math.round(timeAngle.value), 
      msg: `BeeBee: Physics shifted to ${imProfiles[key].name}.` 
    });
  };

  const toggleSim = () => {
    console.log("Orbit Triggered: Handshake Initiated."); // If this doesn't show, it's definitely a CSS blockage.
    running.value = !running.value;
    if (running.value) {
      timer = setInterval(() => {
        currentEntities.value = ecs.update();
        timeAngle.value = (timeAngle.value + 0.1) % 360;
      }, 100);
    } else {
      clearInterval(timer);
    }
  };

  /**
   * Chlorine Supply Chain Logic 
   * Integrated for the Life-Strap Unified View
   */
  const calculateChlorineImpact = (envType, sessionDuration) => {
    if (envType !== 'indoor') return { cost: 0, skinLoad: 0, ppm: 0 };

    const basePPM = 2.5; 
    const hourlyEvaporationRate = 0.15; 
    const pricePerUnit = 0.12; // 2026 Chemical Spot Price

    const skinLoad = (basePPM * sessionDuration) / 60;
    const totalCost = (basePPM * pricePerUnit);

    return {
      cost: totalCost.toFixed(2),
      skinLoad: skinLoad.toFixed(2),
      ppm: basePPM,
      status: skinLoad > 2.0 ? 'High Absorption' : 'Nominal'
    };
  };

  /**
   * Thermal Energy Logic: The Carbon Cost of Comfort
   */
  const calculateThermalDebt = (envType, outsideTemp) => {
    if (envType !== 'indoor') return { energykWh: 0, carbong: 0, efficiency: 1 };

    const targetTemp = 27; // Pool target
    const tempDelta = Math.max(0, targetTemp - outsideTemp);
    
    // Simulation of a 25m pool's hourly heat loss
    const heatLossCoefficient = 12.5; 
    const energykWh = (tempDelta * heatLossCoefficient).toFixed(2);
    
    // 2026 Grid Intensity (Grams of CO2 per kWh)
    const gridIntensity = 140; 
    const carbonWeightGrams = (energykWh * gridIntensity).toFixed(0);

    return {
      energykWh,
      carbonWeightGrams,
      thermalStress: tempDelta > 15 ? 'High' : 'Low'
    };
  };

  const handleTeach = () => {
    const input = teachInput.value.toLowerCase();
    if (input.includes('tired')) {
      logs.value.unshift({ time: "BIO", msg: "BeeBee: Sensitivity up. Recovery focus engaged." });
    }
    teachInput.value = '';
  };

  const globalResonance = computed(() => {
    return currentEntities.value.every(e => e.inResonance);
  });

  onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
  .swim-emulator {
    width: 95vw;
    max-width: 1300px;
    margin: 0 auto;
    background: #080808;
    padding: 24px;
    border-radius: 20px;
    border: 1px solid #222;
    color: #eee;
    font-family: 'Inter', sans-serif;
  }

  .emulator-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #222;
    padding-bottom: 15px;
  }

  .bioregion-tag { font-size: 0.7rem; color: #666; letter-spacing: 1px; }

  .emulator-main-grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 30px;
    margin-top: 25px;
  }

  .visual-hub {
    min-height: 500px; 
    display: flex;
    flex-direction: column; /* CRITICAL: Stack elements vertically */
    justify-content: space-between; /* Space out picker, wheel, and footer */
    align-items: center;
    background: rgba(255, 255, 255, 0.02);
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #1a1a1a;
    z-index: 1; /* Ensure it stays above background elements */
  }

  /* This is the key fix */
  .resonance-pulse-container {
    pointer-events: none; /* Let clicks pass THROUGH the SVG container */
  }

  .resonance-svg {
    pointer-events: none; 
  }

  /* But allow clicks on actual interactive parts if needed later */
  .cue-point, .play-btn, .env-picker button {
    pointer-events: all; /* Ensure buttons remain clickable */
  }

  .visual-footer {
    position: relative;
    z-index: 10; /* Force the buttons to the very front of the stack */
  }

  .biotech-stack {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-height: 75vh;
    overflow-y: auto;
    padding-right: 15px;
  }

  .stack-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stack-group label {
    font-size: 0.65rem;
    text-transform: uppercase;
    color: #444;
    letter-spacing: 1.5px;
    border-bottom: 1px solid #1a1a1a;
    padding-bottom: 4px;
  }

  .env-picker { display: flex; gap: 10px; margin-bottom: 20px; }
  .env-picker button {
    background: transparent;
    border: 1px solid #333;
    color: #555;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.7rem;
    transition: all 0.3s;
  }
  .env-picker button.active { border-color: #00f2ff; color: #00f2ff; background: rgba(0,242,255,0.05); }

  .visual-footer { width: 100%; display: flex; justify-content: space-between; margin-top: 20px; }

  .play-btn {
    background: #b6ff3b;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 800;
    cursor: pointer;
  }

  .emulator-footer { margin-top: 30px; border-top: 1px solid #222; padding-top: 20px; }

  .zero-draft-input {
    width: 100%;
    background: #111;
    border: 1px solid #333;
    padding: 12px;
    color: #b6ff3b;
    border-radius: 8px;
  }

  .learning-log-mini { height: 100px; overflow-y: auto; margin-top: 10px; font-size: 0.8rem; color: #888; }

  .resonance { color: #b6ff3b; text-shadow: 0 0 10px #b6ff3b; }

  .biotech-stack::-webkit-scrollbar { width: 3px; }
  .biotech-stack::-webkit-scrollbar-thumb { background: #333; }

</style>