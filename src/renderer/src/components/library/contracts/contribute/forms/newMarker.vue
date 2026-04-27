<template>
  <div id="bento-marker">
    <form id="add-marker-form">
      <label for="marker"></label>
      <input type="input" id="research-add" name="research" placeholder="add marker" v-model="storeLibrary.newMarkerForm.name" autofocus>
      <input type="input" id="research-add" name="research-knowledge" placeholder="marker knowledge" v-model="storeLibrary.newMarkerForm.url" autofocus>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

const storeLibrary = libraryStore()

</script>

<style scoped>
#bento-marker{
  display: grid;
  grid-template-columns: 1fr;
  margin: 2em;
}

input {
  width: 40vw;
  margin-bottom: 2em;
}

  @media (min-width: 1024px) {


  }
  
</style>
