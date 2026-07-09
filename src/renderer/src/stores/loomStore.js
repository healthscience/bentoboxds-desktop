import { defineStore } from 'pinia'
import { orreryStore } from './orreryStore.js'
import { libraryStore } from "@/stores/libraryStore.js";
import { lifestrapStore } from './lifestrapStore.js'
import { aiInterfaceStore } from './aiInterface.js'
import { besearchStore } from './besearchStore.js'

export const loomStore = defineStore('loomstore', {
  state: () => ({
    alignments: new Map(), 
    storyContext: {},
    activeLoomID: null,
    activeLens: {
      capacity: new Map(), 
      context: new Map(),   
      attunement: [],
      residue: []          
    },
    lifestrapTexture: {
      pillars: {
        capacity: [],
        context: [],
        attunement: [],
        heli: [],
        coherence: { isStable: false, resonance: 0 },
      },
      residue: [],
      key: "",
    },
    digestInput: null,
    loomCache: {},
  }),
  getters: {
    capacityItems: (state) => Array.from(state.activeLens.capacity.values()),
    contextItems: (state) => Array.from(state.activeLens.context.values()),
    unmappedFragments: (state) => {
      const residue = state.activeLens.residue || [];
      if (residue.length > 0) return residue;

      // Fallback: If residue is empty, extract words from the story text!
      const story = ''

      // Exclude words that are currently allocated to any of the pillars or activeLens
      const allocated = new Set();
      const pillars = state.lifestrapTexture?.pillars || {};
      Object.keys(pillars).forEach(pillarKey => {
        const pillar = pillars[pillarKey];
        if (Array.isArray(pillar)) {
          pillar.forEach(item => {
            if (item.value) {
              allocated.add(item.value);
              // Support lowercase matching for robustness
              allocated.add(item.value.toLowerCase());
            }
          });
        }
      });

      if (state.activeLens) {
        if (state.activeLens.capacity) {
          state.activeLens.capacity.forEach((val, key) => {
            allocated.add(key);
            allocated.add(key.toLowerCase());
          });
        }
        if (state.activeLens.context) {
          state.activeLens.context.forEach((val, key) => {
            allocated.add(key);
            allocated.add(key.toLowerCase());
          });
        }
        if (state.activeLens.attunement) {
          state.activeLens.attunement.forEach(item => {
            if (item.value) {
              allocated.add(item.value);
              allocated.add(item.value.toLowerCase());
            }
          });
        }
      }
      let remainingWords = []
      return remainingWords;
    },
    attunementItems: (state) => state.activeLens.attunement,
    mappedLenses: (state) => {
      const input = state.digestInput;
      if (!input) return { capacity: [], coherence: [], context: [], heli: [] };

      if (input.pillars) {
        return {
          capacity: input.pillars.capacity || [],
          coherence: input.pillars.coherence ? [input.pillars.coherence] : [],
          context: input.pillars.context || [],
          heli: input.pillars.heli || [],
        };
      }

      return {
        capacity: input.capacity || [],
        coherence: input.coherence || [],
        context: input.context || [],
        heli: [],
      };
    }
  },
  actions: {
    animateStrand(cueKey, rawDataInstanceId, capacityMap, contextMap, forceZone = null) {
      const orrery = orreryStore()
      const lifestrap = lifestrapStore()
      const referenceCue = orrery.registry.get(cueKey)
      const rawStream = lifestrap.activeStreams?.get(rawDataInstanceId)
      
      const activeStrand = {
        definition: referenceCue,
        telemetry: rawStream,
        label: referenceCue?.label || "Extracted",
        value: cueKey,
        pulsedAt: new Date()
      }
      
      const domain = forceZone || referenceCue?.domain;

      if (domain === 'capacity') {
        (capacityMap || this.activeLens.capacity).set(cueKey, activeStrand)
      } else if (domain?.startsWith('context')) {
        (contextMap || this.activeLens.context).set(cueKey, activeStrand)
      } else {
        if (cueKey.toLowerCase().includes('longevity') || cueKey.toLowerCase().includes('swim')) {
          (capacityMap || this.activeLens.capacity).set(cueKey, activeStrand);
        } else {
          (contextMap || this.activeLens.context).set(cueKey, activeStrand);
        }
      }
    },

    updateActiveLensFromTexture(texture) {
      this.activeLens.residue = texture.residue || [];
      this.activeLens.attunement = texture.pillars.attunement || [];
      
      const newCapacity = new Map();
      const newContext = new Map();

      if (texture.pillars.capacity) {
        texture.pillars.capacity.forEach((item) => {
          if (item.value) {
            newCapacity.set(item.value, item);
            this.animateStrand(item.value, item.instanceId || item.value, newCapacity, newContext, 'capacity');
          }
        });
      }

      if (texture.pillars.context) {
        texture.pillars.context.forEach((item) => {
          if (item.value) {
            newContext.set(item.value, item);
            this.animateStrand(item.value, item.instanceId || item.value, newCapacity, newContext, 'context');
          }
        });
      }
      
      this.activeLens.capacity = newCapacity;
      this.activeLens.context = newContext;
    },

    weavePattern(lsContract) {
      const ai = aiInterfaceStore();
      const besearch = besearchStore();

      // Normalize the key to hex string immediately
      const hexContract = ai.liveLsUtil.convertBinaryToHex(lsContract);
      const lsKey = hexContract.key;

      const newTexture = ai.liveLsUtil.lensTobe(lsKey, hexContract);
      this.lifestrapTexture = newTexture;
      this.digestInput = newTexture;
      besearch.activeBesearchContext.story = newTexture.story;

      this.loomCache[lsKey] = { lens: newTexture };
      this.updateActiveLensFromTexture(newTexture);
    },

    applyStrapTexture(lsKey, strapData) {
      const ai = aiInterfaceStore();
      const besearch = besearchStore();

      // clear the current loom

      if (this.loomCache[lsKey]) {
        const cached = this.loomCache[lsKey];
        const newObj = JSON.parse(JSON.stringify(cached.lens));
        this.lifestrapTexture = newObj;
        this.digestInput = newObj;
        besearch.activeBesearchContext.story = newObj.story;
        this.updateActiveLensFromTexture(newObj);

      } else {
        // if not data in bentoboxds, then ask HOP for begin loom bundle
        this.fetchWholeLoom(lsKey);
      }
    },

    processLoom(received) {
      if (received.action === "bringtobe-start") {
        libraryStore().sendMessage('get-library');
      } else if (received.action === "ls-pattern") {
        this.weavePattern(received.data.index);
      }

    },
    processBeginLoom (loomData) {
      // match lens key to loom data
      const ai = aiInterfaceStore();
      // prepare data to standard for loom,  genesis and first time and returning lens glue.
      if (loomData) {
        const newTexture = ai.liveLsUtil.lensTobe(ai.activeLoomLens, loomData);
        this.lifestrapTexture = newTexture;
        this.digestInput = newTexture;
        this.loomCache[ai.activeLoomLens] = { lens: newTexture };
        this.updateActiveLensFromTexture(newTexture);
      }
    },
    reorderStrandCues(zone, oldIndex, newIndex) {
      const pillar = this.lifestrapTexture.pillars[zone];
      const item = pillar.splice(oldIndex, 1)[0];
      pillar.splice(newIndex, 0, item);
      this.syncAttunement(item.value, zone, item.label);
    },

    updateResonWeight(word, zone, label = null) {
      if (!this.lifestrapTexture) {
        this.lifestrapTexture = { pillars: { capacity: [], context: [], heli: [] }, residue: [], key: "" };
      }
      if (!this.lifestrapTexture.residue || this.lifestrapTexture.residue.length === 0) {
        this.lifestrapTexture.residue = [...this.unmappedFragments];
      }
      this.lifestrapTexture.residue = this.lifestrapTexture.residue.filter(w => w !== word);
      this.lifestrapTexture.pillars.capacity = this.lifestrapTexture.pillars.capacity.filter(i => i.value !== word);
      this.lifestrapTexture.pillars.context = this.lifestrapTexture.pillars.context.filter(i => i.value !== word);
      this.lifestrapTexture.pillars.attunement = this.lifestrapTexture.pillars.attunement.filter(i => i.value !== word);
      this.lifestrapTexture.pillars.heli = this.lifestrapTexture.pillars.heli.filter(i => i.value !== word);

      if (zone === "residue") {
        if (!this.lifestrapTexture.residue.includes(word)) this.lifestrapTexture.residue.push(word);
      } else {
        const entry = { label: label || zone, value: word };
        if (zone === "capacity") this.lifestrapTexture.pillars.capacity.push(entry);
        else if (zone === "context") this.lifestrapTexture.pillars.context.push(entry);
        else if (zone === "attunement") this.lifestrapTexture.pillars.attunement.push(entry);
      }
      this.updateActiveLensFromTexture(this.lifestrapTexture);
      this.syncAttunement(word, zone, label);
    },

    syncAttunement(word, zone, label) {
      const ai = aiInterfaceStore();
      ai.sendMessageHOP({ type: "bbai", action: "attunement-mapping", data: { word, zone, label, lifeStrapID: ai.activeLifeStrapID, contract_key: ai.activeContractKey } });
    },

    fetchWholeLoom(lsKey) {
      const ai = aiInterfaceStore();
      ai.sendMessageHOP(
        {
          type: "bbai",
          action: "fetch-whole-loom",
          data: { lifeStrapID: lsKey, contract_key: lsKey }
        }
      );
    }
  }
})
