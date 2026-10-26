<!-- src/components/osmosis/OsmosisExperience.vue -->
<template>
  <div class="osmosis-experience-panel">
    
    <!-- Tab Navigation -->
    <nav class="osmosis-tabs">
      <button 
        :class="{ active: activeTab === 'absorption' }" 
        @click="activeTab = 'absorption'"
      >
        Absorption
      </button>
      <button 
        :class="{ active: activeTab === 'sharing' }" 
        @click="activeTab = 'sharing'"
      >
        Sharing
      </button>
    </nav>

    <div class="osmosis-body">
      <!-- Ledger List -->
      <div class="ledger-list">
        <div v-if="currentLedger.length === 0" class="empty-state">
          No {{ activeTab }} activity recorded.
        </div>
        <div 
          v-for="item in currentLedger" 
          :key="item.hash"
          class="ledger-item"
          :class="{ selected: selectedItem?.hash === item.hash }"
          @click="selectItem(item)"
        >
          <div class="ledger-header">
            <span class="heli-time">{{ item.heliAngle }}° Heli</span>
            <span class="status-indicator" :class="item.status.toLowerCase()">{{ item.status }}</span>
          </div>
          <div class="topic-name">{{ item.topic }}</div>
          <div class="hash-preview">{{ item.hash.slice(0, 12) }}...{{ item.hash.slice(-8) }}</div>
        </div>
      </div>

      <!-- Detail Expansion Panel -->
      <div v-if="selectedItem" class="detail-expansion">
        <div class="detail-header">
          <h3>{{ selectedItem.topic }}</h3>
          <span class="hash-string" title="Full Hash">{{ selectedItem.hash }}</span>
        </div>

        <div class="network-stats">
          <div class="stat-box">
            <span class="stat-label">Connected Peers</span>
            <span class="stat-val">{{ selectedItem.peers || 0 }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Block Replication</span>
            <span class="stat-val">{{ selectedItem.downloaded || 0 }} / {{ selectedItem.totalBlocks || 0 }}</span>
          </div>
        </div>

        <!-- Pipeline State progression via safeflow-ecs -->
        <div class="ecs-pipeline">
          <h4>Pipeline State</h4>
          <div class="pipeline-steps">
            <div class="step" :class="{ complete: selectedItem.pipelineState >= 1 }">
              <span class="step-num">1</span>
              <span class="step-name">Story</span>
            </div>
            <div class="step-line" :class="{ active: selectedItem.pipelineState >= 2 }"></div>
            <div class="step" :class="{ complete: selectedItem.pipelineState >= 2 }">
              <span class="step-num">2</span>
              <span class="step-name">Simulation</span>
            </div>
            <div class="step-line" :class="{ active: selectedItem.pipelineState >= 3 }"></div>
            <div class="step" :class="{ complete: selectedItem.pipelineState === 3 }">
              <span class="step-num">3</span>
              <span class="step-name">EMULATION</span>
            </div>
          </div>
        </div>

        <!-- Thermodynamic Alignment Control -->
        <div class="action-footer">
          <button 
            v-if="activeTab === 'absorption' && selectedItem.pipelineState < 3" 
            class="align-btn"
          >
            Initiate Phase Alignment
          </button>
          <span v-else-if="selectedItem.pipelineState === 3" class="emulated-badge">
            Phase Aligned with Life-Strap
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('absorption')
const selectedItem = ref(null)

// Sample structure - populated from local Hyperbee ledger reading
const absorptionHistory = ref([
  {
    hash: '8f4a21b9c3e201490219481a0e88231e771b9031c28f912e84128f1129bc83d1',
    topic: 'Marathon Pacing & Cardiac Drift',
    heliAngle: '142.5',
    status: 'Live',
    peers: 3,
    downloaded: 128,
    totalBlocks: 128,
    pipelineState: 2
  }
])

const sharingHistory = ref([])

const currentLedger = computed(() => {
  return activeTab.value === 'absorption' ? absorptionHistory.value : sharingHistory.value
})

const selectItem = (item) => {
  selectedItem.value = selectedItem.value?.hash === item.hash ? null : item
}
</script>

<style scoped>
.osmosis-experience-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 860px;
  
  /* Increased base opacity to block out underlying components */
  background: rgba(10, 12, 18, 0.97); 
  
  /* Heavy backdrop blur for deep defocusing of underlying layers */
  -webkit-backdrop-filter: blur(40px) saturate(140%);
  backdrop-filter: blur(40px) saturate(140%);
  
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #e2e8f0;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
  
  /* Deep elevation shadow */
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.85), 
              0 0 40px rgba(0, 0, 0, 0.5);
  
  /* Ensure it sits clean above spatial components */
  position: relative;
  z-index: 19999999999999999999900;
}

/* Tab Bar */
.osmosis-tabs {
  display: flex;
  background: rgba(227, 229, 241, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.osmosis-tabs button {
  flex: 1;
  padding: 14px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #8a99ad;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.osmosis-tabs button:hover {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.02);
}

.osmosis-tabs button.active {
  color: #ff4b2b;
  border-bottom-color: #ff4b2b;
  background: rgba(255, 75, 43, 0.05);
}

/* Layout Split */
.osmosis-body {
  display: grid;
  grid-template-columns: 320px 1fr;
  min-height: 400px;
}

/* Ledger List */
.ledger-list {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  overflow-y: auto;
  max-height: 520px;
}

.empty-state {
  padding: 30px;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

.ledger-item {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: background 0.15s ease;
}

.ledger-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.ledger-item.selected {
  background: rgba(255, 75, 43, 0.1);
  border-left: 3px solid #ff4b2b;
}

.ledger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.heli-time {
  font-family: monospace;
  font-size: 0.75rem;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.status-indicator {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-indicator.live {
  color: #ff4b2b;
}

.status-indicator.closed {
  color: #64748b;
}

.topic-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #f1f5f9;
  margin-bottom: 4px;
}

.hash-preview {
  font-family: monospace;
  font-size: 0.75rem;
  color: #64748b;
}

/* Detail Expansion Panel */
.detail-expansion {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(0, 0, 0, 0.2);
}

.detail-header h3 {
  margin: 0 0 6px 0;
  font-size: 1.2rem;
  color: #f8fafc;
}

.hash-string {
  font-family: monospace;
  font-size: 0.75rem;
  color: #64748b;
  word-break: break-all;
  background: rgba(0, 0, 0, 0.4);
  padding: 6px 10px;
  border-radius: 4px;
  display: block;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

/* Network Stats */
.network-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.stat-val {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f1f5f9;
}

/* ECS Pipeline Tracker */
.ecs-pipeline h4 {
  margin: 0 0 12px 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94a3b8;
}

.pipeline-steps {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.step.complete {
  opacity: 1;
}

.step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #334155;
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.step.complete .step-num {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
}

.step-name {
  font-size: 0.8rem;
  font-weight: 600;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #eceff3;
  transition: background 0.3s ease;
}

.step-line.active {
  background: #ff4b2b;
}

/* Actions */
.action-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.align-btn {
  width: 100%;
  padding: 12px 18px;
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(255, 65, 108, 0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.align-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 65, 108, 0.6);
}

.emulated-badge {
  font-size: 0.85rem;
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.2);
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
}
</style>