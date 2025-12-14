[file name]: handleCommands.js
[file content begin]
import { executarComando } from './comandos/handler.js';

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

    if (!text) return;

    // Extrai o comando (primeira palavra)
    const comando = text.trim().split(' ')[0];
    
    // Tenta executar o comando
    const executado = executarComando(comando, sock, m, text, from);
    
    // Se quiser adicionar uma resposta para comandos não encontrados
    // if (!executado) {
    //   await sock.sendMessage(from, { 
    //     text: `Comando não encontrado. Digite .ajuda para ver os comandos disponíveis.` 
    //   });
    // }
  });
}
[file content end]
