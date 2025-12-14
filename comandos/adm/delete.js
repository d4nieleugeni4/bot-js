
export async function executar(sock, m, text, from) {
  // Verifica se é um grupo
  if (!from.endsWith('@g.us')) {
    await sock.sendMessage(from, { 
      text: "❌ Este comando só funciona em grupos!" 
    });
    return;
  }
  
  // Verifica se tem permissão de admin
  const metadata = await sock.groupMetadata(from);
  const participant = metadata.participants.find(p => p.id === m.key.participant || p.id === m.key.remoteJid);
  
  if (!participant || (participant.admin !== 'admin' && participant.admin !== 'superadmin')) {
    await sock.sendMessage(from, { 
      text: "❌ Você precisa ser administrador para usar este comando!" 
    });
    return;
  }
  
  // Verifica se está respondendo a uma mensagem
  if (!m.message.extendedTextMessage?.contextInfo?.stanzaId) {
    await sock.sendMessage(from, { 
      text: "❌ Responda a uma mensagem com .delete para deletá-la!" 
    });
    return;
  }
  
  try {
    // Deleta a mensagem
    await sock.sendMessage(from, {
      delete: {
        id: m.message.extendedTextMessage.contextInfo.stanzaId,
        participant: m.key.participant || m.key.remoteJid,
        remoteJid: from
      }
    });
    
    // Confirmação silenciosa ou opcional
    // await sock.sendMessage(from, { text: "✅ Mensagem deletada com sucesso!" });
    
  } catch (error) {
    await sock.sendMessage(from, { 
      text: `❌ Erro ao deletar mensagem: ${error.message}` 
    });
  }
}

export const descricao = "Deleta uma mensagem em grupo (responda à mensagem)";
export const uso = ".delete";
export const categoria = "adm";

