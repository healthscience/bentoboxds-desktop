<template>
  <div class="lens-column-content">
    <div
      v-for="group in groups"
      :key="group.id"
      class="context-group bucket"
      :class="group.class"
      @drop.stop="$emit('drop', $event, group.id)"
      @dragover.prevent="$emit('dragover', $event, group.id)"
      @dragleave="$emit('dragleave', $event, group.id)"
    >
      <h4 class="group-title">{{ group.title }}</h4>
      <slot name="group-prepend" :group="group"></slot>
      <div class="variable-list mini">
        <div
          v-for="item in group.items"
          :key="item.value"
          class="variable-tag assigned-tag"
          :class="{ active: selectedValue === item.value }"
          draggable="true"
          @dragstart="$emit('dragstart', $event, item.value)"
          @dblclick="$emit('unmap', item.value)"
          @click="$emit('select', item.value)"
        >
          <div class="tag-content-wrapper">
            <span class="tag-label" v-if="item.label && showItemLabels"
              >{{ item.label }}:</span
            >
            {{ item.value }}
          </div>
          <slot
            name="item-append"
            :item="item"
            :active="selectedValue === item.value"
          ></slot>
          <span
            v-if="showRemove"
            class="remove-icon"
            @click.stop="$emit('unmap', item.value)"
            >×</span
          >
          <button
            v-if="showSetStrand && selectedValue === item.value"
            class="set-strand-btn-mini"
            @click.stop="$emit('set-strand', item.value)"
          >
            Set Strand
          </button>
        </div>
        <div v-if="!group.items.length" class="empty-state-mini">
          Initialize...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  groups: {
    type: Array,
    required: true,
    // Expected format: [{ id: 'peer', title: 'Body/Peer', items: [] }]
  },
  selectedValue: {
    type: String,
    default: null,
  },
  showItemLabels: {
    type: Boolean,
    default: false,
  },
  showRemove: {
    type: Boolean,
    default: true,
  },
  showSetStrand: {
    type: Boolean,
    default: false,
  },
});

defineEmits([
  "dragstart",
  "unmap",
  "select",
  "set-strand",
  "drop",
  "dragover",
  "dragleave",
]);
</script>

<style scoped>
.lens-column-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.context-group {
  border-left: 2px solid rgba(0, 255, 200, 0.1);
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0 12px 12px 0;
  transition: background 0.2s;
}

.group-title {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--sov-accent);
  margin-bottom: 0.5rem;
  letter-spacing: 0.15em;
  font-weight: 800;
  opacity: 0.7;
}

.variable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.variable-tag.assigned-tag {
  cursor: grab;
  background: rgba(0, 255, 200, 0.05);
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--sov-text);
  transition: all 0.2s;
  font-size: 0.85rem;
}

.variable-tag.assigned-tag.active {
  background: rgba(0, 255, 200, 0.2);
  border-color: var(--sov-accent);
}

.tag-content-wrapper {
  flex-grow: 1;
}

.remove-icon {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.remove-icon:hover {
  opacity: 1;
  color: #ef5350;
}

.empty-state-mini {
  font-size: 0.7rem;
  opacity: 0.3;
  font-style: italic;
  padding: 4px 0;
}

.set-strand-btn-mini {
  background: var(--sov-accent);
  color: black;
  border: none;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 800;
  cursor: pointer;
}
</style>
