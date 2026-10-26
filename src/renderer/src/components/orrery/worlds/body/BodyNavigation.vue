<template>
  <div 
    class="floating-pane-container" 
    :class="{ 'collapsed': !isOpen }"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <div class="drag-handle" @mousedown.stop="startDrag" v-if="isOpen">
      <span class="drag-icon">⠿</span> BODY NAVIGATION
    </div>
    
    <button 
      class="map-toggle-trigger" 
      :class="{ 'map-pane-closed': !isOpen }"
      @click.stop="toggleMap"
    >
      {{ isOpen ? '◀ CLOSE BODY MAP' : '▶ OPEN BODY MAP' }}
    </button>

    <div class="pane left-pane" :class="{ 'collapsed': !isOpen }">
      <div class="map-wrapper" v-if="isOpen" ref="mapWrapperRef"
           :class="{ 'drawing-active': isDrawingMode }"
           @mousedown="handleDrawStart"
           @click="handleMapClick">
        <img src="@/assets/human-diagram.png" alt="Human Anatomy Map" class="anatomy-map" draggable="false" />
        
        <div class="map-overlay">
          <div 
            v-for="anchor in organAnchors" 
            :key="anchor.name"
            class="anchor-point"
            :style="{ left: (anchor.x * 100) + '%', top: (anchor.y * 100) + '%' }"
            @click.stop="selectOrgan(anchor.name)"
          >
            <span class="anchor-label">{{ anchor.name }}</span>
          </div>

          <div v-if="isDrawingMode && drawStartPoint && currentDrawPoint" class="draw-box active-draw" :style="activeDrawStyle"></div>
          <div v-if="drawBox" class="draw-box saved-draw" :style="savedDrawStyle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:isOpen', 'select-organ', 'draw-complete'])

// Structural Anchor Coordinates bound to the anatomy image layout
const organAnchors = [
]

const toggleMap = () => {
  emit('update:isOpen', !props.isOpen)
}

const selectOrgan = (name) => {
  emit('select-organ', name)
}

