import * as CANNON from 'cannon-es';

/**
 * HOP Body Evolution: The Physics Vessel
 * Creates a 3-part biped (Torso + 2 Legs) in a Cannon-es world.
 */
export class BodyVessel {
    constructor() {
        this.world = new CANNON.World({ 
            gravity: new CANNON.Vec3(0, -9.82, 0) 
        });
        
        // Use a more stable solver for joints
        this.world.solver.iterations = 20;
        this.world.defaultContactMaterial.friction = 0.8;

        this.initGround();
        this.initBiped();
        this.isEvolving = false;
    }

    initGround() {
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ 
            type: CANNON.Body.STATIC, 
            shape: groundShape 
        });
        // Rotate plane to be horizontal
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(groundBody);
    }

    initBiped() {
        // 1. Torso (The Core)
        // Box(halfExtents) -> 0.2m wide, 0.4m high, 0.2m deep (Total: 0.4x0.8x0.4)
        this.torso = new CANNON.Body({ 
            mass: 50, 
            shape: new CANNON.Box(new CANNON.Vec3(0.2, 0.4, 0.2)) 
        });
        this.torso.position.set(0, 1.2, 0);

        // 2. Legs (The Actuators)
        // Box(halfExtents) -> 0.1m wide, 0.4m high, 0.1m deep (Total: 0.2x0.8x0.2)
        const legShape = new CANNON.Box(new CANNON.Vec3(0.1, 0.4, 0.1));
        
        this.leftLeg = new CANNON.Body({ 
            mass: 10, 
            shape: legShape 
        });
        this.rightLeg = new CANNON.Body({ 
            mass: 10, 
            shape: legShape 
        });
        
        // Position legs below torso
        this.leftLeg.position.set(0, 0.4, 0.2);
        this.rightLeg.position.set(0, 0.4, -0.2);

        // 3. Hinges (The Joints)
        // PivotA is relative to Torso center, PivotB is relative to Leg center
        this.leftHip = new CANNON.HingeConstraint(this.torso, this.leftLeg, {
            pivotA: new CANNON.Vec3(0, -0.4, 0.2),
            pivotB: new CANNON.Vec3(0, 0.4, 0),
            axisA: new CANNON.Vec3(0, 0, 1),
            axisB: new CANNON.Vec3(0, 0, 1)
        });

        this.rightHip = new CANNON.HingeConstraint(this.torso, this.rightLeg, {
            pivotA: new CANNON.Vec3(0, -0.4, -0.2),
            pivotB: new CANNON.Vec3(0, 0.4, 0),
            axisA: new CANNON.Vec3(0, 0, 1),
            axisB: new CANNON.Vec3(0, 0, 1)
        });

        // Enable Motors for neat-hop to control
        this.leftHip.enableMotor();
        this.rightHip.enableMotor();

        // Add helper methods for fitness evaluation
        this.leftHip.getAngle = () => this.leftHip.angle;
        this.rightHip.getAngle = () => this.rightHip.angle;

        // Add to world
        this.world.addBody(this.torso);
        this.world.addBody(this.leftLeg);
        this.world.addBody(this.rightLeg);
        this.world.addConstraint(this.leftHip);
        this.world.addConstraint(this.rightHip);
    }

    /**
     * Step the physics world
     */
    step(dt) {
        this.world.step(dt);
    }

    /**
     * Reset the biped to starting position for a new trial
     */
    reset() {
        this.torso.position.set(0, 1.2, 0);
        this.torso.velocity.set(0, 0, 0);
        this.torso.angularVelocity.set(0, 0, 0);
        this.torso.quaternion.set(0, 0, 0, 1);

        this.leftLeg.position.set(0, 0.4, 0.2);
        this.leftLeg.velocity.set(0, 0, 0);
        this.leftLeg.angularVelocity.set(0, 0, 0);
        this.leftLeg.quaternion.set(0, 0, 0, 1);

        this.rightLeg.position.set(0, 0.4, -0.2);
        this.rightLeg.velocity.set(0, 0, 0);
        this.rightLeg.angularVelocity.set(0, 0, 0);
        this.rightLeg.quaternion.set(0, 0, 0, 1);
        
        this.leftHip.disableMotor();
        this.rightHip.disableMotor();
        this.leftHip.enableMotor();
        this.rightHip.enableMotor();
    }

    step(dt) {
        this.world.step(dt);
    }
}
