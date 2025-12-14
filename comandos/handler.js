
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const comandos = {};

// Função para carregar todos os comandos das subpastas
async function carregarComandos() {
  const pastas = ['geral', 'adm', 'dono'];
  
  for (const pasta of pastas) {
    const pastaPath = path.join(__dirname, pasta);
    
    try {
      const arquivos = await fs.readdir(pastaPath);
      
      for (const arquivo of arquivos) {
        if (arquivo.endsWith('.js')) {
          const comandoPath = `./${pasta}/${arquivo}`;
          const modulo = await import(comandoPath);
          
          // O nome do comando é o nome do arquivo sem extensão
          const nomeComando = `.${arquivo.replace('.js', '')}`;
          comandos[nomeComando] = modulo;
          
          console.log(`✅ Comando carregado: ${nomeComando} (${pasta})`);
        }
      }
    } catch (error) {
      console.log(`⚠️  Pasta ${pasta} não encontrada ou vazia`);
    }
  }
}

// Carrega os comandos ao iniciar
await carregarComandos();

export function executarComando(nome, sock, m, text, from) {
  const comando = comandos[nome.toLowerCase()];
  if (comando && comando.executar) {
    comando.executar(sock, m, text, from);
    return true;
  }
  return false;
}

export function listarComandos() {
  return Object.keys(comandos);
}

export function getComandoInfo(nome) {
  const comando = comandos[nome];
  if (comando) {
    return {
      descricao: comando.descricao || 'Sem descrição',
      uso: comando.uso || nome,
      categoria: comando.categoria || 'geral'
    };
  }
  return null;
}

