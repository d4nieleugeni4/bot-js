export const ping = {
  name: "ping",
  description: "Verifica se o bot está online",
  category: "geral",
  
  async execute(sock, m, from, text) {
    await sock.sendMessage(from, { 
      text: "🏓 pong! Bot está online!" 
    });
  }
};
