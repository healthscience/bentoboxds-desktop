/**
 * Threshold Orgo
 * The "Logic Gate" that defines state shifts.
 */
export const createThresholdOrgo = (initialState = {}) => {
  return {
    params: {
      limit: initialState.limit || 165,       // e.g., Max Heart Rate
      hysteresis: initialState.hysteresis || 2, // Buffer to prevent flickering
      mode: 'ceiling',                        // 'ceiling' or 'floor'
      ...initialState
    },

    /**
     * Returns a "Stress Ratio" (0 to 1)
     * 0 = Safe, 1 = Threshold breached
     */
    calculate: function(currentValue) {
      const { limit, mode, hysteresis } = this.params;
      
      if (mode === 'ceiling') {
        if (currentValue >= limit) return 1;
        if (currentValue < limit - hysteresis) return 0;
        // Gradient zone within the hysteresis buffer
        return (currentValue - (limit - hysteresis)) / hysteresis;
      } 
      
      if (mode === 'floor') {
        if (currentValue <= limit) return 1;
        if (currentValue > limit + hysteresis) return 0;
        return (limit + hysteresis - currentValue) / hysteresis;
      }
    }
  };
};