const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let isClickThrough = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    transparent: true,    // 允許背景透明
    frame: false,         // 無邊框視窗
    alwaysOnTop: true,    // 永遠置頂
    hasShadow: false,     // Mac 取消視窗陰影，看起來更乾淨
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // 為了簡化此微型工具的架構，允許前端直接使用 Node 模組
    }
  });

  mainWindow.loadFile('index.html');

  // 註冊全域快捷鍵：Cmd+Shift+X (Mac) 或 Ctrl+Shift+X (Win)
  globalShortcut.register('CommandOrControl+Shift+X', () => {
    isClickThrough = !isClickThrough;
    
    // 切換滑鼠穿透狀態
    mainWindow.setIgnoreMouseEvents(isClickThrough, { forward: true });
    
    // 通知前端介面更新狀態提示
    mainWindow.webContents.send('toggle-mode', isClickThrough);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 退出時註銷快捷鍵
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
