
// services/SwimStateStore.js

export const packageSessionResonance = (lacticStats, cellStats, skinStats) => {
  // We calculate the final 'Resonance' by weighing the cellular health 
  // against the metabolic cost and the environmental skin stress.
  const score = (parseFloat(cellStats.mitochondrialFlux) / 
                (parseFloat(lacticStats.level) + (skinStats.stressScore / 10))).toFixed(2);

  return {
    type: "HOP_SWIM_SESSION",
    timestamp: new Date().toISOString(),
    biometric_snapshot: {
      lactate_peak: lacticStats.level,
      mito_efficiency: cellStats.mitochondrialFlux,
      skin_integrity: (100 - skinStats.stressScore)
    },
    resonance_score: score,
    beebee_summary: `Mitochondrial Flux at ${cellStats.mitochondrialFlux}% suggests high recovery potential.`
  };
};