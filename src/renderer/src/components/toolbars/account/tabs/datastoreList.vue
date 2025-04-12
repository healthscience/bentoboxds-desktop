<template>
  <div id="datastore-lists">
    <div class="list-space" id="datastore-list">
      <div id="public-datastores">
        Public datastores
      </div>
      <div class="peer-ledgers" v-for='pk in publicStores' :key='pk.id'>
        <div class="type-store">{{ pk.store }}</div>
        <div class="type-store-key">
          <button @click="showKey(pk, $event.target)" class="view-key-btn">
            View Key
          </button>
          <button @click="copyToClipboard(pk.pubkey, $event.target)" class="copy-btn">
            Copy
          </button>
          <span v-if="pk.visible" class="key-display">
            pubkey- {{ pk.pubkey }}
          </span>
        </div>
      </div>
      <div id="peers-listkeys">
        <div id="private-datastores">
          Private datastores
        </div>
        <div class="peer-ledgers" v-for='pk in privateStores' :key='pk.id'>
          <div class="type-store">{{ pk.store }}</div>
          <div class="type-store-key">
            <button @click="showKey(pk, $event.target)" class="view-key-btn">
              View Key
            </button>
            <button @click="copyToClipboard(pk.pubkey, $event.target)" class="copy-btn">
              Copy
            </button>
            <span v-if="pk.visible" class="key-display">
              pubkey- {{ pk.pubkey }}
            </span>
          </div>
        </div>
      </div>
      <div class="peer-ledgers">
        <div class="type-store">Files</div>
        <div class="type-store-key">
          <button @click="showKey({ pubkey: storeAccount.publickeyDrive, visible: false }, $event.target)" class="view-key-btn">
            View Key
          </button>
          <button @click="copyToClipboard(storeAccount.publickeyDrive, $event.target)" class="copy-btn">
            Copy
          </button>
          <span v-if="storeAccount.publickeyDrive" class="key-display">
            pubkey- {{ storeAccount.publickeyDrive }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <!-- Toast Notification -->
  <div v-if="showToast" class="toast-message" :class="toastClass">
    {{ toastMessage }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { accountStore } from '@/stores/accountStore.js'

const storeAccount = accountStore()
let swarmState = ref(true)

/* computed */
const publicStores = computed(() => storeAccount.publicKeysList.filter(pk => pk.privacy === 'public'))
const privateStores = computed(() => storeAccount.publicKeysList.filter(pk => pk.privacy === 'private'))

// Toast notification state
const showToast = ref(false)
const toastMessage = ref('')
const toastClass = ref('')

// Function to show toast notification
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastClass.value = `toast-${type}`
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// Add function to copy text to clipboard
const copyToClipboard = (text, btn) => {
  btn.classList.add('active')
  navigator.clipboard.writeText(text)
    .then(() => {
      showToastMessage('Public key copied to clipboard!', 'success')
      setTimeout(() => btn.classList.remove('active'), 2000)
    })
    .catch(err => {
      showToastMessage('Failed to copy public key', 'error')
      console.error('Failed to copy text: ', err)
      setTimeout(() => btn.classList.remove('active'), 2000)
    })
}

// Function to show key temporarily
const showKey = (pk, btn) => {
  btn.classList.add('active')
  pk.visible = true
  setTimeout(() => {
    pk.visible = false
    btn.classList.remove('active')
  }, 2000)
}
</script>

<style scoped>
#datastore-lists {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

#datastore-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

#public-datastores,
#private-datastores {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
}

#peers-listkeys {
  display: grid;
  gap: 15px;
}

#open-connect {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.peer-ledgers {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 15px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.type-store {
  font-weight: bold;
  color: #333;
}

.type-store-key {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 10px;
  align-items: center;
}

.view-key-btn, .copy-btn {
  background-color: #b8cde2; /* Default blue color */
  color: #140d6b; /* Dark blue text color */
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.view-key-btn:hover, .copy-btn:hover {
  background-color: #a4c0e0; /* Slightly darker blue on hover */
}

.view-key-btn.active, .copy-btn.active {
  background-color: #4CAF50; /* Green when clicked */
  color: white; /* White text when green */
}

.key-display {
  display: inline-block;
  margin-left: 10px;
  font-family: monospace;
  font-size: 0.9em;
  color: #333;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  #datastore-list {
    grid-template-columns: 1fr;
  }

  .peer-ledgers {
    grid-template-columns: 1fr 4fr;
  }

  .type-store-key {
    grid-template-columns: auto auto 1fr;
  }
}

/* Toast Notification Styles */
.toast-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  background-color: #4CAF50;
}

.toast-error {
  background-color: #f44336;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
