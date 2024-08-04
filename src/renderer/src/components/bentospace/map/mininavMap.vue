<template>
  <div id="space-map"> <!-- v-bind:style="{ translate: '(' + offRight + ')' }"   -->
    <div id="minimap" class="minmove-right" v-bind:style="{ right: offRight }">
      <canvas v-if="openminib === true" id="minimap-canvas" @click="mouseMiniSelect($event)" ></canvas>
    </div>
    <button id="open-mini" @click.prevent="setMiniMapShow" :class="{ active: openmini}">map</button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { mapminiStore } from '@/stores/mapStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeMmap = mapminiStore()
  
  const props = defineProps({
    spaceid: String,
    bboxid: String
  })
  
  let openmini = ref(false)
  let offRight = ref('-400px')
  let openminib = ref(true)

  // onMounted Hook: Executes logic after component is mounted
  onMounted(() => {
    setMinmapcanvas()
  })

  /* computed */
  const spaceCoord = computed(() => {
    return {} // storeMmap.liveSpaceCoord
  })

  /* methods */
  const setMinmapcanvas = () => {
    let c = document.getElementById('minimap-canvas')
    let ctx = c.getContext('2d')
    storeMmap.actionSetminmap(ctx)
    storeMmap.actionPostionCoord(props.spaceid)
  }

  const mouseMiniSelect = (e) => {
    storeMmap.actionMMapMove(e)
  }

  const setMiniMapShow = () => {
    openmini.value = !openmini.value
    if (openmini.value === false) {
      offRight.value = '-400px'
    } else {
      offRight.value = '0px'
    }
  }
</script>

<style scoped>


@media (min-width: 1024px) {
  #space-map {
    height: 100px;
    background-color: none;
  }

  #minimap {
    position: fixed;
    display: grid;
    grid-template-columns: 1fr;
    bottom: 12px;
    right: 0px;
    z-index: 30;
    opacity: .6;
    /* background-color: lightgrey; */
    width: 240px;
    height: 240px;
  }

  .minmove-right {
    border: 2px black;
    right: 0px;
  }

  #minimap-canvas {
    display: block;
    opacity: .6;
    background-color: lightgrey;
    width: 200px;
    height: 200px;
    border: 1px solid red;
  }

  #open-mini {
    position: fixed;
    bottom: 10px;
    right: 20px;
    z-index: 61;
    display: grid;
    justify-content: center;
    place-self: start;
    align-self: start;
    height: 2em;
    width: 5em;
    /* background-color: white; */
  }

  .active {
    background-color:rgb(113, 172, 114);
  }
}
</style>
