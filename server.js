const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database connected');
  }
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get scenarios by profession
app.get('/scenarios', (req, res) => {
  const code = req.query.profession;

  db.all(
    "SELECT * FROM scenarios WHERE profession_code = ?",
    [code],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Get single scenario
app.get('/scenario', (req, res) => {
  const id = req.query.id;

  db.get(
    "SELECT * FROM scenarios WHERE id = ?",
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    }
  );
});

// Get keywords for scenario
app.get('/keywords', (req, res) => {
  const scenarioId = req.query.scenario;

  db.all(
    "SELECT word, pronunciation FROM keywords WHERE scenario_id = ?",
    [scenarioId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
