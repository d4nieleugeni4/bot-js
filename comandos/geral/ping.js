[file name]: comandos/geral/ping.js
[file content begin]
export async function executar(sock, m, text, from) {
  await sock.sendMessage(from, { text: "pong!" });
}

export const descricao = "Testa se o bot está online";
export const uso = ".ping";
[file content end]
