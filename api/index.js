// api/index.js - VERCEL COMPATIBLE VERSION
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// HARDCODE PASSWORD BIAR 100% AMAN (Gak usah pusing env var dulu)
const APP_PASSWORD = "GRATISAN_COK"; 

app.use(cors()); 
app.use(express.json());

// --- ROUTES (Tanpa awalan /api karena udah di-handle vercel.json) ---

// 1. CEK LICENSE
app.post('/verify-license', (req, res) => {
    const { accessCode } = req.body;
    // Pake trim() biar spasi gak sengaja kehapus
    if (accessCode && accessCode.trim() === APP_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(403).json({ error: "⛔ Kode Salah!" });
    }
});

// 2. CEK SCRIPT (ANALISA)
app.post('/analyze-script', async (req, res) => {
    const { script, apiKey, accessCode } = req.body;

    if (!accessCode || accessCode.trim() !== APP_PASSWORD) {
        return res.status(403).json({ error: '⛔ Akses Ditolak.' });
    }
    if (!script) return res.status(400).json({ error: 'Script kosong!' });

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

// 3. ROOT CHECK (Buat ngetes kalau dibuka langsung)
app.get('/', (req, res) => {
    res.send("Backend Server is Running! 🔥");
});

// WAJIB BUAT VERCEL
module.exports = app;