<template>
  <div id="list-space">
    <div id="network-keys">
      Public key: {{ storeAccount.networkInfo.publickey }}
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
    console.log('add warm peer')
    addWarm.value = !addWarm.value
  }

  const saveWarmpeer = () => {
    console.log('save warm peer')
    console.log(newPeername)
    console.log(newPeerPubKey)
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
    margin: .1em;
  }
}

</style>