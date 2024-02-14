<template>
  <div id="connection-notify">
    <div id="connection-warn" v-if="sendSocket.connection_error === true">
      Please restart BentoBoxDS.
    </div>
    <div id="connection-warn" v-if="sendSocket.connection_loss === true">
      Lost connection: Please restart BentoBoxDS.
    </div>
  </div>

</template>

<script setup>
import { useSocketStore } from '@/stores/socket.js'

const sendSocket = useSocketStore()

</script>

<style scoped>

#connection-notify {
  position: fixed;
  z-index: 99;
  background-color: white;
}

#connection-warn {
  border: 1px solid red;
}

  @media (min-width: 1024px) {

    #connection-notify {
     position: fixed;
     left: 50%;
     display: block;
     background-color: white;
     top: 70px;
     border: 0px solid red;
     z-index: 99;
    }

    #connection-warn {
      display: grid;
      justify-content: center;
      margin-top: 6em;
      height: 120px;
      border: 1px solid red;
      z-index: 99;
    }
  }
</style>