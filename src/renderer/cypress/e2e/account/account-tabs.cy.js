describe('Space meun select and submenu tests', () => {
  // Run the setup before each test
  before(() => {
    cy.task("startServer")
    cy.wait(3000)
  })

    it('visits the app root url and signs in using conduction identity', () => {

    cy.setupGenesis()
    // Navigate to Sovereign Identity tab to verify session state
    cy.get('#self-auth-connect').click()
    cy.wait(1000)
    // Step 4: Verify that the tabs is presented
    cy.get('#connection-account').should('be.visible')
    cy.get('#peers-tab').should('exist')
    cy.get('#datastores-tab').should('exist')
    cy.get('#aiagents-tab').should('exist')
    cy.get('#sovereign-tab').should('exist')
    cy.get("#disconnect-button").should('exist')
    // click on each tab and test the content
    cy.get('#list-content').should('exist')
    // click on 
    cy.get('#datastores-tab').click()
    cy.wait(1000)
    cy.get('#datastore-list').should('exist')
    cy.get('#aiagents-tab').click()
    cy.wait(1000)
    // cy.get('#aiagents-lists').should('exist')
    cy.get('#sovereign-tab').click()
    cy.wait(1000)
    cy.get('#wallet-list').should('exist')
  });

  // Run the cleanup after all tests
  after(() => {
    cy.task("stopServer")
  })

});