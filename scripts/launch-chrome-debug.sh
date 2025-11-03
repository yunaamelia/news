#!/bin/bash

# Script to launch Chrome with remote debugging for MCP DevTools
# Usage: ./scripts/launch-chrome-debug.sh [url]

PORT=9222
DEFAULT_URL="http://localhost:3000"
URL="${1:-$DEFAULT_URL}"

echo "🚀 Launching Chrome with remote debugging..."
echo "📍 Port: $PORT"
echo "🌐 URL: $URL"

# Force use Google Chrome only
if command -v google-chrome &> /dev/null; then
    CHROME_BIN="google-chrome"
elif command -v google-chrome-stable &> /dev/null; then
    CHROME_BIN="google-chrome-stable"
elif [ -f "/usr/bin/google-chrome" ]; then
    CHROME_BIN="/usr/bin/google-chrome"
elif [ -f "/usr/bin/google-chrome-stable" ]; then
    CHROME_BIN="/usr/bin/google-chrome-stable"
else
    echo "❌ Google Chrome not found. Please install Google Chrome:"
    echo "   wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"
    echo "   sudo dpkg -i google-chrome-stable_current_amd64.deb"
    echo "   sudo apt-get install -f"
    exit 1
fi

echo "✅ Found: $CHROME_BIN"

# Kill existing Chrome instances on the debug port
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port $PORT already in use. Attempting to free it..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Launch Chrome with remote debugging (minimized window mode)
$CHROME_BIN \
  --remote-debugging-port=$PORT \
  --no-first-run \
  --no-default-browser-check \
  --disable-features=TranslateUI \
  --disable-popup-blocking \
  --start-minimized \
  --window-position=-2400,-2400 \
  --user-data-dir="/tmp/chrome-debug-profile" \
  "$URL" &

CHROME_PID=$!

echo ""
echo "✅ Chrome launched (PID: $CHROME_PID)"
echo "📡 Remote debugging: http://localhost:$PORT"
echo "🔧 DevTools JSON: http://localhost:$PORT/json"
echo ""
echo "Press Ctrl+C to stop Chrome..."

# Wait for Chrome process
wait $CHROME_PID
