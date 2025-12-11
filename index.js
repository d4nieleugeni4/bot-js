const path = require("path");
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const readline = require("readline");
const pino = require("pino");
const { handleCommands } = require("./handleCommands.js");
const { participantsUpdate } = require("./participantsUpdate.js");

const question = (string) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(string, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, ".", "assets", "auth", "creds")
  );

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true, // também mostra o QR no terminal
    browser: ["Ubuntu", "Chrome", "110.0"],
  });

  // Pairing Code (quando não está conectado)
  if (!sock.authState.creds.registered) {
    let phone = await question("Informe o seu número (DDI + DDD + número): ");
    phone = phone.replace(/\D/g, "");

    if (!phone) throw new Error("Número inválido!");

    const code = await sock.requestPairingCode(phone);
    console.log("Código de pareamento:", code);
  }

  // Eventos de conexão
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log("❌ Conexão perdida:", lastDisconnect?.error);
      console.log("🔄 Reconectando...");

      if (shouldReconnect) connect();
    }

    if (connection === "open") {
      console.log("✅ Bot conectado com sucesso!");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  // Handlers
  handleCommands(sock);
  participantsUpdate(sock);

  return sock;
}

connect();
