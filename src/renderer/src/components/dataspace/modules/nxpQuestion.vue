<template>
  <div id="question-nxp">
    <header>QUESTION:</header>
    <div id="prime-question">
      <form id="question_form" name="question_form" method="post" action="#">
        <ul>
          <li class="question-item">
            Ask question:
            <textarea @paste="questionSave" @keyup="questionSave" required="" v-model="questionLive" placeholder="prime"></textarea>
          </li>
          <li class="question-live" v-if="questionLive !== undefined">
            Question:
            {{ questionLive }}
          </li>
          <!--<li class="question-item">
            Forum discussion:<input v-model="question.forum" placeholder="forum link">
          </li> -->
        </ul>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { libraryStore } from '@/stores/libraryStore.js'


  const storeLibrary = libraryStore()
  
  let questionLive= ref('')

  /* method */
  const questionSave = (contract) => {
    console.log('look up contract')
  }

</script>

<style scoped>


@media (min-width: 1024px) {

  #question-nxp {
    margin: 1em;
    border: 0px solid grey;
  }

  #question-nxp header {
    font-weight: bold;
  }

  #prime-question {
    margin: 1em;
  }

  .question-item {
    display: block;
    margin: 1em;
  }

  .question-live {
    font-size: 1.2em;
  }
}
</style>
