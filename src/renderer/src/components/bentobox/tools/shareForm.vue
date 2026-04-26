<template>
  <div id="share-protocol">
    <div id="peer-selected" v-if="storeAccount?.sharePubkey?.value?.name !== undefined">
      {{ sharedPeertemp }}
    </div>
    <div id="share-address">
      <form id="ask-ai-form" @submit.prevent="storeAccount.shareProtocol(props.bboxid, props.shareType)">
        <label for="sharepeer"></label>
        <input type="input" id="sharekey" placeholder="publickey" v-model="storeAccount.sharePubkey.key" autofocus>
      </form>
      <button id="share-send" type="submit" @click="sendPeerInvite()">
        Send invite
      </button>
      <div v-if="sentMessage" class="shared-message">Shared with {{ sharedPeertemp }}</div>
    </div>
    <div id="peers-available">
      <h3>Peers available</h3>
      <select class="share-peer-list" id="peer-options-select" v-model="peerPshare" @change="selectPeerShare()">
        <option selected="" v-for="pp in peerWarmlist" :value="pp">
          {{ pp.value.name }}
        </option>
      </select>
    </div>
    <div id="feedback-share" class="feedback">
      {{ feedbackShare }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()
  
  let peerPshare = ref('')
  let sentMessage = ref(false)
  let sharedPeertemp = ref('')
  let feedbackShare = ref('')

  /* props */
  const props = defineProps({
    bboxid: String,
    shareType: String
  })

  /* computed */
  const peerWarmlist = computed(() => {
    // warm peers filter to unique & live
    return storeAccount.warmPeers.filter(p => p.value.live === true)
  })

  /* methods */
  const selectPeerShare = () => {
    feedbackShare.value = ''
    sharedPeertemp.value = peerPshare.value.value.name
    storeAccount.sharePubkey = peerPshare.value
  }

  const sendPeerInvite = () => {
    // check if peer pubkey is valid
    if (storeAccount.sharePubkey?.key?.length > 0) {
      storeAccount.shareProtocol(props.bboxid, props.shareType)
      sentMessage.value = true
      setTimeout(() => {
        sentMessage.value = false
        sharedPeertemp.value = ''
        peerPshare.value = null
      }, 2000)
    } else {
      feedbackShare.value = 'Please select a peer'
    }
  }

</script>

<style scoped>

#share-protocol {
  display: grid;
  grid-template-columns: 1fr;
  padding: 2em;
  border: 1px solid lightblue;
}

#peer-selected {
  font-weight: bold;
}

#share-address {
 display: grid;
 grid-template-columns: 4fr 1fr; 
}

#ask-ai-form input{
  width: 90%;
}

.share-peer-list {
  width: 90%;
}

.shared-message {
  display: fixed;
  background-color: rgb(188, 187, 233);
  transition: opacity 1s ease;
  opacity: 1;
  border-radius: 5%;
  padding: .2em;
}

@media (min-width: 1024px) {



}

</style>