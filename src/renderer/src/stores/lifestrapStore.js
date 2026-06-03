import { defineStore } from 'pinia'
import { aiInterfaceStore } from './aiInterface.js'

export const lifestrapStore = defineStore('lifestrapstore', {
  state: () => ({
    straps: [],
    activeStrapKey: ''
  }),
  actions: {
    addStrap(strap) {
      if (!strap.key && strap.id) strap.key = strap.id;
      if (!strap.key) return;

      const index = this.straps.findIndex(s => s.key === strap.key);
      if (index === -1) {
        this.straps.push(strap);
      } else {
        this.straps[index] = strap;
      }

      // Notify Orchestrator through AI store
      const ai = aiInterfaceStore();
      ai.initOrchestrator();
      if (ai.experienceOrchestrator) {
        ai.experienceOrchestrator.onLifestrapArrived(strap);
      }
    },
    setActiveStrap(strap) {
      const lsKey = strap.key || strap.id;
      this.activeStrapKey = lsKey;
    },
    processReply(received) {
      if (received.action === 'bringtobe-start' || received.action === 'lifestrap-genesis' || received.action === 'ls-whole') {
        const ai = aiInterfaceStore();
        const data = received.action === 'ls-whole' ? received.data.lifestrap : received.data;
        const straps = Array.isArray(data) ? data : [data];
        straps.forEach(s => {
          // Use ai.liveLsUtil as the centralized utility
          const hexContract = ai.liveLsUtil?.convertBinaryToHex(s) || s;
          this.addStrap(hexContract);
        });
      }
    }
  }
})
