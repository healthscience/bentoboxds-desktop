<template>
  <div id="describe-device">
    <div id="type-device-entry">
      <div id="manual-device-info">
        <button @click="setDevicemanual">Manual</button>
      </div>
      <div id="manual-device-info">
        <button @click="setDevicequery">Query path</button>
      </div>
    </div>
    <div class="device-info" v-if="deviceQuery === true">
      <label for="tidy">Device query</label>
      <input type="text" @change="saveDeviceQuery" @input="saveDeviceQuery" @paste="saveDeviceQuery" v-model="storeLibrary.deviceForm.query">
    </div>
    <div id="device-manual"  v-if="deviceManual === true">
      <div class="device-info">
        <label for="tidy">Device name</label>
        <input type="text" @change="saveDeviceName" @input="saveDeviceName" @paste="saveDeviceName"  v-model="storeLibrary.deviceForm.name">
      </div>
      <div class="device-info">
        <label for="tidy">MAC address</label>
        <input type="text" @change="saveDeviceMac" @input="saveDeviceMac" @paste="saveDeviceMac"  v-model="storeLibrary.deviceForm.mac_address">
      </div>
      <div class="device-info">
        <label for="tidy">Location Lat</label>
        <input type="text" @change="saveDeviceLat" @input="saveDeviceLat" @paste="saveDeviceLat"  v-model="storeLibrary.deviceForm.location_lat">
      </div>
      <div class="device-info">
        <label for="tidy">Location Long</label>
        <input type="text" @change="saveDeviceLong" @input="saveDeviceLong" @paste="saveDeviceLong"  v-model="storeLibrary.deviceForm.location_long">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()
    
  let deviceQuery = ref(false)
  let deviceManual = ref(false)

  /* methods */
  const setDevicemanual = () => {
    deviceManual.value = !deviceManual.value
  } 
  const setDevicequery = () =>{
    deviceQuery.value = !deviceQuery.value
  }
    /* saveDeviceQuery () {
      this.$store.dispatch('buildRefPackageDeviceQuery', this.deviceForm.query)
    },
    saveDeviceName () {
      this.$store.dispatch('buildRefPackageDeviceName', this.deviceForm.name)
    },
    saveDeviceMac () {
      this.$store.dispatch('buildRefPackageDeviceMAC', this.deviceForm.mac_address)
    },
    saveDeviceLat () {
      this.$store.dispatch('buildRefPackageDeviceLAT', this.deviceForm.location_lat)
    },
    saveDeviceLong () {
      this.$store.dispatch('buildRefPackageDeviceLONG', this.deviceForm.location_long)
    } */
</script>

<style scoped>
#describe-device {
  display: grid;
  grid-template-columns: 1fr;
  width: 800px;
  border-top: 2px solid lightgrey;
  padding-top: 2em;
  border-bottom: 2px solid lightgrey;
  padding-bottom: 2em;
}

#type-device-entry {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1em;
}

.device-info {
  display: grid;
  grid-template-columns: 1fr 2fr;
  margin-bottom: .4em;
}

.device-info label {
  border: 0px solid red;
  margin-right: 1em;
  justify-self: end;
  padding-bottom: .4em;
}
</style>
