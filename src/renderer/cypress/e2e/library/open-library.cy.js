describe('Check library with dataspace is open', () => {
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

  it('should click on library', () => {
      // Step 1: Verify the base layout
      cy.get('#app').find('.bentobox-main-nav').should('be.visible');
      cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible');
      cy.contains(".logo-words", 'BentoBox-DS').should('exist');

      // Step 2: Click on the Library menu button
      cy.get('#library-button-menu').click() // Adjust the selector if necessary

      // Step 3: Verify that the Cues modal is presented
      cy.get('.modal-mask').should('be.visible'); // Adjust the selector based on your modal class

      // Step 4: Verify that the content div is presented
      cy.get('.modal-container').should('be.visible'); // Adjust the selector based on your content div class

      // Step 5: Verify data box header buttons
      cy.get('#data-box-header').should('be.visible').and('contain', 'Data Box');
      
      // Verify Library button
      cy.get('.button-lib-data').eq(0).should('be.visible')
        .and('have.class', 'active') // Verify it's active by default
        .and('contain', 'Library');

      // Verify Upload button
      cy.get('.button-lib-data').eq(1).should('be.visible')
        .and('contain', 'Upload');

      // Verify Experiments button
      cy.get('.button-lib-data').eq(2).should('be.visible')
        .and('contain', 'Experiments');

      // Verify + new NXP button
      cy.get('.button-lib-data').eq(3).should('be.visible')
        .and('contain', '+ new NXP');

      // Step 6: Verify button click functionality
      cy.get('.button-lib-data').eq(1).click(); // Click Upload
      cy.get('.button-lib-data').eq(1).should('have.class', 'active'); // Verify Upload is now active

      cy.get('.button-lib-data').eq(0).click(); // Click Library
      cy.get('.button-lib-data').eq(0).should('have.class', 'active'); // Verify Library is now active

      // Step 7: Verify close functionality
      cy.get('#return-modal-close').should('be.visible');
      cy.get('#return-modal-close').click();
      cy.get('.modal-mask').should('not.be.visible');

      // Step 8: Verify close button functionality
      cy.get('#library-button-menu').click();
      cy.get('.modal-mask').should('be.visible');
      cy.get('button[aria-label="Close modal"]').should('be.visible');
      cy.get('button[aria-label="Close modal"]').click();
      cy.get('.modal-mask').should('not.be.visible');
  });

  after(() => {
    cy.task("stopServer")
  })
});