// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (password = 'testbee') => {
  cy.viewport(1024, 768)
  cy.visit('/')
  
  cy.get("#self-auth-connect").should('be.visible').click()
  
  // The app uses a public/private key flow via genesisGate.vue
  // If HOPlock is true, it asks for a master password.
  // We check if the password input is visible.
  
  cy.get('body').then(($body) => {
    if ($body.find('input[type="password"]').length > 0) {
      cy.get('input[type="password"]').type(password)
      // The button text is "Self verify identity" or "Sign Handshake & set password"
      // Looking at genesisGate.vue, verifyHOP() is triggered by the button
      cy.get('.sign-button').click()
    } else {
      // If no password input yet, it might be the initial "Connect to HOP" button
      // from selfAuth.vue which then triggers genesisGate.
      cy.get("#self-auth").should('be.visible').click()
      
      // Now it should be in genesisGate.vue
      cy.get('input[type="password"]').type(password)
      cy.get('.sign-button').click()
    }
  })
  
  // Wait for the app to transition to the authenticated state
  // accountStore.js sets peerauth = true and accountMenu = 'account' on success
  cy.get("#self-auth-connect", { timeout: 10000 }).should('contain', 'account')
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