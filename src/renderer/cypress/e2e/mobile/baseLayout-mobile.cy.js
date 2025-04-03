describe('base layout browser - mobile', () => {

  before(() => {
    // const hop = spawn('npm', ['run', 'start'], { stdio: 'inherit', cwd: baseHOPStepsUp });
    cy.task("startServer"); 
  })
  it('visits the app root url', () => {
    cy.viewport('iphone-6') // Mobile viewport
    cy.visit('/')
    cy.get('#app').find('.bentobox-main-nav').should('be.visible')
    cy.get('.bentobox-main-nav').find('#mobile-menu-live').should('be.visible')
    cy.contains(".logo-words", 'BentoBox-DS').should('not.exist')
  })

})