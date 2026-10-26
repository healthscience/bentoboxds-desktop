# BentoboxDS Design Guidelines

## Overview
BentoboxDS is a Vue 3 application designed to create an on-the-fly peer experience following computer game design principles. The application provides an interactive canvas-based environment for managing health interventions, cues, and besearch cycles.

## Core Technologies

### Frontend Framework
- **Vue 3** with Composition API
- **Pinia** for state management
- **Vue Router** for navigation

### Styling Approach
- **CSS Grid** as the primary layout system
- Minimal use of Flexbox (only where absolutely necessary)
- Responsive design with mobile-first approach

## Design Principles

### 1. Computer Game Design Approach
- **Interactive Canvas**: Main interaction happens on a canvas element
- **Drag & Drop**: All entities (interventions, cues, cycles) are draggable
- **Visual Feedback**: Hover states, selection indicators, and smooth transitions
- **Toolbar System**: Context-sensitive toolbars that appear from screen edges
- **Modal-free Design**: Prefer inline editing and slide-in panels over modals

### 2. CSS Grid Layout System
```css
/* Example grid structure */
#main-container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar canvas"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* Component grids */
.toolbar {
  display: grid;
  grid-template-rows: auto 1fr auto; /* header, content, actions */
}
```

### 3. Component Architecture

#### Component Structure
```
src/components/
├── besearch/
│   ├── besearchCycle.vue      # Main canvas and cycle management
│   ├── besearchToolbar.vue    # Unified toolbar for all entities
│   ├── interventionToolbar.vue # Intervention-specific toolbar
│   └── cueToolbar.vue         # Cue-specific toolbar
├── shared/
│   ├── CanvasEntity.vue       # Base component for draggable items
│   └── ToolbarBase.vue        # Base toolbar component
└── modals/
    └── modalBesearch.vue      # Modal wrapper (use sparingly)
```

#### Component Guidelines
1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Down, Events Up**: Follow Vue's data flow patterns
3. **Composition API**: Use `<script setup>` syntax for all new components
4. **TypeScript Ready**: Structure code to be easily convertible to TypeScript

### 4. State Management

#### Store Structure
```javascript
// stores/besearch.js
export const useBesearchStore = defineStore('besearch', {
  state: () => ({
    besearchCycles: [],
    interventions: [],
    cues: [],
    canvas: {
      zoom: 1,
      pan: { x: 0, y: 0 }
    }
  }),
  actions: {
    // CRUD operations
    // Canvas operations
  }
})
```

### 5. Canvas Interaction Patterns

#### Mouse Events
- **Click**: Select entity
- **Double-click**: Open entity toolbar
- **Drag**: Move entity on canvas
- **Right-click**: Context menu (future)
- **Scroll**: Zoom in/out (with Ctrl/Cmd)

#### Keyboard Shortcuts
- **Delete/Backspace**: Remove selected entity
- **Ctrl/Cmd + D**: Duplicate selected entity
- **Ctrl/Cmd + Z**: Undo last action
- **Escape**: Close active toolbar

### 6. Toolbar Design

#### Toolbar Types
1. **Entity Toolbars**: Appear at bottom of screen when entity is selected
2. **Main Toolbar**: Unified toolbar with tabs for different entity types
3. **Context Menus**: Small floating menus for quick actions

#### Toolbar Structure
```vue
<div class="toolbar">
  <div class="toolbar-header">
    <!-- Title and close button -->
  </div>
  <div class="toolbar-content">
    <!-- Scrollable content area -->
  </div>
  <div class="toolbar-actions">
    <!-- Fixed action buttons -->
  </div>
</div>
```

### 7. Color Scheme

```css
:root {
  /* Primary colors */
  --primary-blue: #140d6b;
  --primary-purple: #807ab4;
  
  /* Status colors */
  --status-active: #4caf50;
  --status-inactive: #f44336;
  --status-pending: #ff9800;
  
  /* UI colors */
  --border-color: #e0e0e0;
  --background-light: #f8f9fa;
  --shadow: rgba(0, 0, 0, 0.1);
}
```

### 8. Responsive Design

#### Breakpoints
```css
/* Mobile first approach */
/* Default: Mobile styles */

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

### 9. Performance Considerations

1. **Canvas Rendering**: Use requestAnimationFrame for smooth animations
2. **Virtual Scrolling**: For large lists of entities
3. **Lazy Loading**: Load entity details only when needed
4. **Debouncing**: For search and filter operations

### 10. Future Enhancements

1. **3D Canvas**: Transition to WebGL for 3D visualization
2. **Multiplayer**: Real-time collaboration features
3. **AI Integration**: Smart suggestions and automation
4. **Mobile App**: Native mobile experience
5. **Offline Mode**: PWA capabilities

## Code Style Guide

### Vue Components
```vue
<template>
  <!-- Use semantic HTML -->
  <!-- Keep template logic minimal -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/stores'

// Props
const props = defineProps({
  entityId: String
})

// Emits
const emit = defineEmits(['update', 'delete'])

// State
const localState = ref({})

// Computed
const derivedValue = computed(() => {})

// Methods
const handleAction = () => {}

// Lifecycle
onMounted(() => {})
</script>

<style scoped>
/* Use CSS Grid for layout */
/* Scope styles to component */
/* Use CSS variables for colors */
</style>
```

### Naming Conventions
- **Components**: PascalCase (e.g., `BesearchToolbar.vue`)
- **Props**: camelCase (e.g., `entityId`)
- **Events**: kebab-case (e.g., `@update-entity`)
- **CSS Classes**: kebab-case (e.g., `.toolbar-header`)
- **Store Actions**: camelCase (e.g., `updateCycle()`)

## Testing Strategy

1. **Unit Tests**: For store actions and utilities
2. **Component Tests**: For isolated component behavior
3. **E2E Tests**: For critical user flows
4. **Visual Regression**: For canvas rendering

## Documentation

1. **Component Documentation**: JSDoc comments for props and events
2. **Store Documentation**: Document state shape and actions
3. **User Guide**: Interactive tutorials within the app
4. **API Documentation**: For backend integration

## Deployment

1. **Build Process**: Vite for fast builds
2. **CI/CD**: GitHub Actions for automated testing and deployment
3. **Environments**: Development, staging, and production
4. **Monitoring**: Error tracking and performance monitoring