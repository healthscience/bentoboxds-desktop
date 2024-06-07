<template>
  <div id="describe-data-structure">
    Please select the device table:
    <div id="tables-available">
      <select class="select-table-db" id="" v-model="tableChoice" @change="selectdbTalbe()">
        <option class="tables-options" selected=""  v-for="tab in dbTables" :value="tab">
          {{ tab.name }}
          </option>
      </select>
      <button id="" @click="showDevices">Show devices</button>
    </div> 
    <div id="devices-list">
      <select class="select-table-db" id="" v-model="deviceChoice" @change="selectDevice()">
         <option class="tables-options" selected=""  v-for="dev in dbDevices" :value="dev">
          {{ dev }}
          </option>
      </select>
    </div> -- {{ deviceColumns }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  let tableChoice = ref('')
  let deviceChoice = ref('')

  /* computed */
  const dbTables = computed(() => {
    return storeLibrary.describeSource.tables
  })

  const dbDevices = computed(() => {
    storeLibrary.newPackagingForm.devicesList = storeLibrary.newDatafile.device
    return storeLibrary.newDatafile.device
  })

  const deviceColumns = computed(() => {
    let columns = []
    for (let col of storeLibrary.newDatafile.devicecolumns) {
      columns.push(col.name)
    }
    storeLibrary.newPackagingForm.deviceColumns = columns
    return columns
  })
  /*  methods */
  const selectdbTalbe = () => {
    console.log('table select')
  }

  const showDevices = () => {
    // send message to HOP to get columsn for this table
    let messageHOP = {}
    messageHOP.type = 'library'
    messageHOP.action = 'source'
    messageHOP.reftype = storeLibrary.newPackagingForm.type
    messageHOP.privacy = 'private'
    messageHOP.task = 'GET'
    messageHOP.data = { query: 'devices', db: storeLibrary.describeSource.path, table: tableChoice.value.name }
    console.log(messageHOP)
    storeLibrary.sendMessage(messageHOP)
  }

  const selectDevice = () => {
    console.log('device')
  }

</script>

<style scoped>

@media (min-width: 1024px) {
  #describe-data-structure {
    display: grid;
    grid-template-columns: 1fr;
  }

  #tables-available {
    display: grid;
    grid-template-columns: 2fr 1fr;
    margin: 1em;
    background-color: bisque;
  }

  .tables-option {
    background-color: bisque;
  }

  .select-table-db {
    width: 100%;
  }
}
</style>