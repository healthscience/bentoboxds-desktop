<template>
  <div
    class="life-strap-node"
    :class="{ 'is-active': active, 'is-expanded': showOptions }"
  >
    <div class="strap-row">
      <div class="strap-orb-wrap">
        <div
          class="orb-core"
          :style="{ '--orb-color': strap?.value?.computational?.color }"
        ></div>
        <svg class="orb-progress" viewBox="0 0 40 40">
          <circle cx="12" cy="12" r="8" />
        </svg>
      </div>

      <div class="strap-info" @click="handleLSelect(strap)">
        <span class="strap-label">{{
          strap?.value?.concept?.story?.slice(0, 20) || "Untitled"
        }}</span>
      </div>

      <button class="strap-settings" @click="toggleOptions($event)">...</button>
    </div>

    <!-- Expanded Options -->
    <div v-if="showOptions" class="strap-options">
      <div class="strap-story-expanded">
        {{ strap.value.concept.story }}
      </div>
      <div class="strap-actions">
        <button class="delete-btn" @click="handleLSDelete(strap.key)">
          Delete Story
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  strap: Object,
  active: Boolean,
  expanded: Boolean,
});

const emit = defineEmits(["select", "delete"]);

const showOptions = ref(false);

/* Compute an ID that includes name words */
const strapIdWithName = computed(() => {
  const s = props.strap;
  if (!s) return "";
  // Generate ID: ls_{first_two_words}_{year}
  const nameWords = s.name
    ? s.name.split(" ").slice(0, 2).join("_").toLowerCase()
    : "unnamed";
  const year = s.id ? s.id.match(/\d{4}/)?.[0] || "2026" : "2026";
  return `ls_${nameWords}_${year}`;
});

/* methods */
const toggleOptions = (event) => {
  event.stopPropagation();
  showOptions.value = !showOptions.value;
};

const handleLSDelete = (key) => {
  emit("delete", key);
};

const handleLSelect = (strapData) => {
  // Emit full strap data including the name-enhanced ID
  emit("select", strapData);
};
</script>

<style scoped>
.life-strap-node {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  &.is-active {
    background-color: rgba(255, 255, 255, 0.12);
  }

  &.is-expanded {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .strap-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .strap-orb-wrap {
    position: relative;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  .orb-core {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--orb-color, #888);
    z-index: 1;
    box-shadow: 0 0 8px var(--orb-color, rgba(255, 255, 255, 0.2));
  }

  .orb-progress {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 0;
    left: 0;
    transform: rotate(-90deg);

    circle {
      fill: none;
      stroke: rgba(255, 255, 255, 0.1);
      stroke-width: 2;
    }
  }

  .strap-info {
    flex-grow: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .strap-label {
    font-size: 0.9rem;
    color: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .strap-settings {
    background: none;
    border: none;
    color: rgba(4, 2, 114, 0.5);
    cursor: pointer;
    padding: 4px 8px;
    font-size: 1.2rem;
    line-height: 1;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .strap-options {
    padding: 10px;
    background: rgba(65, 76, 228, 0.7);
    border-radius: 4px;
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .strap-story-expanded {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.4;
  }

  .strap-actions {
    display: flex;
    justify-content: flex-end;
  }

  .delete-btn {
    background: rgba(255, 50, 50, 0.1);
    border: 1px solid rgba(255, 50, 50, 0.3);
    color: #ff6666;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;

    &:hover {
      background: rgba(250, 18, 18, 0.3);
      color: white;
    }
  }
}
</style>
