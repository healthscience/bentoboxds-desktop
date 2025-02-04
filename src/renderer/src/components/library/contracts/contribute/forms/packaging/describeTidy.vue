<template>
  <div id="describe-tidy">
    <label for="tidy">Tidy</label>
    <input type="checkbox" id="tidy" value="tidy" @change="tidySelect" v-model="storeLibrary.newPackagingForm.tidy[props.tidyid].tidy">
    <label for="tidy-add-category">Select datatype:</label>
    <select class="select-tidy-id" id="tidy-mapping-build" @change="tidyDTSelect" v-model="storeLibrary.newPackagingForm.tidy[props.tidyid].datatype">
      <option value="none" selected="">Please select</option>
      <div v-for="dtl in storeLibrary?.publicLibrary?.referenceContracts?.datatype" :key="dtl.key" v-bind:value="dtl.key">
        <option value=dtl.key>{{ dtl.value.concept.name }}</option>
      </div>
    </select>
    <label for="add-category-rule">Tidy code:</label>
    <input type="text"  id="mapping-rule-code" placeholder="" required v-model="storeLibrary.newPackagingForm.tidy[props.tidyid].tidycode"/>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()
  const props = defineProps({
    tidyid: Number
  })

  /* methods */

</script>

<style>
#describe-tidy {
  margin: 1.2em;
}
</style>
