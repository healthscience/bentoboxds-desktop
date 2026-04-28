<template>
  <div id="sovereign-keys" class="sovereign-container">
    <div class="header-section">
      <h3>Sovereign Identity</h3>
      <p class="status">Status: {{ keyExists ? 'Active' : 'Identity Not Found' }}</p>
    </div>

    <div v-if="keyExists" class="key-card">
      <div class="info-row">
        <label>Sovereign ID (Public Key):</label>
        <code>{{ shortPubKey }}</code>
      </div>

      <div class="danger-zone">
        <h4>Danger Zone</h4>
        <p>Deleting your keys will detach you from your current Coherence Ledger lineage.</p>
        
        <div v-if="!confirmDelete">
          <button @click="confirmDelete = true" class="btn-warn">Delete Sovereign Identity</button>
        </div>
        
        <div v-else class="confirmation-flow">
          <input 
            v-model="deleteVerifyText" 
            placeholder="Type 'BURN' to confirm" 
            class="verify-input"
          />
          <div class="action-buttons">
            <button @click="resetKey" :disabled="deleteVerifyText !== 'BURN'" class="btn-danger">
              Confirm Destruction
            </button>
            <button @click="confirmDelete = false" class="btn-ghost">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="setup-section">
      <p>No active identity found. Generate a new one to begin your orbit.</p>
      <button @click="generateNewIdentity" class="btn-primary">Generate Genesis Identity</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
// Assuming your WASM/HOP bus logic is accessible globally or via a composable
// import { useHopCrypto } from '@/composables/useHopCrypto';

const keyExists = ref(false);
const pubKey = ref('');
const confirmDelete = ref(false);
const deleteVerifyText = ref('');

const shortPubKey = computed(() => {
  if (!pubKey.value) return '';
  return `${pubKey.value.substring(0, 8)}...${pubKey.value.substring(pubKey.value.length - 8)}`;
});

const loadKeyInfo = () => {
  const storedKey = localStorage.getItem('hop_sovereign_pubkey');
  if (storedKey) {
    pubKey.value = storedKey;
    keyExists.value = true;
  } else {
    keyExists.value = false;
  }
};

const resetKey = () => {
  // 1. Wipe local storage
  localStorage.removeItem('hop_sovereign_pubkey');
  localStorage.removeItem('hop_sovereign_privkey'); // If stored
  
  // 2. Reset local state
  keyExists.value = false;
  pubKey.value = '';
  confirmDelete.value = false;
  deleteVerifyText.value = '';
  
  console.log("Sovereignty Reset: Identity Purged.");
  
  // NOTE: Implement migration handshake here in the future
  // To bridge old_pubKey to new_pubKey
};

const generateNewIdentity = async () => {
  // This calls the Genesis Handshake logic we built
  // 1. Request WASM from HOP
  // 2. Generate new Keypair
  // 3. Store and update UI
  
  // Placeholder for the actual generation call:
  // const { publicKey } = await triggerGenesisHandshake();
  // pubKey.value = publicKey;
  // keyExists.value = true;
  
  console.log("Generating New Identity...");
};

onMounted(loadKeyInfo);
</script>

<style scoped>
.sovereign-container {
  padding: 2rem;
  background: var(--bento-bg-secondary);
  border-radius: 12px;
}
.key-card {
  border: 1px solid #444;
  padding: 1.5rem;
  margin-top: 1rem;
}
.danger-zone {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px dashed #ff4444;
  background: rgba(255, 68, 68, 0.05);
}
.verify-input {
  background: #000;
  border: 1px solid #ff4444;
  color: #fff;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
.btn-danger { background: #ff4444; color: white; }
.btn-warn { background: #ffbb33; color: black; }
.btn-primary { background: #00C851; color: white; }
.btn-ghost { background: transparent; border: 1px solid #999; }
</style>