<template>
  <div id="newvisualise-view">
    <div class="visualise-form-item">
      <span class="required_notification">All fields required</span>
    </div>
    <div class="visualise-form-item">
      <label for="visualise-add-source">Source Primary?</label>
      <select class="select-package-source" id="v-primary" @input="primarySelect" @change="primarySelect" v-model="storeLibrary.newVisualiseForm.primary">Please select
        <option value=true>YES</option>
        <option value=false>NO</option>
      </select>
    </div>
    <div class="visualise-form-item">
      <label for="visualise-add-name">Name:</label>
      <input id="visualise-mapping-name" @input="nameSave" @paste="nameSave" @keyup="nameSave" v-model="storeLibrary.newVisualiseForm.name" placeholder="visualise mapping name" required="" type="text">
    </div>
    <div class="visualise-form-item">
      <label for="visualise-add-description">Description:</label>
      <textarea name="message" cols="40" rows="6" required="" id="visualise-mapping-description" @input="descriptionSave" @paste="descriptionSave" @keyup="descriptionSave" v-model="storeLibrary.newVisualiseForm.description"></textarea>
    </div>
    <div class="visualise-form-item">
      <label for="visualise-structure-types">Structure name</label>
      <input id="visualise-mapping-name" @input="structureSave" @paste="structureSave" @keyup="structureSave" v-model="storeLibrary.newVisualiseForm.structureName" placeholder="visualise structure name" required="" type="text">
    </div>
    <div id="visualise-form-item">
      <ul class="lab-list" v-for="(dl, index) of storeLibrary.newVisualiseForm.visHolder" :key='dl.id'>
        <div class="lab-item">
          <input id="structure-label-name"  v-model="storeLibrary.newVisualiseForm.visHolder[index].labels" placeholder="" required="" type="text">
          <label for="structure-add-element">Data holder</label>
          <select class="select-structure-source" id="v-primary" @change="typeESelect(index)" v-model="storeLibrary.newVisualiseForm.visHolder[index].type">Please select type
            <option value=null>null</option>
            <option value=Array>Array</option>
            <option value=Object>Object</option>
          </select>
        </div>
      </ul>
      <a href="#" @click.prevent="addElement" >add element</a>
    </div>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  const addElement = () => {
    storeLibrary.newVisualiseForm.visHolder.push({})
  }

</script>

<style scoped>
#newvisualise-view {
  display: grid;
  grid-template-columns: 1fr;
}

.visualise-form-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding-top: .5em;
}

.visualise-form-item label {
  border: 0px solid red;
  margin-right: 1em;
  justify-self: end;
}

#new-structure-lab {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.lab-item {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  margin-top: 2em;
}

@media (min-width: 1024px) {


}

</style>
