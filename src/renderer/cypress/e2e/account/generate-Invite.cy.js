describe('Peer List and Invite Management', { testIsolation: false }, () => {
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
    cy.wait(3000)
  });

  it('should handle social network view', () => {
    // need to click on the account main menu
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

  it('should handle invite generation', () => {
    // Navigate to peers tab
    cy.get('#invite-modes-button').click()
    cy.wait(1000)

    // Switch to invite mode
    cy.get('#peer-mode-prime').find('button').contains('Invite').click()
    cy.get('#invite-types').should('be.visible')

    // Select generate invite mode
    cy.get('#invite-types').find('button').contains('Generate invite').click()
    cy.get('#invite-peer-codename').should('be.visible')

    // Enter peer name and generate invite
    const peerName = 'TestPeer'
    cy.get('#peer-name').type(peerName)
    cy.get('#invite-generation-button').click()

    // Verify invite is generated
    cy.get('#form-invite-code').should('be.visible')
    cy.get('.peer-g').should('have.length.greaterThan', 0)

    // Verify peer details
    // cy.get('.peer-info').first().should('contain', peerName)
    // cy.get('.peer-pk').should('be.visible')

    // Verify copy functionality
    cy.get('#button-copy-invite').click()
    cy.get('.copied-message').should('be.visible')

    // Verify remove functionality
    // cy.get('.peer-action button').contains('remove').click()
  });

  it('should handle receive invite mode', () => {
    // Navigate to peers tab
    cy.get('#peers-tab').click()
    cy.wait(1000)

    // Switch to invite mode
    cy.get('#peer-mode-prime').find('button').contains('Invite').click()
    cy.get('#invite-types').should('be.visible')

    // Select receive invite mode
    cy.get('#invite-types').find('button').contains('Receive invite').click()
    cy.get('button').contains('Receive invite').should('have.class', 'active')

    // TODO: Add tests for receiving invite functionality once implemented
  });

  after(() => {
    cy.task("stopServer")
  })
});