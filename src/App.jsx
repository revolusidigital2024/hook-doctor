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
    // LOGIKA LOKAL TANPA FETCH
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
  };
  
  const handleAnalyze = async () => {
    if (!apiKey || !script) return;
    setIsLoading(true); setAnalysis(null);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Roasting intro ini: "${script}". Output JSON: {"score": number, "critique": string, "better_hooks": []}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
      setAnalysis(JSON.parse(text));
    } catch (err) { setStatusMsg({type: 'error', text: "Error API Key!"}); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="App">
      {!isLicenseVerified ? (
          <header className="centered-gate">
            <h1>🔐 Private Access</h1>
            <div className="step-box">
                <input type="text" placeholder="Kode..." value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
                <button className="btn-primary" onClick={handleVerifyLicense}>{isLoading ? '...' : 'Masuk'}</button>
                {statusMsg && <div className="status-msg error">{statusMsg.text}</div>}
            </div>
          </header>
      ) : (
          <div style={{padding:'20px', textAlign:'center'}}>
            <h1>Dashboard Terbuka! ✅</h1>
            <p>Masukkan API Key & Script untuk mulai.</p>
             {/* Sederhana aja dulu buat tes login */}
             <button className="btn-primary" onClick={() => {localStorage.clear(); location.reload()}}>Logout Tes</button>
          </div>
      )}
    </div>
  );
}
export default App;