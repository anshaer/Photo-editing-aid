const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');

let mainWindow;
let isClickThrough = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  globalShortcut.register('CommandOrControl+Shift+X', () => {
    isClickThrough = !isClickThrough;
    mainWindow.setIgnoreMouseEvents(isClickThrough, { forward: true });
    mainWindow.webContents.send('toggle-mode', isClickThrough);
  });

  // 新增：接收前端傳來的最小化與關閉指令
  ipcMain.on('window-minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('window-close', () => {
    mainWindow.close();
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
