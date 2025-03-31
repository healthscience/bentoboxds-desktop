<template>
  <div id="connection-notify">
    <div id="connection-warn" v-if="storeWebsocket.connection_error === true">
      Thank you for using BentoBoxDS.
    </div>
    <div id="connection-warn-loss" v-if="storeWebsocket.connection_loss === true">
      Feedback is appreciated.
    </div>
  </div>

</template>

<script setup>
import { useSocketStore } from '@/stores/socket.js'

const storeWebsocket = useSocketStore()

 /* methods */
 const reconnectHop = () => {
  console.log('send a message to elelctron')
  // Send a message
  window.electron.send('message-from-vue', 'Hello from Vue!')

  // Listen for messages
  window.electron.receive('message-from-main', (arg) => {
    console.log('Received message from main process:', arg)
  })
 }

</script>

<style scoped>

#connection-notify {
  position: fixed;
  z-index: 999;
  background-color: white;
  padding: .6em;
}

#connection-warn {
  border: 1px solid rgb(69, 69, 177);
  z-index: 999;
  padding: .6em;
}

#connection-warn-loss {
  border: 1px solid rgb(69, 69, 177);
  z-index: 999;
  padding: .6em;
}

  @media (min-width: 1024px) {

    #connection-notify {
     position: fixed;
     left: 50%;
     display: block;
     background-color: white;
     top: 70px;
     border: 0px solid rgb(120, 112, 221);
     z-index: 999;
    }

    #connection-warn {
      display: grid;
      justify-content: center;
      margin-top: 6em;
      height: 120px;
      border: 1px solid rgb(111, 132, 228);
      z-index: 999;
    }

    #connection-warn-loss {
      border: 1px solid rgb(69, 69, 177);
      z-index: 999;
      padding: .6em;
    }
  }
</style>