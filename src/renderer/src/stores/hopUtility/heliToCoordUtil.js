/**
 * Conversion Utility: Heli-Clock SVG -> GPS
 * @param {Object} genesis - { lat: number, lon: number } (The Peer's origin)
 * @param {Object} clockCoord - { x: number, y: number } (SVG coordinate)
 * @param {number} scaleFactor - How many SVG units = 1 degree (approx. 111km)
 */
export const heliToGPS = (genesis, clockCoord, scaleFactor = 0.01) => {
  // Center of the clock is 50,50 in your SVG viewbox
  const dx = clockCoord.x - 50; 
  const dy = clockCoord.y - 50;

  // We invert dy because SVG Y-axis grows downward
  const latOffset = -dy * scaleFactor;
  const lonOffset = dx * scaleFactor;

  return {
    lat: genesis.lat + latOffset,
    lon: genesis.lon + lonOffset
  };
};

export default heliToGPS