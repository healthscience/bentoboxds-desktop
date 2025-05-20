<template>
  <div id="list-space">
    <div id="peer-modes">
      <div id="peer-mode-prime">
        <button id="socail-network-button" @click="peerMode('social')" :class="{ active: peerModeType === 'social' }">Social</button>
        <button id="invite-modes-button" @click="peerMode('invite')" :class="{ active: peerModeType === 'invite' }">Invite</button>
      </div>
      <div id="peer-mode-secondary">
        <div id="peer-mode-secondary-empty"></div>
        <div id="invite-types" v-if="peerModeType === 'invite'">
          <button @click="inviteMode('generate')" :class="{ active: inviteModeType === 'generate' }">Generate invite</button>
          <button @click="inviteMode('receive')" :class="{ active: inviteModeType === 'receive' }">Receive invite</button>
        </div>
      </div>
    </div>
    <div id="social-network-view" v-if="peerModeType === 'social'">
      <header>Social network</header>
      <div class="peer-list-set" v-for='(peer, index) in peerNetwork' :key='peer.key'>
        <div class="peer-g"  v-if="index == 0">
          <div class="longterm-peer peer-details-header">
            <div class="peer-info">
              Name
            </div>
            <div class="peer-info">
              Live 
            </div>
            <div class="peer-info">
              Public key 
            </div>
          </div>
          <div class="option-tools">
              Tools
          </div>
        </div>
        <div class="peer-g">
          <div class="longterm-peer peer-details">
            <div class="peer-info">
              {{ peer?.value?.name }}
            </div>
            <div class="peer-info">
              {{ peer?.value?.live }}
            </div>
            <div class="peer-info">
              <div class="peer-pk">{{ peer.key }}</div>
            </div>
          </div>
          <div class="peer-actions">
            <div class="peer-action">
                <button @click="copyKey(peer.key)">copy</button>            
              </div>
            <!--if longterm show button to reconnect or (TODO remove)-->
            <div class="peer-action" v-if="peer?.value?.longterm === true">
              <button @click="directConnectPeer(peer)">recon</button>
            </div>
            <div class="peer-action">
              <button @click="editPeer(peer.key)">edit</button>
            </div>
            <div class="peer-action">
              <button @click="removePeer(peer)">remove</button>
            </div>
          </div>
        </div>
      </div>
      <div id="social-graph-space">
        <social-graph></social-graph>
      </div>
    </div>
    <div id="invite-tools" v-if="peerModeType === 'invite'">
      <div id="invite-modes">
        <div id="generate-invite-mode" v-if="inviteModeType === 'generate'">
          <div id="generate-invite">
            Generate invite
          </div>
          <div id="generate-invite">
            <div id="invite-peer-codename" class="invite-form-container">
              <div class="form-group">
                <label for="peer-name" class="form-label">Peer name:</label>
                <input 
                  id="peer-name"
                  v-model="peerName" 
                  placeholder="Enter peer name"
                  class="form-input"
                >
              </div>
              <button 
                id="invite-generation-button" 
                @click="generateInvite()"
                class="btn btn-primary"
              >
                Generate Invite
              </button>
            </div>
            <div id="form-invite-code" v-if="genInvite === true">
              <div id="invite-peer-crypto" v-for="(genInvite, index) of inviteList">
                <div class="peer-g"  v-if="index == 0">
              <div class="longterm-peer peer-details-header">
                <div class="peer-info">
                  Name
                </div>
                <div class="peer-info">
                  Accepted 
                </div>
                <div class="peer-info">
                  Public key / codename
                </div>
              </div>
              <div class="option-tools">
                  Tools
              </div>
            </div>
            <div id="send-invite-gen">
              <div class="gen-crypt-code">{{ genInvite.name }}</div>
              <div class="gen-crypt-code">{{ genInvite.matched }}</div>
              <div class="gen-crypt-code" id="pubkey-session-live">{{ genInvite.publickey }}</div>
              <div class="gen-crypt-code name-as-code">{{ genInvite.codename }}</div>
              <button class="gen-crypt-code" id="button-copy-invite" type="button" @click="copyGenInvite(genInvite.codename)">Copy invite</button>
              <div v-if="copiedInvite === genInvite.codename" class="copied-message">Copied to clipboard</div>
              <button class="gen-crypt-code" id="button-remove-invite" type="button" @click="removeInvite(genInvite.codename)">remove</button>
            </div>
          </div>
        </div>
      </div>          
        </div>
        <div id="receive-invite-mode" v-if="inviteModeType === 'receive'">
          <div id="add-peer">
            <div id="prepare-invite" class="add-peer-container">
              <div v-if="addWarm === true" id="add-warm-peer" class="add-peer-form">
                <div class="form-group">
                  <label for="peer-name-input" class="form-label">Peer Name</label>
                  <input 
                    id="peer-name-input"
                    v-model="newPeername" 
                    placeholder="Enter peer name"
                    class="form-input"
                  >
                </div>
                <div class="form-group">
                  <label for="peer-pubkey" class="form-label">invite code</label>
                  <input 
                    id="peer-pubkey"
                    v-model="newPeerPubKey" 
                    placeholder="Enter invite code"
                    class="form-input"
                  >
                </div>
                <button 
                  type="button" 
                  class="btn btn-primary" 
                  @click="sendInviteWarmpeer()"
                  :disabled="!newPeername || !newPeerPubKey"
                >
                  Add Peer
                </button>
              </div>
              <div 
                id="beebee-message-feedback" 
                class="message-feedback"
                :class="{ 'has-message': beebeeMessage }"
              >
                {{ beebeeMessage }}
              </div>
              <div 
                id="beebee-connection-feedback" 
                class="message-feedback"
                :class="{ 'has-message': beebeeConnectionFeedback }"
                v-if="beebeeConnectionFeedback"
                @animationend="storeAccount.beebeeConnectFeedback = ''"
              >
                {{ beebeeConnectionFeedback }}
              </div>
            </div>
            <div id="pending-invites" v-if="invitePending.length > 0">
              Invites pending:
              <div v-for='peer in invitePending' :key='peer.key'>
                {{ peer?.name }} --  --- {{ peer.key }} -- sent
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { accountStore } from '@/stores/accountStore.js'
import SocialGraph from '@/components/toolbars/account/graphs/socialGraph.vue'

  const storeAccount = accountStore()

  let addWarm = ref(true)
  let newPeername = ref('')
  let newPeerPubKey = ref('')
  let genInvite = ref(true)
  let peerName = ref('')
  let randomName = ref('')
  let inviteGenCode = ref('')
  let copiedInvite = ref(null)
  let peerModeType = ref('social')
  let inviteModeType = ref('generate')


  /* computed */
  const peerNetwork = computed(() => {
    return storeAccount.warmPeers
  })

  const inviteList = computed(() => {
    return storeAccount.inviteListGenerated
  })

  const invitePending = computed(() => {
    return storeAccount.pendingInvites
  })

  const beebeeMessage = computed(() => {
    return storeAccount.beebeeAccountFeedback
  })

  const beebeeConnectionFeedback = computed(() => {
    return storeAccount.beebeeConnectFeedback
  })

  /* methods */
  const addWarmpeer = () => {
    addWarm.value = !addWarm.value
  }

  const peerMode = (mode) => {
    peerModeType.value = mode
  }

  const inviteMode = (mode) => {
    inviteModeType.value = mode
  }

  const generateInvite = async () => {
    if (peerName.value.length > 0) {
      // genInvite.value = !genInvite.value
      const byteBuffer = nameTo32Bytes(peerName.value)

      // Convert byteBuffer to a binary string
      let binaryString = ''
      for (let i = 0; i < byteBuffer.length; i++) {
          binaryString += String.fromCharCode(byteBuffer[i])
      }
      // Encode the binary string to Base64
      const base64String = btoa(binaryString)
      randomName.value = base64String
      // turn into a 256hash
      // Example usage
      let inviteHash = ''
       await sha256Make(base64String).then(hash => {
        inviteHash = hash
      })
      let inviteBundle = { name: peerName.value, publickey: storeAccount.networkInfo.publickey, codename: inviteHash, matched: false }
      storeAccount.inviteListGenerated.push(inviteBundle)
      // HOP needs to keep track of codename
      storeAccount.shareCodename(inviteBundle)
      // let unencodedName = atob(base64String)
      // Convert the binary string back to a byte buffer
      // const newByteBuffer = binaryStringToByteBuffer(binaryString)
      // console.log('New Byte Buffer:', newByteBuffer)
      // const originalNameCC = bytesToName(newByteBuffer); // Convert back to name
      // console.log('Original Name:', originalNameCC)
      // const originalName = bytesToName(byteBuffer) // Convert back to name
      // console.log('Original Name:', originalName)
    }
  }

  const bytesToName =(byteBuffer) => {
    let name = ''
    for (let i = 0; i < byteBuffer.length; i++) {
        name += String.fromCharCode(byteBuffer[i])
    }
    return name
  }

  const binaryStringToByteBuffer = (binaryString) => {
    let byteBuffer = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        byteBuffer[i] = binaryString.charCodeAt(i)
    }
    return byteBuffer
  }

  const sha256Make = async (message) => {
    // Encode the message as a Uint8Array
    const msgBuffer = new TextEncoder().encode(message)
    // Hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    
    // Convert the hash to a byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    // Convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  const copyGenInvite = (codename) => {
    // loop over invite list and match to code name
    let copyInvite = {}
    for (let invite of inviteList.value) {
      if (invite.codename === codename) {
        copyInvite = invite
      }
    }
    inviteGenCode.value = 'hop:' + copyInvite.publickey + copyInvite.codename
    navigator.clipboard.writeText(inviteGenCode.value)
    copiedInvite.value = codename
    setTimeout(() => {
      copiedInvite.value = null
    }, 2000)
  }
  
  const removeInvite = (codename) => {
    let updateInvite = []
    for (let invite of inviteList.value) {
      if (invite.codename !== codename) {
        updateInvite.push(invite)
      }
    }
    storeAccount.inviteListGenerated = updateInvite
  }
  const nameTo32Bytes = (name) => {
    // just random no need to encode name (privacy leak issue)
    const buffer = new Uint8Array(32) // Create a 32-byte buffer
    window.crypto.getRandomValues(buffer); // Fill with random values
    return buffer; // Return the 32-byte buffer
  }

  const sendInviteWarmpeer = () => {
    // send to HOP to save
    // temp
    let peerPair = {}
    peerPair.publickey = newPeerPubKey.value.trim()
    peerPair.name = newPeername.value.trim()
    peerPair.longterm = true
    peerPair.topic = ''
    peerPair.settopic = false
    peerPair.live = false
    // save to HOP and add
    storeAccount.pendingInvites.push(peerPair)
    storeAccount.addPeertoNetwork(peerPair)
    // clear the form
    newPeerPubKey.value = ''
    newPeername.value = ''
  }

  const directConnectPeer = (peer) => {
    // direct peer connect again
    storeAccount.retryPeertoNetwork(peer)
  }

  const removePeer = (peer) => {
    // remove peer
    storeAccount.removePeerfromNetwork(peer)

  }

  const copyKey = (key) => {
    navigator.clipboard.writeText(key)
  }

  const editPeer = (key) => {
    console.log('edit peer')
  }

