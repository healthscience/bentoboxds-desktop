
describe('BeeBee ask to upload data', () => {
  it('ask beebee to upload', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.reload()
    cy.get('#askinput').type('upload')
    cy.get('#natlang-ask').click()
    // cy.get("#").should('exist')
    cy.contains('.right-chat', 'Sorry, HOP has no data for that. Please upload or add url where beebee can find the data. ')
    cy.get('#upload-button').click()
    cy.get("#upload-space").should('exist')
  })

})