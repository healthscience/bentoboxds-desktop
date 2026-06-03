describe('main sign in & view beebee', () => {
  // Run the setup before all tests
  before(() => {
    cy.task("startServer")
    cy.wait(3000)
  })

  it('visits the app root url and signs in using conduction identity', () => {

    cy.login()
    // Navigate to Sovereign Identity tab to verify session state
    cy.get('#self-auth-connect').click()
    cy.wait(3000)
    cy.get('#sovereign-tab').should('be.visible').click()
    cy.get('.status', { timeout: 10000 }).should('contain', 'Status: Active')
    cy.get('.key-card').should('exist')
    // cy.get('code').should('contain', 'abc123de...u901vwx2')
  })

  // Run the cleanup after all tests
  after(() => {
    cy.task("stopServer")
  })
})
