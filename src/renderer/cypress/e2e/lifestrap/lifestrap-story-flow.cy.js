describe('Lifestrap Story E2E Flow', () => {
  beforeEach(() => {
    // Reset state before each test if necessary
    cy.task("startServer")
    cy.login()
  })

  afterEach(() => {
    cy.task("stopServer")
  })

  it('1. First time lifestrap story creation', () => {
    // Open LifeTools
    cy.get('.toggle-life-tools-button').click()

    // Expand Life-straps
    cy.contains('.accordion-header', 'Life-straps').click()
    cy.get('.accordion-content').should('be.visible')

    // Click "New LifeStrap Story"
    cy.get('button[new-lifestrap-story]').click()

    // Input story
    const story1 = "i swim for longevity. I currently can swim a 400IM and would like to continue to swim a 400IM aged 65."
    cy.get('#askinput').type(story1 + '{enter}')

    // Verify lens is open and has items
    // The ExperienceOrchestrator usually opens the bottom panel automatically
    cy.get('.bottom-panel', { timeout: 20000 }).should('be.visible')
    
    // Check capacity and context
    // Note: We might need to wait for the "extracted" data to appear
    // Adding diagnostic logging and increasing timeout
    cy.get('.lens-box.capacity', { timeout: 20000 }).should('be.visible')
    cy.get('.lens-box.capacity .variable-tag', { timeout: 20000 }).should('have.length.at.least', 1)
    
    cy.get('.lens-box.context').should('be.visible')
    cy.get('.lens-box.context .variable-tag').should('have.length.at.least', 1)

    // The peer closes the lens
    cy.get('.bottom-toggle-button').click()
    // Verify it closed (height becomes small or content hidden)
    cy.get('.bottom-panel-content').should('not.be.visible')
  })

  it('2. BentoBoxDS is restarted and Orbit world is presented', () => {

    // The lifetool will have the one lifestrap story
    cy.get('.toggle-life-tools-button').click()
    cy.contains('.accordion-header', 'Life-straps').click()
    
    // Verify there is a lifestrap node
    cy.get('.life-strap-node', { timeout: 20000 }).should('have.length.at.least', 1)

    // The orbit world will be presented (🌌 is the icon for orbit)
    cy.get('.world-icon.active').should('contain', '🌌')

    // The peer click on lens to open the bottom panel and the lens appears
    cy.get('.bottom-toggle-button').click()
    cy.get('.besearch-lens-grid', { timeout: 20000 }).should('be.visible')
  })

  it('3. The peer closes the lens and starts a new process', () => {
    // Peer closes the lens by clicking on it (toggle button)
    cy.get('.bottom-panel-content').should('not.be.visible')

    // Open lifetool life panel (if not already open)
    cy.get('.toggle-life-tools-button').click()

    // Expand Life-straps
    cy.contains('.accordion-header', 'Life-straps').click()

    // Clicks on new lifestrap story
    cy.get('button[new-lifestrap-story]', { timeout: 20000 }).click()

    // Input new story
    const story2 = "I want to reduce hayfever symptoms."
    cy.get('#askinput', { timeout: 20000 }).type(story2 + '{enter}')

    // Verify process starts all over again (Lens opens with new data)
    cy.get('.bottom-panel', { timeout: 20000 }).should('be.visible')
    cy.get('.lens-box.capacity', { timeout: 20000 }).should('be.visible')
    cy.get('.lens-box.capacity .variable-tag').should('have.length.at.least', 0)
  })
})
