describe('bbNexus anchor in Beebee tools', () => {
  beforeEach(() => {
    cy.task('startServer')
    cy.wait(3000)
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('#self-auth-connect').should('exist')
    cy.get('#self-auth-connect').click()
    cy.get('#connect-hop').should('exist')
    cy.get('#self-auth').should('exist')
    cy.get('#self-auth').click()
  })

  it('opens bbNexus from the beebee anchor button', () => {
    cy.get('.bbnexus-anchor').should('exist')
    cy.get('.bbnexus-anchor').click()
    cy.get('.bbnexus-toolbar').should('exist')
    cy.get('.bbnexus-panels').should('be.visible')
    cy.contains('.bbnexus-title', 'Besearch').should('exist')
  })

  after(() => {
    cy.task('stopServer')
  })
})
