const DebugAgent = require('./sdk/debug-agent');

const agent = new DebugAgent({
  apiUrl: "https://debug-agent-cloud.onrender.com/log-error",
  service: "test-app"
});

// 🔥 auto capture
process.on('uncaughtException', (err) => {
  agent.captureError(err);
});

process.on('unhandledRejection', (err) => {
  agent.captureError(err);
});

// 🔥 simulate multiple errors
setTimeout(() => {
  throw new Error("Database timeout");
}, 1000);

setTimeout(() => {
  Promise.reject("API failed");
}, 2000);

setTimeout(() => {
  const data = undefined;
  data.map(x => x);
}, 3000);