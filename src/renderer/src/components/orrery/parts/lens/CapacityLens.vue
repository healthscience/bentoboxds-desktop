<template>
  <div
    class="lens-box capacity zone"
    :class="{ 'active-zone': activeZone === 'capacity' }"
    @drop.prevent="onDrop($event, 'capacity')"
    @dragover.prevent="onDragOver($event, 'capacity')"
    @dragleave="onDragLeave"
  >
    <header class="lens-header">
      <h3>capacity</h3>
    </header>
    <LensColumn
      :groups="[{ id: 'capacity', title: 'Capacity', items: capacityItems }]"
      :show-item-labels="true"
      :strand-mode="storeBesearch?.strandMode"
      :is-orgo-logic="storeBesearch?.isOrgoLogic"
      @dragstart="onDragStart"
      @unmap="unmapFragment"
      @select="selectCapacity"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @reorder="handleReorder"
    />
  </div>
</template>

<script setup>
import LensColumn from "@/components/orrery/parts/shared/LensColumn.vue";

const props = defineProps({
  activeZone: {
    type: String,
    default: null
  },
  capacityItems: {
    type: Array,
    default: () => []
  },
  storeBesearch: {
    type: Object,
    required: true
  }
});

const emit = defineEmits([
  "dragstart",
  "unmap",
  "select",
  "drop",
  "dragover",
  "dragleave",
  "reorder"
]);

const onDragStart = (e, val) => emit("dragstart", e, val);
const unmapFragment = (val) => emit("unmap", val);
const selectCapacity = (val) => emit("select", val);
const onDrop = (e, zone) => emit("drop", e, zone);
const onDragOver = (e, zone) => emit("dragover", e, zone);
const onDragLeave = () => emit("dragleave");
const handleReorder = (data) => emit("reorder", data);
</script>

<style scoped>
</style>
