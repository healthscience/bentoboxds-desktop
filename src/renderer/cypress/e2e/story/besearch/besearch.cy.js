describe('bbNexus in Besearch modal', { testIsolation: false }, () => {
  before(() => {
    cy.task("startServer");
    // Ensure we have a session or perform genesis
    cy.setupGenesis()
  })

  it('opens story left panel and check sections', () => {
    // Left Panel (story)
    

  })

  after(() => {
    cy.task('stopServer')
  })
})
