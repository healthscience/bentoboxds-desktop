<template>
  <div id="describe-data">
    <div id="library-datatypes"
      v-on:dragover.prevent
      v-on:drop="handleDrop($event, 'library-datatypes', null)"
    >
      <h3>Datatypes available</h3>
      <div class="list-dt-item" 
          v-for="(element) in storeLibrary?.publicLibrary?.referenceContracts?.datatype"
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
        v-for='col in storeLibrary?.newDatafile?.columns'
        :key='col.id'
      >
        <div class="col-name">
          <h3>{{ col.name }}</h3>
          <div class="list-group" :list="storeLibrary.newLists[col.cid]" group="matchdt" 
            v-on:dragover.prevent
            v-on:drop="handleDrop($event, 'match-column', col.cid)"
          >
            <div class="list-match-item"  draggable="true"
              v-on:dragstart="handleDragStart($event, col.cid)"
            >
              {{ storeLibrary.newLists[col.cid]?.value?.concept?.name }}
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

  /* computed */
  const handleDragStart = (event, itemData) => {
    event.dataTransfer.setData('application/json', JSON.stringify(itemData))
  }

  const handleDrop = (event, targetContainer, dti) => {
    const itemData = JSON.parse(event.dataTransfer.getData('application/json'))
    // make pair of column source name and ref DT contract hash ie key
    if (targetContainer === 'match-column') {
      // the reference contract
      let matchRefDT =  storeLibrary.newLists[dti]
      // the column name
      let columnName = storeLibrary.newDatafile.columns[dti]
      // match id to datatype
      let matchDatatype = itemData
      storeLibrary.newListsave[columnName.name] = {}
      storeLibrary.newListsave[columnName.name] = matchDatatype.key
      storeLibrary.newLists[dti] = {}
      storeLibrary.newLists[dti] = matchDatatype
      storeLibrary.newPackagingForm.filename = storeLibrary.newDatafile.file
      storeLibrary.newPackagingForm.path = storeLibrary.newDatafile.path
      storeLibrary.newPackagingForm.apicolumns = storeLibrary.newDatafile.columns
      storeLibrary.newPackagingForm.apicolHolder = storeLibrary.newListsave
    } else if (targetContainer === 'library-datatypes') {
      // remove the match by column name
      let columnName = storeLibrary.newDatafile.columns[itemData]
      delete storeLibrary.newListsave[columnName.name]
      delete storeLibrary.newLists[itemData]
      storeLibrary.newPackagingForm.filename = storeLibrary.newDatafile.file
      storeLibrary.newPackagingForm.path = storeLibrary.newDatafile.path
      storeLibrary.newPackagingForm.apicolumns = storeLibrary.newDatafile.columns
      storeLibrary.newPackagingForm.apicolHolder = storeLibrary.newListsave
    }
    console.log('packaing new forming')
    console.log(storeLibrary.newPackagingForm)
  }

</script>

<style scoped>

@media (min-width: 1024px) {
  #describe-data {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #library-datatypes {
    border: 1px solid blue;
  }

  #match-datatypes {
    border: 2px solid green;
  }

  .col-name {
    display: inline-block;
    vertical-align: text-top;
    width: 60%;
    font-size: .7em;
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
    font-size: 1.2em;
  }
}
</style>
