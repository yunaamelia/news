#!/bin/bash

# Quick WhatsApp Notification Script
# Usage: ./scripts/notify.sh "Your message here"

MESSAGE="${1:-🤖 Test notification from JARVIS}"

node -e "
const SimpleWhatsAppNotifier = require('./scripts/wa-notify.js');

(async () => {
  const notifier = new SimpleWhatsAppNotifier();
  await notifier.init();
  await notifier.send(\`$MESSAGE\`);
  setTimeout(() => {
    notifier.close();
    process.exit(0);
  }, 3000);
})();
"
