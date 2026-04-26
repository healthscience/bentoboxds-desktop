<template>
  <div id="bento-product">
    <form id="add-product-form">
      <label for="product"></label>
      <input type="input" id="product-add" name="product" placeholder="add product" v-model="storeLibrary.newProductForm.name" autofocus>
      <input type="input" id="product-add-url" name="producturl" placeholder="producut page url" v-model="storeLibrary.newProductForm.url" autofocus>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

const storeLibrary = libraryStore()

</script>

<style scoped>

#bento-product {
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
