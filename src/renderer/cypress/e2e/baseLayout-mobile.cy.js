// https://docs.cypress.io/api/introduction/api.html

describe('base layout mobile', () => {
  it('visits the mobile app url', () => {
    cy.viewport(600, 300)
    cy.visit('/')
    cy.get('#app').find('.bentobox-main-nav')
    cy.get('.bentobox-main-nav').find('#mobile-menu-live')
  })
})