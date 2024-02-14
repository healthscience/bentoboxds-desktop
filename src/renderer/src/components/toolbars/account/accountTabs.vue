<template>
  <div id="connection-lists">
    <div id="peer-social-network">
      <div id="tabs-component">
        <div class="spacer-component-tab"></div>
        <div
          class="grid-component-tab" v-bind:class="{ active: peerActive }"
          v-on:click="selectTab('peers')"
        >
          Peers
        </div>
        <div
          class="grid-component-tab" v-bind:class="{ active: dsActive }"
          v-on:click="selectTab('datastores')"
        >
          Datastores
        </div>
        <div
          class="grid-component-tab" v-bind:class="{ active: aiActive}"
          v-on:click="selectTab('aiagents')"
        >
          AI
        </div>
        <div
          class="grid-component-tab" v-bind:class="{ active: walletActive }"
          v-on:click="selectTab('wallets')"
        >
          Wallet
        </div>
        <div class="spacer-component-tab"></div>
      </div>
      <div id="list-content">{{ listContext }}
        <peer-list v-if="listContext === 'peers'"></peer-list>
        <div class="list-space" id="ai-list" v-if="listContext === 'ai'">
          <div id="ai-peers">
          </div>
        </div>
        <datastore-list v-if="listContext === 'datastores'"></datastore-list>
        <aiagents-list v-if="listContext === 'aiagents'"></aiagents-list>
        <div class="list-space" id="wallet-list" v-if="listContext === 'wallets'">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PeerList from '@/components/toolbars/account/tabs/peerList.vue'
import DatastoreList from '@/components/toolbars/account/tabs/datastoreList.vue'
import AiagentsList from '@/components/toolbars/account/tabs/aiagentsList.vue'

let peerActive = ref(false)
let dsActive = ref(false)
let aiActive = ref(false)
let walletActive = ref(false)
let listContext = ref('')


  const selectTab = (ls) => {
    if (ls === 'peers') {
      peerActive.value = !peerActive.value
    } else if (ls === 'datastores') {
      dsActive.value = !dsActive.value
    } else if (ls === 'aiagents') {
      aiActive.value = !aiActive.value
    } else if (ls === 'wallets') {
      walletActive.value = !walletActive.value
    }
    listContext = ls
  }

</script>

<style scoped>
#connection-lists {
  display: block;
  height: auto;
}
#tabs-component {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 2fr;
  height: auto;
}

.grid-component-tab {
  border-top: 2px solid grey;
  border-left: 2px solid grey;
  border-right: 2px solid grey;
  font-size: 1.2em;
  padding: 1em;
}

.grid-component-tab.active {
 background-color: lightgrey;
}

.is-disabled {
  background: white;
}

#list-content {
  border-left: 1px solid grey;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
  min-height: 240px;
  background-color: rgb(243, 242, 242);
  font-size: 1.2em;
  height: auto;
}

.list-space {
  display: block;
  height: auto;
  padding-top: 2em;
}
#peer-social-network {
  display: block;
  height: 100%;
  border-bottom: 1px solid rgb(245, 243, 243);
  margin-top: 0px;
}

#peer-social-network header {
  font-size: 1.4em;
  margin-top: 20px;
  margin-bottom: 20px;
}

#peers-listkeys {
  display: block;
  border-bottom: 1px solid rgb(233, 230, 230);
}

#peers-listkeys header {
  font-size: 1.4em;
  margin-top: 20px;
  margin-bottom: 20px;
}

#ai-peers {
  border-bottom: 1px solid grey;
}

#ai-peers header {
  font-size: 1.4em;
  margin-top: 20px;
  margin-bottom: 20px;
}

@media (min-width: 1024px) {

}

</style>
