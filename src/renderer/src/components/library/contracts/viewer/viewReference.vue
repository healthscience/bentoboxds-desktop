<template>
  <div class="view-reference">
    <div v-if="referenceData.length === 0" class="no-data">
      No reference contracts found.
    </div>
    
    <div v-for="cd in referenceData" :key="cd.key" class="reference-item">
      <lib-card>
        <template #header>
          <div class="card-header-content">
            <div class="header-main">
              <span class="contract-label">Ref. Contract:</span>
              <span class="contract-name">{{ cd.value.refcontract || cd.value.concept?.name || cd.value.computational?.name }}</span>
            </div>
            <div class="header-meta">
              <span class="version-tag">v1.0</span>
              <span v-if="cd.value.time?.createTimestamp" class="date-tag">
                {{ DateTime.fromMillis(cd.value.time.createTimestamp).toFormat('yyyy-MM-dd') }}
              </span>
            </div>
          </div>
        </template>

        <div class="card-body-content">
          <!-- Question View -->
          <div v-if="viewType === 'question-view'" class="view-section">
            <div class="info-row">
              <span class="info-label">Question:</span>
              <span class="info-value">{{ cd.value.concept?.name }}</span>
            </div>
          </div>

          <!-- Datatype View -->
          <div v-else-if="viewType === 'datatype-view'" class="view-section">
            <div class="info-row">
              <span class="info-label">Description:</span>
              <span class="info-value">{{ cd.value.concept?.description }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Measurement:</span>
              <span class="info-value">{{ cd.value.concept?.measurement }}</span>
            </div>
            <div class="links-row">
              <a v-if="cd.value.concept?.wiki" href="#" @click.prevent="openWikipedia(cd.value.concept.wiki)" class="lib-link">
                Wikipedia
              </a>
              <a v-if="cd.value.concept?.rdf" href="#" @click.prevent="openRDF(cd.value.concept.rdf)" class="lib-link">
                RDF Data
              </a>
            </div>
          </div>

          <!-- Packaging View -->
          <div v-else-if="viewType === 'packaging-view'" class="view-section">
             <div class="info-row">
              <span class="info-label">Package Name:</span>
              <span class="info-value">{{ cd.value.concept?.name || cd.value.computational?.name }}</span>
            </div>
            <!-- Add more packaging specific fields here -->
          </div>

          <div class="key-section">
            <span class="key-label">Key:</span>
            <code>{{ cd.key }}</code>
          </div>
        </div>

        <template #footer>
          <div class="card-actions">
            <lib-button variant="danger" @click="deleteRefC(cd.key, viewType)">
              Delete Contract
            </lib-button>
          </div>
        </template>
      </lib-card>
    </div>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import LibCard from '@/components/library/shared/LibCard.vue'
import LibButton from '@/components/library/shared/LibButton.vue'

defineProps({
  referenceData: {
    type: Array,
    default: () => []
  },
  viewType: String
})

const emit = defineEmits(['delete', 'open-wiki', 'open-rdf'])

const deleteRefC = (key, type) => {
  emit('delete', { key, type })
}

const openWikipedia = (url) => {
  window.open(url, '_blank')
}

const openRDF = (url) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.view-reference {
  padding: 1rem;
}

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-main {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.contract-label {
  font-size: 0.8rem;
  opacity: 0.7;
  text-transform: uppercase;
}

.contract-name {
  font-weight: 700;
}

.header-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.version-tag {
  background: var(--sov-accent);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
}

.info-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.info-label {
  font-weight: 600;
  min-width: 120px;
  color: var(--sov-text-muted);
}

.info-value {
  color: var(--sov-text);
}

.links-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.lib-link {
  color: var(--sov-accent);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: var(--sov-transition-med);
}

.lib-link:hover {
  border-bottom-color: var(--sov-accent);
}

.key-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.8rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.key-label {
  color: var(--sov-text-muted);
}

code {
  background: var(--sov-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: var(--sov-text-muted);
  font-style: italic;
}
</style>
