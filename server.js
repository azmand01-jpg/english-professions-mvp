const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('.')); // serves index.html

// DB
const db = new sqlite3.Database('./database.db');

// ROUTES

app.get('/scenarios', (req, res) => {
  const profession = req.query.profession;

  db.all(
    'SELECT id, title FROM scenarios WHERE profession_code = ?',
    [profession],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.get('/scenario', (req, res) => {
  const id = req.query.id;

  db.get(
    'SELECT context FROM scenarios WHERE id = ?',
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

app.get('/keywords', (req, res) => {
  const scenarioId = req.query.scenario;

  db.all(
    'SELECT word, pronunciation FROM keywords WHERE scenario_id = ?',
    [scenarioId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// CUSTOM USER INPUT
app.post('/scenario-custom', (req, res) => {
  const { profession, level, text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing text' });
  }

  const sql = `
    INSERT INTO custom_scenarios (profession_code, level, user_text)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [profession, level, text], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ success: true, id: this.lastID });
  });
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
