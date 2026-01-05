// api/analyze-script.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // 1. Setting CORS Manual
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Logic Utama
    const APP_PASSWORD = "GRATISAN_COK";
    const { script, apiKey, accessCode } = req.body;

    if (!accessCode || accessCode.trim() !== APP_PASSWORD) {
        return res.status(403).json({ error: '⛔ Akses Ditolak.' });
    }
    if (!script) {
        return res.status(400).json({ error: 'Script kosong!' });
    }

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
        
        return res.status(200).json(JSON.parse(text));

    } catch (error) {
        console.error("Gemini Error:", error);
        return res.status(500).json({ error: 'Gagal. Cek API Key Gemini lo.' });
    }
}