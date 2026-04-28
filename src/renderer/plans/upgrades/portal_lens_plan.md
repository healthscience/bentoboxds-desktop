# Portal Lens & Biological Depth Engine Implementation Plan

## css grid only project vue3

## Objective
Implement a stable, multi-layer "Portal Lens" interaction system for `EarthEnvironment.vue` and `Cues-BodyWorld.vue`, supporting magnetic anchoring, velocity dampening, and decoupled visual/data zoom.

## 1. Create `useLensStability.js` Composable
**Path:** `src/composables/useLensStability.js`
- Implement the Spring-Damper Model for velocity dampening.
- Add Clutch Mode (holding `Shift` or `Space` for sub-pixel precision).
- Implement Magnetic Anchoring (`findNearestCue` logic) by scanning `cuesUtility` for nodes within a 50px radius.
- Expose reactive state: `lensPos`, `target`, `isLocked`, `zoomScale`, `zoomDepth`.
- Expose methods: `handleMouseMove`, `toggleLock`.

## 2. Refactor `EarthEnvironment.vue`
**Path:** `src/components/orbit/worlds/EarthEnvironment.vue`
- Integrate the `useLensStability` composable.
- Update the CSS Grid layout to accommodate the Lens HUD and the "Home" anchor.
- Add the Lens HUD UI (depth control slider, lock button, strap status readout).
- Ensure the lens position maps correctly to the underlying map coordinates.

## 3. Refactor `Cues-BodyWorld.vue`
**Path:** `src/components/orbit/worlds/Cues-BodyWorld.vue`
- Integrate the `useLensStability` composable.
- Add the Lens HUD UI (depth control slider, lock button, strap status readout).
- Pass the `zoomDepth` (emulation depth) to the canvas bridge.
- Ensure the lens position maps correctly to the `src/canvas` coordinate system so the emulation doesn't drift when panning.

## 4. Update `src/canvas` Bridge
**Paths:** `src/canvas/systems/HOPDataBridge.js` and `src/canvas/managers/CanvasStateManager.js`
- Create an interface to receive `emulationDepth` signals from the Lens UI.
- Implement the state-machine for the rendering engine:
  - **Level 0 (Macro):** Wikipedia labels + Surface Mesh.
  - **Level 1 (System):** 140 Biomarkers + Organ Outlines.
  - **Level 2 (Cellular):** NEAT Particle Emulation + Fluid Dynamics.

## 5. Implement Tagging Workflow & Persistent Storage
- Add a "Tagging Mode" accessible via the Sidebar.
- Allow selecting a Cue from `cuesUtility`.
- Calculate the Relative Offset from the Body/Earth Genesis point when clicking through the Lens.
- Save the newly tagged coordinates back to the Peer's local store (targeting eventual Hyperbee integration).

## Success Metrics
- **Zero Jitter:** The lens feels "heavy" and smooth.
- **Layer Coherence:** Zooming maintains the focal point center perfectly.
- **Stability:** Panning the base map while the lens is "Locked" keeps the lens pinned to the coordinate, not the screen pixel.
