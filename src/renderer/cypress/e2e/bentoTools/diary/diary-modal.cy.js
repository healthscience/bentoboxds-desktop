describe('Diary Tests', () => {
  // Run the setup before each test
  beforeEach(() => {
    cy.task("startServer")
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get("#self-auth-connect").should('exist')
    cy.get('#self-auth-connect').click()
    cy.get("#connect-hop").should('exist')
    cy.get("#self-auth").should('exist')
    cy.get('#self-auth').click()
  });

  it('should click on Diary button and verify the modal and content', () => {
      // Step 1: Verify the base layout
      cy.get('#app').find('.bentobox-main-nav').should('be.visible');
      cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible');
      cy.contains(".logo-words", 'BentoBox-DS').should('exist');

      // Step 2: Click on the Diary button
      cy.get('#diary-button').click() // Adjusted selector for Diary

      // Step 3: Verify that the Diary modal is presented
      cy.get('.modal-mask').should('be.visible'); // Adjust the selector based on your modal class

      // Step 4: Verify that the content div is presented
      cy.get('.modal-container').should('be.visible'); // Adjust the selector based on your content div class
  });

  after(() => {
    cy.task("stopServer")
  })
});