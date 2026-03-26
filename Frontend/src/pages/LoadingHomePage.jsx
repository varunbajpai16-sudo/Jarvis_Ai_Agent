import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
const STATUS_MESSAGES = [
  "INITIALIZING CORE SYSTEMS",
  "CALIBRATING",
  "LOADING NEURAL MATRIX",
  "SYNCING PROTOCOLS",
  "ESTABLISHING UPLINK",
  "SYSTEM READY",
];

export default function LoadingHomePage() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const [statusIndex, setStatusIndex] = useState(1);
  const [dots, setDots] = useState([true, true, false, false, false, false]);
  const [orbAngle, setOrbAngle] = useState(0);

  const animRef = useRef(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const duration = 8000;

    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      const raw = Math.min(elapsed / duration, 1);
      const eased = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw;
      const pct = Math.floor(eased * 100);

      if (pct >= 100) {
        setTimeout(() => {
          navigate("/chat"); 
        }, 400); 
      }

      setProgress(pct);
      setOrbAngle((prev) => (prev + 1.8) % 360);

      const msgIdx = Math.floor((pct / 100) * (STATUS_MESSAGES.length - 1));
      setStatusIndex(msgIdx);

      const activeDots = Math.max(2, Math.floor((pct / 100) * 6));
      setDots(Array.from({ length: 6 }, (_, i) => i < activeDots));

      if (raw < 1) {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const orbX = 50 + 42 * Math.cos((orbAngle * Math.PI) / 180);
  const orbY = 50 + 42 * Math.sin((orbAngle * Math.PI) / 180);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] relative overflow-hidden font-[Rajdhani]">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,200,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,200,255,0.06)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="flex flex-col items-center gap-7 z-10 w-[420px]">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-[52px] font-black tracking-[0.18em] text-cyan-400 leading-none font-[Orbitron] drop-shadow-[0_0_12px_#00e5ff]">
            J.A.R.V.I.S
          </h1>
          <p className="text-[11px] tracking-[0.35em] text-cyan-400/50 mt-2 font-medium">
            JUST A RATHER VERY INTELLIGENT SYSTEM
          </p>
        </div>

        {/* Orb */}
        <div className="relative w-[120px] h-[120px]">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              className="stroke-cyan-400/10"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              className="stroke-cyan-400/20"
              strokeWidth="1.5"
            />

            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="2"
              strokeDasharray={`${progress * 2.64} 264`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />

            <circle
              cx="50"
              cy="50"
              r="30"
              fill="none"
              className="stroke-cyan-400/10"
              strokeWidth="1"
            />

            <circle
              cx="50"
              cy="50"
              r="3"
              fill="#00e5ff"
              className="opacity-80"
            />

            <circle
              cx={orbX}
              cy={orbY}
              r="3.5"
              fill="#00e5ff"
              className="drop-shadow-[0_0_6px_#00e5ff]"
            />

            {[20, 40].map((lag, i) => {
              const trailAngle = orbAngle - lag;
              const tx = 50 + 42 * Math.cos((trailAngle * Math.PI) / 180);
              const ty = 50 + 42 * Math.sin((trailAngle * Math.PI) / 180);

              return (
                <circle
                  key={i}
                  cx={tx}
                  cy={ty}
                  r={2 - i * 0.5}
                  fill="#00e5ff"
                  opacity={0.3 - i * 0.1}
                />
              );
            })}

            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0066ff" />
                <stop offset="100%" stopColor="#00e5ff" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Status */}
        <div className="text-center min-h-[22px]">
          <span className="text-[13px] tracking-[0.3em] text-white/70 font-bold animate-pulse">
            {STATUS_MESSAGES[statusIndex]}
          </span>
        </div>

        {/* Progress */}
        <div className="w-full">
          <div className="w-full h-[4px] bg-cyan-400/10 rounded overflow-hidden relative">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_12px_rgba(0,200,255,0.7)] relative transition-all duration-75"
            >
              <div className="absolute right-0 top-0 w-[30px] h-full bg-gradient-to-r from-transparent to-white/40" />
            </div>
          </div>

          <div className="text-center mt-2 text-[12px] tracking-[0.15em] text-cyan-400/60 font-semibold">
            {progress}%
          </div>
        </div>

        {/* Dots */}
        <div className="flex gap-2 items-center">
          {dots.map((active, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                active
                  ? "w-[10px] h-[10px] bg-cyan-400 shadow-[0_0_8px_#00e5ff]"
                  : "w-[7px] h-[7px] bg-cyan-400/20 border border-cyan-400/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
