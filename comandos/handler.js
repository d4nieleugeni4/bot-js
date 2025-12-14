
import * as ping from './geral/ping.js';

const comandos = {
  '.ping': ping
};

export function executarComando(nome, sock, m, text, from) {
  const comando = comandos[nome.toLowerCase()];
  if (comando) {
    comando.executar(sock, m, text, from);
    return true;
  }
  return false;
}

export function listarComandos() {
  return Object.keys(comandos);
}
[file content end]
