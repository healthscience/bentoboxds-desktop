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
          id="sovereign-tab"
          class="grid-component-tab" v-bind:class="{ active: activeTab === 'sovereign' }"
          @click="selectTab('sovereign')"
        >
          Sovereign
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
        <div class="list-space" id="wallet-list" v-if="activeTab === 'sovereign'">
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
    } else if (ls === 'sovereign') {
      activeTab.value = 'sovereign'
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
  display: grid;
  grid-template-columns: 1fr;
  height: 98vh;
}

#tabs-component {
  display: flex;
  gap: 8px;
  padding: 16px 16px 0;
  background-color: #f5f7fa;
  border-radius: 8px 8px 0 0;
}

.grid-component-tab {
  position: relative;
  padding: 12px 20px;
  font-size: 1em;
  font-weight: 500;
  color: #4a5568;
  background-color: #e2e8f0;
  border: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  margin-right: 4px;
}

.grid-component-tab:hover {
  background-color: #cbd5e0;
  transform: translateY(-2px);
}

.grid-component-tab.active {
  background-color: white;
  color: #2b6cb0;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  border-bottom: 3px solid #2b6cb0;
  transform: translateY(0);
}

.grid-component-tab:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(43, 108, 176, 0.3);
}

.spacer-component-tab {
  flex-grow: 1;
}

#list-content {
  background-color: white;
  border-radius: 0 0 8px 8px;
  min-height: 240px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-size: 1em;
  height: auto;
  border: 1px solid #e2e8f0;
  border-top: none;
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
