<template>
  <div id="conversation" v-for="chati in chatspacePairs">
    <div class="peer-ask">
      <img class="left-chat-peer" src="../.././assets/peerlogo.png" alt="Avatar">
      <div class="left-chat"> {{ chati.question.data.text }} </div>
      <span class="left-chat">{{ chati.question.data.time }}</span>
    </div>
    <div class="beebee-reply" v-bind:class="{ networkactive: chati.reply.network === true }">
      <span class="right-time">{{ chati.reply.time }}</span>
      <div class="reply-text-chart">
        <div class="right-chat">
          beebee response please
        </div>
      </div>
      <div class="beebee">
        <img class="right-chat-beebee" src="../.././assets/logo.png" alt="bbAI">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'


  const storeAI = aiInterfaceStore()
  const storeLibrary = libraryStore()


  /* computed */
  const chatspacePairs = computed(() => {
   return storeAI.chatSpacePair[storeAI.liveBspace.spaceid]
  })

</script>

<style scoped>

#chat-interface {
  height: 100%;
  width: 100%;
}

#natlang-ai {
  display: block;
  border: 1px solid grey;
  padding: 1em;
  border-radius: 1em;
  height: 60vh;
  overflow-y: scroll;
}

#conversation {
  display: grid;
  height: auto;
  overflow-y: scroll;
}

.peer-ask {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  background-color: pink;
  border-radius: 25px;
  width: 80%;
}

.left-chat-peer {
  width: 50px;
}

.right-chat-beebee {
  width: 50px;
}

.left-chat {
  padding-top: .8em;
  display: inline-grid;
}

.beebee-reply {
  display: grid;
  grid-template-columns: 1fr;
  background-color: #d8d7e2;
  width: 96%;
  border-radius: 25px;
  margin-top: .5em;
  margin-left: 8%;
  opacity: 90%;
}

.right-chat {
  padding-top: 1em;
  display: block;
}

.beebee {
  display: grid;
  justify-self: end;
}

#beebee-chartspace {
  width: 90%;
}


.chat-input {
  position: absolute;
  bottom: 10%;
  margin-top: .5em;
  margin-left: 30px;
  width: 80%;
}

#buttommove {
  color: white;
}

  @media (min-width: 1024px) {
    #chat-interface {
      border: 0px solid blue;
      width: 100%;
    }

    #natlang-ai {
      display: block;
      width: 100%;
      border: 0px solid grey;
      padding: 1em;
      border-radius: 1em;
      height: 80vh;
      overflow-y: scroll;
    }

    #conversation {
      display: block;
      min-height: 10vh;
      margin-top: 1em;
    }

    #beebee-chartspace {
      height: auto;
      width: 90%;
      background-color: white;
    }

    .chat-input {
      position: fixed;
      bottom: 20px;
      width: 76%;
      border: 0px solid red;
      z-index: 9;
    }

    .beebee-reply {
      display: grid;
      grid-template-columns: 1fr 4fr 1fr;
      background-color: #d8d7e2;
      width: 90%;
      border-radius: 25px;
      margin-top: .5em;
      margin-left: 40px;
    }

    .active {
      border: 2px solid orange;
      background-color: antiquewhite;
    }

    .data-options {
      display: grid;
      grid-template-columns: 8fr 1fr;
    }

    .data-option-select {
      display: inline-block;
      padding: 0.25em;
      margin-bottom: 0.6em;
      width: 100%;
    }

    .date-option-select {
      display: inline-block;
      padding: 0.25em;
      margin-bottom: 0.6em;
    }

    .active {
      background-color: green;
    }

    .networkactive {
      background-color: rgb(227, 243, 218);
    }

    .file-feedback-csv {
      display: grid;
      grid-template-columns: 1fr;
    }
  }
</style>