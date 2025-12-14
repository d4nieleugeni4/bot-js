
export async function executar(sock, m, text, from) {
  const inicio = Date.now();
  await sock.sendMessage(from, { text: "🏓 Pong!" });
  const fim = Date.now();
  const tempo = fim - inicio;
  
  await sock.sendMessage(from, { 
    text: `⏱️ Latência: ${tempo}ms` 
  });
}

export const descricao = "Testa se o bot está online e mostra a latência";
export const uso = ".ping";
export const categoria = "geral";
