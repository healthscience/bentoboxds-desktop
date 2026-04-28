/**
 * HOP Body Evolution: The Fitness Function
 * Rewards walking, punishes falling and wasted energy.
 */
export function evaluateFitness(vessel, genome, simulationSteps = 600) {
    let totalDistance = 0;
    let stabilityBonus = 0;
    let energyPenalty = 0;
    let hasFallen = false;

    // Reset the physics vessel for the trial
    vessel.reset();

    for (let i = 0; i < simulationSteps; i++) {
        // 1. Get Sensors (Inputs for NEAT)
        const inputs = [
            vessel.torso.position.y,               // Altitude
            vessel.torso.quaternion.x,             // Pitch/Tilt
            vessel.leftHip.getAngle(),             // Left Leg Angle
            vessel.rightHip.getAngle(),            // Right Leg Angle
            vessel.torso.position.y > 0.5 ? 1 : 0  // Ground contact proxy/Stability
        ];

        // 2. Activate Neural Network
        const outputs = genome.activate(inputs);
        
        // 3. Apply Actuators (Motors)
        // Map outputs (usually 0-1 or -1 to 1) to motor speeds
        const leftMotorSpeed = (outputs[0] - 0.5) * 20; 
        const rightMotorSpeed = (outputs[1] - 0.5) * 20;

        vessel.leftHip.setMotorSpeed(leftMotorSpeed);
        vessel.rightHip.setMotorSpeed(rightMotorSpeed);

        // 4. Step Physics
        vessel.step(1/60);

        // 5. Monitor State
        // Progress: How far did the torso travel along the X-axis?
        totalDistance = vessel.torso.position.x;

        // Stability: Keep the torso above the 'knee' height (0.5m)
        if (vessel.torso.position.y < 0.5) {
            hasFallen = true;
            break; // Terminate trial on fall
        } else {
            stabilityBonus += 0.1; // Reward for staying upright
        }

        // Efficiency: Penalize high motor usage
        energyPenalty += (Math.abs(leftMotorSpeed) + Math.abs(rightMotorSpeed)) * 0.01;
    }

    // Final Calculation
    // We want to maximize distance, maximize stability, and minimize energy
    const score = (totalDistance * 10) + stabilityBonus - (energyPenalty / 100);
    
    // Return a non-negative score for NEAT
    // If fallen, we give a heavily reduced score based on how long it stood
    return Math.max(0, hasFallen ? score * 0.1 : score);
}
