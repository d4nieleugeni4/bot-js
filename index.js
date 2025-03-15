// Exibir informações no terminal
require('./terminal/terminal.js');

// Conectar ao WhatsApp
const conectarWhatsApp = require('./conexao/conectar.js');
conectarWhatsApp().catch((err) => console.error('Erro ao conectar:', err));
