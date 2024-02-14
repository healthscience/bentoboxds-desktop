<template>
  <div id="chat-interface">
    <!-- Natural Language Chat -->
    <div id="natlang-ai">
      <div id="conversation" v-if="beginChat === true"  v-for="chati in chatPairs">
        <div class="peer-ask">
          <img class="left-chat-peer" src="../.././assets/peerlogo.png" alt="Avatar">
          <div v-if="chati.question.data.active === true" class="left-chat"> {{ chati.question.data.text }} </div>
          <span class="left-chat">{{ chati.question.data.time }}</span>
        </div>
        <div class="beebee-reply" v-bind:class="{ active: chati.reply.network === true }">
          <span class="right-time">{{ chati.reply.time }}</span>
          <div class="reply-text-chart">
            <div class="right-chat">{{ chati.reply.type }}
              <div v-if="chati.reply.type === 'hopquery'">
                <span>Datatype: {{ chati.data.library.text }} for month {{ chati.data.time.words.day }} day {{ chati.data.time.words.month }}</span>--- <button id="new-query" @click.prevent="beebeeChartSpace(chati.data)">yes, produce chart</button>
              </div>
              <div v-else-if="chati.reply.type === 'bbai-reply'">
                <div v-if="chati.reply.data?.type !== 'library-peerlibrary'">
                  {{ chati.reply.data }}
                </div>
              </div>
              <div v-else-if="chati.reply.type === 'upload'">
                {{ chati.reply.data.text }}
                <button id="upload-button" @click="uploadButton">Click to upload file</button>
              </div>
              <div v-else-if="chati.reply.type === 'library-peerlibrary'">
                <button @click="openLibrary">open library</button>
              </div>
              <div v-else>
                {{ chati.reply.data.text }}
                <div v-if="chati.reply.action === 'upload'">
                  <button id="upload-button" @click="uploadButton">Click to upload file</button>
                </div>
              </div>
            </div>
            <div id="beebee-chartspace" v-if="storeAI.beebeeChatLog[chati.question.bbid] === true">
              <!--the slimed down bentobox to chart and bring in tools as needed-->
              <bento-box :bboxid="chati.question.bbid"></bento-box>
            </div>
          </div>
          <div class="beebee">
            <img class="right-chat-beebee" src="../.././assets/logo.png" alt="bbAI">
          </div>
        </div>
      </div>
      <!--<div id="buttommove"></div>-->
      <div id="buttommove" ref="targetId" >{{ updateBottom  }}</div>
    </div>
    <div class="chat-input">
      <input-box></input-box>
    </div>
  </div>
</template>


<script setup>
import inputBox from '@/components/beebeehelp/inputBox.vue'
import BentoBox from '@/components/bentobox/baseBox.vue'
import { ref, computed, onMounted } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

  // const askStart = ref('What would you like to chart?')
  let chartStyle = ref('')

  const storeAI = aiInterfaceStore()

  const storeLibrary = libraryStore()

  const chartBuild = style => {
    storeAI.beebeeChatLog = true
    chartStyle.value = style
  }

  // a computed ref
  const chatPairs = computed(() => {
   return storeAI.historyPair[storeAI.chatAttention]
  })

  const chatHistory = computed(() => {
   return storeAI.helpchatHistory
  })

  const chatAsk = computed(() => {
   return storeAI.helpchatAsk
  })

  const aiResponse = computed(() => {
   return storeAI.beebeeReply
  })

  const beginChat = computed(() => {
    return storeAI.beginChat
  })

  const bottom = ref(null)
  onMounted(() => {
    // bottom.value.scrollIntoView({behavior: "smooth"})
  })

  const updateBottom = computed(() => {
    setTimeout(scrollToElement, 500)
    return storeAI.chatBottom
  })

  const targetId = ref(null)

  const scrollToElement = () =>  {
    const el = document.getElementById('buttommove')
    if (el) {
      el.scrollIntoView({ block: "end" })
    }
  }

  const uploadButton = () =>  {
    storeAI.dataBoxStatus = true
    storeLibrary.uploadStatus = true
    storeLibrary.libraryStatus = false
  }

  const openLibrary = () => {
    storeAI.dataBoxStatus = true
    storeAI.uploadStatus = false
    storeLibrary.libraryStatus = true
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  display: block;
  min-height: 100px;
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

#natlang-ask {
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

  }

</style>
