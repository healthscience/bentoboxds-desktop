/**
 * HOP Body Evolution: The Neural Bridge
 * Connects the neat-hop genome to the Cannon-es physics vessel.
 */
export class NeuralBridge {
    constructor(vessel) {
        this.vessel = vessel;
    }

    /**
     * Get current sensor data from the physics world
     * @returns {number[]} Inputs for the neural network
     */
    getSensors() {
        const torso = this.vessel.torso;
        const leftHip = this.vessel.leftHip;
        const rightHip = this.vessel.rightHip;

        return [
            torso.position.y,               // Altitude (Height)
            torso.quaternion.x,             // Pitch (Forward/Backward tilt)
            torso.quaternion.z,             // Roll (Side tilt)
            leftHip.getAngle(),             // Left Leg Angle
            rightHip.getAngle(),            // Right Leg Angle
            torso.velocity.x,               // Forward Velocity
            torso.position.y > 0.6 ? 1 : 0  // Is Standing
        ];
    }

    /**
     * Apply neural network outputs to the physics motors
     * @param {number[]} outputs - Actuator values from NEAT
     */
    applyActuators(outputs) {
        // Map outputs [0, 1] to motor speeds [-10, 10]
        const leftSpeed = (outputs[0] - 0.5) * 20;
        const rightSpeed = (outputs[1] - 0.5) * 20;

        this.vessel.leftHip.setMotorSpeed(leftSpeed);
        this.vessel.rightHip.setMotorSpeed(rightSpeed);
    }
}
