const fetch = require('node-fetch');

class DebugAgent {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.service = config.service;
  }

  async captureError(error, sourceService = this.service) {
    try {
      // 🔥 prevent duplicate capture
      if (error._captured) return;
      error._captured = true;

      await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: error.toString(),
          stack: error.stack,
          service: sourceService
        })
      });

      console.log("🚀 Error sent:", sourceService);

    } catch (err) {
      console.error("❌ Failed:", err.message);
    }
  }
}

module.exports = DebugAgent;