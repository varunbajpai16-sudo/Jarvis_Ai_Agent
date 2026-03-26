import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── Tailwind does not include all arbitrary values at runtime, so we keep
   the few custom CSS variables and keyframes in a tiny inline <style> tag.
   Everything else is Tailwind utility classes.                              */

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  :root {
    --cyan:        #00e5ff;
    --cyan-dim:    #00b8cc;
    --cyan-ghost:  rgba(0,229,255,0.08);
    --cyan-glow:   rgba(0,229,255,0.25);
    --text-bright: #c8f4ff;
    --text-mid:    #5ca8bb;
    --text-dim:    #2e6a7a;
    --border:      rgba(0,229,255,0.15);
    --border-bright:rgba(0,229,255,0.4);
    --danger:      #ff3d5a;
    --warning:     #ffb830;
    --success:     #00ff9d;
    --bg-deep:     #010d12;
    --bg-panel:    #021820;
    --bg-card:     #031e28;
    --bg-hover:    #042535;
    --font-mono:   'Share Tech Mono', monospace;
    --font-ui:     'Rajdhani', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg-deep); }

  /* scanline */
  .scanline::before {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:9999;
    background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.08) 2px,rgba(0,0,0,.08) 4px);
  }

  /* fonts */
  .font-mono-custom { font-family: var(--font-mono); }
  .font-ui          { font-family: var(--font-ui); }

  /* pulse ring */
  @keyframes pulseRing {
    0%,100%{ box-shadow: 0 0 12px var(--cyan-glow), inset 0 0 8px rgba(0,229,255,.1); }
    50%    { box-shadow: 0 0 20px var(--cyan-glow), inset 0 0 14px rgba(0,229,255,.2); }
  }
  @keyframes pulseDot {
    0%,100%{ opacity:1; transform:scale(1); }
    50%    { opacity:.7; transform:scale(.85); }
  }
  .logo-ring {
    width:36px;height:36px;border-radius:50%;border:1.5px solid var(--cyan);
    display:flex;align-items:center;justify-content:center;position:relative;
    animation: pulseRing 3s ease-in-out infinite;
  }
  .logo-ring::before {
    content:'';width:8px;height:8px;background:var(--cyan);border-radius:50%;
    box-shadow:0 0 10px var(--cyan);animation:pulseDot 3s ease-in-out infinite;
  }

  /* blink */
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.4} }
  .blink { animation: blink 2s ease-in-out infinite; }
  .blink-fast { animation: blink .8s infinite; }

  /* fade-in panels */
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .fade-up   { animation: fadeUp .4s ease both; }
  .delay-1   { animation-delay:.08s; }
  .delay-2   { animation-delay:.16s; }
  .delay-3   { animation-delay:.24s; }
  .delay-4   { animation-delay:.32s; }

  /* clip shapes */
  .clip-arrow-l { clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%); }
  .clip-arrow-s { clip-path: polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%); }
  .clip-arrow-xs{ clip-path: polygon(3px 0%,100% 0%,calc(100% - 3px) 100%,0% 100%); }
  .clip-panel   { clip-path: polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%); }

  /* sidebar glow line */
  .sidebar-glow::after {
    content:'';position:absolute;top:0;right:0;bottom:0;width:1px;
    background:linear-gradient(to bottom,transparent,var(--cyan) 30%,var(--cyan) 70%,transparent);
    opacity:.3;
  }

  /* panel corner cuts */
  .panel-corners::before,.panel-corners::after {
    content:'';position:absolute;width:12px;height:12px;border-color:var(--cyan);border-style:solid;opacity:.5;
  }
  .panel-corners::before { top:0;left:0;border-width:1px 0 0 1px; }
  .panel-corners::after  { bottom:0;right:0;border-width:0 1px 1px 0; }

  /* scan line bar */
  .scan-bar {
    position:absolute;bottom:0;left:0;right:0;height:1px;opacity:.4;
    background:linear-gradient(to right,transparent 20%,var(--cyan) 50%,transparent 80%);
  }
  .scan-bar-danger {
    background:linear-gradient(to right,transparent 20%,var(--danger) 50%,transparent 80%);
  }

  /* custom toggle */
  .toggle-wrap { position:relative;width:42px;height:22px;flex-shrink:0; }
  .toggle-wrap input { opacity:0;width:0;height:0;position:absolute; }
  .toggle-track {
    position:absolute;inset:0;background:var(--bg-panel);border:1px solid var(--border);
    cursor:pointer;transition:all .25s;
    clip-path:polygon(3px 0%,100% 0%,calc(100% - 3px) 100%,0% 100%);
  }
  .toggle-track::after {
    content:'';position:absolute;left:3px;top:3px;width:14px;height:14px;
    background:var(--text-dim);transition:all .25s;
    clip-path:polygon(2px 0%,100% 0%,calc(100% - 2px) 100%,0% 100%);
  }
  .toggle-wrap input:checked + .toggle-track {
    background:rgba(0,229,255,.1);border-color:var(--cyan);box-shadow:0 0 10px rgba(0,229,255,.2);
  }
  .toggle-wrap input:checked + .toggle-track::after {
    left:calc(100% - 17px);background:var(--cyan);box-shadow:0 0 8px var(--cyan);
  }

  /* custom range */
  .range-input { flex:1;-webkit-appearance:none;appearance:none;height:3px;background:var(--bg-panel);border:1px solid var(--border);outline:none;cursor:pointer; }
  .range-input::-webkit-slider-thumb { -webkit-appearance:none;width:14px;height:14px;background:var(--cyan);cursor:pointer;clip-path:polygon(2px 0%,100% 0%,calc(100% - 2px) 100%,0% 100%);box-shadow:0 0 8px var(--cyan-glow); }

  /* custom select */
  .custom-select {
    background:var(--bg-panel);border:1px solid var(--border);color:var(--text-bright);
    font-family:var(--font-mono);font-size:11px;padding:6px 28px 6px 10px;letter-spacing:1px;
    cursor:pointer;transition:border-color .2s;outline:none;
    clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);
    min-width:130px;appearance:none;-webkit-appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M2 3 L5 7 L8 3' stroke='%235ca8bb' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
    background-repeat:no-repeat;background-position:right 10px center;
  }
  .custom-select:hover,.custom-select:focus { border-color:var(--cyan-dim); }

  /* custom text input */
  .custom-input {
    background:var(--bg-panel);border:1px solid var(--border);color:var(--text-bright);
    font-family:var(--font-mono);font-size:11px;padding:6px 10px;letter-spacing:.5px;
    outline:none;transition:border-color .2s;min-width:200px;
  }
  .custom-input:focus { border-color:var(--cyan-dim);box-shadow:0 0 8px rgba(0,229,255,.12); }

  /* scrollbar */
  ::-webkit-scrollbar { width:5px;height:5px; }
  ::-webkit-scrollbar-track { background:var(--bg-deep); }
  ::-webkit-scrollbar-thumb { background:var(--border); }
  ::-webkit-scrollbar-thumb:hover { background:var(--border-bright); }
