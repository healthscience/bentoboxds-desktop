<template>
  <div class="expand-device-overlay" @click.self="emit('close')">
    <div class="expand-device-card">
      <button class="close-btn" @click="emit('close')">×</button>

      <header class="device-header">
        <div class="icon-pulse">
          <span class="device-icon">📱</span>
        </div>
        <div class="header-text">
          <h1>{{ device.name }}</h1>
          <span class="status-badge">Connected via Bluetooth</span>
        </div>
      </header>

      <div class="device-grid">
        <!-- Identity Section -->
        <section class="info-section">
          <h3>IDENTITY</h3>
          <div class="info-item">
            <label>MAC ADDRESS</label>
            <span class="value">{{ device.mac }}</span>
          </div>
          <div class="info-item">
            <label>COUPLED APP</label>
            <span class="value">{{ device.appName }}</span>
          </div>
        </section>

        <!-- Telemetry Section -->
        <section class="info-section telemetry">
          <h3>WHAT IT MEASURES</h3>
          <div class="telemetry-list">
            <div
              v-for="measure in device.measures"
              :key="measure"
              class="measure-pill"
            >
              {{ measure }}
            </div>
          </div>
        </section>
      </div>

      <footer class="device-footer">
        <button class="primary-btn" @click="emit('close')">COLLAPSE</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["close"]);

const device = ref({
  name: "Pulse-Anchor 01",
  mac: "54:EE:75:A0:92:B1",
  appName: "BentoSync v2.1",
  measures: [
    "Heart Rate Variability",
    "Oxygen Saturation (SpO2)",
    "Ambient Pressure",
    "NEAT Flow Rate",
  ],
});
</script>

<style scoped>
.expand-device-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(12px);
  padding: 2rem;
}

.expand-device-card {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 40px;
  padding: 3rem;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #1e293b;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.1);
}

.device-header {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.icon-pulse {
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 30px;
  display: grid;
  place-items: center;
  font-size: 3rem;
  box-shadow: 0 8px 30px rgba(74, 111, 165, 0.15);
  animation: soft-pulse 4s infinite;
}

.header-text h1 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0;
  letter-spacing: -1px;
}

.status-badge {
  font-size: 0.8rem;
  font-weight: 800;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  margin-top: 0.5rem;
  text-transform: uppercase;
}

.device-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.info-section h3 {
  font-size: 0.7rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
}

.info-item {
  margin-bottom: 1.2rem;
}

.info-item label {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.3rem;
}

.info-item .value {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  font-family: "Space Mono", monospace;
}

.telemetry-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.measure-pill {
  background: white;
  color: #4a6fa5;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(74, 111, 165, 0.1);
}

.device-footer {
  margin-top: 1rem;
}

.primary-btn {
  background: #0f172a;
  color: white;
  width: 100%;
  padding: 1.2rem;
  border-radius: 20px;
  border: none;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.2);
}

.primary-btn:hover {
  transform: translateY(-2px);
}

@keyframes soft-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@media (max-width: 600px) {
  .device-grid {
    grid-template-columns: 1fr;
  }
  .expand-device-card {
    padding: 2rem;
    border-radius: 30px;
  }
  .header-text h1 {
    font-size: 1.8rem;
  }
}
</style>
