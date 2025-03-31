<template>
  <div id="datastore-lists">
    <div class="list-space" id="datastore-list">
      <div id="public-datastores">
        Public datastores
      </div>
      <div id="peers-listkeys">
        <div v-if="swarmState === true" id="open-connect">Public Library OPEN for replication
        </div>
        <div id="private-datastores">
          Private datastores
        </div>
        <div id="drive-pubkey">
          Drive key: {{ storeAccount.publickeyDrive }}
        </div>
        <div class="peer-ledgers" v-for='pk in storeAccount.publicKeysList' :key='pk.id'>
          <div class="type-store"> {{ pk.store }}</div>
          <div class="type-store-key">pubkey- {{ pk.pubkey }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()

  let swarmState = ref(true)

</script>

<style scoped>
#datastore-lists {
  display: block;
  height: auto;
}

#replicate-librarydatastore {
  display: block;
  border-bottom: 1px solid grey;
}

#replicate-librarydatastore header {
  font-size: 1.4em;
  margin-top: 20px;
  margin-bottom: 20px;
}

@media (min-width: 1024px) {

  .peer-ledgers {
    display: grid;
    grid-template-columns: 1fr 4fr;
  }
  .type-store {
    font-weight: bold;
    padding-left: 2em;
    line-height: 4em;
  }

  .type-store-key {
    padding-right: 0em;
    line-height: 4em;
  }
}

</style>
