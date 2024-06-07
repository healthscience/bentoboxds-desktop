<template>
  <div id="question-nxp">
    <header>QUESTION:</header>
    <div id="prime-question">
      <form id="question_form" name="question_form" method="post" action="#">
        <div>
          <div class="question-item">
            Ask question:
            <textarea @paste="questionSave" @keyup="questionSave" required="" v-model="localQuestion" placeholder="prime"></textarea>
          </div>
          <div class="question-live" v-if="storeLibrary.newnxp.questionLive !== undefined">
            Question:
            {{ storeLibrary.newnxp.questionLive[0]?.value.concept.name }}
          </div>
        </div>
      </form>
    </div>
      <div class="data-refspace">
        <div v-for="qack of refContractQuestion"> 
          <div class="question-summary" v-if="qack.value">
            <div class="ref-pair">
              {{ qack.key }}
            </div>
            <div class="ref-pair">
              {{ qack.value.concept.name }}
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { libraryStore } from '@/stores/libraryStore.js'

  let localQuestion = ref['']
  const storeLibrary = libraryStore()
  
  const refContractQuestion = computed (() => {
    return storeLibrary.newnxp.questionLive
  })

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
