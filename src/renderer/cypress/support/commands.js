// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('setupGenesis', (password = 'testbee') => {
  cy.viewport(1024, 768)
  cy.visit('/')
  
  // Open Account Modal
  cy.get("#self-auth-connect").should('be.visible').click()
  
  // Check if we are in Genesis mode (Ready state) or if identity already exists
  cy.get('body').then(($body) => {
    if ($body.find('.ready-state').length > 0) {
      cy.log('First time setup: Genesis Gate Ready')
      cy.get('.ready-state').find('input[type="password"]').type(password)
      cy.get('.ready-state').find('.sign-button').click()
    } else if ($body.find('.genesis-gate').length > 0) {
      cy.log('Returning peer: entering password')
      cy.get('.genesis-gate').find('input[type="password"]').type(password)
      cy.get('.genesis-gate').find('.sign-button').click()
    } else {
      cy.log('Account modal open but genesis-gate not found - checking status')
    }
  })
  
  // Wait for the app to transition to the authenticated state
  // We check that the button no longer says "Sign-in" and instead indicates account/peer status
  // Note: accountStore.accountMenu changes to 'account' on success
  cy.get("#self-auth-connect", { timeout: 40000 }).should('contain', 'account')
})

Cypress.Commands.add('login', (password = 'testbee') => {
  // login is essentially setupGenesis for returning peers in the current implementation
  cy.setupGenesis(password)
})

// Custom command for managing multiple instances
/*
Cypress.Commands.add('startInstance', (instanceName) => {
  cy.task('startServer', { instance: instanceName })
    .then((port) => {
      return `${Cypress.config().baseUrl}:${port}`
    })
})

Cypress.Commands.add('stopInstance', (instanceName) => {
  cy.task('stopServer', { instance: instanceName })
})
*/