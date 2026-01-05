// api/index.js
// INI BACKEND VERSI VERCEL (Serverless)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Password Rahasia (Nanti set di Vercel: APP_PASSWORD)
const APP_PASSWORD = "GRATISAN_COK";

app.use(cors()); // Di Vercel gak perlu setting origin ketat
app.use(express.json());

// --- 1. CEK LICENSE ---
app.post('/api/verify-license', (req, res) => {
    const { accessCode } = req.body;
    if (accessCode === APP_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(403).json({ error: "⛔ Kode Salah!" });
    }
});

// --- 2. CEK LICENSE + KEY ---
app.post('/api/analyze-script', async (req, res) => {
    const { script, apiKey, accessCode } = req.body;

    if (accessCode !== APP_PASSWORD) return res.status(403).json({ error: '⛔ Akses Ditolak.' });
    if (!script) return res.status(400).json({ error: 'Script kosong!' });

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Pake 1.5 Flash biar stabil di Vercel

        const prompt = `
        Peran: "The Hook Doctor" (Produser YouTube Savage).
        Intro User: "${script}"
        Instruksi: Pake Bahasa Gaul (Lo/Gue). ROASTING pedas kalau jelek.
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

// PENTING BUAT VERCEL:
module.exports = app;