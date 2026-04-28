<template>
  <div class="wheel-legend">
    <div class="legend-section">
      <h4 class="label-heading">Orbits (Where)</h4>
      <div class="legend-item">
        <span class="orbit-ring-icon inner"></span>
        <div class="item-text">
          <span class="title">Metabolic (r=12)</span>
          <p class="desc">Internal biology: Heart Rate, HRV, Glucose.</p>
        </div>
      </div>
      <div class="legend-item">
        <span class="orbit-ring-icon middle"></span>
        <div class="item-text">
          <span class="title">Ecological (r=24)</span>
          <p class="desc">Physical environment: Drag, Water Temp, Arcs.</p>
        </div>
      </div>
      <div class="legend-item">
        <span class="orbit-ring-icon outer"></span>
        <div class="item-text">
          <span class="title">Culture (r=36)</span>
          <p class="desc">Systemic flow: Efficiency, Energy ROI.</p>
        </div>
      </div>
    </div>

    <div class="legend-section">
      <h4 class="label-heading">Resonance Status</h4>
      <div class="status-indicator">
        <span class="dot active"></span>
        <span>Resonance Found (Alignment)</span>
      </div>
      <div class="status-indicator">
        <span class="dot drift"></span>
        <span>Boundary Drift (Search Mode)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wheel-legend {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  max-width: 280px;
}

.label-heading {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  color: var(--glow-ecological, #40e0ff);
  opacity: 0.8;
}

.legend-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 1rem;
}

.orbit-ring-icon {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid;
  flex-shrink: 0;
  margin-top: 3px;
}

.inner { border-color: #ff4d4d; box-shadow: 0 0 5px #ff4d4d; }
.middle { border-color: #40e0ff; box-shadow: 0 0 5px #40e0ff; }
.outer { border-color: #b6ff3b; box-shadow: 0 0 5px #b6ff3b; }

.title { font-weight: bold; font-size: 0.85rem; display: block; }
.desc { font-size: 0.75rem; opacity: 0.6; margin: 0; line-height: 1.2; }

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.dot { width: 6px; height: 6px; border-radius: 50%; }
.active { background: #4dff88; box-shadow: 0 0 8px #4dff88; }
.drift { background: #ff4d4d; animation: pulse 2s infinite; }

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}
</style>