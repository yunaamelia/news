#!/usr/bin/env node

/**
 * WhatsApp Notification System for Berita Finansial Development
 *
 * Mengirim update progress otomatis via WhatsApp menggunakan whatsapp-web.js
 * Kredensial dari: /home/senarokalie/Desktop/chatbot
 */

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Kredensial dari chatbot config
const ADMIN_PHONE = "6285345902520@c.us"; // Format: countrycode + number + @c.us
const BOT_NAME = "JARVIS - Berita Finansial Dev Bot";

class WhatsAppNotifier {
  constructor() {
    this.client = null;
    this.isReady = false;
  }

  async initialize() {
    console.log("🚀 Initializing WhatsApp Notifier...");

    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: "berita-finansial-dev-bot",
        dataPath: "/home/senarokalie/Desktop/berita-finansial/.wwebjs_auth",
      }),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    // Event: QR Code untuk autentikasi
    this.client.on("qr", (qr) => {
      console.log("📱 Scan QR code di terminal untuk autentikasi WhatsApp:");
      qrcode.generate(qr, { small: true });
    });

    // Event: Bot siap
    this.client.on("ready", () => {
      console.log("✅ WhatsApp Bot siap!");
      this.isReady = true;
      this.sendNotification(
        "🚀 *JARVIS Dev Bot Aktif*\n\nSaya akan mengirim update otomatis tentang progress development Berita Finansial."
      );
    });

    // Event: Autentikasi berhasil
    this.client.on("authenticated", () => {
      console.log("✅ Authenticated!");
    });

    // Event: Error
    this.client.on("auth_failure", (msg) => {
      console.error("❌ Authentication failed:", msg);
    });

    await this.client.initialize();
  }

  async sendNotification(message) {
    if (!this.isReady) {
      console.log("⏳ Bot belum siap, menunggu...");
      // Tunggu hingga ready
      await new Promise((resolve) => {
        const checkReady = setInterval(() => {
          if (this.isReady) {
            clearInterval(checkReady);
            resolve();
          }
        }, 1000);
      });
    }

    try {
      await this.client.sendMessage(ADMIN_PHONE, message);
      console.log(`📤 Notifikasi terkirim: ${message.substring(0, 50)}...`);
      return true;
    } catch (error) {
      console.error("❌ Gagal kirim notifikasi:", error.message);
      return false;
    }
  }

  async sendTaskUpdate(taskNumber, taskName, status, details = "") {
    const emoji =
      status === "completed" ? "✅" : status === "in-progress" ? "🔄" : "⏳";
    const message = `${emoji} *Task ${taskNumber}: ${taskName}*\n\nStatus: ${status}\n${details ? `\nDetail:\n${details}` : ""}`;
    return await this.sendNotification(message);
  }

  async sendPhaseComplete(phaseNumber, summary) {
    const message = `🎉 *Phase ${phaseNumber} COMPLETE!*\n\n${summary}`;
    return await this.sendNotification(message);
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      console.log("👋 WhatsApp Bot disconnected");
    }
  }
}

// Export untuk digunakan di script lain
module.exports = WhatsAppNotifier;

// Jika dijalankan langsung (testing)
if (require.main === module) {
  const notifier = new WhatsAppNotifier();

  notifier
    .initialize()
    .then(async () => {
      // Test notification
      await notifier.sendNotification(
        "🧪 *Test Notification*\n\nWhatsApp notification system berfungsi dengan baik!"
      );

      // Auto disconnect setelah 30 detik
      setTimeout(async () => {
        await notifier.disconnect();
        process.exit(0);
      }, 30000);
    })
    .catch((error) => {
      console.error("❌ Error:", error);
      process.exit(1);
    });
}
