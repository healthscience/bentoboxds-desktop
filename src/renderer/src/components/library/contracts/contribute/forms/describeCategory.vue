<template>
  <div id="describe-category">
    Category
    <label for="package-add-category">Select datatype:</label>
    <select class="select-categor-id" id="category-mapping-build" @change="categoryDTSelect" v-model="storeLibrary.newPackagingForm.category[props.catid].category">
      <option value="none" selected="">Please select</option>
      <option v-for="dtl in libraryStore.datatypesLive" :key="dtl.key" v-bind:value="dtl.key">
        <option value=dtl.key>{{ dtl.value.concept.name }}</option>
      </option>
    </select>
    <label for="package-add-category">Select column:</label>
    <select class="select-categor-id" id="category-mapping-build" @change="categorycolumnSelect" v-model="storeLibrary.newPackagingForm.category[props.catid].column">
      <option value="none" selected="">Select column</option>
      <option v-for="dtl in storeLibrary.publicLibrary.datatype">
        <option value=dtl.key>{{ dtl.value.concept.name }}</option>
      </option>
    </select>
    <label for="add-category-rule">Rule/code:</label>
    <input type="text"  id="mapping-rule-code" placeholder="" required @change="categoryruleSave" @paste="categoryruleSave" @keyup="categoryruleSave" v-model="storeLibrary.newPackagingForm.category[props.catid].rule" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

const storeLibrary = libraryStore()

const props = defineProps({
    catid: Number
  })

  /* methods */
  const categoryDTSelect = () => {
    // this.$store.dispatch('buildRefPackageCategory', this.newPackagingForm.category)
  }

  const categorycolumnSelect = () => {
    // this.$store.dispatch('buildRefPackageCategoryColumn', this.newPackagingForm.categorycolumn)
  }
  
  const categoryruleSave = () => {
    // this.$store.dispatch('buildRefPackageCategoryRule', this.newPackagingForm.categoryrule)
  }

// datatypesLive

/* export default {
  name: 'describe-category',
  components: {
  },
  props: {
    catID: null,
    newPackagingForm: {
      type: Object
    }
  },
  computed: {
    datatypesLive: function () {
      return this.$store.state.dataTypesLive
    },
    categoryLive: function () {
      return this.$store.state.newPackingForm.category
    }
  },
  data: () => ({
  }),

  }
} */
</script>

<style>
#describe-category {
  margin: 1.2em;
}
</style>
