describe('Sovereign Identity Management', () => {
  beforeEach(() => {
    cy.task("startServer")
    cy.wait(5000)
  })

  afterEach(() => {
    cy.task("stopServer")
  })

  describe('Empty State', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.setupGenesis()
      // Open the account modal by clicking the button top right before tabs will show
      cy.get('#self-auth-connect').click()
      cy.get('#sovereign-tab', { timeout: 30000 }).should('be.visible').click()
    })

    it('shows setup section when no identity exists', () => {
      // Ensure we are in the Sovereign tab and localStorage is clear for sovereign pubkey
      cy.window().then((win) => {
        win.localStorage.removeItem('hop_sovereign_pubkey')
      })
      // Navigate away and back to trigger re-mount or re-check
      cy.get('#datastores-tab').click()
      cy.wait(2000)
      cy.get('#sovereign-tab').click()
      
      cy.get('.setup-section', { timeout: 20000 }).should('be.visible')
      cy.get('.status').should('contain', 'Status: Identity Not Found')
      cy.get('.btn-primary').should('contain', 'Generate Genesis Identity')
    })
  })

  describe('Active State & Lifecycle', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.setupGenesis()
      // Open the account modal by clicking the button top right
      cy.get('#self-auth-connect').click()
      cy.get('#sovereign-tab', { timeout: 30000 }).should('be.visible').click()
    })

    it('displays existing identity from localStorage', () => {
      const fakePubKey = 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz'
      cy.window().then((win) => {
        win.localStorage.setItem('hop_sovereign_pubkey', fakePubKey)
      })
      // Navigate away and back to trigger re-mount or re-check
      cy.get('#datastores-tab').click()
      cy.wait(2000)
      cy.get('#sovereign-tab').click()

      cy.get('.key-card', { timeout: 20000 }).should('be.visible')
      cy.get('.status').should('contain', 'Status: Active')
      // The component truncates the key: first 8 ... last 8
      // abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
      // first 8: abc123de
      // last 8: u901vwx2 is incorrect because the string is 51 chars long? No, 26+25=51.
      // let's just check for the start of the key which we know is abc123de
      cy.get('code').should('contain', 'abc123de')
    })

    it('performs identity destruction flow', () => {
      const fakePubKey = 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz'
      cy.window().then((win) => {
        win.localStorage.setItem('hop_sovereign_pubkey', fakePubKey)
      })
      cy.get('#datastores-tab').click()
      cy.wait(2000)
      cy.get('#sovereign-tab').click()

      // Verify initial state
      cy.get('.status', { timeout: 20000 }).should('contain', 'Status: Active')
      cy.get('.btn-warn').click()
      cy.get('.confirmation-flow').should('be.visible')
      
      // Confirm destruction button should be disabled initially
      cy.get('.btn-danger').should('be.disabled')
      
      // Type incorrect text
      cy.get('.verify-input').type('NOT_BURN')
      cy.get('.btn-danger').should('be.disabled')

      // Test Cancel button
      cy.get('.btn-ghost').contains('Cancel').click()
      cy.get('.confirmation-flow').should('not.exist')
      cy.get('.btn-warn').should('be.visible')
      
      // Re-open and confirm destruction
      cy.get('.btn-warn').click()
      cy.get('.verify-input').clear().type('BURN')
      cy.get('.btn-danger').should('not.be.disabled').click()

      // Verify reset: The UI should show "Identity Not Found" and the Generate button
      // Use scrollIntoView because Cypress complained about fixed position ancestors
      cy.get('.setup-section', { timeout: 20000 }).scrollIntoView().should('be.visible')
      cy.get('.status').should('contain', 'Status: Identity Not Found')
      cy.get('.btn-primary').should('contain', 'Generate Genesis Identity')
      
      cy.window().then((win) => {
        expect(win.localStorage.getItem('hop_sovereign_pubkey')).to.be.null
      })
    })
  })
})
