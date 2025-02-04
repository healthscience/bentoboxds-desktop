<template>
  <div class="beebee-welcome" v-if="storeAI.startChat === true">
    <div id="message-question">What can be done?</div>
    <div id="bb-features">
      <div class="message-bb">
        <header>Tools</header>
        <div class="message-learn">
          Have agency over data and knowledge
        </div>
      </div>
      <div class="message-bb">
        <header>BeeBee Oracle</header>
        <div class="message-learn">
          Ask question of the health oracle
        </div>
      </div>
      <div class="message-bb">
        <header>Share</header>
        <div class="message-learn">
          Guide coherence & collective intelligences
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()
</script>

<style>
.beebee-welcome {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
}

#message-question {
  text-align: center;
}

#bb-features {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: .6em;
  justify-content: center;
  padding: 2em;
}

.message-bb {
  display: grid;
  border: 1px solid rgb(238, 215, 172);
  background-color: white;
}

.message-bb header {
  display: grid;
  justify-content: center;
  padding-top: 0.1em;
}

.message-learn {
  padding: .6em;
  overflow-wrap: break-word;
}

  @media (min-width: 1024px) {

    .beebee-welcome {
      position: fixed;
      top: 60%;
      left: 140px;
      z-index: 2;
      border: 0px dashed blue;
      width: 80%;
    }

    #message-question {
      text-align: center;
      padding: 2em;
    }

    #bb-features {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 2em;
      justify-content: center;
    }

    .message-bb {
      display: grid;
      border: 1px solid orange;
      box-shadow: 8px 8px 8px 1px rgb(238, 215, 172);
      justify-content: center;
    }

    .message-bb header {
      display: grid;
      justify-content: center;
      padding-top: 1em;
    }

    .message-learn {
      padding: 2em;
      overflow-wrap: break-word;
    }

  }
</style>