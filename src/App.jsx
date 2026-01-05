// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
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
    if (savedCode) { setAccessCode(savedCode); setIsLicenseVerified(true); }
    if (savedKey) { setApiKey(savedKey); setIsKeySaved(true); }
  }, []);

  const handleVerifyLicense = async () => {
    if (!accessCode) return;
    setIsLoading(true);
    try {
        // PERHATIKAN: URL-nya sekarang '/api/...' bukan localhost
        const response = await fetch('/api/verify-license', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessCode })
        });
        if (response.ok) {
            localStorage.setItem('app_access_code', accessCode);
            setIsLicenseVerified(true);
        } else { throw new Error('⛔ Kode Salah!'); }
    } catch (err) { setStatusMsg({type: 'error', text: err.message}); } 
    finally { setIsLoading(false); }
  };

  const handleSaveKey = () => {
      localStorage.setItem('gemini_api_key', apiKey);
      setIsKeySaved(true);
  };

  const handleAnalyze = async () => {
    if (!apiKey || !script) return;
    setIsLoading(true); setAnalysis(null);
    try {
      const response = await fetch('/api/analyze-script', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, apiKey, accessCode }), 
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAnalysis(data);
    } catch (err) { setStatusMsg({type: 'error', text: err.message}); } 
    finally { setIsLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); location.reload(); };

  return (
    <div className="App">
      {!isLicenseVerified ? (
          <header className="centered-gate">
            <h1>🔐 Private Access</h1>
            <p>Masukkan Kode Akses Gratis</p>
            <div className="step-box">
                <input type="text" placeholder="Kode..." value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
                <button className="btn-primary" onClick={handleVerifyLicense} disabled={isLoading}>{isLoading ? '...' : 'Masuk'}</button>
                {statusMsg && <div className={`status-msg ${statusMsg.type}`}>{statusMsg.text}</div>}
            </div>
          </header>
      ) : (
          <>
            <header className="dashboard-header">
                <div className="brand"><h1>🪝 Hook Doctor</h1><span className="vip-badge">BETA</span></div>
                <div className="api-bar">
                    {!isKeySaved ? (
                        <div className="api-edit"><input type="password" placeholder="Gemini Key..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} /><button className="btn-small" onClick={handleSaveKey}>Simpan</button></div>
                    ) : (
                        <div className="api-locked"><span>✅ Ready</span><button className="btn-text" onClick={() => setIsKeySaved(false)}>Ubah</button></div>
                    )}
                    <button className="btn-text logout" onClick={handleLogout}>Keluar</button>
                </div>
            </header>
            <main>
                <section className="input-section">
                    <h2>Drop Intro Lo 👇</h2>
                    <textarea placeholder="Contoh: Stop scrolling..." value={script} onChange={(e) => setScript(e.target.value)}></textarea>
                    <button className="btn-action" onClick={handleAnalyze} disabled={isLoading}>{isLoading ? '...' : 'Bedah Hook! 🚀'}</button>
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
                {statusMsg && <div className={`status-msg ${statusMsg.type}`}>{statusMsg.text}</div>}
            </main>
          </>
      )}
    </div>
  );
}

export default App;