'use strict'
import log from 'electron-log'
import fs from 'fs'
import path from 'path'
import os from 'os'


let currentLocation = __dirname
let removeLocation = currentLocation.slice(0, -18)
let tempLocation = removeLocation //  + 'resources'






import { execSync } from 'child_process'
import { fork } from 'child_process'
// Fix macOS environment variables
function fixMacOSEnvironment() {
 if (process.platform === 'darwin') {
   try {
     // Get environment from user's shell
     const shellEnv = execSync('env', {
       encoding: 'utf8',
       shell: '/bin/bash -l' // Use login shell to get full environment
     })
    
     // Parse and set environment variables
     shellEnv.split('\n').forEach(line => {
       const [key, ...valueParts] = line.split('=')
       if (key && valueParts.length > 0) {
         const value = valueParts.join('=')
         if (!process.env[key]) {
           process.env[key] = value
         }
       }
     })
    
     // Ensure Node.js is in PATH
     if (!process.env.PATH.includes('/usr/local/bin')) {
       process.env.PATH = `/usr/local/bin:${process.env.PATH}`
     }
     if (!process.env.PATH.includes('/opt/homebrew/bin')) {
       process.env.PATH = `/opt/homebrew/bin:${process.env.PATH}`
     }
    
     console.log('macOS environment fixed')
   } catch (error) {
     console.warn('Could not fix macOS environment:', error.message)
   }
 }
}


// Call this before fork()
fixMacOSEnvironment()


// Then use fork with explicit environment
const child = fork(path.join(tempLocation, '/hop/src/index.js'), [], {
 env: process.env,
 cwd: path.join(tempLocation, '/hop'),
 silent: false
})










// check if hop models has been setup i.e. first time use
let modelsHopPath = os.homedir() + '/' + '.hop-models'
if (!fs.existsSync(modelsHopPath)) {
 let modelsInstall = path.join(tempLocation, './models-hop')
 fs.mkdirSync(modelsHopPath)
 // now copy the models directory
 fs.cp(modelsInstall, modelsHopPath, { recursive: true }, (err) => {
   if (err) {
     console.error(err)
   }
 })
} else {
 console.log('.models-hop folder already exists')
}


// import { fork } from 'child_process'
log.info(tempLocation)
log.info('after first------')
// const child = spawn('node', [(path.join(tempLocation, '/hop/src/index.js'))])
// fork(path.join(tempLocation, '/hop/src/index.js'))


// const { execSync } = require('child_process')
// execSync('sleep 2') // block process for 1 second.


import { app, shell, protocol, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import iconImg from '../../public/logo-512x512.png'


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])


function sleep (ms) {
   return new Promise(resolve => setTimeout(resolve, ms))
}
  
async function pause () {


await sleep(6000)


function createWindow() {
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
     devTools: true
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
 fork(path.join(tempLocation, '/hop/src/index.js'))
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


