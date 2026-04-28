import { defineStore } from "pinia";
import { createOscillatorOrgo } from "@/orgos/oscillator.js";

export const useOrgoStore = defineStore("orgostore", {
  state: () => ({
    availableSeeds: [
      {
        id: "oscillator",
        name: "OscillatorOrgo",
        icon: "pulse", // Icon placeholder
        description: "A rhythmic wave representing Effort and Recovery.",
        logic: createOscillatorOrgo,
      },
    ],
    activeOrgos: [],
  }),
  actions: {
    instantiateOrgo(seedId, initialState = {}) {
      const seed = this.availableSeeds.find((s) => s.id === seedId);
      if (seed) {
        const instance = {
          ...seed,
          instanceId: `${seedId}-${Date.now()}`,
          params: seed.logic(initialState).params,
        };
        this.activeOrgos.push(instance);
        return instance;
      }
      return null;
    },
    updateOrgoParam(instanceId, param, value) {
      const orgo = this.activeOrgos.find((o) => o.instanceId === instanceId);
      if (orgo) {
        orgo.params[param] = value;
      }
    },
  },
});
