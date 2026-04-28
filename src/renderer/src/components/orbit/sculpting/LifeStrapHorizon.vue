<template>
  <div
    class="lifestrap-horizon"
    ref="horizonRef"
    @mousemove="onDrag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
  >
    <!-- Top: Grafting View -->
    <div
      class="horizon-pane grafting-pane"
      :style="{ height: splitRatio + '%' }"
    >
      <LifeStrapGraftingView :strap="strap" :color="strapColor" active />
    </div>

    <!-- Horizontal Slider / Divider -->
    <div class="horizon-slider" @mousedown="startDrag">
      <div class="slider-handle">
        <span class="handle-line"></span>
        <span class="handle-label">HORIZON</span>
        <span class="handle-line"></span>
      </div>
    </div>

    <!-- Bottom: Specific View -->
    <div
      class="horizon-pane specific-pane"
      :style="{ height: 100 - splitRatio + '%' }"
    >
      <LifeStrapSpecificView :strap="strap" :color="strapColor" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import LifeStrapGraftingView from "./LifeStrapGraftingView.vue";
import LifeStrapSpecificView from "./LifeStrapSpecificView.vue";

const props = defineProps({
  strap: Object,
});

const horizonRef = ref(null);
const splitRatio = ref(60); // Percentage for the top pane
const isDragging = ref(false);

const strapColor = computed(
  () => props.strap?.value?.computational?.color || "#00ffc8",
);

const startDrag = (e) => {
  isDragging.value = true;
  document.body.style.cursor = "ns-resize";
};

const onDrag = (e) => {
  if (!isDragging.value || !horizonRef.value) return;

  const rect = horizonRef.value.getBoundingClientRect();
  const y = e.clientY - rect.top;
  const newRatio = (y / rect.height) * 100;

  // Constraints
  if (newRatio > 20 && newRatio < 80) {
    splitRatio.value = newRatio;
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.body.style.cursor = "default";
};
</script>

<style scoped>
.lifestrap-horizon {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--bg-base, #050505);
  overflow: hidden;
  user-select: none;
}

.horizon-pane {
  width: 100%;
  min-height: 0;
  padding: 5px;
  box-sizing: border-box;
}

.horizon-slider {
  height: 12px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  cursor: ns-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.2s;
}

.horizon-slider:hover {
  background: rgba(255, 255, 255, 0.1);
}

.slider-handle {
  display: flex;
  align-items: center;
  gap: 15px;
  opacity: 0.6;
}

.handle-line {
  width: 100px;
  height: 1px;
  background: currentColor;
}

.handle-label {
  font-family: "Space Mono", monospace;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.4em;
  color: white;
}

.grafting-pane {
  border-bottom: 2px solid rgba(65, 105, 225, 0.2);
}

.specific-pane {
  border-top: 2px solid rgba(0, 255, 200, 0.2);
}
</style>
