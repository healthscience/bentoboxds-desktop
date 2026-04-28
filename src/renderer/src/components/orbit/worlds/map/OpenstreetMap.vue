<template>
  <div class="earth-world">
    <ol-map style="width: 100%; height: 100%;">
        <ol-view 
          ref="viewRef" 
          :center="[center[1], center[0]]" 
          :zoom="zoom" 
          projection="EPSG:4326" 
          @change:resolution="onResolutionChanged"
        />
        
        <!-- Standard OSM Layer -->
        <ol-tile-layer v-if="layerType === 'osm'">
          <ol-source-osm />
        </ol-tile-layer>

        <!-- Satellite Layer (ArcGIS) -->
        <ol-tile-layer v-if="layerType === 'satellite'">
          <ol-source-xyz url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </ol-tile-layer>

        <!-- Terrain Layer (OpenTopoMap) -->
        <ol-tile-layer v-if="layerType === 'terrain'">
          <ol-source-xyz url="https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png" />
        </ol-tile-layer>

        <!-- Genesis Marker -->
        <ol-vector-layer v-if="center">
          <ol-source-vector>
            <ol-feature>
              <ol-geom-point :coordinates="[center[1], center[0]]" />
              <ol-style>
                <ol-style-circle :radius="8">
                  <ol-style-fill color="#00ffc8"></ol-style-fill>
                  <ol-style-stroke color="#000" :width="2"></ol-style-stroke>
                </ol-style-circle>
                <ol-style-text 
                  v-if="locationName"
                  :text="locationName" 
                  :offsetY="-30" 
                  font="bold 14px sans-serif"
                >
                  <ol-style-fill color="#00ffc8"></ol-style-fill>
                  <ol-style-stroke color="#000" :width="3"></ol-style-stroke>
                </ol-style-text>
              </ol-style>
            </ol-feature>
          </ol-source-vector>
        </ol-vector-layer>
      </ol-map>
  </div>
</template>

 <script setup>
  import { ref, onMounted } from 'vue'
  import { Protocol } from 'pmtiles'

  const props = defineProps({
    center: {
      type: Array,
      default: () => [-160, 0]
    },
    zoom: {
      type: Number,
      default: 3
    },
    locationName: {
      type: String,
      default: ''
    },
    layerType: {
      type: String,
      default: 'osm' // 'osm', 'satellite', 'terrain'
    }
  });

  const emit = defineEmits(['zoom-change']);

  const markerIcon = ref('https://openlayers.org/en/latest/examples/data/icon.png');

  const viewRef = ref(null);

  onMounted(() => {
    // Register PMTiles protocol for OpenLayers
    const protocol = new Protocol();
    // This allows using pmtiles:// URLs in ol-source-xyz
    // Note: In a real P2P scenario, this protocol handler would be 
    // hooked into the HOP peer network to fetch byte ranges.
  });

  const onResolutionChanged = () => {
    if (viewRef.value) {
      const newZoom = viewRef.value.getZoom();
      if (newZoom !== undefined) {
        emit('zoom-change', newZoom);
      }
    }
  };

  const panTo = (coords) => {
   if (viewRef.value) {
     // OpenLayers uses [lon, lat] for EPSG:4326
     // Input coords is [lat, lon] from EarthEnvironment.vue
     const lonLat = [coords[1], coords[0]];
     viewRef.value.setCenter(lonLat);
   }
 };

 defineExpose({ panTo });

</script>

<style scoped>
.earth-world {
  width: 100%;
  height: 100%;
}
</style>
