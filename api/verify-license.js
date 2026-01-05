// api/verify-license.js
const express = require('express');
const cors = require('cors');
const app = express();

const APP_PASSWORD = "GRATISAN_COK"; // Hardcode Password

app.use(cors());
app.use(express.json());

// Pake tanda '/' artinya nangkep request yang masuk ke file ini
app.post('/', (req, res) => {
    const { accessCode } = req.body;
    if (accessCode && accessCode.trim() === APP_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(403).json({ error: "⛔ Kode Salah!" });
    }
});

module.exports = app;