/**
 * Cellular Level: Mitochondrial Efficiency 
 */
export const calculateCellularResonance = (lacticLevel, hydration) => {
  // Optimal 'Flow' happens between 1.5 and 3.0 mmol/L
  const flux = lacticLevel > 1.5 && lacticLevel < 3.5 ? 1.0 : 0.4;
  
  // Hydration acts as the 'Lubricant' for the cellular gate
  const hydrationImpact = hydration / 100; 

  return {
    mitochondrialFlux: (flux * hydrationImpact * 100).toFixed(1), // % efficiency
    atpProduction: flux > 0.8 ? 'Optimal' : 'Strained',
    cellularStress: lacticLevel > 5.0 ? 'High' : 'Low'
  };
};