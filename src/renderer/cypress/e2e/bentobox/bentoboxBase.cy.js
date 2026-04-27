
describe('Ask beebee to chart a list of numbers', { testIsolation: false }, () => {

  before(() => {
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

  it('ask beebee to chart 1 2 3 beebee', () => {
    cy.wait(2000)
    cy.get('#beebee-shaper').should('exist')
    cy.get('#askinput').type('chart 1 2 3')
    cy.get('#natlang-ask').click()
    cy.wait(2000)
    cy.get("#beebee-chartspace").should('exist')
  })

  it('expand the bentobox and return', () => {
    cy.get('#expand-bentobox').click()
    cy.wait(1000)
    cy.get('#focus-bentobox').should('exist')
    // close the expand bentobox view
    cy.get('#return-modal-close').click()
    cy.wait(1000)
    cy.get('#focus-bentobox').should('not.exist')
  })

  after(() => {
    cy.task("stopServer")
  })

})