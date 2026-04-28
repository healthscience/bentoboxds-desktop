# BentoBoxDS Migration Plan: Master HeliClock Integration

## Overview
To ensure coherence between the HOP backend logic and the BentoBoxDS frontend experience, we are moving to a "Master Clock" strategy. The HOP backend will maintain the authoritative `HeliClock` instance and broadcast orbital vectors to BentoBoxDS. BentoBoxDS must stop calculating its own vectors and instead render based on the received signals.

## Required Changes

### 1. `src/components/bentodiary/heliClock.vue`

**Current State:**
- Imports `../.././wasm/heli_engine.js`.
- Runs a local `requestAnimationFrame` loop calling `HeliCore.get_orbital_degree(Date.now())`.

**New State:**
- **Remove:** WASM import and local tick loop.
- **Add:** Computed property reading from `diaryStore` (or `besearchStore`).
- **Logic:**
  ```javascript
  import { useDiaryStore } from '@/stores/diaryStore'
  const store = useDiaryStore()
  
  // Reactively update based on store state
  const currentDegree = computed(() => store.currentVector)
  ```

### 2. `src/stores/diaryStore.js` (or `besearchStore.js`)

**Current State:**
- Manages calendar events but doesn't seem to track the live HeliClock vector.

**New State:**
- **Add State:** `currentVector` (number), `currentZenith` (number).
- **Add Action:** `updateClock(vector, zenith)` to update state.
- **Socket Integration:** Listen for `heli-tick` messages from HOP.
  ```javascript
  // In socket listener or store initialization
  socket.on('heli-tick', (data) => {
      this.currentVector = data.vector
      this.currentZenith = data.zenith
  })
  ```

### 3. `src/stores/socket.js` (or `library-hop` integration)

- Ensure the socket connection to HOP subscribes to the clock channel/events.
- Dispatch received `heli-tick` events to the appropriate store.

### 4. Cleanup
- Remove `src/wasm/heli_engine.js` and `src/wasm/heli_engine_bg.wasm` from BentoBoxDS if they are no longer used by any other component.

## Data Flow

1.  **HOP (Backend):** `HeliClock` ticks -> `Besearch` checks triggers -> `LibraryHop` emits `heli-tick` via Socket/P2P.
2.  **BentoBoxDS (Frontend):** `SocketStore` receives `heli-tick` -> Updates `DiaryStore`.
3.  **UI:** `heliClock.vue` reacts to `DiaryStore` change and updates the SVG rotation.

## Benefits
- **Coherence:** UI always matches backend logic.
- **Performance:** Removes heavy WASM calculation from the UI thread (though WASM is fast, avoiding redundancy is better).
- **Resonance:** All peers see the same "time" relative to the backend's consensus.