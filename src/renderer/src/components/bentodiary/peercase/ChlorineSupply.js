/**
 * Chlorine Supply Chain Logic
 */
export const calculateChlorineImpact = (envType, sessionDuration) => {
  if (envType !== 'indoor') return { cost: 0, skinLoad: 0, ppm: 0 };

  // Base physics for a standard municipal pool
  const basePPM = 2.5; 
  const hourlyEvaporationRate = 0.15; // Loss of chemical effectiveness
  
  // Economic cost (simulated 2026 spot price for industrial chlorine)
  const pricePerUnit = 0.12; 

  const skinLoad = (basePPM * sessionDuration) / 60;
  const totalCost = (basePPM * pricePerUnit);

  return {
    cost: totalCost.toFixed(2),
    skinLoad: skinLoad.toFixed(2),
    ppm: basePPM,
    status: skinLoad > 2.0 ? 'High Absorption' : 'Nominal'
  };
};