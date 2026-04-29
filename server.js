require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

let logs = [];
let analysis = "";

// LOG ERROR
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

  res.json({ message: "Logged" });
});

// GROQ AI
async function runAIAnalysis() {
  try {
    const formattedLogs = logs.map(l => `
Service: ${l.service}
Error: ${l.error}
`).join("\n");

    const prompt = `
Analyze errors:
${formattedLogs}
Give root cause and fix.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    analysis = response.data.choices[0].message.content;

  } catch (err) {
    console.error("❌ FULL GROQ ERROR:", err.response?.data || err.message);
    analysis = "AI failed";
  }
}

// DASHBOARD
app.get('/dashboard', (req, res) => {
  res.send(`
    <h1>Debug Dashboard</h1>
    <h2>AI Analysis</h2>
    <pre>${analysis}</pre>
    <h2>Logs</h2>
    ${logs.map(l => `<p>${l.error} (${l.service})</p>`).join("")}
  `);
});

// ROOT
app.get('/', (req, res) => {
  res.send("Server running 💀");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log("Running on", PORT));