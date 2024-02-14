<template>
  <div id="describe-data">
    <div id="library-datatypes"
      v-on:dragover.prevent
      v-on:drop="handleDrop($event, libraryDatatypes)"
    >
      <h3>Datatypes available</h3>
      <div class="list-dt-item" 
          v-for="(element) in storeLibrary.publicLibrary.datatype"
          :key="element.key"
          draggable="true"
          v-on:dragstart="handleDragStart($event, element)"
        >
          {{ element.value.concept.name }}
      </div>
    </div>
    <div id="match-datatypes">
      <header>Drag datatype to column name</header>
      <div
        v-for='col in storeLibrary.newDatafile.columns'
        :key='col.id'
      >
        <div class="col-name"

        >
          <h3>{{ col.name }}</h3>
          <div class="list-group" :list="storeLibrary.newLists[col.count]" group="matchdt" 
            v-on:dragover.prevent
            v-on:drop="handleDrop($event, col.count)"
          >
            <div
              class="list-match-item">
              {{ storeLibrary.newLists[col.count]?.value.concept.name }}
            </div>
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

  let libraryDatatypes = ref(storeLibrary.publicLibrary.datatype)

  /* computed */
  const dtcolumns = computed(() => {
    return storeLibrary.newPackingForm.apicolHolder
  })

  const handleDragStart = (event, itemData) => {
    event.dataTransfer.setData('application/json', JSON.stringify(itemData))
  }

  const handleDrop = (event, targetContainer) => {
    const itemData = JSON.parse(event.dataTransfer.getData('application/json'))
    // match id to datatype
    let matchDatatype = itemData
    storeLibrary.newLists[targetContainer] = {}
    storeLibrary.newLists[targetContainer] = matchDatatype
  }

</script>

<style scoped>
#describe-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#library-datatypes {
  border: 2px solid blue;
}

#match-datatypes {
  border: 2px solid green;
}

.col-name {
  display: inline-block;
  vertical-align: text-top;
  width: 60%;
}

#data-columns {
  border: 1px solid orange;
  min-height: 400px;
  vertical-align: text-top;
  display: inline-block;
  width: 40%;
}

.list-group {
  border: 1px solid lightgrey;
  background-color: white;
  min-height: 4em;
}

.list-group-item {
  display: block;
  width: 80%;
  padding: .5em;
  margin: 1em;
  border: 1px solid lightgrey;
  background-color: #E6ECEC;
}

.list-dt-item {
  display: block;
  width: 200px;
  padding: .5em;
  margin: 1em;
  border: 2px solid orange;
  background-color: #E6ECEC;
}

.list-match-item {
  display: block;
  width: 200px;
  padding: .5em;
  margin: 1em;
  border: 2px solid orange;
  background-color: #E6ECEC;
}
</style>
