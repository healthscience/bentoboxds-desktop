/**
 * Generates a mock swimming session with HR fluctuations
 */
export const generateMockSession = () => {
  const session = [];
  const duration = 600; // 10 minutes in seconds

  for (let t = 0; t < duration; t++) {
    let hr = 70; // Baseline

    if (t < 120) {
      // 1. Warm-up (0-2 mins): Slow climb to 110bpm
      hr = 70 + (t * 0.33);
    } else if (t < 480) {
      // 2. The Work Set (2-8 mins): Steady 155bpm with slight "drift"
      hr = 150 + Math.sin(t / 10) * 5; 
    } else {
      // 3. The Sprint Finish (8-10 mins): Push to 180bpm
      hr = 155 + ((t - 480) * 0.2);
    }

    session.push({
      timestamp: t,
      actualHR: Math.round(hr),
      // Normalize HR (60-190) to 0-100 Intensity for the Lactic Engine
      intensity: Math.min(Math.max((hr - 60) / 1.3, 0), 100)
    });
  }
  return session;
};