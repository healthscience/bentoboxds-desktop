/**
 * Great Orbit Projection Logic
 * Calculates the delta between 'Biological Decay' and 'Technique Evolution'
 */
export const calculateGreatOrbit = (currentPace, yearsOut) => {
  const basePace = currentPace; // e.g., 195 seconds for a 3:15 200m
  
  // 1. Biological Drift: Fast-twitch fiber reduction (~1% per year after a certain age)
  const bioDrift = 1 + (yearsOut * 0.012); 

  // 2. Technique Consilience: Efficiency gains from 'Besearch' (-0.8% per year)
  // This is the "Longevity" bonus for focusing on resonance over raw power.
  const techGain = 1 - (yearsOut * 0.008);

  // 3. The Resulting "Success Vector"
  const projectedPace = basePace * bioDrift * techGain;

  return {
    year: 2026 + yearsOut,
    paceSeconds: projectedPace,
    formattedPace: formatPace(projectedPace),
    resonanceCapacity: (1 - (yearsOut * 0.005)) * 100 // Total energy overhead
  };
};

const formatPace = (s) => {
  const mins = Math.floor(s / 60);
  const secs = Math.round(s % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};