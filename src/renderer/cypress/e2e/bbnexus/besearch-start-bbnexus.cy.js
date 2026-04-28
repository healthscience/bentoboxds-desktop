describe('bbNexus in Besearch modal', () => {
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

  it('opens bbNexus from the besearch modal toolbar', () => {
    cy.get('#besearch-button').click()
    cy.get('.modal-mask').should('be.visible')
    cy.get('.bbnexus-toolbar').should('exist')
    cy.get('.bbnexus-toggle').click()
    cy.get('.bbnexus-panels').should('be.visible')
    cy.contains('.bbnexus-title', 'Besearch').should('exist')
  })

  after(() => {
    cy.task('stopServer')
  })
})
