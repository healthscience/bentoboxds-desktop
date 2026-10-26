import * as THREE from 'three';

/**
 * HOP Body Emulation Rig
 * Renders spatial truth directly from safeflow-ecs reference contracts.
 */
export class BodyEmulationRig {
    constructor(containerElement) {
        // 1. The Gravity-View Environment Anchor
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent to see the Besearch UI behind it
        
        // The Tangent Plane (X/Z plane, Y is gravity)
        const gridHelper = new THREE.GridHelper(10, 20, 0x00ffc8, 0x2c323b);
        this.scene.add(gridHelper);

        // 2. Build the Kinematic Body Hierarchy (The "Line")
        this.entities = {};
        this.buildSkeletalLine();

        // 3. Render Setup
        this.camera = new THREE.PerspectiveCamera(45, containerElement.clientWidth / containerElement.clientHeight, 0.1, 100);
        this.camera.position.set(2, 1.5, 3);
        this.camera.lookAt(0, 1, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(containerElement.clientWidth, containerElement.clientHeight);
        containerElement.appendChild(this.renderer.domElement);
    }

    /**
     * Constructs the visual hierarchy without predictive physics.
     * These are empty grouping nodes we can attach geometry to later.
     */
    buildSkeletalLine() {
        // Material for emulation rendering
        const boneMat = new THREE.MeshBasicMaterial({ color: 0x00ffc8, wireframe: true });

        // Helper to create a bone segment
        const createBone = (name, length, parent) => {
            const group = new THREE.Group();
            // Optional: Add a visual mesh so we can see the "line"
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, length, 0.1), boneMat);
            mesh.position.y = length / 2; // Offset so the group origin is the joint
            group.add(mesh);
            
            if (parent) parent.add(group);
            this.entities[name] = group;
            return group;
        };

        // The Root Anchor (Pelvis/Core) - attached to the world
        const core = createBone('core', 0.4, this.scene);
        
        // The Line (Spine -> Head)
        const spine = createBone('spine', 0.5, core);
        spine.position.y = 0.4; // Top of core
        
        const head = createBone('head', 0.2, spine);
        head.position.y = 0.5; // Top of spine

        // Limbs (Arms & Legs)
        const leftArm = createBone('leftArm', 0.4, spine);
        leftArm.position.set(0.2, 0.4, 0); // Shoulder joint

        const rightArm = createBone('rightArm', 0.4, spine);
        rightArm.position.set(-0.2, 0.4, 0);

        const leftLeg = createBone('leftLeg', 0.5, core);
        leftLeg.position.set(0.1, 0, 0); // Hip joint

        const rightLeg = createBone('rightLeg', 0.5, core);
        rightLeg.position.set(-0.1, 0, 0);
    }

    /**
     * PURE JS DUAL QUATERNION DECODER
     * Extracts rotation and translation from the 8-float spatial stride.
     */
    decodeDualQuaternion(strideBuffer, offset) {
        // Real part (Rotation)
        const rX = strideBuffer[offset + 0];
        const rY = strideBuffer[offset + 1];
        const rZ = strideBuffer[offset + 2];
        const rW = strideBuffer[offset + 3];

        // Dual part (Translation encoded)
        const dX = strideBuffer[offset + 4];
        const dY = strideBuffer[offset + 5];
        const dZ = strideBuffer[offset + 6];
        const dW = strideBuffer[offset + 7];

        // Translation = 2 * (Dual * conjugate(Real))
        const tX = 2 * ( dX * rW - dW * rX + dY * rZ - dZ * rY);
        const tY = 2 * ( dY * rW - dW * rY + dZ * rX - dX * rZ);
        const tZ = 2 * ( dZ * rW - dW * rZ + dX * rY - dY * rX);

        return {
            rotation: new THREE.Quaternion(rX, rY, rZ, rW),
            translation: new THREE.Vector3(tX, tY, tZ)
        };
    }

    /**
     * THE EMULATION LOOP
     * Replaces physics.step(dt). Called every frame by the peer's render loop.
     * Takes the contiguous Float32Array from safeflow-ecs.
     */
    emulate(ecsBuffer, entityMap) {
        // entityMap tells us which ECS stride index corresponds to which body part
        // Example: entityMap = { 'core': 0, 'spine': 1, 'leftArm': 2 }

        for (const [boneName, strideIndex] of Object.entries(entityMap)) {
            const bone = this.entities[boneName];
            if (!bone) continue;

            const strideOffset = strideIndex * 12; // 12-float Reference Contract Layout

            // Extract exact spatial truth
            const transform = this.decodeDualQuaternion(ecsBuffer, strideOffset);

            // Apply directly to the visual hierarchy
            bone.quaternion.copy(transform.rotation);
            bone.position.copy(transform.translation);
            
            // Note: If floats 8-11 hold biometric data (organ gel voltage), 
            // you can read them here to change the bone's color, thickness, or aura!
            const bioVoltage = ecsBuffer[strideOffset + 8]; 
        }

        this.renderer.render(this.scene, this.camera);
    }
}