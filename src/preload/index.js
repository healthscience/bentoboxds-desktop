import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'



/*
// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    contextBridge.exposeInMainWorld('electron', {
        ...electronAPI, // Spread the existing API
      send: (channel, data) => ipcRenderer.send(channel, data),
      receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
     })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
*/

/*
// Function to expose APIs
const exposeAPIs = () => {
  contextBridge.exposeInMainWorld('electron', {
      ...electronAPI, // Existing Electron API
      send: (channel, data) => ipcRenderer.send(channel, data),
      receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
  });
};

try {
  // Check if the electron API is already exposed
  if (!window.electron) {
      exposeAPIs(); // Call the function to expose APIs
  }
} catch (error) {
  console.error('Failed to expose Electron APIs:', error);
}
  */

// Function to expose APIs
const exposeAPIs = () => {
  contextBridge.exposeInMainWorld('electron', {
      ...electronAPI, // Existing Electron API
      send: (channel, data) => ipcRenderer.send(channel, data),
      receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => {
          console.log(`Received message dfdfddd from channel "${channel}":`, ...args); // Log the received message
          func(...args);
      })
  });
};

try {
  // Check if the electron API is already exposed
  if (!window.electron) {
      exposeAPIs(); // Call the function to expose APIs
  }
} catch (error) {
  console.error('Failed to expose Electron APIs:', error);
}