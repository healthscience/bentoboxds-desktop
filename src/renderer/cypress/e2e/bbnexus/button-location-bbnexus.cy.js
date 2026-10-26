describe('bbNexus in Besearch modal', () => {
  beforeEach(() => {
    cy.task("startServer");
    // Ensure we have a session or perform genesis
    cy.setupGenesis()
  })

it('opens bbNexus from the besearch modal toolbar and verifies all sections and buttons exist', () => {
    // Right Panel (Chat)
    // Initially closed/narrow (width 0 in RightPanel.vue handleToggle)
    cy.get('.right-panel-container').invoke('width').should('be.lte', 1)
    
    // Open chat via button (thought-bubble-button)
    cy.get('.thought-bubble-button').click()
    cy.get('.right-panel-container').invoke('width').should('be.gt', 300)
    
    // Open bbnexus, using .first() to safely target the single element when multiple match
    cy.get('.bbnexus-anchor').first().click()
    cy.get('.bbnexus-toolbar').should('be.visible')
    
    // Verify Besearch buttons
    cy.contains('.bbnexus-section', 'Besearch').within(() => {
      cy.get('button.bbnexus-btn').contains('Create').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Start').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Stop').should('be.visible')
    })

    // Verify Emulation Worlds buttons
    cy.contains('.bbnexus-section', 'Emulation Worlds').within(() => {
      cy.get('button.bbnexus-btn').contains('Orbit').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Body').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Earth').should('be.visible')
    })

    // Verify Interplay buttons
    cy.contains('.bbnexus-section', 'Interplay').within(() => {
      cy.get('button.bbnexus-btn').contains('Cues').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Library').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Cue Space').should('be.visible')
    })

    // Verify Story buttons
    cy.contains('.bbnexus-section', 'Story').within(() => {
      cy.get('button.bbnexus-btn').contains('Devices').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Network').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Diary').should('be.visible')
    })

    // Verify Peers buttons
    cy.contains('.bbnexus-section', 'Peers').within(() => {
      cy.get('button.bbnexus-btn').contains('Add').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Share').should('be.visible')
    })
  })

  after(() => {
    cy.task('stopServer')
  })
})
