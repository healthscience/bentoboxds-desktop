/**
 * SafeFlow-ECS Minimalist Engine for Swimming
 */
export class SwimECS {
  constructor(seed) {
    this.entities = seed.initial_entities;
    this.bounds = seed.goldilocks_zones;
    this.time = 0; // Ticks
  }

  update() {
    this.time += 1;
    this.entities.forEach(entity => {
      // 1. Angular Movement (Simulating progress through the lap)
      entity.angle = (entity.angle + 0.5) % 360;

      // 2. Physics Simulation: Adding "Drift"
      // We simulate fatigue by increasing drag and decreasing HRV over time
      if (entity.type === 'drag') {
        entity.value += Math.random() * 0.01 - 0.004; // Random oscillation
      }
      
      // 3. Goldilocks Check: Is the entity in "Resonance"?
      const zone = this.bounds[entity.type];
      if (zone) {
        entity.inResonance = entity.value >= zone.min && entity.value <= zone.max;
      }
    });
    return [...this.entities];
  }
}