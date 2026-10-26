describe('Lifestrap E2E Tests', () => {
  beforeEach(() => {
    cy.task("startServer")
    cy.login()
  })

  afterEach(() => {
    cy.task("stopServer")
  })

  it('verifies first-time lifestrap creation flow', () => {
    // 1. Open LifeTools menu
    cy.get('.toggle-life-tools-button').click()
    
    // 2. Expand Life-straps accordion
    cy.contains('.accordion-header', 'Life-straps').click()
    
    // 3. Click "New LifeStrap Story"
    cy.contains('button', 'New LifeStrap Story').click()
    
    // 4. Verify system enters "zen" mode / lifestrap context
    // In LifeTools.vue, newLifeStrapStory sets storeAI.beebeeContext = "lifestrap"
    // and storeAI.currentMode = "zen"
    
    // We can verify if the UI reflects this. 
    // Usually, Beebee view might change or a specific message appears.
    cy.get('#beebee-shaper').should('be.visible')
  })

  it('verifies lifestrap display logic from Lifetools menu', () => {
    // 1. Open LifeTools menu
    cy.get('.toggle-life-tools-button').click()
    
    // 2. Life-straps section should be collapsed by default or at least we can toggle it
    cy.contains('.accordion-header', 'Life-straps').should('be.visible')
    
    // 3. Expand and verify content
    cy.contains('.accordion-header', 'Life-straps').click()
    cy.get('.accordion-content').should('be.visible')
    cy.contains('button', 'New LifeStrap Story').should('be.visible')
    
    // 4. Collapse and verify hidden
    cy.contains('.accordion-header', 'Life-straps').click()
    cy.get('.accordion-content').should('not.exist')
  })
})
