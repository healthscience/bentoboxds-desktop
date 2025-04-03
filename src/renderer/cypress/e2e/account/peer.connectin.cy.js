describe('Peer Connection Test', () => {
  const peerName = 'TestPeer'
  const inviteFile = 'cypress/fixtures/peer-invite.json'

  before(() => {
    // Start first instance
    cy.startInstance('peer1').then(url => {
      cy.visit(url)
      // Login to first instance
    })
  })

  it('should generate invite and connect peers', () => {
    // Generate invite in first instance
    cy.get('#peers-tab').click()
    cy.wait(1000)
    cy.get('input[placeholder="name"]').type(peerName)
    cy.get('#invite-generation-button').click()
    cy.wait(1000)

    // Save invite code
    cy.get('.gen-crypt-code.name-as-code').invoke('text').then((inviteCode) => {
      cy.writeFile(inviteFile, {
        inviteCode,
        peerName
      })
    })

    // Start second instance
    cy.startInstance('peer2').then(url => {
      cy.visit(url)
      // Login to second instance
    })

    // Accept invite in second instance
    cy.readFile(inviteFile).then((inviteData) => {
      cy.get('#peers-tab').click()
      cy.get('#add-warm-peer input[placeholder="name"]').type(inviteData.peerName)
      cy.get('#add-warm-peer input[placeholder="public key"]').type(inviteData.inviteCode)
      cy.get('#add-warm-peer .btn').click()
      cy.wait(2000)
    })

    // Verify connection in both instances
    cy.get('#peers-tab').click()
    cy.get('.peer-info').contains('true').should('exist') // Verify live connection

    // Switch back to first instance
    cy.startInstance('peer1').then(url => {
      cy.visit(url)
      cy.get('#peers-tab').click()
      cy.get('.peer-info').contains('true').should('exist') // Verify live connection
    })
  })

  after(() => {
    // Stop both instances
    cy.stopInstance('peer1')
    cy.stopInstance('peer2')
  })
})

/* will need to update cypress config and make live commands need to review

    setupNodeEvents(on, config) {
      on('task', {
        startServer({ instance }) {
          // Start server with different port for each instance
          const port = instance === 'peer1' ? 3001 : 3002
          // Your server start logic here
          return port
        },
        stopServer({ instance }) {
          // Stop server for specific instance
        }
      })
    }

    */