import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Bike, Wrench, Shield, Phone, MapPin, Clock, ParkingSquare, Star, Zap, Wind, Battery, ChevronDown, Award, Users, Gauge, TrendingUp } from "lucide-react";

/* ─── FONTS & GLOBAL STYLES ─── */
const GlobalStyles = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { font-family: 'Heebo', sans-serif !important; background: #050505; overflow-x: hidden; }
      :root {
        --orange: #f97316;
        --orange-dk: #ea580c;
        --orange-lt: #fb923c;
        --glass: rgba(12,12,12,0.78);
        --glass-border: rgba(255,255,255,0.08);
        --glass-orange: rgba(249,115,22,0.18);
      }
      /* Glassmorphism classes */
      .g-card {
        background: var(--glass);
        backdrop-filter: blur(20px) saturate(1.7);
        -webkit-backdrop-filter: blur(20px) saturate(1.7);
        border: 1px solid var(--glass-border);
        border-radius: 22px;
      }
      .g-card-hot {
        background: var(--glass);
        backdrop-filter: blur(20px) saturate(1.7);
        -webkit-backdrop-filter: blur(20px) saturate(1.7);
        border: 1px solid rgba(249,115,22,0.22);
        border-radius: 22px;
      }
      /* Animations */
      @keyframes spin-cw   { to { transform: rotate(360deg);  } }
      @keyframes spin-ccw  { to { transform: rotate(-360deg); } }
      @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
      @keyframes floatYSlow{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes waPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.65)} 55%{box-shadow:0 0 0 18px rgba(37,211,102,0)} }
      @keyframes phonePulse{ 0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,.65)} 55%{box-shadow:0 0 0 18px rgba(249,115,22,0)} }
      @keyframes chainMove { from{stroke-dashoffset:0} to{stroke-dashoffset:-80} }
      @keyframes spokeSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes pedalSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes trailFade { 0%{opacity:.9;transform:scaleX(1)} 100%{opacity:0;transform:scaleX(0)} }
      @keyframes dash { to{stroke-dashoffset:0} }
      @keyframes glowPulse{ 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.8;transform:scale(1.08)} }
      @keyframes road { from{background-position:0 0} to{background-position(200px 0} }
      @keyframes countUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes grain {
        0%,100%{transform:translate(0,0)}
        10%{transform:translate(-2%,-2%)}
        30%{transform:translate(2%,2%)}
        50%{transform:translate(-1%,1%)}
        70%{transform:translate(1%,-1%)}
      }
      .wa-float   { animation: waPulse    2.5s ease-in-out infinite; }
      .ph-pulse   { animation: phonePulse 2.9s ease-in-out infinite; }
      .float-slow { animation: floatYSlow 5s   ease-in-out infinite; }
      .glow-pulse { animation: glowPulse  3s   ease-in-out infinite; }
      /* Noise grain overlay */
      .grain::after {
        content:''; position:absolute; inset:-50%;
        width:200%; height:200%;
        background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        opacity:.032; pointer-events:none; z-index:0;
        animation: grain 0.8s steps(1) infinite;
      }
      /* Orange gradient text */
      .orange-text {
        background: linear-gradient(135deg, #ea580c, #f97316, #fb923c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      /* Custom scrollbar */
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #0a0a0a; }
      ::-webkit-scrollbar-thumb { background: #f97316; border-radius: 4px; }
      /* Hover lift */
      .lift { transition: transform 0.22s ease, box-shadow 0.22s ease; cursor: pointer; }
      .lift:hover { transform: translateY(-4px); }
    `}</style>
  </>
);

/* ─── WHATSAPP ICON ─── */
const WaIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* ─── ANIMATED BIKE SVG ─── */
function AnimatedBike({ size = 320, opacity = 1 }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {/* glow filters */}
      <defs>
        <filter id="glow-orange" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <radialGradient id="wheelGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* === REAR WHEEL === */}
      <g style={{ transformOrigin: "75px 145px" }}>
        {/* tyre */}
        <circle cx="75" cy="145" r="54" stroke="#f97316" strokeWidth="9" fill="none" filter="url(#glow-orange)"/>
        {/* inner rim */}
        <circle cx="75" cy="145" r="44" stroke="rgba(249,115,22,0.3)" strokeWidth="2" fill="none"/>
        {/* hub glow */}
        <circle cx="75" cy="145" r="8" fill="#f97316" filter="url(#glow-strong)"/>
        <circle cx="75" cy="145" r="5" fill="#fff"/>
        {/* spokes */}
        {[0,45,90,135].map(a => (
          <line key={a}
            x1={75} y1={145}
            x2={75 + 42*Math.cos(a*Math.PI/180)}
            y2={145 + 42*Math.sin(a*Math.PI/180)}
            stroke="rgba(249,115,22,0.55)" strokeWidth="1.5"
            style={{ transformOrigin:"75px 145px", animation:`spin-cw 1.6s linear infinite` }}
          />
        ))}
      </g>

      {/* === FRONT WHEEL === */}
      <g style={{ transformOrigin: "245px 145px" }}>
        <circle cx="245" cy="145" r="54" stroke="#f97316" strokeWidth="9" fill="none" filter="url(#glow-orange)"/>
        <circle cx="245" cy="145" r="44" stroke="rgba(249,115,22,0.3)" strokeWidth="2" fill="none"/>
        <circle cx="245" cy="145" r="8" fill="#f97316" filter="url(#glow-strong)"/>
        <circle cx="245" cy="145" r="5" fill="#fff"/>
        {[0,45,90,135].map(a => (
          <line key={a}
            x1={245} y1={145}
            x2={245 + 42*Math.cos(a*Math.PI/180)}
            y2={145 + 42*Math.sin(a*Math.PI/180)}
            stroke="rgba(249,115,22,0.55)" strokeWidth="1.5"
            style={{ transformOrigin:"245px 145px", animation:`spin-cw 1.6s linear infinite` }}
          />
        ))}
      </g>

      {/* === FRAME === */}
      {/* Chain stay */}
      <line x1="75" y1="145" x2="160" y2="95" stroke="#f97316" strokeWidth="5" strokeLinecap="round" filter="url(#glow-orange)"/>
      {/* Seat stay */}
      <line x1="75" y1="145" x2="145" y2="60" stroke="#f97316" strokeWidth="4" strokeLinecap="round" filter="url(#glow-orange)"/>
      {/* Top tube */}
      <line x1="145" y1="60" x2="215" y2="62" stroke="#f97316" strokeWidth="5" strokeLinecap="round" filter="url(#glow-orange)"/>
      {/* Down tube */}
      <line x1="215" y1="62" x2="160" y2="95" stroke="#f97316" strokeWidth="5" strokeLinecap="round" filter="url(#glow-orange)"/>
      {/* Seat tube */}
      <line x1="145" y1="60" x2="160" y2="95" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" filter="url(#glow-orange)"/>
      {/* Fork */}
      <line x1="215" y1="62" x2="245" y2="145" stroke="#f97316" strokeWidth="4" strokeLinecap="round" filter="url(#glow-orange)"/>

      {/* === CRANKSET === */}
      <circle cx="160" cy="95" r="14" stroke="#f97316" strokeWidth="3" fill="rgba(249,115,22,0.1)"/>
      <circle cx="160" cy="95" r="6" fill="#f97316"/>
      {/* chain ring teeth hint */}
      <circle cx="160" cy="95" r="18" stroke="rgba(249,115,22,0.3)" strokeWidth="1" strokeDasharray="3 5" fill="none"/>
      {/* crank arms */}
      <g style={{ transformOrigin:"160px 95px", animation:"spin-cw 1.6s linear infinite" }}>
        <line x1="160" y1="95" x2="160" y2="115" stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
        <line x1="160" y1="95" x2="160" y2="75"  stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
        {/* pedals */}
        <rect x="153" y="113" width="14" height="5" rx="2" fill="#fb923c"/>
        <rect x="153" y="73"  width="14" height="5" rx="2" fill="#fb923c"/>
      </g>

      {/* === HANDLEBARS & SEAT === */}
      {/* handlebar post */}
      <line x1="215" y1="62" x2="218" y2="42" stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
      <line x1="210" y1="38" x2="228" y2="38" stroke="#f97316" strokeWidth="5" strokeLinecap="round"/>
      {/* seat post */}
      <line x1="145" y1="60" x2="140" y2="38" stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
      <rect x="126" y="32" width="28" height="8" rx="4" fill="#f97316"/>

      {/* === SPEED TRAIL LINES === */}
      {[0,12,24,38,54].map((yOff,i) => (
        <line key={i}
          x1={-5} y1={148 - yOff}
          x2={40 - i*2} y2={148 - yOff}
          stroke="rgba(249,115,22," + (0.5 - i*0.08) + ")"
          strokeWidth={3 - i*0.4}
          strokeLinecap="round"
          style={{ animation:`trailFade ${0.9 + i*0.1}s ease-in-out infinite alternate`, animationDelay:`${i*0.08}s` }}
        />
      ))}

      {/* electric bolt */}
      <text x="185" y="78" fontSize="22" fill="#f97316" filter="url(#glow-strong)" style={{ animation:"glowPulse 1.8s ease-in-out infinite" }}>⚡</text>
    </svg>
  );
}

/* ─── WHEEL DECORATION (pure CSS rings) ─── */
function WheelDeco({ x = "left", size = 420 }) {
  const rings = [1, 0.72, 0.44, 0.22];
  return (
    <div style={{
      position: "absolute", [x]: "-6%", top: "50%", transform: "translateY(-50%)",
      width: size, height: size, pointerEvents: "none", zIndex: 0, opacity: 0.07,
    }}>
      {rings.map((r, i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: size * r, height: size * r,
          borderRadius: "50%",
          border: `${i === 0 ? 3 : 1.5}px solid #f97316`,
          transform: "translate(-50%,-50%)",
          animation: `${i % 2 === 0 ? "spin-cw" : "spin-ccw"} ${14 + i * 6}s linear infinite`,
        }} />
      ))}
      {/* spokes */}
      {[0,30,60,90,120,150].map(a => (
        <div key={a} style={{
          position: "absolute", top: "50%", left: "50%",
          width: size * 0.48, height: 1,
          background: "rgba(249,115,22,0.5)",
          transformOrigin: "0 50%",
          transform: `rotate(${a}deg)`,
        }} />
      ))}
    </div>
  );
}

