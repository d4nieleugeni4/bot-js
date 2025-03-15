// Exibir informações no terminal
require('./terminal/terminal.js');

// Conectar ao WhatsApp
const conectarWhatsApp = require('./conexao/conectar.js');
conectarWhatsApp().catch((err) => console.error('Erro ao conectar:', err));

const fs = require('fs');
const path = require('path');

// Carregar comandos
const comandos = {};
const comandosDir = path.join(__dirname, 'comandos');
fs.readdirSync(comandosDir).forEach((pasta) => {
    const comandoPath = path.join(comandosDir, pasta);
    if (fs.statSync(comandoPath).isDirectory()) {
        comandos[pasta] = require(comandoPath);
    }
});

// Executar comandos
sock.ev.on('messages.upsert', async (m) => {
    const message = m.messages[0];
    const texto = message.message?.conversation || '';
    const comando = Object.values(comandos).find((cmd) => texto.startsWith(`!${cmd.name}`));

    if (comando) {
        await comando.execute(sock, message);
    }
});
