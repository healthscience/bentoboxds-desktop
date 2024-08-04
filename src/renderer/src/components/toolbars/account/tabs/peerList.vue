<template>
  <div id="list-space">
    <div id="network-keys">
      <div class="type-peer">Public key (network share):</div>
      <div class="type-peer-key">{{ storeAccount.networkInfo.publickey }}</div>
    </div>
    <button type="button" class="btn" @click.prevent="addWarmpeer()">Add new</button>
    <div v-if="addWarm === true" id="add-warm-peer">
      <input v-model="newPeername" placeholder="name">
      <input v-model="newPeerPubKey" placeholder="public key">
      <button type="button" class="btn" @click="saveWarmpeer()">save</button>
    </div>
    <ul class="peer-list-set" v-for='peer in storeAccount.warmPeers' :key='peer.id'>
      <li>Peer {{ peer.datastore }} --- {{ peer.name }} --- {{ peer.publickey }}
        <!-- <button type="button" class="btn" @click="peerSyncLibrary(peer.publickey)">Replicate</button> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()

  let addWarm = ref(false)
  let newPeername = ref('')
  let newPeerPubKey = ref('')

  const addWarmpeer = () => {
    addWarm.value = !addWarm.value
  }

  const saveWarmpeer = () => {
    // send to HOP to save
    // temp
    let peerPair = {}
    peerPair.publickey = newPeerPubKey
    peerPair.name = newPeername
    storeAccount.warmPeers.push(peerPair)
  }

</script>

<style scoped>

#network-keys {
  padding: 1em;
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