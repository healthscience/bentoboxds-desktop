
describe('BeeBee chat say hello', () => {
  it('say hello to beebee', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.reload()
    cy.get('#askinput').type('hello')
    cy.get('#natlang-ask').click()
    // cy.get('.right-chart')
    cy.contains(".right-chat", 'bbai-reply')
   })

})