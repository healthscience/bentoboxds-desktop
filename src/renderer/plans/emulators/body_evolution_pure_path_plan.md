# HOP Kilo Spec: Sovereign Body Evolution (v1.0)

## Context
We are replacing Anny and Z-Anatomy with a 'Pure Path' system. We provide the laws of physics and the mechanism of evolution (neat-hop). The peer's body must 'learn' to exist.

## Technical Stack
- **Engine:** Vanilla JS / Three.js (Rendering).
- **Physics:** Cannon-es (35KB local-first physics).
- **Brain:** neat-hop (NeuroEvolution module).
- **Storage:** BentoBoxDS (Saves the winning 'Genome' as a cueCube).

## Core Directives
1. **Zero-Python:** Do not use Pyodide or external ML servers.
2. **Skeleton First:** Build a 3-part ragdoll (Torso + 2 Legs) using Cannon-es HingeJoints.
3. **Data-Sovereignty:** The evolution must happen locally on the peer's hardware.

## Implementation Tasks

### Phase 1: The Physics Vessel (`foundation-physics.js`)
- Create a Cannon-es world with gravity -9.82.
- Define a 'BodyEntity' with:
    - Torso (Box, Mass: 50kg)
    - 2 Legs (Cylinders/Boxes, Mass: 10kg each)
    - 2 HingeJoints with motor capabilities.

### Phase 2: The Neural Bridge (`neat-bridge.js`)
- **Inputs (Sensors):** 
    - Torso Y-position (Altitude).
    - Torso Pitch (Tilt).
    - Left/Right Leg angles.
    - Ground contact (Boolean).
- **Outputs (Actuators):** 
    - Target velocity for Left/Right Hinge motors.

### Phase 3: The Fitness Function (`fitness.js`)
- Implement the `evaluate(genome)` loop:
    - **START:** Position at (0, 0, 0).
    - **RUN:** 500 physics ticks.
    - **PENALTY:** If Torso.y < 0.5m, terminate trial (Fall detected).
    - **SCORE:** `Total Distance - (Sum of Torque / 100)`.

## Integration with beebee
- **beebee** will act as the 'Genetic Curator'.
- When a generation completes, **beebee** saves the top 3 Genomes to the peer's BentoBoxDS.
- These Genomes represent the 'Muscle Memory' of the peer.

## Visualization (`Cues-BodyWorld.vue`)
- Map the Cannon-es Body positions directly to a low-poly Three.js mesh for the 'Body World' view.

## UI Layout Spec: Body World Atlas & Evolution

### Layout
- **Left Pane (50%):** Static Anatomical Map (`src/assets/human-diagram.png`).
    - Purpose: Human Atlas for cueCube tagging.
    - Behavior: Persistent, clickable 'Anchor Points' for organs.
- **Right Pane (50%):** Real-time Physics Sandbox.
    - Purpose: neat-hop evolution and locomotion testing.
    - Behavior: Shows the 3-part biped ragdoll struggling/learning to walk.

### Data Sync
- **The Bridge:** When an organ is tagged on the Left (e.g., Heart), a metabolic 'resonAgent' is spawned in the SafeFlow-ECS on the Right.
- **Visual Feedback:** The evolving biped's 'heart rate' (calculated by neat-hop) should highlight the corresponding anchor on the static map.
