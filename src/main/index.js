'use strict'
import log from 'electron-log'
import fs from 'fs'
import path from 'path'
import os from 'os'

let currentLocation = __dirname
let removeLocation = currentLocation.slice(0, -18)
let tempLocation = removeLocation //  + 'resources'

// check if hop models has been setup i.e. first time use
let modelsHopName = os.platform() === 'win32' ? 'hop-models' : '.hop-models'
let modelsHopPath = path.join(os.homedir(), modelsHopName)

if (!fs.existsSync(modelsHopPath)) {
  let modelsInstall = path.join(tempLocation, './models-hop')
  // ensure destination parent exists (though homedir should)
  // now copy the models directory
  fs.cp(modelsInstall, modelsHopPath, { recursive: true }, (err) => {
    if (err) {
      console.error(err)
    }
  })
} else {
  console.log(`${modelsHopName} folder already exists`)
}

import { fork } from 'child_process'
log.info(tempLocation)
log.info('after first------')
// const child = spawn('node', [(path.join(tempLocation, '/hop/src/index.js'))])
const child = fork(path.join(tempLocation, '/hop/src/index.js'), [], {
  silent: true
})
child.on('error', (err) => {
  log.error('Child process error:', err)
})
child.on('exit', (code, signal) => {
  log.info(`Child process exited with code ${code} and signal ${signal}`)
})
if (child.stdout) {
  child.stdout.on('data', (data) => {
    log.info(`Child stdout: ${data}`)
  })
}
if (child.stderr) {
  child.stderr.on('data', (data) => {
    log.error(`Child stderr: ${data}`)
  })
}

// const { execSync } = require('child_process')
// execSync('sleep 2') // block process for 1 second.

import { app, shell, protocol, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import iconImg from '../../public/logo-512x512.png'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

// Disable certificate verification for localhost/local connections
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('allow-insecure-localhost');

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
    
async function pause () {

 await sleep(5000)

function createWindow() {
  console.log('Main Process: Creating window and checking command line switches...');
  console.log('Switches:', app.commandLine.hasSwitch('ignore-certificate-errors'));
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: true,
    autoHideMenuBar: false,
    // ...(process.platform === 'linux' ? { icon } : path.join(__dirname, '../../build/icon-512x512.png')),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      devTools: false,
      additionalArguments: ['--ignore-certificate-errors', '--allow-insecure-localhost']
    }
  })

  // Also append to command line for global effect
  app.commandLine.appendSwitch('ignore-certificate-errors');
  app.commandLine.appendSwitch('allow-insecure-localhost');

  mainWindow.webContents.openDevTools()

  mainWindow.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
    event.preventDefault()
    callback(true)
})

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })


  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')


  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substr(6);
    callback({ path: path.normalize(`${__dirname}/${url}`) });
  });

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })


ipcMain.on('message-from-vue', (event, arg) => {
  // console.log('message-from-vue')
  console.log(arg); // Print the message from Vue
  // restart HOP
  let currentLocation = __dirname
  let removeLocation = currentLocation.slice(0, -18)
  let tempLocation = removeLocation //  + 'resources'
  log.info('templocation calle dform ipcmain')
  log.info(tempLocation)
  // const child = spawn('node', [(path.join(tempLocation, '/hop/src/index.js'))])
  let pathJoin = path.join(tempLocation, '/hop/src/index.js')
  log.info('path info joine')
  log.info(pathJoin)
  const child = fork(path.join(tempLocation, '/hop/src/index.js'), [], {
    silent: true
  })
  child.on('error', (err) => {
    log.error('Child process error:', err)
  })
  child.on('exit', (code, signal) => {
    log.info(`Child process exited with code ${code} and signal ${signal}`)
  })
  if (child.stdout) {
    child.stdout.on('data', (data) => {
      log.info(`Child stdout: ${data}`)
    })
  }
  if (child.stderr) {
    child.stderr.on('data', (data) => {
      log.error(`Child stderr: ${data}`)
    })
  }
  log.info('after fokr')
  // You can also send a response back to Vue
  event.reply('message-from-main', 'Message received in main process');
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

}

pause()
