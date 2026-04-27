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
    cy.get('#beebee-agent').should('be.visible');
    // Step 2: Click on the Cues button
    cy.get('#space-button-menu')
      .should('be.visible')
      .click();
    // cy.wait(1000)
    // Wait for the store state to update and the button to become active
    cy.get('#active-space-history').should('be.visible');
    cy.get('#space-menu').should('exist')
    // Store the cues holder element reference
        // Verify that the space menu is visible
    cy.get('#cues-history').should('be.visible')
    cy.get('#marker-holder').should('exist');
    cy.get('#cues-holder').should('be.visible').as('cuesHolder');
    // Click the cues holder and wait for the cues list to appear
    cy.get('#cues-holder').click();
    cy.wait(1000)
    cy.get('#show-cues').should('be.visible');
    cy.get('.cues-list').should('have.length.greaterThan', 0);
    cy.get('.cues-list').first().find('.flat-history').click()
    cy.wait(1000)
    cy.get('.modal-mask').should('be.visible');
    cy.get('.modal-container').should('be.visible');
    // close the modal
    cy.get('.modal-default-button').click();
    cy.wait(1000)
    cy.get('.modal-mask').should('not.exist');
    // click cues to close
    cy.get('#cues-holder').click();
    cy.wait(1000)
    cy.get('#show-cues').should('not.exist');
  });

  after(() => {
    cy.task("stopServer")
  })

});