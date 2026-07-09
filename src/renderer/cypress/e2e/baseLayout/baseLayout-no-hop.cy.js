// need to bring HOP to be


describe('base layout browser - desktop', () => {
  it('visits the app root url', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('#app').find('.bentobox-main-nav').should('be.visible')
    cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible')
    cy.contains(".logo-words", 'BentoBoxDS').should('exist')
  })

  it('HOP connection failed feedback message', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    // The connection-status component appears when connection_error or connection_loss is true
    // We might need to wait for it or trigger it if we can
    cy.get('#app').find('#connection-notify', { timeout: 10000 }).should('be.visible')
    cy.get('#connection-notify').find('#connection-warn').should('be.visible')
    // Note: in the actual code it's v-if="storeWebsocket.connection_loss === true"
    // cy.get('#connection-notify').find('#connection-warn-loss').should('be.visible')
    cy.contains("#connection-warn", 'Thank you for using BentoBoxDS.').should('exist')
  })

  after(() => {
    cy.task("stopServer")
  })

})