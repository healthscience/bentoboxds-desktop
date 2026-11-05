'use strict'
import log from 'electron-log'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { app, shell, protocol, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { fork } from 'child_process'

const isDev = !app.isPackaged
const tempLocation = isDev 
  ? path.join(__dirname, '../../') 
  : process.resourcesPath

// Check if hop models has been setup i.e. first time use
let modelsHopName = os.platform() === 'win32' ? 'hop-models' : '.hop-models'
let modelsHopPath = path.join(os.homedir(), modelsHopName)

if (!fs.existsSync(modelsHopPath)) {
  let modelsInstall = path.join(tempLocation, './models-hop')
  fs.cp(modelsInstall, modelsHopPath, { recursive: true }, (err) => {
    if (err) {
      console.error(err)
    }
  })
} else {
  log.info(`${modelsHopName} folder already exists`)
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

// Disable certificate verification for localhost/local connections
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('allow-insecure-localhost')

// Start HOP child process
log.info('Temp Location:', tempLocation)
const hopScriptPath = path.join(tempLocation, 'hop', 'src', 'index.js')
log.info('Launching HOP from:', hopScriptPath)

const child = fork(hopScriptPath, [], {
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
    log.error(`Child stderr: ${data.toString()}`)
    console.error(`Child stderr: ${data.toString()}`)
  })
}

function createWindow() {
  log.info('Main Process: Creating window...')
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: true,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      devTools: true,
      additionalArguments: ['--ignore-certificate-errors', '--allow-insecure-localhost']
    }
  })

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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substr(6)
    callback({ path: path.normalize(`${__dirname}/${url}`) })
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.on('message-from-vue', (event, arg) => {
  log.info('Message from Vue:', arg)
  log.info('Restarting HOP from tempLocation:', tempLocation)
  
  const restartPath = path.join(tempLocation, 'hop', 'src', 'index.js')
  log.info('Restart path:', restartPath)

  const restartChild = fork(restartPath, [], {
    silent: true
  })

  restartChild.on('error', (err) => {
    log.error('Restarted child process error:', err)
  })

  restartChild.on('exit', (code, signal) => {
    log.info(`Restarted child process exited with code ${code} and signal ${signal}`)
  })

  if (restartChild.stdout) {
    restartChild.stdout.on('data', (data) => {
      log.info(`Restarted Child stdout: ${data}`)
    })
  }

  if (restartChild.stderr) {
    restartChild.stderr.on('data', (data) => {
      log.error(`Restarted Child stderr: ${data.toString()}`)
    })
  }

  event.reply('message-from-main', 'Message received in main process')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})