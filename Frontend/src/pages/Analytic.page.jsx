import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; background: #050d14; font-family: 'Rajdhani', sans-serif; }
  :root {
    --cyan: #00d4ff;
    --cyan-dim: #0099bb;
    --cyan-glow: rgba(0,212,255,0.12);
    --cyan-border: rgba(0,212,255,0.22);
    --dark: #050d14;
    --dark2: #071520;
    --dark3: #0a1e2e;
    --text: #b0e8f5;
    --text-dim: #4a8fa8;
  }
  .jarvis-bg { background: var(--dark); min-height: 100vh; position: relative; overflow-x: hidden; }
  .grid-bg {
    position: fixed; inset: 0;
    background-image: linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px; pointer-events: none; z-index: 0;
  }
  .scanlines {
    position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px);
    pointer-events: none; z-index: 1;
  }
  .topbar {
    background: rgba(5,13,20,0.95);
    border-bottom: 1px solid var(--cyan-border);
    padding: 12px 24px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; z-index: 10;
    backdrop-filter: blur(10px);
  }
  .topbar::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent); opacity: 0.3;
  }
  .logo-text { font-family: 'Orbitron', monospace; color: var(--cyan); letter-spacing: 0.2em; font-size: 13px; text-shadow: 0 0 20px rgba(0,212,255,0.5); }
  .section-label { font-family: 'Orbitron', monospace; font-size: 9px; color: var(--text-dim); letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 14px; }
  .status-dot { width: 6px; height: 6px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 8px var(--cyan); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{ opacity:1; box-shadow: 0 0 8px var(--cyan); } 50%{ opacity:0.4; box-shadow: 0 0 3px var(--cyan); } }
  .orb-container { position: relative; width: 28px; height: 28px; }
  .orb-ring { position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid rgba(0,212,255,0.5); animation: orb-spin 4s linear infinite; }
  .orb-ring::before { content: ''; position: absolute; top: -2px; left: 50%; width: 4px; height: 4px; background: var(--cyan); border-radius: 50%; transform: translateX(-50%); }
  .orb-core { position: absolute; inset: 8px; border-radius: 50%; background: radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 100%); }
  @keyframes orb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .metric-card {
    background: linear-gradient(135deg, rgba(5,20,35,0.9), rgba(7,21,32,0.7));
    border: 1px solid var(--cyan-border);
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
  }
  .metric-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent);
  }
  .corner { position: absolute; width: 8px; height: 8px; border-color: rgba(0,212,255,0.4); border-style: solid; }
  .corner-tl { top: 5px; left: 5px; border-width: 1px 0 0 1px; }
  .corner-tr { top: 5px; right: 5px; border-width: 1px 1px 0 0; }
  .corner-bl { bottom: 5px; left: 5px; border-width: 0 0 1px 1px; }
  .corner-br { bottom: 5px; right: 5px; border-width: 0 1px 1px 0; }
  .metric-val { font-family: 'Orbitron', monospace; font-size: 28px; color: var(--cyan); letter-spacing: 0.05em; }
  .metric-label { font-family: 'Rajdhani', sans-serif; font-size: 11px; color: var(--text-dim); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 6px; }
  .metric-sub { font-size: 11px; color: var(--text-dim); margin-top: 4px; letter-spacing: 0.05em; }
  .metric-up { color: #00ff88; font-family: 'Orbitron', monospace; font-size: 10px; }
  .metric-down { color: #ff4466; font-family: 'Orbitron', monospace; font-size: 10px; }
  .chart-panel {
    background: linear-gradient(135deg, rgba(5,20,35,0.9), rgba(7,21,32,0.7));
    border: 1px solid var(--cyan-border);
    padding: 20px;
    position: relative;
  }
  .chart-panel::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent);
  }
  .tab-btn {
    background: transparent; border: 1px solid var(--cyan-border);
    color: var(--text-dim); font-family: 'Orbitron', monospace; font-size: 9px;
    letter-spacing: 0.15em; cursor: pointer; padding: 5px 12px; transition: all 0.2s;
  }
  .tab-btn:hover { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-glow); }
  .tab-btn.active { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-glow); box-shadow: 0 0 12px rgba(0,212,255,0.1); }
  .progress-bar-bg { background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.15); height: 6px; border-radius: 1px; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 1px; transition: width 0.8s ease; }
  .table-row { border-bottom: 1px solid rgba(0,212,255,0.07); padding: 10px 0; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 12px; align-items: center; }
  .table-row:last-child { border-bottom: none; }
  .table-head { font-family: 'Orbitron', monospace; font-size: 9px; color: var(--text-dim); letter-spacing: 0.15em; }
  .activity-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .badge { font-family: 'Orbitron', monospace; font-size: 9px; padding: 2px 8px; letter-spacing: 0.1em; border: 1px solid; }
  .badge-online { border-color: rgba(0,255,136,0.4); color: #00ff88; background: rgba(0,255,136,0.08); }
  .badge-warn { border-color: rgba(255,200,0,0.4); color: #ffcc00; background: rgba(255,200,0,0.08); }
  .badge-err { border-color: rgba(255,68,102,0.4); color: #ff4466; background: rgba(255,68,102,0.08); }
  .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent); margin: 0; }
  .metric-badge { background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.15); font-family: 'Orbitron', monospace; font-size: 9px; color: var(--text-dim); letter-spacing: 0.1em; padding: 3px 8px; }
  .nav-btn { background: transparent; border: 1px solid var(--cyan-border); color: var(--text-dim); font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 0.15em; cursor: pointer; padding: 4px 10px; transition: all 0.2s; }
  .nav-btn:hover { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-glow); }
