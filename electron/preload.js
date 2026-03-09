const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronQuit", () => {
  ipcRenderer.send("quit");
});
