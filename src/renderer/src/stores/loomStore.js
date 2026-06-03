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
    unmappedFragments: (state) => state.activeLens.residue,
    attunementItems: (state) => state.activeLens.attunement
  },
  actions: {
    animateStrand(cueKey, rawDataInstanceId, capacityMap, contextMap) {
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
      
      const domain = referenceCue?.domain;

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
      if (!texture || !texture.pillars) return;
      this.activeLens.residue = texture.residue || [];
      this.activeLens.attunement = texture.pillars.attunement || [];
      
      const newCapacity = new Map();
      const newContext = new Map();

      if (texture.pillars.capacity) {
        texture.pillars.capacity.forEach((item) => {
          if (item.value) {
            newCapacity.set(item.value, item);
            this.animateStrand(item.value, item.instanceId || item.value, newCapacity, newContext);
          }
        });
      }

      if (texture.pillars.context) {
        texture.pillars.context.forEach((item) => {
          if (item.value) {
            newContext.set(item.value, item);
            this.animateStrand(item.value, item.instanceId || item.value, newCapacity, newContext);
          }
        });
      }
      
      this.activeLens.capacity = newCapacity;
      this.activeLens.context = newContext;
    },

    weavePattern(lsContract) {
      const ai = aiInterfaceStore();
      const besearch = besearchStore();

      const newTexture = ai.liveLsUtil.lensTobe(lsContract.key, lsContract);
      this.lifestrapTexture = newTexture;
      this.digestInput = newTexture;
      besearch.activeBesearchContext.story = newTexture.story;

      this.loomCache[lsContract.key] = { lens: newTexture };
      this.updateActiveLensFromTexture(newTexture);

      ai.initOrchestrator();
      if (ai.experienceOrchestrator) {
        ai.experienceOrchestrator.onTextureWeaved(newTexture);
      }
    },

    applyStrapTexture(lsKey, strapData) {
      const ai = aiInterfaceStore();
      const besearch = besearchStore();

      if (this.loomCache[lsKey]) {
        const cached = this.loomCache[lsKey];
        const newObj = JSON.parse(JSON.stringify(cached.lens));
        this.lifestrapTexture = newObj;
        this.digestInput = newObj;
        besearch.activeBesearchContext.story = newObj.story;
        this.updateActiveLensFromTexture(newObj);
      } else {
        const newTexture = ai.liveLsUtil.lensTobe(lsKey, strapData);
        this.lifestrapTexture = newTexture;
        this.digestInput = newTexture;
        besearch.activeBesearchContext.story = newTexture.story;
        this.loomCache[lsKey] = { lens: newTexture };
        this.updateActiveLensFromTexture(newTexture);
        this.fetchWholeLoom(lsKey);
      }
    },

    processReply(received) {
      if (received.action === "bringtobe-start") {
        libraryStore().sendMessage('get-library');
      } else if (received.action === "ls-pattern") {
        this.weavePattern(received.data.index);
      } else if (received.action === "ls-whole-loom") {
        const ai = aiInterfaceStore();
        if (received.data?.whole?.lens?.[0]) {
          const newTexture = ai.liveLsUtil.lensTobe(ai.activeLifestrapKey, received.data.whole.lens[0]);
          this.lifestrapTexture = newTexture;
          this.digestInput = newTexture;
          this.loomCache[ai.activeLifestrapKey] = { lens: newTexture };
          this.updateActiveLensFromTexture(newTexture);
        }
      } else if (received.action === "npl-reply") {
        if (received.task === "lens-extraction") {
          const ai = aiInterfaceStore();
          const capacity = received.data.lens.capacity ? [{ label: "Extracted", value: received.data.lens.capacity }] : [];
          const context = received.data.lens.context ? (Array.isArray(received.data.lens.context) ? received.data.lens.context : received.data.lens.context.split(",")).map(v => ({ label: "Extracted", value: v.trim() })) : [];

          this.lifestrapTexture = {
            ...this.lifestrapTexture,
            key: this.lifestrapTexture.key || ai.activeLifestrapKey,
            pillars: { ...this.lifestrapTexture.pillars, capacity, context },
            residue: [...(received.data.lens.residue || [])],
          };

          this.updateActiveLensFromTexture(this.lifestrapTexture);
          
          if (this.lifestrapTexture.key) {
            this.loomCache[this.lifestrapTexture.key] = { lens: this.lifestrapTexture };
          }
          this.digestInput = JSON.parse(JSON.stringify(this.lifestrapTexture));

          ai.initOrchestrator();
          if (ai.experienceOrchestrator) {
            ai.experienceOrchestrator.onTextureWeaved(this.lifestrapTexture);
          }
        }
      } else if (received.action === "ls-whole") {
        const ai = aiInterfaceStore();
        const lifestrap = lifestrapStore();
        const data = received.data;

        if (data.lifestrap) {
          lifestrap.processReply(received);
        }

        if (data.whole && data.whole.lsKeytrack?.lsid) {
          const activeStrapHex = ai.liveLsUtil.convertBinaryToHex({
            key: data.whole.lsKeytrack.lsid,
            value: {}
          });
          const activeStrapKey = activeStrapHex.key;

          let lensContract = null;
          if (data.whole.lens && data.whole.lens.length > 0) {
            lensContract = data.whole.lens.find(l => {
              const hexL = ai.liveLsUtil.convertBinaryToHex(l);
              const conceptKey = hexL.value?.concept?.key;
              if (conceptKey && conceptKey.type === 'Buffer') {
                return conceptKey.data.join(',') === data.whole.lsKeytrack.lsid.data.join(',');
              }
              return false;
            });
            if (!lensContract) lensContract = data.whole.lens[0];
          }

          if (lensContract) {
            const hexLens = ai.liveLsUtil.convertBinaryToHex(lensContract);
            const newTexture = ai.liveLsUtil.lensTobe(activeStrapKey, hexLens);
            
            this.lifestrapTexture = newTexture;
            this.digestInput = newTexture;
            this.loomCache[activeStrapKey] = { lens: newTexture };
            this.updateActiveLensFromTexture(newTexture);

            ai.initOrchestrator();
            if (ai.experienceOrchestrator) {
              ai.experienceOrchestrator.activateLifestrapState(activeStrapKey);
              ai.experienceOrchestrator.onTextureWeaved(newTexture);
            }
          }
        }
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
      ai.sendMessageHOP({ type: "bbai", action: "fetch-whole-loom", data: { lifeStrapID: lsKey, contract_key: lsKey } });
    }
  }
})