</script>

<style scoped>

#list-space {
  width: 80%;
  min-height: 80vh;
}

#peer-modes {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

#peer-mode-prime {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#peer-mode-secondary {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#invite-types {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#peer-modes button {
  display: inline-grid;
  align-items: center;
  justify-content: center;
  margin-right: 0.4em;
  background-color: #b8cde2;
  color: #140d6b;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

#peer-modes button:hover {
  background-color: #2a82e0;
  transform: translateY(-2px);
}

#peer-modes button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}

#peer-modes button.active {
  background-color: #2a82e0;
  color: white;
  transform: translateY(-2px);
}

.type-peer {
  font-weight: bold;
  padding-left: 2em;
}

.raw-share-live {
  display: grid-inline;
  height: 3em;
}

.copied-message {
  display: fixed;
  background-color: rgb(188, 187, 233);
  transition: opacity 1s ease;
  opacity: 1;
  border-radius: 5%;
  padding: .2em;
}

.copied-message[style*="display: none"] {
  opacity: 0;
}

#network-keys {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  padding: 1em;
}

#add-peer {
  padding: 2em;
}

#add-warm-peer {
  height: 80px;
  margin: 1em;
}

#social-graph-space {
  display: grid;
  grid-template-columns: 1fr;
  height: 800px;
  width: 800px;
}

