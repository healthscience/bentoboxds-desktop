# Besearch Controls Component Creation Plan

## Overview
Extract the besearch control buttons (Create/Start/Stop) from `lifeNavtools.vue` into a new reusable component `besearchControls.vue`.

## Current Implementation
The control buttons are currently inline in `lifeNavtools.vue` (lines 28-32):
```vue
<div class="besearch-control-buttons">
  <button @click="besearchTool('create')" class="control-button">Create</button>
  <button @click="besearchTool('start')" class="control-button">Start</button>
  <button @click="besearchTool('stop')" class="control-button">Stop</button>
</div>
```

## Tasks

### Component Creation Tasks

#### 1. Analyze Current Implementation
- Review existing button styling and functionality in `lifeNavtools.vue`
- Understand the `besearchTool` method and its parameters
- Identify any dependencies or state management requirements

#### 2. Design Component Interface
- Define props: none required (buttons are static)
- Define emits: `@create`, `@start`, `@stop` events
- Consider future extensibility (additional buttons, disabled states)

#### 3. Create Component File
- Location: `src/components/besearch/lifetools/besearchControls.vue`
- Follow existing component structure and naming conventions

#### 4. Implement Template
- Three control buttons: Create, Start, Stop
- Proper accessibility attributes (aria-labels)
- Consistent styling with existing design system

#### 5. Add Script Logic
- Emit appropriate events on button clicks
- No internal state management needed
- Keep component simple and focused

#### 6. Style Component
- Match existing `.control-button` styles
- Responsive design for mobile/desktop
- Hover and active states
- Grid layout for button arrangement

#### 7. Update lifeNavtools.vue
- Import the new `BesearchControls` component
- Replace existing button div with component
- Connect emitted events to existing `besearchTool` method
- Remove old button HTML and related styles

#### 8. Clean Up
- Remove unused button-related code from `lifeNavtools.vue`
- Update any related CSS if necessary
- Ensure no breaking changes to parent component

#### 9. Test Integration
- Verify buttons render correctly
- Test click events trigger appropriate actions
- Check responsive behavior
- Ensure no console errors or warnings

### HOP Integration Tasks

#### 10. Implement Save Functionality in besearchStore.js
- Enhance `saveToHOP` method to handle different besearch operations (create/start/stop)
- Form proper HOP message structure for besearch data
- Include besearch cycles, interventions, and canvas state in save payload
- Handle different action types: 'create', 'start', 'stop', 'update'

#### 11. Implement Load Functionality
- Add `loadFromHOP` method to besearchStore.js
- Form HOP query messages to retrieve saved besearch data
- Parse and restore besearch cycles, interventions, and canvas state
- Handle loading on app startup

#### 12. Update Component Integration
- Modify `besearchTool` method in lifeNavtools.vue to call appropriate store methods
- Connect Create/Start/Stop button actions to HOP save operations
- Add loading logic to initialize besearch data when app starts

#### 13. Add Error Handling
- Handle HOP communication failures gracefully
- Provide user feedback for save/load operations
- Implement retry logic for failed operations

#### 14. Update App Initialization
- Modify main app startup to load besearch data from HOP
- Ensure besearch store is initialized with saved data
- Handle cases where no saved data exists (first-time users)

## Benefits
- Improved code organization and separation of concerns
- Reusable component for other parts of the application
- Easier maintenance and testing
- Consistent UI patterns across the besearch system
- Persistent besearch data through HOP integration
- Seamless save/load functionality for user besearch sessions

## Files to Modify
- `src/components/besearch/lifetools/lifeNavtools.vue` (remove buttons, add component, update besearchTool method)
- `src/components/besearch/lifetools/besearchControls.vue` (new file)
- `src/stores/besearchStore.js` (add save/load methods for HOP)
- `src/App.vue` or main initialization file (add besearch loading on startup)

## Dependencies
- Vue 3 Composition API
- Existing CSS classes and design system
- HOP (Health Optimization Protocol) communication system
- Socket connection for HOP messaging