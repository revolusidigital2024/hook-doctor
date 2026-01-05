// api/index.js - FINAL FIX ROUTING
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// HARDCODE PASSWORD
const APP_PASSWORD = "GRATISAN_COK"; 

app.use(cors()); 
app.use(express.json());

// --- ROUTES ---

// 1. TAMBAHIN LAGI '/api' DI DEPANNYA (INI KUNCINYA!)
app.post('/api/verify-license', (req, res) => {
    const { accessCode } = req.body;
    if (accessCode && accessCode.trim() === APP_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(403).json({ error: "⛔ Kode Salah!" });
    }
});

// 2. ANALYZE JUGA TAMBAHIN '/api'
app.post('/api/analyze-script', async (req, res) => {
    const { script, apiKey, accessCode } = req.body;

    if (!accessCode || accessCode.trim() !== APP_PASSWORD) {
        return res.status(403).json({ error: '⛔ Akses Ditolak.' });
    }
    if (!script) return res.status(400).json({ error: 'Script kosong!' });

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

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

// 3. DEBUGGING ROUTE (Biar tau kalau server nyala)
app.get('/api', (req, res) => {
    res.send("Server Nyala Bos! Masuk lewat Frontend ya.");
});

module.exports = app;