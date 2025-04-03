// https://docs.cypress.io/api/introduction/api.html

describe('base layout browser', () => {

  before(() => {
    // const hop = spawn('npm', ['run', 'start'], { stdio: 'inherit', cwd: baseHOPStepsUp });
    cy.task("startServer"); 
  })

  it('visits the app root url', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('.bentobox-main-nav').find('.bentobox-browser')
    cy.get('.bentobox-browser').find('.bentobox-top').should('have.length', 9)
    cy.contains(".logo-words", 'BentoBox-DS')
  })

})
