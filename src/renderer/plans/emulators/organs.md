# Organ Surface Emulator

The `OrganSurface` component provides a visual representation of biological organs using the HTML5 Canvas API. It is designed to emulate real-world physiological data through animations.

## Component: `src/components/orbit/worlds/body/organSurface.vue`

### Usage

The component is typically used within a world view (like `Cues-BodyWorld.vue`) and is triggered by zoom depth or specific cue selection.

```vue
<OrganSurface 
  :linked-cue="currentCue" 
  :organ-color="'#ff4d4d'" 
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `linkedCue` | `Object` | `null` | The cue object representing the organ (e.g., `{ name: 'Heart' }`). |
| `organColor` | `String` | `'#ff4d4d'` | The base color for the organ rendering. |

### Features

1.  **Pulsing Icosahedron Renderer**: The heart is represented as a rotating, pulsing icosahedron (a 20-faced polyhedron). This provides a modern, "resonance" feel to the biological emulation.
2.  **Resonance Pulse**: The pulse is driven by a dual-beat logic (systole and diastole) at **72 BPM**, scaling the icosahedron between 0.8 and 1.2.
3.  **3D Projection**: Uses orthographic projection and rotation matrices to render a 3D wireframe on a 2D canvas.
4.  **Visual Effects**:
    -   **Glow**: The wireframe has a neon-like glow effect.
    -   **Ambient Rotation**: The object slowly rotates for a dynamic, living feel.
    -   **Background Resonance**: A radial gradient pulses in sync with the heartbeats.
5.  **Responsive Canvas**: Automatically resizes to fit its parent container while maintaining high-quality rendering.

### Future Integration: Real-World Sensor Data

To integrate real-world sensor data (e.g., live heart rate from a wearable):

1.  **Update Props**: Add a `bpm` prop to the component.
2.  **Reactive Animation**: Update the `period` calculation in the `animate` function to use the `props.bpm` value.
3.  **Resonance Agent**: Connect the `pulseValue` directly to a resonance agent or store that receives live updates via WebSockets.

### Technical Implementation Details

- **Canvas ID**: `besearch-world` (consistent with the project's canvas methodology).
- **Geometry**: 12 vertices and 30 edges of an icosahedron defined using the Golden Ratio ($\phi$).
- **Animation Loop**: Uses `requestAnimationFrame` for smooth 60fps rendering.
- **Cleanup**: Automatically removes event listeners and cancels animation frames on component unmount.
