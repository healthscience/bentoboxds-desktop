import { defineStore } from "pinia";
// import { store } from "@/stores/store.js"
import { aiInterfaceStore } from "@/stores/aiInterface.js"
import { libraryStore } from "@/stores/libraryStore.js"

export const useSocketStore = defineStore({
  id: "socket",
  state: () => ({
    aiStore: aiInterfaceStore(),
    libStore: libraryStore(),
    count: 0,
    websocket: {},
    connection_ready: false,
    connection_error: false,
    messages: []
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    increment () {
      this.count++
    },
    randomizeCounter () {
      this.count = Math.round(100 * Math.random())
    },
    init_chat () {
      //connect to Sockets Bay
      const sockets_bay_url = `wss://127.0.0.1:9888` // `wss://165.227.244.213:9888` // `wss://127.0.0.1:9888`
      this.websocket = new WebSocket(sockets_bay_url)
      this.websocket.onopen = this.onSocketOpen
      this.websocket.onmessage = this.onSocketMessage
      this.websocket.onerror = this.onSocketError
      this.websocket.onclose = this.onSockerClose
      window.addEventListener("unload", function () {
        if(this.socket.readyState == WebSocket.OPEN)
          socket.close()
      })
    },
    onSocketOpen (evt) {
      this.connection_ready = true
    },
    onSocketMessage (evt) {
      //we parse the json that we receive
      var received = JSON.parse(evt.data)
      // keep in message log for session?
      this.messages.push(received)
      // parse and route to logic processing
      if (received.type === 'library') {
        this.libStore.processReply(received)
      } else if (received.type == 'upload') {
        this.aiStore.processReply(received)
      } else if (received.type == 'bbai-reply') {
        this.aiStore.processReply(received)
      } else if (received.type == 'sf-summary') {
        this.aiStore.processHOPsummary(received)
      } else if (received.type == 'sf-displayEntityRange') {
      } else if (received.type == 'sf-newEntityRange') {
        this.aiStore.processHOPdata(received)
      } else if (received.type == '') {
        console.log('error')       
      }
    
    },
    send_message (data) {
      this.websocket.send(JSON.stringify(data))
      // keep list of message per session live?
      // this.messages.push( { from: "send", message: to_send.message } )
    },    
    onSockerError (evt) {
      this.connection_error = true
    },
    onSocketClose (evt) {
      this.websocket.close()
    }
  }
})