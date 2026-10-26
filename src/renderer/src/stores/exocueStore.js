import { defineStore } from "pinia";
import LibraryUtility from '@/stores/hopUtility/libraryUtility.js'

export const useExocueStore = defineStore("exocuestore", {
  state: () => ({
    libUtil: new LibraryUtility(),
    organelles: [],
    activeexocues: [],
    matchConfidence: {
      coherence: false,
      conduction: false,
      executable: false
    }
  }),
  actions: {
    instantiateexocue(seedId, initialState = {}) {
      const seed = this.organelles.find((s) => s.id === seedId);
      if (seed) {
        const instance = {
          ...seed,
          instanceId: `${seedId}`,
          params: seed.logic(initialState).params,
        };
        this.activeexocues.push(instance);
        return instance;
      }
      return null;
    },
    processReply(exocueList) {
      for (let exoCont of exocueList) {
        let hexExoContract = this.libUtil.convertBinaryToHex(exoCont);
        this.saveExocueContract(hexExoContract)
      }
    },
    saveExocueContract(exocueContract) {
      this.organelles.push(
      {
        contract: exocueContract,
        state: {
          isActive: false,
          buttonColor: '#4a5568',
          isExpanded: false
        }
      })
    },
    updateexocueParam(instanceId, param, value) {
      const exocue = this.activeexocues.find((o) => o.instanceId === instanceId);
      if (exocue) {
        exocue.params[param] = value;
      }
    },
    removeExocue(exocueKey) {
      const index = this.activeexocues.findIndex((o) => o.key === exocueKey);
      if (index !== -1) {
          this.activexocues.splice(index, 1);
      }
    }
  },
});