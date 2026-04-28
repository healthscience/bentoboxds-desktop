describe('Tool Commands', () => {
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

  it('should execute upload tool command', () => {
    // Step 1: Type an upload command and send it
    cy.get('.chat-input input').type('@upload{enter}')

    // Step 2: Verify the command is displayed
    cy.get('.chat-message').should('contain', '@upload')

    // Step 3: Verify the upload interface is displayed
    cy.get('.upload-interface').should('be.visible')
  })

  it('should execute library tool command', () => {
    // Step 1: Type a library command and send it
    cy.get('.chat-input input').type('@library{enter}')

    // Step 2: Verify the command is displayed
    cy.get('.chat-message').should('contain', '@library')

    // Step 3: Verify the library interface is displayed
    cy.get('.library-interface').should('be.visible')
  })

  it('should execute teaching tool command', () => {
    // Step 1: Type a teaching command and send it
    cy.get('.chat-input input').type('@teach{enter}')

    // Step 2: Verify the command is displayed
    cy.get('.chat-message').should('contain', '@teach')

    // Step 3: Verify the teaching interface is displayed
    cy.get('.teaching-interface').should('be.visible')
  })

  after(() => {
    // Stop the server after all tests are complete
    cy.task("stopServer")
  })
})