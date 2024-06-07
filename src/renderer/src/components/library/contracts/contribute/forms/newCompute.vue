<template>
  <div id="compute-form-view">
    <div class="compute-form-item">
      <span class="required_notification">All fields required</span>
    </div>
    <div class="compute-form-item">
      <label for="compute-add-source">Compute Primary?</label>
      <select class="select-compute-source" @change="primarySave" v-model="storeLibrary.newComputeForm.primary" id="">Please select
        <option value="yes">YES</option>
        <option value="no">NO</option>
      </select>
    </div>
    <div class="compute-form-item">
      <label for="compute-add-name">Name:</label>
      <input id="compute-mapping-name" @input="nameSave" @paste="nameSave" @keyup="nameSave" v-model="storeLibrary.newComputeForm.name" placeholder="compute mapping name" required="" type="text">
    </div>
    <div class="compute-form-item">
      <label for="compute-add-description">Description:</label>
      <textarea name="message" cols="40" rows="6" @input="descSave" @paste="descSave" @keyup="descSave" v-model="storeLibrary.newComputeForm.description" required="" id="compute-mapping-description"></textarea>
    </div>
    <div class="compute-form-item">
      <label for="compute-add-datatype">datatype prefix:</label>
      <input id="compute-refcontract-dt" placeholder="datatype ref contract" @input="dtprefixSave" @paste="dtprefixSave" @keyup="dtprefixSave" v-model="storeLibrary.newComputeForm.dtprefix" required="" type="text">
    </div>
    <div class="compute-form-item">
      <label for="compute-add-name">location of code:</label>
      <input id="compute-code-name" placeholder="compute code" @input="codeSave" @paste="codeSave" @keyup="codeSave" v-model="storeLibrary.newComputeForm.code" required="" type="text">
    </div>
    <div class="compute-form-item">
      <label for="compute-add-hash">hash of code:</label>
      <input id="compute-code-hash" placeholder="compute hash" @input="hashSave" @paste="hashSave" @keyup="hashSave" v-model="storeLibrary.newComputeForm.hash" required="" type="text">
    </div>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()
  
</script>

<style scoped>

@media (min-width: 1024px) {
  #compute-form-view {
    display: grid;
    grid-template-columns: 1fr;
  }

  .compute-form-item {
    display: grid;
    grid-template-columns: 1fr 2fr;
    padding-top: 1em;
  }

  .compute-form-item label {
    border: 0px solid red;
    margin-right: 1em;
    justify-self: end;
  }
}

</style>
