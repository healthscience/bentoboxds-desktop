describe('Context Switching', () => {
  // Run the setup before each test
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

    // Open the chat interface
    cy.get('#chat-button').should('be.visible').click()
    cy.wait(1000)
  })

  it('should switch between different contexts', () => {
    // Step 1: Verify the initial context
    cy.get('.chat-header').should('contain', 'Initial Cue Space')

    // Step 2: Switch to graph context
    cy.get('.context-selector').select('graph')
    cy.get('.chat-header').should('contain', 'Graph Context')

    // Step 3: Switch to chart context
    cy.get('.context-selector').select('chart')
    cy.get('.chat-header').should('contain', 'Chart Context')

    // Step 4: Switch back to cuespace context
    cy.get('.context-selector').select('cuespace')
    cy.get('.chat-header').should('contain', 'Initial Cue Space')
  })

  it('should restore previous conversations', () => {
    // Step 1: Type a message in the initial context
    cy.get('.chat-input input').type('Initial message{enter}')

    // Step 2: Switch to graph context
    cy.get('.context-selector').select('graph')

    // Step 3: Switch back to cuespace context
    cy.get('.context-selector').select('cuespace')

    // Step 4: Verify the previous message is restored
    cy.get('.chat-message').should('contain', 'Initial message')
  })

  after(() => {
    // Stop the server after all tests are complete
    cy.task("stopServer")
  })
})