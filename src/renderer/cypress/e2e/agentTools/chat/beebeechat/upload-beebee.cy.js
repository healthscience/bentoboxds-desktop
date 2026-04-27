

describe('Ask beebee to upload a file', () => {

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

  it('click @upload link in beebee input interface', () => {
    // cy.wait(6000)
    cy.get('#beebee-shaper').should('exist')
    cy.get('#upload-link').click()
    cy.get("#data-box-header").should('exist')
    cy.get("#upload-space").should('exist')
  })

  after(() => {
    cy.task("stopServer")
  })

})