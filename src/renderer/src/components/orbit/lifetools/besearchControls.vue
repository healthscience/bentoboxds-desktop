<template>
  <div id="besearch-tools">
    <h3>Besearch</h3>
    <div class="besearch-control-buttons">
      <button
        @click="handleCreate"
        class="control-button"
        aria-label="Create new besearch"
      >
        Create
      </button>
      <button
        @click="handleStart"
        class="control-button"
        aria-label="Start besearch"
      >
        Start
      </button>
      <button
        @click="handleStop"
        class="control-button"
        aria-label="Stop besearch"
      >
        Stop
      </button>
    </div>

    <!-- Create Form Modal -->
    <besearch-create-form
      :show="showCreateForm"
      @close="handleCloseCreateForm"
      @save="handleCreateBesearchCycle"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import BesearchCreateForm from "./besearchCreateForm.vue";

import { besearchStore } from "@/stores/besearchStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";

// No emits needed - component is fully self-contained

const storeBesearch = besearchStore();
const storeAI = aiInterfaceStore();
// const showCreateForm = ref(false)

/* computed */
const showCreateForm = computed(() => storeBesearch.showCreateForm);

/* methods */
const handleCreate = () => {
  storeBesearch.openBesearchLayer();
};

const handleCloseCreateForm = () => {
  storeBesearch.showCreateForm = !storeBesearch.showCreateForm;
};

const handleCreateBesearchCycle = (formData) => {
  const diagonalOffset = storeBesearch.besearchCyles.length * 40;
  const newBesearch = {
    id: `besearch-${Date.now()}`,
    name: formData.name,
    description: formData.description,
    category: formData.category,
    status: formData.status,
    networkExperimentId: formData.networkExperiment,
    markerIds: [formData.marker],
    consilience: [],
    besearchCycles: [],
    x: 200 + diagonalOffset,
    y: 200 + diagonalOffset,
    active: true,
    linkedInterventions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  storeBesearch.saveToHOP(newBesearch);
};

const handleStart = async () => {
  storeAI.currentMode = "besearch";
};

const handleStop = async () => {
  storeAI.currentMode = "orbit";
};
</script>

<style scoped>
@media (min-width: 1024px) {
  .control-button {
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .control-button:hover {
    background-color: #9fb8d4;
  }

  .besearch-control-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
}
</style>
