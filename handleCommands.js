export function handleCommands(sock) {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m || !m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const type = Object.keys(m.message)[0];

    const text =
      m.message.conversation ||
      m.message[type]?.text ||
      m.message.extendedTextMessage?.text ||
      "";

    // --- BOTÃO RESPOSTA ---
    if (m.message?.buttonsResponseMessage) {
      const buttonId = m.message.buttonsResponseMessage.selectedButtonId;

      if (buttonId === "sim_btn") {
        await sock.sendMessage(from, { text: "✔ Você escolheu: SIM" });
      }

      if (buttonId === "nao_btn") {
        await sock.sendMessage(from, { text: "❌ Você escolheu: NÃO" });
      }

      return;
    }

    // --- COMANDO PARA ENVIAR OS BOTÕES ---
    if (text.toLowerCase() === ".confirmar") {
      await sock.sendMessage(from, {
        text: "Deseja continuar?",
        buttons: [
          { buttonId: "sim_btn", buttonText: { displayText: "SIM" }, type: 1 },
          { buttonId: "nao_btn", buttonText: { displayText: "NÃO" }, type: 1 }
        ],
        headerType: 1
      });
      return;
    }
  });
}
