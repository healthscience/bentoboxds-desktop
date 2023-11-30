const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'https://localhost:4173/' // 'https://bentoboxds.org/bentobox/' // 'https://localhost:4173/'
  }
})
