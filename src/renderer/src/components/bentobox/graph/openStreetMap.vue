<template>
 open street map
 <Map.OlMap style="min-width: 400px; min-height: 400px;">
    <Map.OlView :center="[0, 0]" :zoom="5" projection="EPSG:4326" />
    <Layers.OlTileLayer>
      <Sources.OlSourceOsm />
    </Layers.OlTileLayer>
  </Map.OlMap>
</template>

<script setup>
 import { Map, Layers, Sources } from "vue3-openlayers";
</script>


<style>
</style>