/* Add Peer Form */
.add-peer-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-peer-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

#receive-invite-mode {
  display: grid;
  grid-template-columns: 1fr;
}

#prepare-invite {
  display: grid;
  grid-template-columns: 1fr;
  height: 300px;
} 

.message-feedback {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 0.95em;
  opacity: 0;
  height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.message-feedback.has-message {
  opacity: 1;
  height: auto;
  min-height: 20px;
  padding: 12px 16px;
  margin-top: 20px;
}

/* Connection feedback (positive) */
#beebee-connection-feedback:not(:empty) {
  background-color: #ebf8ff;
  border-color: #90cdf4;
  color: #2b6cb0;
  font-weight: bold;
  animation: fadeOut 2s ease-in-out 2s forwards;
}

/* General message feedback (error) */
.message-feedback:not(:empty) {
  background-color: #fff5f5;
  border-color: #fed7d7;
  color: #e53e3e;
  animation: fadeOut 2s ease-in-out 2s forwards;
}

@keyframes fadeOut {
  from { 
    opacity: 1;
    height: auto;
    min-height: 20px;
    padding: 12px 16px;
    margin-top: 20px;
  }
  to { 
    opacity: 0;
    height: 0;
    min-height: 0;
    padding: 0 16px;
    margin-top: 0;
    overflow: hidden;
  }
}

