const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "https://localhost:5173/",
    pageLoadTimeout: 120000,
    setupNodeEvents(on, config) {
      const { spawn } = require('child_process');
      const path = require('path')
      let hop = null

      on('task', {
        async 'startServer'() {
          const baseHOPStepsUp = path.join(__dirname, '..') + '/hop';
          const fs = require('fs');
          const net = require('net');
          
          // Check if HOP directory exists
          if (!fs.existsSync(baseHOPStepsUp)) {
            console.log('HOP directory not found at:', baseHOPStepsUp);
            return 'HOP directory not found';
          }
          
          // Check if port 9888 is already in use
          const checkPort = () => {
            return new Promise((resolve) => {
              const server = net.createServer();
              server.once('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                  console.log('Port 9888 is already in use, assuming HOP is running');
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
              server.once('listening', () => {
                server.close();
                resolve(false);
              });
              server.listen(9888);
            });
          };
          
          const portInUse = await checkPort();
          if (portInUse) {
            return 'happy';
          }
          
          // Start the HOP server
          try {
            hop = spawn('/usr/bin/npm', ['run', 'start', '--storage-name', 'test-hop-storage'], { stdio: 'inherit', cwd: baseHOPStepsUp });
            return 'happy'
          } catch (error) {
            console.error('Failed to start HOP server:', error);
            return 'Failed to start HOP server';
          }
        },
        async 'stopServer'() {
          // Stop the HOP server
          if (hop) {
            hop.kill()
          }
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
