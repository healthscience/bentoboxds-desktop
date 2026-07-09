import { defineStore } from 'pinia'
import { aiInterfaceStore } from './aiInterface.js'

export const lifestrapStore = defineStore('lifestrapstore', {
  state: () => ({
    straps: [],
    activeStrapKey: ''
  }),
  actions: {
    addStrap(strap) {
      const ai = aiInterfaceStore();
      if (!strap.key && strap.id) strap.key = strap.id;
      if (!strap.key) return;

      const index = this.straps.findIndex(s => s.key === strap.key);
      if (index === -1) {
        this.straps.push(strap);
      } else {
        this.straps[index] = strap;
      }

      // Notify Orchestrator through AI store
      ai.experienceOrchestrator.onLifestrapArrived(strap);
    },
    setActiveStrap(strap) {
      const lsKey = strap.key || strap.id;
      this.activeStrapKey = lsKey;
    },
    processWholeLifestrap(lifeStraps) {
      lifeStraps.forEach(strap => {
        // Use ai.liveLsUtil as the centralized utility
        this.addStrap(strap);
      });
    },
    processGenesisLifestrap(lifeStrap) {
      // Handle genesis case if needed
      this.addStrap(lifeStrap);
    }
  }
})
