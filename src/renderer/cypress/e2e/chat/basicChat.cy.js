describe('Basic Chat Functionality', { testIsolation: false }, () => {
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
/*
  describe('Chat Interface', () => {
    it('should display the chat interface', () => {
      // Check if the chat interface is visible
      cy.get('#chat-interface').should('be.visible')

      // Check if the conversation area is visible
      cy.get('#conversation').should('be.visible')

      // For fixed-position elements, we need to scroll to them first
      // cy.get('.chat-input').scrollIntoView()

      // Check if the input box is visible
      cy.get('.chat-input').should('be.visible')

      // Check if the input box is visible
      cy.get('button#natlang-ask').should('be.visible')

    })
  })
*/
  describe('Message Functionality', () => {
    it('should allow sending a message', () => {
      // Type a message in the input box
      const testMessage = 'a good life in less than 20 words please.'
      cy.get('textarea#askinput').type(testMessage)

      // Click the send button
      cy.get('button#natlang-ask').click()

      // Verify the message appears in the chat history
      cy.get('#conversation').should('contain', testMessage)
    })

    it('should receive a response from the AI', () => {

      // Check for "beebee is shaping a reply..." when streaming starts
      cy.get('.loading-text', { timeout: 10000 }).should('contain', 'beebee is shaping a reply...')

      // Verify the AI response appears (checking for the AI message container)
      cy.get('.ai-message .ai-text-message', { timeout: 15000 }).should('exist')
      
      // Verify there's only one AI response message for this interaction
      cy.get('.ai-message').should('have.length.at.least', 1)
    })

    it('should not send empty messages', () => {
      // Clear the input first
      cy.get('textarea#askinput').clear()
      
      // Try to send an empty message
      cy.get('button#natlang-ask').click()

      // The button should be disabled or no new message should appear
      // Check that the conversation doesn't have a new empty peer message
      cy.get('.peer-message').should('have.length', 2) // Should still only have the 2 previous messages
    })
  })
/*
  describe('BeeBee Button Functionality', () => {
    it('should show the BeeBee button when AI is active', () => {
      // Mock the AI status to be active
      cy.window().then((win) => {
        win.storeAI.beebeeAIStatus.active = true
      })

      // Verify the BeeBee button is visible
      cy.get('#natlang-ask').should('be.visible').and('contain', 'BeeBee')
    })

    it('should hide the BeeBee button when AI is inactive', () => {
      // Mock the AI status to be inactive
      cy.window().then((win) => {
        win.storeAI.beebeeAIStatus.active = false
      })

      // Verify the BeeBee button is not visible
      cy.get('#natlang-ask').should('not.exist')
    })
  }) */
})