// api/verify-license.js
// VERSI MURNI VERCEL (TANPA EXPRESS)

export default function handler(req, res) {
    // 1. Setting CORS Manual (Biar frontend bisa masuk)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 2. Handle Preflight Request (Browser nanya izin)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. Logic Password
    const APP_PASSWORD = "GRATISAN_COK";
    const { accessCode } = req.body;

    if (accessCode && accessCode.trim() === APP_PASSWORD) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(403).json({ error: "⛔ Kode Salah!" });
    }
}