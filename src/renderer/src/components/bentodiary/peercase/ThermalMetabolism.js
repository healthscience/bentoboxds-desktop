/**
 * Thermal Energy Logic: The Carbon Cost of Comfort
 */
const calculateThermalDebt = (envType, outsideTemp) => {
  if (envType !== 'indoor') return { energykWh: 0, carbong: 0, efficiency: 1 };

  const targetTemp = 27;
  const tempDelta = Math.max(0, targetTemp - outsideTemp);
  
  // Simulation of a 25m pool's hourly heat loss in the Scottish climate
  const heatLossCoefficient = 12.5; 
  const energykWh = (tempDelta * heatLossCoefficient).toFixed(2);
  
  // 2026 Grid Intensity (Grams of CO2 per kWh)
  const gridIntensity = 140; 
  const carbonWeightGrams = (energykWh * gridIntensity).toFixed(0);

  return {
    energykWh,
    carbonWeightGrams,
    thermalStress: tempDelta > 15 ? 'High' : 'Low'
  };
};