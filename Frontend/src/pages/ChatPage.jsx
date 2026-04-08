import { useState, useRef, useEffect } from "react";
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

  /* SIDEBAR */
  .sidebar {
    background: linear-gradient(180deg, #060f1a 0%, #050d14 100%);
    border-right: 1px solid var(--cyan-border);
    position: relative; z-index: 20;
    flex-shrink: 0;
    width: 256px;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, width 0.3s ease;
  }
  .sidebar::after {
    content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 1px;
    background: linear-gradient(180deg, transparent, var(--cyan), transparent); opacity: 0.4;
  }

  /* Mobile sidebar — slides over content as overlay */
  @media (max-width: 767px) {
    .sidebar {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: 280px;
      transform: translateX(-100%);
      box-shadow: 4px 0 30px rgba(0,0,0,0.6);
      z-index: 50;
    }
    .sidebar.open { transform: translateX(0); }
  }

  /* Tablet sidebar — narrow icon-less strip, expands on open */
  @media (min-width: 768px) and (max-width: 1023px) {
    .sidebar {
      width: 64px;
      overflow: hidden;
    }
    .sidebar.open { width: 240px; }
    .sidebar-hide-collapsed { opacity: 0; pointer-events: none; transition: opacity 0.2s; white-space: nowrap; overflow: hidden; }
    .sidebar.open .sidebar-hide-collapsed { opacity: 1; pointer-events: auto; }
  }

  /* Mobile overlay backdrop */
  .sidebar-backdrop {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 40;
    backdrop-filter: blur(2px);
  }
  @media (max-width: 767px) {
    .sidebar-backdrop.visible { display: block; }
  }

  .logo-text { font-family: 'Orbitron', monospace; color: var(--cyan); text-shadow: 0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.3); letter-spacing: 0.2em; }
  .logo-sub { font-family: 'Rajdhani', sans-serif; color: var(--text-dim); letter-spacing: 0.3em; font-size: 9px; text-transform: uppercase; }

  .orb-container { position: relative; width: 48px; height: 48px; flex-shrink: 0; }
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

  /* Smaller avatars on mobile */
  @media (max-width: 480px) {
    .avatar-jarvis, .avatar-user { width: 26px; height: 26px; font-size: 8px; }
    .msg-user, .msg-jarvis { font-size: 14px; }
  }

  .input-wrapper { background: rgba(5,15,25,0.9); border: 1px solid var(--cyan-border); transition: border-color 0.2s, box-shadow 0.2s; position: relative; }
  .input-wrapper:focus-within { border-color: rgba(0,212,255,0.5); box-shadow: 0 0 20px rgba(0,212,255,0.08), inset 0 0 20px rgba(0,212,255,0.03); }
  .chat-input { background: transparent; border: none; outline: none; color: #d0f0ff; font-family: 'Rajdhani', sans-serif; font-size: 15px; caret-color: var(--cyan); width: 100%; resize: none; }
  .chat-input::placeholder { color: var(--text-dim); letter-spacing: 0.05em; }

  .send-btn { background: linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,100,180,0.1) 100%); border: 1px solid rgba(0,212,255,0.4); color: var(--cyan); cursor: pointer; transition: all 0.2s; font-family: 'Orbitron', monospace; font-size: 10px; letter-spacing: 0.1em; white-space: nowrap; }
  .send-btn:hover { background: rgba(0,212,255,0.2); box-shadow: 0 0 20px rgba(0,212,255,0.3); border-color: var(--cyan); }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .topbar { background: rgba(5,13,20,0.95); border-bottom: 1px solid var(--cyan-border); backdrop-filter: blur(10px); position: relative; z-index: 10; }
  .topbar::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--cyan), transparent); opacity: 0.3; }

  .status-dot { width: 6px; height: 6px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 8px var(--cyan); animation: pulse 2s ease-in-out infinite; flex-shrink: 0; }
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

  /* Hide topbar nav labels on small screens, show only on md+ */
  .nav-label-hide { display: inline; }
  @media (max-width: 480px) {
    .nav-label-hide { display: none; }
    .metric-badge { padding: 3px 6px; font-size: 8px; }
  }

  /* Message bubble max-width responsive */
  .msg-bubble { max-width: 420px; }
  @media (max-width: 640px) { .msg-bubble { max-width: 85vw; } }

  /* Chat area padding responsive */
  .chat-area-pad { padding: 24px; }
  @media (max-width: 640px) { .chat-area-pad { padding: 16px 12px; } }

  /* Input area padding responsive */
  .input-area-pad { padding: 0 24px 20px; }
  @media (max-width: 640px) { .input-area-pad { padding: 0 10px 12px; } }

  /* Suggestion area padding */
  .suggest-pad { padding: 0 24px 12px; }
  @media (max-width: 640px) { .suggest-pad { padding: 0 10px 10px; } }

  /* Topbar hint text — hide on very small screens */
  .topbar-hint { display: flex; }
  @media (max-width: 380px) { .topbar-hint { display: none; } }

  /* Bottom hint text */
  .input-hint { display: flex; justify-content: space-between; margin-top: 8px; padding: 0 4px; }
  @media (max-width: 480px) { .input-hint { display: none; } }
