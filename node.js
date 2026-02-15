// Pink Doulingo - Simple Node.js Server // Run: npm init -y && npm install express cors body-parser lowdb // Then: node server.js

const express = require('express'); const cors = require('cors'); const bodyParser = require('body-parser'); const { Low, JSONFile } = require('lowdb');

const app = express(); app.use(cors()); app.use(bodyParser.json());

// Database setup const adapter = new JSONFile('db.json'); const db = new Low(adapter);

async function initDB() { await db.read(); db.data ||= { users: [] }; await db.write(); }

// Create or login user app.post('/login', async (req, res) => { const { username } = req.body; if (!username) return res.status(400).json({ error: 'Username required' });

let user = db.data.users.find(u => u.username === username);

if (!user) { user = { username, xp: 0, streak: 0 }; db.data.users.push(user); await db.write(); }

res.json(user); });

// Save progress app.post('/save', async (req, res) => { const { username, xp, streak } = req.body;

let user = db.data.users.find(u => u.username === username); if (!user) return res.status(404).json({ error: 'User not found' });

user.xp = xp; user.streak = streak;

await db.write(); res.json({ success: true }); });

// Get leaderboard app.get('/leaderboard', async (req, res) => { const sorted = [...db.data.users].sort((a, b) => b.xp - a.xp); res.json(sorted.slice(0, 10)); });

// Start server const PORT = 3000; initDB().then(() => { app.listen(PORT, () => { console.log(Pink Doulingo server running on http://localhost:${PORT}); }); });