describe('Chart Building', () => {
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

    // Switch to chart context
    cy.get('.context-selector').select('chart')
  })

  it('should create a chart with text', () => {
    // Step 1: Type a chart command and send it
    cy.get('.chat-input input').type('Create a line chart{enter}')

    // Step 2: Verify the command is displayed
    cy.get('.chat-message').should('contain', 'Create a line chart')

    // Step 3: Verify the chart is displayed
    cy.get('.chart-container').should('be.visible')
    cy.get('.chart-container').should('contain', 'Sales')
  })

  it('should create a chart with bentobox data', () => {
    // Step 1: Type a chart command with bentobox data and send it
    cy.get('.chat-input input').type('Create a bar chart with bentobox data{enter}')

    // Step 2: Verify the command is displayed
    cy.get('.chat-message').should('contain', 'Create a bar chart with bentobox data')

    // Step 3: Verify the chart is displayed with bentobox data
    cy.get('.chart-container').should('be.visible')
    cy.get('.chart-container').should('contain', 'Revenue')
  })

  after(() => {
    // Stop the server after all tests are complete
    cy.task("stopServer")
  })
})