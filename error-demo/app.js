const DebugAgent = require('../sdk/debug-agent');

const agent = new DebugAgent({
  apiUrl: "http://localhost:5050/log-error",
  service: "frontend-app"
});

// 🔥 GLOBAL ERROR HANDLING

process.on('uncaughtException', (err) => {
  console.log("💀 Uncaught Exception");

  // SDK will avoid duplicate automatically
  agent.captureError(err);
});

process.on('unhandledRejection', (err) => {
  console.log("💀 Unhandled Rejection");

  agent.captureError(err);
});

// 🔥 IMPORT FLOW
const api = require('./api');

// 🔥 START APP
async function start() {
  console.log("🚀 App started");

  try {
    await api.getUser();
  } catch (err) {
    // bubble up to global handler
    throw err;
  }
}

start();