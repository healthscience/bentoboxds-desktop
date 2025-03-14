<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-auth :show="accountBoxStatus" @close="closeAccount">
      <template #header>
        <!-- The code below goes into the header slot -->
        <div id="account-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeAccount"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="return-modal-close" @click="closeAccount">return</div>
        </div>
      </template>
      <template #body>
        <div id="connect-hop">
          <div id="self-verify" v-if="storeAccount.peerauth !== true">
            <form id="self-signin-form" >
              <div class="self-inputs">
                <!--<label class="form-couple-type" for="password-account">password </label>
                <input class="form-couple" type="password" id="password" name="password" v-model="selfpwInput">-->
                <button id="self-auth" @click.prevent="selfVerify()">Connect to HOP</button>
              </div>
            </form>
            <div id="verify-feedback">
              {{ verifyFeedback }}
            </div>
          </div>
          <!--<div v-else id="disconnect-signout">
            <button id="disconnect-button" @click="disconnectHOP">Disconnect and signout</button>
          </div>-->
        </div>
      </template>
      <template #tabs>
        <account-tabs v-if="storeAccount.peerauth === true"></account-tabs>
      </template>
      <template #connect>
        <div id="connectivity">
          <div id="connect-socket" v-if="connectNetworkstatus === true"></div>
          <div id="connect-socket-loss" v-else="connectLoss === true"></div>
          <div id="connect-socket-loss" v-if="connectLoss === true"><button @click="reconnectSocket()">Reconnect to HOP</button></div>
        </div>
        <!-- <div id="network-status" v-if="peerauth === true">
          <div class="status-info">
            Connection Status: <div class="hon-square-status" v-bind:class="{ active: connectNetworkstatus === true && peerauth === true }"></div>
          </div>
          <div class="status-info">
            Warm peers connected: {{ warmPeers.length }}
          </div>
          <div v-if="peerauth === true" class="status-info">
            <button class="buttonspaces" @click.prevent="closeModal">go to bento spaces</button>
          </div>
        </div>-->
      </template>
      <template #footer>
        <div id="footer-self">
          BentoBoxDS - v0.2.6 HOP v0.4.0
        </div>
      </template>
    </modal-auth>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalAuth from '@/components/toolbars/account/authModal.vue'
import AccountTabs from '@/components/toolbars/account/accountTabs.vue'

import { useSocketStore } from '@/stores/socket.js'
import { accountStore } from '@/stores/accountStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeSocket = useSocketStore()
  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()

  let selfpwInput = ref('')
  let verifyFeedback = ref('')

  /* computed */
  const connectNetworkstatus = computed(() => {
    return storeSocket.connection_ready
  })

  const connectLoss = computed(() => {
    return storeSocket.connection_loss
  })

  const connectError = computed(() => {
    return storeSocket.connection_error
  })

  const closeAccount = () => {
    storeAccount.accountStatus = !storeAccount.accountStatus
  }

  const selfVerify = () => {
    verifyFeedback.value = ''
    // need to setup pub/private key schnorr sign utilities
    let pwCheck = selfpwInput.value
    // take local info and auth HOP with that
    if (pwCheck.length === 0) {
      let saveBentoBoxsetting = {}
      saveBentoBoxsetting.type = 'hop-auth'
      saveBentoBoxsetting.reftype = 'self-auth'
      saveBentoBoxsetting.action = 'start'
      saveBentoBoxsetting.task = 'start'
      saveBentoBoxsetting.data = { pw: pwCheck }
      saveBentoBoxsetting.bbid = ''
      storeAI.sendMessageHOP(saveBentoBoxsetting)
      selfpwInput.value = ''
    } else {
      verifyFeedback.value = 'password incorrect, try again please.'
    }
  }

  const reconnectSocket = () => {
    window.electron.send('message-from-vue', 'Hello from BentoBoxDS')
    storeSocket.connection_loss = false
    storeSocket.connection_error = false
    setTimeout(() => {
        storeSocket.init_chat()
    }, 4000)
  }

  const disconnectHOP= () => {
    // close HOP and websockt
    let disconnectHOP = {}
    disconnectHOP.type = 'close'
    storeAccount.sendMessageHOP(disconnectHOP)
    storeAccount.accountStatus = false
    storeAccount.accountMenu = 'Sign-in'
    storeAI.clearData()
  }

  const accountBoxStatus = computed(() => {
    return storeAccount.accountStatus
  })

</script>

<style scoped>


#connect-hop {
  display: grid;
  grid-template-columns: 1fr;
  padding-top: 0em;
  min-height: 0vh;
}

#self-auth {
  font-size: 1.4em;
  padding: 1em;
}

#return-modal-close {
  justify-content: right;
}

#verify-feedback {
  margin-top: 1em;
  color: red;
}

#connectivity {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  align-items: center;
  height: 23vh;
  margin: 2em;
}

#connect-socket {
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background-color: lightgreen;
}

#connect-socket-loss {
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background-color: rgb(244, 66, 66);
}

#footer-self {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  align-items: center;
}

@media (min-width: 1024px) {

  #account-modal-header {
    display: grid;
    grid-template-columns: 1fr 10fr;
  }

  #return-modal-close {
    display: grid;
    justify-content: right;
  }

  #connect-hop {
    display: grid;
    grid-template-columns: 1fr;
    padding-top: 0em;
    min-height: 2vh;
  }

  #self-verify {
    display: grid;
    justify-content: center;
  }

  #self-signin-form {
    margin-top: 6em;
    border-radius: 5%;
    background-color: rgb(239, 241, 247);
    padding: 2em;
  }

  #disconnect-signout {
    display: grid;
    justify-content: right;
    height: 50px;
  }

  #disconnect-button {
    color: red;
  }
}

</style>
