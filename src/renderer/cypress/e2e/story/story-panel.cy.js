describe('bbNexus in Besearch modal', { testIsolation: false }, () => {
  before(() => {
    cy.task("startServer");
    // Ensure we have a session or perform genesis
    cy.setupGenesis()
  })

  it('opens story left panel and check sections', () => {
    // Left Panel (story)
    cy.get('#life-tools-panel').should('have.css', 'width', '30px')
    
    // Click the toggle button (tear)
    cy.get('.toggle-life-tools-button').click()
    // It should expand to 302px (300px width + 2px border)
    // Note: CSS uses 1px border-right, so it might be 301px or 302px depending on box-sizing
    cy.get('#life-tools-panel').should('have.css', 'width').and('match', /30[12]px/)
    
    // Click again to close
    cy.get('.toggle-life-tools-button').click()
    cy.get('#life-tools-panel').should('have.css', 'width', '30px')

  })

  after(() => {
    cy.task('stopServer')
  })
})
