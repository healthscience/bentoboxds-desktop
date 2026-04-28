# Body World Integration Plan

## Overview
This plan outlines the steps to replace the static body image in `Cues-BodyWorld.vue` with an interactive, parametric 3D body model (Anny) and modular internal organs (Z-Anatomy), adhering to the HOP Agent Specification.

## Core Objectives
- Remove static body image and implement a 3D interactive canvas.
- Integrate the Anny parametric model (Layer 1).
- Sync Z-Anatomy modular meshes to Anny's rig (Layer 2).
- Enable bentoLens interaction for cueCube tagging.
- Ensure Local-First, Vanilla JS, and Privacy-First principles.

## Implementation Steps

### Phase 1: Setup and Cleanup (Current Focus)
- [ ] **Remove Static Assets:** Remove the static body diagram/image from `Cues-BodyWorld.vue` and its associated CSS/logic.
- [ ] **Initialize 3D Canvas:** Set up a Three.js (or similar Vanilla JS 3D library) scene within the `Cues-BodyWorld.vue` component to host the 3D models.
- [ ] **Local Asset Preparation:** Ensure Anny GLB models and Z-Anatomy meshes (e.g., Heart) are available in the local public/assets directory for Local-First loading.
- [ ] **Phase 1 Testing:** Pause implementation to run component tests and conduct human testing on the new 3D canvas initialization before proceeding to Phase 2.

### Phase 2: Layer 1 - Body (Pyodide Worker)
- [ ] **Implement `PyodideWorker`:** Create a Web Worker (`src/workers/pyodide-worker.js`) that uses Pyodide to handle metabolic logic.
- [ ] **Worker Communication:** Set up message passing between the main thread (`Cues-BodyWorld.vue`) and the `PyodideWorker` to send peer data (age, weight, metabolic state).
- [ ] **Render Body:** Add the generated Anny mesh data received from the worker to the 3D scene in `Cues-BodyWorld.vue`.
- [ ] **Parametric Scaling:** Ensure the Anny model scales and morphs correctly based on the peer's metabolic/health data processed by the Python worker.

### Phase 3: Layer 2 - Organ Content (Z-Anatomy via Vanilla JS)
- [ ] **Load Organ Meshes:** Implement loading for Z-Anatomy modular meshes (starting with the Heart) using Vanilla JS (e.g., Three.js `GLTFLoader`). These are static meshes loaded from local storage.
- [ ] **Create `OrganSyncSystem`:** Develop a SafeFlow-ECS compatible system (`src/systems/OrganSyncSystem.js`) in Vanilla JS to manage organ states and synchronization.
- [ ] **Implement `heart-sync.js`:** Adapt the provided `heart-sync.js` script to parent the Z-Anatomy Heart Mesh (`id: Heart_01`) to the Anny Spine/Chest Bone (`Spine3`).
- [ ] **Apply Local Offsets:** Ensure organs use local offsets from the Body Origin for privacy and correct anatomical positioning.
- [ ] **Proportional Scaling:** Link organ scaling to the Anny model's generated proportions.

### Phase 4: Interaction, bentoLens, and Tagging
- [ ] **bentoLens Zoom Integration:** Map the existing `zoomDepth` (0=Surface, 1=Biomarker, 2=Cellular) from `useLensStability` to the 3D scene. For example, at depth 0, show the Anny skin; at depth 1, make the skin transparent/wireframe to reveal the Z-Anatomy organs.
- [ ] **Raycasting Setup:** Implement Three.js raycasting from the bentoLens (mouse/pointer) position into the 3D scene to detect intersections with meshes.
- [ ] **Mesh ID Querying & Tagging:** On hover (raycast hit), query the mesh's `userData` for its Z-Anatomy ID (e.g., `Heart_01`).
- [ ] **cueCube Integration:** When an organ is hovered, trigger the UI to display the associated cueCube tag (integrating with existing lifetools/cuesStore logic).
- [ ] **Metabolic Emulation:** Connect the `OrganSyncSystem` to the peer's metabolic state (e.g., heart rate driving visual pulse) as demonstrated in the `heart-sync.js` script.

### Phase 5: Integration and Testing
- [ ] **Vue Component Integration:** Wire up the 3D scene, `AnnyWorker`, and `OrganSyncSystem` within the lifecycle hooks of `Cues-BodyWorld.vue`.
- [ ] **State Management:** Ensure seamless communication between the 3D scene and Vue stores (e.g., `cuesStore`, `besearchStore`).
- [ ] **Performance Optimization:** Optimize mesh loading and rendering for smooth performance in the browser.
- [ ] **Unit Testing:** Write tests for the `OrganSyncSystem` logic to ensure correct scaling and positioning calculations.
- [ ] **Component Testing:** Verify that `Cues-BodyWorld.vue` correctly initializes the 3D canvas and responds to `zoomDepth` changes.
- [ ] **E2E Testing (Cypress):** Create Cypress tests to simulate bentoLens interactions (hovering over the canvas) and verify that the correct cueCube tags are displayed in the UI.
- [ ] **Visual Verification:** Manually test the 3D rendering, ensuring the Anny model morphs correctly based on mock peer data and the Z-Anatomy heart pulses according to the simulated metabolic state.