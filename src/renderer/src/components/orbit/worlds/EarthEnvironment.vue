E<template>
  <div class="earth-grid-container" @mousemove="handleMouseMove" @click="toggleFixed">
    <section class="grid-main-viewport base-map">
      <OpenStreetMap 
        :center="[genesisLocation.lat, genesisLocation.lon]" 
        :zoom="currentZoom" 
        :layer-type="currentLayer"
        :location-name="genesisLocation.name"
        ref="mapRef"
        @zoom-change="handleZoomChange"
      />
    </section>

    <section 
      class="grid-main-viewport portal-lens" 
      :style="lensStyle"
      :class="{ 'drawing-mode': isDrawingActive, 'tagging-mode': isTaggingActive }"
      @click="handleLensClick"
    >
      <!-- Layer 0: Surface (Map Tools) -->
      <template v-if="zoomDepth === 0">
        <PathTool 
          v-if="isDrawingActive" 
          @path-complete="handleNewRiverStrapDraw" 
        />

        <RiverEmulation 
          v-else 
          :strapped-paths="savedRivers" 
        />
      </template>

      <!-- Layer 1: Environment (3D Building) -->
      <div v-if="zoomDepth === 1" class="depth-layer environment-layer">
        <div class="building-placeholder">
          <AlgotectureSpace />
        </div>
      </div>

      <!-- Layer 2: Solar System (Earth-Sun Relationship) -->
      <div v-if="zoomDepth === 2" class="depth-layer solar-system-layer">
        <div class="solar-placeholder">
          <GaiaEmulation />
        </div>
      </div>

      <div class="home-anchor" @click.stop="returnToGenesis">
        <div class="pulse-ring"></div>
        <span>⌂</span>
      </div>
    </section>

    <!-- Lens HUD -->
    <div 
      class="lens-hud" 
      :style="hudStyle"
      :class="{ 'is-locked': isLocked, 'is-fixed': isFixed }"
      @click.stop
    >
      <div class="depth-control">
        <input type="range" min="0" max="2" v-model.number="zoomDepth" orient="vertical">
        <span class="depth-label">{{ depthName }}</span>
      </div>

      <button class="lock-btn" @click="toggleLock">
        {{ isLocked ? '🔓 UNLOCK' : '🔒 LOCK' }}
      </button>

      <div class="layer-control">
        <button 
          v-for="layer in earthLayers" 
          :key="layer"
          :class="{ active: currentLayer === layer }"
          @click="currentLayer = layer"
        >
          {{ layer.toUpperCase() }}
        </button>
      </div>

      <div class="fixed-indicator" v-if="isFixed && !isLocked">
        📍 FIXED (Click world to release)
      </div>

      <div class="strap-status" v-if="linkedCue">
        Linked to: {{ linkedCue.name }} | Coherence: {{ linkedCue.coherence }}%
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { diaryStore } from '@/stores/diaryStore.js';
import heliToGPS from '@/stores/hopUtility/heliToCoordUtil.js'
import OpenStreetMap from '@/components/orbit/worlds/map/OpenstreetMap.vue';
import PathTool from '@/components/orbit/worlds/tools/PathTool.vue';
import RiverEmulation from '@/components/orbit/emulations/river/RiverEmulation.vue';
import GaiaEmulation from '@/components/orbit/worlds/daisyworld/gaiaEmulation.vue';
import AlgotectureSpace from '@/components/orbit/worlds/environment/algotectureSpace.vue';
import { useLensStability } from '@/composables/useLensStability';

const storeDiary = diaryStore();
const mapRef = ref(null);
const isDrawingActive = ref(false);
const isTaggingActive = ref(false);
const savedRivers = ref([]);
const savedTags = ref([]);
const currentZoom = ref(13);
// const currentLayer = ref('osm');

const { lensPos, isLocked, isFixed, zoomDepth, linkedCue, handleMouseMove, toggleLock, toggleFixed } = useLensStability();

const depthName = computed(() => ['SURFACE', 'ENVIRONMENT', 'SOLAR SYSTEM'][zoomDepth.value]);

/* computed */
/* genesis location convert */
const genesisLocation = computed(() => {
  if (storeDiary.orbitSignature && storeDiary.orbitSignature.location) {
    const loc = storeDiary.orbitSignature.location;
    return {
      lat: loc.lat || loc.latitude || 0,
      lon: loc.long || loc.lng || loc.longitude || 0,
      zoom: loc.zoom || 8,
      name: loc.name || loc.town || ''
    };
  }
  return { lat: 0, lon: 0, zoom: 13, name: '' };
});

const earthLayers = computed(() => {
  return storeDiary.earthLayers || ['osm', 'satellite', 'terrain'];
});

const currentLayer = computed(() => {
  return storeDiary.currentLayer || 'osm';
});

// Initialize currentZoom from genesisLocation
watch(genesisLocation, (newLoc) => {
  if (newLoc && newLoc.zoom) {
    currentZoom.value = newLoc.zoom;
  }
}, { immediate: true });

// Watch for changes in genesisLocation to update the map
watch(genesisLocation, (newLoc) => {
  if (newLoc && mapRef.value && typeof mapRef.value.panTo === 'function') {
    mapRef.value.panTo([newLoc.lat, newLoc.lon]);
  }
}, { immediate: true });


