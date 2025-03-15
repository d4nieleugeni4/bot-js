const { useMultiFileAuthState, makeInMemoryStore } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');

async function conectarWhatsApp() {
    const logger = pino({ level: 'silent' }); // Silencia os logs (mude para 'debug' se quiser ver detalhes)

    // Armazenamento de autenticação
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    // Configuração do cliente
    const sock = makeInMemoryStore({ logger });
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
}

module.exports = conectarWhatsApp;
