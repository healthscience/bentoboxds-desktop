<template>
  <div id="list-space">
    <div id="network-keys">
      <div class="type-peer">Public key (network share):</div>
      <div class="type-peer-key">{{ storeAccount.networkInfo.publickey }} <button @click="copyKey(storeAccount.networkInfo.publickey)">copy</button></div> 
    </div>
    <div id="add-peer">
      <button type="button" class="btn-peer-add" @click.prevent="addWarmpeer()">Add new</button>
      <div v-if="addWarm === true" id="add-warm-peer">
        <input v-model="newPeername" placeholder="name">
        <input v-model="newPeerPubKey" placeholder="public key">
        <button type="button" class="btn" @click="saveWarmpeer()">Send invite</button>
      </div>
      <div id="beebee-message-feedback">
        {{ beebeeMessage }}
      </div>
    </div>
    <div class="peer-list-set" v-for='peer in peerNetwork' :key='peer.key'>
      <div class="peer-g">
        <div class="longterm-peer">
          {{ peer?.value?.name }} -- {{ peer?.value?.live }} --- {{ peer.key }} --- <button @click="copyKey(peer.key)">copy</button>
        </div>
        <!--if longterm show button to reconnect or (TODO remove)-->
        <div class="longterm-peer" v-if="peer?.longterm === true">
          <button @click="directConnectPeer(peer)">reconnect</button>
        </div>
        <div class="longterm-peer">
          <button @click="removePeer(peer)">remove</button>
        </div>
      </div>
    </div>
    <div id="social-graph-space">
      <social-graph></social-graph>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { accountStore } from '@/stores/accountStore.js'
import SocialGraph from '@/components/toolbars/account/graphs/socialGraph.vue'

  const storeAccount = accountStore()

  let addWarm = ref(false)
  let newPeername = ref('')
  let newPeerPubKey = ref('')

  /* computed */
  const peerNetwork = computed(() => {
    return storeAccount.warmPeers
  })

  const beebeeMessage = computed(() => {
    return storeAccount.beebeeAccountFeedback
  })

  /* methods */
  const addWarmpeer = () => {
    addWarm.value = !addWarm.value
  }

  const saveWarmpeer = () => {
    // send to HOP to save
    // temp
    let peerPair = {}
    peerPair.publickey = newPeerPubKey.value
    peerPair.name = newPeername.value
    peerPair.longterm = true
    peerPair.topic = ''
    peerPair.setopic = false
    peerPair.live = false
    // save to HOP and add
    storeAccount.addPeertoNetwork(peerPair)
    // clear the form
    newPeerPubKey.value = ''
    newPeername.value = ''
  }

  const directConnectPeer = (peer) => {
    // direct peer connect again
  }

  const removePeer = (peer) => {
    // remove peer
    storeAccount.removePeerfromNetwork(peer)

  }

  const copyKey = (key) => {
    navigator.clipboard.writeText(key)
  }

</script>

<style scoped>

#network-keys {
  padding: 1em;
}

#add-peer {
  padding: 2em;
}

#add-warm-peer {
  height: 80px;
  margin: 1em;
}

.peer-list-set {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid lightgrey;
  border-radius: 4%;
  margin-left: 1em;
  margin-left: 1em;
  margin-bottom: 1em;
  padding: 2em;
}

.peer-g {
  display: grid;
  grid-template-columns: 6fr 1fr 1fr;
}

#social-graph-space {
  display: grid;
  grid-template-columns: 1fr;
  height: 800px;
  width: 800px;
}

#beebee-message-feedback {
  display: grid;
  grid-template-columns: 1fr;
  color: rgb(221, 20, 47);
  border: 1px solid lightgrey;
  border-radius: 4%;
  margin-left: 1em;
  margin-left: 1em;
  margin-bottom: 1em;
  padding: 2em;
}

@media (min-width: 1024px) {

  #list-space {
    min-height: 60vh;
  }

  #network-keys {
    display: grid;
    grid-template-columns: 1fr 4fr;
  }
  .type-peer {
    font-weight: bold;
    padding-left: 2em;
    line-height: 4em;
  }

  .type-peer-key {
    padding-right: 0em;
    line-height: 4em;
  }
}

</style>