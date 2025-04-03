const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "https://localhost:5173/",
    setupNodeEvents(on, config) {
      const { spawn } = require('child_process');
      const path = require('path')
      let hop = null

      on('task', {
        async 'startServer'() {
          const baseHOPStepsUp = path.join(__dirname, '..') + '/hop';
          // Start the HOP server
          hop = spawn('npm', ['run', 'start'], { stdio: 'inherit', cwd: baseHOPStepsUp });
          // console.log(baseHOPStepsUp)
          return 'happy'
        },
        async 'stopServer'() {
          // Stop the HOP server
          hop.kill()  
          return true
        }
      })
    }
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
