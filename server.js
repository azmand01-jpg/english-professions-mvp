const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());

const db = new sqlite3.Database('./database.db');

// INIT DB (run only once)
const fs = require('fs');
if (!fs.existsSync('./database.db')) {
    const initSQL = fs.readFileSync('./init.sql', 'utf8');
    db.exec(initSQL);
    console.log("Database created");
}

// ROUTES

// get professions
app.get('/professions', (req, res) => {
    db.all("SELECT * FROM professions", [], (err, rows) => {
        res.json(rows);
    });
});

// get scenarios by profession
app.get('/scenarios', (req, res) => {
    const code = req.query.profession;

    db.all(
        "SELECT * FROM scenarios WHERE profession_code = ?",
        [code],
        (err, rows) => {
            res.json(rows);
        }
    );
});

// get single scenario (FULL DESCRIPTION)
app.get('/scenario', (req, res) => {
    const id = req.query.id;

    db.get(
        "SELECT * FROM scenarios WHERE id = ?",
        [id],
        (err, row) => {
            res.json(row);
        }
    );
});

// get keywords
app.get('/keywords', (req, res) => {
    const scenarioId = req.query.scenario;

    db.all(
        "SELECT * FROM keywords WHERE scenario_id = ?",
        [scenarioId],
        (err, rows) => {
            res.json(rows);
        }
    );
});

// start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});