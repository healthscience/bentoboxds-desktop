/**
 * Lactic Acid Accumulation & Clearance Engine
 */
export class LacticECS {
  constructor() {
    this.level = 0.5; // mmol/L (Baseline)
    this.threshold = 4.0; // The 'Redline' for most swimmers
    this.debt = 0; // Cumulative fatigue
  }

  update(intensity, strokeType) {
    // 1. Accumulation: Butterfly (high) vs Backstroke (moderate)
    const strokeMultipliers = { butterfly: 1.5, backstroke: 0.8, breaststroke: 1.2, freestyle: 1.0 };
    const rate = (intensity * strokeMultipliers[strokeType]) / 100;
    
    this.level += rate;

    // 2. Clearance: Your body clearing lactate as you move
    // This represents your 'Aerobic Engine'
    const clearance = 0.05; 
    this.level = Math.max(0.5, this.level - clearance);

    // 3. Debt Calculation
    if (this.level > this.threshold) {
      this.debt += (this.level - this.threshold) * 0.1;
    }

    return {
      level: this.level.toFixed(1),
      isRedlining: this.level > this.threshold,
      efficiencyLoss: (this.debt * 5).toFixed(1) // % loss in stroke power
    };
  }
}