import { executeCommand, commandExists } from "./comandos/index.js";

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

    if (!text || !text.startsWith(".")) return;

    // Remove o ponto e obtém o comando
    const commandText = text.slice(1).toLowerCase().trim();
    const args = commandText.split(" ");
    const commandName = args[0];
    const commandArgs = args.slice(1).join(" ");

    // Verifica se o comando existe
    if (commandExists(commandName)) {
      console.log(`📝 Comando executado: ${commandName} por ${from}`);
      
      try {
        await executeCommand(commandName, sock, m, from, commandArgs);
      } catch (error) {
        console.error(`❌ Erro ao executar comando ${commandName}:`, error);
        await sock.sendMessage(from, {
          text: `❌ Ocorreu um erro ao executar o comando: ${error.message}`
        });
      }
    }
  });
}
