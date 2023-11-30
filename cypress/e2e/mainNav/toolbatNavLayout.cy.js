// https://docs.cypress.io/api/introduction/api.html

describe('base layout browser', () => {
  it('visits the app root url', () => {
    cy.viewport(1024, 768)
    cy.visit('https://localhost:4173/')
    cy.get('.bentobox-main-nav').find('.bentobox-browser')
    cy.get('.bentobox-browser').find('.bentobox-top').should('have.length', 7)
    // cy.contains(".logo-words", 'BentoBox-DS')
  })

})
