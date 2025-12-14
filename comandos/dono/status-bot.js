
// Lista de números autorizados (coloque seu número aqui)
const DONOS = [
  "5511999999999@s.whatsapp.net",  // Substitua pelo seu número
  "5511888888888@s.whatsapp.net"   // Adicione outros números se quiser
];

export async function executar(sock, m, text, from) {
  // Verifica se é dono
  const remetente = m.key.participant || m.key.remoteJid;
  
  if (!DONOS.includes(remetente)) {
    await sock.sendMessage(from, { 
      text: "❌ Acesso negado! Comando apenas para o dono do bot." 
    });
    return;
  }
  
  // Coleta informações do bot
  const info = {
    uptime: formatUptime(process.uptime()),
    memoria: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
    versaoNode: process.version,
    sistema: process.platform,
    comandosCarregados: Object.keys(require('../../handler.js').listarComandos() || {}).length
  };
  
  const statusMsg = `
🤖 *STATUS DO BOT*

⏰ *Uptime:* ${info.uptime}
💾 *Memória usada:* ${info.memoria}
⚡ *Node.js:* ${info.versaoNode}
🖥️ *Sistema:* ${info.sistema}
📊 *Comandos carregados:* ${info.comandosCarregados}
  
✅ *Bot operacional e conectado!*
  `.trim();
  
  await sock.sendMessage(from, { text: statusMsg });
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
}

export const descricao = "Mostra o status e informações do bot (apenas dono)";
export const uso = ".status-bot";
export const categoria = "dono";
