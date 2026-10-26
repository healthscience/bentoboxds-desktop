describe('bbNexus in Besearch modal', { testIsolation: false }, () => {
  before(() => {
    cy.task("startServer");
    // Ensure we have a session or perform genesis[cite: 3]
    cy.setupGenesis()
  })

  it('opens bbNexus from the besearch modal toolbar and verifies all sections and buttons exist', () => {
    // Right Panel (Chat)
    // Initially closed/narrow (width 0 in RightPanel.vue handleToggle)[cite: 3]
    cy.get('.right-panel-container').invoke('width').should('be.lte', 1)
    
    // Open chat via button (thought-bubble-button)[cite: 3]
    cy.get('.thought-bubble-button').click()
    cy.get('.right-panel-container').invoke('width').should('be.gt', 300)
    
    // Open bbnexus, using .first() to safely target the single element when multiple match[cite: 3]
    cy.get('.bbnexus-anchor').first().click()
    cy.get('.bbnexus-toolbar').should('be.visible')

    // Verify Interplay buttons
    cy.contains('.bbnexus-section', 'Interplay').within(() => {
      cy.get('button.bbnexus-btn').contains('Cues').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Library').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Cue Space').should('be.visible')
    })
  })

  it('select the library and check it opens', () => {
    // Verify Interplay buttons
    cy.contains('.bbnexus-section', 'Interplay').within(() => {
      cy.get('button.bbnexus-btn').contains('Cues').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Library').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Cue Space').should('be.visible')
    })

    cy.get('button.bbnexus-btn').contains('Library').click()
    cy.get('.library-container:visible').should('be.visible')
  })

  it('should click on library', () => {
    // 1. Main container and header elements
    cy.get('.library-container:visible').should('be.visible')
    cy.get('.compact-library-header:visible').should('be.visible')
    cy.get('.library-brand:visible').within(() => {
      cy.get('.library-title').should('contain.text', 'Network Library').and('be.visible')
      cy.get('.library-subtitle').should('contain.text', 'Explore & contribute reference contracts').and('be.visible')
    })

    // Step 2: Verify Databox is active and "Library" tab is shown
    cy.get('.modal-mask').should('be.visible')
    cy.get('.button-lib-data').contains('Library').should('have.class', 'active')

    cy.get('.library-toolbar:visible').contains('button.sov-toolbar-btn', '+ Contract').click()

    cy.get('.new-ref-contract').should('be.visible')
  })

  after(() => {
    cy.task('stopServer')
  })
})

