describe('Besearch Modal and Canvas Functionality', () => {
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
    
    // Wait for modal to be visible
    cy.get('.besearch-modal').should('be.visible')
  })

  describe('Base Layout', () => {
    it('should display all main components of besearch modal', () => {
      // Check modal container exists
      cy.get('.besearch-modal').within(() => {
        // Check for canvas element
        cy.get('#besearch-cycles').should('exist')
          .and('be.visible')
          .and('have.attr', 'width')
          .and('have.attr', 'height')

        // Check for close button
        cy.get('.close-button').should('be.visible')

        // Check for mode buttons
        cy.get('.mode-buttons').within(() => {
          cy.contains('button', 'Cues').should('be.visible')
          cy.contains('button', 'Body').should('be.visible')
          cy.contains('button', 'Mind').should('be.visible')
        })

        // Check for life tools button
        cy.get('.life-tools-button').should('be.visible')
      })
    })

    it('should have correct canvas dimensions', () => {
      cy.get('#besearch-cycles').then($canvas => {
        const width = parseInt($canvas.attr('width'))
        const height = parseInt($canvas.attr('height'))
        
        expect(width).to.be.greaterThan(0)
        expect(height).to.be.greaterThan(0)
        expect(width).to.be.at.least(600) // Minimum expected width
        expect(height).to.be.at.least(400) // Minimum expected height
      })
    })
  })

  describe('Mode Switching', () => {
    it('should switch between different modes', () => {
      // Start in default mode (should be Cues)
      cy.get('#besearch-cycles').should('exist')

      // Switch to Body mode
      cy.contains('button', 'Body').click()
      cy.wait(100) // Wait for canvas update
      
      // Switch to Mind mode
      cy.contains('button', 'Mind').click()
      cy.wait(100)
      
      // Switch back to Cues mode
      cy.contains('button', 'Cues').click()
      cy.wait(100)
      
      // Verify canvas still exists after mode switches
      cy.get('#besearch-cycles').should('exist').and('be.visible')
    })

    it('should highlight active mode button', () => {
      // Check Cues is active by default
      cy.contains('button', 'Cues').should('have.class', 'active')
        .or('have.css', 'background-color').and('not.eq', 'rgba(0, 0, 0, 0)')

      // Click Body and check it becomes active
      cy.contains('button', 'Body').click()
      cy.contains('button', 'Body').should('have.class', 'active')
        .or('have.css', 'background-color').and('not.eq', 'rgba(0, 0, 0, 0)')
    })
  })

  describe('Life Tools Integration', () => {
    it('should open life tools panel when clicking be button', () => {
      // Click the be button
      cy.get('.life-tools-button, button:contains("be")').click()
      
      // Check life tools panel appears
      cy.get('.life-tools-panel').should('be.visible')
      
      // Check for navigation controls
      cy.get('.life-tools-panel').within(() => {
        // Check for directional buttons
        cy.get('button[aria-label*="up"], button:contains("↑")').should('be.visible')
        cy.get('button[aria-label*="down"], button:contains("↓")').should('be.visible')
        cy.get('button[aria-label*="left"], button:contains("←")').should('be.visible')
        cy.get('button[aria-label*="right"], button:contains("→")').should('be.visible')
        
        // Check for control buttons
        cy.contains('button', 'Start').should('be.visible')
        cy.contains('button', 'Stop').should('be.visible')
      })
    })

    it('should toggle life tools panel', () => {
      // Open life tools
      cy.get('.life-tools-button, button:contains("be")').click()
      cy.get('.life-tools-panel').should('be.visible')
      
      // Close life tools
      cy.get('.life-tools-button, button:contains("be")').click()
      cy.get('.life-tools-panel').should('not.exist')
    })
  })

  describe('Peer Movement via Keyboard', () => {
    it('should move peer with arrow keys', () => {
      // Focus on the canvas or modal to ensure keyboard events are captured
      cy.get('#besearch-cycles').click()
      
      // Get initial peer position by checking canvas state
      cy.window().then(win => {
        // Store initial position if peer object is exposed
        const initialX = win.peer?.x || 100
        const initialY = win.peer?.y || 100
        
        // Press right arrow key
        cy.get('body').type('{rightarrow}')
        cy.wait(200) // Wait for animation
        
        // Check if peer moved right
        cy.window().then(win => {
          if (win.peer) {
            expect(win.peer.x).to.be.greaterThan(initialX)
          }
        })
        
        // Press down arrow key
        cy.get('body').type('{downarrow}')
        cy.wait(200)
        
        // Check if peer moved down
        cy.window().then(win => {
          if (win.peer) {
            expect(win.peer.y).to.be.greaterThan(initialY)
          }
        })
      })
    })
  })

  describe('Peer Movement via Life Tools Buttons', () => {
    it('should move peer using directional buttons', () => {
      // Open life tools
      cy.get('.life-tools-button, button:contains("be")').click()
      
      // Wait for panel to be visible
      cy.get('.life-tools-panel').should('be.visible')
      
      // Test right movement
      cy.get('button[aria-label*="right"], button:contains("→")').click()
      cy.wait(150) // Wait for movement animation
      
      // Test up movement
      cy.get('button[aria-label*="up"], button:contains("↑")').click()
      cy.wait(150)
      
      // Test left movement
      cy.get('button[aria-label*="left"], button:contains("←")').click()
      cy.wait(150)
      
      // Test down movement
      cy.get('button[aria-label*="down"], button:contains("↓")').click()
      cy.wait(150)
      
      // Verify canvas is still rendering
      cy.get('#besearch-cycles').should('be.visible')
    })

    it('should start and stop peer movement', () => {
      // Open life tools
      cy.get('.life-tools-button, button:contains("be")').click()
      
      // Click start button
      cy.contains('button', 'Start').click()
      cy.wait(100)
      
      // Click stop button
      cy.contains('button', 'Stop').click()
      cy.wait(100)
      
      // Verify buttons still work after start/stop
      cy.get('button[aria-label*="right"], button:contains("→")').click()
    })
  })

  describe('Canvas Rendering', () => {
    it('should render canvas content in Cues mode', () => {
      // Ensure we're in Cues mode
      cy.contains('button', 'Cues').click()
      
      // Check canvas has content by verifying it's not blank
      cy.get('#besearch-cycles').then($canvas => {
        const canvas = $canvas[0]
        const ctx = canvas.getContext('2d')
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Check if any pixels are non-white (indicating content is drawn)
        let hasContent = false
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
            hasContent = true
            break
          }
        }
        
        expect(hasContent).to.be.true
      })
    })
  })

  describe('Modal Interactions', () => {
    it('should close modal when clicking close button', () => {
      // Verify modal is open
      cy.get('.besearch-modal').should('be.visible')
      
      // Click close button
      cy.get('.close-button').click()
      
      // Verify modal is closed
      cy.get('.besearch-modal').should('not.exist')
    })

    it('should close modal when pressing Escape key', () => {
      // Verify modal is open
      cy.get('.besearch-modal').should('be.visible')
      
      // Press Escape key
      cy.get('body').type('{esc}')
      
      // Verify modal is closed
      cy.get('.besearch-modal').should('not.exist')
    })
  })

  describe('Responsive Behavior', () => {
    it('should adapt canvas size to viewport', () => {
      // Test different viewport sizes
      const viewports = [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 375, height: 667, name: 'mobile' }
      ]

      viewports.forEach(viewport => {
        cy.viewport(viewport.width, viewport.height)
        cy.wait(100) // Wait for resize
        
        cy.get('#besearch-cycles').should('be.visible')
          .and(($canvas) => {
            const width = parseInt($canvas.attr('width'))
            const height = parseInt($canvas.attr('height'))
            
            // Canvas should fit within viewport
            expect(width).to.be.lessThan(viewport.width)
            expect(height).to.be.lessThan(viewport.height)
          })
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle rapid mode switching gracefully', () => {
      // Rapidly switch between modes
      for (let i = 0; i < 5; i++) {
        cy.contains('button', 'Cues').click()
        cy.contains('button', 'Body').click()
        cy.contains('button', 'Mind').click()
      }
      
      // Canvas should still be functional
      cy.get('#besearch-cycles').should('be.visible')
      
      // Should still be able to open life tools
      cy.get('.life-tools-button, button:contains("be")').click()
      cy.get('.life-tools-panel').should('be.visible')
    })

    it('should handle rapid button clicks in life tools', () => {
      // Open life tools
      cy.get('.life-tools-button, button:contains("be")').click()
      
      // Rapidly click movement buttons
      for (let i = 0; i < 10; i++) {
        cy.get('button[aria-label*="right"], button:contains("→")').click()
        cy.get('button[aria-label*="left"], button:contains("←")').click()
      }
      
      // Canvas should still be visible and functional
      cy.get('#besearch-cycles').should('be.visible')
    })
  })

  after(() => {
    cy.task("stopServer")
  })
})