import { useState } from "react";
import { useNavigate } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; background: #050d14; font-family: 'Rajdhani', sans-serif; }
  :root {
    --cyan: #00d4ff;
    --cyan-dim: #0099bb;
    --cyan-glow: rgba(0,212,255,0.15);
    --cyan-border: rgba(0,212,255,0.25);
    --dark: #050d14;
    --dark2: #071520;
    --dark3: #0a1e2e;
    --text: #b0e8f5;
    --text-dim: #4a8fa8;
  }
  .jarvis-bg { background: var(--dark); min-height: 100vh; position: relative; overflow: hidden; }
  .grid-bg {
    position: fixed; inset: 0;
    background-image: linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px; pointer-events: none; z-index: 0;
  }
  .center-glow {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 900px; height: 900px;
    background: radial-gradient(circle, rgba(0,100,180,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .scanlines {
    position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
    pointer-events: none; z-index: 1;
  }
  .topbar {
    background: rgba(5,13,20,0.95); border-bottom: 1px solid var(--cyan-border);
    backdrop-filter: blur(10px); position: relative; z-index: 10;
  }
  .topbar::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--cyan), transparent); opacity: 0.3; }
  .status-dot { width: 6px; height: 6px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 8px var(--cyan); animation: pulse 2s ease-in-out infinite; flex-shrink: 0; }
  @keyframes pulse { 0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--cyan); } 50% { opacity: 0.5; box-shadow: 0 0 4px var(--cyan); } }
  .orb-container { position: relative; width: 36px; height: 36px; flex-shrink: 0; }
  .orb-ring { position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid rgba(0,212,255,0.5); animation: orb-spin 4s linear infinite; }
  .orb-ring::before { content: ''; position: absolute; top: -2px; left: 50%; width: 4px; height: 4px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 8px var(--cyan); transform: translateX(-50%); }
  .orb-ring-2 { position: absolute; inset: 4px; border-radius: 50%; border: 1px solid rgba(0,212,255,0.25); animation: orb-spin 7s linear infinite reverse; }
  .orb-core { position: absolute; inset: 12px; border-radius: 50%; background: radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(0,100,180,0.2) 60%, transparent 100%); box-shadow: 0 0 15px rgba(0,212,255,0.4); }
  @keyframes orb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .section-label { font-family: 'Orbitron', monospace; font-size: 9px; color: var(--text-dim); letter-spacing: 0.25em; text-transform: uppercase; }
  .corner-decoration { position: absolute; width: 10px; height: 10px; border-color: rgba(0,212,255,0.4); border-style: solid; }
  .corner-tl { top: 6px; left: 6px; border-width: 1px 0 0 1px; }
  .corner-tr { top: 6px; right: 6px; border-width: 1px 1px 0 0; }
  .corner-bl { bottom: 6px; left: 6px; border-width: 0 0 1px 1px; }
  .corner-br { bottom: 6px; right: 6px; border-width: 0 1px 1px 0; }
  .metric-badge { background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.15); font-family: 'Orbitron', monospace; font-size: 9px; color: var(--text-dim); letter-spacing: 0.1em; padding: 3px 8px; }
  .chat-btn { background: transparent; border: 1px solid var(--cyan-border); color: var(--text-dim); font-family: 'Rajdhani', sans-serif; font-size: 13px; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; }
  .chat-btn:hover { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-glow); }

  /* SETTINGS CARD */
  .settings-card { background: linear-gradient(135deg, rgba(5,20,35,0.8) 0%, rgba(7,21,32,0.6) 100%); border: 1px solid rgba(0,212,255,0.12); position: relative; animation: card-in 0.4s ease both; }
  @keyframes card-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .settings-card-title { font-family: 'Orbitron', monospace; font-size: 10px; color: var(--cyan); letter-spacing: 0.2em; text-shadow: 0 0 10px rgba(0,212,255,0.4); }

  /* TOGGLE */
  .toggle-track { width: 44px; height: 22px; border-radius: 11px; border: 1px solid rgba(0,212,255,0.3); background: rgba(0,212,255,0.05); cursor: pointer; transition: all 0.25s; position: relative; flex-shrink: 0; }
  .toggle-track.on { background: rgba(0,212,255,0.15); border-color: var(--cyan); box-shadow: 0 0 12px rgba(0,212,255,0.2); }
  .toggle-thumb { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: var(--text-dim); transition: all 0.25s; box-shadow: 0 0 4px rgba(0,0,0,0.4); }
  .toggle-track.on .toggle-thumb { left: 25px; background: var(--cyan); box-shadow: 0 0 8px rgba(0,212,255,0.6); }

  /* SLIDER */
  .jarvis-range { -webkit-appearance: none; appearance: none; width: 100%; height: 3px; background: rgba(0,212,255,0.1); border-radius: 2px; outline: none; cursor: pointer; }
  .jarvis-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px rgba(0,212,255,0.6); cursor: pointer; border: 2px solid var(--dark); }
  .jarvis-range::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px rgba(0,212,255,0.6); cursor: pointer; border: 2px solid var(--dark); }

  /* SELECT */
  .jarvis-select { background: rgba(0,212,255,0.04); border: 1px solid rgba(0,212,255,0.2); color: var(--text); font-family: 'Rajdhani', sans-serif; font-size: 13px; letter-spacing: 0.05em; outline: none; cursor: pointer; transition: border-color 0.2s; appearance: none; padding: 7px 32px 7px 12px; width: 100%; }
  .jarvis-select:focus { border-color: rgba(0,212,255,0.5); box-shadow: 0 0 10px rgba(0,212,255,0.08); }
  .select-wrapper { position: relative; }
  .select-arrow { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: var(--cyan); font-size: 10px; pointer-events: none; }

  /* RADIO CHIP */
  .radio-chip { border: 1px solid rgba(0,212,255,0.2); color: var(--text-dim); font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 0.15em; cursor: pointer; transition: all 0.2s; padding: 6px 12px; background: transparent; }
  .radio-chip.selected { border-color: var(--cyan); color: var(--cyan); background: rgba(0,212,255,0.1); box-shadow: 0 0 10px rgba(0,212,255,0.15); }
  .radio-chip:hover:not(.selected) { border-color: rgba(0,212,255,0.4); color: var(--text); }

  /* COLOR SWATCH */
  .color-swatch { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; flex-shrink: 0; }
  .color-swatch.selected { border-color: var(--cyan); box-shadow: 0 0 10px rgba(0,212,255,0.5); transform: scale(1.15); }

  /* ACTION BUTTONS */
  .btn-primary { background: linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,100,180,0.1) 100%); border: 1px solid rgba(0,212,255,0.4); color: var(--cyan); font-family: 'Orbitron', monospace; font-size: 10px; letter-spacing: 0.15em; cursor: pointer; transition: all 0.2s; padding: 10px 20px; white-space: nowrap; }
  .btn-primary:hover { background: rgba(0,212,255,0.2); box-shadow: 0 0 20px rgba(0,212,255,0.25); border-color: var(--cyan); }
  .btn-danger { background: transparent; border: 1px solid rgba(255,60,60,0.3); color: rgba(255,100,100,0.7); font-family: 'Orbitron', monospace; font-size: 10px; letter-spacing: 0.15em; cursor: pointer; transition: all 0.2s; padding: 10px 20px; white-space: nowrap; }
  .btn-danger:hover { background: rgba(255,60,60,0.08); border-color: rgba(255,60,60,0.6); color: #ff6060; box-shadow: 0 0 15px rgba(255,60,60,0.15); }
  .btn-secondary { background: transparent; border: 1px solid rgba(0,212,255,0.2); color: var(--text-dim); font-family: 'Orbitron', monospace; font-size: 10px; letter-spacing: 0.15em; cursor: pointer; transition: all 0.2s; padding: 10px 20px; white-space: nowrap; }
  .btn-secondary:hover { border-color: rgba(0,212,255,0.4); color: var(--text); }

  /* INPUT */
  .jarvis-input { background: rgba(0,212,255,0.04); border: 1px solid rgba(0,212,255,0.2); color: var(--text); font-family: 'Rajdhani', sans-serif; font-size: 14px; letter-spacing: 0.03em; outline: none; transition: border-color 0.2s; caret-color: var(--cyan); padding: 8px 12px; width: 100%; }
  .jarvis-input:focus { border-color: rgba(0,212,255,0.5); box-shadow: 0 0 10px rgba(0,212,255,0.07); }
  .jarvis-input::placeholder { color: var(--text-dim); }

  /* SIDEBAR NAV */
  .side-nav-btn { background: transparent; border: 1px solid transparent; color: var(--text-dim); font-family: 'Rajdhani', sans-serif; font-size: 13px; letter-spacing: 0.08em; cursor: pointer; transition: all 0.2s; text-align: left; padding: 10px 14px; position: relative; width: 100%; }
  .side-nav-btn::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--cyan); transform: scaleY(0); transition: transform 0.2s; }
  .side-nav-btn:hover { color: var(--text); background: rgba(0,212,255,0.04); }
  .side-nav-btn.active { color: var(--cyan); background: rgba(0,212,255,0.07); border-color: rgba(0,212,255,0.15); }
  .side-nav-btn.active::before { transform: scaleY(1); }

  /* SCROLLBAR */
  .scroll-area { scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.2) transparent; }
  .scroll-area::-webkit-scrollbar { width: 4px; }
  .scroll-area::-webkit-scrollbar-track { background: transparent; }
  .scroll-area::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); border-radius: 2px; }

  /* PROGRESS BAR */
  .prog-bar { height: 3px; background: rgba(0,212,255,0.1); border-radius: 2px; overflow: hidden; }
  .prog-fill { height: 100%; background: linear-gradient(90deg, var(--cyan-dim), var(--cyan)); border-radius: 2px; box-shadow: 0 0 6px rgba(0,212,255,0.4); }

  /* ALERT */
  .alert-warn { background: rgba(255,180,0,0.05); border: 1px solid rgba(255,180,0,0.2); border-left: 2px solid rgba(255,180,0,0.6); color: rgba(255,200,80,0.8); font-family: 'Rajdhani', sans-serif; font-size: 13px; padding: 10px 14px; }
  .alert-info { background: rgba(0,212,255,0.04); border: 1px solid rgba(0,212,255,0.15); border-left: 2px solid rgba(0,212,255,0.5); color: var(--text-dim); font-family: 'Rajdhani', sans-serif; font-size: 13px; padding: 10px 14px; }

  /* SAVE TOAST */
  .save-toast { position: fixed; bottom: 20px; right: 16px; background: rgba(5,20,35,0.97); border: 1px solid var(--cyan); color: var(--cyan); font-family: 'Orbitron', monospace; font-size: 10px; letter-spacing: 0.15em; padding: 12px 20px; z-index: 200; box-shadow: 0 0 24px rgba(0,212,255,0.25); animation: toast-in 0.3s ease; }
  @keyframes toast-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* ── RESPONSIVE ── */

  /* Mobile bottom nav tab bar */
  .mobile-tab-bar {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(5,13,20,0.97);
    border-top: 1px solid var(--cyan-border);
    z-index: 30;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    backdrop-filter: blur(10px);
  }
  .mobile-tab-bar::-webkit-scrollbar { display: none; }
  .mobile-tab-inner { display: flex; min-width: max-content; padding: 0 4px; }
  .mobile-tab-btn {
    background: transparent; border: none; border-top: 2px solid transparent;
    color: var(--text-dim); font-family: 'Orbitron', monospace; font-size: 8px;
    letter-spacing: 0.12em; cursor: pointer; padding: 10px 14px;
    transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  }
  .mobile-tab-btn.active { color: var(--cyan); border-top-color: var(--cyan); text-shadow: 0 0 8px rgba(0,212,255,0.5); }

  /* Sidebar hidden on mobile/tablet, shown on desktop */
  .settings-sidebar {
    width: 200px; flex-shrink: 0;
    border-right: 1px solid var(--cyan-border);
    background: linear-gradient(180deg, #060f1a, #050d14);
    position: relative;
    display: flex; flex-direction: column;
  }

  @media (max-width: 1023px) {
    .settings-sidebar { display: none; }
    .mobile-tab-bar { display: block; }
    .main-content-pad { padding-bottom: 60px !important; }
    .section-header-pad { padding: 14px 16px 10px !important; }
    .content-scroll-pad { padding: 16px !important; }
    .save-bar { flex-direction: column; gap: 10px; align-items: stretch !important; }
    .save-bar-right { flex-direction: column; gap: 8px; }
    .save-bar .btn-secondary, .save-bar .btn-primary { width: 100%; text-align: center; }
  }

  @media (max-width: 767px) {
    .topbar-title { display: none; }
    .topbar-status { display: none; }
    .topbar-badges { display: none; }
    .setting-row-wrap { flex-wrap: wrap; gap: 12px !important; }
    .setting-row-wrap > div:first-child { flex: 1 1 100%; }
    .radio-chips-wrap { flex-wrap: wrap; }
    .two-col-grid { flex-direction: column !important; }
    .two-col-grid > div { flex: unset !important; }
    .btn-group-wrap { flex-direction: column !important; }
    .btn-group-wrap button { width: 100%; }
    .color-swatches { flex-wrap: wrap; }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .content-scroll-pad { padding: 20px 24px !important; }
    .section-header-pad { padding: 16px 24px 12px !important; }
  }
`;

function Toggle({ value, onChange }) {
  return (
    <div className={`toggle-track ${value ? "on" : ""}`} onClick={() => onChange(!value)}>
      <div className="toggle-thumb" />
    </div>
  );
}

function SettingRow({ label, sub, children }) {
  return (
    <div className="setting-row-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(0,212,255,0.06)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "var(--text)", letterSpacing: "0.05em" }}>{label}</span>
        {sub && <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.04em" }}>{sub}</span>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Card({ title, icon, children, delay = 0 }) {
  return (
    <div className="settings-card" style={{ borderRadius: 2, padding: 20, marginBottom: 16, position: "relative", animationDelay: `${delay}ms` }}>
      <div className="corner-decoration corner-tl" />
      <div className="corner-decoration corner-br" />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ color: "var(--cyan)", fontSize: 14 }}>{icon}</span>
        <span className="settings-card-title">{title}</span>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(0,212,255,0.2),transparent)", marginLeft: 8 }} />
      </div>
      {children}
    </div>
  );
}

const SECTIONS = ["GENERAL", "INTERFACE", "AI CORE", "SECURITY", "NETWORK", "SYSTEM"];
const ACCENT_COLORS = ["#00d4ff", "#00ffd0", "#7b61ff", "#ff6b35", "#39ff14", "#ff2d78"];

export default function JarvisSettings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("GENERAL");
  const [toast, setToast] = useState(false);

  const [settings, setSettings] = useState({
    operatorName: "OPERATOR",
    language: "en-US",
    timezone: "UTC+0",
    notifications: true,
    sounds: true,
    autoSave: true,
    theme: "DARK",
    accentColor: "#00d4ff",
    fontSize: 15,
    animations: true,
    scanlines: true,
    gridBg: true,
    compactMode: false,
    model: "claude-sonnet-4-20250514",
    responseStyle: "PRECISE",
    contextWindow: 75,
    streamResponse: true,
    codeHighlight: true,
    webSearch: false,
    maxTokens: 1000,
    encryptChats: true,
    twoFactor: false,
    sessionTimeout: "30",
    clearOnClose: false,
    proxy: false,
    proxyUrl: "",
    timeout: "30",
    retries: "3",
    diagnostics: true,
    crashReports: false,
    updates: true,
  });

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const save = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2400);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "GENERAL": return (
        <>
          <Card title="OPERATOR PROFILE" icon="◈" delay={0}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div className="section-label" style={{ marginBottom: 8 }}>OPERATOR DESIGNATION</div>
                <input className="jarvis-input" value={settings.operatorName} onChange={e => set("operatorName", e.target.value)} placeholder="Enter callsign..." />
              </div>
              <div className="two-col-grid" style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div className="section-label" style={{ marginBottom: 8 }}>LANGUAGE</div>
                  <div className="select-wrapper">
                    <select className="jarvis-select" value={settings.language} onChange={e => set("language", e.target.value)}>
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="fr-FR">Français</option>
                      <option value="de-DE">Deutsch</option>
                      <option value="ja-JP">日本語</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="section-label" style={{ marginBottom: 8 }}>TIMEZONE</div>
                  <div className="select-wrapper">
                    <select className="jarvis-select" value={settings.timezone} onChange={e => set("timezone", e.target.value)}>
                      <option value="UTC+0">UTC+0</option>
                      <option value="UTC+5:30">UTC+5:30 (IST)</option>
                      <option value="UTC-5">UTC-5 (EST)</option>
                      <option value="UTC-8">UTC-8 (PST)</option>
                      <option value="UTC+1">UTC+1 (CET)</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card title="NOTIFICATIONS & ALERTS" icon="◉" delay={60}>
            <SettingRow label="System Notifications" sub="Alert popups for key events"><Toggle value={settings.notifications} onChange={v => set("notifications", v)} /></SettingRow>
            <SettingRow label="Interface Sounds" sub="Auditory feedback on actions"><Toggle value={settings.sounds} onChange={v => set("sounds", v)} /></SettingRow>
            <SettingRow label="Auto-Save Sessions" sub="Persist conversations automatically"><Toggle value={settings.autoSave} onChange={v => set("autoSave", v)} /></SettingRow>
          </Card>
          <Card title="DATA MANAGEMENT" icon="◫" delay={120}>
            <div className="alert-warn" style={{ marginBottom: 16 }}>⚠ WARNING — Clearing session data is irreversible. All chat history will be permanently erased.</div>
            <div className="btn-group-wrap" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn-secondary">EXPORT DATA</button>
              <button className="btn-secondary">IMPORT BACKUP</button>
              <button className="btn-danger">CLEAR ALL SESSIONS</button>
            </div>
          </Card>
        </>
      );

      case "INTERFACE": return (
        <>
          <Card title="THEME & APPEARANCE" icon="◈" delay={0}>
            <SettingRow label="Color Theme" sub="Select visual mode">
              <div className="radio-chips-wrap" style={{ display: "flex", gap: 6 }}>
                {["DARK", "DARKER", "MIDNIGHT"].map(t => (
                  <button key={t} className={`radio-chip ${settings.theme === t ? "selected" : ""}`} onClick={() => set("theme", t)}>{t}</button>
                ))}
              </div>
            </SettingRow>
            <SettingRow label="Accent Color" sub="Primary highlight color">
              <div className="color-swatches" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {ACCENT_COLORS.map(c => (
                  <div key={c} className={`color-swatch ${settings.accentColor === c ? "selected" : ""}`}
                    style={{ background: c, boxShadow: `0 0 6px ${c}55` }}
                    onClick={() => set("accentColor", c)} />
                ))}
              </div>
            </SettingRow>
            <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(0,212,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "var(--text)", letterSpacing: "0.05em" }}>Font Scale</span>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)" }}>Interface text size</div>
                </div>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "var(--cyan)" }}>{settings.fontSize}px</span>
              </div>
              <input type="range" className="jarvis-range" min={12} max={20} value={settings.fontSize} onChange={e => set("fontSize", +e.target.value)} />
            </div>
          </Card>
          <Card title="VISUAL EFFECTS" icon="◉" delay={60}>
            <SettingRow label="Animations" sub="Motion transitions and micro-interactions"><Toggle value={settings.animations} onChange={v => set("animations", v)} /></SettingRow>
            <SettingRow label="Scanline Overlay" sub="CRT scanline visual effect"><Toggle value={settings.scanlines} onChange={v => set("scanlines", v)} /></SettingRow>
            <SettingRow label="Grid Background" sub="Background grid pattern"><Toggle value={settings.gridBg} onChange={v => set("gridBg", v)} /></SettingRow>
            <SettingRow label="Compact Mode" sub="Reduce padding for higher density"><Toggle value={settings.compactMode} onChange={v => set("compactMode", v)} /></SettingRow>
          </Card>
        </>
      );

      case "AI CORE": return (
        <>
          <Card title="MODEL CONFIGURATION" icon="◈" delay={0}>
            <div style={{ marginBottom: 16 }}>
              <div className="section-label" style={{ marginBottom: 8 }}>AI MODEL</div>
              <div className="select-wrapper">
                <select className="jarvis-select" value={settings.model} onChange={e => set("model", e.target.value)}>
                  <option value="claude-sonnet-4-20250514">Claude Sonnet 4 — Balanced</option>
                  <option value="claude-opus-4-20250514">Claude Opus 4 — Maximum Power</option>
                  <option value="claude-haiku-4-5">Claude Haiku 4.5 — Ultra-Fast</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>
            <div>
              <div className="section-label" style={{ marginBottom: 8 }}>RESPONSE STYLE</div>
              <div className="radio-chips-wrap" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["PRECISE", "BALANCED", "CREATIVE", "VERBOSE"].map(s => (
                  <button key={s} className={`radio-chip ${settings.responseStyle === s ? "selected" : ""}`} onClick={() => set("responseStyle", s)}>{s}</button>
                ))}
              </div>
            </div>
          </Card>
          <Card title="CONTEXT & MEMORY" icon="◫" delay={60}>
            <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(0,212,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "var(--text)" }}>Context Window Usage</span>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)" }}>Memory allocation for conversation history</div>
                </div>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "var(--cyan)" }}>{settings.contextWindow}%</span>
              </div>
              <input type="range" className="jarvis-range" min={10} max={100} step={5} value={settings.contextWindow} onChange={e => set("contextWindow", +e.target.value)} />
              <div className="prog-bar" style={{ marginTop: 8 }}>
                <div className="prog-fill" style={{ width: `${settings.contextWindow}%` }} />
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="section-label" style={{ marginBottom: 8 }}>MAX TOKENS PER RESPONSE</div>
              <div className="select-wrapper">
                <select className="jarvis-select" value={settings.maxTokens} onChange={e => set("maxTokens", +e.target.value)}>
                  <option value={500}>500 — Concise</option>
                  <option value={1000}>1000 — Standard</option>
                  <option value={2000}>2000 — Detailed</option>
                  <option value={4000}>4000 — Comprehensive</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>
          </Card>
          <Card title="CAPABILITIES" icon="◉" delay={120}>
            <SettingRow label="Stream Responses" sub="Display output progressively as generated"><Toggle value={settings.streamResponse} onChange={v => set("streamResponse", v)} /></SettingRow>
            <SettingRow label="Code Syntax Highlighting" sub="Format and colorize code blocks"><Toggle value={settings.codeHighlight} onChange={v => set("codeHighlight", v)} /></SettingRow>
            <SettingRow label="Web Search Integration" sub="Allow real-time data retrieval"><Toggle value={settings.webSearch} onChange={v => set("webSearch", v)} /></SettingRow>
          </Card>
        </>
      );

      case "SECURITY": return (
        <>
          <Card title="ENCRYPTION & PRIVACY" icon="◈" delay={0}>
            <SettingRow label="End-to-End Encryption" sub="AES-256 session encryption"><Toggle value={settings.encryptChats} onChange={v => set("encryptChats", v)} /></SettingRow>
            <SettingRow label="Two-Factor Authentication" sub="Biometric or TOTP verification"><Toggle value={settings.twoFactor} onChange={v => set("twoFactor", v)} /></SettingRow>
            <SettingRow label="Clear Data on Close" sub="Wipe session on application exit"><Toggle value={settings.clearOnClose} onChange={v => set("clearOnClose", v)} /></SettingRow>
          </Card>
          <Card title="SESSION SECURITY" icon="◉" delay={60}>
            <div style={{ marginBottom: 16 }}>
              <div className="section-label" style={{ marginBottom: 8 }}>AUTO-LOCK TIMEOUT</div>
              <div className="select-wrapper">
                <select className="jarvis-select" value={settings.sessionTimeout} onChange={e => set("sessionTimeout", e.target.value)}>
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="never">Never</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>
            <div className="alert-info">ℹ Current encryption status: ACTIVE · AES-256-GCM · Key rotation: 24h</div>
          </Card>
          <Card title="ACCESS LOG" icon="◫" delay={120}>
            {[
              ["LOGIN", "192.168.1.1", "2 mins ago", "#00d4ff"],
              ["API CALL", "10.0.0.42", "14 mins ago", "#00d4ff"],
              ["FAILED AUTH", "203.0.113.0", "1 hour ago", "#ff4444"],
            ].map(([event, ip, time, color]) => (
              <div key={event + time} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(0,212,255,0.06)", flexWrap: "wrap", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color, letterSpacing: "0.15em" }}>{event}</span>
                </div>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: "var(--text-dim)" }}>{ip}</span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.1em" }}>{time}</span>
              </div>
            ))}
          </Card>
        </>
      );

      case "NETWORK": return (
        <>
          <Card title="CONNECTION SETTINGS" icon="◈" delay={0}>
            <SettingRow label="Use Proxy" sub="Route traffic through proxy server"><Toggle value={settings.proxy} onChange={v => set("proxy", v)} /></SettingRow>
            {settings.proxy && (
              <div style={{ paddingBottom: 14 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>PROXY URL</div>
                <input className="jarvis-input" value={settings.proxyUrl} onChange={e => set("proxyUrl", e.target.value)} placeholder="http://proxy.server:8080" />
              </div>
            )}
            <div className="two-col-grid" style={{ display: "flex", gap: 12, marginTop: 4 }}>
              <div style={{ flex: 1 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>TIMEOUT (SEC)</div>
                <div className="select-wrapper">
                  <select className="jarvis-select" value={settings.timeout} onChange={e => set("timeout", e.target.value)}>
                    <option value="10">10s</option>
                    <option value="30">30s</option>
                    <option value="60">60s</option>
                    <option value="120">120s</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>MAX RETRIES</div>
                <div className="select-wrapper">
                  <select className="jarvis-select" value={settings.retries} onChange={e => set("retries", e.target.value)}>
                    <option value="1">1</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>
            </div>
          </Card>
          <Card title="NETWORK DIAGNOSTICS" icon="◉" delay={60}>
            {[
              ["API ENDPOINT", "api.anthropic.com", "12ms", true],
              ["DNS RESOLVER", "8.8.8.8", "4ms", true],
              ["PROXY SERVER", "N/A", "—", false],
            ].map(([name, host, ping, ok]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(0,212,255,0.06)", flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.15em" }}>{name}</span>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: "var(--text)" }}>{host}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: ok ? "var(--cyan)" : "rgba(100,100,100,0.5)", boxShadow: ok ? "0 0 6px var(--cyan)" : "none" }} />
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: ok ? "var(--cyan)" : "var(--text-dim)", letterSpacing: "0.1em" }}>{ping}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <button className="btn-secondary" style={{ width: "100%" }}>RUN DIAGNOSTICS</button>
            </div>
          </Card>
        </>
      );

      case "SYSTEM": return (
        <>
          <Card title="SYSTEM INFORMATION" icon="◈" delay={0}>
            {[
              ["VERSION", "J.A.R.V.I.S v7.3.1"],
              ["BUILD", "2025.04.03-stable"],
              ["CORE ENGINE", "Claude Sonnet 4"],
              ["PLATFORM", "Web Interface"],
              ["UPTIME", "99.97% (30d avg)"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(0,212,255,0.06)" }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.1em" }}>{label}</span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: "var(--cyan)", letterSpacing: "0.1em" }}>{val}</span>
              </div>
            ))}
          </Card>
          <Card title="TELEMETRY" icon="◉" delay={60}>
            <SettingRow label="Usage Diagnostics" sub="Anonymous performance metrics"><Toggle value={settings.diagnostics} onChange={v => set("diagnostics", v)} /></SettingRow>
            <SettingRow label="Crash Reports" sub="Automatic error reporting"><Toggle value={settings.crashReports} onChange={v => set("crashReports", v)} /></SettingRow>
            <SettingRow label="Automatic Updates" sub="Install updates in background"><Toggle value={settings.updates} onChange={v => set("updates", v)} /></SettingRow>
          </Card>
          <Card title="MAINTENANCE" icon="◫" delay={120}>
            <div className="btn-group-wrap" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn-secondary">CLEAR CACHE</button>
              <button className="btn-secondary">CHECK FOR UPDATES</button>
              <button className="btn-danger">FACTORY RESET</button>
            </div>
          </Card>
        </>
      );

      default: return null;
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="jarvis-bg" style={{ display: "flex", flexDirection: "column", height: "100dvh", width: "100vw", overflow: "hidden" }}>
        <div className="grid-bg" />
        <div className="center-glow" />
        <div className="scanlines" />

        {/* TOPBAR */}
        <div className="topbar" style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => navigate("/chat")}
              style={{ background: "transparent", border: "1px solid var(--cyan-border)", color: "var(--text-dim)", cursor: "pointer", padding: "5px 10px", fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: "0.1em", flexShrink: 0 }}
            >
              ◀
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="orb-container">
                <div className="orb-ring" />
                <div className="orb-ring-2" />
                <div className="orb-core" />
              </div>
              <div className="topbar-title" style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, color: "var(--cyan)", letterSpacing: "0.2em", textShadow: "0 0 15px rgba(0,212,255,0.5)" }}>
                SYSTEM CONFIG
              </div>
            </div>
            <div className="topbar-status" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="status-dot" />
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>ALL SYSTEMS NOMINAL</span>
            </div>
          </div>
          <div className="topbar-badges" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className="metric-badge">v7.3.1</div>
            <div className="metric-badge">SECURE</div>
          </div>
        </div>

        {/* BODY */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative", zIndex: 10 }}>

          {/* SIDEBAR — desktop only */}
          <div className="settings-sidebar">
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg,transparent,var(--cyan),transparent)", opacity: 0.3 }} />
            <div style={{ padding: "20px 16px", flex: 1 }}>
              <div className="section-label" style={{ marginBottom: 16 }}>// MODULES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {SECTIONS.map(s => (
                  <button key={s} className={`side-nav-btn ${activeSection === s ? "active" : ""}`} style={{ borderRadius: 2 }} onClick={() => setActiveSection(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(0,212,255,0.1)", padding: "16px" }}>
              <div className="section-label" style={{ marginBottom: 10 }}>// RESOURCE USAGE</div>
              {[["CPU", 28], ["RAM", 41], ["DISK", 17]].map(([label, pct]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.1em" }}>{label}</span>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "var(--cyan)" }}>{pct}%</span>
                  </div>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

            {/* Section header */}
            <div className="section-header-pad" style={{ padding: "18px 28px 12px", borderBottom: "1px solid rgba(0,212,255,0.08)", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: "var(--cyan)", letterSpacing: "0.2em", textShadow: "0 0 20px rgba(0,212,255,0.4)" }}>
                {activeSection}
              </div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.1em", marginTop: 2 }}>
                Configure {activeSection.toLowerCase()} parameters and preferences
              </div>
            </div>

            {/* Scrollable content */}
            <div className="scroll-area content-scroll-pad main-content-pad" style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
              {renderSection()}

              {/* Save bar */}
              <div className="save-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(0,212,255,0.1)" }}>
                <button className="btn-secondary" onClick={() => navigate("/chat")}>◀ BACK TO INTERFACE</button>
                <div className="save-bar-right" style={{ display: "flex", gap: 10 }}>
                  <button className="btn-secondary">RESET DEFAULTS</button>
                  <button className="btn-primary" onClick={save}>SAVE CHANGES ▶</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE BOTTOM TAB BAR */}
        <div className="mobile-tab-bar">
          <div className="mobile-tab-inner">
            {SECTIONS.map(s => (
              <button
                key={s}
                className={`mobile-tab-btn ${activeSection === s ? "active" : ""}`}
                onClick={() => setActiveSection(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {toast && <div className="save-toast">✓ CONFIGURATION SAVED</div>}
    </>
  );
}