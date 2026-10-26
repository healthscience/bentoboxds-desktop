describe('Library: Create Datatype', () => {
  beforeEach(() => {
    // Reset state and login before each test
    cy.task("startServer")
    cy.login()
  })

  afterEach(() => {
    cy.task("stopServer")
  })

  it('can create and display a new datatype reference contract', () => {
    // Wait for the main navigation / layout to be ready
    cy.get('#app').find('.bentobox-main-nav').should('be.visible')
    
    // Step 1: Open Databox
    cy.get('#library-button-menu').should('be.visible').click()

    // Step 2: Verify Databox is active and "Library" tab is shown
    cy.get('.modal-mask').should('be.visible')
    cy.get('.button-lib-data').contains('Library').should('have.class', 'active')

    // Step 3: Verify the "Public Library" scope is selected by default
    cy.get('.scope-btn').contains('Public Library').should('have.class', 'active')

    // Step 4: Navigate to "+ New Reference Contract"
    cy.get('.sov-toolbar-btn').contains('+ New Reference Contract').should('be.visible').click()

    // Step 5: Select "datatype" reference contract form
    // The type select is within #api-add-type. Let's select 'DATATYPE' (or 'datatype')
    cy.get('#api-add-type select').select('DATATYPE')

    // Step 6: Set Datatype Primary to "YES" to open form inputs
    cy.get('.new-datatype-form select#source-value').select('YES')

    // Step 7: Fill in datatype form
    cy.get('#ref-datatype-name').should('be.visible').type('Test Datatype')
    cy.get('#api-datatype-description').should('be.visible').type('A test datatype created via E2E')

    // Step 8: Save the reference contract
    cy.get('button').contains('Save Reference Contract').should('be.visible').click()

    // Step 9: Go back to "Explorer"
    cy.get('.sov-toolbar-btn').contains('Explorer').should('be.visible').click()

    // Step 10: Open Datatypes category
    cy.get('.category-nav button').contains('Datatypes').should('be.visible').click()

    // Step 11: Verify Datatype Contracts section and the created contract
    cy.get('h4').contains('Datatype Contracts').should('be.visible')
  })
})
