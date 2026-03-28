/**
 * Secure renderer bridge. Expose only allowlisted APIs via contextBridge.
 *
 * Extension points (AGENT-22+): add ipcMain.handle in main.js and matching
 * invoke() methods here — never expose raw ipcRenderer or nodeIntegration.
 */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("skyfallElectron", {
  quit: () => ipcRenderer.send("skyfall:quit"),
  platform: process.platform,
  getUserDataPath: () => ipcRenderer.invoke("skyfall:get-user-data-path"),
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome
  }
});

contextBridge.exposeInMainWorld("electronQuit", () => {
  ipcRenderer.send("skyfall:quit");
});
