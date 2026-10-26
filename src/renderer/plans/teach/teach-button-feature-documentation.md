# @Teach Button Feature Documentation

## Overview
The @teach button in `inputBox.vue` enables a teaching mode that allows peers to record and analyze their interactions with various bentobox tools. This feature captures peer actions, validates them, and saves teaching sessions to the HOP (Hop Protocol) system for later analysis and learning.

## Core Components

### 1. Input Box Component (`src/components/beebeehelp/inputBox.vue`)
- **@teach Button**: Located in the input box interface
- **Functionality**: Toggles teaching mode via `toolAgent('teaching')`
- **Visual Indicator**: Button state reflects current teaching mode status

### 2. Teaching Store (`src/stores/teachingStore.js`)
**State Management:**
- `isTeachingMode`: Boolean flag indicating if teaching is active
- `currentSession`: Object containing session data including actions array
- `sessions`: Array of completed teaching sessions

**Key Methods:**
- `toggleTeachingMode()`: Switches teaching mode on/off
- `logAction(component, method, args, result)`: Records peer actions during teaching
- `completeSession()`: Finalizes current session and saves to HOP
- `startNewSession()`: Initializes a new teaching session

### 3. Teaching Utility (`src/stores/hopUtility/teachingUtility.js`)
**Validation Functions:**
- `validateAction(action)`: Validates logged actions for completeness
- `analyzeSession(session)`: Performs analysis on completed sessions
- `generateInsights(session)`: Creates insights from session data

**Analysis Features:**
- Action sequence validation
- Performance metrics calculation
- Learning pattern identification

## Action Logging Mechanism

### Logged Components
Teaching mode captures actions from multiple bentobox tools:

1. **Calendar Tools** (`calendarTools.vue`)
   - Date selections
   - Event creations
   - Calendar navigation

2. **Open Data Tools** (`opendataTools.vue`)
   - Data imports
   - Dataset manipulations
   - Visualization changes

3. **Visualization Toolbar** (`vistoolBar.vue`)
   - Chart type changes
   - Filter applications
   - View modifications

4. **Box Tools** (`boxTools.vue`)
   - Tool selections
   - Configuration changes
   - Data operations

### Action Structure
Each logged action contains:
```javascript
{
  component: "calendarTools",
  method: "selectDate",
  args: { date: "2024-01-15" },
  result: { success: true },
  timestamp: 1642156800000
}
```

## Workflow

### 1. Activation
1. Peer clicks @teach button in input box
2. `toolAgent('teaching')` called
3. Teaching store toggles `isTeachingMode`
4. UI updates to reflect teaching state

### 2. Action Recording
1. Peer interacts with bentobox tools
2. Each component checks `storeTeaching.isTeachingMode`
3. If active, calls `storeTeaching.logAction()` with action details
4. Actions appended to `currentSession.actions[]`

### 3. Session Completion
1. Peer completes workflow or clicks complete
2. `completeSession()` validates and analyzes actions
3. Session data sent to HOP via `teachingUtility`
4. Session archived in `sessions[]` array

### 4. Analysis & Insights
1. `teachingUtility.analyzeSession()` processes action sequence
2. Performance metrics calculated
3. Learning patterns identified
4. Insights generated for user feedback

## Integration Points

### HOP Protocol
- Sessions saved to decentralized storage
- Enables cross-device learning continuity
- Supports collaborative teaching scenarios

### Chat Interface
- Teaching mode can be activated via chat commands
- Session data accessible through chat queries
- Real-time feedback during teaching sessions

### Bentobox Ecosystem
- All major tools support action logging
- Consistent logging interface across components
- Extensible for new tool integrations

## Technical Implementation Details

### State Persistence
- Teaching sessions persist across browser sessions
- Local storage backup for offline functionality
- Synchronization with HOP for multi-device access

### Performance Considerations
- Action logging is lightweight and non-blocking
- Batch processing for session completion
- Memory management for large action sequences

### Error Handling
- Graceful degradation if HOP unavailable
- Action validation prevents corrupted sessions
- User feedback for logging failures

## Future Enhancements

### Planned Features
- Real-time collaborative teaching
- Advanced analytics dashboard
- Machine learning integration for personalized insights
- Export capabilities for session data

### Extension Points
- Plugin architecture for custom tools
- Third-party integration APIs
- Advanced visualization of learning patterns

## Usage Guidelines

### For Users
1. Click @tech button to start recording
2. Perform normal workflow interactions
3. Complete session when finished
4. Review insights and analytics

### For Developers
1. Implement `logAction()` calls in new components
2. Follow established action structure
3. Test logging in teaching mode
4. Validate actions through `teachingUtility`

This feature provides a comprehensive framework for capturing, analyzing, and learning from user interactions within the bentobox ecosystem.