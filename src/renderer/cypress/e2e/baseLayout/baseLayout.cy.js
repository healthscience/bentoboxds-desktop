describe('base layout browser - desktop', () => {
  // Run the setup before each test
  beforeEach(() => {
    cy.task("startServer");
    // Ensure we have a session or perform genesis
    cy.setupGenesis()
  })

  it('verifies the main nav and logo', () => {
    cy.get('#app').find('.bentobox-main-nav').should('be.visible')
    cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible')
    cy.get(".logo-words").should('contain', 'BentoBoxDS')
  })

  it('verifies panel open/close functionality', () => {
    // Left Panel (LifeTools)
    // By default it should be narrow (30px)
    cy.get('#life-tools-panel').should('have.css', 'width', '30px')
    
    // Click the toggle button (tear)
    cy.get('.toggle-life-tools-button').click()
    // It should expand to 302px (300px width + 2px border)
    // Note: CSS uses 1px border-right, so it might be 301px or 302px depending on box-sizing
    cy.get('#life-tools-panel').should('have.css', 'width').and('match', /30[12]px/)
    
    // Click again to close
    cy.get('.toggle-life-tools-button').click()
    cy.get('#life-tools-panel').should('have.css', 'width', '30px')

    // Right Panel (Chat)
    // Initially closed/narrow (width 0 in RightPanel.vue handleToggle)
    cy.get('.right-panel-container').invoke('width').should('be.lte', 1)
    
    // Open chat via button (thought-bubble-button)
    cy.get('.thought-bubble-button').click()
    cy.get('.right-panel-container').invoke('width').should('be.gt', 300)
  })

  afterEach(() => {
    cy.task("stopServer")
  })
})
