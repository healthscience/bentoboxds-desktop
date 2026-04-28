export const environmentProfiles = {
  indoor: {
    name: 'Municipal Indoor',
    arc: 'environment',
    physics: { chlorine: 1.0, temp: 27, energy_cost: 0.9, eco_friction: 0.8 },
    description: 'High climate control, high chemical load, high carbon debt.'
  },
  natural: {
    name: 'Natural Pond',
    arc: 'environment',
    physics: { chlorine: 0.05, temp: 20, energy_cost: 0.2, eco_friction: 0.3 },
    description: 'Bio-filtered. Low chemical impact, moderate thermal debt.'
  },
  river: {
    name: 'Open River',
    arc: 'environment',
    physics: { chlorine: 0.0, temp: 14, energy_cost: 0.0, eco_friction: 0.1 },
    description: 'Pure ecology. Zero infrastructure. High biological resilience needed.'
  }
};