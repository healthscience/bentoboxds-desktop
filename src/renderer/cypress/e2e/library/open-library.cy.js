describe('bbNexus in Besearch modal', { testIsolation: false }, () => {
  before(() => {
    cy.task("startServer");
    // Ensure we have a session or perform genesis[cite: 3]
    cy.setupGenesis()
  })

  it('opens bbNexus from the besearch modal toolbar and verifies all sections and buttons exist', () => {
    // Right Panel (Chat)
    // Initially closed/narrow (width 0 in RightPanel.vue handleToggle)[cite: 3]
    cy.get('.right-panel-container').invoke('width').should('be.lte', 1)
    
    // Open chat via button (thought-bubble-button)[cite: 3]
    cy.get('.thought-bubble-button').click()
    cy.get('.right-panel-container').invoke('width').should('be.gt', 300)
    
    // Open bbnexus, using .first() to safely target the single element when multiple match[cite: 3]
    cy.get('.bbnexus-anchor').first().click()
    cy.get('.bbnexus-toolbar').should('be.visible')

    // Verify Interplay buttons
    cy.contains('.bbnexus-section', 'Interplay').within(() => {
      cy.get('button.bbnexus-btn').contains('Cues').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Library').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Cue Space').should('be.visible')
    })
  })

  it('select the library and check it opens', () => {
    // Verify Interplay buttons
    cy.contains('.bbnexus-section', 'Interplay').within(() => {
      cy.get('button.bbnexus-btn').contains('Cues').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Library').should('be.visible')
      cy.get('button.bbnexus-btn').contains('Cue Space').should('be.visible')
    })

    cy.get('button.bbnexus-btn').contains('Library').click()
    cy.get('.library-container:visible').should('be.visible')
  })

  it('should click on library', () => {
    // 1. Main container and header elements
    cy.get('.library-container:visible').should('be.visible')
    cy.get('.compact-library-header:visible').should('be.visible')
    cy.get('.library-brand:visible').within(() => {
      cy.get('.library-title').should('contain.text', 'Network Library').and('be.visible')
      cy.get('.library-subtitle').should('contain.text', 'Explore & contribute reference contracts').and('be.visible')
    })

    // 2. Scope toggle buttons (Public / Private)
    cy.get('.library-container:visible').find('.library-scope-toggle').within(() => {
      cy.get('.scope-btn').contains('Public').should('be.visible')
      cy.get('.scope-btn').contains('Private').should('be.visible')
    })

    // 3. Default Public toolbar buttons
    cy.get('.library-toolbar:visible').within(() => {
      cy.get('.sov-toolbar-btn').contains('Explorer').should('be.visible')
      cy.get('.sov-toolbar-btn').contains('Upload').should('be.visible')
      cy.get('.sov-toolbar-btn').contains('+ Contract').should('be.visible')
      cy.get('.sov-toolbar-btn.seed-btn').contains('Seed').should('be.visible')
    })

    cy.get('.library-container:visible').find('.library-scope-toggle .scope-btn').contains('Public').click({ force: true })
    cy.wait(2000)
    // 4. Main view container and default active component (Explorer)
    cy.get('.library-main').last().should('exist')
    cy.get('#explorer-view-main').last().should('exist')
  })

  it('verifies private scope toolbar buttons when Private is clicked', () => {
    // Target the Private scope button within the visible library container
    cy.get('.library-container:visible').find('.library-scope-toggle .scope-btn').contains('Private').click({ force: true })

    // Ensure the Seed button is unmounted from the visible container DOM
    cy.get('.library-container:visible').find('.seed-btn').should('not.exist')

    // Verify private toolbar buttons using the visible container scope
    cy.get('.library-toolbar:visible').within(() => {
      cy.get('.sov-toolbar-btn').contains('Explorer').should('be.visible')
      cy.get('.sov-toolbar-btn').contains('Upload').should('be.visible')
      cy.get('.sov-toolbar-btn').contains('+ Contract').should('be.visible')
    })
  })

  after(() => {
    cy.task('stopServer')
  })
})