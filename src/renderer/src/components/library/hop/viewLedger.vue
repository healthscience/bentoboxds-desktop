<template>
  <div id="cnrl-view"> KBLedger VIEWER
    <div v-for="cd in ledgerData" :key="cd.id">
      <results-view v-if="viewType === 'ledger-view'">
        <template v-slot:header>
          PoW -- {{ cd.key }}
        </template>
        <template v-slot:body>
          Results Hash -- {{ cd.value }}
        </template>
      </results-view>
    </div>
  </div>
</template>

<script setup>
import ResultsView from '@/components/library/hop/ledgerViewer.vue'

import { libraryStore } from '@/stores/libraryStore.js'
import { ref, computed } from 'vue'

  const storeLibrary = libraryStore()

  const props = defineProps({
    refTypeLive:
      {
       type: String
     }
  })

  let viewType = ref('ledger-view')

  /*  computed  */
  const ledgerData = computed(() => {
    return storeLibrary.peerLedger
  })

</script>


<style scoped>
#refcontract-summary {
  display: grid;
  grid-template-columns: 1fr;
}

.ref-wrapper {
  border: 1px solid grey;
  margin: 1em;
  list-style-type: none;
}

.refname {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  margin-bottom: .5em;
}

.refinfo-col1 {
  justify-self: end;
  color: grey;
}

.refinfo-col2 {
  justify-self: start;
  margin-left: 1em;
}

.ref-description {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: .2em;
}

.cnrl-element {
  display: inline-block;
  margin-bottom: 1em;
}

#date-format {
  font-size: 0.6em;
}

#datatype-slot {
  margin: 1em;
}

#compute-slot header {
  margin-left: 4em;
  text-align: left;
}

#compute-slot ul li {
  margin-left: 4em;
  text-align: left;
  list-style-type: none;
}

.packaging-basics {
  text-align: left;
  margin-top: 0.5em;
}

#packaging-slot ul {
  list-style-type: none;
}

#table-structure {
  margin-top: 1em;
  text-align: left;
}

.packaging-lists {
  list-style-type: none;
}

.dt-map-key {
  display: inline;
  font-weight: normal;
  width: 300px;
  margin-right: 1em;
}

.dt-map-column {
  display: inline;
  font-weight: bold;
  min-width: 6em;
}

#packaging-network {
  margin-top: 2em;
  margin-left: 2em;
  text-align: left;
}

#visualise-slot header {
  text-align: left;
  margin-left: 2em;
}

#visualise-slot ul li {
  text-align: left;
  margin-left: 2em;
  list-style-type: none;
}

.vis-type {
  display: inline;
  width: 200px;
  font-weight: bold;
}

.vis-info {
  display: inline;
}
#goverannce-slot {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 1em;
}

.key-hash {
  margin-bottom: 1em;
}
</style>
