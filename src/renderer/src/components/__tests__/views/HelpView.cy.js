import HelpView from '../../../views/HelpView.vue'

describe('<HelpView />', () => {
  beforeEach(() => {
    cy.mount(HelpView)
  })

  it('renders the component structure', () => {
    cy.get('#help-shaper').should('exist')
    cy.get('.helpspace').should('exist')
    cy.get('header').should('contain.text', 'Help')
    cy.get('.beebee-help').should('exist')
  })

  it('displays the beebee help section', () => {
    cy.get('#ask-beebee').should('exist').and('contain.text', 'Ask beebee for help via the chat box')
  })

  it('displays the video menu section with Rumble link', () => {
    cy.get('#video-menu').should('exist')
    cy.get('#video-menu').should('contain.text', 'selection of videos')
    cy.get('#video-menu a').should('have.attr', 'href', 'https://rumble.com/user/BeeBeeHop/videos')
    cy.get('#video-menu a').should('have.attr', 'target', '_blank')
    cy.get('#video-menu a').should('have.attr', 'rel', 'noopener noreferrer')
    cy.get('#video-menu a').should('contain.text', 'Rumble')
  })

  it('displays the guides section', () => {
    cy.get('#guides').should('exist')
    cy.get('#guides').should('contain.text', 'Guides to BentoTemplate building coming soon')
  })

  it('displays the community section with Discord link', () => {
    cy.get('#community').should('exist')
    cy.get('#community').should('contain.text', 'Join the community')
    cy.get('#community a').should('have.attr', 'href', 'https://discord.gg/JhdkXX54Xk')
    cy.get('#community a').should('have.attr', 'target', '_blank')
    cy.get('#community a').should('have.attr', 'rel', 'noopener noreferrer')
    cy.get('#community a').should('contain.text', 'Discord')
  })

  it('renders the YouTube player', () => {
    cy.get('vue-plyr').should('exist')
    cy.get('vue-plyr').find('[data-plyr-provider="youtube"]').should('exist')
    cy.get('vue-plyr').find('[data-plyr-embed-id="cXQcSB4hLfA"]').should('exist')
  })
})