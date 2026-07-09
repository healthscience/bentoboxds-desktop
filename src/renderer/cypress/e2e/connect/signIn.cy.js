describe('main sign in & view beebee', () => {
  // Run the setup before all tests
  before(() => {
    cy.task("startServer")
    cy.wait(3000)
  })

  it('visits the app root url and signs in using conduction identity', () => {

    cy.setupGenesis()
    // Navigate to Sovereign Identity tab to verify session state
    cy.get('#self-auth-connect').click()
    cy.wait(1000)
    cy.get('#sovereign-tab').should('be.visible').click()
    // The test was expecting "Identity Not Found" but if setupGenesis worked, it might be "Active"
    // However, looking at sovereignKeys.vue, keyExists depends on localStorage.
    // genesisGate.vue handleSignClick sends 'hop-auth' message.
    // accountStore.js processReply 'unlocked-verify-complete' sets localStorage.
    cy.get('.status', { timeout: 10000 }).should('contain', 'Status: Active')
    cy.get('.key-card').should('exist')
  })

  // Run the cleanup after all tests
  after(() => {
    cy.task("stopServer")
  })
})
