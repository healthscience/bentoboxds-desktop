describe('Peer List and Invite Management', { testIsolation: false }, () => {
  // Run the setup before each test
  before(() => {
    cy.task("startServer")
    cy.wait(3000)
  })


  it('should handle social network view', () => {

    cy.setupGenesis()
    // Navigate to Sovereign Identity tab to verify session state
    cy.get('#self-auth-connect').click()
    cy.wait(1000)

    // defaults to social network view
    cy.get('#social-network-view').should('exist')

    // Verify social network headers
    cy.get('.peer-details-header').should('be.visible')
    // cy.get('.peer-info').should('have.length', 3) // Name, Live, Public key

    // Verify social graph is present
    cy.get('#social-graph-space').should('exist')
  });

  it('should enter invite via invite tab', () => {
    // Navigate to peers tab
    cy.get('#invite-modes-button').click()
    cy.wait(1000)

    // Switch to invite mode
    cy.get('#peer-mode-prime').find('button').contains('Invite').click()
    cy.get('#invite-types').should('be.visible')

    // Select generate invite mode
    cy.get('#invite-types').find('button').contains('Receive invite').click()
    cy.get('#add-warm-peer').should('be.visible')

    // Enter peer name and generate invite
    const peerName = 'TestPeer-prime'
    cy.get('#peer-name-input').type(peerName)
    // enter a valid hop invite
    const peerInviteaddress = 'hop:905add638b87daefcef12c493e35ac9a8b74169d7a84b9dd34a83f2d3cba035756f86e23755c7317fbe5e17e51fb22c621e86230817a4232670dbc3d1a09f6f2'
    cy.get('#peer-pubkey').type(peerInviteaddress)
    cy.get('#accept-invite-button').click()

  });

  // Run the cleanup after all tests
  after(() => {
    cy.task("stopServer")
  })
})
