<template>
  <div class="peer-ask">
    <img class="left-chat-peer" src="../../../assets/peerlogo.png" alt="Avatar">
    <div v-if="messageContent" class="peer-message-container">
      <div class="peer-message-bubble">
        <p>{{ messageContent }}</p>
        <div v-if="tools && tools.length > 0" class="tools-used">
          <span v-for="tool in tools" :key="tool" class="tool-tag">@{{ tool }}</span>
        </div>
      </div>
      <div class="peer-message-time">{{ formattedTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: [String, Object],
  timestamp: Date,
  bboxid: String,
  tools: {
    type: Array,
    default: () => []
  }
})

const messageContent = computed(() => {
  if (typeof props.message === 'string') {
    return props.message
  } else if (props.message && typeof props.message === 'object') {
    return props.message.text || props.message.content || ''
  }
  return ''
})

const formattedTime = computed(() => {
  if (props.timestamp) {
    const date = new Date(props.timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return ''
})
</script>

<style scoped>
.peer-ask {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  background: linear-gradient(to right, #FFF0F5, #F8BBD9);
  border-radius: 25px;
  width: 80%;
}

.left-chat-peer {
  width: 50px;
}

.peer-message-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: .8em;
}

.peer-message-bubble {
  background-color: #1565C0;
  color: white;
  padding: 10px 15px;
  border-radius: 18px 18px 18px 0;
  max-width: 98%;
  word-wrap: break-word;
  margin-bottom: 2px;
  font-size: 14px;
}

.peer-message-time {
  font-size: 0.7em;
  color: #6c757d;
  margin-left: 5px;
}

.tools-used {
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tool-tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.8em;
}
</style>