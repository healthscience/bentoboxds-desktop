<template>
  <div id="describe-device">
    <div id="type-device-entry">
      <div id="manual-device-info">
        <button @click="setDevicemanual()">Manual entry</button>
      </div>
      <div id="manual-device-info">
        <button @click="setDevicequery()">Device query</button>
      </div>
    </div>
    <div class="device-select" v-if="deviceQuery === true">
      <div id="desribe-source-device">
        <describe-datastructure></describe-datastructure>
      </div>
      <!--<input type="text" v-model="storeLibrary.newPackagingForm.device.query">-->
    </div>
    <div id="firmware-device-info">
        <button @click="setDeviceFirmwareHistory()">Firmware history</button>
    </div>
    <div class="device-select" v-if="deviceFirmware === true">
      <div id="desribe-source-device">
        <describe-firmware></describe-firmware>
      </div>
      <!--<input type="text" v-model="storeLibrary.newPackagingForm.device.query">-->
    </div>
    <div id="device-manual"  v-if="deviceManual === true">
      <div class="device-info">
        <label for="tidy">Device name</label>
        <input type="text" v-model="storeLibrary.newPackagingForm.device.name">
      </div>
      <div class="device-info">
        <label for="tidy">MAC address</label>
        <input type="text" v-model="storeLibrary.newPackagingForm.device.mac_address">
      </div>
      <div class="device-info">
        <label for="tidy">Location Lat</label>
        <input type="text" v-model="storeLibrary.newPackagingForm.device.location_lat">
      </div>
      <div class="device-info">
        <label for="tidy">Location Long</label>
        <input type="text" v-model="storeLibrary.newPackagingForm.device.location_long">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DescribeDatastructure from '@/components/library/contracts/contribute/forms/packaging/describeDeviceStructure.vue'
import DescribeFirmware from '@/components/library/contracts/contribute/forms/packaging/describeDeviceFirmware.vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()
    
  let deviceQuery = ref(false)
  let deviceManual = ref(false)
  let deviceFirmware = ref(false)

  /* methods */
  const setDevicemanual = () => {
    deviceManual.value = !deviceManual.value
  } 

  const setDevicequery = () =>{
    deviceQuery.value = !deviceQuery.value
  }

  const setDeviceFirmwareHistory = () =>{
    deviceFirmware.value = !deviceFirmware.value
  }

</script>

<style scoped>
#describe-device {
  display: grid;
  grid-template-columns: 1fr;
  border-top: 2px solid lightgrey;
  padding-top: 2em;
  border-bottom: 2px solid lightgrey;
  padding-bottom: 2em;
}

#type-device-entry {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 1em;
}

.device-info {
  display: grid;
  grid-template-columns: 1fr 2fr;
  margin-bottom: .4em;
}

.device-info label {
  margin-right: 1em;
  justify-self: end;
  padding-bottom: .4em;
}

#desribe-source-device {
  display: grid;
  grid-template-columns: 1fr;
}

</style>
