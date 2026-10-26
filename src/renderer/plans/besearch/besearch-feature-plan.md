# Besearch Feature Implementation Plan

## Overview
Besearch is a new scientific method for automated data analysis cycles. It provides a visual canvas interface where users can create, monitor, and manage computational cycles that perform regular data analysis on network experiments.

**Note**: The besearch experience and operational content is a work in progress and discovery process. We will need to innovate with the HOP besearch protocol. Each besearch computation will be subject to evolutionary algorithms to explore variations over time, and each besearch is likely to involve DML (Decentralized Machine Learning). Most of this advanced functionality will be implemented via the HOP besearch protocol.

## Canvas Interaction Design

### Item Movement
- **Drag & Drop**: All besearch items are movable via drag and drop
- **Visual Feedback**: Opacity changes during dragging, cursor changes on hover

### Click Interactions
- **Single Click on Besearch Cycle**: Opens intervention toolbar with cycle summary, results, and actions (including "Open Cue Space")
- **Double Click on Besearch Cycle**: Opens cycle editing toolbar
- **Right Click on Besearch Cycle**: Context menu with quick actions

### Intervention Toolbar
- **Cycle Summary View**: Shows computation results, status, linked interventions from HOP
- **Actions**: Edit, Duplicate, Delete, Open Cue Space
- **Cue Space Navigation**: Direct access to related cue spaces from toolbar

## Current Implementation Status
- ✅ Basic canvas with besearch cycles (animated circles)
- ✅ Peer navigation system with keyboard/mouse controls
- ✅ Life tools menu with game-like interface
- ✅ Intervention toolbar at bottom
- ✅ Basic besearch cycle creation form
- ✅ Canvas state persistence
- ✅ Basic cycle editing and deletion

## Missing Features & Requirements

### 1. Cycle Filtering System
**Current State**: Basic time cycle buttons exist but no filtering logic
**Requirements**:
- Filter besearch cycles by time period (daily, weekly, monthly, custom)
- Visual indicators for active filters
- Filter persistence in canvas state

### 2. Enhanced Data Model
**Current State**: Basic cycle structure with name, position, network experiment type
**Requirements**:
- Computation metadata (data source, computation type, time period)
- Results storage and history
- Status tracking (running, completed, failed)
- Network experiment integration

### 3. Summary Display System
**Current State**: Intervention toolbar exists but no besearch-specific summary
**Requirements**:
- Click besearch cycle to show summary in intervention toolbar
- Display computation results, status, linked interventions
- Real-time updates for running cycles

### 4. Computation Engine
**Current State**: No computation logic implemented
**Requirements**:
- Daily/weekly/monthly average calculations
- Rolling averages and autocorrelation
- Integration with bentobox chart data
- Network experiment data processing

### 5. Advanced Filtering
**Current State**: Basic time period buttons
**Requirements**:
- Custom filter creation
- Multiple filter combinations
- Filter presets and templates

## Implementation Plan

### Phase 0: Critical UX Fixes (IMMEDIATE PRIORITY)
1. **Fix Besearch Interface Initialization**
   - Ensure canvas and life tools work properly on first modal open
   - Remove need for open/close/open cycle to activate functionality
   - Fix canvas context and event listener initialization timing

2. **Fix Life Tools Panel Animation**
   - Correct water drop icon positioning (move to right when panel opens/closes)
   - Add visual state indicator (color change when panel is open)
   - Ensure smooth transitions and proper z-indexing

### Phase 1: Data Loading & Persistence (HIGH PRIORITY)
1. **Remove Mock Data & Implement Proper Loading**
   - Remove hardcoded mock cycles from besearchStore
   - Implement loading of besearch cycles when besearch button is pressed
   - Add loading states and error handling

2. **Implement Cycle Persistence**
   - Ensure created cycles are properly saved to HOP
   - Load existing cycles on bentoboxds startup
   - Add data synchronization between local state and HOP

