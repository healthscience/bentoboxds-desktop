describe('base layout browser - desktop', () => {
  // Run the setup before all tests
  beforeEach(() => {
    // const hop = spawn('npm', ['run', 'start'], { stdio: 'inherit', cwd: baseHOPStepsUp });
    cy.task("startServer");
    cy.viewport(1024, 768)
    cy.visit('/')
  })

  it('visits the app root url', () => {
    cy.get('#app').find('.bentobox-main-nav').should('be.visible')
    cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible')
    cy.contains(".logo-words", 'BentoBox-DS').should('exist')
  })

  it('mission image and text', () => {
    cy.get('#app').find('#space-shaper').should('be.visible')
    cy.get('.beebee-home').find('#mission-statement').should('be.visible')
    cy.contains("#mission-statement", 'Sovereign Intelligences shape health').should('exist')
  })

  it('no HOP connection feedback message', () => {
    cy.get('#connection-warn').should('not.exist')
    cy.get('#connection-warn-loss').should('not.exist')
  })

  after(() => {
    cy.task("stopServer")
  })

})