const handleLensClick = (e) => {
  if (!isTaggingActive.value) return;
  
  // Calculate relative offset from genesis
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  
  const geoPoint = heliToGPS(genesisLocation.value, { x: clickX, y: clickY });
  
  const newTag = {
    id: Date.now(),
    x: clickX,
    y: clickY,
    coordinates: geoPoint,
    cue: linkedCue.value ? linkedCue.value.name : 'Custom Location'
  };
  
  savedTags.value.push(newTag);
  isTaggingActive.value = false;
  
  console.log(`Location tagged at ${geoPoint.lat}, ${geoPoint.lon}`);
  // Here we would save to the Peer's local store
};

const handleNewRiverStrap = (pixelPoints) => {
  // Convert the "Ink" into real-world "Strap Data"
  const geoPoints = pixelPoints.map(pt => heliToGPS(genesisLocation.value, pt));
  
  const newStrap = {
    id: Date.now(),
    pixels: pixelPoints, // For the Emulation layer
    coordinates: geoPoints, // For the Ledger/OSM
    context: 'bioregional-flow'
  };

  savedRivers.value.push(newStrap);
  
  // Acknowledge the Peer
  console.log(`River strapped to Genesis at ${newStrap.coordinates[0].lat}`);
};


/* methods */
const handleZoomChange = (newZoom) => {
  if (typeof newZoom === 'number') {
    currentZoom.value = newZoom;
  }
};

const returnToGenesis = () => {
  // Directly command the map to snap home
  mapRef.value.panTo([genesisLocation.value.lat, genesisLocation.value.lon]);
  // Reset zoom to genesis default
  currentZoom.value = genesisLocation.value.zoom;
  // Reset the Portal Lens to center
  lensPos.value = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
};

const handleNewRiverStrapDraw = (points) => {
  savedRivers.value.push({ id: Date.now(), points });
  isDrawingActive.value = false;
};

const startDrawing = () => {
  isDrawingActive.value = !isDrawingActive.value;
  if (isDrawingActive.value) isTaggingActive.value = false;
};

const startTagging = () => {
  isTaggingActive.value = !isTaggingActive.value;
  if (isTaggingActive.value) isDrawingActive.value = false;
};

defineExpose({ startDrawing, startTagging });

const lensStyle = computed(() => ({
  'background': `radial-gradient(circle 250px at ${lensPos.value.x}px ${lensPos.value.y}px, transparent 0%, rgba(0,0,0,0.4) 100%)`
}));

const hudStyle = computed(() => ({
  transform: `translate(${lensPos.value.x}px, ${lensPos.value.y}px)`
}));
</script>

<style scoped>
.earth-grid-container {
  display: grid;
  grid-template-columns: 1fr; /* Main view only */
  grid-template-rows: 1fr;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #000;
  position: relative;
}

.grid-main-viewport {
  grid-column: 1;
  grid-row: 1;
}

.portal-lens {
  z-index: 2;
  background: rgba(0, 255, 200, 0.05); /* Subtle data glow */
  pointer-events: none; /* By default, clicks go to map */
}

.portal-lens.drawing-mode,
.portal-lens.tagging-mode {
  pointer-events: auto; /* Intercept clicks to draw or tag */
}

/* Depth Layers */
.depth-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 5;
  background: rgba(0, 0, 0, 0.6);
}

.building-placeholder, .solar-placeholder {
  width: 90%;
  height: 90%;
  border: 2px dashed var(--sov-accent);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 255, 200, 0.05);
  box-shadow: 0 0 30px rgba(0, 255, 200, 0.1);
  overflow: hidden;
}

.placeholder-content {
  text-align: center;
  color: var(--sov-accent);
}

.placeholder-content .icon {
  font-size: 64px;
  display: block;
  margin-bottom: 20px;
}

.placeholder-content h3 {
  margin: 0;
  font-size: 24px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.placeholder-content p {
  margin: 10px 0 0;
  opacity: 0.7;
}

.grid-sidebar {
  grid-column: 2;
  z-index: 10;
  padding: 20px;
  background: #0a0a0a;
  border-left: 1px solid #222;
}

.glass-panel button.active { background: var(--sov-accent); color: black; }

.home-anchor {
  position: absolute;
  bottom: 100px; /* Above the agents footer */
  left: 20px;
  width: 50px;
  height: 50px;
  background: var(--sov-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 0 15px var(--resonance-color);
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--sov-accent);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* Lens HUD Styles */
.lens-hud {
  position: absolute;
  top: -125px; /* Offset to sit above the lens circle */
  left: -125px;
  width: 250px;
  height: 250px;
  pointer-events: none;
  z-index: 100;
  border: 2px solid rgba(0, 255, 200, 0.3);
  border-radius: 50%;
  transition: border-color 0.3s;
}

.lens-hud.is-locked { 
  border-color: #ff4400; 
  box-shadow: 0 0 20px rgba(255, 68, 0, 0.4);
}

.lens-hud.is-fixed {
  border-color: #00ffc8;
  box-shadow: 0 0 20px rgba(0, 255, 200, 0.4);
}

.fixed-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #00ffc8;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  pointer-events: none;
  text-shadow: 0 0 5px black;
  white-space: nowrap;
}

.depth-control {
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 8px;
  color: white;
  z-index: 101;
}

.depth-control input[type=range][orient=vertical] {
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  width: 8px;
  height: 100px;
  padding: 0 5px;
}

.depth-label {
  margin-top: 10px;
  font-size: 12px;
  font-weight: bold;
}

.lock-btn {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 15px;
  border-radius: 15px;
  cursor: pointer;
}

.lock-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.layer-control {
  position: absolute;
  left: -100px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 8px;
  z-index: 101;
}

.layer-control button {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.layer-control button.active {
  background: var(--sov-accent);
  color: black;
  border-color: var(--sov-accent);
}

.strap-status {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #00ffc8;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  white-space: nowrap;
}
</style>