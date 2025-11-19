/**
 * Electron アプリケーションのメインプロセス
 * ドキュメント管理ツール v1.0
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * メインウィンドウを作成
 */
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // Node.js統合を有効化（ローカル環境での実装を容易にするため）
      nodeIntegration: true,
      contextIsolation: false,
      // セキュリティ警告を抑制
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'icon.png'),
    title: 'ドキュメント管理ツール v1.0'
  });

  // index.htmlを読み込む
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 開発者ツールを開く（開発時のみ）
  // mainWindow.webContents.openDevTools();
}

/**
 * アプリケーション起動時の処理
 */
app.whenReady().then(() => {
  createWindow();

  // macOSでアクティブ時にウィンドウがない場合は作成
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * 全ウィンドウが閉じられた時の処理
 */
app.on('window-all-closed', () => {
  // macOS以外ではアプリケーションを終了
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
