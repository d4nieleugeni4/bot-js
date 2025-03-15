// Exibir informações no terminal
import './terminal/terminal.js';

// Conectar ao WhatsApp
import conectarWhatsApp from './conexao/conectar.js';
import fs from 'fs';
import path from 'path';

conectarWhatsApp().then((sock) => {
    // Carregar comandos
    const comandos = {};
    const comandosDir = path.join(process.cwd(), 'comandos');
    fs.readdirSync(comandosDir).forEach((pasta) => {
        const comandoPath = path.join(comandosDir, pasta);
        if (fs.statSync(comandoPath).isDirectory()) {
            const comando = import(comandoPath + '/ping.js');
            comandos[pasta] = comando;
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
}).catch((err) => console.error('Erro ao conectar:', err));
