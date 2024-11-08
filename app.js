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
ipcMain.on('save-product', (event, produto, imagemBase64) => {
    // Define caminhos
    const produtosPath = path.join(__dirname, 'products.json');
    const imagemPath = path.join(__dirname, 'public', 'img', produto.image);

    // Salva a imagem na pasta `public/img`
    const base64Data = imagemBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(imagemPath, imageBuffer);

    // Lê o arquivo `products.json`, adiciona o novo produto e salva
    fs.readFile(produtosPath, 'utf8', (err, data) => {
        let produtos = [];
        
        if (!err) {
            produtos = JSON.parse(data); // Lê produtos existentes se o arquivo já existe
        } else if (err.code !== 'ENOENT') {
            throw err; // Lança erros inesperados
        }

        // Define o ID do produto como o próximo ID (começando por 3)
        const nextId = produtos.length ? Math.max(...produtos.map(p => p.id)) + 1 : 3;
        produto.id = nextId;

        produtos.push(produto);

        // Ordena por ID antes de salvar
        produtos.sort((a, b) => a.id - b.id);

        // Salva a lista atualizada em `products.json`
        fs.writeFile(produtosPath, JSON.stringify(produtos, null, 2), (writeErr) => {
            if (writeErr) throw writeErr;
            console.log("Produto salvo com sucesso!");
        });
    });
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