### Phase 2: Enhanced Data Model & Filtering
1. **Update Besearch Cycle Data Structure**
   - Add computation properties: `dataSource`, `computationType`, `timePeriod`, `results`
   - Add status tracking: `lastRun`, `nextRun`, `status`, `errorMessage`
   - Add network experiment references

2. **Implement Cycle Filtering Logic**
   - Add filter state to besearch store
   - Create filter methods in store
   - Update canvas rendering to respect filters
   - Add filter UI controls to life tools menu

3. **Enhance Life Tools Menu**
   - Add filter controls section
   - Implement filter selection UI
   - Add custom filter creation interface

### Phase 2: Summary Display & Interaction
1. **Implement Cycle Summary Display**
   - Modify intervention toolbar to show besearch summaries
   - Add summary data structure
   - Implement click-to-show functionality

2. **Update Canvas Interaction**
   - Enhance cycle click detection
   - Add summary data preparation
   - Integrate with intervention toolbar

### Phase 3: HOP Integration & Results Display
1. **HOP Besearch Management Integration**
   - Connect to HOP's compute engine for besearch cycles
   - Implement result retrieval from HOP coherence ledger
   - Add status monitoring for running computations

2. **Results Visualization**
   - Display computation results from HOP
   - Show cycle status and progress
   - Update canvas with real-time status indicators

### Phase 4: Advanced Features
1. **Custom Filters**
   - Filter creation interface
   - Filter combination logic
   - Filter persistence

2. **Real-time Updates**
   - Live computation status
   - Result visualization
   - Notification system

## Technical Architecture

### Data Flow
```
Network Experiment Data → Besearch Cycle → Computation Engine → Results → Canvas Display → Summary View
```

### Component Structure
```
besearchCycle.vue (main container)
├── lifeNavtools.vue (left menu)
│   ├── besearchControls.vue (create/start/stop)
│   ├── besearchCreateForm.vue (creation form)
│   └── [filter controls] (new)
├── besearchCanvas (HTML5 canvas)
│   ├── Peer navigation
│   ├── Cycle rendering
│   ├── Intervention rendering
│   └── [filtering logic] (new)
└── interventionToolbar.vue (bottom toolbar)
    └── [besearch summary view] (enhanced)
```

### Store Structure
```javascript
besearchStore: {
  besearchCyles: [
    {
      id: 'cycle-1',
      name: 'Daily Heart Rate Average',
      dataSource: 'bentobox-chart-123',
      computationType: 'daily-average',
      timePeriod: 'daily',
      results: [...],
      status: 'running',
      lastRun: '2024-01-13T10:00:00Z',
      nextRun: '2024-01-14T10:00:00Z',
      linkedInterventions: ['intervention-1']
    }
  ],
  filters: {
    timePeriod: 'all',
    status: 'all',
    customFilters: [...]
  },
  canvasState: { ... }
}
```

## Implementation Priority

1. **High Priority**
   - Data loading & persistence (remove mock data, load from HOP)
   - Cycle filtering system
   - Enhanced data model
   - Summary display on click

2. **Medium Priority**
   - HOP integration for results/status display
   - Custom filters
   - Real-time status updates

3. **Low Priority**
   - Advanced filtering features
   - Filter presets
   - Performance optimizations

## Success Criteria

- Users can create besearch cycles with different time periods
- Cycles can be filtered by time period on the canvas
- Clicking a cycle shows relevant summary information including HOP computation results
- System integrates with HOP's compute engine and coherence ledger
- Canvas displays real-time status of besearch cycles from HOP
- System integrates with existing network experiment workflow

## Testing Strategy

1. **Unit Tests**: Computation functions, filter logic
2. **Integration Tests**: Canvas filtering, data flow
3. **E2E Tests**: Full besearch cycle creation and monitoring
4. **Performance Tests**: Large numbers of cycles, real-time updates

## Dependencies

- Existing bentobox data structures
- Network experiment system
- Canvas rendering system
- Store persistence system