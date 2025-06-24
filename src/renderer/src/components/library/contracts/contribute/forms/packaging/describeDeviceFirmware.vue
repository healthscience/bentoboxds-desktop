<template>
  <div id="describe-data-structure">
    Please select the firmware history table:
    <div id="tables-available">
      <select class="select-table-db" id="" v-model="tableChoice" @change="selectdbTalbe()">
        <option class="tables-options" v-for="tab in dbTables" :value="tab">
          {{ tab.name }}
          </option>
      </select>
      <button id="" @click="showDevices()">Show firmware</button>
    </div> 
    <div id="devices-list" v-if="props.fileTypeIn !== 'sqlite'">
      <!--<select class="select-table-db" id="" v-model="deviceChoice" @change="selectDevice()">
         <option class="tables-options" selected=""  v-for="dev in dbDevices" :value="dev">
          {{ dev }}
          </option>
      </select>-->
      <div id="devices-list">
      <div class="select-table-db" id="">
         <div class="tables-options"v-for="dev in dbDevices" :value="dev">
          <div class="tables-column-options" v-for="(coli, index) in dev" :value="dev">
            <button class="tables-column-buttons" @click="columnItem(coli, index)">{{ coli }} {{ index }}</button>
          </div>
         </div>
      </div>
    </div>
    </div>
    <div id="devices-list" v-if="props.fileTypeIn === 'sqlite'">
      <div class="select-table-db" id="">
         <div class="tables-options"v-for="dev in dbDevices" :value="dev">
          <div class="tables-column-options" v-for="(coli, index) in dev" :value="dev">
            <button class="tables-column-buttons" @click="columnItem(coli, index)">{{ coli }} {{ index }}</button>
          </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  const props = defineProps({
    fileTypeIn: String,
    bboxid: String
  })

  const emit = defineEmits(['deviceFilter', 'deviceId'])

  let tableChoice = ref('')
  let deviceChoice = ref('')

  /* computed */
  const dbTables = computed(() => {
    return storeLibrary.describeSource.tables
  })

  const dbDevices = computed(() => {
    // storeLibrary.newPackagingForm.devicesList = storeLibrary.newDatafile.device
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
    console.log('firm ware')
    console.log(tableChoice.value.name)
    storeLibrary.newDatafile.firmwareQuery = tableChoice.value.name
  }

  const showDevices = () => {
    storeLibrary.newPackagingForm.firmwareQuery = tableChoice.value.name
    // file type coming from library or chat UI?
    let fileType = ''
    if (storeLibrary.newPackagingForm.type.length > 0) {
      fileType = storeLibrary.newPackagingForm.type
    } else {
      fileType = props.fileTypeIn
    }
    // set bboxid for this interaction
    storeLibrary.liveBBox = props.bboxid
    // send message to HOP to get columsn for this table
    let messageHOP = {}
    messageHOP.type = 'library'
    messageHOP.action = 'source'
    messageHOP.reftype = fileType
    messageHOP.privacy = 'private'
    messageHOP.task = 'GET'
    messageHOP.data = { query: 'devices', db: storeLibrary.describeSource.path, table: tableChoice.value.name }
    storeLibrary.sendMessage(messageHOP)
  }

  const selectDevice = () => {
    storeLibrary.newDatafile.deviceSelected = deviceChoice.value
    // need form query if beebee chat UI flow
    if (props.fileTypeIn.length > 0) {
      emit('deviceFilter')
    }
  }

  const columnItem = (coli, index) => {
    // emit('deviceId')
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

  .tables-options {
    display: grid;
    grid-auto-flow: column;
    /*grid-auto-columns: 100px;
    grid-template-columns: repeat(auto-fill);*/
  }

  .tables-column-options {
    display: grid;
  }

  .tables-column-buttons {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: 100px;
    grid-template-rows: repeat(auto-fill);
    width: auto;
    padding-left: 1em;
    margin-left: 0.4em;
    margin-bottom: 1em;;
  }

}
</style>