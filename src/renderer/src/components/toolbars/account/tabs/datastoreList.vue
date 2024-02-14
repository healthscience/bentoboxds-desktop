<template>
  <div id="datastore-lists">
    <div class="list-space" id="datastore-list">
      <div id="peers-listkeys">
        <div v-if="swarmState === true" id="open-connect">Public Library OPEN for replication
        </div>
        <div id="drive-pubkey">
          Drive key: {{ storeAccount.publickeyDrive }}
        </div>
        Datastores
        <div class="peer-ledgers" v-for='pk in storeAccount.publicKeysList' :key='pk.id'>
          <div>{{ pk.store }} pubkey- {{ pk.pubkey }}
          <!-- <button type="button" class="btn" @click="openReplication(pk)">sync</button> -->
          </div>
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

}

</style>
