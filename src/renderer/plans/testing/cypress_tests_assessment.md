# Cypress E2E Tests Assessment

This document provides an assessment of the existing Cypress E2E tests in `@cypress/e2e`, categorizing them into Keep, Update, Remove, and identifying areas for New tests.

## 1. Keep (Still Relevant)

These tests appear to cover core functionality that is likely still relevant and stable.

*   **`cypress/e2e/connect/signIn.cy.js`**: Basic sign-in flow is fundamental.
*   **`cypress/e2e/baseLayout/baseLayout.cy.js`**: Core layout checks.
*   **`cypress/e2e/baseLayout/mainNav/toolbarNavLayout.cy.js`**: Toolbar navigation checks.
*   **`cypress/e2e/baseLayout/welcomeBeebee/browserWelcome.cy.js`**: Welcome screen checks.
*   **`cypress/e2e/mobile/baseLayout-mobile.cy.js`**: Mobile layout checks.
*   **`cypress/e2e/mobile/toolbarNav-mobile-Layout.cy.js`**: Mobile navigation checks.
*   **`cypress/e2e/mobile/mobile-menu/language-change.cy.js`**: Mobile language change.
*   **`cypress/e2e/bbnexus/bentobox-start-bbnexus.cy.js`**: bbNexus integration from Bentobox.
*   **`cypress/e2e/bbnexus/besearch-start-bbnexus.cy.js`**: bbNexus integration from Besearch.
*   **`cypress/e2e/bbnexus/cuespace-start-bbnexus.cy.js`**: bbNexus integration from Cuespace.
*   **`cypress/e2e/bentoTools/besearch/besearch-modal.cy.js`**: Basic Besearch modal opening.
*   **`cypress/e2e/bentoTools/cues/cues-history-nav.cy.js`**: Cues history navigation.
*   **`cypress/e2e/bentoTools/cues/healthCues.cy.js`**: Health cues functionality.
*   **`cypress/e2e/bentoTools/diary/diary-modal.cy.js`**: Diary modal opening.
*   **`cypress/e2e/bentoTools/flake/flake-model.cy.js`**: Flake modal opening.
*   **`cypress/e2e/bentoTools/graphs/graphs-modal.cy.js`**: Graphs modal opening.
*   **`cypress/e2e/agentTools/body/body-open-menu.cy.js`**: Body menu opening.
*   **`cypress/e2e/agentTools/library/library-open-menu.cy.js`**: Library menu opening.
*   **`cypress/e2e/agentTools/spaces/space-sub-menu.cy.js`**: Spaces sub-menu opening.
*   **`cypress/e2e/library/open-library.cy.js`**: Library opening and basic checks.

## 2. Update (Needs Refactoring or Fixing)

These tests have issues, use outdated selectors, or need to be adapted to recent UI changes (like the Orbit interface).