/* ─── SCROLL PROGRESS ─── */
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 9999,
      background: "linear-gradient(90deg,#ea580c,#f97316,#fb923c)",
      transformOrigin: "left", scaleX: scrollYProgress,
    }} />
  );
}

/* ─── COUNTER ─── */
function useCountUp(target, duration = 1800, active = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let s = null;
    const step = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return n;
}

/* ─── GOOGLE STARS BADGE ─── */
function GoogleBadge() {
  const rating = 4.7;
  const fullStars = Math.floor(rating);
  const partial = rating - fullStars;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.55, type: "spring", stiffness: 220 }}
      className="g-card"
      style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        padding: "10px 20px", marginBottom: 22,
      }}
    >
      {/* Google G */}
      <svg width={20} height={20} viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {/* Stars */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {[1,2,3,4,5].map(i => {
          const filled = i <= fullStars;
          const partialStar = i === fullStars + 1 && partial > 0;
          return (
            <div key={i} style={{ position: "relative", width: 15, height: 15 }}>
              <svg width={15} height={15} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={filled ? "#FBBC05" : "rgba(255,255,255,0.12)"} />
              </svg>
              {partialStar && (
                <div style={{ position: "absolute", inset: 0, overflow: "hidden", width: `${partial * 100}%` }}>
                  <svg width={15} height={15} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FBBC05"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span style={{ fontWeight: 900, fontSize: 15, color: "#fff" }}>{rating}</span>
      <span style={{ color: "rgba(255,255,255,0.42)", fontSize: 12 }}>מתוך מאות ביקורות</span>
    </motion.div>
  );
}

/* ─── GLASS SERVICE CARD ─── */
function ServiceCard({ icon: Icon, title, desc, items, index, accent = "#f97316" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      ref={ref}
      className="g-card-hot lift"
      initial={{ opacity: 0, y: 52 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "30px 26px", position: "relative", overflow: "hidden",
        boxShadow: hovered ? "0 20px 50px rgba(249,115,22,0.18)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* animated corner glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute", top: -60, right: -60,
          width: 180, height: 180,
          background: "radial-gradient(circle, rgba(249,115,22,0.16) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }}
      />
      {/* icon */}
      <div style={{
        width: 56, height: 56,
        background: "linear-gradient(135deg, #ea580c, #f97316)",
        borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, boxShadow: "0 6px 24px rgba(249,115,22,0.45)",
      }}>
        <Icon color="#fff" size={26} />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#fff" }}>{title}</h3>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>{desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #ea580c, #f97316)",
              boxShadow: "0 0 8px rgba(249,115,22,0.7)",
            }} />
            <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 13.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── STAT CARD ─── */
function StatCard({ value, suffix, label, icon: Icon, active, delay = 0 }) {
  const n = useCountUp(value, 1800, active);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className="g-card"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      style={{ padding: "28px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)",
      }} />
      {Icon && <Icon color="rgba(249,115,22,0.5)" size={22} style={{ marginBottom: 8 }} />}
      <div className="orange-text" style={{ fontSize: 46, fontWeight: 900, lineHeight: 1 }}>{n}{suffix}</div>
      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 8 }}>{label}</div>
    </motion.div>
  );
}

/* ─── WA MESSAGES ─── */
const WA_MSGS = [
  { id: 1, text: "גיא תודה על השירות, האופניים כמו חדשים! ממליץ לכולם בחום 🙏", author: "דני ל.", time: "10:42", out: false },
  { id: 2, text: "ברוכים הבאים! שמח שיצאת מרוצה 😊 בכל שאלה אני כאן", author: "גיא", time: "10:44", out: true },
  { id: 3, text: "אין עליך גיא, המחיר הכי הוגן באזור. כולם בעבודה שואלים אותי איפה קניתי 🔥", author: "מיכל ר.", time: "14:17", out: false },
  { id: 4, text: "הגעתי מחיפה אחרי שחבר המליץ. שווה כל קילומטר. שירות של פעם!", author: "יוסי א.", time: "19:03", out: false },
  { id: 5, text: "מצוין! השירות אחרי המכירה הפתיע אותי. גיא לא עוזב אותך לבד 🚲", author: "רוני ח.", time: "09:15", out: false },
];

function WaBubble({ msg, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div ref={ref} style={{ display: "flex", justifyContent: msg.out ? "flex-end" : "flex-start" }}
      initial={{ opacity: 0, x: msg.out ? 20 : -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.42, delay: index * 0.09, ease: "easeOut" }}>
      <div style={{
        maxWidth: "76%",
        backgroundColor: msg.out ? "#dcf8c6" : "#fff",
        color: "#111",
        borderRadius: msg.out ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: "10px 14px 8px",
        boxShadow: "0 1px 5px rgba(0,0,0,0.18)",
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: msg.out ? "#075e54" : "#25D366", marginBottom: 2 }}>
          {msg.out ? "גיא — אופניים בגלבוע" : msg.author}
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.5, direction: "rtl" }}>{msg.text}</p>
        <p style={{ fontSize: 10, color: "#888", textAlign: "left", marginTop: 3 }}>
          {msg.time}{msg.out && <span style={{ color: "#34B7F1", marginRight: 3 }}> ✓✓</span>}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── CYCLING FACT CARD ─── */
function BikeFactCard({ icon, title, value, unit, color = "#f97316", index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} className="g-card-hot lift"
      initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 180 }}
      style={{ padding: "22px 18px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color, marginBottom: 4 }}>{value}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginRight: 3 }}>{unit}</span></div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{title}</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════
   MAIN APP
═══════════════════════════════════ */
export default function App() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);

  const PHONE = "0508633885";
  const WA_LINK = `https://wa.me/972508633885?text=${encodeURIComponent("שלום גיא! ראיתי את האתר ואשמח לשמוע עוד 😊")}`;

  const SERVICES = [
    {
      icon: Bike, title: "מכירת אופניים וקורקינטים",
      desc: "מבחר עשיר לכל הגילאים. ייעוץ אישי בלי לחץ, בלי עמלות — רק המוצר הנכון בשבילך.",
      items: ["אופניים חשמליים לכל שטח", "קורקינטים חשמליים ורגילים", "אופני הרים ועיר איכותיים", "ייעוץ אישי חינם לכל קונה"],
    },
    {
      icon: Wrench, title: "מעבדת תיקונים מקצועית",
      desc: "8 שנות ניסיון בתיקון. מגיעים עם תקלה — יוצאים עם אופניים כמו חדשים.",
      items: ["תיקון סוללות ובקרים חשמליים", "פנצ'רים ותיקוני צמיגים מהיר", "כוונון בלמים, הילוכים ושרשראות", "בדיקות תקופתיות ושירות מניעתי"],
    },
    {
      icon: Shield, title: "אביזרים וציוד מיגון",
      desc: "כי הנסיעה הבטוחה מתחילה בציוד הנכון. מותגים מובילים במחירים הוגנים.",
      items: ["קסדות לכל הגילאים ולכל שטח", "מנעולים ומערכות אנטי-גניבה מתקדמות", "אורות, רפלקטורים ותאורת לילה", "ביגוד ואביזרי רכיבה מקצועיים"],
    },
  ];

  return (
    <div dir="rtl" style={{ fontFamily: "'Heebo', sans-serif", background: "#050505", color: "#fff", overflowX: "hidden" }}>
      <GlobalStyles />
      <ProgressBar />

      {/* ── FLOATING WA BUTTON (pulse) ── */}
      <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-float"
        style={{
          position: "fixed", bottom: 26, left: 26, zIndex: 9000,
          display: "flex", alignItems: "center", gap: 10,
          background: "linear-gradient(135deg,#1ebe5a,#25D366)", color: "#fff",
          padding: "13px 22px", borderRadius: 50,
          fontWeight: 800, fontSize: 14, textDecoration: "none",
        }}>
        <WaIcon size={22} /> וואטסאפ לגיא
      </a>

      {/* ══════════════════════
          NAV
      ══════════════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: "rgba(5,5,5,0.88)",
        backdropFilter: "blur(26px) saturate(1.8)",
        WebkitBackdropFilter: "blur(26px) saturate(1.8)",
        borderBottom: "1px solid rgba(249,115,22,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 66,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{
            width: 40, height: 40,
            background: "linear-gradient(135deg,#ea580c,#f97316)",
            borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(249,115,22,0.4)",
          }}>
            <Bike color="#fff" size={21} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, lineHeight: 1.1 }}>אופניים בגלבוע</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>קניון אורות · אור עקיבא</div>
          </div>
        </div>
        <a href={`tel:${PHONE}`} className="ph-pulse"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg,#ea580c,#f97316)",
            color: "#fff", padding: "9px 22px", borderRadius: 50,
            fontWeight: 800, fontSize: 14, textDecoration: "none",
          }}>
          <Phone size={15} /> חייגו לגיא
        </a>
      </nav>

      {/* ══════════════════════
          HERO
      ══════════════════════ */}
      <section className="grain" style={{
        position: "relative", minHeight: "100svh",
        display: "flex", alignItems: "center",
        padding: "80px 5% 80px", overflow: "hidden",
      }}>
        {/* layered bg gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 75% 70% at 88% 12%, rgba(234,88,12,0.28) 0%, transparent 52%),
            radial-gradient(ellipse 55% 55% at 8%  88%, rgba(249,115,22,0.12) 0%, transparent 52%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(234,88,12,0.05) 0%, transparent 70%),
            #050505
          `,
        }} />
        {/* grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(249,115,22,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.04) 1px,transparent 1px)",
          backgroundSize: "70px 70px",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%,black 20%,transparent 100%)",
        }} />

        {/* decorative wheel deco RTL */}
        <WheelDeco x="left" size={440} />

        {/* BIG deco text */}
        <div style={{
          position: "absolute", left: -10, bottom: -60,
          fontSize: "clamp(110px,17vw,230px)", fontWeight: 900,
          color: "transparent", WebkitTextStroke: "1px rgba(249,115,22,0.045)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none", letterSpacing: -8,
          animation: "floatY 9s ease-in-out infinite",
        }}>RIDE</div>

        {/* animated bike — desktop only */}
        <motion.div
          style={{ y: heroY, position: "absolute", left: "2%", bottom: "8%", pointerEvents: "none" }}
          className="float-slow"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 0.85, x: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: "easeOut" }}
        >
          <AnimatedBike size={340} />
        </motion.div>

        {/* CONTENT */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 680, marginRight: "auto" }}>
          <GoogleBadge />

          {/* badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.5 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(249,115,22,0.09)", border: "1px solid rgba(249,115,22,0.26)",
              borderRadius: 50, padding: "6px 16px", fontSize: 13, color: "#f97316", fontWeight: 700, marginBottom: 18,
            }}>
            <Zap size={13} /> המחיר הכי הוגן באזור — בהתחייבות!
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(30px,5vw,62px)", fontWeight: 900, lineHeight: 1.14, marginBottom: 18 }}>
            אופניים בגלבוע:{" "}
            <span className="orange-text">הביטחון שלך</span><br />
            בדרכים מתחיל כאן
          </motion.h1>

          {/* sub */}
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65 }}
            style={{ fontSize: "clamp(15px,1.8vw,19px)", color: "rgba(255,255,255,0.58)", lineHeight: 1.78, marginBottom: 36, maxWidth: 520 }}>
            מכירת אופניים חשמליים, קורקינטים ומעבדת תיקונים מקצועית בלב אור עקיבא.
            <br />גיא — <strong style={{ color: "rgba(255,255,255,0.85)" }}>8 שנות ניסיון</strong>, שירות אישי, אחריות אמיתית.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.55 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href={`tel:${PHONE}`} className="ph-pulse"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "linear-gradient(135deg,#ea580c,#f97316)",
                color: "#fff", padding: "15px 30px", borderRadius: 50,
                fontWeight: 900, fontSize: 17, textDecoration: "none",
              }}>
              <Phone size={18} /> חייגו לגיא עכשיו
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.13)",
                color: "#fff", padding: "15px 28px", borderRadius: 50,
                fontWeight: 700, fontSize: 16, textDecoration: "none",
              }}>
              <WaIcon size={18} /> שלחו הודעה
            </a>
          </motion.div>

          {/* micro trust */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.6 }}
            style={{ display: "flex", gap: 22, marginTop: 32, flexWrap: "wrap" }}>
            {[["🔧","תיקון מהיר במקום"],["🅿️","חניה חינם"],["✅","אחריות מלאה"],["⚡","חשמליים מומחה"]].map(([e,t]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                {e} {t}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════
          TRUST BAR
      ══════════════════════ */}
      <div style={{
        background: "linear-gradient(90deg,#b45309,#ea580c,#f97316,#ea580c,#b45309)",
        padding: "14px 32px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[[ParkingSquare,"חניה חינם בקניון"],[Wrench,"תיקון במקום תוך שעות"],[Shield,"אחריות מלאה"],[Award,"8 שנות ניסיון"],[Star,"המחיר הכי הוגן"]].map(([Icon,text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 700, fontSize: 14 }}>
              <Icon size={15}/> {text}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════
          BIKE FACTS STRIP (new visual section)
      ══════════════════════ */}
      <section style={{ padding: "72px 5%", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(249,115,22,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.03) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div style={{ textAlign: "center", marginBottom: 48 }}
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}>
            <div style={{ color: "#f97316", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
              למה לרכוב?
            </div>
            <h2 style={{ fontSize: "clamp(24px,3.8vw,40px)", fontWeight: 900 }}>
              אופניים חשמליים — <span className="orange-text">החיים שינו</span>
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}>
            {[
              { icon: "⚡", title: "מהירות מקסימלית", value: "45", unit: "קמ\"ש" },
              { icon: "🔋", title: "טווח סוללה", value: "120", unit: "ק\"מ" },
              { icon: "💸", title: "חיסכון בדלק", value: "80", unit: "%" },
              { icon: "🌿", title: "CO₂ שנחסך", value: "0", unit: "פליטות" },
              { icon: "🚴", title: "קלוריות בשעה", value: "400", unit: "קק\"ל" },
              { icon: "⏱️", title: "זמן חניה בחיסכון", value: "15", unit: "דק׳ ביום" },
            ].map((f,i) => <BikeFactCard key={f.title} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════
          SERVICES (Glassmorphism + Stagger)
      ══════════════════════ */}
      <section style={{ padding: "88px 5%", maxWidth: 1140, margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: 56 }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }}>
          <div style={{ color: "#f97316", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>מה אנחנו מציעים</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, lineHeight: 1.2 }}>כל מה שצריך — במקום אחד</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 12, fontSize: 16, maxWidth: 480, margin: "12px auto 0" }}>
            ניסיון של 8 שנים, לב ישראלי, ומחיר שלא ימצא בשום מקום אחר
          </p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 22 }}>
          {SERVICES.map((s,i) => <ServiceCard key={s.title} {...s} index={i} />)}
        </div>
      </section>

      {/* ══════════════════════
          ANIMATED BIKE SHOWCASE
      ══════════════════════ */}
      <section style={{ padding: "60px 5%", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(249,115,22,0.07) 0%, transparent 70%)",
        }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div style={{ textAlign: "center", marginBottom: 32 }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
            <div style={{ color: "#f97316", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
              המוצר שלנו
            </div>
            <h2 style={{ fontSize: "clamp(22px,3.5vw,38px)", fontWeight: 900 }}>
              אופניים חשמליים <span className="orange-text">מהשורה הראשונה</span>
            </h2>
          </motion.div>
          <motion.div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <AnimatedBike size={480} opacity={1} />
          </motion.div>
          {/* specs strip */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
            {[["⚡","חשמלי ונקי"],["🔋","טעינה מהירה"],["🛡️","אחריות מלאה"],["🔧","תמיכה מקצועית"]].map(([icon,txt]) => (
              <div key={txt} className="g-card" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                {icon} {txt}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════
          STATS
      ══════════════════════ */}
      <div ref={statsRef} style={{
        background: "rgba(249,115,22,0.03)",
        borderTop: "1px solid rgba(249,115,22,0.1)",
        borderBottom: "1px solid rgba(249,115,22,0.1)",
        padding: "72px 5%",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 18 }}>
          <StatCard value={500} suffix="+" label="לקוחות מרוצים" icon={Users}    active={statsInView} delay={0} />
          <StatCard value={8}   suffix=""  label="שנות ניסיון"    icon={Award}    active={statsInView} delay={0.1} />
          <StatCard value={100} suffix="%" label="אחריות מלאה"    icon={Shield}   active={statsInView} delay={0.2} />
          <StatCard value={47}  suffix=""  label="דירוג גוגל (×10)" icon={Star}  active={statsInView} delay={0.3} />
        </div>
      </div>

      {/* ══════════════════════
          WHATSAPP PROOF
      ══════════════════════ */}
      <section style={{ padding: "88px 5%", maxWidth: 860, margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: 52 }}
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}>
          <div style={{ color: "#f97316", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>מה אומרים עלינו</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900 }}>לקוחות שמדברים — לא שיווק</h2>
          <p style={{ color: "rgba(255,255,255,0.38)", marginTop: 10, fontSize: 15 }}>הודעות אמיתיות מלקוחות אמיתיים</p>
        </motion.div>
        <motion.div
          style={{ background: "#e5ddd5", borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", maxWidth: 520, margin: "0 auto" }}
          initial={{ opacity: 0, scale: 0.93, y: 28 }} whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          {/* WA header */}
          <div style={{ background: "#075e54", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#ea580c,#f97316)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 18 }}>ג</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>גיא — אופניים בגלבוע</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>מחובר ✓</div>
            </div>
          </div>
          <div style={{ background: "#ece5dd", padding: "18px 14px", display: "flex", flexDirection: "column", gap: 12, minHeight: 300 }}>
            {WA_MSGS.map((m,i) => <WaBubble key={m.id} msg={m} index={i} />)}
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════
          LOCATION & HOURS
      ══════════════════════ */}
      <section style={{ padding: "88px 5%", borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.012)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <motion.div style={{ textAlign: "center", marginBottom: 56 }}
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}>
            <div style={{ color: "#f97316", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>איפה אנחנו?</div>
            <h2 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 900 }}>
              קל להגיע. קל לחנות. <span className="orange-text">תמיד ברוכים הבאים.</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 22 }}>
            {/* Location */}
            <motion.div className="g-card" style={{ padding: 30 }}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0 }}>
              <h3 style={{ color: "#f97316", fontWeight: 800, fontSize: 17, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={18} /> כתובת ומיקום
              </h3>
              <p style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>קניון אורות — קומת קרקע</p>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 14, marginBottom: 22 }}>שד' הנשיא וייצמן 1, אור עקיבא</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="https://waze.com/ul?q=קניון+אורות+אור+עקיבא" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#0057e7", color: "#fff", padding: "10px 18px", borderRadius: 50, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                  🗺️ נווט בוויז
                </a>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.28)", color: "#f97316", padding: "10px 18px", borderRadius: 50, fontSize: 13, fontWeight: 700 }}>
                  🅿️ חניה חינם
                </div>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div className="g-card" style={{ padding: 30 }}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h3 style={{ color: "#f97316", fontWeight: 800, fontSize: 17, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={18} /> שעות פתיחה
              </h3>
              {[["ראשון – חמישי","10:00 – 19:00",true],["שישי","09:00 – 14:00",true],["שבת","סגור",false]].map(([d,t,o]) => (
                <div key={d} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.045)", paddingBottom: 10, marginBottom: 10 }}>
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>{d}</span>
                  <span style={{ fontWeight: 700, color: o ? "#f97316" : "rgba(255,255,255,0.2)", fontSize: 14 }}>{t}</span>
                </div>
              ))}
            </motion.div>

            {/* Contact */}
            <motion.div className="g-card-hot" style={{ padding: 30 }}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h3 style={{ color: "#f97316", fontWeight: 800, fontSize: 17, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={18} /> דברו ישירות עם גיא
              </h3>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
                גיא זמין לשאלות, ייעוץ והזמנות.<br />אין עניין קטן מדי — שאלו הכל.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href={`tel:${PHONE}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: "linear-gradient(135deg,#ea580c,#f97316)",
                  color: "#fff", padding: "13px", borderRadius: 13,
                  fontWeight: 800, fontSize: 16, textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
                }}>
                  <Phone size={18} /> 050-863-3885
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: "#25D366", color: "#fff", padding: "13px", borderRadius: 13,
                  fontWeight: 800, fontSize: 15, textDecoration: "none",
                }}>
                  <WaIcon size={18} /> וואטסאפ
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════
          FINAL CTA
      ══════════════════════ */}
      <section style={{ position: "relative", padding: "110px 5%", textAlign: "center", overflow: "hidden", background: "#050505" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(234,88,12,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* bg wheel deco */}
        <WheelDeco x="right" size={380} />
        <motion.div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}
          initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65 }}>
          <h2 style={{ fontSize: "clamp(28px,5vw,54px)", fontWeight: 900, lineHeight: 1.18, marginBottom: 16 }}>
            מוכנים להרגיש שמישהו<br />
            <span className="orange-text">באמת דואג לכם?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 17, lineHeight: 1.78, marginBottom: 42 }}>
            בואו לבדוק, לרכב ולהתחדש 🚲<br />
            ייעוץ חינם — בלי לחץ ובלי מחויבות.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-float"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "linear-gradient(135deg,#1ebe5a,#25D366)", color: "#fff",
                padding: "16px 30px", borderRadius: 50,
                fontWeight: 900, fontSize: 17, textDecoration: "none",
              }}>
              <WaIcon size={20} /> שלחו הודעה עכשיו
            </a>
            <a href={`tel:${PHONE}`} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(249,115,22,0.07)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(249,115,22,0.32)",
              color: "#f97316", padding: "16px 30px", borderRadius: 50,
              fontWeight: 800, fontSize: 16, textDecoration: "none",
            }}>
              <Phone size={18} /> 050-863-3885
            </a>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#030303", borderTop: "1px solid rgba(249,115,22,0.08)",
        padding: "22px 5%", textAlign: "center",
        color: "rgba(255,255,255,0.22)", fontSize: 13,
      }}>
        © 2025 אופניים בגלבוע | קניון אורות, אור עקיבא |{" "}
        <a href={`tel:${PHONE}`} style={{ color: "#f97316", textDecoration: "none" }}>050-863-3885</a>
        {" "}| כל הזכויות שמורות
      </footer>
    </div>
  );
}