`;

/* ── tiny helpers ── */
const Toggle = ({ checked, onChange }) => (
  <label className="toggle-wrap">
    <input type="checkbox" defaultChecked={checked} onChange={onChange} />
    <span className="toggle-track" />
  </label>
);

const Slider = ({ min = 0, max = 100, defaultValue, suffix = "%" }) => {
  const [val, setVal] = useState(defaultValue);
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 180 }}
    >
      <input
        type="range"
        className="range-input"
        min={min}
        max={max}
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <span
        className="font-mono-custom"
        style={{
          fontSize: 11,
          color: "var(--cyan)",
          minWidth: 32,
          textAlign: "right",
        }}
      >
        {val}
        {suffix}
      </span>
    </div>
  );
};

const Select = ({ options, defaultValue }) => (
  <select
    className="custom-select font-mono-custom"
    defaultValue={defaultValue}
  >
    {options.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
);

const Btn = ({ variant = "primary", children, ...props }) => {
  const styles = {
    primary: { borderColor: "var(--cyan)", color: "var(--cyan)" },
    secondary: { borderColor: "var(--border)", color: "var(--text-mid)" },
    danger: { borderColor: "rgba(255,61,90,0.4)", color: "var(--danger)" },
    warning: { borderColor: "rgba(255,184,48,0.4)", color: "var(--warning)" },
  };
  return (
    <button
      {...props}
      className="clip-panel font-mono-custom"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: 2,
        textTransform: "uppercase",
        padding: "8px 18px",
        border: "1px solid",
        cursor: "pointer",
        transition: "all .2s",
        background: "transparent",
        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
};

/* ── setting row wrappers ── */
const SettingRow = ({ label, desc, children, noBorder }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      gap: 16,
      padding: "12px 0",
      borderBottom: noBorder ? "none" : "1px solid rgba(0,229,255,0.06)",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-bright)",
          letterSpacing: ".5px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.4 }}>
        {desc}
      </div>
    </div>
    {children}
  </div>
);

/* ── panel wrapper ── */
const Panel = ({
  title,
  subtitle,
  badge,
  icon,
  delay = "",
  dangerMode,
  children,
}) => (
  <div
    className={`panel-corners fade-up ${delay}`}
    style={{
      background: "var(--bg-card)",
      border: `1px solid ${dangerMode ? "rgba(255,61,90,0.2)" : "var(--border)"}`,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div className={`scan-bar ${dangerMode ? "scan-bar-danger" : ""}`} />
    {/* header */}
    <div
      style={{
        padding: "14px 20px 12px",
        borderBottom: `1px solid ${dangerMode ? "rgba(255,61,90,0.15)" : "var(--border)"}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: dangerMode
          ? "rgba(255,61,90,0.03)"
          : "rgba(0,229,255,0.02)",
      }}
    >
      <div
        className="clip-arrow-s"
        style={{
          width: 28,
          height: 28,
          border: `1px solid ${dangerMode ? "rgba(255,61,90,0.3)" : "var(--border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-panel)",
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke={dangerMode ? "var(--danger)" : "var(--cyan)"}
          strokeWidth="1.5"
          style={{ width: 13, height: 13 }}
        >
          {icon}
        </svg>
      </div>
      <div>
        <div
          className="font-mono-custom"
          style={{
            fontSize: 11,
            letterSpacing: 2,
            color: dangerMode ? "var(--danger)" : "var(--cyan)",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-dim)",
            marginTop: 1,
            letterSpacing: ".5px",
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        className="clip-arrow-xs font-mono-custom"
        style={{
          marginLeft: "auto",
          fontSize: 9,
          padding: "3px 8px",
          border: `1px solid ${dangerMode ? "rgba(255,61,90,0.3)" : "var(--border)"}`,
          color: dangerMode ? "var(--danger)" : "var(--text-dim)",
          letterSpacing: 1,
        }}
      >
        {badge}
      </div>
    </div>
    {/* body */}
    <div
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
    >
      {children}
    </div>
  </div>
);

/* ── nav icon helper ── */
const NavIcon = ({ d, extra }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    style={{ width: 13, height: 13, flexShrink: 0 }}
  >
    {d && <path d={d} />}
    {extra}
  </svg>
);

/* ── MAIN COMPONENT ── */
export default function JarvisSettings() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("General");
  const [selectedColor, setSelectedColor] = useState("#00e5ff");

  const COLORS = ["#00e5ff", "#00ff9d", "#ff3d5a", "#ffb830", "#9b59b6"];

  const SNAV = [
    {
      label: "General",
      icon: (
        <>
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42" />
        </>
      ),
    },
    {
      label: "Interface",
      icon: (
        <>
          <rect x="2" y="2" width="12" height="12" rx="1" />
          <path d="M5 8h6M8 5v6" />
        </>
      ),
    },
    {
      label: "Audio",
      icon: (
        <>
          <path d="M13 7A5 5 0 003 7v1a5 5 0 0010 0V7z" />
          <path d="M8 12v3M6 15h4" />
        </>
      ),
    },
    {
      label: "AI Core",
      icon: (
        <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5z" />
      ),
    },
    {
      label: "Network",
      icon: (
        <>
          <rect x="2" y="4" width="12" height="9" rx="1" />
          <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
        </>
      ),
    },
    {
      label: "Logs",
      icon: (
        <>
          <rect x="3" y="1" width="10" height="14" rx="1" />
          <path d="M6 5h4M6 8h4M6 11h2" />
        </>
      ),
    },
    { label: "divider" },
    {
      label: "About",
      icon: (
        <>
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM8 6v4M8 11v1" />
        </>
      ),
    },
  ];

  const PERMISSIONS = [
    {
      name: "Network Access",
      desc: "Read and write external network connections",
      status: "GRANTED",
      color: "var(--success)",
      icon: (
        <>
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1z" />
          <path d="M5 8l2 2 4-4" />
        </>
      ),
    },
    {
      name: "File System",
      desc: "Read-only access to designated directories",
      status: "GRANTED",
      color: "var(--success)",
      icon: (
        <>
          <rect x="2" y="4" width="12" height="8" rx="1" />
          <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
        </>
      ),
    },
    {
      name: "Hardware Interface",
      desc: "Direct hardware sensor and actuator control",
      status: "RESTRICTED",
      color: "var(--warning)",
      icon: (
        <>
          <path d="M8 1L1 14h14L8 1z" />
          <path d="M8 6v4M8 11v1" />
        </>
      ),
    },
    {
      name: "External API Keys",
      desc: "Access to stored third-party service credentials",
      status: "DENIED",
      color: "var(--danger)",
      icon: (
        <>
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1z" />
          <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />
        </>
      ),
    },
  ];

  const permBadge = (s) =>
    ({
      GRANTED: {
        bg: "rgba(0,255,157,.08)",
        border: "rgba(0,255,157,.3)",
        color: "var(--success)",
      },
      RESTRICTED: {
        bg: "rgba(255,184,48,.08)",
        border: "rgba(255,184,48,.3)",
        color: "var(--warning)",
      },
      DENIED: {
        bg: "rgba(255,61,90,.08)",
        border: "rgba(255,61,90,.3)",
        color: "var(--danger)",
      },
    })[s];

  return (
    <>
      <style>{STYLE}</style>
      <div
        className="scanline font-ui"
        style={{
          background: "var(--bg-deep)",
          color: "var(--text-bright)",
          minHeight: "100vh",
          display: "flex",
          overflow: "hidden",
          fontFamily: "var(--font-ui)",
          fontSize: 14,
        }}
      >
        {/* ── SIDEBAR ── */}
        <div
          className="sidebar-glow"
          style={{
            width: 210,
            minWidth: 210,
            background: "var(--bg-panel)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* logo */}
          <div
            style={{
              padding: "18px 20px 16px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div className="logo-ring" />
            <div style={{ lineHeight: 1.1 }}>
              <div
                className="font-mono-custom"
                style={{ fontSize: 13, color: "var(--cyan)", letterSpacing: 2 }}
              >
                J.A.R.V.I.S
              </div>
              <div
                className="font-mono-custom"
                style={{
                  fontSize: 10,
                  color: "var(--text-mid)",
                  letterSpacing: 1,
                }}
              >
                V7.3.1 — ONLINE
              </div>
            </div>
          </div>

          {/* sessions */}
          <div
            className="font-mono-custom"
            style={{
              fontSize: 9,
              color: "var(--text-dim)",
              letterSpacing: 2,
              padding: "14px 20px 6px",
              textTransform: "uppercase",
            }}
          >
            // Sessions
          </div>
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            {[
              ["System Diagnostics", "Today"],
              ["Mission Briefing Alpha", "Today"],
              ["Threat Analysis Report", "Yesterday"],
              ["Power Core Status", "Yesterday"],
              ["Neural Network Update", "Mar 22"],
            ].map(([name, date]) => (
              <div
                key={name}
                style={{
                  padding: "9px 20px",
                  cursor: "pointer",
                  borderLeft: "2px solid transparent",
                  transition: "all .18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--cyan-ghost)";
                  e.currentTarget.style.borderLeftColor =
                    "var(--border-bright)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderLeftColor = "transparent";
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-bright)",
                    letterSpacing: ".3px",
                  }}
                >
                  {name}
                </div>
                <div
                  className="font-mono-custom"
                  style={{
                    fontSize: 10,
                    color: "var(--text-dim)",
                    marginTop: 1,
                  }}
                >
                  {date}
                </div>
              </div>
            ))}
          </div>

          {/* status */}
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div
              className="font-mono-custom"
              style={{
                fontSize: 9,
                color: "var(--text-dim)",
                letterSpacing: 2,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              // System Status
            </div>
            {[
              ["CORE TEMP", "36.2°C", "var(--warning)"],
              ["UPTIME", "99.97%", "var(--success)"],
            ].map(([k, v, c]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span
                  className="font-mono-custom"
                  style={{
                    fontSize: 11,
                    color: "var(--text-mid)",
                    letterSpacing: ".5px",
                  }}
                >
                  {k}
                </span>
                <span
                  className="font-mono-custom"
                  style={{ fontSize: 11, color: c }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* topbar */}
          <div
            style={{
              height: 48,
              background: "var(--bg-panel)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              gap: 16,
              flexShrink: 0,
            }}
          >
            <div
              onClick={() => navigate("/chat")}
              className="clip-arrow-xs"
              style={{
                width: 28,
                height: 28,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg
                viewBox="0 0 12 12"
                fill="none"
                stroke="var(--text-mid)"
                strokeWidth="1.5"
                style={{ width: 12, height: 12 }}
              >
                <path d="M8 2L4 6L8 10" />
              </svg>
            </div>
            <div
              className="font-mono-custom"
              style={{ fontSize: 13, color: "var(--cyan)", letterSpacing: 3 }}
            >
              SETTINGS
            </div>
            <div
              className="font-mono-custom"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                color: "var(--text-mid)",
                letterSpacing: 1,
              }}
            >
              <div
                className="blink"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--success)",
                  boxShadow: "0 0 6px var(--success)",
                }}
              />
              ALL SYSTEMS NOMINAL
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {["ANALYTICS", "SETTINGS", "SECURITY"].map((t) => (
                <button
                  key={t}
                  className="clip-arrow-s font-mono-custom"
                  style={{
                    padding: "5px 14px",
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    background:
                      t === "SETTINGS" ? "rgba(0,229,255,0.07)" : "transparent",
                    border: `1px solid ${t === "SETTINGS" ? "var(--cyan)" : "var(--border)"}`,
                    color: t === "SETTINGS" ? "var(--cyan)" : "var(--text-mid)",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* settings body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "28px 32px",
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            {/* left nav */}
            <div
              style={{
                position: "sticky",
                top: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <div
                className="font-mono-custom"
                style={{
                  fontSize: 9,
                  color: "var(--text-dim)",
                  letterSpacing: 2,
                  padding: "0 12px 8px",
                  textTransform: "uppercase",
                }}
              >
                // Config Modules
              </div>
              {SNAV.map((item, i) => {
                if (item.label === "divider")
                  return (
                    <div
                      key={i}
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(to right,transparent,var(--border),transparent)",
                        margin: "10px 0",
                      }}
                    />
                  );
                const isActive = activeNav === item.label;
                return (
                  <div
                    key={item.label}
                    onClick={() => setActiveNav(item.label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "8px 12px",
                      borderLeft: `2px solid ${isActive ? "var(--cyan)" : "transparent"}`,
                      cursor: "pointer",
                      transition: "all .18s",
                      color: isActive ? "var(--cyan)" : "var(--text-mid)",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      background: isActive
                        ? "rgba(0,229,255,0.06)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "var(--text-bright)";
                        e.currentTarget.style.background = "var(--cyan-ghost)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "var(--text-mid)";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ width: 13, height: 13, flexShrink: 0 }}
                    >
                      {item.icon}
                    </svg>
                    {item.label}
                  </div>
                );
              })}
            </div>

            {/* panels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* General */}
              <Panel
                title="General Configuration"
                subtitle="Core system preferences and behavior"
                badge="MODULE 01"
                icon={
                  <>
                    <circle cx="8" cy="8" r="3" />
                    <path d="M8 1v2M8 13v2M1 8h2M13 8h2" />
                  </>
                }
              >
                <SettingRow
                  label="Auto-start on Boot"
                  desc="Launch J.A.R.V.I.S automatically when system initializes"
                >
                  <Toggle checked />
                </SettingRow>
                <SettingRow
                  label="Persistent Session Memory"
                  desc="Retain context and session data across restarts"
                >
                  <Toggle checked />
                </SettingRow>
                <SettingRow
                  label="Telemetry Reporting"
                  desc="Send anonymized usage data to improve system performance"
                >
                  <Toggle />
                </SettingRow>
                <SettingRow
                  label="System Language"
                  desc="Primary language for responses and interface"
                >
                  <Select
                    options={[
                      "ENGLISH (US)",
                      "ENGLISH (UK)",
                      "FRANÇAIS",
                      "DEUTSCH",
                      "日本語",
                    ]}
                    defaultValue="ENGLISH (US)"
                  />
                </SettingRow>
                <SettingRow
                  label="Timezone"
                  desc="Reference timezone for timestamps and scheduling"
                  noBorder
                >
                  <Select
                    options={[
                      "UTC+00:00",
                      "UTC-05:00 EST",
                      "UTC-08:00 PST",
                      "UTC+05:30 IST",
                    ]}
                    defaultValue="UTC+00:00"
                  />
                </SettingRow>
              </Panel>

              {/* Interface */}
              <Panel
                title="Interface & Display"
                subtitle="Visual settings and UI behavior"
                badge="MODULE 02"
                delay="delay-1"
                icon={
                  <>
                    <rect x="1" y="3" width="14" height="10" rx="1" />
                    <path d="M5 13v2M11 13v2M3 15h10" />
                  </>
                }
              >
                <SettingRow
                  label="Scanline Overlay"
                  desc="Enable CRT-style scanline visual effect"
                >
                  <Toggle checked />
                </SettingRow>
                <SettingRow
                  label="Holographic Flicker"
                  desc="Subtle flicker animation on system elements"
                >
                  <Toggle checked />
                </SettingRow>
                <SettingRow
                  label="Interface Opacity"
                  desc="Adjust translucency of panel backgrounds"
                >
                  <Slider min={20} max={100} defaultValue={85} />
                </SettingRow>
                <SettingRow
                  label="Glow Intensity"
                  desc="Control the cyan glow strength on active elements"
                >
                  <Slider defaultValue={60} />
                </SettingRow>
                <SettingRow
                  label="Accent Color"
                  desc="Primary interface highlight color"
                >
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    {COLORS.map((c) => (
                      <div
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className="clip-arrow-xs"
                        style={{
                          width: 24,
                          height: 24,
                          background: c,
                          cursor: "pointer",
                          border: `1px solid ${selectedColor === c ? "var(--cyan)" : "var(--border)"}`,
                          transition: "all .2s",
                          boxShadow:
                            selectedColor === c
                              ? "0 0 8px var(--cyan-glow)"
                              : "none",
                          transform:
                            selectedColor === c ? "scale(1.1)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                </SettingRow>
                <SettingRow
                  label="Font Scale"
                  desc="Global text size multiplier"
                  noBorder
                >
                  <Select
                    options={[
                      "SMALL (90%)",
                      "DEFAULT (100%)",
                      "LARGE (115%)",
                      "X-LARGE (130%)",
                    ]}
                    defaultValue="DEFAULT (100%)"
                  />
                </SettingRow>
              </Panel>

              {/* AI Core */}
              <Panel
                title="AI Core Parameters"
                subtitle="Neural processing and response configuration"
                badge="MODULE 04"
                delay="delay-2"
                icon={
                  <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5z" />
                }
              >
                <SettingRow
                  label="Response Mode"
                  desc="Balance between speed and thoroughness"
                >
                  <Select
                    options={["RAPID", "BALANCED", "THOROUGH", "DEEP ANALYSIS"]}
                    defaultValue="BALANCED"
                  />
                </SettingRow>
                <SettingRow
                  label="Confidence Threshold"
                  desc="Minimum confidence before providing response without disclaimer"
                >
                  <Slider defaultValue={75} />
                </SettingRow>
                <SettingRow
                  label="Contextual Memory Depth"
                  desc="Number of previous exchanges to retain in active context"
                >
                  <Slider min={5} max={100} defaultValue={32} suffix="" />
                </SettingRow>
                <SettingRow
                  label="Proactive Suggestions"
                  desc="Surface relevant commands and insights unprompted"
                >
                  <Toggle checked />
                </SettingRow>
                <SettingRow
                  label="Voice Synthesis"
                  desc="Enable text-to-speech output for responses"
                >
                  <Toggle />
                </SettingRow>
                <SettingRow
                  label="System Directive"
                  desc="Custom personality directive for this instance"
                  noBorder
                >
                  <input
                    className="custom-input font-mono-custom"
                    defaultValue="Tactical, precise, minimal verbosity"
                    placeholder="Enter directive..."
                  />
                </SettingRow>
              </Panel>

              {/* Permissions */}
              <Panel
                title="Access Permissions"
                subtitle="System resource authorization levels"
                badge="MODULE 06"
                delay="delay-3"
                icon={
                  <path d="M8 1L13 3V8C13 11.5 8 15 8 15S3 11.5 3 8V3L8 1Z" />
                }
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {PERMISSIONS.map((p) => {
                    const b = permBadge(p.status);
                    return (
                      <div
                        key={p.name}
                        className="clip-arrow-l"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 12px",
                          background: "var(--bg-panel)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            color: p.color,
                          }}
                        >
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            style={{ width: 14, height: 14 }}
                          >
                            {p.icon}
                          </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "var(--text-bright)",
                              letterSpacing: ".5px",
                            }}
                          >
                            {p.name}
                          </div>
                          <div
                            style={{ fontSize: 10, color: "var(--text-dim)" }}
                          >
                            {p.desc}
                          </div>
                        </div>
                        <div
                          className="clip-arrow-xs font-mono-custom"
                          style={{
                            fontSize: 9,
                            padding: "3px 8px",
                            letterSpacing: 1,
                            background: b.bg,
                            border: `1px solid ${b.border}`,
                            color: b.color,
                          }}
                        >
                          {p.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 4,
                  }}
                >
                  <Btn variant="warning">Request Elevation</Btn>
                  <Btn variant="secondary">Audit Log</Btn>
                </div>
              </Panel>

              {/* Danger Zone */}
              <Panel
                title="Danger Zone"
                subtitle="Irreversible system operations — proceed with caution"
                badge="CAUTION"
                delay="delay-4"
                dangerMode
                icon={
                  <>
                    <path d="M8 1L1 14h14L8 1z" />
                    <path d="M8 6v4M8 11v1" />
                  </>
                }
              >
                <SettingRow
                  label="Purge Session History"
                  desc="Permanently delete all stored conversation logs and session data"
                >
                  <Btn variant="danger">PURGE</Btn>
                </SettingRow>
                <SettingRow
                  label="Reset to Factory Defaults"
                  desc="Restore all configuration to initial system defaults"
                >
                  <Btn variant="danger">RESET</Btn>
                </SettingRow>
                <SettingRow
                  label="Terminate Instance"
                  desc="Shut down J.A.R.V.I.S and clear all active processes from memory"
                  noBorder
                >
                  <Btn variant="danger">TERMINATE</Btn>
                </SettingRow>
              </Panel>
            </div>
          </div>

          {/* save bar */}
          <div
            style={{
              height: 48,
              background: "var(--bg-panel)",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              padding: "0 32px",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div
              className="font-mono-custom"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                color: "var(--text-dim)",
                letterSpacing: 1,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--warning)",
                  boxShadow: "0 0 6px var(--warning)",
                }}
              />
              UNSAVED CHANGES DETECTED
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <Btn variant="secondary">DISCARD</Btn>
              <Btn variant="primary">APPLY CHANGES</Btn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
