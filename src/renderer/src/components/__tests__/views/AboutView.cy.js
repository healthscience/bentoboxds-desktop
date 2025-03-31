import AboutView from '../../../views/AboutView.vue'

describe('<AboutView />', () => {
  beforeEach(() => {
    cy.mount(AboutView)
  })

  it('renders the component structure', () => {
    cy.get('#about-shaper').should('exist')
    cy.get('.aboutspace').should('exist')
    cy.get('header').should('contain.text', 'About')
    cy.get('.bentobox-story').should('exist')
  })

  it('displays the BentoboxDS story content', () => {
    cy.get('#bentobox-story').should('exist').and('contain.text', 'BentoboxDS - a toolkit for building sovereign intelligences')
    cy.get('#beebee-agent').should('exist').and('contain.text', 'BeeBee is the Help AI agent')
    cy.get('#open-source').should('exist')
  })

  it('has correct open source acknowledgements', () => {
    cy.get('.opensource-acknoledgement').should('have.length', 2)
    cy.get('.opensource-acknoledgement').eq(0).should('contain.text', 'BentoBox-DS is part of the Health Oracle Protocol Open Source Project')
    cy.get('.opensource-acknoledgement').eq(1).should('contain.text', 'Wikipedia.org, dbpedia.org & wikimedia any many open source projects')
  })

  it('has responsive layout', () => {
    // Test desktop layout
    cy.viewport(1200, 800)
    cy.get('.aboutspace').should('have.css', 'width').and('match', /840px/)
    cy.get('.aboutspace').should('have.css', 'margin-top').and('match', /140px/)

    // Test mobile layout
    cy.viewport('iphone-6')
    cy.get('.aboutspace').should('have.css', 'width').and('match', /337.5px/)
    cy.get('.aboutspace').should('have.css', 'margin-top').and('match', /10px/)
  })

  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.wait(1000)
  })
})