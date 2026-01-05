// api/analyze-script.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const APP_PASSWORD = "GRATISAN_COK"; // Password yang sama

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    const { script, apiKey, accessCode } = req.body;

    // Cek Password lagi biar aman
    if (!accessCode || accessCode.trim() !== APP_PASSWORD) {
        return res.status(403).json({ error: '⛔ Akses Ditolak.' });
    }
    if (!script) return res.status(400).json({ error: 'Script kosong!' });

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Peran: "The Hook Doctor". Intro User: "${script}".
        Instruksi: Pake Bahasa Gaul. ROASTING pedas.
        Output JSON: {"score": number, "critique": string, "better_hooks": ["Hook 1", "Hook 2", "Hook 3"]}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        res.json(JSON.parse(text));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal. Cek API Key Gemini lo.' });
    }
});

module.exports = app;