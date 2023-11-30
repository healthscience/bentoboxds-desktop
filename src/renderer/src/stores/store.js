import { defineStore } from 'pinia'
import { useSocketStore } from '@/src/stores/socket.js'


export const store = defineStore('baseStore', {
  state: () => {
    return {
      socketLive: useSocketStore(),
      stocketstatus: false,
    }
  },
  actions: {
  }
})