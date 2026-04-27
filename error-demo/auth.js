const DebugAgent = require('../sdk/debug-agent');

const agent = new DebugAgent({
  apiUrl: "http://localhost:5050/log-error",
  service: "auth-service"
});

const db = require('./db');

async function login() {
  console.log("🔐 Auth service");

  // 🔥 async error
  setTimeout(() => {
    const err = new Error("Auth service failed 💀");
    agent.captureError(err, "auth-service"); // ✅ correct tagging
  }, 500);

  return db.findUser();
}

module.exports = { login };