describe('BottomPanel UI Flow Tests', { testIsolation: false }, () => {
  before(() => {
    cy.task("startServer");
    cy.setupGenesis();
  });

  it('clicks the bottom button to slide up and open the bottom panel', () => {
    // 1. Click the actual toggle button class found in BottomPanel.vue
    cy.get('.bottom-toggle-button').click();

    // 2. Verify that the bottom panel area slides up and is visible
    cy.get('.bottom-panel-area').should('be.visible');

    // 3. Click the toggle button again to close/collapse the panel
    cy.get('.bottom-toggle-button').click();
  });

  after(() => {
    cy.task('stopServer');
  });
});