/* Disabled button state */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Adjust the form input styles to be consistent */
#add-warm-peer .form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1em;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 8px;
}

#add-warm-peer .form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

/* Button styles */
#add-warm-peer .btn-primary {
  padding: 12px 24px;
  font-size: 1em;
  font-weight: 500;
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 8px;
}

#add-warm-peer .btn-primary:hover:not(:disabled) {
  background-color: #2c5282;
  transform: translateY(-1px);
}

#add-warm-peer .form-group {
  margin-bottom: 8px;
}

#invite-generation-button {
  width: 10em;
  height: 4em;
}

#generate-invite {
  display: grid;
  grid-template-columns: 1fr;
  padding: 2em;
}

#form-invite-code {
  display: grid;
  grid-template-columns: 1fr;
  padding: 1em;
  border: 1px solid lightgrey;
  width: 100%;
}

.invite-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 1.1em;
  color: #4a5568;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1em;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

#invite-generation-button {
  padding: 12px 24px;
  font-size: 1.1em;
  font-weight: 500;
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: auto;
  margin-top: 8px;
}

#invite-generation-button:hover {
  background-color: #2c5282;
  transform: translateY(-1px);
}

#invite-peer-crypto {
  display: grid;
  border: 0px solid lightgrey;
}

/* pending invites generated */
#send-invite-gen {
  display: grid;
  grid-template-columns: 1fr 1fr 3fr 5fr 1fr 1fr;
  border-bottom: 0px solid lightgrey;
  margin-bottom: 1em;
}

.btn {
  display: inline-grid;
  align-items: center;
  justify-content: center;
  background-color: #b8cde2;
  color: #140d6b;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 2px;
}

.btn:hover {
  background-color: #2a82e0;
  transform: translateY(-1px);
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}

.btn.active {
  background-color: #2a82e0;
  color: white;
  transform: translateY(-1px);
}

#button-copy-invite, #button-remove-invite {
  height: 32px;
  padding: 5px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
}

.gen-crypt-code {
  display: grid;
  border: 0px solid lightgrey;
  overflow: hidden;
}

.name-as-code {
  margin-left: 1em;
  justify-self: start;
  overflow: hidden;
  text-overflow: hidden;
}

#pending-invites {
  border: 2px solid rgb(208, 211, 240);
  padding: 1em;
}

/* socail grapth longer term */
.peer-list-set {
  display: grid;
  grid-template-columns: 1fr;
  border: 0px solid lightgrey;
  border-radius: 4%;
  margin-left: 1em;
  margin-left: 1em;
  margin-bottom: .5em;
  padding: .4em;
  background-color: rgb(242, 240, 248);
}

.peer-g {
  display: grid;
  grid-template-columns: 8fr 2fr;
  background-color: rgb(234, 234, 240);
  border-radius: 4%;
  padding: 0em;
}

.longterm-peer {
  display: grid;
}

.active {
  background-color: #4CAF50;
  color: white;
}

.peer-details-header {
  display: grid;
  grid-template-columns: 1fr 1fr 4fr 1fr;
  font-weight: bold;
  background-color: rgb(215, 215, 240);
  margin-bottom: .6em;
}

.peer-details {
  display: grid;
  grid-template-columns: 1fr 1fr 4fr 1fr;
}

.peer-info {
  display: inline-grid;
  font-size: .9em;
}

.peer-action {
  display: inline-grid;
  margin-left: .4em;
}

@media (min-width: 1024px) {

  #list-space {
    width: 80%;
    min-height: 80vh;
  }

  #network-keys {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    border-bottom: 1px solid lightgrey;
  }

  .type-peer {
    display: grid;
    grid-template-columns: 3fr 5fr 1fr;
    font-weight: bold;
    padding-left: 1em;
    padding-bottom: 1em;
    margin-bottom: 1em;
  }

}

</style>