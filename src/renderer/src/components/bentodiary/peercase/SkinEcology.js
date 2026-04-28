/**
 * Skin Ecology Logic: Barrier Integrity vs. Chlorine Exposure
 */
export const calculateSkinStress = (hydration, durationMinutes, hasIntervention) => {
  // 1. Base vulnerability: Low hydration = thin barrier
  let vulnerability = (100 - hydration) * 0.5;

  // 2. Chlorine Soak: Increases over time
  const exposureRisk = durationMinutes * 0.8;

  // 3. The Intervention: 70% reduction in chemical penetration
  const protectionFactor = hasIntervention ? 0.3 : 1.0;

  const finalStress = (vulnerability + exposureRisk) * protectionFactor;

  return {
    stressScore: Math.min(finalStress, 100).toFixed(1),
    barrierStatus: finalStress > 40 ? 'Compromised' : 'Resonant',
    actionRequired: finalStress > 30 && !hasIntervention ? 'Apply Barrier' : 'Protected'
  };
};