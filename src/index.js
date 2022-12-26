require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const db = require('./config/db');
const routes = require('./routes');

// Connect DB
db.connect();

app.use(express.json());

// Cors to frontend
app.use(cors());

// Routes
routes(app);

app.listen(port, () => {
    console.log(`App listening http://localhost:${port}`);
});
