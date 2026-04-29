require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

let logs = [];
let analysis = "";

// 🔥 LOG ERROR API
app.post('/log-error', (req, res) => {
  const log = {
    id: Date.now(),
    error: req.body.error,
    stack: req.body.stack || "No stack",
    service: req.body.service || "unknown",
    time: new Date()
  };

  console.log("📩 Error:", log);

  logs.push(log);
  runAIAnalysis();

  res.json({ message: "Logged successfully" });
});

// 🔥 GROQ AI ANALYSIS
async function runAIAnalysis() {
  try {
    if (logs.length === 0) return;

    const formattedLogs = logs.map(l => `
Service: ${l.service}
Error: ${l.error}
Stack: ${l.stack}
`).join("\n");

    const prompt = `
Analyze the following system errors.

Give output in this format:
1. Root Cause
2. Which service is failing
3. Why
4. Fix

Errors:
${formattedLogs}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are an expert debugging assistant." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    analysis = response.data.choices[0].message.content;

    console.log("🧠 AI Analysis Updated");

  } catch (err) {
    console.error("❌ FULL GROQ ERROR:", err.response?.data || err.message);
    analysis = "AI analysis failed";
  }
}

// 🔥 GROUP ERRORS
function groupErrors(logs) {
  const map = {};

  logs.forEach(l => {
    if (!map[l.error]) {
      map[l.error] = {
        error: l.error,
        count: 1,
        service: l.service
      };
    } else {
      map[l.error].count++;
    }
  });

  return Object.values(map);
}

// 🎨 DASHBOARD UI
app.get('/dashboard', (req, res) => {
  const groups = groupErrors(logs);

  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>Debug Agent Dashboard</title>
    <meta http-equiv="refresh" content="3">
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #0f172a, #020617);
        color: #e2e8f0;
        padding: 20px;
      }

      h1 {
        text-align: center;
        color: #38bdf8;
      }

      .container {
        max-width: 1000px;
        margin: auto;
      }

      .card {
        background: rgba(30,41,59,0.8);
        backdrop-filter: blur(10px);
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        border: 1px solid rgba(56,189,248,0.3);
      }

      .ai {
        border-left: 5px solid #38bdf8;
      }

      .log {
        border-left: 5px solid #f87171;
      }

      pre {
        white-space: pre-wrap;
        word-break: break-word;
      }

      .error {
        color: #f87171;
        font-weight: bold;
      }

      .count {
        color: #facc15;
      }

      .service {
        color: #4ade80;
      }
    </style>
  </head>

  <body>

    <h1>🚀 Debug Agent Dashboard</h1>

    <div class="container">

      <div class="card ai">
        <h2>🧠 AI Analysis</h2>
        <pre>${analysis}</pre>
      </div>

      <div class="card">
        <h2>🔥 Error Groups</h2>

        ${groups.map(g => `
          <div class="card log">
            <div class="error">Error: ${g.error}</div>
            <div class="count">Count: ${g.count}</div>
            <div class="service">Service: ${g.service}</div>
          </div>
        `).join('')}

      </div>

    </div>

  </body>
  </html>
  `);
});

// ROOT
app.get('/', (req, res) => {
  res.send("Debug Agent Cloud Running 💀");
});

// PORT
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});