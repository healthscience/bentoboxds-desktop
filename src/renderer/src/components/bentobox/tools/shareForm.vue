<template>
  <div id="share-protocol">
    <div id="share-address">
      <form id="ask-ai-form" @submit.prevent="storeAccount.shareProtocol(props.bboxid, props.shareType)">
        <label for="sharepeer"></label>
        <input type="input" id="sharekey" placeholder="publickey" v-model="storeAccount.sharePubkey" autofocus>
      </form>
      <button id="share-send" type="submit" @click="sendPeerInvite()">
        Send invite
      </button>
    </div>
    <div id="peers-available">
      <h3>Peers available</h3>
      <select class="share-peer-list" id="peer-options-select" v-model="peerPshare" @change="selectPeerShare()">
        <option selected="" v-for="pp in peerWarmlist" :value="pp.key">
          {{ pp.value.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()
  
  let peerPshare = ref('')

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
    storeAccount.sharePubkey = peerPshare.value 
  }

  const sendPeerInvite = () => {
    storeAccount.shareProtocol(props.bboxid, props.shareType)
  }

</script>

<style scoped>

#share-protocol {
  display: grid;
  grid-template-columns: 1fr;
  padding: 2em;
  border: 1px solid lightblue;
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

@media (min-width: 1024px) {



}

</style>