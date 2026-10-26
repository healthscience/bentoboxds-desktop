# bentoboxds-desktop
BentoBox-DS as an electron desktop application of BentoBoxDS and HOP


## build protocol

Transfer latest HOP code to hop folder

edit  src/index.js  for electron access to files


  /**
  * server & websocket
  * @method hopConnect
  *
  */
   hopConnect = function () {
    const options = {
      key: fs.readFileSync(_dirname + '/key.pem'),
      cert: fs.readFileSync(_dirname + '/cert.pem')
    }

    // 1. Define your allowed peer origin (BentoBoxDS location)
    const ALLOWED_ORIGIN = 'https://localhost:5173'; // Change to your actual UI port

    const server = createServer(options, (request, response) => {
      // process HTTPS request. Since we're writing just WebSockets
      // server we don't have to implement anything.
    })

    server.on('error', function(e) {
      console.log('problem with request: ' + e.stack);
    })

    // 2. Upgrade to WebSocket with Origin Check
    server.on('upgrade', (request, socket, head) => {
      const origin = request.headers.origin;

      // RELAXED ORIGIN CHECK FOR DEBUGGING
      // Allow if origin is null, undefined, file://, or includes localhost
      const isAllowed = !origin || 
                        origin === 'null' || 
                        origin === 'undefined' || 
                        origin.startsWith('file://') || 
                        origin.includes('localhost') || 
                        origin.includes('127.0.0.1');

      if (!isAllowed) {
        console.error(`!!! SECURITY ALERT: Blocked unauthorized origin: ${origin}`);
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
      }

      // Origin is safe. Proceed to WebSocket upgrade.
      wsServer.handleUpgrade(request, socket, head, (ws) => {
        wsServer.emit('connection', ws, request);
      });
    });

  server.listen(this.options.port, async () => {
    console.log(`[HOP] Peer Gateway active on *:${this.options.port}`);
  });

    const wsServer = new WebSocketServer({ noServer: true })

    // WebSocket server
    wsServer.on('connection', async (ws) => {
      this.sockcount++ 
      this.wsocket = ws
      // if first peer experience wait until anchor is complete
      if (this.anchorState === true) {
        this.DataNetwork.setWebsocket(ws)
        this.wiring.library.setWebsocket(ws)
        this.wiring.safeflow.setWebsocket(ws)
        this.wiring.bbai.setWebsocket(ws)
      } else {
        await this.anchorHOP()
      }
      this.wsocket.id = uuidv4()

      this.wsocket.on('message', async (msg) => {
        // console.log('HOP message received')
        const o = JSON.parse(msg)
        // console.log(o)
        // check keys / pw and startup HOP if all secure
        if (o.type.trim() === 'hop-auth') {
          await this.messageAuth(o)
        } else {
          if (this.hoptoken === o.jwt)
          // listen of close / messages
          if (o.type.trim() === 'close') {
            this.closeHOP()
          } else {
            await this.messageResponder(o)
          }
        }
      })

      this.wsocket.on('close', ws => {
        console.log('close ws direct')
        process.exit(0)
      })

      this.wsocket.on('error', ws => {
        console.log('socket eeeerrrorrrr')
      })
      
    })

    process.on('unhandledRejection', function(err) {
     console.log(err)
    })

  }




Transfer latest bentoboxds code to /src/renderer/  folder

Edit router/index.js  to  HashHistory    for electron


Update  main package.json

Then select

Linux

Mac 

Window

YML  build file.  

git tag v0.7.80

# Push the tag to remote to fire off the GitHub Actions build and release pipeline
git push origin v0.7.80


Linux will build appImage

Mac will build to testFlight developer

Windows will build a exe


Linux Build detail

Run defaul yml .github/worksflows/build.yml


Windows build

replace .github/worksflows/build.yml with github actions

git commit v0.7.81

git push origin v0.7.81  for example


MAC build

update .github/worksflows/build.yml

commit and update as per windows


NOTE  see previous build code for published code.