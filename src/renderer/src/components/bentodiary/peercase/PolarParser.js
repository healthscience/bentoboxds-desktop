/**
 * Simple Parser to turn Polar HR data into Emulator Intensity
 */
export const parsePolarJSON = (rawData) => {
  // Polar JSON usually has a 'samples' array with 'heartRate'
  const samples = rawData.exercises[0].samples.heartRate;
  
  return samples.map(sample => ({
    timestamp: sample.dateTime,
    // Normalize HR (e.g., 60-190 bpm) to 0-100 Intensity for our engine
    intensity: Math.min(Math.max((sample.value - 60) / 1.3, 0), 100),
    actualHR: sample.value
  }));
};