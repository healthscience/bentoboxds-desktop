import { defineStore } from "pinia";

export const useGelleStore = defineStore("gellestore", {
  state: () => ({
    availableTextures: [
      {
        id: "platonic_solid",
        name: "Platonic Gelle",
        icon: "polyhedron",
        description: "Adaptive geometric texture for structural repair.",
        strategy: "Prevention",
      },
    ],
    activeGelles: [],
  }),
  actions: {
    graftGelle(textureId, initialState = {}) {
      const texture = this.availableTextures.find((t) => t.id === textureId);
      if (texture) {
        const instance = {
          ...texture,
          instanceId: `${textureId}-${Date.now()}`,
          grafts: initialState.grafts || [],
          strategy: initialState.strategy || texture.strategy,
        };
        this.activeGelles.push(instance);
        return instance;
      }
      return null;
    },
    addGraft(instanceId, word) {
      const gelle = this.activeGelles.find((g) => g.instanceId === instanceId);
      if (gelle && !gelle.grafts.includes(word)) {
        gelle.grafts.push(word);
      }
    },
    updateStrategy(instanceId, strategy) {
      const gelle = this.activeGelles.find((g) => g.instanceId === instanceId);
      if (gelle) {
        gelle.strategy = strategy;
      }
    },
  },
});
