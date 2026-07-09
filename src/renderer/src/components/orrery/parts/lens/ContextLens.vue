<template>
  <div 
    class="lens-box context zone"
    :class="{ 'active-zone': activeZone === 'context' }"
    @drop.prevent="onDrop($event, 'context')"
    @dragover.prevent="onDragOver($event, 'context')"
    @dragleave="onDragLeave"
  >
    <header class="lens-header">
      <h3>context</h3>
    </header>
    <LensColumn
      :groups="[
        { id: 'peer', title: 'Body/Peer', items: bodyPeerItems },
        { id: 'environment', title: 'Building Environment', items: environmentItems },
        { id: 'earth', title: 'Earth Scales', items: earthItems },
      ]"
      :show-item-labels="true"
      :strand-mode="storeBesearch?.strandMode"
      :is-orgo-logic="storeBesearch?.isOrgoLogic"
      @dragstart="onDragStart"
      @unmap="unmapFragment"
      @select="handleCueSpace"
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
  bodyPeerItems: {
    type: Array,
    default: () => []
  },
  environmentItems: {
    type: Array,
    default: () => []
  },
  earthItems: {
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
const handleCueSpace = (val) => emit("select", val);
const onDrop = (e, zone) => emit("drop", e, zone);
const onDragOver = (e, zone) => emit("dragover", e, zone);
const onDragLeave = () => emit("dragleave");
const handleReorder = (data) => emit("reorder", data);
</script>

<style scoped>
</style>
