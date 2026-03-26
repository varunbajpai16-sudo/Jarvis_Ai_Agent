import { useState, useRef, useEffect } from "react";

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
  .sidebar { background: linear-gradient(180deg, #060f1a 0%, #050d14 100%); border-right: 1px solid var(--cyan-border); position: relative; z-index: 2; }
  .sidebar::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 1px; background: linear-gradient(180deg, transparent, var(--cyan), transparent); opacity: 0.4; }
  .logo-text { font-family: 'Orbitron', monospace; color: var(--cyan); text-shadow: 0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.3); letter-spacing: 0.2em; }
  .logo-sub { font-family: 'Rajdhani', sans-serif; color: var(--text-dim); letter-spacing: 0.3em; font-size: 9px; text-transform: uppercase; }
  .orb-container { position: relative; width: 48px; height: 48px; }
  .orb-ring { position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid rgba(0,212,255,0.5); animation: orb-spin 4s linear infinite; }
  .orb-ring::before { content: ''; position: absolute; top: -2px; left: 50%; width: 4px; height: 4px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 8px var(--cyan); transform: translateX(-50%); }
  .orb-ring-2 { position: absolute; inset: 4px; border-radius: 50%; border: 1px solid rgba(0,212,255,0.25); animation: orb-spin 7s linear infinite reverse; }
  .orb-core { position: absolute; inset: 14px; border-radius: 50%; background: radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(0,100,180,0.2) 60%, transparent 100%); box-shadow: 0 0 15px rgba(0,212,255,0.4); }
  @keyframes orb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .chat-btn { background: transparent; border: 1px solid var(--cyan-border); color: var(--text-dim); font-family: 'Rajdhani', sans-serif; font-size: 13px; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; text-align: left; position: relative; overflow: hidden; }
  .chat-btn:hover, .chat-btn.active { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-glow); box-shadow: 0 0 12px rgba(0,212,255,0.1); }
  .chat-btn::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--cyan); transform: scaleY(0); transition: transform 0.2s; }
  .chat-btn:hover::before, .chat-btn.active::before { transform: scaleY(1); }
  .new-chat-btn { background: transparent; border: 1px solid var(--cyan); color: var(--cyan); font-family: 'Orbitron', monospace; font-size: 10px; letter-spacing: 0.15em; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
  .new-chat-btn:hover { background: var(--cyan-glow); box-shadow: 0 0 20px rgba(0,212,255,0.2); }
  .chat-area { scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.2) transparent; }
  .chat-area::-webkit-scrollbar { width: 4px; }
  .chat-area::-webkit-scrollbar-track { background: transparent; }
  .chat-area::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); border-radius: 2px; }
  .msg-user { background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,100,180,0.05) 100%); border: 1px solid rgba(0,212,255,0.15); border-right: 2px solid var(--cyan); color: #d0f0ff; font-family: 'Rajdhani', sans-serif; font-size: 15px; animation: msg-in-right 0.3s ease; }
  .msg-jarvis { background: linear-gradient(135deg, rgba(5,20,35,0.8) 0%, rgba(7,21,32,0.6) 100%); border: 1px solid rgba(0,212,255,0.1); border-left: 2px solid rgba(0,212,255,0.5); color: var(--text); font-family: 'Rajdhani', sans-serif; font-size: 15px; animation: msg-in-left 0.3s ease; }
  @keyframes msg-in-right { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes msg-in-left { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  .avatar-jarvis { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,212,255,0.4); background: radial-gradient(circle, rgba(0,212,255,0.3) 0%, rgba(0,50,100,0.3) 100%); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', monospace; font-size: 9px; color: var(--cyan); flex-shrink: 0; box-shadow: 0 0 10px rgba(0,212,255,0.2); }
  .avatar-user { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,212,255,0.3); background: linear-gradient(135deg, rgba(0,80,140,0.4) 0%, rgba(0,30,60,0.4) 100%); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', monospace; font-size: 9px; color: rgba(0,212,255,0.7); flex-shrink: 0; }
  .input-wrapper { background: rgba(5,15,25,0.9); border: 1px solid var(--cyan-border); transition: border-color 0.2s, box-shadow 0.2s; position: relative; }
  .input-wrapper:focus-within { border-color: rgba(0,212,255,0.5); box-shadow: 0 0 20px rgba(0,212,255,0.08), inset 0 0 20px rgba(0,212,255,0.03); }
  .chat-input { background: transparent; border: none; outline: none; color: #d0f0ff; font-family: 'Rajdhani', sans-serif; font-size: 15px; caret-color: var(--cyan); width: 100%; resize: none; }
  .chat-input::placeholder { color: var(--text-dim); letter-spacing: 0.05em; }
  .send-btn { background: linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,100,180,0.1) 100%); border: 1px solid rgba(0,212,255,0.4); color: var(--cyan); cursor: pointer; transition: all 0.2s; font-family: 'Orbitron', monospace; font-size: 10px; letter-spacing: 0.1em; }
  .send-btn:hover { background: rgba(0,212,255,0.2); box-shadow: 0 0 20px rgba(0,212,255,0.3); border-color: var(--cyan); }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .topbar { background: rgba(5,13,20,0.95); border-bottom: 1px solid var(--cyan-border); backdrop-filter: blur(10px); position: relative; z-index: 2; }
  .topbar::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--cyan), transparent); opacity: 0.3; }
  .status-dot { width: 6px; height: 6px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 8px var(--cyan); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--cyan); } 50% { opacity: 0.5; box-shadow: 0 0 4px var(--cyan); } }
  .typing-dot { width: 5px; height: 5px; background: var(--cyan); border-radius: 50%; animation: typing 1.4s ease-in-out infinite; box-shadow: 0 0 6px var(--cyan); }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-6px); opacity: 1; } }
  .section-label { font-family: 'Orbitron', monospace; font-size: 9px; color: var(--text-dim); letter-spacing: 0.25em; text-transform: uppercase; }
  .corner-decoration { position: absolute; width: 10px; height: 10px; border-color: rgba(0,212,255,0.4); border-style: solid; }
  .corner-tl { top: 6px; left: 6px; border-width: 1px 0 0 1px; }
  .corner-tr { top: 6px; right: 6px; border-width: 1px 1px 0 0; }
  .corner-bl { bottom: 6px; left: 6px; border-width: 0 0 1px 1px; }
  .corner-br { bottom: 6px; right: 6px; border-width: 0 1px 1px 0; }
  .metric-badge { background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.15); font-family: 'Orbitron', monospace; font-size: 9px; color: var(--text-dim); letter-spacing: 0.1em; padding: 3px 8px; }
  .capability-tag { background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.12); color: var(--text-dim); font-family: 'Rajdhani', sans-serif; font-size: 12px; letter-spacing: 0.05em; padding: 4px 10px; cursor: pointer; transition: all 0.2s; }
  .capability-tag:hover { border-color: rgba(0,212,255,0.4); color: var(--cyan); background: rgba(0,212,255,0.08); }
