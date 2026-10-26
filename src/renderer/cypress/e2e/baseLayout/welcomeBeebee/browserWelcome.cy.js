// https://docs.cypress.io/api/introduction/api.html

describe('Welcome toolbar', () => {
  it('visits the welcoming page', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.contains(".logo-words", 'BentoBoxDS')
  })

  it('visits the welcoming page', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('.beebee-welcome').find('#message-question')
    cy.get('#bb-features').find('.message-bb').should('have.length', 3)
    // biopoiesis practice
    let biopAttune = 'Attune health by practicing biopoiesis'
    cy.contains('#message-question', biopAttune)
  })

  after(() => {
    cy.task("stopServer")
  })

})
