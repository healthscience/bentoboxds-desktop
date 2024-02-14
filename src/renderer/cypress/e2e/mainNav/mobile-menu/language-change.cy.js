// https://docs.cypress.io/api/introduction/api.html

describe('mobile language change', () => {
  it('change from english to spannish', () => {
    cy.viewport(375, 667)
    cy.visit('/')
    cy.get('#menu-button').click()
    cy.get('.menu-holder .mobile-menu-options:nth-child(3) .list-nav-mobile button.mobile-menu-button').click()
    cy.get('#language-mobile').find('a')
  })

})