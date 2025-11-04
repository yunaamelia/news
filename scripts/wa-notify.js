#!/usr/bin/env node

/**
 * WhatsApp Notification via Existing Chatbot Session
 *
 * Menggunakan session WhatsApp yang sudah authenticated dari:
 * /home/senarokalie/Desktop/chatbot/.wwebjs_auth
 */

const { Client, LocalAuth } = require("whatsapp-web.js");

// Kredensial dari chatbot
const ADMIN_PHONE = "6285345902520@c.us";
const AUTH_PATH = "/home/senarokalie/Desktop/chatbot/.wwebjs_auth";

class SimpleWhatsAppNotifier {
  constructor() {
    this.client = null;
    this.ready = false;
  }

  async init() {
    console.log("🚀 Connecting to WhatsApp...");

    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: AUTH_PATH,
      }),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    this.client.on("ready", () => {
      console.log("✅ WhatsApp connected!");
      this.ready = true;
    });

    this.client.on("authenticated", () => {
      console.log("✅ Using existing session");
    });

    await this.client.initialize();

    // Wait for ready
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (this.ready) {
          clearInterval(check);
          resolve();
        }
      }, 500);
    });
  }

  async send(message) {
    if (!this.ready) {
      console.log("⏳ Waiting for WhatsApp...");
      return false;
    }

    try {
      await this.client.sendMessage(ADMIN_PHONE, message);
      console.log(`✅ Sent: ${message.substring(0, 50)}...`);
      return true;
    } catch (error) {
      console.error("❌ Error:", error.message);
      return false;
    }
  }

  async close() {
    if (this.client) {
      await this.client.destroy();
    }
  }
}

// Export
module.exports = SimpleWhatsAppNotifier;

// Test jika dijalankan langsung
if (require.main === module) {
  const notifier = new SimpleWhatsAppNotifier();

  notifier.init().then(async () => {
    await notifier.send(
      "🤖 *JARVIS Dev Bot*\n\nTest notification from Berita Finansial development!"
    );

    setTimeout(async () => {
      await notifier.close();
      process.exit(0);
    }, 3000);
  });
}
