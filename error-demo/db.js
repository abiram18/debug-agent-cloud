const DebugAgent = require('../sdk/debug-agent');

const agent = new DebugAgent({
  apiUrl: "https://debug-agent-cloud.onrender.com/log-error",
  service: "db-service"
});

function findUser() {
  console.log("🗄 DB query");

  try {
    const data = undefined;
    return data.map(x => x); // 💀 runtime error
  } catch (err) {
    agent.captureError(err, "db-service"); // ✅ correct tagging
    throw err; // keep flow
  }
}

module.exports = { findUser };