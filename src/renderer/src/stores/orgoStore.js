import { defineStore } from "pinia";
import LibraryUtility from '@/stores/hopUtility/libraryUtility.js'

export const useOrgoStore = defineStore("orgostore", {
  state: () => ({
    libUtil: new LibraryUtility(),
    orgoMorphogens: [],
    activeOrgos: [],
    saveConfirm: false,
    waitingOrgo: []
  }),
  actions: {
    instantiateOrgo(seedId, initialState = {}) {
      const seed = this.orgoMorphogens.find((s) => s.contract.key === seedId);
      if (seed) {
        const instance = {
          ...seed,
          instanceId: `${seedId}`,
          params: seed.contract.value.computational,
        };
        this.activeOrgos.push(instance);
        return instance;
      }
      return null;
    },
    processReply(orgoList) {
      for (let orgoCont of orgoList) {
        let hexOrgoContract = this.libUtil.convertBinaryToHex(orgoCont);
        this.saveOrogContract(hexOrgoContract)
      }
    },
    saveOrogContract(orgoContract) {
      this.orgoMorphogens.push(
        {
          contract: orgoContract,
          state: {
            isActive: false,
            buttonColor: '#4a5568',
            isExpanded: false
          }
        }
      )
      this.saveConfirm = true
    },
    updateOrgoParam(instanceId, param, value) {
      const orgo = this.activeOrgos.find((o) => o.instanceId === instanceId);
      if (orgo) {
        orgo.params[param] = value;
      }
    },
    removeOrgo(orgoKey) {
      const index = this.orgoMorphogens.findIndex((o) => o.key === orgoKey);
      if (index !== -1) {
          this.activeOrgos.splice(index, 1);
      }
    },
    getFullOrgo (orgoKey) {
      if (!orgoKey) return null
      // 1. Try matching directly in currently loaded cuesList
      const existing = this.cueUtil.cueMatch(orgoKey, this.orgoMorphogens)
      if (existing && existing.contract.value) {
        return existing.contract
      }
      // 2. Check if it's already queued or waiting
      const isWaiting = this.waitingCues.some(c => (c.key === orgoKey || c.contract === orgoKey))
      
      if (!isWaiting) {
        // 3. Trigger library socket request for the missing cue contract
        const orgoContractReq = {
          type: 'library',
          action: 'orgo',
          reftype: 'orgo-single',
          task: 'GET',
          privacy: 'public',
          data: { orgoKey }
        }
        
        // Push key stub so we don't spam duplicate socket messages
        this.waitingOrgo.push({ key: orgoKey, contract: orgoKey })
        // this.sendSocket.send_message(orgoContractReq)
      }

      // 4. Return reactive stub so drag/drop component renders gracefully
      return {
        key: orgoKey,
        name: 'Resolving...',
        label: orgoKey.slice(0, 10) + '...',
        datatype: 'Unknown',
        units: '',
        isLoaded: false
      }
    }
  }
});