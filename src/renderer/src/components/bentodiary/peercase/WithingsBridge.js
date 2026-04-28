/**
 * Withings to Swimming Physics Bridge
 */
export const calculateBodyOffsets = (withingsData) => {
  const { muscleMass, fatPercent, hydration } = withingsData;

  // 1. Buoyancy Factor (Ecological)
  // Higher fat % actually helps buoyancy in the water, reducing 'sink drag'
  const buoyancyOffset = (fatPercent - 18) * 0.005; 

  // 2. Power-to-Weight (Metabolic)
  // Increased muscle mass increases raw force but shifts the Goldilocks HR zone
  const metabolicLoad = (muscleMass / 70) * 1.1; 

  // 3. The 'Chlorine' Sensitivity (Bio-feedback)
  // Low hydration makes the skin more susceptible to the dryness you mentioned.
  const skinBarrierRisk = hydration < 55 ? 'High' : 'Optimal';

  return {
    dragMultiplier: 1 - buoyancyOffset,
    hrShift: metabolicLoad > 1 ? +5 : 0,
    skinStatus: skinBarrierRisk
  };
};