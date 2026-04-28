<template>
  <div class="beebee-reply">
    <span class="right-time">{{ formattedTime }}</span>
    <div class="reply-text-chart">
      <div class="right-chat" v-if="messageType === 'agent'">
        <div v-if="isSimpleTextMessage" class="ai-text-message">
          {{ messageContent }}
        </div>
        <div class="beebee">
          <img class="right-chat-beebee" src="../../../assets/logo.png" alt="bbAI">
        </div>
      </div>
      <!-- Complex message types -->
      <div class="right-chat" v-else-if="messageType !== 'agent'">
        <tool-message v-if="messageType === 'upload' || messageType === 'library-peerlibrary' || messageType.action === 'library'" :message="messageData">
        </tool-message>
        <data-table v-else-if="messageType === 'datatable'">
        </data-table>
        <chart-message v-else-if="messageType === 'bentobox' || messageType === 'experiment' || messageType === 'network-library-n1'" :bboxid="bboxid" :messageType="messageType">
        </chart-message>
        <div v-else-if="messageType === 'library-peerlibrary'">
          <div class="beeebee-text">
            {{ messageType}}
          </div>      
        </div>
        <image-preview v-else-if="messageType === 'image-view'"></image-preview>
        <div class="beebee">
          <img class="right-chat-beebee" src="../../../assets/logo.png" alt="bbAI">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { useChatStore } from '@/stores/chatStore.js'
import DataTable from '@/components/beebeehelp/messages/dataTable.vue'
import ToolMessage from '@/components/beebeehelp/messages/ToolMessage.vue'
import ImagePreview from '@/components/dataspace/upload/imagePreview.vue'
import ChartMessage from '@/components/beebeehelp/messages/ChartMessage.vue'

const props = defineProps({
  message: [String, Object],
  timestamp: Date,
  bboxid: String,
  status: String,
  messageType: String,
  metadata: Object
})

const messageContent = computed(() => {
  if (typeof props.message === 'string') {
    return props.message
  }
  if (props.message && typeof props.message === 'object') {
    return props.message.content || props.message.text || props.message.data?.text || ''
  }
  return ''
})

const isSimpleTextMessage = computed(() => {
  return typeof props.message === 'string' || 
         (props.message && !props.message.type && !props.message.action)
})

const formattedTime = computed(() => {
  if (props.timestamp) {
    const date = new Date(props.timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return ''
})


const storeAI = aiInterfaceStore()
const storeLibrary = libraryStore()
const chatStore = useChatStore()

let columnFilter = ref('')
let deviceFilter = ref('')
let columnLive = ref('')
let datecolLive = ref('')
let bbidLive = ref('')
let isDateColumn = ref(0)
let filterActive = ref(false)
let summaryCSVState = ref(false)

const viewSummaryCSV = (bbid) => {
  chatStore.viewSummaryCSV(bbid)
}

const dataOptionVis = (did, colName, bbid, options, size) => {
  chatStore.dataOptionVis(did, colName, bbid, options, size)
}
const dataOptionFilter = (did, colName, bbid) => {
  chatStore.dataOptionFilter(did, colName, bbid)
}

const dateOptionSelect = (did, colName, bbid) => {
  chatStore.dateOptionSelect(did, colName, bbid)
}

const filterdeviceEvent = () => {
  chatStore.filterdeviceEvent()
}
const choicedeviceEvent = () => {
  chatStore.choicedeviceEvent()
}
</script>

<style scoped>
.beebee-reply {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  background-color: #d8d7e2;
  width: 90%;
  border-radius: 25px;
  margin-top: .5em;
  margin-left: 40px;
}

.right-chat-beebee {
  width: 50px;
}

.right-time {
  color: blue;
  font-size: 0.8em;
}

.right-chat {
  padding-top: 1em;
  display: block;
}

.beebee {
  display: grid;
  justify-self: end;
}

.networkactive {
  background-color: rgb(227, 243, 218);
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

.ai-text-message {
  padding: 10px 15px;
  background-color: #f8f8f8;
  border-radius: 18px;
  margin: 5px 0;
  word-wrap: break-word;
  font-size: 14px;
}
</style>