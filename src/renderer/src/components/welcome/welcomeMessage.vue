<template>
  <div class="beebee-welcome" v-if="storeAI.startChat === true">
    <div id="message-question">What can you do?</div>
    <div id="bb-features">
      <div class="message-bb">
        <header>Ask</header>
        <div class="message-learn">
          BeeBee about a data source, enter numbers or drag in a file
        </div>
      </div>
      <div class="message-bb">
        <header>Chart</header>
        <div class="message-learn">
          A BentoBox offers a range of charts and analysis tools
        </div>
      </div>
      <div class="message-bb">
        <header>Share</header>
        <div class="message-learn">
          Securely send to other peers, employees or communities
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