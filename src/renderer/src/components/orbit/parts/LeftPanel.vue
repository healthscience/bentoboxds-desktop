<template>
  <div
    id="life-tools-panel"
    :style="{ width: isOpen ? width + 2 + 'px' : '30px', overflow: 'visible' }"
  >
    <aside
      class="side-rail left-rail overlay-blur"
      :style="{ width: width + 'px' }"
    >
      <div class="rail-content" :class="{ 'rail-faded': !isOpen }">
        <LifeTools
          :is-expanded="isOpen"
          :current-width="width"
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', $event)"
          @start-drawing="$emit('start-drawing')"
          @start-tagging="$emit('start-tagging')"
          @save-cue="$emit('save-cue', $event)"
        />
      </div>

      <button
        @mousedown.stop="$emit('startDrag')"
        @click="handleButtonClick"
        :class="['toggle-life-tools-button', { 'panel-open': isOpen }]"
        :style="{ left: width - 20 + 'px' }"
      >
        <div class="key-to-life">
          <div class="tear"></div>
          <div class="key-head"></div>
        </div>
      </button>
    </aside>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LifeTools from "@/components/orbit/lifetools/LifeTools.vue";

// PROPS: Controlled by PrimeInterface
const props = defineProps({
  modelValue: String, // Active World
  width: Number, // Current Panel Width
  isOpen: Boolean, // Toggle State
});

const emit = defineEmits([
  "update:width",
  "update:isOpen",
  "startDrag",
  "update:modelValue",
  "start-drawing",
  "start-tagging",
  "save-cue",
]);

const handleButtonClick = () => {
  // Toggle logic: notify parent to change values
  const nextState = !props.isOpen;
  emit("update:isOpen", nextState);

  // Snap to specific widths on click
  const nextWidth = nextState ? 300 : 30;
  emit("update:width", nextWidth);
};
</script>

<style scoped>
/* LEFT PANEL */
.left-rail {
  grid-area: tools;
  z-index: 1200;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.rail-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  padding-bottom: 100px;
  box-sizing: border-box;
}

.rail-faded {
  opacity: 0.1;
}

.toggle-life-tools-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: none;
  border: none;
  z-index: 250;
  cursor: ew-resize;
}

.tear {
  width: 38px;
  height: 38px;
  border-radius: 0 50% 50% 50%;
  background: #3b82f6;
  transform: rotate(45deg);
}

.switch-btn {
  flex: 1;
  border: none;
  background: white;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  font-size: 1.2rem;
}

.switch-btn.active {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}
</style>
