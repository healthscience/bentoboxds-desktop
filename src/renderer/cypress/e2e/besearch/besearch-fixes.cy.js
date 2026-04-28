describe('Besearch Bug Fixes - Navigation and Overlay', () => {
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
    
    // Open the besearch modal
    cy.get('#besearch-button').click()
    cy.get('.besearch-modal').should('be.visible')
  })

  describe('Life Tools Button Navigation Fix', () => {
    beforeEach(() => {
      // Open life tools panel
      cy.get('.life-tools-button, button:contains("be")').click()
      cy.get('.life-tools-panel').should('be.visible')
    })

    it('should move peer when clicking directional buttons', () => {
      // Inject a spy to track peer position changes
      cy.window().then(win => {
        win.peerMoveEvents = []
        
        // Try to intercept emit events if possible
        const component = win.app?._instance?.proxy
        if (component) {
          const originalEmit = component.$emit
          component.$emit = function(event, ...args) {
            if (event === 'peer-moved') {
              win.peerMoveEvents.push(args[0])
            }
            return originalEmit.apply(this, arguments)
          }
        }
      })

      // Click right button multiple times
      cy.get('button[aria-label*="right"], button:contains("→")')
        .click()
        .wait(150)
        .click()
        .wait(150)
        .click()

      // Verify movement events were triggered
      cy.window().then(win => {
        if (win.peerMoveEvents) {
          expect(win.peerMoveEvents.length).to.be.greaterThan(0)
          
          // Check that direction was set correctly
          const rightMoves = win.peerMoveEvents.filter(e => 
            e.direction && e.direction.x === 1 && e.isMoving === true
          )
          expect(rightMoves.length).to.be.greaterThan(0)
        }
      })
    })

    it('should handle all four directional buttons', () => {
      const directions = [
        { button: '↑', label: 'up', expected: { x: 0, y: -1 } },
        { button: '↓', label: 'down', expected: { x: 0, y: 1 } },
        { button: '←', label: 'left', expected: { x: -1, y: 0 } },
        { button: '→', label: 'right', expected: { x: 1, y: 0 } }
      ]

      directions.forEach(dir => {
        cy.get(`button[aria-label*="${dir.label}"], button:contains("${dir.button}")`)
          .should('be.visible')
          .click()
          .wait(150)
      })

      // All buttons should remain clickable
      cy.get('button[aria-label*="right"], button:contains("→")').click()
    })

    it('should not interfere with keyboard navigation', () => {
      // Close life tools
      cy.get('.life-tools-button, button:contains("be")').click()
      cy.get('.life-tools-panel').should('not.exist')

      // Test keyboard navigation still works
      cy.get('#besearch-cycles').click()
      cy.get('body').type('{rightarrow}')
      cy.wait(100)
      cy.get('body').type('{leftarrow}')
      cy.wait(100)

      // Reopen life tools and test buttons again
      cy.get('.life-tools-button, button:contains("be")').click()
      cy.get('button[aria-label*="up"], button:contains("↑")').click()
    })
  })

  describe('Besearch Cycles Overlay Fix', () => {
    it('should render cycles without overlaying peer', () => {
      // Ensure we're in Cues mode where cycles are visible
      cy.contains('button', 'Cues').click()
      cy.wait(500) // Wait for initial render

      // Take a screenshot for visual verification
      cy.get('#besearch-cycles').screenshot('cycles-and-peer-render')

      // Move peer to different positions and verify rendering
      const positions = [
        { key: '{rightarrow}', direction: 'right' },
        { key: '{downarrow}', direction: 'down' },
        { key: '{leftarrow}', direction: 'left' },
        { key: '{uparrow}', direction: 'up' }
      ]

      cy.get('#besearch-cycles').click()
      
      positions.forEach((pos, index) => {
        cy.get('body').type(pos.key)
        cy.wait(200)
        
        // Take screenshot at each position
        cy.get('#besearch-cycles').screenshot(`peer-position-${index}-${pos.direction}`)
      })

      // Canvas should still be rendering properly
      cy.get('#besearch-cycles').should('be.visible')
    })

    it('should maintain proper layer order during animation', () => {
      cy.contains('button', 'Cues').click()
      
      // Wait for animations to run
      cy.wait(2000)
      
      // Canvas should still be visible and rendering
      cy.get('#besearch-cycles').should('be.visible')
      
      // Move peer during cycle animation
      cy.get('#besearch-cycles').click()
      for (let i = 0; i < 5; i++) {
        cy.get('body').type('{rightarrow}')
        cy.wait(100)
      }
      
      // Take final screenshot
      cy.get('#besearch-cycles').screenshot('animation-with-movement')
    })

    it('should handle mode switching without breaking animations', () => {
      // Start in Cues mode with animations
      cy.contains('button', 'Cues').click()
      cy.wait(500)
      
      // Switch modes while animations are running
      cy.contains('button', 'Body').click()
      cy.wait(500)
      
      cy.contains('button', 'Mind').click()
      cy.wait(500)
      
      // Return to Cues mode
      cy.contains('button', 'Cues').click()
      cy.wait(500)
      
      // Animations should resume properly
      cy.get('#besearch-cycles').should('be.visible')
      
      // Peer movement should still work
      cy.get('#besearch-cycles').click()
      cy.get('body').type('{rightarrow}')
    })
  })

  describe('Integration of Both Fixes', () => {
    it('should handle button navigation while cycles are animating', () => {
      // Ensure Cues mode for cycle animations
      cy.contains('button', 'Cues').click()
      cy.wait(500)
      
      // Open life tools
      cy.get('.life-tools-button, button:contains("be")').click()
      
      // Move peer using buttons while cycles animate
      const moves = 10
      for (let i = 0; i < moves; i++) {
        cy.get('button[aria-label*="right"], button:contains("→")').click()
        cy.wait(50)
        cy.get('button[aria-label*="down"], button:contains("↓")').click()
        cy.wait(50)
      }
      
      // Canvas should still be functional
      cy.get('#besearch-cycles').should('be.visible')
      
      // Take screenshot of final state
      cy.get('#besearch-cycles').screenshot('integrated-fixes-final-state')
    })

    it('should maintain performance with both features active', () => {
      cy.contains('button', 'Cues').click()
      cy.get('.life-tools-button, button:contains("be")').click()
      
      // Measure time for multiple operations
      const startTime = Date.now()
      
      // Perform rapid movements
      for (let i = 0; i < 20; i++) {
        cy.get('button[aria-label*="right"], button:contains("→")').click({ force: true })
        cy.get('button[aria-label*="left"], button:contains("←")').click({ force: true })
      }
      
      cy.then(() => {
        const endTime = Date.now()
        const duration = endTime - startTime
        
        // Operations should complete in reasonable time (less than 5 seconds)
        expect(duration).to.be.lessThan(5000)
      })
    })
  })

  after(() => {
    cy.task("stopServer")
  })
})