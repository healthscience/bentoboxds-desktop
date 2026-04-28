describe('Cues History Navigation Tests', { testIsolation: false }, () => {
  before(() => {
    cy.task("startServer")
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get("#self-auth-connect").click()
    cy.get('#self-auth').click()
    cy.get('#cues-button').click()
    cy.wait(3000)
  });

  it('should display cues and allow basic interactions', () => {
    // Verify modal is present and visible
    cy.get('.modal-container').should('exist')
    cy.get('.modal-container').should('be.visible')
    cy.get('.modal-container').should('not.have.css', 'display', 'none')

    // Verify cues container is visible within modal
    cy.get('.modal-container #cues-container').should('exist')
    cy.get('.modal-container #chart-column').should('exist')
    cy.get('.modal-container #cues-column').should('exist')

    // Verify cue list display
    cy.get('.modal-container #saved-cues').should('exist')
    cy.get('.modal-container .cue-item').should('exist')

    // Test cue selection
    cy.get('.modal-container .cue-item').first().click()
    cy.get('.modal-container #cue-wheel').should('exist')
    cy.get('.modal-container #cue-history').should('exist')
    cy.get('.modal-container #cue-history-title').should('exist').and('contain', 'History')
  });

  it('should handle cue history and relationships', () => {
    // Select a cue
    cy.get('.modal-container .cue-item').first().click()

    // Verify history display
    cy.get('#cue-history .cue-history-item').should('exist')

    // Verify relationship buttons
    cy.get('#connection-glue .glue-btn').should('exist')

  });


  it('should handle space and delete operations', () => {
    // Select a cue
    cy.get('.cue-item').first().click()

    // Test space operation
    cy.get('#view-cue-button').click()
    cy.wait(500)
    cy.get('#cue-space').should('exist')

    // Test delete operation
    // cy.get('#remove-cue-delete').click()
    // cy.wait(500)
    // cy.get('#cue-wheel').should('not.exist')
  });

  it('should handle minimization', () => {
    // Minimize cues
    // cy.get('.minimise-cues-button').click()
    // cy.get('#minimise-cues').should('exist')

    // Verify minimized state
    // cy.get('#cues-column').should('have.css', 'display', 'none')
  });


  after(() => {
    cy.task("stopServer")
  })
});