// https://docs.cypress.io/api/introduction/api.html

describe('base layout browser', () => {
  it('visits the app root url', () => {
    cy.viewport(1024, 768)
    cy.visit('https://localhost:4173/')
    cy.get('#app').find('.bentobox-main-nav')
    cy.get('.bentobox-main-nav').find('.bentobox-browser')
    // cy.contains(".logo-words", 'BentoBox-DS')
  })

  it('beebee input box', () => {
    cy.viewport(1024, 768)
    cy.visit('https://localhost:4173/')
    cy.get('.beebee-home').find('#ai-interaction')
    cy.get('#ai-interaction').find('#ask-ai-form')
    // cy.contains("#askinput", 'What would you like to chart?')
    cy.get("input[placeholder=\"What would you like to chart?\"]")
  })
})
