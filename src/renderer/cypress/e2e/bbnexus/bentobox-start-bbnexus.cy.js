describe('bbNexus in Bentobox toolbar', () => {
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

  it('opens bbNexus from the bentobox tools bar', () => {
    cy.wait(2000)
    cy.get('#beebee-shaper').should('exist')
    cy.get('#askinput').type('chart 1 2 3')
    cy.get('#natlang-ask').click()
    cy.wait(2000)
    cy.get('#beebee-chartspace').should('exist')
    cy.get('#bb-toolbar').within(() => {
      cy.get('.bbnexus-toggle').click()
    })
    cy.get('.bbnexus-panels').should('be.visible')
    cy.contains('.bbnexus-title', 'Besearch').should('exist')
  })

  after(() => {
    cy.task('stopServer')
  })
})
