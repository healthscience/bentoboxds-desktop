# Debugging Lessons: Besearch Canvas Resize Issue

## Date: 2026-01-16

## Problem
Canvas element not expanding to fill available space when browser window is maximized.

## Root Cause
CSS Grid was operating in **content-sizing mode** instead of **available-space-sizing mode**.

### Symptoms:
- Computed styles showed fixed pixel values: `grid-template-rows: 831px 4px` instead of `1fr auto`
- Grid tracks calculated from content size, not available space
- Canvas stayed at initial size despite `width: 100%; height: 100%`

## Solution
Added `height: 100%` to `.modal-body` to give CSS Grid an explicit container size.

### Why It Worked:
CSS Grid's `1fr` unit means "1 fraction of AVAILABLE space". Without an explicit container size, Grid doesn't know what "available space" is, so it falls back to content-sizing (measuring the content and using that as the size).

## Key Lesson: **Always Use Browser Inspection First**

### What Worked:
1. Open browser dev tools
2. Inspect the problematic element
3. Check **Computed** tab for actual CSS values
4. Compare computed values to expected values
5. Work backwards up the DOM tree to find where sizing breaks

### What Didn't Work:
- Making assumptions about CSS behavior
- Adding more CSS rules without understanding the computed result
- Trying JavaScript solutions for CSS problems

## Diagnostic Approach for Future:
1. **Reproduce the issue** in browser
2. **Inspect computed styles** of affected elements
3. **Compare** computed vs expected values
4. **Identify** which CSS rule is causing the mismatch
5. **Fix** the specific rule
6. **Verify** with browser inspection again

## Technical Details:

### CSS Grid Content-Sizing vs Available-Space-Sizing:

**Content-Sizing** (what was happening):
```css
.parent { display: grid; grid-template-rows: 1fr auto; }
/* Without explicit height, Grid measures content */
/* Computed: grid-template-rows: 831px 4px; */
```

**Available-Space-Sizing** (what we needed):
```css
.parent { 
  display: grid; 
  grid-template-rows: 1fr auto;
  height: 100%; /* Explicit size triggers space distribution */
}
/* Computed: grid-template-rows: [calculated]fr auto; */
```

## Files Modified:
- `src/components/besearch/besearchModal.vue` - Added `height: 100%` to `.modal-body`
- `src/components/besearch/besearchCycle.vue` - Added `!important` to force responsive grid
- `src/canvas/managers/CanvasStateManager.js` - Implemented dynamic viewport getters
- `src/canvas/managers/BesearchCanvasManager.js` - Fixed initialization order
- `src/canvas/managers/CanvasRenderer.js` - Added force reflow, DPR scaling

## Bookmark:
Git commit `810dd3d`: "BOOKMARK: Before implementing dynamic viewport getters"

Revert if needed: `git reset --hard 810dd3d`

---

# Debugging Lessons: bbNexus Modal Routing & Z-Index Stacking

## Date: 2026-01-23

## Problem
bbNexus actions behaved inconsistently across entry points (besearch canvas panel, bentobox toolbar inside cue space, and bbNexus next to beebee input). Symptoms included:

- Modals opening but rendering **behind** the besearch or cue space modal.
- bbNexus `Create` not opening the besearch create form from some entry points.
- World switching (Body/Cue/Earth) working in the background but the **world label** staying stuck on `cues`.

## Root Causes (Primary)

1. **Stacking contexts across nested modals**
   - Cue space (`ModalSpace`) and besearch (`ModalBesearch`) were both full‑screen overlays with competing `z-index` values.
   - Library/DataBox and Cues modals were rendered correctly but **below** the besearch overlay.

2. **Event routing mismatches between entry points**
   - bbNexus buttons in different locations had **partial handlers**.
   - Some contexts didn’t wire `world:*` or `besearch:create` to the same store‑driven flow.

3. **State/UI divergence for world label**
   - The canvas world changed via manager state, but the label read from a different local state (`canvasState.currentMode`) that wasn’t updated by store changes.

## Fixes Applied

### 1) Normalize z‑index stacking for overlays
- **Besearch modal** is configurable by prop and defaults to a higher layer.
- **Cues modal** and **DataBox modal** are raised above besearch when opened from bbNexus.

Files:
- [`src/components/besearch/besearchModal.vue`](src/components/besearch/besearchModal.vue) — `z-index` made configurable via prop, default 1300.
- [`src/components/dataspace/datamodal/dataModal.vue`](src/components/dataspace/datamodal/dataModal.vue) — `z-index: 1500`.
- [`src/components/bentocues/cuesModal.vue`](src/components/bentocues/cuesModal.vue) — `z-index: 1500`.

### 2) Ensure bbNexus action routing is consistent
- Added missing handlers for world switching and create actions where absent.
- bbNexus `Create` now opens the create form without forcing the besearch canvas to open behind it.

Files:
- [`src/components/bentobox/tools/boxTools.vue`](src/components/bentobox/tools/boxTools.vue) — handles `world:*`, `context:*`, and `besearch:create` consistently.
- [`src/components/beebeehelp/inputBox.vue`](src/components/beebeehelp/inputBox.vue) — `besearch:create` opens form only; `world:*` opens besearch and sets world.

### 3) Centralize create form state
- The create form visibility is now stored in the besearch store for reuse across entry points.

Files:
- [`src/stores/besearchStore.js`](src/stores/besearchStore.js) — `showCreateForm`, `openCreateForm()`, `closeCreateForm()`.
- [`src/components/beebeeView/beebeeView.vue`](src/components/beebeeView/beebeeView.vue) — hosts the create form to avoid stacking behind other modals.

### 4) Keep world label in sync with actual world
- Label now reads from the store’s `canvasState.currentMode`.

Files:
- [`src/components/besearch/besearchCycle.vue`](src/components/besearch/besearchCycle.vue) — label binds to store state; watchers sync store world to canvas.
- [`src/stores/besearchStore.js`](src/stores/besearchStore.js) — `setNexusWorld()` updates `canvasState.currentMode`.

## Diagnostic Lessons

1. **Z‑index problems often mask valid state transitions.**
   - Verify action handlers run before assuming UI didn’t change.
   - Inspect the DOM and computed `z-index` when modals are missing.

2. **Multiple entry points need shared behavior.**
   - Keep bbNexus handlers consistent across beebee input, besearch canvas, and bentobox toolbar.

3. **Store‑backed UI state prevents divergence.**
   - Use the store for global UI state (create form visibility, world selection) to keep UI consistent.

## Checklist for Future Changes

- [ ] Verify bbNexus actions in **all three entry points**: beebee input, besearch modal, cue space bentobox.
- [ ] Confirm modal stacking order: Cues/DataBox above Besearch above Cue Space.
- [ ] Validate world label matches background.
- [ ] Remove any temporary debug logs before commit.
