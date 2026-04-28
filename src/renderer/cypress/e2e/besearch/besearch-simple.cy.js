// Simple Besearch E2E test using helpers
import { besearchHelpers } from './besearch-helpers'

describe('Besearch - Simple Tests', () => {
  beforeEach(() => {
    // Start HOP server
    cy.task("startServer")
    cy.viewport(1024, 768)
    cy.visit('/')
    
    // Authenticate
    cy.get("#self-auth-connect").should('exist')
    cy.get('#self-auth-connect').click()
    cy.get("#connect-hop").should('exist')
    cy.get("#self-auth").should('exist')
    cy.get('#self-auth').click()
    
    // Open besearch
    cy.openBesearch()
  })

  it('should display besearch modal with canvas', () => {
    // Check basic layout
    cy.get('#besearch-cycles').should('be.visible')
    cy.get('.mode-buttons').should('be.visible')
    cy.get('.life-tools-button').should('be.visible')
    
    // Verify canvas has content
    besearchHelpers.verifyCanvasHasContent()
  })

  it('should move peer using keyboard controls', () => {
    // Move peer in all directions
    cy.movePeer('right', 'keyboard', 3)
    cy.movePeer('down', 'keyboard', 2)
    cy.movePeer('left', 'keyboard', 3)
    cy.movePeer('up', 'keyboard', 2)
    
    // Take screenshot of final position
    besearchHelpers.takeScreenshot('peer-keyboard-movement')
  })

  it('should move peer using life tools buttons', () => {
    cy.openLifeTools()
    
    // Move peer using buttons
    cy.movePeer('right', 'button', 3)
    cy.movePeer('down', 'button', 2)
    cy.movePeer('left', 'button', 3)
    cy.movePeer('up', 'button', 2)
    
    // Take screenshot
    besearchHelpers.takeScreenshot('peer-button-movement')
  })

  it('should switch between modes', () => {
    // Test all modes
    cy.switchBesearchMode('Cues')
    besearchHelpers.verifyCanvasHasContent()
    
    cy.switchBesearchMode('Body')
    cy.wait(200)
    
    cy.switchBesearchMode('Mind')
    cy.wait(200)
    
    // Return to Cues and verify animations work
    cy.switchBesearchMode('Cues')
    besearchHelpers.waitForAnimation(10)
    besearchHelpers.verifyCanvasHasContent()
  })

  after(() => {
    cy.task("stopServer")
  })
})