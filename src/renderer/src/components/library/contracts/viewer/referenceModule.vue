<template>
  <div id="reference-tools">
    <div id="task-select">
      <div class="contract-task">
        <button id="get-referencecontract" @click.prevent="getRefContracts()">Get Library Contracts</button>
        <div id="notify-library-start-replication" v-if="storeLibrary.startLibrary === true">
          <form id="library-replication-form">
            <label for="replicteplibrary"></label>
            <input type="input" id="publibkey" placeholder="librarykey" v-model="pubLibrarykey" autofocus>
            <button @click.prevent="startLibraryRepication">Start</button>
          </form>
        </div>
      </div>
      <!-- <div class="view-refconts">
        <button id="build-modulecontracts" @click.prevent="makeModulecontracts()">Make modules</button>
      </div> -->
      <div id="new-ref-contract1" class="contract-task-right">
        <button id="build-new-referencecontract" v-bind:class="{ active: newLibnxp === true }" @click.prevent="newSetRefContract(startRefContract)">{{ startRefContract.text }}</button>
      </div>
    </div>
    <div id="reference-contract-groups" v-if="libraryCheck">
      <div id="ref-contracts-view" class="ref-group">
        <header>Reference Contracts</header>
        <div class="view-contract">
          <button class="buttonexplore" id="questionCNRL" @click.prevent="viewRefContracts('question')">Question</button>
        </div>
        <div class="view-contract">
          <button class="buttonexplore" id="datatypesCNRL" @click.prevent="viewRefContracts('datatype')">datatypes</button>
        </div>
        <div class="view-contract">
          <button class="buttonexplore"  id="packaingCNRL" @click.prevent="viewRefContracts('packaging')">Data Packaging</button>
        </div>
        <div class="view-contract">
          <button class="buttonexplore"  id="computeCNRL" @click.prevent="viewRefContracts('compute')">compute</button>
        </div>
        <!-- <div class="view-contract">
          <button id="unitsCNRL" @click.prevent="viewRefContracts(CNRLunitseen.text)"> {{ CNRLunitseen.text }}</button>
        </div> -->
        <div class="view-contract">
          <button class="buttonexplore"  id="visualiseRefs" @click.prevent="viewRefContracts('visualise')">Visualise</button>
        </div>
      </div>
      <div id="module-contracts" class="ref-group">
        <header>Module Contracts</header>
        <div class="mod-contracts-view">
          <button class="buttonexplore" id="experimentCNRL" @click.prevent="viewRefContracts('experiment')">experiment-public</button>
        </div>
        <div class="mod-contracts-view">
          <button class="buttonexplore"  id="moduleRefs" @click.prevent="viewRefContracts('module')">modules-public</button>
        </div>
        <div class="mod-contracts-view">
          <button class="buttonexplore"  id="experimentCNRL" @click.prevent="viewRefContracts('private-experiment')">peer-experiment</button>
        </div>
        <div class="mod-contracts-view">
          <button class="buttonexplore" id="moduleRefs" @click.prevent="viewRefContracts('private-modules')">peer-modules </button>
        </div>
      </div>
      <div id="ledger-view" class="ref-group">
        <header>Ledger</header>
        <div class="mod-contracts-view">
          <button class="buttonexplore"  id="peer-results" @click.prevent="viewRefContracts('results')">Peer results</button>
        </div>
        <div class="mod-contracts-view">
          <button class="buttonexplore"  id="peer-kbl" @click.prevent="viewRefContracts('ledger')">Peer Ledger</button>
        </div>
      </div>
    </div>
    <div id="explorer-view" v-if="startRefContract.active != true">
      <view-reference v-if="referenceState === true" :refTypeLive="referenceLive"></view-reference>
      <view-modules v-if="moduleState === true" :refTypeLive="referenceLive"></view-modules>
      <view-results v-if="resultsState === true" :refTypeLive="referenceLive"></view-results>
      <view-ledger v-if="ledgerState === true" :refTypeLive="referenceLive"></view-ledger>
    </div>
    <new-refcontract v-if="startRefContract.active"></new-refcontract>
  </div>
