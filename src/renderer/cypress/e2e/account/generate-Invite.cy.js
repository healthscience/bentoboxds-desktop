describe('Generate invite', () => {
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

  it('generate an invite', () => {
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
    // generate an invite
    cy.get('#peers-tab').click()
    cy.wait(1000)
    // Enter peer name and generate invite
    const peerName = 'TestPeer'
    cy.get('input[placeholder="name"]').type(peerName)
    cy.get('#invite-generation-button').click()

    // Verify invite is generated
    cy.get('#form-invite-code').should('be.visible')
    cy.get('.gen-crypt-code').should('have.length.greaterThan', 0)

    // Verify peer name is displayed
    cy.get('.gen-crypt-code').first().should('contain', peerName)

    // Verify public key is displayed
    cy.get('#pubkey-session-live').should('be.visible')

    // Verify copy button functionality
    cy.get('#button-copy-invite').click()
    cy.get('.copied-message').should('be.visible')

    // Verify remove button functionality
    cy.get('#button-remove-invite').click()
    // cy.get('#form-invite-code').should('not.exist')
  });

  after(() => {
    cy.task("stopServer")
  })

});