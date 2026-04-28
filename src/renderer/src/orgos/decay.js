/**
 * Decay Curve Orgo
 * Models the depletion of a capacity pillar over time.
 */
export const createDecayOrgo = (initialState = {}) => {
  return {
    params: {
      initialValue: initialState.initialValue || 100, // Starting capacity
      decayRate: initialState.decayRate || 0.01,     // Speed of loss
      floor: initialState.floor || 0,                // The absolute bottom
      type: 'exponential',                           // 'linear' or 'exponential'
      ...initialState
    },

    calculate: function(t) {
      const { initialValue, decayRate, floor, type } = this.params;
      let current;

      if (type === 'exponential') {
        // y = V * e^(-rt)
        current = initialValue * Math.exp(-decayRate * t);
      } else {
        // y = V - (r * t)
        current = initialValue - (decayRate * t);
      }

      return Math.max(current, floor);
    },

    // Sifter Snap: Adjust decay based on how fast the Peer actually "emptied"
    snapToEvidence: function(actualEndValue, timeElapsed) {
      // Logic to recalibrate decayRate based on observed depletion
      this.params.decayRate = Math.log(this.params.initialValue / actualEndValue) / timeElapsed;
    }
  };
};