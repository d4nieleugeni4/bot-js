import path from "path";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";
import readline from "readline";
import pino from "pino";
import { handleCommands } from "./handleCommands.js";
import { participantsUpdate } from "./participantsUpdate.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const question = (string) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(string, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

export async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "assets", "auth", "creds")
  );

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
    browser: ["Ubuntu", "Chrome", "110.0"]
  });

  if (!sock.authState.creds.registered) {
    let phone = await question("Informe seu número (DDI+DDD+número): ");
    phone = phone.replace(/\D/g, "");
    if (!phone) throw new Error("Número inválido!");

    const code = await sock.requestPairingCode(phone);
    console.log("Código de pareamento:", code);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log("❌ Conexão perdida:", lastDisconnect?.error);
      if (shouldReconnect) connect();
    }

    if (connection === "open") {
      console.log("✅ Bot conectado!");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  handleCommands(sock);
  participantsUpdate(sock);

  return sock;
}

connect();
