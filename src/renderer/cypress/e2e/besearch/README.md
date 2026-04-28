# Besearch E2E Tests

This directory contains end-to-end tests for the Besearch functionality in BentoBoxDS.

## Test Files

### 1. `besearch.cy.js` - Comprehensive Test Suite
Complete test coverage including:
- Base layout verification
- Mode switching functionality
- Life tools integration
- Peer movement (keyboard and buttons)
- Canvas rendering
- Modal interactions
- Responsive behavior
- Error handling

### 2. `besearch-fixes.cy.js` - Bug Fix Verification
Specific tests for recent fixes:
- Life tools button navigation fix
- Besearch cycles overlay fix
- Integration of both fixes
- Performance testing

### 3. `besearch-simple.cy.js` - Simple Example Tests
Basic tests using helper functions:
- Modal display
- Peer movement
- Mode switching

### 4. `besearch-helpers.js` - Test Utilities
Reusable helper functions and custom Cypress commands.

## Running the Tests

```bash
# Run all besearch tests
npm run cypress:open
# Then select any test file from the besearch folder

# Or run in headless mode
npm run cypress:run -- --spec "cypress/e2e/besearch/*.cy.js"

# Run a specific test file
npm run cypress:run -- --spec "cypress/e2e/besearch/besearch-simple.cy.js"
```

## Test Structure

Each test file follows this pattern:
1. **Setup**: 
   - Start HOP server with `cy.task("startServer")`
   - Set viewport to 1024x768
   - Visit the app
   - Authenticate via self-auth flow
   - Open besearch modal
2. **Test**: Perform actions and assertions
3. **Cleanup**: Stop HOP server with `cy.task("stopServer")` in after() hook

## Key Selectors Used

- Modal: `.besearch-modal`
- Canvas: `#besearch-cycles`
- Besearch button: `#besearch-button`
- Mode buttons: `.mode-buttons button` or by text content
- Life tools button: `.life-tools-button`
- Life tools panel: `.life-tools-panel`
- Directional buttons: By aria-label or arrow symbols
- Authentication: `#self-auth-connect`, `#self-auth`

## Custom Commands

The helper file adds these custom commands:
- `cy.openBesearch()` - Opens the besearch modal
- `cy.openLifeTools()` - Opens the life tools panel
- `cy.switchBesearchMode(mode)` - Switches to specified mode
- `cy.movePeer(direction, method, times)` - Moves peer

## Visual Testing

Some tests take screenshots for visual verification:
- Stored in `cypress/screenshots/`
- Named with timestamps for comparison
- Useful for catching rendering issues

## Tips for Writing New Tests

1. Use the helper functions for common actions
2. Add appropriate waits for animations
3. Use data-cy attributes when possible
4. Test both happy paths and edge cases
5. Include visual screenshots for UI-heavy features

## Known Issues

- Canvas content verification may need adjustment based on actual rendering
- Timing of animations may vary on different machines
- Some selectors may need updating if component structure changes