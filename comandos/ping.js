module.exports = {
    name: 'ping',
    description: 'Responde com "Pong!"',
    async execute(sock, message) {
        await sock.sendMessage(message.key.remoteJid, { text: 'Pong!' });
    }
};
