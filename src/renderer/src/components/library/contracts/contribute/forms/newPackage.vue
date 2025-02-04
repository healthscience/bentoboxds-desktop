<template>
  <div id="newpackage-view">
    <div class="package-form-item">
      <span class="required_notification">All fields required</span>
    </div>
    <div class="package-form-item">
      <label for="package-add-source">Source Primary?</label>
      <select class="select-package-source" id="package-primary" @change="primarySelect" v-model="storeLibrary.newPackagingForm.primary">Please select
        <option value=true>YES</option>
        <option value=false>NO</option>
      </select>
    </div>
    <div class="package-form-item">
      <label for="package-source-data">Data source:</label>
      <div id="source-location">
        <source-builder></source-builder>
      </div>
    </div>
    <div class="package-form-item">
      <label for="package-add-name">Name:</label>
      <input id="package-mapping-name" @input="nameSave" @paste="nameSave" @keyup="nameSave" v-model="storeLibrary.newPackagingForm.name" placeholder="package mapping name" required="" type="text">
    </div>
    <div class="package-form-item">
      <label for="package-add-description">Description:</label>
      <textarea name="message" cols="40" rows="2" required="" id="package-mapping-description" @input="descriptionSave" @paste="descriptionSave" @keyup="descriptionSave" v-model="storeLibrary.newPackagingForm.description"></textarea>
    </div>
    <div class="package-form-item">
      <label for="tidy">Authorisation required?</label>
      <input type="checkbox" id="auth-access" v-model="storeLibrary.newPackagingForm.authrequired">
    </div>
    <div class="package-form-item-single">Authorisation
      <describe-auth v-if="storeLibrary.newPackagingForm.authrequired === true"></describe-auth>
    </div>
    <div id="desribe-data" class="package-form-item-single" v-if="datasourceLive === true">
      <div id="sqlite-table-name" v-if="filetypeLive === 'sqlite'"><!--not being used??-->
        <label for="add-code-name">SQLite table name: </label>
        <input type="text"  id="table-name-sqlite" placeholder="" required  v-model="storeLibrary.newPackagingForm.sqlitetable" />
      </div>
      <div id="desribe-source-data" class="package-form-item-single" v-if="sourceFile === 'sqlite'">
        <describe-datastructure></describe-datastructure>
      </div>
      <div class="package-column-item">
        <div class="package-column-item">
        <label for="add-code-name">Column builder</label>
        <input type="text"  id="package-base-address" placeholder="column" required  v-model="storeLibrary.newPackagingForm.columns" />
        <a href='#' id="add-column" @click.prevent="columnsSave" >Add column </a>
        <a href='#' id="auto-column" @click.prevent="columnsAuto" > Auto add</a>
      </div>
        <describe-data></describe-data>
      </div>
      <!-- <li class="package-form-item">
        <a href='#' id="add-newendpoint">Add another path</a>
      </li> -->
      <div class="pack-info">
        <a href='#' id="add-category" @click.prevent="addCategory" >Add category</a>
      </div>
      <div class="pack-info" v-for="dc of catCount" :key="dc.id" >
          <describe-category :catid=dc></describe-category>
      </div>
      <div class="pack-info">
        <a href='#' id="add-tidy-code" @click.prevent="addTidyItem">Add tidy rule</a>
      </div>
      <div class="pack-info" v-for="dty of tidyCount" :key="dty.id" >
        <describe-tidy :tidyid=dty></describe-tidy>
      </div>
      <div class="package-form-item-single">DEVICE
        <describe-device></describe-device>
      </div>
    </div>
  </div>
</template>

<script setup>
import SourceBuilder from '@/components/library/contracts/contribute/source/sourceBuilder.vue'
import DescribeDevice from '@/components/library/contracts/contribute/forms/packaging/describeDevice.vue'
import DescribeAuth from '@/components/library/contracts/contribute/forms/packaging/describeAuth.vue'
import DescribeDatastructure from '@/components/library/contracts/contribute/forms/packaging/describeSourceStructure.vue'
import DescribeData from '@/components/library/contracts/contribute/forms/packaging/describeData.vue'
import DescribeCategory from '@/components/library/contracts/contribute/forms/packaging/describeCategory.vue'
import DescribeTidy from '@/components/library/contracts/contribute/forms/packaging/describeTidy.vue'

import { computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

const storeLibrary = libraryStore()

  /* computed */
  const catCount = computed(() => {
    return storeLibrary.newPackagingForm.catCount
  })

  const tidyCount = computed(() => {
      return storeLibrary.newPackagingForm.tidyCount
  })

  const fileFeedback = computed(() => {
      return storeLibrary.fileFeedback.columns
  })

  const datasourceLive = computed(() => {
    return storeLibrary.sourceDataSelected
  })
  
  const filetypeLive = computed(() => {
    return storeLibrary.sourceFiletype
  })

  const sourceFile = computed(() => {
    return storeLibrary.newPackagingForm.type
  })

  /* methods */
  const authrequiredSelect = (ak) => {
    // this.$store.dispatch('buildRefPackageAuthrequired', this.formData.authrequired)
  }

  const columnsSave = (ad) => {
    /* let colCount
    if (state.newPackagingForm.apicolumns.length === 0) {
      colCount = 1
    } else {
      colCount = state.newPackagingForm.apicolumns.length + 1
    } */
    const newColumn = {}
    newColumn.count = 1
    newColumn.name = ad
    // state.newPackagingForm.apicolumns.push(newColumn)
    // state.newPackagingForm.apicolHolder.push([])
    storeLibrary.newDatafile.columns.push(newColumn)
  }

  const columnsAuto = (ak) => {
    // needs to be info. back from save.
    let colCount = 0
    if (storeLibrary.newPackagingForm.apicolumns.length === 0) {
      colCount = 1
    } else {
      colCount = storeLibrary.newPackagingForm.apicolumns.length + 1
    }
    for (const col of storeLibrary.newPackagingForm.apicolumns) {
      const newColumn = {}
      newColumn.count = colCount
      newColumn.name = col
      storeLibrary.newDatafile.columns.push(newColumn)
      storeLibrary.newPackagingForm.apicolHolder.push([])
      colCount++
    }
  }

  const addCategory = () => {
    storeLibrary.newPackagingForm.catCount++
    const catBundle = {}
    catBundle.category = {}
    catBundle.column = {}
    catBundle.rule = ''
    storeLibrary.newPackagingForm.category[catCount.value] = catBundle
    storeLibrary.newPackagingForm.catHolder[catCount.value] = {}
  }

  const addTidyItem = () => {
    storeLibrary.newPackagingForm.tidyCount++
    const tidyBundle = {}
    tidyBundle.tidy = {}
    tidyBundle.datatype = {}
    tidyBundle.rule = {}
    storeLibrary.newPackagingForm.tidy[tidyCount.value] = tidyBundle
    storeLibrary.newPackagingForm.tidyHolder[tidyCount.value] = {}
  }

</script>

<style scoped>

@media (min-width: 1024px) {
  #newpackage-view {
    display: grid;
    grid-template-columns: 1fr;
    font-size: 1em;
    width: 80vw;
  }

  .package-form-item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 1em;
    list-style: none;
  }

  .package-form-item label {
    margin-right: 1em;
    justify-self: end;
  }

  .package-form-item-single {
    display: grid;
    grid-template-columns: 1fr;
    margin: 1em;
  }

  .select-package-source {
    width: 20%;
  }

  .pack-info {
    padding: 1em;
    list-style: none;
  }

  #source-holder {
    display: grid;
    border: 2px solid rgb(0, 0, 0);
  }

  #auto-column {
    margin-left: 2em;
  }

  .package-column-item {
    padding-bottom: 1em;
    list-style: none;
  }

  #sqlite-table-name {
    margin-bottom: 1em;
  }

  #table-name-sqlite {
    width: 300px;
  }
}

</style>
