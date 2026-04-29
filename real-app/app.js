const DebugAgent = require('../sdk/debug-agent');

const agent = new DebugAgent({
  apiUrl: "https://debug-agent-cloud.onrender.com/log-error",
  service: "frontend-app"
});

// 🔥 global error catcher
process.on('uncaughtException', (err) => {
  console.log("💀 Uncaught Exception");
  agent.captureError(err, "db-service");
});

process.on('unhandledRejection', (err) => {
  console.log("💀 Unhandled Rejection");
  agent.captureError(err, "db-service");
});

const api = require('./api');

// simulate frontend request
async function startApp() {
  console.log("🚀 App started");

  try {
    const result = await api.getUser();
    console.log("User:", result);
  } catch (err) {
    throw err; // bubble up 💀
  }
}

startApp();