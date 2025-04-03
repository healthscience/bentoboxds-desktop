// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

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