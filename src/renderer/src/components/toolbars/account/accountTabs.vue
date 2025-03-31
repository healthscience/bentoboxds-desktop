<template>
  <div id="connection-account">
    <div id="peer-social-network">
      <div id="tabs-component">
        <div class="spacer-component-tab"></div>
        <div
          id="peers-tab"
          class="grid-component-tab" v-bind:class="{ active: activeTab === 'peers' }"
          @click="selectTab('peers')"
        >
          Peers
        </div>
        <div
          id="datastores-tab"
          class="grid-component-tab" v-bind:class="{ active: activeTab === 'datastores' }"
          @click="selectTab('datastores')"
        >
          Datastores
        </div>
        <div
          id="aiagents-tab"
          class="grid-component-tab" v-bind:class="{ active: activeTab === 'aiagents' }"
          @click="selectTab('aiagents')"
        >
          AI Agents
        </div>
        <div
          id="wallets-tab"
          class="grid-component-tab" v-bind:class="{ active: activeTab === 'wallets' }"
          @click="selectTab('wallets')"
        >
          Wallet
        </div>
        <div class="grid-component-tab">
          Disconnect
          <div id="disconnect-signout">
            <button id="disconnect-button" @click="disconnectHOP">Disconnect and signout</button>
          </div>
        </div>
        <div class="spacer-component-tab"></div>
      </div>
      <div id="list-content">{{ activeTab }}
        <peer-list v-if="activeTab === 'peers'"></peer-list>
        <div class="list-space" id="ai-list" v-if="listContext === 'ai'">
          <div id="ai-peers">
          </div>
        </div>
        <datastore-list v-if="activeTab === 'datastores'"></datastore-list>
        <aiagents-list v-if="activeTab === 'aiagents'"></aiagents-list>
        <div class="list-space" id="wallet-list" v-if="activeTab === 'wallets'">
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
import { accountStore } from '@/stores/accountStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAccount = accountStore()
const storeAI = aiInterfaceStore()

let listContext = ref('peers')
let activeTab = ref('peers')

/*  methods  */
  const selectTab = (ls) => {
    if (ls === 'peers') {
      activeTab.value = 'peers'
    } else if (ls === 'datastores') {
      activeTab.value = 'datastores'
    } else if (ls === 'aiagents') {
      activeTab.value = 'aiagents'
    } else if (ls === 'wallets') {
      activeTab.value = 'wallets'
    }
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

</script>

<style scoped>
#connection-account {
  position: relative;
  display: block;
  height: 98vh;
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
 background-color: rgb(240, 242, 243);
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

  #connection-account {
    position: relative;
    display: grid;
    height: 98vh;
  }

}

</style>
