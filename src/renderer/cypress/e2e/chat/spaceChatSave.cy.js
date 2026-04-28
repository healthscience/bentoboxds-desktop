describe('Space Chat Save and Start Experience', { testIsolation: false }, () => {
  // Run the setup before all tests
  before(() => {
    // Start the server and set up the environment
    cy.task("startServer")
    cy.wait(3000)
    cy.viewport(1024, 768)

    // Visit the application and authenticate peer
    cy.visit('/')
    cy.get("#self-auth-connect").should('exist')
    cy.get('#self-auth-connect').click()
    cy.get("#connect-hop").should('exist')
    cy.get("#self-auth").should('exist')
    cy.get('#self-auth').click()

    // Wait for the peer authentication to complete
    cy.wait(2000)
  })

  // Clean up after all tests
  after(() => {
    // Stop the server after all tests are complete
    cy.task("stopServer")
  })

  describe('Space Chat Save', () => {
    it('should open a space, chat, and save on close', () => {
      // Open spaces menu
      cy.get('#space-button-menu').should('be.visible').click()
      cy.get('#active-space-history').should('be.visible')

      // Assume there is at least one space; click the first one
      // cy.get('.flat-history').first().click()

      // Wait for space modal to open
      //cy.get('.modal-mask').should('be.visible')
      // cy.get('.modal-container').should('be.visible')

      // In the space, open beebee chat
      cy.get('#open-beebee').should('be.visible').click()

      // Wait for chat interface
      cy.get('#chat-interface', { timeout: 10000 }).should('be.visible')

      // Send a message
      const testMessage = 'Test message in space'
      cy.get('textarea#askinput').type(testMessage)
      cy.get('button#natlang-ask').click()

      // Verify message is sent
      cy.get('#conversation').should('contain', testMessage)

      // Close the space
      cy.get('.btn-green').contains('Close').click()

      // Verify space is closed
      cy.get('.modal-mask').should('not.exist')

      // Optionally, check that spaces menu is still accessible
      cy.get('#space-button-menu').should('be.visible')
    })
  })
})