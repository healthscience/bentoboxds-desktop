import { defineStore } from "pinia";
import LibraryUtility from '@/stores/hopUtility/libraryUtility.js'

export const useGelleStore = defineStore("gellestore", {
  state: () => ({
    libUtil: new LibraryUtility(),
    gelleMorphogens: [],
    availableTextures: [],
    activeGelles: [],
  }),
  actions: {
    graftGelle(textureId, initialState = {}) {
      const texture = this.gelleMorphogens.find((t) => t.contract.key === textureId);
      if (texture) {
        const instance = {
          ...texture,
          instanceId: `${textureId}`,
          params: texture.contract.value.computational
        };
        this.activeGelles.push(instance);
        return instance;
      }
      return null;
    },
    processReply(gelleList) {
      for (let gelleCont of gelleList) {
        let hexOrgoContract = this.libUtil.convertBinaryToHex(gelleCont);
        this.saveGelleContract(hexOrgoContract)
      }
    },
    saveGelleContract(gelleContract) {
      this.gelleMorphogens.push(
        {
          contract: gelleContract,
          state: {
            isActive: false,
            buttonColor: '#4a5568',
            isExpanded: false
          }
        }
      )
      this.saveConfirm = true
    },
    updateStrategy(instanceId, strategy) {
      const gelle = this.activeGelles.find((g) => g.instanceId === instanceId);
      if (gelle) {
        gelle.strategy = strategy;
      }
    },
    removeOrgo(gelleKey) {
      const index = this.activeOrgos.findIndex((o) => o.key === gelleKey);
      if (index !== -1) {
          this.activeGelles.splice(index, 1);
      }
    }
  },
});
