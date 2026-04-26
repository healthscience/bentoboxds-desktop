<template>
  <div id="bento-research">
    <form id="add-research-form">
      <label for="research"></label>
      <input type="input" id="research-add" name="research" placeholder="add research url" v-model="storeLibrary.newResearchForm.url" autofocus>
    </form>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'

const storeLibrary = libraryStore()

</script>

<style scoped>
#bento-research {
  display: grid;
  grid-template-columns: 1fr;
  margin: 2em;
}

input {
  width: 40vw;
}

  @media (min-width: 1024px) {


  }
  
</style>