*   **`cypress/e2e/account/account-tabs.cy.js`**: Needs updating to reflect the current account modal structure and tabs (e.g., Sovereign tab might be outdated).
*   **`cypress/e2e/account/generate-Invite.cy.js`**: Needs updating to match the current peer invite generation flow. The `TODO` for receiving invites needs implementation.
*   **`cypress/e2e/account/peer-connectin.cccy.js`**: The file extension is weird (`.cccy.js`). It uses custom commands `cy.startInstance` and `cy.stopInstance` which might need review or implementation in `cypress.config.js` as noted in the comments.
*   **`cypress/e2e/chat/basicChat.cy.js`**: The `Chat Interface` describe block is commented out. It needs to be reviewed and re-enabled or removed. The selectors might need updating.
*   **`cypress/e2e/chat/chartBuilding.cy.js`**: Needs to ensure the chart building logic matches the current implementation.
*   **`cypress/e2e/chat/contextSwitching.cy.js`**: Needs to verify if context switching (graph, chart, cuespace) is still handled this way.
*   **`cypress/e2e/chat/spaceChatSave.cy.js`**: Needs to ensure the space chat saving logic is correct.
*   **`cypress/e2e/chat/toolCommands.cy.js`**: Needs to verify if `@upload`, `@library`, `@teach` commands are still valid and trigger the correct UI.
*   **`cypress/e2e/agentTools/chat/beebeechat/hello-beebee.cy.js`**: Uses `#beebee-shaper` and `#askinput`. Needs to ensure these are still the correct selectors for the main chat interface.
*   **`cypress/e2e/agentTools/chat/beebeechat/upload-beebee.cy.js`**: Uses `#upload-link`. Needs to ensure this is still the correct selector.
*   **`cypress/e2e/bentobox/bentoboxBase.cy.js`**: Tests expanding the bentobox. Needs to ensure this functionality still exists and uses correct selectors.
*   **`cypress/e2e/besearch/besearch.cy.js`**: Comprehensive Besearch test. Needs to be reviewed against the latest Besearch UI changes.
*   **`cypress/e2e/besearch/besearch-simple.cy.js`**: Uses helpers. Needs to ensure helpers are up-to-date.
*   **`cypress/e2e/besearch/besearch-fixes.cy.js`**: Tests specific bug fixes. Needs to ensure these fixes are still relevant and the tests pass.
*   **`cypress/e2e/teach/teach-session-start.cy.js`**: Mocks Pinia store state. Needs to ensure the store structure (`teachingStore.savedSessions`) is still correct.

## 3. Remove (Obsolete or Empty)

These tests are either empty, redundant, or test features that no longer exist.

*   **`cypress/e2e/account/accept-peer-invite.cy.js`**: This file only contains commented-out pseudocode. It should be removed or implemented.
*   **`cypress/e2e/account/listen-peer-accept.cy.js`**: This file is completely empty (0 chars).
*   **`cypress/e2e/bentobox/chartCsv-large.cy.js`**: Empty file (0 chars).
*   **`cypress/e2e/bentobox/chartCsv-small.cy.js`**: Empty file (0 chars).
*   **`cypress/e2e/bentobox/chartNumbers.cy.js`**: Empty file (0 chars).
*   **`cypress/e2e/baseLayout/baseLayout-no-hop.cy.js`**: Tests behavior when HOP connection fails. If HOP is now integral and always expected, this might be obsolete. Needs review.

## 4. Create New (Missing Coverage)

Based on recent development plans and the current state of the application, new tests are needed for the following areas:

*   **Orbit Interface**: The new Orbit interface (`PrimeInterface.vue`, `OrbitView.vue`, `LeftPanel.vue`, `LifeTools.vue`) needs comprehensive E2E testing. This includes:
    *   Opening and closing the Orbit view.
    *   Navigating between different worlds (Cues, Body, etc.).
    *   Interacting with the HeliClock and HeliStart components.
    *   Testing the drag functionality (referencing `orbit_drag_fix_plan.md`).
*   **Portal Lens**: Testing the new Portal Lens functionality (`portal_lens_plan.md`, `useLensStability.js`).
*   **Swim Emulator**: Testing the Swim Emulator component (`SwimEmulator.vue`).
*   **Besearch Enhancements**: Testing the new Besearch features outlined in the plans (`besearch-controls-component-plan.md`, `besearch-experience-plan.md`, `besearch-feature-plan.md`, `besearch-intervention-schema-plan.md`).
*   **Peer Cases**: Testing the new Peer Case features (`peer-case-average-besearch-autofill-plan.md`, `peer-case-average.md`, `peer-case-dml.md`, `peer-case-intervention.md`).
*   **Bottom Panel**: Testing the new bottom panel implementation (`bottom_panel_implementation.md`).
*   **Full Screen No Scroll**: Testing the full-screen layout constraints (`full_screen_no_scroll_plan.md`).
*   **Genesis Handshake**: Testing the initial connection/handshake process (`genesis_handshake_plan.md`).
*   **Life Strap Chat Rewire**: Testing the updated chat integration (`life_strap_chat_rewire.md`).
