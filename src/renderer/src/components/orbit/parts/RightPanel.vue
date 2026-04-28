<template>
  <aside
    class="right-panel-container overlay-blur"
    :class="{ 'ribbon-mode': isInterplayActive, 'is-unrolled': isUnrolled }"
    :style="{
      width: isInterplayActive ? '400px' : width + 'px',
      height: isInterplayActive
        ? isUnrolled
          ? ribbonHeight + 'px'
          : '40px'
        : 'calc(100vh - var(--header-height, 60px))',
    }"
  >
    <div v-if="isInterplayActive" class="ribbon-pull-tab" @click="toggleUnroll">
      <div class="tab-indicator"></div>
    </div>
    <button
      v-if="!isInterplayActive"
      @mousedown.stop="handleMouseDown"
      @click="handleToggle"
      class="thought-bubble-button"
    >
      <div class="bubble-core">
        <div class="bubble-lines">
          <span class="line short"></span>
          <span class="line long">--</span>
          <span class="line medium"></span>
        </div>
        <div class="bubble-tail"></div>
      </div>
    </button>

    <div v-show="width > 50 || isInterplayActive" class="panel-content-wrapper">
      <div class="panel-content-area">
        <transition name="fade-slide" mode="out-in">
          <div
            v-if="mode === 'chat' && (!isInitialState || isInterplayActive)"
            class="chat-zone"
            key="chat"
          >
            <LifeDialogue :context="data" />
          </div>
        </transition>
      </div>

      <!-- Input for Peer in Ribbon Mode -->
      <div v-if="isInterplayActive && isUnrolled" class="ribbon-input-zone">
        <InputBox />
      </div>
    </div>

    <!-- Drag handle at the bottom of ribbon -->
    <div
      v-if="isInterplayActive && isUnrolled"
      class="ribbon-drag-handle"
      @mousedown.stop.prevent="startRibbonResize"
    >
      <div class="drag-handle-button">
        <span class="handle-icon">↕</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from "vue";
import LifeDialogue from "@/components/orbit/dialogue/lifeDialogue.vue";
import InputBox from "@/components/beebeehelp/inputBox.vue";
import { useChatStore } from "@/stores/chatStore.js";

const props = defineProps({
  width: Number,
  mode: String,
  isInitialState: Boolean,
  isOpen: Boolean,
  isInterplayActive: Boolean,
  data: Object,
});

const emit = defineEmits([
  "startDrag",
  "update:mode",
  "update:width",
  "update:isOpen",
]);

const dragStartTime = ref(0);
const isUnrolled = ref(false);

const storeChat = useChatStore();
const ribbonHeight = ref(400);
const isResizing = ref(false);

const toggleUnroll = () => {
  isUnrolled.value = !isUnrolled.value;
};

const startRibbonResize = (e) => {
  isResizing.value = true;
  const startY = e.clientY;
  const startHeight = ribbonHeight.value;

  const onMouseMove = (moveEvent) => {
    if (!isResizing.value) return;
    const delta = moveEvent.clientY - startY;
    ribbonHeight.value = Math.max(
      200,
      Math.min(window.innerHeight * 0.8, startHeight + delta),
    );
  };

  const onMouseUp = () => {
    isResizing.value = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

// Automatically unroll when new messages arrive in interplay mode
watch(
  () => storeChat.chatHistory,
  () => {
    if (props.isInterplayActive) {
      isUnrolled.value = true;
    }
  },
  { deep: true },
);

const handleMouseDown = (e) => {
  dragStartTime.value = Date.now();
  // We don't emit startDrag immediately to allow the click event to have a chance
  // But we need to start dragging if the mouse moves.
  // Let's try emitting it but ensuring handleToggle still works.
  emit("startDrag");
};

const handleToggle = () => {
  // Only toggle if it wasn't a long drag (e.g., less than 250ms)
  const duration = Date.now() - dragStartTime.value;

  // If the panel is closed (width <= 50), always open it on click
  // If it's open, toggle it.
  const nextState = props.width <= 50;
  emit("update:isOpen", nextState);
  emit("update:width", nextState ? 380 : 0);
};
</script>

<style scoped>
.right-panel-container {
  height: calc(100vh - var(--header-height, 60px));
  position: absolute;
  top: 0;
  right: 0;
  /* Allow bubble to sit outside the aside */
  overflow: visible !important;
  border-left: 1px solid var(--color-border);
  z-index: 700;
  transition: all 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.right-panel-container.ribbon-mode {
  height: 40px;
  top: 10px;
  right: 20px;
  border-left: none;
  border-radius: 20px;
  background: rgba(158, 113, 231, 0.85);
  backdrop-filter: blur(25px) saturate(180%);
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  /* Use visible to allow drag handle and pull tabs to show */
  overflow: visible !important;
}

.right-panel-container.ribbon-mode.is-unrolled {
  /* No static height, now uses ribbonHeight ref via inline styles */
  min-height: 200px;
}

.ribbon-input-zone {
  padding: 10px 20px 30px 20px; /* More padding at bottom for the drag handle space */
  background: rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

:deep(#ai-interaction) {
  background: transparent !important;
  border: none !important;
}

:deep(#askinput) {
  background: rgba(0, 0, 0, 0.2) !important;
  color: white !important;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.ribbon-drag-handle {
  height: 24px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ns-resize;
  position: absolute;
  bottom: -12px;
  left: 0;
  z-index: 1100;
}

.drag-handle-button {
  width: 60px;
  height: 20px;
  background: rgba(158, 113, 231, 0.9);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.drag-handle-button:hover {
  background: rgba(158, 113, 231, 1);
  transform: scale(1.1);
}

.handle-icon {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.ribbon-pull-tab {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.tab-indicator {
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
}

.thought-bubble-button {
  position: absolute;
  top: 50%;
  left: -45px; /* Sits completely outside the panel */
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  z-index: 999;
}

.bubble-core {
  display: grid;
  grid-template-rows: repeat(3, 4px);
  gap: 4px;
  padding: 8px;
  width: 42px;
  height: 34px;
  background: #9e71e7;
  border-radius: 14px 14px 2px 14px;
  position: relative;
}

.bubble-tail {
  position: absolute;
  bottom: -4px;
  right: 4px;
  width: 10px;
  height: 10px;
  background: #38205f;
  border-radius: 50%;
}

.line {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 2px;
  height: 3px;
}
.line:nth-child(1) {
  width: 50%;
}
.line:nth-child(2) {
  width: 90%;
}
.line:nth-child(3) {
  width: 70%;
}

.panel-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: visible; /* Changed from hidden to allow input zone to sit at bottom */
}

.header-text {
  padding: 10px 20px;
  opacity: 0.6;
  font-size: 0.7rem;
  font-weight: bold;
}
.panel-content-area {
  flex: 1;
  overflow: hidden;
  padding: 0 20px;
}
</style>
