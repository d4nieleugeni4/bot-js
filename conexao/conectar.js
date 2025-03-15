import { useMultiFileAuthState, makeInMemoryStore, default as Baileys } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';

async function conectarWhatsApp() {
    // Configuração do logger (exibição no terminal)
    const logger = pino({ level: 'silent' }); // Mude para 'debug' para ver logs detalhados

    // Armazenamento de autenticação
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    // Configuração do cliente
    const sock = Baileys.default({
        logger,
        auth: state,
        printQRInTerminal: true, // Exibe o QR Code no terminal
    });

    // Configuração de eventos
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error instanceof Boom && lastDisconnect.error.output.statusCode !== 403) {
                console.log('Conexão perdida. Reconectando...');
                conectarWhatsApp();
            } else {
                console.log('Conexão encerrada. Reinicie o bot.');
            }
        } else if (connection === 'open') {
            console.log('Bot LigIA conectado ao WhatsApp!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Iniciar conexão
    await sock.connect();
    return sock; // Retorna o cliente para uso em outros arquivos
}

export default conectarWhatsApp;
