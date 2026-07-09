<template>
  <div class="lens-column-content">
    <div
      v-for="group in groups"
      :key="group.id"
      class="context-group bucket"
      :class="[
        group.class,
        { 'drop-active': activeDropZone === group.id },
        { 'no-drag-group': group.noDrag }
      ]"
      @drop.stop="group.noDrag ? null : $emit('drop', $event, group.id)"
      @dragover.prevent="group.noDrag ? null : $emit('dragover', $event, group.id)"
      @dragleave="group.noDrag ? null : $emit('dragleave', $event, group.id)"
    >
      <h4 class="group-title">{{ group.title }}</h4>
      <slot name="group-prepend" :group="group"></slot>
      <div class="variable-list mini">
        <div
          v-for="(item, index) in group.items"
          :key="item.value"
          class="variable-tag assigned-tag"
          :class="{ 
            active: selectedValue === item.value,
            'attunement-active': group.id === 'attunement' && selectedValue === item.value,
            'strand-active': strandMode && item.activeStrand,
            'reorder-mode': isOrgoLogic && item.activeStrand
          }"
          :draggable="!group.noDrag"
          @dragstart="onItemDragStart($event, item, index, group.id)"
          @dragover.prevent="onItemDragOver($event, index, group.id)"
          @drop.stop="onItemDrop($event, index, group.id)"
          @dblclick="group.noDrag ? null : $emit('unmap', item.value)"
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
import { ref } from "vue";

const props = defineProps({
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
  strandMode: {
    type: Boolean,
    default: false,
  },
  isOrgoLogic: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "dragstart",
  "unmap",
  "select",
  "set-strand",
  "drop",
  "dragover",
  "dragleave",
  "reorder",
]);

const activeDropZone = ref(null);
const draggingIndex = ref(null);
const draggingGroup = ref(null);

const onItemDragStart = (e, item, index, groupId) => {
  if (props.isOrgoLogic && item.activeStrand) {
    draggingIndex.value = index;
    draggingGroup.value = groupId;
    e.dataTransfer.setData("application/json", JSON.stringify({ index, groupId, type: 'reorder', value: item.value }));
  }
  emit('dragstart', e, item.value);
};

const onItemDragOver = (e, index, groupId) => {
  if (props.isOrgoLogic) {
    e.dataTransfer.dropEffect = "move";
  }
};

const onItemDrop = (e, index, groupId) => {
  const data = e.dataTransfer.getData("application/json");
  if (data) {
    try {
      const { index: oldIndex, groupId: oldGroupId, type, value } = JSON.parse(data);
      if (type === 'reorder') {
        emit('reorder', { oldGroupId, newGroupId: groupId, oldIndex, newIndex: index, value });
        draggingIndex.value = null;
        draggingGroup.value = null;
        return;
      }
    } catch (err) {
      // Not a reorder event
    }
  }
  onDrop(e, groupId);
};

const onDragOver = (e, groupId) => {
  activeDropZone.value = groupId;
  e.dataTransfer.dropEffect = "move";
  // emit('dragover', e, groupId); // redundant but safe
};

const onDragLeave = (e, groupId) => {
  if (activeDropZone.value === groupId) {
    activeDropZone.value = null;
  }
};

const onDrop = (e, groupId) => {
  activeDropZone.value = null;
  emit('drop', e, groupId);
};
</script>

<style scoped>
.lens-column-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.context-group.bucket {
  min-height: 80px;
  display: flex;
  flex-direction: column;
}

.context-group.drop-active {
  background: rgba(0, 255, 204, 0.1);
  border-left-color: #00ffcc;
}

.group-title {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--sov-accent);
  margin-bottom: 0.2rem;
  letter-spacing: 0.15em;
  font-weight: 800;
  opacity: 0.7;
}

.variable-list {
  display: flex;
  flex-direction: row; /* Changed from column */
  flex-wrap: wrap; /* Added to handle overflow */
  gap: 10px;
  padding: 10px 0;
  min-height: 50px;
  flex: 1;
}

.variable-tag.assigned-tag {
  cursor: grab;
  background: rgba(0, 255, 200, 0.05);
  display: flex;
  align-items: center;
  gap: 8px;
  width: auto; /* Changed from 100% */
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--sov-text);
  transition: all 0.2s;
  font-size: 0.85rem;
  flex-shrink: 0; /* Prevent squishing */
}

.variable-tag.assigned-tag.active {
  background: rgba(0, 255, 200, 0.2);
  border-color: var(--sov-accent);
}

.variable-tag.assigned-tag.attunement-active {
  background: rgba(0, 200, 0, 0.2);
  border-color: #00ff00;
  color: #00ff00;
}

.variable-tag.assigned-tag.strand-active {
  background: rgba(0, 255, 0, 0.2);
  border-color: #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.variable-tag.assigned-tag.reorder-mode {
  cursor: ns-resize;
  border-style: dashed;
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