// Dragging Logic
const position = ref({ x: 350, y: 50 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const startDrag = (e) => {
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  position.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})

const mapWrapperRef = ref(null)
// Drawing Logic
const isDrawingMode = ref(false)
const drawStartPoint = ref(null)
const currentDrawPoint = ref(null)
const drawBox = ref(null)
const justDrew = ref(false)

const startDrawing = () => {
  isDrawingMode.value = true
  emit('update:isOpen', true)
}

const handleDrawStart = (e) => {
  if (!isDrawingMode.value || !mapWrapperRef.value) return
  e.stopPropagation()
  e.preventDefault()
  justDrew.value = false
  const rect = mapWrapperRef.value.getBoundingClientRect()
  drawStartPoint.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  currentDrawPoint.value = { ...drawStartPoint.value }

  document.addEventListener('mousemove', handleDrawMove)
  document.addEventListener('mouseup', handleDrawEnd)
}

const handleDrawMove = (e) => {
  if (!isDrawingMode.value || !drawStartPoint.value || !mapWrapperRef.value) return
  e.stopPropagation()
  const rect = mapWrapperRef.value.getBoundingClientRect()
  currentDrawPoint.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

const handleDrawEnd = (e) => {
  if (!isDrawingMode.value || !drawStartPoint.value) return
  e.stopPropagation()
  
  const width = Math.abs(currentDrawPoint.value.x - drawStartPoint.value.x)
  const height = Math.abs(currentDrawPoint.value.y - drawStartPoint.value.y)
  const radius = Math.max(width, height)
  
  drawBox.value = {
    x: Math.min(drawStartPoint.value.x, currentDrawPoint.value.x),
    y: Math.min(drawStartPoint.value.y, currentDrawPoint.value.y),
    width: radius,
    height: radius
  }
  isDrawingMode.value = false
  drawStartPoint.value = null
  currentDrawPoint.value = null
  justDrew.value = true
  emit('draw-complete')

  document.removeEventListener('mousemove', handleDrawMove)
  document.removeEventListener('mouseup', handleDrawEnd)
}

const activeDrawStyle = computed(() => {
  if (!drawStartPoint.value || !currentDrawPoint.value) return {}
  const width = Math.abs(currentDrawPoint.value.x - drawStartPoint.value.x)
  const height = Math.abs(currentDrawPoint.value.y - drawStartPoint.value.y)
  const radius = Math.max(width, height)
  
  const x = Math.min(drawStartPoint.value.x, currentDrawPoint.value.x)
  const y = Math.min(drawStartPoint.value.y, currentDrawPoint.value.y)
  
  return { left: x + 'px', top: y + 'px', width: radius + 'px', height: radius + 'px' }
})

const savedDrawStyle = computed(() => {
  if (!drawBox.value) return {}
  return { 
    left: drawBox.value.x + 'px', 
    top: drawBox.value.y + 'px', 
    width: drawBox.value.width + 'px', 
    height: drawBox.value.height + 'px' 
  }
})

const saveCueLocation = (cueId) => {
  if (drawBox.value) {
    drawBox.value = null
  }
}

defineExpose({ startDrawing, saveCueLocation })

// Translate explicit structural background map clicks into coordinate nodes
const handleMapClick = (e) => {
  if (justDrew.value) {
    justDrew.value = false
    return
  }
  if (isDrawingMode.value) return // Prevent map click logic if in drawing mode
  
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  
  const hit = organAnchors.find(anchor => {
    const dx = x - anchor.x
    const dy = y - anchor.y
    return Math.sqrt(dx * dx + dy * dy) <= anchor.radius
  })

  if (hit) {
    selectOrgan(hit.name)
  }
}
</script>

<style scoped>
.floating-pane-container {
  position: absolute;
  z-index: 1200;
  width: 350px;
  height: 74vh;
  pointer-events: none;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.floating-pane-container.collapsed {
  width: 0px;
  pointer-events: none;
}

.drag-handle {
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  height: 30px;
  background: rgba(0, 5, 5, 0.85);
  color: #00ffc8;
  border: 1px solid rgba(0, 255, 200, 0.4);
  border-bottom: none;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-family: monospace;
  font-size: 11px;
  font-weight: bold;
  cursor: grab;
  pointer-events: auto;
  border-radius: 4px 4px 0 0;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-icon {
  margin-right: 8px;
  font-size: 14px;
}

.pane {
  height: 500px;
  position: relative;
  border: 1px solid rgba(0, 255, 200, 0.1);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.left-pane {
  width: 100%;
  height: 100%;
  background: var(--color-background-soft, rgba(10, 10, 10, 0.95));
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  pointer-events: auto;
}

.left-pane.collapsed {
  width: 0px !important;
  border-color: transparent;
  pointer-events: none;
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.anatomy-map {
  max-height: 90%;
  max-width: 90%;
  object-fit: contain;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.anatomy-map:hover {
  opacity: 0.85;
}

.map-toggle-trigger {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 5, 5, 0.85);
  color: #00ffc8;
  border: 1px solid rgba(0, 255, 200, 0.4);
  padding: 6px 12px;
  font-family: monospace;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  z-index: 150;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 255, 200, 0.1);
  transition: all 0.2s ease;
  pointer-events: auto;
}

.map-toggle-trigger:hover {
  background: #00ffc8;
  color: #050505;
  box-shadow: 0 0 15px #00ffc8;
}

.map-toggle-trigger.map-pane-closed {
  left: -15px;
  top: 0;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.anchor-point {
  position: absolute;
  width: 14px;
  height: 14px;
  background: rgba(0, 255, 200, 0.2);
  border: 2px solid #00ffc8;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  cursor: pointer;
  box-shadow: 0 0 8px #00ffc8;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.anchor-point:hover {
  transform: translate(-50%, -50%) scale(1.4);
  background: #00ffc8;
  box-shadow: 0 0 15px #00ffc8, 0 0 30px #00ffc8;
}

.anchor-label {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  color: #00ffc8;
  font-family: monospace;
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  background: rgba(5, 10, 10, 0.9);
  padding: 3px 6px;
  border-radius: 3px;
  border: 1px solid rgba(0, 255, 200, 0.3);
  pointer-events: none;
}

.draw-box {
  position: absolute;
  border: 2px dashed #00ffc8;
  background: rgba(0, 255, 200, 0.2);
  pointer-events: none;
  border-radius: 50%;
}
.draw-box.saved-draw {
  border-style: solid;
  background: rgba(0, 255, 200, 0.4);
}

.drawing-active {
  cursor: crosshair;
}

.drawing-active .anchor-point {
  pointer-events: none;
}
</style>