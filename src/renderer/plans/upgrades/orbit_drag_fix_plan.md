# Orbit Drag Fix Plan

The issue where tool items in `OrbitView.vue` are not moving is caused by a combination of event bubbling issues, z-index conflicts, and the `pointer-events: none` property on the `world-canvas` container.

## Analysis
1.  **Event Capture**: `OrbitView.vue` has `handleGlobalDrag` on its root element, but `PrimeInterface.vue` also has a `handleGlobalDrag` on its root. When dragging a tool, the event might be captured by `PrimeInterface` instead of `OrbitView`.
2.  **Pointer Events**: The `.world-canvas` in `OrbitView.vue` has `pointer-events: none` by default. While it switches to `auto` when `dragging-active` is true, the initial `mousedown` on the tool might be affected by the stacking context.
3.  **Z-Index**: `LaunchpadStack.vue` (inside `.interface-layer`) has a high z-index (400 in `PrimeInterface.vue`) and might be blocking clicks if it doesn't correctly pass through pointer events.
4.  **Coordinate Calculation**: `handleGlobalDrag` in `OrbitView.vue` uses `document.querySelector('.orbit-stage')` which might find the wrong element or fail if multiple stages exist.

## Proposed Changes

### 1. `src/stores/orbitStore.js`
- No changes needed, the store logic seems sound.

### 2. `src/components/orbit/worlds/OrbitView.vue`
- Remove local `handleGlobalDrag` and `stopDragging` logic.
- Move the dragging state management to `PrimeInterface.vue` or ensure `OrbitView` correctly listens to global events.
- **Better Approach**: Keep the logic in `OrbitView` but use `window` event listeners when dragging starts to ensure events are captured regardless of where the mouse moves.
- Update CSS to ensure `.world-canvas` doesn't block interaction but allows tools to be grabbed.

### 3. `src/components/orbit/PrimeInterface.vue`
- Ensure `.interface-layer` (which contains `LaunchpadStack`) truly allows pointer events to pass through to the `WorldCanvas` below it.
- Currently, `.interface-layer` has `pointer-events: none` and its children have `pointer-events: auto`. This is correct, but we need to verify `LaunchpadStack`'s root element doesn't cover the whole screen with `pointer-events: auto`.

### 4. `src/components/orbit/parts/LaunchpadStack.vue`
- Ensure the root element `#launchpad-experience` doesn't have `pointer-events: auto` if it's covering the whole stage.

## Implementation Steps
1.  Modify `OrbitView.vue` to use `window` listeners for `mousemove` and `mouseup` once dragging starts.
2.  Fix the coordinate calculation in `OrbitView.vue` to be more robust.
3.  Adjust CSS z-indexes to ensure `WorldCanvas` (and thus `OrbitView`) is accessible for clicks when tools are visible.
