// need to bring HOP to be


describe('base layout browser - desktop', () => {
  it('visits the app root url', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('#app').find('.bentobox-main-nav').should('be.visible')
    cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible')
    cy.contains(".logo-words", 'BentoBox-DS').should('exist')
  })

  it('HOP connection failed feedback message', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('#app').find('#connection-notify').should('be.visible')
    cy.get('#connection-notify').find('#connection-warn').should('be.visible')
    cy.get('#connection-notify').find('#connection-warn-loss').should('be.visible')
    cy.contains("#connection-warn-loss", 'Feedback is appreciated.').should('exist')
  })

  after(() => {
    cy.task("stopServer")
  })

})