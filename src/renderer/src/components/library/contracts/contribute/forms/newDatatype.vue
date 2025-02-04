<template>
  <div id="newapi-view">
    <div class="api-form-item">
      <span class="required_notification">All fields required</span>
    </div>
    <div class="api-form-item">
      <label for="api-datatype-source">Datatype Primary?</label>
      <select class="select-datatype-source" id="source-value" v-model="storeLibrary.datatypeForm.primary" @input="primarySelect" @paste="primarySelect" @change="primarySelect">Please select
        <option value="yes">YES</option>
        <option value="no">NO</option>
      </select>
    </div>
    <div v-if="storeLibrary.datatypeForm.primary==='yes'" id="new-primary-datatype">
      <div class="api-form-item">
        <label for="api-add-name">Name:</label>
        <input id="ref-datatype-name" @input="nameSave" @paste="nameSave" @keyup="nameSave" v-model="storeLibrary.datatypeForm.name" placeholder="datatype name" required="" type="text">
      </div>
      <div class="api-form-item">
        <label for="datatype-add-description">Description:</label>
        <textarea name="message" cols="40" rows="6" @input="descriptionSave" @paste="descriptionSave" @keyup="descriptionSave" v-model="storeLibrary.datatypeForm.description" required="" id="api-datatype-description"></textarea>
      </div>
      <div class="api-form-item">
        <label for="rdf-add-description">Wikipedia entry:</label>
        <input id="wikipedia-datatype-name" @input="wikiSave" @paste="wikiSave" @keyup="wikiSave" v-model="storeLibrary.datatypeForm.wiki" placeholder="wikipedia link" required="" type="text" value="https://en.wikipedia.org/wiki/">
      </div>
      <div class="api-form-item">
        <label for="rdf-add-description">RDF linked data:</label>
        <input id="rdf-datatype-name" @input="rdfSave" @paste="rdfSave" @keyup="rdfSave" v-model="storeLibrary.datatypeForm.rdf" placeholder="rdf link" required="" type="text" value="https://dbpedia.org/page/">
      </div>
    </div>
    <div v-if="storeLibrary.datatypeForm.primary==='no'" id="build-existing-datatypes">
      List or drag and drop from existing DT's  e.g. average BPM  is average DT +  BMP DT
    </div>
    <div class="api-form-item">
      <label for="measurement-add-description">Measurement:</label>
      <input id="measurement-datatype-name" @input="measurementSave" @paste="measurementSave" @keyup="measurementSave" v-model="storeLibrary.datatypeForm.measurement" placeholder="measurement units" required="" type="text">
    </div>
    <div class="api-form-item">
      <label for="type-structure">Type</label>
      <select class="select-type-structure" id="type-value" v-model="storeLibrary.datatypeForm.datatypeType" @paste="typeSelect" @change="typeSelect">Please select
        <option value="integer">Integer</option>
        <option value="float">float</option>
        <option value="boolean">True/False</option>
        <option value="string">String</option>
        <option value="array">Array</option>
        <option value="object">Object</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'

const storeLibrary = libraryStore()

</script>

<style scoped>

@media (min-width: 1024px) {

  #wikipedia-datatype-name {
    width: 300px;
  }

  #newapi-view {
    display: grid;
    grid-template-columns: 1fr;
  }

  .api-form-item {
    display: grid;
    grid-template-columns: 1fr 2fr;
    padding-top: .5em;
  }

  .api-form-item label {
    border: 0px solid red;
    margin-right: 1em;
    justify-self: end;
  }

  #new-primary-datatype {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
