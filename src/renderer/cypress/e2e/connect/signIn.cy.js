describe('main sign in & view beebee', () => {
  // Run the setup before all tests
  before(() => {
    cy.task("startServer")
    cy.wait(3000)
  })

  it('visits the app root url and signs in', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get("#self-auth-connect").should('exist')
    cy.get('#self-auth-connect').click()
    cy.get("#connect-hop").should('exist')
    cy.get("#self-auth").should('exist')
    cy.get('#self-auth').click()
    cy.get('#beebee-shaper').should('exist')
  })

})