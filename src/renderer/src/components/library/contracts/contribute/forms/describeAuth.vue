<template>
  <div id="describe-authorisation">
    <div class="auth-info">
      <label for="auth-store">Authorise access token:</label>
      <input type="text"  id="auth-access-token" placeholder="" required @input="authtokenSave" @paste="authtokenSave" @keyup="authtokenSave" v-model="storeLibrary.newPackingForm.authorisation"/>
    </div>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  /* methods */
  const authtokenSave = () => {
    // this.$store.dispatch('actionSaveAuth', '')
  }
</script>

<style>
#describe-authorisation {
  display: grid;
  grid-template-columns: 1fr;
  border-top: 2px solid lightgrey;
  padding-top: 2em;
  border-bottom: 2px solid lightgrey;
  padding-bottom: 2em;
}

.auth-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.auth-info label {
  border: 1px solid red;
}
</style>
