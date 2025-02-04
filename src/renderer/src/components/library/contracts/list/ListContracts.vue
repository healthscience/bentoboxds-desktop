<template>
  <div id="grid-contracts">
    <div class="list-table">
      <div class="table-header">
        <div class="row-header">
          <div class="header-items" v-for="col in props.columns">
           {{ col }}
          </div>
        </div>
      </div>
      <div v-if="props.experiments.length > 0" class="table-rows">
        <div class="alternate-bk" v-for="entry in props.experiments">
          <div class="table-row-columns" v-for="col in props.columns">
            <div v-if="col !== 'action'">
              {{ entry[col] }}
            </div>
            <div v-else class="action-options">
              <button type="button" class="constract-action" @click="actionBoard(entry, entry[col])">{{ entry[col] }}</button>
              <div class="constract-action share-action" v-if="props.privacy === 'public'"><a href="#" @click="sharePubExp(entry)">share</a></div>
              <div class="constract-action"><a class="remove-warn" href="#" @click="removeExp(entry)">remove</a></div>
            </div>
          </div>
        </div>
        <div class="share-protocol-nxp" v-if="shareProtocol">
          <div class="share-board-summary">Share {{ shareBoardID.name }}</div>
          <share-protocol :shareType="'publicboard'"></share-protocol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ShareProtocol from '@/components/bentobox/tools/shareForm.vue'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()
  const storeLibrary = libraryStore()
  const storeAI = aiInterfaceStore()

  const shareProtocol = ref(false)
  let shareBoardID = ref({})

  const props = defineProps({
    experiments: Array,
    columns: Array,
    privacy: String
  })

  const sortBy = (key) => {
    this.sortKey = key
    this.sortOrders[key] = this.sortOrders[key] * -1
  }

  const actionBoard = (board, actionType) => {
    if (actionType === 'View') {
      storeLibrary.prepareLibraryViewMessage(board, 'networkexperiment')
      storeAI.dataBoxStatus = true
      // this.$store.dispatch('actionHOPoutState', board)
      // this.$store.dispatch('actionDashboardState', board)
    } else if (actionType === 'Join') {
      storeLibrary.joinSelected = board
      storeLibrary.joinNXP = true
      storeLibrary.uploadStatus = true
      // need to look at queries and perform them
    } else {
      // preview network experiment
      // this.$store.dispatch('actionJOINViewexperiment', board)
      // this.refContractLookup()
    }
  }

  const sharePubExp = (pubBoard) => {
    shareBoardID.value = pubBoard
    storeAccount.shareBoardNXP = shareBoardID.value
    shareProtocol.value = !shareProtocol.value
  }

  const removeExp = (exp) => {
    console.log(exp)
    storeLibrary.removeExpModContract(exp.id, props.privacy)
    if (props.privacy === 'private') {
      let index = storeLibrary.peerExperimentList.data.indexOf(exp.id)
      storeLibrary.peerExperimentList.data.splice(index, 1)
    } else if (props.privacy === 'public') {
      let index = storeLibrary.listPublicNXP.data.indexOf(exp.id)
      storeLibrary.listPublicNXP.data.splice(index, 1)
    }
  }

</script>

<style scoped>
#grid-contracts {
  max-height: 30em;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: 1fr;
  width: 96%;
}

.list-table {
  display: grid;
}

.row-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  border: 1px solid lightgrey;
  height: 40px;
}

.header-items {
  align-self: center;
  background-color: lightgrey;
  padding: .4em;
}

.header-items:nth-child(1) {
  width: 21em;
}

.table-rows {
  display: grid;
  grid-template-columns: 1fr;
}

.action-options {
  display: grid;
  grid-template-columns: 1fr;
}

.constract-action {
  display: block;
}

.alternate-bk {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  height: auto;
  justify-content: bottom;
  background-color: white;
}

.table-row-columns {
  align-self: center;
}

.alternate-bk:nth-child(even) {
  background-color: #ffefd5;
}

.scale-space.active {
  background-color: #4CAF50; /* Green */
}

.share-action {
  font-size: 1.1em;
}

.remove-warn {
  color: red;
}

  @media (min-width: 1024px) {
    #grid-contracts {
      max-height: 30em;
      overflow-y: scroll;
      display: grid;
      grid-template-columns: 1fr;
      width: 96%;
    }

    .list-table {
      display: grid;
    }

    .row-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      border: 1px solid lightgrey;
      height: 40px;
    }

    .header-items {
      align-self: center;
      background-color: lightgrey;
      padding: .4em;
    }

    .header-items:nth-child(1) {
      width: 21em;
    }

    .table-rows {
      display: grid;
      grid-template-columns: 1fr;
    }

    .action-options {
      display: grid;
      grid-template-columns: 1fr;
    }

    .constract-action {
      display: block;
    }

    .alternate-bk {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      height: auto;
      justify-content: bottom;
      background-color: white;
    }

    .table-row-columns {
      align-self: center;
    }

    .alternate-bk:nth-child(even) {
      background-color: #ffefd5;
    }

    .scale-space.active {
      background-color: #4CAF50; /* Green */
    }

    .share-action {
      font-size: 1.2em;
    }

    .remove-warn {
      color: red;
    }

    .share-board-summary {
      font-size: 1.2em;
      font-weight: bold;
    }
  }
</style>
