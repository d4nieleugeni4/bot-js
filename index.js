import { fileURLToPath } from 'url';
import path from 'path';
import {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import readline from 'readline';
import pino from 'pino';
import { handleCommands } from './handleCommands.js';
import { participantsUpdate } from './participantsUpdate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const question = (string) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(string, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

export const connect = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, ".", "assets", "auth", "creds")
  );

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    printQRInTerminal: false,
    version,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: true,
  });

  if (!sock.authState.creds.registered) {
    let phoneNumber = await question("Informe o seu número de telefone: ");
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");

    if (!phoneNumber) {
      throw new Error("Número de telefone inválido!");
    }

    const code = await sock.requestPairingCode(phoneNumber);
    console.log("Código de pareamento:", code);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Conexão fechada devido ao erro:", lastDisconnect.error, "Reconectando...", shouldReconnect);

      if (shouldReconnect) {
        connect();
      }
    } else if (connection === "open") {
      console.log("✅ Bot conectado com sucesso!");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  handleCommands(sock);
  participantsUpdate(sock);
  return sock;
};

// Executar o bot
connect();
