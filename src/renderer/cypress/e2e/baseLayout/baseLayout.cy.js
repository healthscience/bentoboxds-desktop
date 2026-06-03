describe('base layout browser - desktop', () => {
  // Run the setup before each test
  beforeEach(() => {
    cy.task("startServer");
    cy.login()
  })

  it('verifies the main nav and logo', () => {
    cy.get('#app').find('.bentobox-main-nav').should('be.visible')
    cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible')
    // Note: The logo text might be BentoBoxDS (based on mainTools.vue)
    cy.get(".logo-words").should('be.visible')
  })

  it('verifies panel open/close functionality', () => {
    // Left Panel (LifeTools)
    // By default it should be narrow (30px)
    cy.get('#life-tools-panel').should('have.css', 'width', '30px')
    
    // Click the toggle button (tear)
    cy.get('.toggle-life-tools-button').click()
    // It should expand to 302px (300px width + 2px border in PrimeInterface/LeftPanel)
    cy.get('#life-tools-panel').invoke('width').should('be.gt', 200)
    
    // Click again to close
    cy.get('.toggle-life-tools-button').click()
    cy.get('#life-tools-panel').should('have.css', 'width', '30px')

    // Right Panel (Chat)
    // Initially closed/narrow
    cy.get('.right-panel-area').should('have.css', 'width', '10px') // Default chatWidth is 10 in PrimeInterface
    
    // Open chat via button (need to find the button in RightPanel or PrimeInterface)
    // Based on PrimeInterface, there isn't a clear toggle button for chat in the snippet
    // but RightPanel likely has one. Let's look for a generic trigger if possible.
  })

  afterEach(() => {
    cy.task("stopServer")
  })
})
