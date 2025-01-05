// Importar dependências necessárias
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicializa o cliente
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Quando o QR Code é gerado
client.on('qr', (qr) => {
    console.log('Digitalize este QR Code com o WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Quando o bot está pronto
client.on('ready', () => {
    console.log('Bot conectado e pronto para uso!');
});

// Escutando mensagens
client.on('message', async (message) => {
    const chat = await message.getChat();

    // Comando `.ping`
    if (message.body === '.ping') {
        message.reply('pong');
    }

    // Comando `.menu`
    else if (message.body === '.menu') {
        message.reply(`Comandos disponíveis:\n.ping - Responde "pong"\n.menu - Lista comandos\n.list-gp - Lista membros do grupo`);
    }

    // Comando `.list-gp`
    else if (message.body === '.list-gp') {
        if (chat.isGroup) {
            const participants = chat.participants;
            const mentions = participants.map((participant) => `@${participant.id.user}`);
            message.reply(`Integrantes do grupo:\n${mentions.join('\n')}`, undefined, { mentions: participants });
        } else {
            message.reply('Este comando só pode ser usado em grupos!');
        }
    }
});

// Iniciar o cliente
client.initialize();
