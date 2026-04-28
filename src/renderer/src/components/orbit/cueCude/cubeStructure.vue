<template>
  <div class="cube-navigation-wrapper">
    <div class="cube-container" ref="container">
      <div v-if="selectedLabel" class="cube-label">
        {{ selectedLabel }}
      </div>
    </div>
    
    <div class="cube-controls">
      <button class="nav-btn prev" @click="rotatePrev" title="Previous Emulation">
        <span class="icon"><</span>
      </button>
      <button class="nav-btn next" @click="rotateNext" title="Next Emulation">
        <span class="icon">></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
const selectedLabel = ref('Heart Emulation')
const currentFaceIndex = ref(0)

let scene, camera, renderer, cube, animationId
let raycaster = new THREE.Raycaster()
let mouse = new THREE.Vector2()

// 4 Emulations for the 4 sides of the Y-axis (rotating in X plane)
const emulations = [
  { name: 'Heart Emulation', color: 0xff4444 },
  { name: 'River Emulation', color: 0x4444ff },
  { name: 'Rainfall Data', color: 0x44ff44 },
  { name: 'System Root', color: 0x888888 }
]

// Targets for Y-axis rotation (rotating the cube around its vertical axis)
const targets = [
  { x: 0, y: 0 },          // Front
  { x: 0, y: -Math.PI/2 }, // Right
  { x: 0, y: Math.PI },    // Back
  { x: 0, y: Math.PI/2 }   // Left
]

const initThree = () => {
  if (!container.value) return

  const width = container.value.clientWidth || 120
  const height = container.value.clientHeight || 120

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 2.5

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2)
  
  // Materials for the 4 sides + top/bottom (placeholders)
  const materials = [
    new THREE.MeshStandardMaterial({ color: emulations[1].color, opacity: 0.9, transparent: true }), // Right
    new THREE.MeshStandardMaterial({ color: emulations[3].color, opacity: 0.9, transparent: true }), // Left
    new THREE.MeshStandardMaterial({ color: 0x333333, opacity: 0.9, transparent: true }),           // Top
    new THREE.MeshStandardMaterial({ color: 0x333333, opacity: 0.9, transparent: true }),           // Bottom
    new THREE.MeshStandardMaterial({ color: emulations[0].color, opacity: 0.9, transparent: true }), // Front
    new THREE.MeshStandardMaterial({ color: emulations[2].color, opacity: 0.9, transparent: true })  // Back
  ]

  cube = new THREE.Mesh(geometry, materials)
  scene.add(cube)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)

  animate()
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  if (cube) {
    const target = targets[currentFaceIndex.value]
    // Smoothly interpolate Y rotation (X-plane movement)
    // We use a small epsilon to handle the PI to -PI jump if needed, 
    // but for 4 sides simple lerp works.
    cube.rotation.y += (target.y - cube.rotation.y) * 0.1
    cube.rotation.x += (target.x - cube.rotation.x) * 0.1
  }
  
  renderer.render(scene, camera)
}

const rotateNext = () => {
  currentFaceIndex.value = (currentFaceIndex.value + 1) % emulations.length
  selectedLabel.value = emulations[currentFaceIndex.value].name
}

const rotatePrev = () => {
  currentFaceIndex.value = (currentFaceIndex.value - 1 + emulations.length) % emulations.length
  selectedLabel.value = emulations[currentFaceIndex.value].name
}

const handleInteraction = (event, isDoubleClick = false) => {
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(cube)

  if (intersects.length > 0) {
    // Map the clicked face back to our 4-side index
    // This is a bit simplified for the 4-side constraint
    const faceIndex = intersects[0].faceIndex
    let emuIndex = 0
    if (faceIndex < 2) emuIndex = 1; // Right
    else if (faceIndex < 4) emuIndex = 3; // Left
    else if (faceIndex < 8) return; // Top/Bottom ignored for now
    else if (faceIndex < 10) emuIndex = 0; // Front
    else emuIndex = 2; // Back

    currentFaceIndex.value = emuIndex
    selectedLabel.value = emulations[emuIndex].name

    // Call viewEmulation on single click
    viewEmulation(emulations[emuIndex])

    if (isDoubleClick) {
      triggerSelection(emulations[emuIndex])
    }
  }
}

const viewEmulation = (emulation) => {
  console.log('Viewing emulation:', emulation)
}

const triggerSelection = (emulation) => {
  console.log('Selecting emulation:', emulation.name)
  const event = new CustomEvent('select-emulation', { detail: emulation })
  window.dispatchEvent(event)
}

onMounted(() => {
  initThree()
  container.value.addEventListener('click', (e) => handleInteraction(e, false))
  container.value.addEventListener('dblclick', (e) => handleInteraction(e, true))
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
    container.value?.removeChild(renderer.domElement)
  }
})
</script>

<style scoped>
.cube-navigation-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(228, 214, 214, 0.4);
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 200, 0.2);
  backdrop-filter: blur(5px);
}

.cube-container {
  width: 120px;
  height: 120px;
  position: relative;
  cursor: pointer;
}

.cube-label {
  position: absolute;
  top: -25px;
  left: -20px;
  right: -20px;
  text-align: center;
  color: #00ffc8;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  pointer-events: none;
  white-space: nowrap;
}

.cube-controls {
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: center;
}

.nav-btn {
  background: rgba(216, 230, 226, 0.1);
  border: 1px solid rgba(0, 255, 200, 0.3);
  color: #00ffc8;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(0, 255, 200, 0.3);
  transform: scale(1.1);
}

.nav-btn:active {
  transform: scale(0.9);
}

.icon {
  font-weight: bold;
  font-size: 16px;
}
</style>
