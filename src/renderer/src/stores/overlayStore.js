import { defineStore } from "pinia";
import LibraryUtility from '@/stores/hopUtility/libraryUtility.js'

export const useOverlayStore = defineStore("overlaystore", {
  state: () => ({
    libUtil: new LibraryUtility(),
    conductionData: [],
    activeoverlays: [],
    newOverlayContractLive: {}
  }),
  actions: {
    instantiateOverlay(seedId, initialState = {}) {
      const seed = this.conductionData.find((s) => s.id === seedId);
      if (seed) {
        const instance = {
          ...seed,
          instanceId: `${seedId}`,
          params: seed.logic(initialState).params,
        };
        this.activeoverlays.push(instance);
        return instance;
      }
      return null;
    },
    processReply(overlayList) {
      for (let ovCont of overlayList) {
        let hexOverlayContract = this.libUtil.convertBinaryToHex(ovCont);
        this.saveOverlayContract(hexOverlayContract)
      }
    },
    saveOverlayContract(overlayContract) {
      this.conductionData.push(
      {
        contract: overlayContract,
        state: {
          isActive: false,
          buttonColor: '#4a5568',
          isExpanded: false
        }
      })
    },
    setNewContract(overlayContract) {
      this.newOverlayContractLive = overlayContract
    },
    updateOverlayParam(instanceId, param, value) {
      const overlay = this.activeoverlays.find((o) => o.instanceId === instanceId);
      if (overlay) {
        overlay.params[param] = value;
      }
    },
    removeOverlay(overlayKey) {
      const index = this.activeOverlays.findIndex((o) => o.key === overlayKey);
      if (index !== -1) {
          this.activeOverlays.splice(index, 1);
      }
    }
  },
});