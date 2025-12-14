
import { executarComando, getComandoInfo } from './comandos/handler.js';

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
    
    // Verifica se é um comando válido
    const infoComando = getComandoInfo(comando);
    if (!infoComando) return;
    
    // Tenta executar o comando
    const executado = executarComando(comando, sock, m, text, from);
    
    // Log para debug (opcional)
    if (executado) {
      console.log(`📝 Comando executado: ${comando} por ${m.key.participant || m.key.remoteJid}`);
    }
  });
}