`;

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "jarvis",
    text: "Good day. I am J.A.R.V.I.S — Just A Rather Very Intelligent System. All core systems are online and operating at full capacity. How may I assist you today?",
    time: "09:41",
  },
];

const SAMPLE_CHATS = [
  { id: 1, title: "System Diagnostics", time: "Today" },
  { id: 2, title: "Mission Briefing Alpha", time: "Today" },
  { id: 3, title: "Threat Analysis Report", time: "Yesterday" },
  { id: 4, title: "Power Core Status", time: "Yesterday" },
  { id: 5, title: "Neural Network Update", time: "Mar 22" },
];

const SUGGESTIONS = [
  "Run system diagnostics",
  "Analyze threat levels",
  "Show power grid status",
  "Brief me on latest intel",
];

export default function JarvisChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Detect breakpoint to set default sidebar state
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setSidebarOpen(mq.matches);
    const handler = (e) => setSidebarOpen(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Close sidebar on mobile when clicking a chat
  const handleChatSelect = (id) => {
    setActiveChat(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const getTime = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    if (window.innerWidth < 768) setSidebarOpen(false);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: msg, time: getTime() },
    ]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "jarvis",
          text: "Understood. I am processing your request now. All relevant data streams have been cross-referenced and analyzed. Please stand by while I compile the optimal response for your query.",
          time: getTime(),
        },
      ]);
    }, 1800);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <style>{style}</style>
      <div className="jarvis-bg" style={{ display: "flex", height: "100dvh", width: "100vw", overflow: "hidden" }}>
        <div className="grid-bg" />
        <div className="center-glow" />
        <div className="scanlines" />

        {/* Mobile backdrop */}
        <div
          className={`sidebar-backdrop${sidebarOpen && window.innerWidth < 768 ? " visible" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* SIDEBAR */}
        <div className={`sidebar${sidebarOpen ? " open" : ""}`}>

          {/* Logo header */}
          <div style={{ padding: "20px", borderBottom: "1px solid rgba(0,212,255,0.1)", position: "relative", flexShrink: 0 }}>
            <div className="corner-decoration corner-tl" />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="orb-container">
                <div className="orb-ring" />
                <div className="orb-ring-2" />
                <div className="orb-core" />
              </div>
              <div className="sidebar-hide-collapsed">
                <div className="logo-text" style={{ fontSize: 14, fontWeight: 700 }}>J.A.R.V.I.S</div>
                <div className="logo-sub">v7.3.1 — online</div>
              </div>
            </div>
          </div>

          {/* New session button */}
          <div style={{ padding: "16px", flexShrink: 0 }}>
            <button
              className="new-chat-btn sidebar-hide-collapsed"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onClick={() => { setMessages(INITIAL_MESSAGES); if (window.innerWidth < 768) setSidebarOpen(false); }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
              <span>NEW SESSION</span>
            </button>
      
          </div>

          {/* Sessions list */}
          <div style={{ padding: "0 16px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            <div className="section-label sidebar-hide-collapsed" style={{ marginBottom: 12 }}>// SESSIONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {SAMPLE_CHATS.map((c) => (
                <button
                  key={c.id}
                  className={`chat-btn${activeChat === c.id ? " active" : ""}`}
                  style={{ padding: "10px 12px", borderRadius: 2, width: "100%" }}
                  onClick={() => handleChatSelect(c.id)}
                >
                  <div className="sidebar-hide-collapsed">
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2, letterSpacing: "0.05em" }}>{c.time}</div>
                  </div>
                  {/* Collapsed tablet: dot indicator */}
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: activeChat === c.id ? "var(--cyan)" : "var(--text-dim)", margin: "0 auto" }} />
                </button>
              ))}
            </div>
          </div>

          {/* System status */}
          <div className="sidebar-hide-collapsed" style={{ padding: "16px", borderTop: "1px solid rgba(0,212,255,0.1)", flexShrink: 0 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>// SYSTEM STATUS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["CORE TEMP", "36.2°C"], ["UPTIME", "99.97%"], ["MEMORY", "12.4 GB"]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em" }}>{label}</span>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: "var(--cyan)" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN PANEL */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", position: "relative", zIndex: 10, overflow: "hidden", minWidth: 0 }}>

          {/* TOPBAR */}
          <div className="topbar" style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                style={{
                  background: "transparent", border: "1px solid var(--cyan-border)", color: "var(--text-dim)",
                  cursor: "pointer", padding: "5px 10px", fontFamily: "'Orbitron', monospace",
                  fontSize: 10, letterSpacing: "0.1em", flexShrink: 0,
                }}
              >
                {sidebarOpen ? "◀" : "▶"}
              </button>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, color: "var(--cyan)", letterSpacing: "0.2em", textShadow: "0 0 15px rgba(0,212,255,0.5)", flexShrink: 0 }}>
                J.A.R.V.I.S
              </div>
              <div className="topbar-hint" style={{ alignItems: "center", gap: 6 }}>
                <div className="status-dot" />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>
                  ALL SYSTEMS NOMINAL
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div
                className="metric-badge chat-btn"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/analytic")}
              >
                <span className="nav-label-hide">ANALYTICS</span>
                <span style={{ display: "none" }} className="nav-icon">◈</span>
              </div>
              <div
                className="metric-badge chat-btn"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/setting")}
              >
                <span className="nav-label-hide">SETTINGS</span>
              </div>
              <div className="metric-badge chat-btn" style={{ cursor: "pointer" }}>
                <span className="nav-label-hide">SECURITY</span>
              </div>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="chat-area chat-area-pad" style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}
                >
                  {msg.role === "jarvis"
                    ? <div className="avatar-jarvis">JV</div>
                    : <div className="avatar-user">U</div>
                  }
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }} className="msg-bubble">
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.15em" }}>
                      {msg.role === "user" ? "OPERATOR" : "J.A.R.V.I.S"} · {msg.time}
                    </div>
                    <div className={`${msg.role === "user" ? "msg-user" : "msg-jarvis"}`} style={{ padding: "12px 16px", borderRadius: 2, lineHeight: 1.6, position: "relative" }}>
                      {msg.role === "jarvis" && (
                        <>
                          <div className="corner-decoration corner-tl" style={{ width: 7, height: 7 }} />
                          <div className="corner-decoration corner-br" style={{ width: 7, height: 7 }} />
                        </>
                      )}
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div className="avatar-jarvis">JV</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.15em" }}>
                      J.A.R.V.I.S · PROCESSING
                    </div>
                    <div className="msg-jarvis" style={{ padding: "12px 16px", borderRadius: 2, display: "flex", alignItems: "center", gap: 6 }}>
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* SUGGESTIONS */}
          {messages.length <= 1 && (
            <div className="suggest-pad" style={{ flexShrink: 0 }}>
              <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <div className="section-label" style={{ marginBottom: 8 }}>// SUGGESTED COMMANDS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="capability-tag" style={{ borderRadius: 2 }} onClick={() => sendMessage(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* INPUT */}
          <div className="input-area-pad" style={{ flexShrink: 0 }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <div className="input-wrapper" style={{ borderRadius: 2, padding: 12, display: "flex", alignItems: "flex-end", gap: 10, position: "relative" }}>
                <div className="corner-decoration corner-tl" />
                <div className="corner-decoration corner-tr" />
                <div className="corner-decoration corner-bl" />
                <div className="corner-decoration corner-br" />
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  placeholder="Enter command or query..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  rows={1}
                  style={{ maxHeight: 100, overflowY: "auto" }}
                />
                <button
                  className="send-btn"
                  style={{ padding: "8px 14px", borderRadius: 2, flexShrink: 0 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                >
                  SEND ▶
                </button>
              </div>
              <div className="input-hint">
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em" }}>
                  SHIFT+ENTER for new line · ENTER to transmit
                </span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.1em" }}>
                  ENC: AES-256
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}