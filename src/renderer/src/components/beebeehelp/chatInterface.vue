<template>
  <div id="chat-interface">
    <!-- Natural Language Chat -->
    <div id="natlang-ai">
      <welcome-beebee></welcome-beebee>
      <div id="conversation" v-if="beginChat === true"  v-for="chati in chatPairs">
        <div class="peer-ask">
          <img class="left-chat-peer" src="../.././assets/peerlogo.png" alt="Avatar">
          <div v-if="chati.question?.data?.active === true" class="left-chat"> {{ chati.question?.data?.text }} </div>
          <span class="left-chat">{{ chati.question?.data?.time }}</span>
        </div>
        <div class="beebee-reply" v-bind:class="{ networkactive: chati.reply.network === true }">
          <span class="right-time">{{ chati.reply.time }}</span>
          <div class="reply-text-chart">
            <div class="right-chat">
              {{ chati.reply.type }} {{ chati.reply.action }}
              <div v-if="chati.reply.type === 'experiment' && chati.reply.data">
                <button @click="viewSaveExperiment(chati.question.bbid, chati.reply.data)">View experiment</button>
              </div>
              <div v-if="chati.reply.type === 'network-library-n1'">
                {{ chati.reply.data.text.boardname }}<button @click="publibLibAdd(chati.reply.data.text)"> yes add this board to public library</button>
              </div>
              <div v-if="chati.reply.type === 'hopquery'">
                <span>Datatype: {{ chati.data.library.text }} for month {{ chati.data.time.words.day }} day {{ chati.data.time.words.month }}</span>---
                <button id="new-query" @click.prevent="beebeeChartSpace(chati.data)">yes, produce chart</button>
              </div>
              <div v-else-if="chati.reply.action === 'agent-response'">
                {{ chati.reply.data }}
              </div>
              <div v-else-if="chati.reply.type === 'bbai-reply'">
                <div v-if="chati.reply?.action === 'hello'">
                  {{ chati.reply.data }}
                </div>
                <div v-if="chati.reply.action === 'hop-learn-feedback'">
                  {{ chati.reply.data.agent }} Please start the LLM in accounts settings.
                </div>
                <div v-if="chati.reply?.action === 'library'">
                  <button @click="openLibrary">open library</button>
                </div>
                <div v-if="chati.reply.data?.type !== 'library-peerlibrary'">
                  <div class="beeebee-text">
                    {{ chati.reply?.data?.text}} - {{ chati.reply.data?.type }}
                    </div>
                    <div v-if="chati.reply?.data?.filedata" class="bee-file-data">
                      <div class="file-feedback-csv">
                        {{ chati.reply.data.filedata.type }} - {{ chati.reply.data.filedata.file?.name }} -- {{ chati.reply.data.filedata.columns }}
                      </div>
                      <button id="csv-file-summary" @click="viewSummaryCSV(chati.reply.bbid)">view summary</button>ss {{ storeLibrary.csvpreviewLive }} == {{ summaryCSVState }}
                      <csv-preview v-if="storeLibrary.imagepreviewLive !== true && storeLibrary.csvpreviewLive === summaryCSVState" :summarydata="chati.reply.data.filedata.grid"></csv-preview>
                      <image-preview v-if="storeLibrary.imagepreviewLive === true && summaryCSVState === false" :summaryimagedata="chati.reply.data.filedata.grid"></image-preview>
                    </div>
                    <div v-if="chati.reply?.data?.prompt?.length > 0" class="bee-prompt-question">
                      {{ chati.reply.data.prompt }} ==pp
                      <!-- if csv file, show column to chart else sql need to select table then columns to chart-->
                      <div id="type-data-options" v-if="chati.reply?.data?.filedata.type !== 'sqlite'">options1 {{ chati.reply.data.opitons }}
                        <div class="data-options"  v-for="(dopt, index) in chati.reply?.data?.options">
                          <!-- csv or json format -->
                          <div v-if="typeof dopt === 'string'">str --
                            <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, chati.reply.bbid, chati.reply?.data?.options, chati.reply?.data?.filedata.size)">
                              {{ dopt }}
                            </button>
                          </div>
                          <div v-else>nostr
                              <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, chati.reply.bbid, chati.reply?.data?.options )">
                                {{ dopt.name }}
                              </button>
                          </div>
                          <button class="data-option-select" :class="{ active: index === isDateColumn }" @click.prevent="dateOptionSelect(index, dopt, chati.reply.bbid)">date</button>
                        </div>
                      </div>
                      <div v-else> <!-- sqlite data structure -->
                        <describe-datastructure :bboxid="chati.reply.bbid" :fileTypeIn="chati.reply?.data?.filedata.type"></describe-datastructure>
                        <div class="data-options"  v-for="(dopt, index) in storeLibrary.newDatafile.columns">{{ dopt }}
                          <div v-if="typeof dopt === 'string'">
                            <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, chati.reply.bbid, chati.reply?.data?.options )">
                              {{ dopt }}
                            </button>
                          </div>
                          <div v-else>
                              <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, chati.reply.bbid)">
                                {{ dopt.name }}
                              </button>
                          </div>
                          <button class="data-option-select" :class="{ active: index === isDateColumn }" @click.prevent="dateOptionSelect(index, dopt, chati.reply.bbid)">date</button>
                        </div>
                        <div id="further-filter">Want to further filter the data query?  Select a column</div>
                        <div class="data-options"  v-for="(dopt, index) in storeLibrary.newDatafile.columns">
                          <div v-if="typeof dopt === 'string'">
                            <button class="data-option-select" @click.prevent="dataOptionFilter(index, dopt, chati.reply.bbid)">
                              {{ dopt }}
                            </button>
                          </div>
                          <div v-else>
                              <button class="data-option-select" @click.prevent="dataOptionFilter(index, dopt, chati.reply.bbid)">
                                {{ dopt.name }}
                              </button>
                          </div>
                        </div>
                        <div id="filter-options" v-if="filterActive === true">filter
                          <describe-devicestructure :bboxid="chati.reply.bbid" :fileTypeIn="chati.reply?.data?.filedata.type" @device-filter="filterdeviceEvent()" @device-id="choicedeviceEvent()"></describe-devicestructure>
                        </div>
                      </div>
                    </div>
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
                <div v-if="chati.reply.type === 'feedback'">
                  <div class="text-feedback">{{ chati.reply?.data?.text }}</div>
                </div>
                <div v-if="chati.reply.action === 'upload'">
                  <button id="upload-button" @click="uploadButton">Click to upload file</button>
                </div>
              </div>
            </div>
            <div id="beebee-chartspace" v-if="storeAI.beebeeChatLog[chati?.question?.bbid] === true">
              <!--the slimed down bentobox to chart and bring in tools as needed-->
              <bento-box :bboxid="chati?.question?.bbid"></bento-box>
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
import WelcomeBeebee from '@/components/beebeehelp/welcomeBeebee.vue'
import inputBox from '@/components/beebeehelp/inputBox.vue'
import CsvPreview from '@/components/dataspace/upload/csvPreview.vue'
import ImagePreview from '@/components/dataspace/upload/imagePreview.vue'
import DescribeDatastructure from '@/components/library/contracts/contribute/forms/packaging/describeSourceStructure.vue'
import DescribeDevicestructure from '@/components/library/contracts/contribute/forms/packaging/describeDeviceStructure.vue'
import BentoBox from '@/components/bentobox/baseBox.vue'
import { ref, computed, onMounted } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

  // const askStart = ref('What would you like to chart?')
  // let chartStyle = ref('')
  let columnFilter = ref('')
  let deviceFilter = ref('')
  let columnLive = ref('')
  let datecolLive = ref('')
  let bbidLive = ref('')
  let isDateColumn = ref(0)
  let filterActive = ref(false)
  let summaryCSVState = ref(false) // need to make per bbid in store TEMP

  const storeAI = aiInterfaceStore()
  const storeLibrary = libraryStore()

  /*
  const chartBuild = style => {
    storeAI.beebeeChatLog = true
    chartStyle.value = style
  } */

  /* computed */
  const libraryAvailable = computed (() => {
    if (Object.keys(storeLibrary.publicLibrary).length > 0) {
      return storeLibrary.publicLibrary.referenceContracts[storeLibrary.moduleNxpActive]
    } else {
      return []
    }
  })

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

  const viewSaveExperiment = (bbid, contractID) => {
    storeLibrary.prepareLibraryViewFromContract(bbid, contractID)
  }

  const publibLibAdd = (board) => {
    storeLibrary.confrimAddPublicLibrary(board)
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

  const dataOptionVis = (did, colName, bbid, options, size) => {
    // is it a large file?
    if (size === 'large') {
      let dateColSelected = ''
      if (options === undefined) {
          dateColSelected = 'TIMESTAMP'
        } else {
          dateColSelected = options[isDateColumn.value]
        }
        // keep track of live selections
        datecolLive.value = did
        columnLive.value = colName
        bbidLive.value = bbid
        let dataCode = {}
        dataCode.size = 'large'
        dataCode.id = did
        dataCode.deviceTable = storeLibrary.newDatafile.deviceTable
        dataCode.devicetablename = ''
        dataCode.name = colName
        // what is name of date column?
        dataCode.timestampname = dateColSelected
        dataCode.timestamp = isDateColumn.value
        dataCode.device = ''
        dataCode.deviceCol = ''
        dataCode.timerange = []
        dataCode.bbid = bbid
        storeAI.largeFilesubmitAsk(dataCode)
    } else {
      let dateColSelected = ''
      if (options === undefined) {
        dateColSelected = 'TIMESTAMP'
      } else {
        dateColSelected = options[isDateColumn.value]
      }
      // keep track of live selections
      datecolLive.value = did
      columnLive.value = colName
      bbidLive.value = bbid
      let dataCode = {}
      dataCode.id = did
      dataCode.deviceTable = storeLibrary.newDatafile.deviceTable
      dataCode.devicetablename = ''
      dataCode.name = colName
      // what is name of date column?
      dataCode.timestampname = dateColSelected
      dataCode.timestamp = isDateColumn.value
      dataCode.device = ''
      dataCode.deviceCol = ''
      dataCode.timerange = []
      dataCode.bbid = bbid
      storeAI.submitAsk(dataCode)
    }
  }

  const viewSummaryCSV = (bbid) => {
    summaryCSVState.value = !summaryCSVState.value
  }
  
  const dataOptionFilter = (did, colName, bbid) => {
    deviceFilter.value = colName
    filterActive.value = true
  }

  const dateOptionSelect = (did, colName, bbid) => {
    isDateColumn.value = did
  }

  const filterdeviceEvent = () => {
    let dataCode = {}
    dataCode.id = datecolLive.value
    dataCode.deviceTable = storeLibrary.newDatafile.deviceTable
    dataCode.devicetablename = storeLibrary.newDatafile.sqlitetablename
    dataCode.name = columnLive.value
    dataCode.timestamp = isDateColumn.value
    dataCode.device = storeLibrary.newDatafile.deviceSelected
    dataCode.deviceID = storeLibrary.newDatafile.deviceID
    dataCode.deviceCol = deviceFilter.value
    dataCode.timerange = []
    dataCode.bbid = bbidLive.value
    storeAI.submitAsk(dataCode)
  }

  const choicedeviceEvent = () => {
    let dataCode = {}
    dataCode.id = datecolLive.value
    dataCode.deviceTable = storeLibrary.newDatafile.deviceTable
    dataCode.devicetablename = storeLibrary.newDatafile.sqlitetablename
    dataCode.name = columnLive.value
    dataCode.timestamp = isDateColumn.value
    dataCode.device = storeLibrary.newDatafile.deviceSelected
    dataCode.deviceID = storeLibrary.newDatafile.deviceID
    dataCode.deviceCol = deviceFilter.value
    dataCode.timerange = []
    dataCode.bbid = bbidLive.value
    storeAI.submitAsk(dataCode)
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#chat-interface {
  display: grid;
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
  display: grid;
  grid-template-columns: 1fr;
  width: 80%;
  height: auto;
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
      display: grid;
      height: 75vh;
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
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
      display: grid;
      grid-template-columns: 1fr;
      width: 80%;
      height: auto;
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
      background-color: rgb(113, 172, 114);
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
