// src/App.jsx - GEMINI 3 FLASH EDITION
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';

function App() {
  const APP_PASSWORD = "GRATISAN_COK"; 
  
  const [accessCode, setAccessCode] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [script, setScript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  
  const [isLicenseVerified, setIsLicenseVerified] = useState(false);
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    const savedCode = localStorage.getItem('app_access_code');
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedCode === APP_PASSWORD) { setAccessCode(savedCode); setIsLicenseVerified(true); }
    if (savedKey) { setApiKey(savedKey); setIsKeySaved(true); }
  }, []);

  const handleVerifyLicense = () => {
    setIsLoading(true);
    if (accessCode.trim() === APP_PASSWORD) {
        localStorage.setItem('app_access_code', accessCode);
        setIsLicenseVerified(true);
        setStatusMsg(null);
    } else {
        setStatusMsg({type: 'error', text: '⛔ Kode Salah Bro!'});
    }
    setIsLoading(false);
  };

  const handleSaveKey = () => {
      localStorage.setItem('gemini_api_key', apiKey);
      setIsKeySaved(true);
      setStatusMsg({type: 'success', text: 'Key Gemini 3 Ready!'});
      setTimeout(() => setStatusMsg(null), 2000);
  };

  const handleChangeKey = () => { setIsKeySaved(false); };
  const handleLogout = () => { localStorage.clear(); location.reload(); };

  const handleAnalyze = async () => {
    if (!apiKey) { setStatusMsg({type: 'error', text: 'API Key kosong!'}); return; }
    if (!script) { setStatusMsg({type: 'error', text: 'Script kosong!'}); return; }
    
    setIsLoading(true); setAnalysis(null); setStatusMsg(null);
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // 🔥 UPDATE: PAKE JALUR BETA BUAT GEMINI 3 🔥
      const model = genAI.getGenerativeModel({ 
          model: "gemini-3-flash-preview", 
          apiVersion: "v1beta" // INI KUNCINYA
      });

      const prompt = `
      Peran: "The Hook Doctor" (Produser YouTube Savage).
      Intro User: "${script}"
      Instruksi: Pake Bahasa Gaul (Lo/Gue). ROASTING pedas kalau jelek.
      Output JSON: {"score": number, "critique": string, "better_hooks": ["Hook 1", "Hook 2", "Hook 3"]}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
      
      setAnalysis(JSON.parse(text));

    } catch (err) { 
        console.error("Gemini Error:", err);
        // Tampilkan pesan error detail
        let msg = "Gagal. ";
        if (err.message.includes("404")) msg += "Model belum tersedia buat API Key lo (Coba ganti ke gemini-1.5-flash dulu).";
        else msg += "Cek API Key atau Kuota.";
        setStatusMsg({type: 'error', text: msg}); 
    } finally { setIsLoading(false); }
  };

  return (
    <div className="App">
      {!isLicenseVerified ? (
          <header className="centered-gate">
            <h1>🔐 Private Access</h1>
            <p>Masukkan Kode Akses Gratis</p>
            <div className="step-box">
                <input type="text" placeholder="Kode Akses..." value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
                <button className="btn-primary" onClick={handleVerifyLicense}>{isLoading ? '...' : 'Masuk 🚀'}</button>
                {statusMsg && <div className={`status-msg ${statusMsg.type}`}>{statusMsg.text}</div>}
            </div>
            <small style={{marginTop: '20px', color: '#64748b'}}>@2024-2026 Revolusi Digital</small>
          </header>
      ) : (
          <>
            <header className="dashboard-header">
                <div className="brand"><h1>🪝 Hook Doctor</h1><span className="vip-badge">GEMINI 3</span></div>
                <div className="api-bar">
                    {!isKeySaved ? (
                        <div className="api-edit"><input type="password" placeholder="Gemini Key..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} /><button className="btn-small" onClick={handleSaveKey}>Simpan</button></div>
                    ) : (
                        <div className="api-locked"><span>✅ Key Ready</span><button className="btn-text" onClick={handleChangeKey}>Ubah</button></div>
                    )}
                    <button className="btn-text logout" onClick={handleLogout}>Keluar</button>
                </div>
            </header>
            <main>
                {statusMsg && <div className={`status-msg ${statusMsg.type}`}>{statusMsg.text}</div>}
                <section className="input-section">
                    <h2>Drop Intro Lo 👇</h2>
                    <textarea placeholder="Contoh: Stop scrolling..." value={script} onChange={(e) => setScript(e.target.value)}></textarea>
                    <button className="btn-action" onClick={handleAnalyze} disabled={isLoading}>{isLoading ? '...' : 'Bedah Hook (Gemini 3) 🚀'}</button>
                </section>
                {analysis && (
                <section className="output-section">
                    <div className="analysis-result">
                        <div className="score-box"><span>Skor:</span><strong>{analysis.score}/100</strong></div>
                        <div className="critique-box"><p>{analysis.critique}</p></div>
                        <div className="hooks-container"><h3>✨ 3 Opsi Baru:</h3>{analysis.better_hooks.map((h, i) => (<div key={i} className="hook-card"><p>{h}</p><button className="btn-mini-copy" onClick={() => navigator.clipboard.writeText(h)}>Copy</button></div>))}</div>
                    </div>
                </section>
                )}
            </main>
          </>
      )}
    </div>
  );
}

export default App;