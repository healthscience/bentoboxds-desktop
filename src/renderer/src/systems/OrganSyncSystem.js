/**
 * HOP Coordination Script: Heart to Body Skeleton
 * Version: 0.1 (Vanilla JS)
 */
import * as THREE from 'three';

const OrganSyncSystem = {
    heartMesh: null,
    bodySkeleton: null,

    /**
     * @param {THREE.Group|THREE.Mesh} bodyModel - The loaded Body GLB (or placeholder)
     * @param {THREE.Mesh} heartMesh - The modular Heart
     */
    init(bodyModel, heartMesh) {
        this.heartMesh = heartMesh;
        
        // 1. Locate the anchor bone in the body hierarchy
        // 'Spine3' is the typical SMPL-X chest anchor
        // For our placeholder capsule, we'll just use the capsule itself if Spine3 isn't found
        this.bodySkeleton = bodyModel.getObjectByName('Spine3') || bodyModel;

        if (this.bodySkeleton) {
            console.log("HOP: Heart anchored to Body's Chest (Spine3 or fallback)");
            // 2. Parent the heart to the bone so it follows rotations/poses
            this.bodySkeleton.add(this.heartMesh);
            
            // 3. Apply Local Offset (Anatomical correct position inside the chest)
            // Adjust for specific model scale. For the capsule, we put it slightly forward and up.
            this.heartMesh.position.set(0, 0.5, 0.5); 
        }
    },

    /**
     * Called by SafeFlow-ECS every frame to handle 'On the Fly' scaling
     */
    update(metabolicState) {
        if (!this.heartMesh) return;

        // Life-Strap Emulation: Heart rate drives visual pulse
        // metabolicState.pulse is calculated by the Python worker
        const pulseFactor = metabolicState.pulse || 1.0;
        
        // Add a sine wave based on time to simulate beating
        // The frequency is driven by the heart rate (pulseFactor)
        const beat = 1 + Math.sin(Date.now() * pulseFactor / 150) * 0.1;
        
        this.heartMesh.scale.set(beat, beat, beat);

        // Cue Tagging: Check if lens is looking at the heart
        if (this.heartMesh.userData.isHovered) {
            this.triggerCueCube("Heart_01_Tag");
        }
    },

    triggerCueCube(tagId) {
        // Placeholder for triggering the UI
        // console.log(`Triggering cueCube tag: ${tagId}`);
    }
};

export default OrganSyncSystem;
