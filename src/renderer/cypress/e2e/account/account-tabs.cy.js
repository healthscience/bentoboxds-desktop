describe('Space meun select and submenu tests', () => {
  // Run the setup before each test
  before(() => {
    cy.task("startServer")
    cy.wait(3000)
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get("#self-auth-connect").should('exist')
    cy.get('#self-auth-connect').click()
    cy.get("#connect-hop").should('exist')
    cy.get("#self-auth").should('exist')
    cy.get('#self-auth').click()
  });

  it('make sure tabs and can swtich between', () => {
    // Step 1: Verify the base layout
    cy.get('#app').find('.bentobox-main-nav').should('be.visible')
    cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible')
    // Step 2: Click on the Cues button
    cy.get('#self-auth-connect').should('be.visible').click()
    cy.wait(1000)
    // Sept 3 account model present
    cy.get('.modal-mask').should('be.visible')
    cy.get('.modal-container').should('be.visible')
    // Step 4: Verify that the tabs is presented
    cy.get('#connection-account').should('be.visible')
    cy.get('#peers-tab').should('exist')
    cy.get('#datastores-tab').should('exist')
    cy.get('#aiagents-tab').should('exist')
    cy.get('#wallets-tab').should('exist')
    cy.get("#disconnect-button").should('exist')
    // click on each tab and test the content
    cy.get('#list-content').should('exist')
    // click on 
    cy.get('#datastores-tab').click()
    cy.wait(1000)
    cy.get('#datastore-list').should('exist')
    cy.get('#aiagents-tab').click()
    cy.wait(1000)
    cy.get('#aiagents-lists').should('exist')
    cy.get('#wallets-tab').click()
    cy.wait(1000)
    cy.get('#wallet-list').should('exist')
  });

  after(() => {
    cy.task("stopServer")
  })

});