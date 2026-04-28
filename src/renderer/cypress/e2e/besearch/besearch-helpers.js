// Helper functions for Besearch E2E tests

export const besearchHelpers = {
  // Open the besearch modal
  openBesearch() {
    cy.get('#besearch-button').click()
    cy.get('.besearch-modal').should('be.visible')
  },

  // Open life tools panel
  openLifeTools() {
    cy.get('.life-tools-button').click()
    cy.get('.life-tools-panel').should('be.visible')
  },

  // Close life tools panel
  closeLifeTools() {
    cy.get('.life-tools-button').click()
    cy.get('.life-tools-panel').should('not.exist')
  },

  // Switch to a specific mode
  switchMode(mode) {
    cy.contains('button', mode).click()
    cy.wait(100) // Wait for canvas update
  },

  // Move peer using keyboard
  movePeerWithKeyboard(direction, times = 1) {
    const keyMap = {
      up: '{uparrow}',
      down: '{downarrow}',
      left: '{leftarrow}',
      right: '{rightarrow}'
    }
    
    cy.get('#besearch-cycles').click() // Focus canvas
    
    for (let i = 0; i < times; i++) {
      cy.get('body').type(keyMap[direction])
      cy.wait(100)
    }
  },

  // Move peer using life tools buttons
  movePeerWithButton(direction, times = 1) {
    const buttonMap = {
      up: '↑',
      down: '↓',
      left: '←',
      right: '→'
    }
    
    for (let i = 0; i < times; i++) {
      cy.get(`button[aria-label*="${direction}"], button:contains("${buttonMap[direction]}")`)
        .click()
      cy.wait(100)
    }
  },

  // Check if canvas has content (not blank)
  verifyCanvasHasContent() {
    cy.get('#besearch-cycles').then($canvas => {
      const canvas = $canvas[0]
      const ctx = canvas.getContext('2d')
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      let hasContent = false
      for (let i = 0; i < data.length; i += 4) {
        // Check if pixel is not white or transparent
        if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255 || data[i + 3] !== 0) {
          hasContent = true
          break
        }
      }
      
      expect(hasContent, 'Canvas should have visible content').to.be.true
    })
  },

  // Get canvas pixel data at specific coordinates
  getPixelColor(x, y) {
    return cy.get('#besearch-cycles').then($canvas => {
      const canvas = $canvas[0]
      const ctx = canvas.getContext('2d')
      const imageData = ctx.getImageData(x, y, 1, 1)
      const [r, g, b, a] = imageData.data
      
      return { r, g, b, a }
    })
  },

  // Wait for animation frame
  waitForAnimation(frames = 1) {
    cy.window().then(win => {
      return new Cypress.Promise(resolve => {
        let count = 0
        const wait = () => {
          if (++count >= frames) {
            resolve()
          } else {
            win.requestAnimationFrame(wait)
          }
        }
        win.requestAnimationFrame(wait)
      })
    })
  },

  // Inject peer position tracking
  injectPeerTracking() {
    cy.window().then(win => {
      win.peerPositions = []
      win.trackPeerPosition = (x, y) => {
        win.peerPositions.push({ x, y, timestamp: Date.now() })
      }
    })
  },

  // Get tracked peer positions
  getPeerPositions() {
    return cy.window().then(win => win.peerPositions || [])
  },

  // Take timestamped screenshot
  takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    cy.get('#besearch-cycles').screenshot(`${name}-${timestamp}`)
  }
}

// Cypress commands for easier use
Cypress.Commands.add('openBesearch', besearchHelpers.openBesearch)
Cypress.Commands.add('openLifeTools', besearchHelpers.openLifeTools)
Cypress.Commands.add('switchBesearchMode', besearchHelpers.switchMode)
Cypress.Commands.add('movePeer', (direction, method = 'keyboard', times = 1) => {
  if (method === 'keyboard') {
    besearchHelpers.movePeerWithKeyboard(direction, times)
  } else {
    besearchHelpers.movePeerWithButton(direction, times)
  }
})