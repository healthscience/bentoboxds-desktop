<template>
  <div id="question-view">
    <div class="question-form-item">
      <span class="required_notification">All fields required</span>
    </div>
    <div class="question-form-item">
      <label for="api-question-source">QuestionPrimary?</label>
      <select class="select-question-source" id="source-value" v-model="storeLibrary.questionForm.primary">Please select
        <option value="yes">YES</option>
        <option value="no">NO</option>
      </select>
    </div>
    <div class="question-form-item">
      <label for="question-add-sentence">Question:</label>
      <textarea id="ref-question-name" v-model="storeLibrary.questionForm.name" placeholder="question:" required="" type="text" ></textarea>
    </div>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'

const storeLibrary = libraryStore()


</script>

<style scoped>


@media (min-width: 1024px) {

  #ref-question-name {
    width: 100%;
  }

}
</style>
