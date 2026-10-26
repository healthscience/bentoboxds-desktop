<template>
  <div id="conduction-overlay-view">
    
    <div class="conduction-form-item">
      <span class="required_notification">All fields required</span>
    </div>

    <div class="conduction-form-item">
      <label for="conduction-primary">Source Primary?</label>
      <select class="select-conduction-source" id="conduction-primary" v-model="storeLibrary.newConductionForm.primary">
        <option value="" disabled>Please select</option>
        <option :value="true">YES</option>
        <option :value="false">NO</option>
      </select>
    </div>

    <div class="conduction-form-item">
      <label for="conduction-mapping-name">Conduction Name:</label>
      <input 
        id="conduction-mapping-name" 
        v-model="storeLibrary.newConductionForm.name" 
        placeholder="e.g., Local Node Biometrics" 
        required 
        type="text"
      >
    </div>

    <div class="conduction-form-item">
      <label for="conduction-mapping-description">Description:</label>
      <textarea 
        id="conduction-mapping-description" 
        cols="40" 
        rows="2" 
        required 
        v-model="storeLibrary.newConductionForm.description"
      ></textarea>
    </div>

    <div class="conduction-form-item">
      <label for="conduction-source-data">Data source driver:</label>
      <div id="source-location">
        <!-- Direct builder if an exoCue is open/active in the workspace -->
        <conduction-builder v-if="isExoCueOpen === true"/>

        <!-- Isolated builder pipeline for cold drops/normal uploads -->
        <conduction-isolated/>
      </div>
    </div>
  </div>
</template>

<script setup>
import ConductionBuilder from '@/components/library/contracts/contribute/forms/conductiondevice/conductionBuilder.vue'
import ConductionIsolated from '@/components/library/contracts/contribute/forms/conductiondevice/conductionIsolate.vue'
import { computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'
import { useExocueStore } from '@/stores/exocueStore.js'


const storeLibrary = libraryStore()
const storeExocue = useExocueStore()

// Computed
const isExoCueOpen = computed(() => {
  if (storeExocue.activeexocues.length > 0) {
    return true
  } else {
    return false
  }
})

</script>

<style scoped>
@media (min-width: 1024px) {
  #conduction-overlay-view {
    display: grid;
    grid-template-columns: 1fr;
    font-size: 1em;
    width: 80vw;
  }

  .conduction-form-item {
    display: grid;
    grid-template-columns: 1fr 6fr;
    margin: 1em;
    list-style: none;
  }

  .conduction-form-item label {
    margin-right: 1em;
    justify-self: end;
  }

  .conduction-form-item-single {
    display: grid;
    grid-template-columns: 1fr;
    margin: 1em;
  }

  .select-conduction-source {
    width: 20%;
  }
}
</style>