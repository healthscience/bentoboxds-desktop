
describe('BeeBee chat say hello', () => {

  beforeEach(() => {
    cy.task("startServer")
    cy.wait(3000)
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get("#self-auth-connect").should('exist')
    cy.get('#self-auth-connect').click()
    cy.get("#connect-hop").should('exist')
    cy.get("#self-auth").should('exist')
    cy.get('#self-auth').click()
  })

  it('sign in and input hello ask beebee', () => {
    cy.get('#beebee-shaper').should('exist')
    cy.get('#askinput').type('hello')
    cy.get('#natlang-ask').click()
  })

  it('ask beebee to chart 1 2 3 beebee', () => {
    cy.wait(6000)
    cy.get('#beebee-shaper').should('exist')
    cy.get('#askinput').type('chart 1 2 3')
    cy.get('#natlang-ask').click()
    cy.get("#beebee-chartspace").should('exist')
  })

  after(() => {
    cy.task("stopServer")
  })

})