`;

const INITIAL_MESSAGES = [
  { id: 1, role: "jarvis", text: "Good day. I am J.A.R.V.I.S — Just A Rather Very Intelligent System. All core systems are online and operating at full capacity. How may I assist you today?", time: "09:41" },
];

const SAMPLE_CHATS = [
  { id: 1, title: "System Diagnostics", time: "Today" },
  { id: 2, title: "Mission Briefing Alpha", time: "Today" },
  { id: 3, title: "Threat Analysis Report", time: "Yesterday" },
  { id: 4, title: "Power Core Status", time: "Yesterday" },
  { id: 5, title: "Neural Network Update", time: "Mar 22" },
];

const SUGGESTIONS = ["Run system diagnostics", "Analyze threat levels", "Show power grid status", "Brief me on latest intel"];

export default function JarvisChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const getTime = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: msg, time: getTime() }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "jarvis", text: "Understood. I am processing your request now. All relevant data streams have been cross-referenced and analyzed. Please stand by while I compile the optimal response for your query.", time: getTime() }]);
    }, 1800);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <>
    //This is the core Style of the chatui
      <style>{style}</style>
      
      <div className="jarvis-bg flex h-screen w-screen overflow-hidden">
        <div className="grid-bg" />
        <div className="center-glow" />
        <div className="scanlines" />

        {/* SIDEBAR */}
        {sidebarOpen && (
          <div className="sidebar flex flex-col flex-shrink-0 h-full relative z-10" style={{ width: 256 }}>
            <div className="px-5 py-5 relative" style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}>
              <div className="corner-decoration corner-tl" />
              <div className="flex items-center gap-3 mb-1">
                <div className="orb-container">
                  <div className="orb-ring" />
                  <div className="orb-ring-2" />
                  <div className="orb-core" />
                </div>
                <div>
                  <div className="logo-text text-sm font-bold">J.A.R.V.I.S</div>
                  <div className="logo-sub">v7.3.1 — online</div>
                </div>
              </div>
            </div>

            <div className="px-4 py-4">
              <button className="new-chat-btn w-full py-2.5 px-3 rounded-sm flex items-center justify-center gap-2" onClick={() => setMessages(INITIAL_MESSAGES)}>
                <span className="text-lg leading-none">+</span>
                <span>NEW SESSION</span>
              </button>
            </div>

            <div className="px-4 mb-2">
              <div className="section-label mb-3">// SESSIONS</div>
              <div className="flex flex-col gap-1">
                {SAMPLE_CHATS.map((c) => (
                  <button key={c.id} className={`chat-btn px-3 py-2.5 rounded-sm ${activeChat === c.id ? "active" : ""}`} onClick={() => setActiveChat(c.id)}>
                    <div style={{ fontSize: 13, fontWeight: 500 }} className="truncate">{c.title}</div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2, letterSpacing: "0.05em" }}>{c.time}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1" />

            <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(0,212,255,0.1)" }}>
              <div className="section-label mb-3">// SYSTEM STATUS</div>
              <div className="flex flex-col gap-2">
                {[["CORE TEMP", "36.2°C"], ["UPTIME", "99.97%"], ["MEMORY", "12.4 GB"]].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em" }}>{label}</span>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: "var(--cyan)" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MAIN */}
        <div className="flex flex-col flex-1 h-full relative z-10 overflow-hidden">
          {/* Topbar */}
          <div className="topbar px-5 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen((v) => !v)} style={{ background: "transparent", border: "1px solid var(--cyan-border)", color: "var(--text-dim)", cursor: "pointer", padding: "4px 10px", fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: "0.1em" }}>
                {sidebarOpen ? "◀" : "▶"}
              </button>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, color: "var(--cyan)", letterSpacing: "0.2em", textShadow: "0 0 15px rgba(0,212,255,0.5)" }}>J.A.R.V.I.S</div>
              <div className="flex items-center gap-2">
                <div className="status-dot" />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.15em" }}>ALL SYSTEMS NOMINAL</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {["ANALYTICS", "SETTINGS", "SECURITY"].map((label) => (
                <div key={label} className="metric-badge">{label}</div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="chat-area flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-3xl mx-auto flex flex-col gap-5">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {msg.role === "jarvis" ? <div className="avatar-jarvis">JV</div> : <div className="avatar-user">U</div>}
                  <div className={`flex flex-col gap-1 max-w-lg ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.15em" }}>
                      {msg.role === "user" ? "OPERATOR" : "J.A.R.V.I.S"} · {msg.time}
                    </div>
                    <div className={`${msg.role === "user" ? "msg-user" : "msg-jarvis"} px-4 py-3 rounded-sm leading-relaxed relative`}>
                      {msg.role === "jarvis" && (<><div className="corner-decoration corner-tl" style={{ width: 7, height: 7 }} /><div className="corner-decoration corner-br" style={{ width: 7, height: 7 }} /></>)}
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 items-start">
                  <div className="avatar-jarvis">JV</div>
                  <div className="flex flex-col gap-1">
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.15em" }}>J.A.R.V.I.S · PROCESSING</div>
                    <div className="msg-jarvis px-4 py-3 rounded-sm flex items-center gap-2">
                      <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-3 flex-shrink-0">
              <div className="max-w-3xl mx-auto">
                <div className="section-label mb-2">// SUGGESTED COMMANDS</div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="capability-tag rounded-sm" onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-6 pb-5 flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              <div className="input-wrapper rounded-sm p-3 flex items-end gap-3 relative">
                <div className="corner-decoration corner-tl" /><div className="corner-decoration corner-tr" />
                <div className="corner-decoration corner-bl" /><div className="corner-decoration corner-br" />
                <textarea ref={inputRef} className="chat-input" placeholder="Enter command or query..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} rows={1} style={{ maxHeight: 120, overflowY: "auto" }} />
                <button className="send-btn px-4 py-2 rounded-sm flex-shrink-0" onClick={() => sendMessage()} disabled={!input.trim() || isTyping}>SEND ▶</button>
              </div>
              <div className="flex justify-between mt-2 px-1">
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em" }}>SHIFT+ENTER for new line · ENTER to transmit</span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.1em" }}>ENC: AES-256</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}