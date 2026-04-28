<template>
  <div class="genesis-gate" @mousemove="collectEntropy" @click="collectEntropy">
    <div class="gate-content">
      <header class="gate-header" v-if="HOPlock === false">
        <div class="gate-icon"></div>
        <h2>Genesis Handshake</h2>
        <p>{{ status }}</p>
      </header>
      <header class="gate-header" v-else>
        <div class="gate-icon"></div>
        <h2>Returning Handshake</h2>
        <p>Please enter master password</p>
      </header>
      

      <div v-if="anchorStatus === false" class="loading-spinner">
        <div class="spinner"></div>
        <!-- returning peer ask them to enter password please -->
                 <div class="action-group">
        <div class="password-input" v-if="HOPlock === true">
            <form id="self-verify" @submit.prevent="verifyHOP()">
              <input 
                type="password" 
                v-model="pwd"
                placeholder="Please enter master password" 
              />
            </form>
          </div>
          <button type="submit" form="self-verify" class="sign-button" @click.prevent="verifyHOP()">
            Self verify identity
          </button>
        </div>
        <div id="hop-beebee-feedback">
          {{ accountFeedback }}
        </div>
      </div>

      <!--<div v-else-if="!verified" class="error-state">
        <div class="error-icon">!</div>
        <p>Integrity Check Failed. Genesis Hash Mismatch.</p>
        <button @click="fetchWasmFromHop" class="retry-button">Retry Verification</button>
      </div> -->

      <div v-else class="ready-state">
        <p class="welcome-text">Welcome, Peer. Ready to sign the first entry of your Coherence Ledger?</p>
        <div class="action-group">
          <div class="password-input">
            <form id="self-verify-genesis">
              <input 
                type="password" 
                v-model="pwd"
                @keydown.enter.prevent="collectTypingEntropy()" 
                placeholder="Set Master Password" 
              />
            </form>
          </div>
          <button @click="finalizeGenesis()" class="sign-button">
            Sign Handshake & set password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { accountStore } from '@/stores/accountStore.js';
import { aiInterfaceStore } from '@/stores/aiInterface.js';

  const storeAccount = accountStore();
  const storeAI = aiInterfaceStore();
  const emit = defineEmits(['handshake-complete']);

  const status = ref('Connecting to HOP...');
  const loading = ref(true);
  const verified = ref(false);
  const GENESIS_WASM_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // Hardcoded hash of hop_crypto.wasm
  let isReady = ref(false)
  let pwd = ref('')
  let entropyBuffer = new Uint8Array(64); // 512 bits of potential noise
  let bytePointer = 0;
  let lastKeyPress = ref(null)
  let timingBuffer = ref([]) // Store the deltas between keystrokes
  let mouseEntropy = ref({})
  let typingEntropy = ref({})

  /* computed */
  const anchorStatus = computed(() => {
    return storeAccount.anchorStatus
  })

  const accountFeedback = computed(() => {
    return storeAccount.accountFeedback
  })

  const HOPlock = computed(() => {
    return storeAccount.HOPlock
  })

  /* methods */
  const collectTypingEntropy = (e) => {
    const now = performance.now();
    if (lastKeyPress.value) {
      // Calculate the delta in microseconds
      const delta = now - this.lastKeyPress;
      timingBuffer.push(delta);
    }
    lastKeyPress.value = now;
  };

  // Mouse entropy
  const collectEntropy = (e) => {
    if (bytePointer >= entropyBuffer.length) return; // Buffer full

    // We mix X, Y coordinates and the high-resolution timestamp (microseconds)
    const time = performance.now();
    const x = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const y = e.clientY || (e.touches ? e.touches[0].clientY : 0);

    // XOR the values into the buffer to "smear" the entropy
    entropyBuffer[bytePointer] ^= (x & 0xFF);
    entropyBuffer[bytePointer + 1] ^= (y & 0xFF);
    entropyBuffer[bytePointer + 2] ^= (Math.floor(time * 1000) & 0xFF);

    bytePointer = (bytePointer + 3) % entropyBuffer.length;
    mouseEntropy.value = bytePointer / entropyBuffer.length * 100;
  };

  const finalizeGenesis = async (password) => {
    // 1. Flatten the timing deltas into a byte array
    const timingData = new Float64Array(timingBuffer);
    const timingBytes = new Uint8Array(timingData.buffer);

    // 2. The "Serious Intent" Salt Stack: 
    // System Random + Mouse/Touch Jitter + Typing Rhythm
    const entropyStack = new Uint8Array([
      ...window.crypto.getRandomValues(new Uint8Array(32)), // System
      ...entropyBuffer, // Mouse/Touch (from previous step)
      ...timingBytes    // Keystroke Rhythm
    ]);

    // 3. Hash the stack to create a fixed-length 32-byte Final Salt
    const finalSaltBuffer = await crypto.subtle.digest('SHA-256', entropyStack);
    const finalSalt = new Uint8Array(finalSaltBuffer);
    handleSignClick(finalSalt)

    // 4. Proceed to WASM for Argon2id Key Stretching
    // ...
    
    // 5. CRITICAL: Wipe the buffers immediately
    timingBuffer = [];
    entropyBuffer.fill(0);
    pwd.value = '';
  }

  const handleSignClick = (finalSalt) => {
    storeAccount.sendMessageHOP({
      type: 'hop-auth',
      action: 'request-crypto-wasm',
      reftype: 'genesis-handshake',
      task: 'genesis-handshake',
      data: { entropy: finalSalt, pwd: pwd.value }
    });
  };

  const verifyHOP = () => {
    storeAccount.sendMessageHOP({
      type: 'hop-auth',
      action: 'verify-crypto-wasm',
      reftype: 'verify-return',
      task: 'verify-peer',
      data: { pwd: pwd.value }
    });
  };

</script>

<style scoped>
.genesis-gate {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  margin: 2rem auto;
}

.gate-header h2 {
  margin: 0.5rem 0;
  color: #1e293b;
  font-size: 1.5rem;
}

.gate-header p {
  color: #64748b;
  font-size: 0.9rem;
}

.loading-spinner {
  display: grid;
  justify-items: center;
  align-items: center;
  margin: 2rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

#hop-beebee-feedback {
  padding: 4em;
  color: #080522;
}

.error-state {
  color: #ef4444;
  margin: 1.5rem 0;
}

.error-icon {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.ready-state {
  margin-top: 1.5rem;
}

.welcome-text {
  color: #334155;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.password-input {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  margin: 30px auto;
}

#self-verify input {
  width: 360px;
  line-height: 1.2em;
  height: 50px;
  letter-spacing: 6px;
  padding-left: 12px;
}

.sign-button {
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sign-button:hover {
  background-color: #1d4ed8;
}

.retry-button {
  background-color: #94a3b8;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
