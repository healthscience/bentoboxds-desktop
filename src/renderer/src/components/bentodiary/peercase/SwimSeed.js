export const swimSeed = {
  version: "2026.02",
  peer_id: "swimmer_01",
  
  // These are the "Target Ranges" for the Peer Experience
  goldilocks_zones: {
    hrv: { min: 65, max: 85, ideal: 75 },
    stroke: { min: 28, max: 35, ideal: 32 },
    drag: { min: 0.4, max: 0.6, ideal: 0.5 }
  },

  // Initial state for the Holistic Wheel
  initial_entities: [
    { id: 'm1', orbit: 'metabolic', type: 'hrv', angle: 120, value: 70 },
    { id: 'e1', orbit: 'ecological', type: 'stroke', angle: 130, value: 30 },
    { id: 'x1', orbit: 'economic', type: 'drag', angle: 140, value: 0.55 },
    {
      id: 'chlorine-debt',
      name: 'Chlorine Supply',
      orbit: 'economic', // Outer Ring
      angle: 210,        // Positioned in the "Systems" sector
      active: true,
      value: 0
    },
    {
      id: 'thermal-grid-draw',
      name: 'Thermal Energy',
      orbit: 'economic', 
      angle: 300, // Positioned near the top-left "Ecological" boundary
      active: true,
      value: 0
    }
  ]
};

export const imProfiles = {
  butterfly: {
    id: 'butterfly',
    name: 'Butterfly',
    orbit_targets: { metabolic: 165, ecological: 0.95, economic: 0.8 },
    color: '#FF00FF'
  },
  backstroke: {
    id: 'backstroke',
    name: 'Backstroke',
    orbit_targets: { metabolic: 145, ecological: 0.7, economic: 0.9 },
    color: '#4D94FF'
  },
  breaststroke: {
    id: 'breaststroke',
    name: 'Breaststroke',
    orbit_targets: { metabolic: 155, ecological: 1.1, economic: 0.7 },
    color: '#FFD700'
  },
  freestyle: {
    id: 'freestyle',
    name: 'Freestyle',
    orbit_targets: { metabolic: 150, ecological: 0.5, economic: 0.95 },
    color: '#40E0FF'
  }
};