describe('Space meun select and submenu tests', () => {
  // Run the setup before each test
  before(() => {
    cy.task("startServer")
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get("#self-auth-connect").should('exist')
    cy.get('#self-auth-connect').click()
    cy.get("#connect-hop").should('exist')
    cy.get("#self-auth").should('exist')
    cy.get('#self-auth').click()
  });

  it('click spaces button, sub menu with three sections available', () => {
    // Step 1: Verify the base layout
    cy.get('#app').find('.bentobox-main-nav').should('be.visible');
    cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible');
    // Step 2: Click on the Cues button
    cy.get('#library-button-menu').should('be.visible').click();
    cy.wait(3000)
    // Step 3: Verify that the Cues modal is presented
    cy.get('.modal-mask').should('be.visible');
    cy.get('.modal-container').should('be.visible');
  });

  after(() => {
    cy.task("stopServer")
  })

});