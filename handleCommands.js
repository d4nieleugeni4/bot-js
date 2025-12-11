module.exports.handleCommands = (sock) => {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m || !m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;

    // Obtém o texto corretamente na versão nova
    const type = Object.keys(m.message)[0];
    const text =
      m.message.conversation ||
      m.message[type]?.text ||
      m.message.extendedTextMessage?.text ||
      "";

    if (!text) return;

    // Comando ping
    if (text.toLowerCase().startsWith(".ping")) {
      await sock.sendMessage(from, { text: "pong!" });
    }
  });
};
