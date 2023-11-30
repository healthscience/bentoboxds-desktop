// https://docs.cypress.io/api/introduction/api.html

describe('base layout browser', () => {
  it('visits the app root url', () => {
    cy.viewport(375, 667)
    cy.visit('https://localhost:4173/')
    cy.get('.mobile-nav').find('#menu-button')
    cy.get('#menu-button').click()
    cy.get('.mobile-menu-options').find('.list-nav-mobile').should('have.length', 5)
    // cy.contains(".logo-words", 'BentoBox-DS')
  })

})
