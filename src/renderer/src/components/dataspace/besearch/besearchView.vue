<template>
  <div class="beserach-view">
    <h2>Besearch history</h2>
    <div class="besearch-history-sessions" v-if="besearchHistory.length > 0">
      <div class="besearch-list">
        <div v-for="cycle in besearchHistory" :key="cycle.id" class="besearch-item">
          <div class="besearch-summary">
            <span class="besearch-id">{{ cycle.key }}</span>
            <span class="besearch-actions">{{ cycle.value.name }} </span>
            <span class="besearch-actions">{{ cycle.value.besearchCycles?.length || 0 }} cycles</span>
            <span class="besearch-date">{{ cycle.value.createdAt || cycle.value.updatedAt }}</span>
            <!--<button @click="viewBesearch(cycle)" class="view-btn">View Details</button>-->
            <button @click="deleteItem(cycle.key)" class="view-btn">Delete</button>
          </div>
          <div class="besearch-actions" v-if="actionDetailStatus === true">
            <div class="view-action-detail"  v-for="arc in cycle.value">
              <span class="besearch-actions">component: {{ arc.component }} </span>
              <span class="besearch-actions">method: {{ arc.method }} </span>
              <span class="besearch-actions">args: {{ arc.args }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { besearchStore } from '@/stores/besearchStore'

const storeBesearch = besearchStore()

let actionDetailStatus = ref(false)

/* computed */
const besearchHistory = computed(() => {
  return storeBesearch.besearchCyles
})


/* methods */
const viewBesearch = (session) => {
  actionDetailStatus.value = !actionDetailStatus.value
}

const deleteItem = (bsearchID) => {
  storeBesearch.deleteBesearch({ type: 'beserach', id: bsearchID })
}

</script>

<style scoped>
.besearch-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.besearch-active {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.besearch-header {
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

.besearch-info {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
}

.besearch-info p {
  margin: 5px 0;
}

.saved-besearch {
  margin-top: 30px;
}

.besearch-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.besearch-item {
  display: grid;
  grid-template-columns: 4fr;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.besearch-summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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

.no-besearch, .no-actions {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

  @media (min-width: 1024px) {
  
    

  }

</style>
