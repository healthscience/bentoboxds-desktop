<template>
  <div class="teach-view">
    <h2>@teach session history</h2>
    <div class="teach-history-sessions" v-if="teachHistory.length > 0">
      <h3>Saved Teaching Sessions</h3>
      <div class="sessions-list">
        <div v-for="session in teachHistory" :key="session.id" class="session-item">
          <div class="session-summary">
            <span class="session-id">{{ session.key }}</span>
            <span class="session-actions">{{ session.value?.query }} </span>
            <span class="session-actions">{{ session.value.actions?.length || 0 }} actions</span>
            <span class="session-date">{{ formatTimestamp(session.value.endTime) }}</span>
            <button @click="viewSession(session)" class="view-btn">View Details</button>
            <button @click="deleteSession(session.key)" class="view-btn">Delete</button>
          </div>
          <div class="session-actions" v-if="actionDetailStatus === true">
            <div class="view-action-detail"  v-for="tact in session.value.actions">
              <span class="session-actions">component: {{ tact.component }} </span>
              <span class="session-actions">method: {{ tact.method }} </span>
              <span class="session-actions">args: {{ tact.args }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { teachingStore } from '@/stores/teachingStore'

const storeTeach = teachingStore()

let actionDetailStatus = ref(false)

/* computed */
const teachHistory = computed(() => {
  return storeTeach.teachHistory
})


/* methods */
const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString()

const viewSession = (session) => {
  actionDetailStatus.value = !actionDetailStatus.value
}

const deleteSession = (sessionID) => {
  console.log('deleteSession')
  console.log(sessionID)
  storeTeach.deleteTeachSession(sessionID)
}

</script>

<style scoped>
.teach-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.session-active {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.complete-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.complete-btn:hover {
  background-color: #45a049;
}

.actions-log {
  margin-bottom: 20px;
}

.actions-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
}

.action-item {
  border-bottom: 1px solid #eee;
  padding: 10px;
}

.action-item:last-child {
  border-bottom: none;
}

.action-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.action-type {
  font-weight: bold;
  color: #2196F3;
}

.action-timestamp {
  color: #666;
  font-size: 0.9em;
}

.action-content pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.9em;
  overflow-x: auto;
}

.session-info {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
}

.session-info p {
  margin: 5px 0;
}

.saved-sessions {
  margin-top: 30px;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.session-item {
  display: grid;
  grid-template-columns: 4fr;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.session-summary {
  display: flex;
  gap: 15px;
}

.view-action-detail {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.view-btn {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.view-btn:hover {
  background-color: #1976D2;
}

.no-session, .no-actions {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

  @media (min-width: 1024px) {
  
    

  }

</style>