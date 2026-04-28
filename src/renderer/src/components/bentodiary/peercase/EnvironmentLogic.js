/**
 * Built Environment Logic: The Pool & Building Interface
 */
export const calculateEnvironmentResonance = (outsideTemp, energySource, poolVolume) => {
  // 1. Thermal Maintenance: How much effort to keep it 27°C?
  const thermalDelta = 27 - outsideTemp;
  const heatingLoad = thermalDelta * (poolVolume / 1000); 

  // 2. Carbon Intensity based on the Supply Chain
  const energyCoefficients = { gas: 0.2, electric_grid: 0.5, solar: 0.05 };
  const carbonFootprint = heatingLoad * (energyCoefficients[energySource] || 0.3);

  return {
    heatingLoad: heatingLoad.toFixed(1),
    carbonFootprint: carbonFootprint.toFixed(1),
    facilityEfficiency: thermalDelta > 20 ? 'Strained' : 'Resonant',
    resonanceScore: (100 - (carbonFootprint / 2)).toFixed(1)
  };
};