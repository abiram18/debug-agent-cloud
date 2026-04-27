const DebugAgent = require('../sdk/debug-agent');

// 🔥 create agent for DB service
const agent = new DebugAgent({
  apiUrl: "http://localhost:5050/log-error",
  service: "db-service"
});

async function findUser() {
  console.log("🗄 DB query");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 💀 simulate DB failure
        throw new Error("Database connection timeout 💀");
      } catch (err) {
        // 🔥 send to debug agent
        agent.captureError(err, "db-service");

        // 🔥 also reject so flow breaks properly
        reject(err);
      }
    }, 1000);
  });
}

module.exports = { findUser };