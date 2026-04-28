/**
 * Canvas configuration for Besearch
 */
export const CanvasConfig = {
  // Canvas dimensions - will be set from actual canvas element
  width: 800,  // Default fallback, will be overridden
  height: 600, // Default fallback, will be overridden

  // World bounds
  worldBounds: {
    width: 5000,
    height: 5000
  },

  // Peer settings
  peer: {
    width: 30,
    height: 30,
    speed: 5,
    defaultPosition: { x: 100, y: 100 }
  },

  // Rendering settings
  rendering: {
    backgroundColor: '#ffffff',
    gridSize: 20,
    showGrid: false,
    fps: 60
  },

  // Animation settings
  animation: {
    cycleRotationSpeed: 0.02,
    cycleRadius: 100
  },

  // Input settings
  input: {
    enablePan: true,
    enableZoom: true,
    enableSelection: true,
    enableDrag: true,
    minZoom: 0.1,
    maxZoom: 3.0,
    zoomSpeed: 0.1,
    panSpeed: 1.0
  },

  // Intervention settings
  intervention: {
    width: 250,
    height: 120,
    dragBarHeight: 25,
    linkDistance: 150,
    defaultSpacing: 150
  },

  // Cycle settings
  cycle: {
    clickRadius: 60,
    editButtonRadius: 12,
    removeButtonRadius: 12,
    ringSpacing: 10
  },

  // Mode-specific settings
  modeSettings: {
    cues: {
      worldBounds: { width: 5000, height: 5000 }
    },
    body: {
      worldBounds: { width: 1000, height: 1500 }
    },
    earth: {
      worldBounds: { width: 10000, height: 5000 }
    }
  },

  // Colors
  colors: {
    status: {
      'working': '#4CAF50',
      'experimentation': '#FF9800',
      'no effect': '#F44336',
      'pending': '#9E9E9E'
    },
    ui: {
      text: '#140d6b',
      dragBar: '#e0e0e0',
      interventionBorder: '#ffffff',
      interventionBackground: '#ffffff',
      removeButton: '#666',
      editButton: '#007bff',
      removeButtonBg: '#dc3545',
      editButtonBg: '#007bff'
    }
  }
};

export default CanvasConfig;