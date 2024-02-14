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
                <label class="form-couple-type" for="password-account">password</label>
                <input class="form-couple" type="password" id="password" name="password" v-model="selfpwInput">
                <button id="self-auth" @click.prevent="selfVerify">Self Verify</button>
              </div>
            </form>
          </div>
          <div v-else id="disconnect-signout">
            <button id="disconnect-button" @click="disconnectHOP">Disconnect and signout</button>
          </div>
        </div>
      </template>
      <template #connect>
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
      <template #tabs>
        <account-tabs v-if="storeAccount.peerauth === true"></account-tabs>
      </template>
      <template #footer>
        BentoBoxDS
      </template>
    </modal-auth>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalAuth from '@/components/toolbars/account/authModal.vue'
import AccountTabs from '@/components/toolbars/account/accountTabs.vue'

import { accountStore } from '@/stores/accountStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()

  let selfpwInput = ref('')

  const closeAccount = () => {
    storeAccount.accountStatus = !storeAccount.accountStatus
  }

  const selfVerify = () => {
    // need to setup pub/private key schnorr sign utilities
    storeAccount.peerauth = true
    storeAI.startChat = false
    storeAccount.accountStatus = false
    // send message to get history of chats, spaces, peers
    let saveBentoBoxsetting = {}
    saveBentoBoxsetting.type = 'bentobox'
    saveBentoBoxsetting.reftype = 'chat-history'
    saveBentoBoxsetting.action = 'start'
    saveBentoBoxsetting.task = 'start'
    saveBentoBoxsetting.data = ''
    saveBentoBoxsetting.bbid = ''
    storeAI.sendMessageHOP(saveBentoBoxsetting)
    storeAccount.accountMenu = 'account'
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

#return-modal-close {
  justify-content: right;
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
  }

  #self-verify {
    display: grid;
    justify-content: center;
  }

  #self-signin-form {
    background-color: antiquewhite;
    padding: 2em;
  }

  #disconnect-signout {
    display: grid;
    justify-content: right;
  }

  #disconnect-button {
    color: red;
  }
}

</style>