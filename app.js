const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');


let loginWindow;
let mainWindow;

function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 980,
        height: 668,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
        }
    });
    Menu.setApplicationMenu(null);
    loginWindow.loadFile('public/index.html');
}

// Função para criar a janela principal após o login
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    mainWindow.loadFile('public/main.html');
}

// Ouve o evento de login enviado pela janela de renderização
ipcMain.on('login-attempt', (event, loginData) => {
    const { username, password } = loginData;

    // Verifica as credenciais de login
    if (username === '123' && password === '123') {
        loginWindow.close();
        createMainWindow();
    } else {
        // Envia uma resposta de erro de volta para o processo de renderização
        event.reply('login-failed', 'Usuário ou senha incorretos');
    }
});

app.whenReady().then(() => {
    createLoginWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createLoginWindow();
    }
});