</template>

<script setup>
import ViewReference from '@/components/library/contracts/viewer/viewReference.vue'
import ViewModules from '@/components/library/contracts/viewer/viewModules.vue'
import ViewResults from '@/components/library/hop/viewResults.vue'
import ViewLedger from '@/components/library/hop/viewLedger.vue'
import NewRefcontract from '@/components/library/contracts/contribute/newRefcontract.vue'
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()
  const storeLibrary = libraryStore()

  /* data */
  let referenceLive = ref('')
  let referenceState = ref(false)
  let moduleState = ref(false)
  let resultsState = ref(false)
  let ledgerState = ref(false)
  let newLibnxp = ref(false)
  let pubLibrarykey = ref('')

  let statusContract = ref(
    {
      active: false,
      text: 'Reference'
    }
  )

  let startRefContract = ref(
    {
      active: false,
      text: 'New Reference Contract'
    }
  )

  /* methods */
  const newSetRefContract = (ap) => {
      if (startRefContract.value.active === false) {
        newLibnxp.value = true
        startRefContract.value.active = true
        startRefContract.value.text = 'close'
      } else {
        newLibnxp.value = false
        startRefContract.value.active = false
        startRefContract.value.text = 'New ref. contract'
      }
    }

    const getRefContracts = () => {
      statusContract.active = true
      // referenceLive.value = 'datatype'
      // ask network library for contracts via HOP
      storeLibrary.sendMessage('get-library')
      storeLibrary.sendMessage('get-results')
    }

    const viewRefContracts = (type) => {
      // ask network library for contracts for this peer
      if (type === 'question' || type === 'datatype' || type === 'compute' || type === 'packaging' || type === 'visualise') {
        referenceLive.value = type
        referenceState.value = true
        moduleState.value = false
        resultsState.value = false
        ledgerState.value = false
      } else if (type === 'experiment' || type === 'private-experiment' || type === 'module' || type === 'private-modules') {
        referenceLive.value = type
        moduleState.value = true
        referenceState.value = false
        resultsState.value = false
        ledgerState.value = false
      } else if (type === 'results') {
        moduleState.value = false
        referenceState.value = false
        resultsState.value = true
        ledgerState.value = false
      } else if (type === 'ledger') {
        moduleState.value = false
        referenceState.value = false
        resultsState.value = false
        ledgerState.value = true
      }
    }

    const startLibraryRepication = () => {
      let shareInfo = {}
      shareInfo.type = 'library'
      shareInfo.action = 'account'
      shareInfo.task = 'replicate'
      shareInfo.reftype = 'publiclibrary'
      shareInfo.privacy = 'public'
      shareInfo.data = { discoverykey: pubLibrarykey.value }
      // console.log(shareInfo)
      storeAccount.sendMessageHOP(shareInfo)
    }

    // a computed ref
    const libraryCheck = computed(() => {
      // any entries in the library?
      if (Object.keys(storeLibrary.publicLibrary).length > 0) {
       return true
      } else {
        return false
      }
    })

</script>

<style scoped>

#reference-tools {
  display: grid;
  grid-template-columns: 1fr;
  background-color: antiquewhite;
}

#task-select {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#ref-contracts-view {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

#module-contracts {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

#reference-contract-groups {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.ref-group {
  border-left: 1px dashed rgb(228, 138, 69);
  padding-left: 20px;
}

#ref-contracts-view,#module-contracts,#ledger-view {
  display: grid;
  grid-template-columns: 1fr;
}

.buttonexplore {
  min-width: 200px;
  border: 2px solid orange;
}

@media (min-width: 1024px) {
 
  #task-select {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .contract-task {
    display: grid;
  }

  .contract-task-right {
    display: grid;
    justify-content: end;
  }

  .active {
    background-color: green;
  }

  #get-referencecontract {
    width: 30%;
  }

  #new-ref-contract {
    display: grid;
  }

  #build-new-referencecontract {
    display: grid;
    width: 200px;
  }

  #notify-library-start-replication {
    position: absolute;
    top: 1px;
    left: 180px;
  }

}

</style>