# Fix Plan: Restore Lens HUD Functionality in Cues-BodyWorld.vue

## Problem Analysis
The `lens-hud` component in [`src/components/orbit/worlds/Cues-BodyWorld.vue`](src/components/orbit/worlds/Cues-BodyWorld.vue) is not operational because:
1. **Missing Event Binding**: The `handleMouseMove` function from `useLensStability` is not bound to any element in the template. Without this, `lensPos` never updates.
2. **CSS Positioning Conflict**: The `.lens-hud` class has `grid-area: 1 / 1` and `position: absolute`, but its parent `#world-holder` is `display: flex`. This might cause layout issues.
3. **Negative Offsets**: The CSS sets `top: -125px` and `left: -125px`, which assumes the `hudStyle` transform is relative to a centered point, but the `handleMouseMove` logic calculates coordinates relative to the container's top-left.

## Proposed Fixes

### 1. Bind Mouse Events
Add `@mousemove="handleMouseMove"` to the `#world-holder` or the relevant pane to ensure the lens follows the cursor.

### 2. Update CSS for HUD
Adjust `.lens-hud` to ensure it renders correctly within the flex container or move it to a more appropriate coordinate space.

### 3. Coordinate Alignment
Ensure `useLensStability` and the HUD CSS use a consistent origin for positioning.

## Implementation Steps
1. Modify [`src/components/orbit/worlds/Cues-BodyWorld.vue`](src/components/orbit/worlds/Cues-BodyWorld.vue) template to add `@mousemove="handleMouseMove"` to `#world-holder`.
2. Update `.lens-hud` CSS to remove `grid-area` (since it's not in a grid) and verify positioning.
3. Add `@click="toggleFixed"` to the left pane or a specific toggle to allow locking the lens.
