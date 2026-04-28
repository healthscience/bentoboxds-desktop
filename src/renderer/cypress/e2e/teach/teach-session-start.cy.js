describe('Display Saved Teach Sessions on App Start', { testIsolation: false }, () => {
  // Run the setup before all tests
  before(() => {
    // Start the server and set up the environment
    cy.task("startServer")
    cy.wait(3000)
    cy.viewport(1024, 768)

    // Visit the application and authenticate
    cy.visit('/')
    cy.get("#self-auth-connect").should('exist')
    cy.get('#self-auth-connect').click()
    cy.get("#connect-hop").should('exist')
    cy.get("#self-auth").should('exist')
    cy.get('#self-auth').click()

    // Wait for the authentication to complete
    cy.wait(2000)
    // Wait for the chat interface to be visible
    cy.get('#chat-interface', { timeout: 10000 }).should('be.visible')
  })

  // Clean up after all tests
  after(() => {
    // Stop the server after all tests are complete
    cy.task("stopServer")
  })

  it('should display saved teaching sessions when data exists', () => {
    // Mock saved teach history data in the store
    cy.window().then((win) => {
      const mockSession = {
        id: '12345',
        query: 'How to create a chart?',
        actions: [
          {
            component: 'chart',
            method: 'create',
            args: { type: 'bar' },
            timestamp: Date.now(),
            order: 0
          }
        ],
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        completed: true
      }

      // Access the Pinia stores
      const teachingStore = win.$pinia._s.get('teaching')
      const aiStore = win.$pinia._s.get('aiInterface')

      if (teachingStore) {
        teachingStore.teachHistory = [mockSession]
        teachingStore.teachHistoryStatus = true
      }

      if (aiStore) {
        aiStore.dataBoxStatus = true
      }
    })

    // Verify that the data box modal is visible
    cy.get('.modal').should('be.visible')

    // Verify that the teach view is displayed
    cy.contains('AI Teaching Interface').should('be.visible')

    // Verify that saved sessions section is shown
    cy.contains('Saved Teaching Sessions').should('be.visible')

    // Verify that the mock session is displayed
    cy.get('.session-item').should('have.length', 1)
    cy.contains('12345').should('be.visible')
    cy.contains('1 actions').should('be.visible')
  })

  it('should not display teach view when no saved sessions exist', () => {
    // Ensure no data is set
    cy.window().then((win) => {
      const teachingStore = win.$pinia._s.get('teaching')
      const aiStore = win.$pinia._s.get('aiInterface')

      if (teachingStore) {
        teachingStore.teachHistory = []
        teachingStore.teachHistoryStatus = false
      }

      if (aiStore) {
        aiStore.dataBoxStatus = false
      }
    })

    // Verify that the data box modal is not visible
    cy.get('.modal').should('not.exist')

    // Verify that teach view is not displayed
    cy.contains('AI Teaching Interface').should('not.be.visible')
  })
})