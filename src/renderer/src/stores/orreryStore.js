import { defineStore } from 'pinia'
import { cuesStore } from '@/stores/cuesStore.js'
import { libraryStore } from "@/stores/libraryStore.js";

export const orreryStore = defineStore('orrerystore', {
  state: () => ({
    registry: new Map(),
    seedingProgress: 0,
    isSeeding: false,
    storeCues: cuesStore(),
    storeLibrary: libraryStore(),
  }),
  actions: {
    processReply(message) {
      if (message.action === 'seed-base-biology') {
        const { cueContracts, datatypeContracts, verification } = message.data
        
        if (verification) {
          const actual = verification.actual || 0
          const expected = verification.expected || 1
          this.seedingProgress = Math.round((actual / expected) * 100)
          
          if (verification.success === true || this.seedingProgress >= 95) {
            this.isSeeding = false
          }
        }

        if (cueContracts) {
          // Populate registry for categorization
          cueContracts.forEach(c => {
            const hexC = this.storeLibrary.utilLibrary.convertBinaryToHex(c);
            let cueStatus = {}
            cueStatus.contract = hexC
            cueStatus.state = {
              isActive: false,
              buttonColor: '#4a5568',
              isExpanded: false
            }
            this.storeCues.cuesList.push(cueStatus)
            const key = hexC.key;
            if (key) this.registry.set(key, hexC.value);
          });
        }
        
      } else if (message.action === 'seed-library') {
        let cueContracts = message.data.cueContracts
        cueContracts.forEach(c => {
            const hexC = this.storeLibrary.utilLibrary.convertBinaryToHex(c);
            let cueStatus = {}
            cueStatus.contract = hexC
            cueStatus.state = {
              isActive: false,
              buttonColor: '#4a5568',
              isExpanded: false
            }
            this.storeCues.cuesList.push(cueStatus)
            const key = hexC.key;
            if (key) this.registry.set(key, hexC.value);
          });
      } else if (message.action === 'reference-contract') {
        // Handle reference contracts specifically if they come in isolation
      }
    },
    addToRegistry(key, value) {
      this.registry.set(key, value)
    },
    getFromRegistry(key) {
      return this.registry.get(key)
    }
  }
})
