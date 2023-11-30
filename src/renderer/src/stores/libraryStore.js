import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

export const libraryStore = defineStore('librarystore', {
  state: () => ({
    liveBentoBox: aiInterfaceStore(),
    libraryMessage: ''
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    processReply (message, questionStart) {
      if (message.action === 'save-file') {
        // set message
        this.libraryMessage = message.data.text
      } else if (message.action === 'library-peerlibrary') {
        // prepare network experiment lists
        let newPair = {}
        newPair.question = questionStart
        newPair.reply = message.data
        this.liveBentoBox.historyPair.push(newPair)
      }
    }
  }
})