`;

const DATASETS = {
  "7D": {
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    queries: [920, 1140, 870, 1380, 1200, 760, 471],
    sessions: [140, 178, 130, 210, 188, 112, 74],
    stats: ["1,284", "8,741", "1.84s", "99.97%"],
  },
  "30D": {
    labels: ["W1", "W2", "W3", "W4"],
    queries: [5200, 6800, 7100, 8741],
    sessions: [680, 910, 970, 1284],
    stats: ["4,210", "28,841", "2.01s", "99.94%"],
  },
  "90D": {
    labels: ["JAN", "FEB", "MAR"],
    queries: [18200, 24100, 28841],
    sessions: [2100, 3400, 4210],
    stats: ["12,410", "71,142", "2.24s", "99.91%"],
  },
};

const MODULES = [
  { name: "Neural Core", val: 94, color: "#00d4ff" },
  { name: "Threat Analysis", val: 87, color: "#00ff88" },
  { name: "Power Management", val: 72, color: "#ffcc00" },
  { name: "Communications", val: 98, color: "#00d4ff" },
  { name: "Weapons Array", val: 61, color: "#ff4466" },
];

const ACTIVITY = [
  { msg: "Neural uplink sync complete", color: "#00d4ff", badge: "online", time: "09:41" },
  { msg: "Threat scan: 0 anomalies detected", color: "#00ff88", badge: "online", time: "09:38" },
  { msg: "Power grid fluctuation detected", color: "#ffcc00", badge: "warn", time: "09:22" },
  { msg: "Memory consolidation complete", color: "#00d4ff", badge: "online", time: "09:10" },
  { msg: "Auth attempt — access denied", color: "#ff4466", badge: "err", time: "08:57" },
  { msg: "Weapons array diagnostics ok", color: "#00d4ff", badge: "online", time: "08:41" },
];

const COMMANDS = [
  { cmd: "Run system diagnostics", exec: "2,140", lat: "1.2s", badge: "online" },
  { cmd: "Analyze threat levels", exec: "1,870", lat: "2.1s", badge: "online" },
  { cmd: "Show power grid status", exec: "1,320", lat: "0.9s", badge: "online" },
  { cmd: "Brief me on latest intel", exec: "980", lat: "3.4s", badge: "warn" },
  { cmd: "Neural network update", exec: "741", lat: "5.1s", badge: "warn" },
  { cmd: "Initiate lockdown protocol", exec: "210", lat: "0.4s", badge: "err" },
];

const CATEGORIES = [
  { label: "System Diagnostics", pct: 34, color: "#00d4ff" },
  { label: "Intel Analysis", pct: 28, color: "#00ff88" },
  { label: "Threat Scan", pct: 21, color: "#ffcc00" },
  { label: "Other", pct: 17, color: "#bb66ff" },
];

function Corners() {
  return (
    <>
      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />
    </>
  );
}

export default function JarvisAnalytics() {
  const navigate = useNavigate();
  const [range, setRange] = useState("7D");
  const lineRef = useRef(null);
  const donutRef = useRef(null);
  const lineChartInstance = useRef(null);
  const donutChartInstance = useRef(null);

  const data = DATASETS[range];

  // Load Chart.js dynamically
  useEffect(() => {
    if (window.Chart) {
      initCharts();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = initCharts;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!lineChartInstance.current) return;
    const d = DATASETS[range];
    lineChartInstance.current.data.labels = d.labels;
    lineChartInstance.current.data.datasets[0].data = d.queries;
    lineChartInstance.current.data.datasets[1].data = d.sessions;
    lineChartInstance.current.update();
  }, [range]);

  function initCharts() {
    const Chart = window.Chart;
    if (!lineRef.current || !donutRef.current) return;

    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (donutChartInstance.current) donutChartInstance.current.destroy();

    const d = DATASETS["7D"];

    lineChartInstance.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels: d.labels,
        datasets: [
          {
            label: "Queries",
            data: d.queries,
            borderColor: "#00d4ff",
            backgroundColor: "rgba(0,212,255,0.07)",
            borderWidth: 1.5,
            pointBackgroundColor: "#00d4ff",
            pointRadius: 3,
            pointBorderWidth: 0,
            tension: 0.4,
            fill: true,
          },
          {
            label: "Sessions",
            data: d.sessions,
            borderColor: "rgba(0,255,136,0.7)",
            backgroundColor: "rgba(0,255,136,0.04)",
            borderWidth: 1.5,
            borderDash: [4, 3],
            pointBackgroundColor: "rgba(0,255,136,0.8)",
            pointRadius: 3,
            pointBorderWidth: 0,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(5,20,35,0.95)",
            borderColor: "rgba(0,212,255,0.3)",
            borderWidth: 1,
            titleColor: "#00d4ff",
            bodyColor: "#b0e8f5",
            titleFont: { family: "monospace", size: 10 },
            bodyFont: { family: "monospace", size: 10 },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(0,212,255,0.06)" },
            ticks: { color: "#4a8fa8", font: { family: "monospace", size: 9 }, maxRotation: 0 },
            border: { color: "rgba(0,212,255,0.15)" },
          },
          y: {
            grid: { color: "rgba(0,212,255,0.06)" },
            ticks: { color: "#4a8fa8", font: { family: "monospace", size: 9 } },
            border: { color: "rgba(0,212,255,0.15)" },
          },
        },
      },
    });

    donutChartInstance.current = new Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels: CATEGORIES.map((c) => c.label),
        datasets: [
          {
            data: CATEGORIES.map((c) => c.pct),
            backgroundColor: CATEGORIES.map((c) => c.color + "b3"),
            borderColor: CATEGORIES.map((c) => c.color),
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(5,20,35,0.95)",
            borderColor: "rgba(0,212,255,0.3)",
            borderWidth: 1,
            titleColor: "#00d4ff",
            bodyColor: "#b0e8f5",
            titleFont: { family: "monospace", size: 10 },
            bodyFont: { family: "monospace", size: 9 },
          },
        },
      },
    });
  }

  return (
    <>
      <style>{style}</style>
      <div className="jarvis-bg">
        <div className="grid-bg" />
        <div className="scanlines" />

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="orb-container">
              <div className="orb-ring" />
              <div className="orb-core" />
            </div>
            <span className="logo-text">J.A.R.V.I.S</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="status-dot" />
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.15em" }}>
                ANALYTICS MODULE
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="nav-btn" onClick={() => navigate("/chat")}>◀ BACK</button>
            <div className="metric-badge">SYS: NOMINAL</div>
            <div className="metric-badge" style={{ color: "var(--cyan)", borderColor: "rgba(0,212,255,0.35)" }}>LIVE DATA</div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ position: "relative", zIndex: 2, padding: 24 }}>

          {/* PAGE HEADER */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 4 }}>// TACTICAL OVERVIEW</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, color: "var(--cyan)", letterSpacing: "0.15em", textShadow: "0 0 20px rgba(0,212,255,0.4)" }}>
                ANALYTICS DASHBOARD
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["7D", "30D", "90D"].map((r) => (
                <button key={r} className={`tab-btn${range === r ? " active" : ""}`} onClick={() => setRange(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* METRIC CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Total Sessions", val: data.stats[0], sub: "▲ 12.4%", up: true },
              { label: "Queries Processed", val: data.stats[1], sub: "▲ 23.1%", up: true },
              { label: "Avg Response", val: data.stats[2], sub: "▼ 0.3s improved", up: true },
              { label: "Uptime", val: data.stats[3], sub: "▲ 0.02%", up: true },
            ].map((m) => (
              <div key={m.label} className="metric-card">
                <Corners />
                <div className="metric-label">{m.label}</div>
                <div className="metric-val">{m.val}</div>
                <div className="metric-sub">
                  <span className={m.up ? "metric-up" : "metric-down"}>{m.sub}</span>
                  {" "}vs last period
                </div>
              </div>
            ))}
          </div>

          {/* LINE CHART + DONUT */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 20 }}>
            <div className="chart-panel">
              <Corners />
              <div className="section-label">// QUERY VOLUME — {range} TREND</div>
              <div style={{ position: "relative", height: 200 }}>
                <canvas ref={lineRef} role="img" aria-label="Line chart showing query and session volume trend" />
              </div>
              <div style={{ display: "flex", gap: 18, marginTop: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: "var(--text-dim)" }}>
                  <span style={{ width: 10, height: 2, background: "#00d4ff", display: "inline-block" }} />
                  Queries
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: "var(--text-dim)" }}>
                  <span style={{ width: 10, height: 0, display: "inline-block", borderTop: "2px dashed rgba(0,255,136,0.7)" }} />
                  Sessions
                </span>
              </div>
            </div>

            <div className="chart-panel">
              <Corners />
              <div className="section-label">// QUERY CATEGORIES</div>
              <div style={{ position: "relative", height: 160 }}>
                <canvas ref={donutRef} role="img" aria-label="Doughnut chart of query categories" />
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 5 }}>
                {CATEGORIES.map((c) => (
                  <span key={c.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-dim)", fontFamily: "'Rajdhani', sans-serif" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 1, background: c.color, flexShrink: 0 }} />
                    {c.label} {c.pct}%
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* MODULE PERFORMANCE + ACTIVITY LOG */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>

            <div className="chart-panel">
              <Corners />
              <div className="section-label">// MODULE PERFORMANCE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {MODULES.map((m) => (
                  <div key={m.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, letterSpacing: "0.05em", color: "var(--text)" }}>{m.name}</span>
                      <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: m.color }}>{m.val}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${m.val}%`, background: `linear-gradient(90deg, rgba(0,212,255,0.3), ${m.color})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-panel">
              <Corners />
              <div className="section-label">// ACTIVITY LOG</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {ACTIVITY.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: i < ACTIVITY.length - 1 ? "1px solid rgba(0,212,255,0.07)" : "none" }}>
                    <div className="activity-dot" style={{ background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, lineHeight: 1.4, color: "var(--text)" }}>{a.msg}</div>
                      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "var(--text-dim)", marginTop: 2, letterSpacing: "0.1em" }}>{a.time}</div>
                    </div>
                    <span className={`badge badge-${a.badge}`}>{a.badge.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COMMAND TABLE */}
          <div className="chart-panel" style={{ marginBottom: 20 }}>
            <Corners />
            <div className="section-label">// TOP COMMAND SEQUENCES</div>
            <div className="table-row" style={{ padding: "6px 0" }}>
              <span className="table-head">COMMAND</span>
              <span className="table-head" style={{ textAlign: "center" }}>EXECUTIONS</span>
              <span className="table-head" style={{ textAlign: "center" }}>AVG LATENCY</span>
              <span className="table-head" style={{ textAlign: "center" }}>STATUS</span>
            </div>
            <div className="divider" />
            {COMMANDS.map((c, i) => (
              <div key={i} className="table-row">
                <span style={{ fontSize: 13, letterSpacing: "0.03em", color: "var(--text)" }}>{c.cmd}</span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "var(--cyan)", textAlign: "center" }}>{c.exec}</span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "var(--text-dim)", textAlign: "center" }}>{c.lat}</span>
                <span style={{ textAlign: "center" }}>
                  <span className={`badge badge-${c.badge}`}>{c.badge.toUpperCase()}</span>
                </span>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em" }}>
              LAST SYNC: 09:41:07 UTC · ENC: AES-256 · BUILD: v7.3.1
            </span>
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: "rgba(0,212,255,0.35)", letterSpacing: "0.15em" }}>
              J.A.R.V.I.S ANALYTICS CORE
            </span>
          </div>

        </div>
      </div>
    </>
  );
}