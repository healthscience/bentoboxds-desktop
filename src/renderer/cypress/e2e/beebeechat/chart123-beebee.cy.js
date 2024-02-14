
describe('BeeBee chart 1 2 3', () => {
  it('ask beebee to chart 1 2 3 numbers', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('#askinput').type('chart 1 2 3')
    cy.get('#natlang-ask').click()
    cy.get("#beebee-chartspace").should('exist')
  })

})