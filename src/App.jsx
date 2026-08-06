import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Code2, Bot, Video, Zap, Menu, ArrowRight, X, Search, ChevronDown, ChevronUp, ExternalLink, Award, BookOpen, Wrench, GraduationCap, Copy, Check, Cpu, Mic, MicOff, Send, Trash2, Volume2, VolumeX, Sparkles } from "lucide-react";
import { FaDatabase, FaGithub, FaMicroscope, FaRobot, FaCheckCircle, FaSpotify, FaDiscord, FaInstagram, FaTiktok, FaBook, FaGraduationCap, FaTrophy, FaScroll, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

// ─── Asset URLs ───────────────────────────────────────────────────────────────
const BG_IMAGE_1 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";
const PROFILE_PHOTO = "/Zae.jpg";

const SPOTLIGHT_R = 260;

// ─── Global CSS ───────────────────────────────────────────────────────────────
// ─── Liquid Glass SVG distortion filter ───────────────────────────────────────
// Adds a real liquid-glass refraction look on top of the blur/saturate glass.
// Chrome/Edge render the distortion; browsers without url() backdrop-filter
// support automatically fall back to the plain blurred glass (see @supports
// rule in GLOBAL_CSS), so nothing breaks anywhere.
function LiquidGlassFilter() {
  return (
    <svg width="0" height="0" style={{ position:"absolute" }} aria-hidden="true">
      <defs>
        <filter id="liquid-glass-distortion" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="1" seed="7" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="18" xChannelSelector="R" yChannelSelector="B" />
        </filter>
      </defs>
    </svg>
  );
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; background: #000; color: #fff; overflow-x: hidden; }
  .font-playfair { font-family: 'Playfair Display', serif; font-style: italic; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }

  @keyframes heroReveal {
    0%  { opacity:0; transform:translateY(28px); filter:blur(12px); }
    100%{ opacity:1; transform:translateY(0); filter:blur(0); }
  }
  @keyframes heroFadeUp {
    0%  { opacity:0; transform:translateY(20px); }
    100%{ opacity:1; transform:translateY(0); }
  }
  @keyframes heroZoom {
    0%  { transform:scale(1.12); }
    100%{ transform:scale(1); }
  }
  @keyframes floatY {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-14px); }
  }

  .hero-anim { opacity:0; animation-fill-mode:forwards; animation-timing-function:cubic-bezier(0.16,1,0.3,1); }
  .hero-reveal { animation-name:heroReveal; animation-duration:1.1s; }
  .hero-fade   { animation-name:heroFadeUp; animation-duration:1s; }
  .hero-zoom   { animation:heroZoom 1.8s cubic-bezier(0.16,1,0.3,1) forwards; }
  .float-anim  { animation: floatY 8s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .hero-anim, .hero-zoom, .float-anim { animation:none; opacity:1; }
  }

  .search-input-styled {
    width:100%; padding:14px 20px 14px 48px;
    border-radius:9999px; border:1px solid rgba(255,255,255,0.12);
    background:rgba(255,255,255,0.04); color:#fff; font-size:14px;
    outline:none; font-family:'Inter',sans-serif;
    transition: all 0.3s;
  }
  .search-input-styled::placeholder { color: rgba(255,255,255,0.30); }
  .search-input-styled:focus { border-color:rgba(232,112,42,0.5); background:rgba(255,255,255,0.06); }

  .tool-link-card { text-decoration:none; }
  .tool-link-card:hover .tool-card-inner {
    border-color: rgba(232,112,42,0.40) !important;
    background: rgba(255,255,255,0.12) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.20) !important;
    transform: translateY(-4px) !important;
  }

  .glass-panel { position: relative; isolation: isolate; }
  .glass-panel::before {
    content: "";
    position: absolute; inset: 0; border-radius: inherit;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 120px 120px;
    opacity: 0.05;
    mix-blend-mode: overlay;
    pointer-events: none;
    z-index: 0;
  }
  .glass-panel::after {
    content: "";
    position: absolute; inset: 0; border-radius: inherit;
    background: linear-gradient(155deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 22%, rgba(255,255,255,0) 45%);
    pointer-events: none;
    z-index: 0;
  }
  .glass-panel > * { position: relative; z-index: 1; }

  @supports (backdrop-filter: url(#liquid-glass-distortion)) or (-webkit-backdrop-filter: url(#liquid-glass-distortion)) {
    .glass-panel {
      backdrop-filter: url(#liquid-glass-distortion) blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    }
  }

  @keyframes zaeSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes zaeSpinRev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
  @keyframes zaePulse { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }

  @media (max-width: 640px) {
    .section-pad { padding-left: 20px !important; padding-right: 20px !important; padding-top: 92px !important; padding-bottom: 64px !important; }
    .about-stats-grid { gap: 8px !important; }
    .about-stats-grid > div { padding: 12px !important; border-radius: 16px !important; }
    .about-stats-grid p:first-child { font-size: 17px !important; }
    .about-stats-grid p:last-child { font-size: 10px !important; }
    .cta-inner-box { padding: 28px 18px !important; border-radius: 24px !important; }
  }
  @media (max-width: 400px) {
    .section-pad { padding-left: 16px !important; padding-right: 16px !important; }
  }

  .zae-ai-shell { display: grid; grid-template-columns: 220px 1fr; }
  .zae-ai-avatar-panel { display: flex; flex-direction: column; }
  .zae-ai-scroll::-webkit-scrollbar { width: 4px; }
  .zae-ai-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }

  @media (max-width: 640px) {
    .zae-ai-shell { grid-template-columns: 1fr !important; }
    .zae-ai-avatar-panel {
      flex-direction: row !important;
      padding: 14px 18px !important;
      gap: 12px !important;
      border-right: none !important;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .zae-ai-avatar-panel .zae-ai-orb { width: 56px !important; height: 56px !important; }
  }
  @media (max-width: 380px) {
    .zae-ai-toolbar { gap: 4px !important; padding-left: 8px !important; padding-right: 8px !important; }
    .zae-ai-toolbar button { width: 28px !important; height: 28px !important; }
  }

  @keyframes photoReveal {
    0% { opacity: 0; transform: scale(0.92) translateY(24px); filter: blur(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
  }
  .photo-reveal { animation: photoReveal 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }

  @keyframes infoCardReveal {
    0% { opacity: 0; transform: translate(24px, 20px) scale(0.92); }
    100% { opacity: 1; transform: translate(0, 0) scale(1); }
  }
  .portfolio-info-card {
    opacity: 0;
    animation: infoCardReveal 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
    animation-delay: 0.55s;
  }

  @media (prefers-reduced-motion: reduce) {
    .photo-reveal, .portfolio-info-card { animation: none; opacity: 1; }
  }

  .cert-dropdown-content {
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.4s ease, opacity 0.3s ease;
  }
  .cert-dropdown-content.open { max-height: 400px; opacity: 1; }

  .exp-dropdown-content {
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.45s ease, opacity 0.35s ease;
  }
  .exp-dropdown-content.open { max-height: 900px; opacity: 1; }

  .cert-link { text-decoration:none; display:flex; align-items:center; gap:10px; padding:11px 16px;
    border-radius:12px; font-size:13px; color:rgba(255,255,255,0.75); background:rgba(0,0,0,0.3);
    border:1px solid rgba(255,255,255,0.06); transition:all 0.2s; }
  .cert-link:hover { background:#fff; color:#000; border-color:#fff; transform:translateX(4px); }

  .nav-link-item { text-decoration:none; }
  .footer-link-item { text-decoration:none; }
  a { text-decoration:none; }

  .scroll-deco { transition: opacity 0.3s ease; }
  @media (max-width: 640px) {
    .scroll-deco { transform: scale(0.5); }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .scroll-deco { transform: scale(0.75); }
  }

  /* Intro loader illustration — Uiverse.io by vajion_7943 */
  @keyframes loaderFloatBounce {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-20px); }
  }
  @keyframes loaderStrobe {
    0%, 50%, 100% { fill: #17e300; }
    25%, 75%      { fill: #17e300b4; }
  }
  @keyframes loaderStrobeV2 {
    0%, 50%, 100% { fill: rgb(255,95,74); }
    25%, 75%      { fill: rgb(255,208,1); }
  }
  @keyframes loaderGradientShift {
    0%   { stop-color: #19180f; }
    50%  { stop-color: #ffdd00; }
    100% { stop-color: #e71a1a; }
  }
  .loader-float { animation: loaderFloatBounce 4s infinite ease-in-out; }
  .loader-strobe { animation: loaderFloatBounce 4s infinite ease-in-out, loaderStrobe 0.8s infinite; }
  .loader-strobe-v2 { animation: loaderFloatBounce 4s infinite ease-in-out, loaderStrobeV2 0.8s infinite; }
  #loader-paint13 stop { animation: loaderGradientShift 4s infinite alternate; }
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────
function LogoIcon({ size = 26, fill = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20.5" stroke={fill} strokeWidth="2.2" opacity="0.95" />
      <circle cx="24" cy="24" r="20.5" stroke={fill} strokeWidth="2.2" strokeDasharray="5 9" opacity="0.35" transform="rotate(52 24 24)" />
      <circle cx="24" cy="24" r="4" fill={fill} />
      <circle cx="24" cy="4.2" r="3.1" fill={fill} />
    </svg>
  );
}

// ─── Scroll-linked Rotating Object ─────────────────────────────────────────────
function ScrollSpin({ size = 280, accent = "#e8702a", reverse = false, dim = 1, variant = "orbit" }) {
  const outerRef = useRef(null);
  const midRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const dir = reverse ? -1 : 1;
    let running = true;
    const startTime = Date.now();
    const IDLE_SPEED = 6; // deg per second, keeps shapes moving even without scroll

    const tick = () => {
      if (!running) return;
      const elapsedSec = (Date.now() - startTime) / 1000;
      const idle = elapsedSec * IDLE_SPEED * dir;
      const y = window.scrollY;
      if (outerRef.current) outerRef.current.style.transform = `rotate(${idle + y * 0.11 * dir}deg)`;
      if (midRef.current) midRef.current.style.transform = `rotate(${idle * -1.6 + y * -0.19 * dir}deg)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reverse]);

  let shape;
  if (variant === "diamond") {
    shape = (
      <>
        <div ref={outerRef} style={{ position:"absolute", inset:0, willChange:"transform" }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none">
            <rect x="24" y="24" width="152" height="152" rx="16" transform="rotate(45 100 100)" stroke={accent} strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="5 11" />
            <rect x="90" y="2" width="20" height="20" rx="4" fill={accent} fillOpacity="0.85" transform="rotate(45 100 12)" />
          </svg>
        </div>
        <div ref={midRef} style={{ position:"absolute", inset:"20%", willChange:"transform" }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none">
            <rect x="14" y="14" width="172" height="172" rx="12" transform="rotate(45 100 100)" stroke="#fff" strokeOpacity="0.30" strokeWidth="1.3" />
          </svg>
        </div>
      </>
    );
  } else if (variant === "triangle") {
    shape = (
      <>
        <div ref={outerRef} style={{ position:"absolute", inset:0, willChange:"transform" }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none">
            <polygon points="100,6 189,176 11,176" stroke={accent} strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="4 10" strokeLinejoin="round" />
            <circle cx="100" cy="6" r="5" fill={accent} fillOpacity="0.85" />
          </svg>
        </div>
        <div ref={midRef} style={{ position:"absolute", inset:"22%", willChange:"transform" }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none">
            <polygon points="100,12 182,168 18,168" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
        </div>
      </>
    );
  } else if (variant === "arc") {
    shape = (
      <>
        <div ref={outerRef} style={{ position:"absolute", inset:0, willChange:"transform" }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none">
            <circle cx="100" cy="100" r="96" stroke={accent} strokeOpacity="0.6" strokeWidth="2.2" strokeDasharray="66 224" strokeLinecap="round" />
            <circle cx="100" cy="100" r="68" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.4" strokeDasharray="36 180" strokeLinecap="round" />
          </svg>
        </div>
        <div ref={midRef} style={{ position:"absolute", inset:"14%", willChange:"transform" }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none">
            <circle cx="100" cy="100" r="96" stroke={accent} strokeOpacity="0.32" strokeWidth="1.2" strokeDasharray="16 26" />
          </svg>
        </div>
      </>
    );
  } else if (variant === "grid") {
    const pts = [30, 70, 110, 150, 170];
    const dots = [];
    pts.forEach((cy, r) => pts.forEach((cx, c) => {
      if ((r + c) % 2 === 0) {
        const key = `${r}-${c}`;
        const big = (r + c) % 4 === 0;
        dots.push(<circle key={key} cx={cx} cy={cy} r={big ? 3.6 : 1.9} fill={big ? accent : "#fff"} fillOpacity={big ? 0.85 : 0.32} />);
      }
    }));
    shape = (
      <div ref={outerRef} style={{ position:"absolute", inset:0, willChange:"transform" }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none">{dots}</svg>
      </div>
    );
  } else {
    shape = (
      <>
        <div ref={outerRef} style={{ position:"absolute", inset:0, willChange:"transform" }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none">
            <circle cx="100" cy="100" r="97" stroke={accent} strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="3 11" />
            <circle cx="100" cy="3" r="5.2" fill={accent} fillOpacity="0.9" />
            <circle cx="100" cy="197" r="3.2" fill="#fff" fillOpacity="0.45" />
          </svg>
        </div>
        <div ref={midRef} style={{ position:"absolute", inset:"16%", willChange:"transform" }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none">
            <circle cx="100" cy="100" r="97" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.3" />
            <circle cx="196" cy="100" r="4" fill={accent} fillOpacity="0.75" />
          </svg>
        </div>
        <div style={{ position:"absolute", inset:"36%", borderRadius:"50%", border:`1px solid ${accent}`, opacity:0.32 }} />
      </>
    );
  }

  return (
    <div className="scroll-deco" style={{ position:"relative", width:size, height:size, pointerEvents:"none", opacity:dim }}>
      {shape}
    </div>
  );
}

// ─── Reveal Layer ─────────────────────────────────────────────────────────────
function RevealLayer({ image, cursorX, cursorY }) {
  const canvasRef = useRef(null);
  const divRef = useRef(null);

  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const div = divRef.current;
    if (!canvas || !div) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const g = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    g.addColorStop(0,    "rgba(255,255,255,1)");
    g.addColorStop(0.4,  "rgba(255,255,255,1)");
    g.addColorStop(0.6,  "rgba(255,255,255,0.75)");
    g.addColorStop(0.75, "rgba(255,255,255,0.4)");
    g.addColorStop(0.88, "rgba(255,255,255,0.12)");
    g.addColorStop(1,    "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();
    const url = canvas.toDataURL();
    div.style.maskImage = `url('${url}')`;
    div.style.webkitMaskImage = `url('${url}')`;
    div.style.maskSize = "100% 100%";
    div.style.webkitMaskSize = "100% 100%";
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas ref={canvasRef} style={{ position:"absolute",inset:0,pointerEvents:"none",display:"none" }} />
      <div ref={divRef} style={{ position:"absolute",inset:0,backgroundImage:`url('${image}')`,backgroundSize:"cover",backgroundPosition:"center",zIndex:30,pointerEvents:"none" }} />
    </>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Zae Labs",   href: "#hero" },
  { label: "About",      href: "#about" },
  { label: "Portfolio",  href: "#portfolio" },
  { label: "Experience", href: "#experience" },
  { label: "Tools",      href: "#tools" },
  { label: "Prompts",    href: "#prompts" },
];

function Nav({ unlocked }) {
  const [active, setActive] = useState("Zae Labs");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px" }}>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:110,background:"linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",zIndex:-1,pointerEvents:"none" }} />
      {/* Logo */}
      <a href="#hero" style={{ display:"flex",alignItems:"center",gap:10 }} onClick={() => setActive("Zae Labs")}>
        <LogoIcon size={24} />
        <span style={{ color:"#fff",fontSize:19,lineHeight:1,letterSpacing:"-0.02em",display:"flex",alignItems:"baseline",gap:4 }}>
          <span style={{ fontWeight:700,fontFamily:"'Inter',sans-serif" }}>Zae</span>
          <span className="font-playfair" style={{ fontSize:18,opacity:0.85 }}>Labs</span>
        </span>
      </a>

      {/* Center pill — only shown after unlock, desktop */}
      <div className="desktop-nav-pill" style={{
        position:"absolute", left:"50%",
        background:"rgba(255,255,255,0.18)", backdropFilter:"blur(12px)",
        border:"1px solid rgba(255,255,255,0.28)", borderRadius:9999,
        padding:"6px 6px", display:"flex", alignItems:"center", gap:2,
        opacity: unlocked ? 1 : 0,
        pointerEvents: unlocked ? "auto" : "none",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        transform: unlocked
          ? "translateX(-50%) translateY(0px)"
          : "translateX(-50%) translateY(-12px)",
      }}>
        {NAV_LINKS.slice(1).map(({ label, href }) => (
          <a key={label} href={href} onClick={() => setActive(label)}
            style={{ fontSize:13,fontWeight:500,padding:"6px 14px",borderRadius:9999,transition:"all 0.2s",color:active===label?"#000":"rgba(255,255,255,0.8)",background:active===label?"#fff":"transparent" }}
            onMouseEnter={e => { if(active!==label){ e.currentTarget.style.background="rgba(255,255,255,0.18)"; e.currentTarget.style.color="#fff"; }}}
            onMouseLeave={e => { if(active!==label){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.8)"; }}}
          >{label}</a>
        ))}
      </div>

      {/* Follow — only shown after unlock, desktop */}
      <a href="https://www.instagram.com/irsyazaelani/" target="_blank" rel="noopener noreferrer"
        className="desktop-follow-btn"
        style={{
          background:"#fff", color:"#111", fontSize:13, fontWeight:600,
          padding:"10px 22px", borderRadius:9999, transition:"all 0.5s ease",
          opacity: unlocked ? 1 : 0,
          pointerEvents: unlocked ? "auto" : "none",
          transform: unlocked ? "translateY(0px)" : "translateY(-12px)",
        }}
        onMouseEnter={e => e.currentTarget.style.background="#f0f0f0"}
        onMouseLeave={e => e.currentTarget.style.background="#fff"}
      >Follow</a>

      {/* Mobile hamburger — only shown after unlock */}
      {unlocked && (
        <button onClick={() => setMobileOpen(p => !p)} className="mobile-menu-btn"
          style={{ background:"none",border:"none",color:"#fff",cursor:"pointer",padding:4,
            animation:"navPopIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards"
          }}>
          {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      )}

      {/* Mobile placeholder to keep logo left-aligned before unlock */}
      {!unlocked && (
        <div className="mobile-menu-btn" style={{ width:32, height:32 }} />
      )}

      {mobileOpen && unlocked && (
        <div style={{ position:"absolute",top:"100%",left:12,right:12,background:"rgba(8,8,8,0.97)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:20,padding:"14px 8px",display:"flex",flexDirection:"column",gap:2 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => { setActive(label); setMobileOpen(false); }}
              style={{ fontSize:15,fontWeight:500,padding:"12px 18px",borderRadius:12,color:active===label?"#e8702a":"rgba(255,255,255,0.85)",background:active===label?"rgba(232,112,42,0.08)":"transparent" }}
            >{label}</a>
          ))}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)",margin:"8px 0" }} />
          <a href="https://www.instagram.com/irsyazaelani/" target="_blank" rel="noopener noreferrer"
            style={{ fontSize:14,fontWeight:600,padding:"12px 18px",borderRadius:12,color:"#fff",background:"rgba(255,255,255,0.07)",textAlign:"center" }}>
            Follow @irsyazaelani
          </a>
        </div>
      )}

      <style>{`
        @keyframes navPopIn { 0%{opacity:0;transform:scale(0.8) translateY(-8px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @media(min-width:900px){ .desktop-nav-pill{display:flex!important;} .desktop-follow-btn{display:inline-flex!important;} .mobile-menu-btn{display:none!important;} }
        @media(max-width:899px){ .desktop-nav-pill{display:none!important;} .desktop-follow-btn{display:none!important;} .mobile-menu-btn{display:flex!important;} }
      `}</style>
    </nav>
  );
}

// ─── Hero (Zae Labs) ─────────────────────────────────────────────────────────
function HeroSection({ unlocked, setUnlocked }) {
  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef(null);
  const sectionRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [heroVisible, setHeroVisible] = useState(true);

  // Lock scroll on mount, unlock when button clicked
  useEffect(() => {
    if (!unlocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [unlocked]);

  // Only run the (expensive) cursor-spotlight loop while the hero is actually on screen —
  // avoids burning CPU forever once the user has scrolled past it.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!heroVisible) return;
    const onMove = e => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    window.addEventListener("mousemove", onMove);
    const loop = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;
      // Skip the (expensive) canvas redraw/state update once the smoothing has settled —
      // this is the common "mouse idle" case and was previously re-rendering forever.
      setCursorPos(prev => {
        const dx = Math.abs(prev.x - smoothRef.current.x);
        const dy = Math.abs(prev.y - smoothRef.current.y);
        if (dx < 0.4 && dy < 0.4) return prev;
        return { x: smoothRef.current.x, y: smoothRef.current.y };
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [heroVisible]);

  const handleUnlock = () => {
    setUnlocked(true);
    setTimeout(() => {
      document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <section id="hero" ref={sectionRef} style={{ position:"relative",width:"100%",overflow:"hidden",height:"100dvh",background:"#000" }}>
      <div className="hero-zoom" style={{ position:"absolute",inset:0,backgroundImage:`url('${BG_IMAGE_1}')`,backgroundSize:"cover",backgroundPosition:"center",zIndex:10 }} />
      <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

      {/* Heading */}
      <div style={{ position:"absolute",top:"14%",left:0,right:0,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"0 20px",pointerEvents:"none",zIndex:50 }}>
        <h1 style={{ color:"#fff",lineHeight:0.95,margin:0 }}>
          <span className="hero-anim hero-reveal" style={{ display:"block",fontSize:"clamp(56px,10vw,128px)",fontWeight:700,letterSpacing:"-0.05em",animationDelay:"0.25s" }}>Zae Labs<span className="font-playfair" style={{ fontWeight:400 }}>.</span></span>
        </h1>
        <span className="hero-anim hero-fade" style={{ display:"block",marginTop:20,fontSize:"clamp(16px,2.2vw,22px)",color:"rgba(255,255,255,0.80)",fontWeight:600,letterSpacing:"-0.01em",animationDelay:"0.42s",pointerEvents:"none" }}>
          Ideas engineered into real digital products.
        </span>
        <span className="hero-anim hero-fade" style={{ display:"block",marginTop:10,fontSize:"clamp(13px,1.6vw,16px)",color:"rgba(255,255,255,0.50)",letterSpacing:"0.01em",animationDelay:"0.55s",pointerEvents:"none" }}>
          Do your best today.
        </span>
      </div>

      {/* Bottom left */}
      <div className="hero-anim hero-fade hero-bl" style={{ position:"absolute",bottom:56,left:56,maxWidth:260,zIndex:50,animationDelay:"0.7s" }}>
        <p style={{ fontSize:14,color:"rgba(255,255,255,0.80)",lineHeight:1.65 }}>Zae Labs builds practical AI workflows, web experiments, and prompt systems that help creators build faster with modern tools.</p>
      </div>

      {/* Bottom right */}
      <div className="hero-anim hero-fade hero-br" style={{ position:"absolute",bottom:40,right:56,maxWidth:260,display:"flex",flexDirection:"column",alignItems:"flex-start",gap:20,zIndex:50,animationDelay:"0.85s" }}>
        <p style={{ fontSize:14,color:"rgba(255,255,255,0.80)",lineHeight:1.65 }}>Every great product starts with a single decision. Press the button, explore the work, and see what's possible when ideas meet execution.</p>
        <button
          onClick={handleUnlock}
          style={{ display:"inline-block",background:"#e8702a",color:"#fff",fontSize:14,fontWeight:500,padding:"12px 28px",borderRadius:9999,border:"none",cursor:"pointer",transition:"all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background="#d2611f"; e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(232,112,42,0.30)"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#e8702a"; e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="none"; }}>
          Let's Go
        </button>
      </div>

      <style>{`
        @media(max-width:600px){ .hero-bl{display:none!important;} }
        @media(max-width:767px){ .hero-br{right:20px!important;left:20px!important;max-width:100%!important;} }
      `}</style>
    </section>
  );
}

// ─── Portfolio Hero (Irsya) ───────────────────────────────────────────────────
const SOCIAL_LINKS = [
  { icon:<FaInstagram/>, href:"https://www.instagram.com/irsyazaelani/", label:"Instagram" },
  { icon:<FaLinkedin/>, href:"https://www.linkedin.com/in/muhammad-irsya-zaelani", label:"LinkedIn" },
  { icon:<FaTwitter/>, href:"https://x.com/TweetsOfCats/status/1578127628179210240", label:"X" },
  { icon:<FaEnvelope/>, href:"https://maszae-bit.github.io/Login-Zae-Group/", label:"Newsletter" },
];

function PortfolioPhoto() {
  return (
    <div className="portfolio-photo-col" style={{ display:"flex",justifyContent:"center",alignItems:"center" }}>
      <div className="portfolio-photo-wrap photo-reveal" style={{ position:"relative", maxWidth:420, width:"100%" }}>
        <img src={PROFILE_PHOTO} alt="Irsya Zaelani"
          className="portfolio-photo-img"
          style={{ display:"block", width:"100%", aspectRatio:"4/5", objectFit:"cover", borderRadius:24, border:"1px solid rgba(255,255,255,0.10)", boxShadow:"0 24px 60px rgba(0,0,0,0.6)" }}
          onError={e => { e.currentTarget.style.display="none"; }}
        />

        {/* Overlapping info card */}
        <div className="glass-panel portfolio-info-card" style={{
          position:"absolute", right:"-12%", bottom:"-8%", width:"70%", minWidth:220,
          borderRadius:24, border:"1px solid rgba(255,255,255,0.18)", background:"rgba(15,15,15,0.75)",
          backdropFilter:"blur(20px) saturate(180%)", WebkitBackdropFilter:"blur(20px) saturate(180%)",
          boxShadow:"0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
          padding:"22px 22px 18px",
        }}>
          <p style={{ fontSize:16,fontWeight:700,color:"#fff",letterSpacing:"-0.02em" }}>Irsya Zaelani</p>
          <p style={{ fontSize:12,color:"rgba(255,255,255,0.50)",marginTop:2 }}>Tech Enthusiast · IPB University</p>
          <div style={{ display:"flex",gap:8,marginTop:16 }}>
            {SOCIAL_LINKS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                style={{ width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,transition:"all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.background="#e8702a"; e.currentTarget.style.borderColor="#e8702a"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }}
              >{s.icon}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioHero() {
  const [typed, setTyped] = useState("");
  const fullText = "Hi there! I'm a tech enthusiast currently focused on learning how to turn simple ideas into code. Still a work in progress, but always excited to learn and try new things.";
  const timerRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !startedRef.current) {
        startedRef.current = true;
        let i = 0;
        timerRef.current = setInterval(() => {
          i++;
          setTyped(fullText.slice(0, i));
          if (i >= fullText.length) clearInterval(timerRef.current);
        }, 28);
      }
    }, { threshold: 0.3 });
    const el = document.getElementById("portfolio-hero-trigger");
    if (el) obs.observe(el);
    return () => { obs.disconnect(); if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <section id="portfolio" className="section-pad" style={{ position:"relative",background:"#000",color:"#fff",padding:"120px 56px 80px",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden" }}>
      <div className="portfolio-deco-orbit" style={{ position:"absolute",top:"10%",left:"2%",opacity:0.85 }}>
        <ScrollSpin size={180} reverse variant="orbit" />
      </div>
      <div className="portfolio-deco-triangle" style={{ position:"absolute",bottom:"6%",right:"3%",opacity:0.7 }}>
        <ScrollSpin size={150} accent="#ffffff" dim={0.7} variant="triangle" />
      </div>
      <div id="portfolio-hero-trigger" style={{ maxWidth:1152,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:64,alignItems:"center" }}>
        {/* Left text */}
        <div className="portfolio-text-col">
          <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:20 }}>Portfolio</p>
          <h2 style={{ fontSize:"clamp(36px,5vw,60px)",fontWeight:600,letterSpacing:"-0.05em",lineHeight:1.05,marginBottom:12 }}>
            Hello, I'm <span style={{ fontWeight:700 }}>Irsya Zaelani</span>
          </h2>
          <h3 style={{ fontSize:"clamp(16px,2vw,20px)",color:"rgba(255,255,255,0.55)",fontWeight:400,marginBottom:28 }}>
            Tech Enthusiast & Student at <span style={{ color:"#fff",fontWeight:600 }}>IPB University</span>
          </h3>
          <p style={{ fontSize:15,color:"rgba(255,255,255,0.65)",lineHeight:1.8,minHeight:80,maxWidth:520,marginBottom:36 }}>{typed}<span style={{ opacity:0.5 }}>|</span></p>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
            <a href="#experience" style={{ display:"inline-flex",alignItems:"center",gap:10,padding:"13px 26px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.20)",color:"#fff",borderRadius:9999,fontSize:14,fontWeight:500,transition:"all 0.3s",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)" }}
              onMouseEnter={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.color="#000"; e.currentTarget.style.borderColor="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="rgba(255,255,255,0.20)"; }}>
              <GraduationCap size={16} /> Get to Know Me
            </a>
            <a href="#tools" style={{ display:"inline-flex",alignItems:"center",gap:10,padding:"13px 26px",background:"rgba(232,112,42,0.14)",border:"1px solid rgba(232,112,42,0.35)",color:"#e8702a",borderRadius:9999,fontSize:14,fontWeight:500,transition:"all 0.3s",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)" }}
              onMouseEnter={e => { e.currentTarget.style.background="#e8702a"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#e8702a"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(232,112,42,0.10)"; e.currentTarget.style.color="#e8702a"; e.currentTarget.style.borderColor="rgba(232,112,42,0.35)"; }}>
              <Wrench size={16} /> My Tools
            </a>
          </div>
        </div>

        {/* Right photo */}
        <PortfolioPhoto />
      </div>

      <style>{`
        @media (max-width: 640px) {
          .portfolio-deco-orbit, .portfolio-deco-triangle { display:none !important; }
          .portfolio-photo-wrap { max-width: 280px !important; }
          .portfolio-info-card { padding:16px 16px 14px !important; }
          .portfolio-photo-col { order:1; }
          .portfolio-text-col { order:2; }
        }
      `}</style>
    </section>
  );
}

// ─── About / Zae Labs brand ──────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="section-pad" style={{ position:"relative",background:"#050505",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,right:0,width:520,height:520,background:"radial-gradient(circle closest-side at center, rgba(232,112,42,0.48) 0%, rgba(232,112,42,0.22) 35%, rgba(232,112,42,0.06) 65%, rgba(232,112,42,0) 100%)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:"8%",right:"4%",opacity:0.9 }}>
        <ScrollSpin size={220} variant="diamond" />
      </div>
      <div style={{ maxWidth:1152,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:64,alignItems:"start" }}>
        <div>
          <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:24 }}>About Zae Labs</p>
          <h2 style={{ fontSize:"clamp(36px,5vw,58px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:0.95 }}>
            Building <span className="font-playfair">practical</span> AI systems for real creators.
          </h2>
        </div>
        <div>
          <p style={{ color:"rgba(255,255,255,0.70)",fontSize:17,lineHeight:1.7,marginBottom:48,maxWidth:520 }}>
            Zae Labs creates practical AI workflows, prompt systems, web development experiments, and AI agent tutorials for creators, students, and builders who want to turn ideas into real digital products faster.
          </p>
          <div className="about-stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
            {[{ num:"100+",label:"AI experiments" },{ num:"50+",label:"Prompt systems" },{ num:"10+",label:"Web builds" }].map(({ num, label }) => (
              <div key={label} className="glass-panel" style={{ borderRadius:24,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.07)",padding:20,backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",boxShadow:"0 4px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
                <p style={{ fontSize:"clamp(22px,3vw,28px)",fontWeight:600 }}>{num}</p>
                <p style={{ fontSize:13,color:"rgba(255,255,255,0.50)",marginTop:4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Experience Section ───────────────────────────────────────────────────────
const EXPERIENCES = [
  { title:"Staf of IT Today", org:"IPB University", period:"Present", desc:"Managed run-of-show and scheduling for IT TODAY, a national-scale competition, ensuring smooth coordination across sessions and divisions." },
  { title:"LPK Tepi Sawah Volunteer", org:"IPB University", period:"Present", desc:"Actively volunteering in the Computer Science community, focusing on teaching basic things to children through play and participating in direct field activities." },
  { title:"IPB Archery", org:"IPB University", period:"Present", desc:"Active as a member of the IPB Archery community, focusing on mastering basic archery techniques through regular practice and actively participating in community activities in the field." },
  { title:"Head of Robotic D'Astha", org:"SMAN 28 Kab. Tangerang", period:"Jun 2023 – Aug 2024", desc:"Led the high school robotics club and successfully engineered a Line Follower Robot. Fostered leadership, teamwork, and strong hardware-software integration skills." },
  { title:"Member of D'Astha Research Team", org:"SMAN 28 Kab. Tangerang", period:"Jun 2023 – Jul 2024", desc:"Actively contributed to the research team. Applied strong analytical and teamwork skills to conduct studies, gather data, and develop innovative solutions." },
  { title:"Staf of Gerakan pelajar Anti Korupsi", org:"SMAN 28 Kab. Tangerang", period:"May 2023 – Jun 2024", desc:"Supported anti-corruption campaigns and integrity education programs within the school community, helping organize activities that promoted honesty and transparency among students." },
  { title:"Staf of Karate D'Astha", org:"SMAN 28 Kab. Tangerang", period:"Feb 2023 – Apr 2024", desc:"Trained in the karate extracurricular, building discipline and physical resilience, while also helping coordinate regular training sessions for fellow members." },
];

function ExperienceGroupCard({ org, meta, items }) {
  const [open, setOpen] = useState(false);
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="glass-panel"
      style={{ borderRadius:28,border:(h||open)?"1px solid rgba(232,112,42,0.40)":"1px solid rgba(255,255,255,0.18)",background:(h||open)?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.07)",padding:"32px 28px",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",boxShadow:(h||open)?"0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.20)":"0 4px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.12)",transition:"all 0.35s",transform:h?"translateY(-6px)":"translateY(0)",display:"flex",flexDirection:"column",gap:12,cursor:"pointer" }}
      onClick={() => setOpen(p => !p)}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ width:40,height:40,borderRadius:"50%",background:"rgba(232,112,42,0.12)",border:"1px solid rgba(232,112,42,0.25)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <BookOpen size={18} color="#e8702a" />
        </div>
        <div style={{ color:"rgba(255,255,255,0.55)",transition:"transform 0.35s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <ChevronDown size={18}/>
        </div>
      </div>
      <h3 style={{ fontSize:18,fontWeight:600,letterSpacing:"-0.03em",color:"#fff" }}>{org}</h3>
      <p style={{ fontSize:13,color:"rgba(255,255,255,0.45)",fontWeight:500 }}>{meta}</p>
      <p style={{ fontSize:13,color:"#e8702a",fontWeight:500 }}>{items.length} {items.length > 1 ? "activities" : "activity"} · tap to {open ? "collapse" : "expand"}</p>

      <div className={`exp-dropdown-content ${open ? "open" : ""}`} style={{ marginTop: open ? 6 : 0, display:"flex", flexDirection:"column", gap:16 }}>
        {items.map(({ title, period, desc }) => (
          <div key={title} style={{ borderTop:"1px solid rgba(255,255,255,0.10)", paddingTop:16 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8,flexWrap:"wrap" }}>
              <p style={{ fontSize:15,fontWeight:600,color:"#fff" }}>{title}</p>
              <p style={{ fontSize:12,color:"rgba(255,255,255,0.40)" }}>{period}</p>
            </div>
            <p style={{ fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.6,marginTop:6 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceSection() {
  const groups = [];
  EXPERIENCES.forEach(e => {
    let g = groups.find(g => g.org === e.org);
    if (!g) { g = { org: e.org, items: [] }; groups.push(g); }
    g.items.push(e);
  });
  const groupMeta = groups.map(g => {
    const periods = g.items.map(i => i.period);
    const meta = periods.includes("Present") ? "Present" : periods[0];
    return { ...g, meta };
  });

  return (
    <section id="experience" className="section-pad" style={{ position:"relative",background:"#000",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",bottom:0,left:0,width:520,height:520,background:"radial-gradient(circle closest-side at center, rgba(232,112,42,0.42) 0%, rgba(232,112,42,0.18) 35%, rgba(232,112,42,0.05) 65%, rgba(232,112,42,0) 100%)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:"6%",right:"-5%",opacity:0.75 }}>
        <ScrollSpin size={230} reverse variant="arc" />
      </div>
      <div style={{ maxWidth:1152,margin:"0 auto" }}>
        <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:16 }}>Experience</p>
        <h2 style={{ fontSize:"clamp(32px,5vw,56px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:0.95,marginBottom:12,maxWidth:600 }}>
          Where I've <span className="font-playfair">grown</span> and contributed.
        </h2>
        <p style={{ color:"rgba(255,255,255,0.55)",fontSize:15,lineHeight:1.65,maxWidth:480,marginBottom:48 }}>Organizations and communities that shaped my skills in tech, leadership, and collaboration.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20 }}>
          {groupMeta.map(g => <ExperienceGroupCard key={g.org} org={g.org} meta={g.meta} items={g.items} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Certifications Section ───────────────────────────────────────────────────
const CERTS = [
  {
    icon: <FaGraduationCap/>,
    title: "Google Certification",
    desc: "Official certifications from Google demonstrating industry-standard technical competence and expertise.",
    links: [
      { label:"Gemini Certified Educator", href:"https://edu.google.accredible.com/5463895f-480a-4157-96ab-885dcaeda295" },
      { label:"AI Basics (Dicoding)", href:"https://www.dicoding.com/certificates/53XEKKEYVXRN" },
    ],
  },
  {
    icon: <FaTrophy/>,
    title: "IBM Certification",
    desc: "Official certifications from IBM SkillsBuild validating advanced technical skills and problem-solving abilities.",
    links: [
      { label:"IBM Granite Certified", href:"https://drive.google.com/file/d/1Dv_RjEFOiQA1fwK1ahvhWnMW3Z_4erMK/view" },
      { label:"Use Generative AI", href:"https://skills.yourlearning.ibm.com/certificate/share/e07590991dewogICJvYmplY3RJZCIgOiAiTURMLTUwNCIsCiAgIm9iamVjdFR5cGUiIDogIkFDVElWSVRZIiwKICAibGVhcm5lckNOVU0iIDogIjU4MjQ4NDdSRUciCn034e5a94fee-10" },
      { label:"Software Development", href:"https://skills.yourlearning.ibm.com/certificate/share/2c385c2b05ewogICJvYmplY3RUeXBlIiA6ICJBQ1RJVklUWSIsCiAgIm9iamVjdElkIiA6ICJNREwtNTY3IiwKICAibGVhcm5lckNOVU0iIDogIjU4MjQ4NDdSRUciCn0853fb8f20d-10" },
      { label:"Code Generation & Optimization", href:"https://skills.yourlearning.ibm.com/certificate/share/b08c8c0376ewogICJvYmplY3RJZCIgOiAiTURMLTU2NiIsCiAgIm9iamVjdFR5cGUiIDogIkFDVElWSVRZIiwKICAibGVhcm5lckNOVU0iIDogIjU4MjQ4NDdSRUciCn018aaaf58d0-10" },
    ],
  },
  {
    icon: <FaScroll/>,
    title: "Ruang Guru Certification",
    desc: "Official certifications validating achievements, technical skills, and dedication in the technology field.",
    links: [
      { label:"National Teacher Training", href:"https://drive.google.com/file/d/179zxv3gzpcUGfLKBfmZVsOaKyb_7QNOz/view" },
      { label:"Science Competition", href:"https://drive.google.com/file/d/1Zpok9g5uSva0wBmO2ZazaHaxNEwQjVQV/view" },
    ],
  },
];

function CertCard({ icon, title, desc, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-panel" style={{ borderRadius:28,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.07)",padding:"32px 28px",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",boxShadow:"0 4px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.12)",display:"flex",flexDirection:"column",gap:16,transition:"all 0.35s" }}>
      <div style={{ fontSize:36, color:"#e8702a" }}>{icon}</div>
      <h3 style={{ fontSize:20,fontWeight:600,letterSpacing:"-0.03em" }}>{title}</h3>
      <p style={{ fontSize:14,color:"rgba(255,255,255,0.60)",lineHeight:1.65 }}>{desc}</p>
      <div>
        <button onClick={() => setOpen(p => !p)}
          style={{ width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.18)",color:"#fff",padding:"11px 18px",borderRadius:9999,fontSize:13,fontWeight:500,cursor:"pointer",transition:"all 0.3s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.10)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
          <span style={{ display:"flex",alignItems:"center",gap:8 }}><Award size={14}/> View Certificates</span>
          {open ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </button>
        <div className={`cert-dropdown-content ${open ? "open" : ""}`} style={{ marginTop: open ? 10 : 0,display:"flex",flexDirection:"column",gap:6 }}>
          {links.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="cert-link">
              <ExternalLink size={12}/> {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function CertificationsSection() {
  return (
    <section className="section-pad" style={{ position:"relative",background:"#050505",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"20%",right:"-6%",opacity:0.8 }}>
        <ScrollSpin size={200} variant="grid" />
      </div>
      <div style={{ maxWidth:1152,margin:"0 auto" }}>
        <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:16 }}>Certifications</p>
        <h2 style={{ fontSize:"clamp(32px,5vw,56px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:0.95,marginBottom:48,maxWidth:560 }}>
          Credentials that <span className="font-playfair">prove</span> the work.
        </h2>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20 }}>
          {CERTS.map(c => <CertCard key={c.title} {...c} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Tools Collection ─────────────────────────────────────────────────────────
const TOOLS = [
  { name:"Database",       keyword:"vscode coding database",     href:"https://maszae-bit.github.io/Login-Zae-Group/", icon:<FaDatabase/> },
  { name:"Github",         keyword:"github repo code",           href:"https://github.com/MasZae-BIT", icon:<FaGithub/> },
  { name:"Knowledge Hub",  keyword:"knowledge hub drive flask",  href:"https://drive.google.com/drive/u/1/folders/1rC5fnbguTs4TBfGauJ9_8HD-0uiyKKWg", icon:<FaMicroscope/> },
  { name:"Zae AI",         keyword:"chatgpt ai bot microchip",   href:"https://zae-ai.vercel.app/", icon:<FaRobot/> },
  { name:"Grammar Checker",keyword:"grammar checker english spell text", href:"https://grammar-checker-ashen.vercel.app/", icon:<FaCheckCircle/> },
  { name:"Spotify",        keyword:"spotify music song playlist",href:"https://open.spotify.com/playlist/4T7MrNwyHzB3DwtzaIGFFn?si=ddabd6a078a64c0a", icon:<FaSpotify/> },
  { name:"Discord",        keyword:"discord social chat",        href:"https://discord.gg/3JdWnYsV", icon:<FaDiscord/> },
  { name:"Instagram DL",   keyword:"instagram social media download", href:"https://maszae-bit.github.io/Instagram-Downloader/", icon:<FaInstagram/> },
  { name:"TikTok DL",      keyword:"tiktok video social download",   href:"https://maszae-bit.github.io/Tiktok-Downloader/", icon:<FaTiktok/> },
  { name:"Journal Search", keyword:"database sql journal search book", href:"https://maszae-bit.github.io/Journal/", icon:<FaBook/> },
];

// ─── Gallery Scroll Section (3D tilt scroll animation) ────────────────────────
const GALLERY_PHOTOS = [
  "/moment1.jpg",
  "/moment2.jpg",
  "/moment3.jpg",
  "/moment4.jpg",
  "/moment5.jpg",
];

// Titik-titik fase dalam progres scroll section ini (0 → 1):
// 0 .. ENTRY_END        → kartu tegak berdiri (tilt + scale + judul naik)
// ENTRY_END .. HOLD_END → kartu "nempel" di layar, foto gantian di sini
// HOLD_END .. 1         → section lepas & lanjut scroll ke bawah seperti biasa
const GALLERY_ENTRY_END = 0.22;
const GALLERY_HOLD_END = 0.9;

function GalleryScrollSection() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // offset "start start" → "end end": progres dihitung sepanjang TINGGI
  // container (bukan cuma pas lewat viewport), jadi butuh beberapa kali
  // scroll baru progresnya jalan — makanya container-nya sengaja dibikin tinggi (vh).
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring bikin gerakannya "mulus" (nge-lag halus ngikutin scroll),
  // bukan lompat kaku 1:1 sama posisi scroll.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });

  const rotate = useTransform(smoothProgress, [0, GALLERY_ENTRY_END], [20, 0]);
  const scale = useTransform(smoothProgress, [0, GALLERY_ENTRY_END], isMobile ? [0.75, 0.92] : [1.05, 1]);
  const translate = useTransform(smoothProgress, [0, GALLERY_ENTRY_END], [0, -80]);

  // Ganti foto aktif berdasarkan posisi scroll di fase "hold".
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v <= GALLERY_ENTRY_END) {
        setActivePhoto(0);
        return;
      }
      const holdProgress = Math.min(
        1,
        Math.max(0, (v - GALLERY_ENTRY_END) / (GALLERY_HOLD_END - GALLERY_ENTRY_END))
      );
      const idx = Math.min(
        GALLERY_PHOTOS.length - 1,
        Math.floor(holdProgress * GALLERY_PHOTOS.length)
      );
      setActivePhoto(idx);
    });
  }, [scrollYProgress]);

  return (
    <section style={{ position:"relative", background:"#050505", color:"#fff" }}>
      {/* Container tinggi = "jarak scroll" yang harus dilewati. Makin besar,
          makin banyak scroll yang dibutuhkan sebelum section ini selesai.
          PENTING: section & div ini sengaja TIDAK overflow:hidden, karena
          overflow:hidden di ancestor mana pun bikin position:sticky di
          bawah ini mati (browser jadi nggak nge-pin, malah lompat scroll). */}
      <div ref={containerRef} style={{ position:"relative", height: isMobile ? "260vh" : "320vh" }}>
        {/* Sticky = nempel di layar selama masih di dalam tinggi container di atas */}
        <div style={{ position:"sticky", top:0, height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile ? "8px" : "8px 56px" }}>
          <div style={{ width:"100%", maxWidth:1152, margin:"0 auto", position:"relative", perspective:"1000px" }}>

            <motion.div style={{ translateY: translate }}>
              <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
                <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:16 }}>Gallery</p>
                <h2 style={{ fontSize:"clamp(30px,4.5vw,52px)",fontWeight:500,letterSpacing:"-0.05em",lineHeight:1.05 }}>
                  Moments behind <span className="font-playfair" style={{ fontWeight:400 }}>the build.</span>
                </h2>
                <p style={{ color:"rgba(255,255,255,0.55)",fontSize:15,lineHeight:1.65,marginTop:16 }}>A few snapshots from the process — building, learning, and showing up.</p>
              </div>
            </motion.div>

            <motion.div style={{
              rotateX: rotate,
              scale,
              boxShadow:"0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
              maxWidth:960, margin: isMobile ? "-24px auto 0" : "-48px auto 0",
              aspectRatio:"16/9", width:"100%",
              border:"4px solid rgba(255,255,255,0.14)",
              padding: isMobile ? 8 : 20,
              background:"#161616", borderRadius:30,
            }}>
              <div style={{ position:"relative", height:"100%", width:"100%", overflow:"hidden", borderRadius:20, background:"#0a0a0a" }}>
                {GALLERY_PHOTOS.map((src, i) => (
                  <img key={src} src={src} alt={`Zae Labs moment ${i + 1}`}
                    style={{
                      position:"absolute", inset:0, width:"100%", height:"100%",
                      objectFit:"cover", display:"block",
                      opacity: activePhoto === i ? 1 : 0,
                      transition:"opacity 0.7s cubic-bezier(0.16,1,0.3,1)",
                    }}
                    onError={e => { e.currentTarget.style.display = "none"; }}
                  />
                ))}

                {/* Dot indicator biar keliatan masih ada foto lain pas di-scroll */}
                <div style={{ position:"absolute", bottom: isMobile ? 12 : 20, left:0, right:0, display:"flex", justifyContent:"center", gap:8, zIndex:2 }}>
                  {GALLERY_PHOTOS.map((_, i) => (
                    <span key={i} style={{
                      width: activePhoto === i ? 20 : 6, height:6, borderRadius:9999,
                      background: activePhoto === i ? "#e8702a" : "rgba(255,255,255,0.35)",
                      transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }} />
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

function ToolsSection() {
  const [query, setQuery] = useState("");
  const filtered = query.trim() === ""
    ? TOOLS
    : TOOLS.filter(t => t.keyword.toLowerCase().includes(query.toLowerCase()) || t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section id="tools" className="section-pad" style={{ position:"relative",background:"#000",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"4%",left:"-4%",opacity:0.6 }}>
        <ScrollSpin size={200} accent="#ffffff" dim={0.7} reverse variant="triangle" />
      </div>
      <div style={{ maxWidth:1152,margin:"0 auto" }}>
        {/* Header */}
        <div style={{ textAlign:"center",marginBottom:48 }}>
          <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:16 }}>Tools Collection</p>
          <h2 style={{ fontSize:"clamp(32px,5vw,56px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:0.95,marginBottom:12 }}>
            Quick access to <span className="font-playfair">all</span> tools.
          </h2>
          <p style={{ color:"rgba(255,255,255,0.55)",fontSize:15,lineHeight:1.65,maxWidth:400,margin:"0 auto 32px" }}>Every productivity tool in one searchable place.</p>
          {/* Search */}
          <div style={{ position:"relative",maxWidth:480,margin:"0 auto" }}>
            <Search size={16} style={{ position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.35)",pointerEvents:"none" }} />
            <input className="search-input-styled" placeholder="Search tools (Github, Zae AI, etc)..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:16,maxWidth:1000,margin:"0 auto" }}>
          {filtered.map(({ name, href, icon }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="tool-link-card">
              <div className="tool-card-inner glass-panel" style={{ borderRadius:20,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.07)",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",boxShadow:"0 4px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.12)",height:150,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:12,transition:"all 0.3s",cursor:"pointer" }}>
                <span style={{ fontSize:36, color:"#e8702a" }}>{icon}</span>
                <span style={{ fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.80)",textAlign:"center" }}>{name}</span>
              </div>
            </a>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:"1/-1",textAlign:"center",color:"rgba(255,255,255,0.40)",fontStyle:"italic",padding:40 }}>No tools found.</div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Prompts (Zae Labs) ───────────────────────────────────────────────────────
// ─── Wokwi Projects (image + code modal) ──────────────────────────────────────
// GANTI konten di bawah ini dengan project Wokwi kamu yang asli:
// - image: link gambar rasio 16:9 (screenshot circuit / hasil simulasi kamu)
// - code: isi kode Arduino/C++ dari project wokwi.com kamu
const WOKWI_PROJECTS = [
  {
    Icon: Code2,
    title: "Birthday Greetings Using Arduino",
    desc: "A creative Arduino project to display or play custom birthday greetings.",
    pill: "Get Code",
    image: "/HBD.jpg",
    code: `//code by ZaeLabs

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
#define NOTE_B0  31
#define NOTE_C1  33
#define NOTE_CS1 35
#define NOTE_D1  37
#define NOTE_DS1 39
#define NOTE_E1  41
#define NOTE_F1  44
#define NOTE_FS1 46
#define NOTE_G1  49
#define NOTE_GS1 52
#define NOTE_A1  55
#define NOTE_AS1 58
#define NOTE_B1  62
#define NOTE_C2  65
#define NOTE_CS2 69
#define NOTE_D2  73
#define NOTE_DS2 78
#define NOTE_E2  82
#define NOTE_F2  87
#define NOTE_FS2 93
#define NOTE_G2  98
#define NOTE_GS2 104
#define NOTE_A2  110
#define NOTE_AS2 117
#define NOTE_B2  123
#define NOTE_C3  131
#define NOTE_CS3 139
#define NOTE_D3  147
#define NOTE_DS3 156
#define NOTE_E3  165
#define NOTE_F3  175
#define NOTE_FS3 185
#define NOTE_G3  196
#define NOTE_GS3 208
#define NOTE_A3  220
#define NOTE_AS3 233
#define NOTE_B3  247
#define NOTE_C4  262
#define NOTE_CS4 277
#define NOTE_D4  294
#define NOTE_DS4 311
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_FS4 370
#define NOTE_G4  392
#define NOTE_GS4 415
#define NOTE_A4  440
#define NOTE_AS4 466
#define NOTE_B4  494
#define NOTE_C5  523
#define NOTE_CS5 554
#define NOTE_D5  587
#define NOTE_DS5 622
#define NOTE_E5  659
#define NOTE_F5  698
#define NOTE_FS5 740
#define NOTE_G5  784
#define NOTE_GS5 831
#define NOTE_A5  880
#define NOTE_AS5 932
#define NOTE_B5  988
#define NOTE_C6  1047
#define NOTE_CS6 1109
#define NOTE_D6  1175
#define NOTE_DS6 1245
#define NOTE_E6  1319
#define NOTE_F6  1397
#define NOTE_FS6 1480
#define NOTE_G6  1568
#define NOTE_GS6 1661
#define NOTE_A6  1760
#define NOTE_AS6 1865
#define NOTE_B6  1976
#define NOTE_C7  2093
#define NOTE_CS7 2217
#define NOTE_D7  2349
#define NOTE_DS7 2489
#define NOTE_E7  2637
#define NOTE_F7  2794
#define NOTE_FS7 2960
#define NOTE_G7  3136
#define NOTE_GS7 3322
#define NOTE_A7  3520
#define NOTE_AS7 3729
#define NOTE_B7  3951
#define NOTE_C8  4186
#define NOTE_CS8 4435
#define NOTE_D8  4699
#define NOTE_DS8 4978
#define REST      0

int ledPin = A2;

int tempo = 250;

int buzzer = A3;

int melody[] = {

  // Happy Birthday Note

  NOTE_C4, 4, NOTE_C4, 8,
  NOTE_D4, -4, NOTE_C4, -4, NOTE_F4, -4,
  NOTE_E4, -2, NOTE_C4, 4, NOTE_C4, 8,
  NOTE_D4, -4, NOTE_C4, -4, NOTE_G4, -4,
  NOTE_F4, -2, NOTE_C4, 4, NOTE_C4, 8,

  NOTE_C5, -4, NOTE_A4, -4, NOTE_F4, -4,
  NOTE_E4, -4, NOTE_D4, -4, NOTE_AS4, 4, NOTE_AS4, 8,
  NOTE_A4, -4, NOTE_F4, -4, NOTE_G4, -4,
  NOTE_F4, -2,

  NOTE_C4, 4, NOTE_C4, 8,
  NOTE_D4, -4, NOTE_C4, -4, NOTE_F4, -4,
  NOTE_E4, -2, NOTE_C4, 4, NOTE_C4, 8,
  NOTE_D4, -4, NOTE_C4, -4, NOTE_G4, -4,
  NOTE_F4, -2, NOTE_C4, 4, NOTE_C4, 8,

  NOTE_C5, -4, NOTE_A4, -4, NOTE_F4, -4,
  NOTE_E4, -4, NOTE_D4, -4, NOTE_AS4, 4, NOTE_AS4, 8,
  NOTE_A4, -4, NOTE_F4, -4, NOTE_G4, -4,
  NOTE_F4, -2,

};

int notes = sizeof(melody) / sizeof(melody[0]) / 2;

int wholenote = (60000 * 4) / tempo;

int divider = 0, noteDuration = 0;

void setup() {

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Happy Birthday !");
  lcd.setCursor(0, 1);
  lcd.print("Pricilia BB");

  for (int thisNote = 0; thisNote < notes * 2; thisNote = thisNote + 2) {

    divider = melody[thisNote + 1];
    if (divider > 0) {
      noteDuration = (wholenote) / divider;
    } else if (divider < 0) {
      noteDuration = (wholenote) / abs(divider);
      noteDuration *= 1.5;
    }

    tone(buzzer, melody[thisNote], noteDuration * 0.9);

    delay(noteDuration);

    noTone(buzzer);

    pinMode(ledPin, OUTPUT);

    digitalWrite(ledPin, HIGH); 
    delay(noteDuration);          
    digitalWrite(ledPin, LOW);   
  }
}

void loop() {

}`,
  },
  {
    Icon: Code2,
    title: "Measuring Distance Using Ultrasonic Sensor",
    desc: "Learn how to accurately measure distance and detect objects using the HC-SR04 ultrasonic sensor with Arduino.",
    pill: "Get Code",
    image: "/Distance.png",
    code: `//code by ZaeLabs

#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);
const int greenLed = 5;
const int yellowLed = 6;
const int redLed = 7;
const float soundSpeed = 0.0342;

long getDistance(int trigPin, int echoPin) {
  pinMode(trigPin, OUTPUT);
  digitalWrite(trigPin, LOW);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  pinMode(echoPin, INPUT);
  return pulseIn(echoPin, HIGH);
}

void turnOnGreenLed() {
  digitalWrite(greenLed, HIGH);
  digitalWrite(yellowLed, LOW);
  digitalWrite(redLed, LOW);
}

void turnOnYellowLed() {
  digitalWrite(greenLed, LOW);
  digitalWrite(yellowLed, HIGH);
  digitalWrite(redLed, LOW);
}

void turnOnRedLed() {
  digitalWrite(greenLed, LOW);
  digitalWrite(yellowLed, LOW);
  digitalWrite(redLed, HIGH);
}

void setup() {
  pinMode(greenLed, OUTPUT);
  pinMode(yellowLed, OUTPUT);
  pinMode(redLed, OUTPUT);
  lcd.init();
  lcd.begin(16, 2);
  lcd.backlight();
  Serial.begin(9600);
  Serial.println("Suprapto - TI721378");
}

void loop() {
  // Mengukur jarak menggunakan sensor ultrasonik
  int distance = round((getDistance(9, 10) * soundSpeed) / 2);

  // Menampilkan jarak di Serial Monitor
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  // Menampilkan jarak di LCD I2C
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Distance: ");
  lcd.print(distance);
  lcd.print(" cm");

  // Mengatur LED berdasarkan jarak
  if (distance > 15) {
    turnOnGreenLed();
  } else if (distance >= 5 && distance <= 15) {
    turnOnYellowLed();
  } else {
    turnOnRedLed();
  }
  delay(250);
}`,
  },
  {
    Icon: Code2,
    title: "Traffic Light With Push Button",
    desc: "Build an interactive traffic light system with a pedestrian crosswalk button using Arduino.",
    pill: "Get Code",
    image: "/Traffict.png",
    code: `//code by ZaeLabs

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

String oled_last = ""; 

int sinal_pedestre[2] = { A1, A0 };     
int sinal_carros[3]   = { A2, A3, A4 }; 

byte botao = 7;

unsigned long t_0;
unsigned long t_1;
unsigned int safe_time;
unsigned int min_green = 4000; 
unsigned int total_green = 8000; 

int disp[10][8] = {
  { 0, 1, 1, 1, 1, 1, 1, 0 }, 
  { 0, 1, 0, 0, 1, 0, 0, 0 }, 
  { 0, 0, 1, 1, 1, 1, 0, 1 }, 
  { 0, 1, 1, 0, 1, 1, 0, 1 }, 
  { 0, 1, 0, 0, 1, 0, 1, 1 }, 
  { 0, 1, 1, 0, 0, 1, 1, 1 }, 
  { 0, 1, 1, 1, 0, 1, 1, 1 }, 
  { 0, 1, 0, 0, 1, 1, 0, 0 }, 
  { 0, 1, 1, 1, 1, 1, 1, 1 }, 
  { 0, 1, 1, 0, 1, 1, 1, 1 }  
};

void setup() {
  for (int i = 2; i < 9; i++) pinMode(i, OUTPUT);
  for (int i = A0; i <= A4; i++) pinMode(i, OUTPUT);

  pinMode(botao, INPUT_PULLUP);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    while (1); 
  }
  display.clearDisplay();
  display.display();

  t_0 = millis();
}

void loop() {
  number_display(5);
  oled_message("STOP");

  digitalWrite(sinal_carros[2], HIGH);
  digitalWrite(sinal_pedestre[0], HIGH);

  t_0 = millis();
  bool requested = false;

  while (true) {
    if (digitalRead(botao) == LOW) {
      delay(30); 
      if (digitalRead(botao) == LOW) requested = true;
    }

    t_1 = millis();

    if (requested && (t_1 - t_0) >= min_green) break;
  }

  safe_time = t_1 - t_0;
  if (safe_time > total_green) safe_time = total_green;

  delay(total_green - safe_time);

  digitalWrite(sinal_carros[2], LOW);
  digitalWrite(sinal_carros[1], HIGH);
  oled_message("SIAP-SIAP");
  delay(2500);

  digitalWrite(sinal_carros[1], LOW);
  digitalWrite(sinal_carros[0], HIGH);
  digitalWrite(sinal_pedestre[0], LOW);
  digitalWrite(sinal_pedestre[1], HIGH);
  oled_message("JALAN");

  unsigned long walk_start = millis();
  while (millis() - walk_start < 5000) {
    idle_display();
  }

  for (int k = 9; k > 0; k--) {
    number_display(k);
    oled_message("STOP " + String(k));
    delay(1000);
  }

  digitalWrite(sinal_carros[0], LOW);
  digitalWrite(sinal_pedestre[1], LOW);
  clear_number_display();
}

void number_display(int m) {
  for (int j = 2; j < 9; j++) {
    digitalWrite(j, disp[m][j - 1]);
  }
}

void clear_number_display() {
  for (int i = 2; i < 9; i++) {
    digitalWrite(i, 0);
  }
}

void idle_display() {
  clear_number_display();
  digitalWrite(3, 1);
  delay(150);
  digitalWrite(3, 0);
  digitalWrite(8, 1);
  delay(150);
  digitalWrite(8, 0);
  digitalWrite(6, 1);
  delay(150);
  digitalWrite(6, 0);
  delay(150);
}

void oled_message(String msg) {
  if (msg == oled_last) return;
  oled_last = msg;
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 20);
  display.println(msg);
  display.display();
}
`,
  },
  {
    Icon: Code2,
    title: "Earthquake Detection Using ESP32",
    desc: "Create a smart IoT earthquake detector with ESP32 that monitors seismic vibrations and sends real-time alerts.",
    pill: "Get Code",
    image: "Earthquake.png",
    code: `//code by ZaeLabs

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

Adafruit_MPU6050 mpu;

float Scala_richter = 0;

#define THINGER_SERIAL_DEBUG

#include <ThingerESP32.h>

#define USERNAME "ZaeLabs"
#define DEVICE_ID "Earthquake"
#define DEVICE_CREDENTIAL "xxxxxxxxxxx"

#define SSID "Wokwi-GUEST"
#define SSID_PASSWORD "xxxxxxxxxxx"

ThingerESP32 thing(USERNAME, DEVICE_ID, DEVICE_CREDENTIAL);


void setup(void) {
  Serial.begin(115200);
  pinMode(19, OUTPUT);
  pinMode(18, OUTPUT);
  pinMode(5, OUTPUT);
  while (!mpu.begin()) {
    Serial.println("MPU6050 not connected!");
    delay(1000);
  }
  Serial.println("MPU6050 ready!");
  thing.add_wifi(SSID, SSID_PASSWORD);
}

sensors_event_t event;

void loop() {
  thing["valueSR"] >> outputValue(ScalaRichter());

  beeb();
  thing.handle();
}

float ScalaRichter(){
  mpu.getAccelerometerSensor()->getEvent(&event);
  float yKuadrat = event.acceleration.y * event.acceleration.y; 
  float xKuadrat = event.acceleration.x * event.acceleration.x;
  Scala_richter = sqrt(yKuadrat + xKuadrat);

  return Scala_richter;
}

void beeb(){
  float valueSR = ScalaRichter();
  Serial.print(valueSR);
  Serial.println(" Magnitude");
  if(event.acceleration.y >= 0 && event.acceleration.x >= 0){
    if(valueSR <= 0){
      tone(26, 0);
    }else if(valueSR > 0 && valueSR <= 3){
      tone(26, 500);
      digitalWrite(19, HIGH);
      delay(1000);
      noTone(26);
      digitalWrite(19, LOW);
      delay(1000);
    }else if(valueSR > 3 && valueSR <= 4.5){
      tone(26, 500);
      digitalWrite(18, HIGH);
      delay(500);
      noTone(26);
      digitalWrite(18, LOW);
      delay(500);
    }else if(valueSR > 4.5 && valueSR <= 6){
      tone(26, 500);
      digitalWrite(18, HIGH);
      delay(250);
      noTone(26);
      digitalWrite(18, LOW);
      delay(250);
    }else if(valueSR > 6){
      tone(26, 500);
      digitalWrite(5, HIGH);
      delay(100);
      noTone(26);
      digitalWrite(5, LOW);
      delay(100);
    }
  }else{
    tone(26, 0);
  }
}`,
  },
];

// ─── Bottom-sheet Modal (slides up from bottom) ───────────────────────────────
function BottomSheetModal({ open, onClose, children }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  if (!mounted) return null;

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000,
      display:"flex", alignItems:"flex-end", justifyContent:"center",
    }}>
      <div onClick={onClose} style={{
        position:"absolute", inset:0, background:"rgba(0,0,0,0.7)",
        backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)",
        opacity: visible ? 1 : 0, transition:"opacity 0.4s ease",
      }} />
      <div style={{
        position:"relative", width:"100%", maxWidth:820, maxHeight:"88vh",
        overflowY:"auto",
        background:"rgba(15,15,15,0.92)", backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)",
        border:"1px solid rgba(255,255,255,0.12)", borderBottom:"none",
        borderRadius:"28px 28px 0 0",
        padding:"20px 24px 32px",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition:"transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        boxShadow:"0 -20px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ width:40,height:4,borderRadius:9999,background:"rgba(255,255,255,0.20)",margin:"0 auto 16px" }} />
        <button onClick={onClose} aria-label="Close"
          style={{ position:"absolute", top:16, right:16, width:32, height:32, borderRadius:"50%",
            background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff",
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <X size={16}/>
        </button>
        {children}
      </div>
    </div>
  );
}

function WokwiCard({ Icon, title, desc, pill, image, code }) {
  const [h, setH] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <>
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        onClick={() => setImageOpen(true)}
        className="glass-panel"
        style={{ borderRadius:32,border:h?"1px solid rgba(232,112,42,0.40)":"1px solid rgba(255,255,255,0.18)",background:h?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.07)",padding:24,backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",boxShadow:h?"0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.20)":"0 4px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.12)",transition:"all 0.3s",transform:h?"translateY(-4px)":"translateY(0)",cursor:"pointer" }}>
        <div style={{ width:44,height:44,borderRadius:"50%",background:"rgba(232,112,42,0.15)",color:"#e8702a",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24 }}><Icon size={20}/></div>
        <p style={{ fontSize:17,fontWeight:600,letterSpacing:"-0.03em" }}>{title}</p>
        <p style={{ fontSize:14,color:"rgba(255,255,255,0.60)",lineHeight:1.6,marginTop:12 }}>{desc}</p>
        <span
          onClick={(e) => { e.stopPropagation(); setCodeOpen(true); }}
          style={{ display:"inline-flex",alignItems:"center",gap:6,marginTop:24,fontSize:12,color:"rgba(255,255,255,0.70)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:9999,padding:"4px 12px",cursor:"pointer",transition:"all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(232,112,42,0.15)"; e.currentTarget.style.borderColor="rgba(232,112,42,0.40)"; e.currentTarget.style.color="#e8702a"; }}
          onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; e.currentTarget.style.color="rgba(255,255,255,0.70)"; }}
        ><Code2 size={11}/> {pill}</span>
      </div>

      {/* Image modal — 16:9 */}
      <BottomSheetModal open={imageOpen} onClose={() => setImageOpen(false)}>
        <h3 style={{ fontSize:20,fontWeight:600,marginBottom:16,paddingRight:36 }}>{title}</h3>
        <div style={{ width:"100%",aspectRatio:"16/9",borderRadius:16,overflow:"hidden",border:"1px solid rgba(255,255,255,0.10)",background:"#000" }}>
          <img src={image} alt={title} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
        </div>
        <p style={{ fontSize:14,color:"rgba(255,255,255,0.60)",lineHeight:1.6,marginTop:16 }}>{desc}</p>
      </BottomSheetModal>

      {/* Code modal */}
      <BottomSheetModal open={codeOpen} onClose={() => setCodeOpen(false)}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingRight:36 }}>
          <div style={{ width:32,height:32,borderRadius:"50%",background:"rgba(232,112,42,0.15)",color:"#e8702a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Cpu size={15}/></div>
          <h3 style={{ fontSize:18,fontWeight:600 }}>{title} — Wokwi Code</h3>
        </div>
        <div style={{ position:"relative" }}>
          <button onClick={handleCopy}
            style={{ position:"absolute",top:10,right:10,display:"flex",alignItems:"center",gap:6,fontSize:12,padding:"6px 12px",borderRadius:8,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",cursor:"pointer" }}>
            {copied ? <Check size={13}/> : <Copy size={13}/>} {copied ? "Copied" : "Copy"}
          </button>
          <pre style={{ margin:0,padding:"20px 16px",borderRadius:16,background:"rgba(0,0,0,0.45)",border:"1px solid rgba(255,255,255,0.10)",overflowX:"auto",fontSize:13,lineHeight:1.6,color:"rgba(255,255,255,0.85)",fontFamily:"'SFMono-Regular',Consolas,monospace" }}>
            <code>{code}</code>
          </pre>
        </div>
      </BottomSheetModal>
    </>
  );
}

function PromptsSection() {
  return (
    <section id="prompts" className="section-pad" style={{ position:"relative",background:"#050505",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",bottom:"-8%",right:"-4%",opacity:0.7 }}>
        <ScrollSpin size={240} reverse variant="orbit" />
      </div>
      <div style={{ maxWidth:1152,margin:"0 auto" }}>
        <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:16 }}>Wokwi Projects</p>
        <h2 style={{ fontSize:"clamp(32px,5vw,58px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:1,maxWidth:680,marginBottom:16 }}>Circuits & code built on Wokwi.</h2>
        <p style={{ color:"rgba(255,255,255,0.60)",fontSize:15,lineHeight:1.65,maxWidth:520,marginBottom:48 }}>Embedded systems experiments — simulations, sensors, and automation logic, simulated and tested on wokwi.com.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:16 }}>
          {WOKWI_PROJECTS.map(c => <WokwiCard key={c.title} {...c}/>)}
        </div>
      </div>
    </section>
  );
}

// ─── ChatGPT Prompt Library ────────────────────────────────────────────────────
// GANTI konten "prompt" di bawah ini dengan prompt ChatGPT asli yang kamu buat.
const CHATGPT_PROMPTS = [
  {
    Icon: Code2,
    title: "Web Prompts",
    desc: 'This prompt specifies a dark, cinematic landing page for a creative studio called "Prisma," built with React + Vite + TypeScript + Tailwind CSS. It has three sections — a full-screen video Hero with animated giant title text, an About section with scroll-linked text reveal, and a Features section with four animated cards (one video, three checklist-style) — all styled with a warm cream-on-black color palette, custom Google Fonts, noise-texture overlays, and framer-motion animations throughout.',
    pill: "Get Prompt",
    prompt: `Create a React + Vite + TypeScript + Tailwind CSS landing page for a creative studio called "Prisma". The page has 3 sections: Hero, About, and Features. Use framer-motion for animations and lucide-react for icons. The design is dark, moody, and cinematic with a warm cream color palette.

FONTS

Load two Google Fonts in index.html:

Almarai (weights: 300, 400, 700, 800) -- used as the global default font
Instrument Serif (italic only) -- used for italic accent text in the About section
In index.css, set the global font family:


* { font-family: 'Almarai', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
In tailwind.config.js, extend:

colors.primary: #DEDBC8 (warm cream, used for all primary text and accents)
fontFamily.serif: ['"Instrument Serif"', 'serif']
COLOR SYSTEM

Background: black (#000000) globally, #101010 for the About card, #212121 for Features cards
Primary text color: #E1E0CC (applied via inline style, slightly different from Tailwind primary)
Tailwind primary: #DEDBC8 (used for utility classes like text-primary, text-primary/70)
Gray text: text-gray-400, text-gray-500
Navbar link color: rgba(225, 224, 204, 0.8) with hover: #E1E0CC
CUSTOM CSS UTILITIES (index.css)

Two SVG noise texture utilities:

.noise-overlay: fractal noise (baseFrequency: 0.85, numOctaves: 3) used as overlay on hero video
.bg-noise: fractal noise (baseFrequency: 0.9, numOctaves: 4) used as subtle background in Features section
Both use inline SVG data URIs with feTurbulence filter.

SECTION 1: HERO

Full viewport height (h-screen). The entire section has p-4 md:p-6 padding creating an inset effect. Inside is a container with rounded-2xl md:rounded-[2rem] and overflow-hidden.

Background video:

URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4
autoPlay loop muted playsInline, object-cover, fills entire container
Noise overlay on top: .noise-overlay with opacity-[0.7] mix-blend-overlay pointer-events-none
Gradient overlay: bg-gradient-to-b from-black/30 via-transparent to-black/60
Navbar:

Absolutely positioned at top center
Black background pill that hangs from top edge: bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8
5 nav items: "Our story", "Collective", "Workshops", "Programs", "Inquiries"
Text size: text-[10px] sm:text-xs md:text-sm
Gap between items: gap-3 sm:gap-6 md:gap-12 lg:gap-14
Link color: rgba(225, 224, 204, 0.8), hover: #E1E0CC (inline styles)
Hero Content (bottom-aligned):

Absolutely positioned at bottom: absolute bottom-0 left-0 right-0
12-column grid: left 8 columns for heading, right 4 columns for text + button
Giant heading "Prisma" using WordsPullUp component:
Responsive sizes: text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]
font-medium leading-[0.85] tracking-[-0.07em]
Color: #E1E0CC
Has a superscript asterisk (*) on the final "a" of "Prisma": positioned with absolute top-[0.65em] -right-[0.3em] text-[0.31em]
Pull-up animation: each word slides up from y:20 with staggered delay of 0.08s, triggered by useInView
Description paragraph (right column):
"Prisma is a worldwide network of visual artists, filmmakers and storytellers bound not by place, status or labels but by passion and hunger to unlock potential through our unique perspectives."
text-primary/70 text-xs sm:text-sm md:text-base, line-height: 1.2
Framer motion: fade up from y:20, delay 0.5s, custom ease [0.16, 1, 0.3, 1]
CTA Button "Join the lab":
Pill shape: bg-primary rounded-full
Black text, font-medium, text-sm sm:text-base
Right side has a black circle (bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10) containing a white/cream ArrowRight icon
Hover: gap increases (hover:gap-3), circle scales up (group-hover:scale-110)
Framer motion: fade up from y:20, delay 0.7s, same custom ease
SECTION 2: ABOUT

bg-black, padded section with centered content
Inner card: bg-[#101010], centered text, max-w-6xl
Top: small label "Visual arts" in text-primary, text-[10px] sm:text-xs
Main heading uses WordsPullUpMultiStyle component with 3 segments:
"I am Marcus Chen," -- font-normal (Almarai)
"a self-taught director." -- italic font-serif (Instrument Serif italic)
"I have skills in color grading, visual effects, and narrative design." -- font-normal
Container: text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9]
Each word animates in with pull-up effect (y:20 to y:0), staggered at 0.08s delay
Body paragraph below with scroll-linked character opacity animation:
Text: "Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals."
text-[#DEDBC8], text-xs sm:text-sm md:text-base
Each character is individually wrapped in an AnimatedLetter component
Uses useScroll with target offset ['start 0.8', 'end 0.2']
Each character's opacity transitions from 0.2 to 1 based on scroll position, creating a progressive text reveal effect
Character staggering: charProgress = index / totalChars, range [charProgress - 0.1, charProgress + 0.05]
SECTION 3: FEATURES

min-h-screen bg-black, with subtle .bg-noise overlay at opacity-[0.15]
Header text uses WordsPullUpMultiStyle:
Line 1: "Studio-grade workflows for visionary creators." in cream
Line 2: "Built for pure vision. Powered by art." in text-gray-500
Both: text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal
4-column card grid (lg:h-[480px], gap-3 sm:gap-2 md:gap-1):

Each card has staggered entrance animation: scale from 0.95 + fade in, triggered by useInView (once, margin "-100px"), staggered at 0.15s intervals with ease [0.22, 1, 0.36, 1].

Card 1 - Video card: Full video background (URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4), autoPlay loop muted playsInline, object-cover. Bottom text: "Your creative canvas." in #E1E0CC.

Card 2 - "Project Storyboard." (01): bg-[#212121], small image icon at top (https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85, 10x10 sm:12x12 rounded), title with number, 4 checklist items with green Check icons, "Learn more" link with rotated arrow (-45deg).

Card 3 - "Smart Critiques." (02): Same layout as Card 2. Icon: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85. 3 checklist items about AI analysis, creative notes, tool integrations.

Card 4 - "Immersion Capsule." (03): Same layout. Icon: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85. 3 checklist items about notification silencing, ambient soundscapes, schedule syncing.

All feature card checklist items use Check icon from lucide-react in text-primary color, with text-gray-400 description text. "Learn more" buttons use ArrowRight rotated -45deg.

SHARED ANIMATION COMPONENTS

WordsPullUp: Splits text by spaces, each word is a motion.span that slides up (y:20 to 0) with staggered delay. Uses useInView (once: true). Supports showAsterisk prop that adds a superscript * after the last character "a" of the final word.

WordsPullUpMultiStyle: Takes an array of {text, className} segments, splits all into individual words preserving per-word className. Same pull-up animation. Words are wrapped in inline-flex flex-wrap justify-center.

RESPONSIVE BREAKPOINTS

The page is fully responsive across mobile, tablet, and desktop. Cards in Features switch from 1-col (mobile) to 2-col (md) to 4-col (lg). Hero text scales from 26vw down to 19vw. Navbar items compress with smaller gaps on mobile. All padding, font sizes, and spacing use Tailwind responsive prefixes (sm/md/lg/xl/2xl).

TECH STACK

Vite + React 18 + TypeScript
Tailwind CSS 3
framer-motion (for all animations: pull-up text, fade-in, scroll-linked opacity, card entrances)
lucide-react (ArrowRight, Check icons)`,
  },
  {
    Icon: Code2,
    title: "Web Prompts",
    desc: 'This is a spec for a full-screen dark hero section (deep blue-purple background) with a looping fade-in/fade-out background video controlled via requestAnimationFrame, a navbar with dropdown nav items and a "Sign Up" button, a huge "Power AI" headline (with "AI" in an indigo-purple-amber gradient), a subtitle and "Schedule a Consult" CTA, and an infinite-scrolling logo marquee at the bottom showcasing brand names with liquid-glass icon styling.',
    pill: "Get Prompt",
    prompt: `Create a full-screen dark hero section with a looping background video, navbar, headline, subtitle, CTA button, and a logo marquee at the bottom. Here are the exact specifications:

Theme & Colors (index.css CSS variables):
Background: 260 87% 3% (deep dark blue-purple)
Foreground: 40 6% 95% (off-white)
Hero sub text: 40 6% 82%
Body font: Geist Sans (via @fontsource/geist-sans)
Headline font: General Sans (loaded from Fontshare: https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap)

Background Video (Index page wrapper):
Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4
Positioned absolute inset-0 w-full h-full object-cover behind all content
Starts with opacity: 0
Custom JS-controlled fade loop: 0.5s fade-in at start, 0.5s fade-out at end, using requestAnimationFrame. On ended, opacity resets to 0, waits 100ms, then replays from 0
No gradient overlays on the video
The wrapper div has overflow-hidden, the hero content sits in a relative z-10 div above

Blurred overlay shape (centered behind content):
w-[984px] h-[527px] opacity-90 bg-gray-950 blur-[82px]
Absolutely positioned at top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
pointer-events-none
The hero section has overflow-visible so the blur is not clipped

Navbar:
Full width, py-5 px-8, flex row with justify-between
Left: logo image (src/assets/logo.png, height 32px)
Center: nav items — "Features" (with ChevronDown), "Solutions", "Plans", "Learning" (with ChevronDown). Each is a button with text-foreground/90 and hover transition
Right: "Sign Up" button using heroSecondary variant, rounded-full px-4 py-2
Below navbar: a 1px divider line with gradient from-transparent via-foreground/20 to-transparent, offset mt-[3px]

Hero content (vertically centered in remaining space via flex-1):
Headline: "Power AI" at text-[220px], font-normal, leading-[1.02], tracking-[-0.024em], font-family General Sans
"Power " is plain text-foreground
"AI" uses bg-clip-text text-transparent with backgroundImage: linear-gradient(to left, #6366f1, #a855f7, #fcd34d) (indigo → purple → amber)
Subtitle: "The most powerful AI ever deployed / in talent acquisition" — text-hero-sub, text-lg, leading-8, max-w-md, mt-[9px], opacity-80
CTA: "Schedule a Consult" button, heroSecondary variant, px-[29px] py-[24px], mt-[25px]

Logo marquee (pinned to bottom of hero, pb-10):
Container: max-w-5xl mx-auto
Left side: static text "Relied on by brands / across the globe" in text-foreground/50 text-sm
Right side: infinite scrolling marquee with logos: Vortex, Nimbus, Prysma, Cirrus, Kynder, Halcyn (duplicated for seamless loop)
Each logo: a liquid-glass 24x24 rounded-lg icon showing the first letter, plus the name in text-base font-semibold text-foreground
Marquee animation: translateX(0%) → translateX(-50%), 20s linear infinite
gap-16 between logos, gap-12 between text and marquee

Liquid glass utility class (in index.css):
.liquid-glass { background: rgba(255, 255, 255, 0.01); background-blend-mode: luminosity; backdrop-filter: blur(4px); border: none; box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1); position: relative; overflow: hidden; }
.liquid-glass::before { content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1.4px; background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }

Section structure: min-h-screen flex flex-col — navbar at top, content centered via flex-1 flex items-center justify-center, marquee at bottom.`,
  },
  {
    Icon: Code2,
    title: "Liquid Glass",
    desc: 'This is a task spec for integrating a pre-built "Liquid Glass" React component (a macOS-style frosted-glass dock/button UI with an SVG distortion filter) into an existing shadcn/Tailwind/TypeScript codebase. It includes the full component code, setup instructions to verify or install shadcn/Tailwind/TypeScript if missing, the exact file paths to copy the code into, required CSS keyframes to add, and a checklist for installing dependencies, sourcing image assets, and using lucide-react icons.',
    pill: "Get Prompt",
    prompt: `You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
\`\`\`tsx
liquid-glass.tsx
"use client";

import React from "react";

// Types
interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
}

interface DockIcon {
  src: string;
  alt: string;
  onClick?: () => void;
}

// Glass Effect Wrapper Component
const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
}) => {
  const glassStyle = {
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  const content = (
    <div
      className={\`relative flex font-semibold overflow-hidden text-black cursor-pointer transition-all duration-700 \${className}\`}
      style={glassStyle}
    >
      {/* Glass Layers */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-inherit rounded-3xl"
        style={{
          backdropFilter: "blur(3px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <div
        className="absolute inset-0 z-10 rounded-inherit"
        style={{ background: "rgba(255, 255, 255, 0.25)" }}
      />
      <div
        className="absolute inset-0 z-20 rounded-inherit rounded-3xl overflow-hidden"
        style={{
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)",
        }}
      />

      {/* Content */}
      <div className="relative z-30">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
};

// Dock Component
const GlassDock: React.FC<{ icons: DockIcon[]; href?: string }> = ({
  icons,
  href,
}) => (
  <GlassEffect
    href={href}
    className="rounded-3xl p-3 hover:p-4 hover:rounded-4xl"
  >
    <div className="flex items-center justify-center gap-2 rounded-3xl p-3 py-0 px-0.5 overflow-hidden">
      {icons.map((icon, index) => (
        <img
          key={index}
          src={icon.src}
          alt={icon.alt}
          className="w-16 h-16 transition-all duration-700 hover:scale-110 cursor-pointer"
          style={{
            transformOrigin: "center center",
            transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
          }}
          onClick={icon.onClick}
        />
      ))}
    </div>
  </GlassEffect>
);

// Button Component
const GlassButton: React.FC<{ children: React.ReactNode; href?: string }> = ({
  children,
  href,
}) => (
  <GlassEffect
    href={href}
    className="rounded-3xl px-10 py-6 hover:px-11 hover:py-7 hover:rounded-4xl overflow-hidden"
  >
    <div
      className="transition-all duration-700 hover:scale-95"
      style={{
        transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
      }}
    >
      {children}
    </div>
  </GlassEffect>
);

// SVG Filter Component
const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="200"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);
// Main Component
export const Component = () => {
  const dockIcons: DockIcon[] = [
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/a13d1acfd046f503f987c1c95af582c8_low_res_Claude.png",
      alt: "Claude",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png",
      alt: "Finder",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/c2c4a538c2d42a8dc0927d7d6530d125_low_res_ChatGPT___Liquid_Glass__Default_.png",
      alt: "Chatgpt",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/6d26d432bd65c522b0708185c0768ec3_low_res_Maps.png",
      alt: "Maps",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/7c59c945731aecf4f91eb8c2c5f867ce_low_res_Safari.png",
      alt: "Safari",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/b7f24edc7183f63dbe34c1943bef2967_low_res_Steam___Liquid_Glass__Default_.png",
      alt: "Steam",
    },
  ];

  return (
    <div
      className="min-h-screen h-full flex items-center justify-center font-light relative overflow-hidden w-full"
      style={{
        background: \`url("https://images.unsplash.com/photo-1432251407527-504a6b4174a2?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") center center\`,
        animation: "moveBackground 60s linear infinite",
      }}
    >
      <GlassFilter />

      <div className="flex flex-col gap-6 items-center justify-center w-full">
        <GlassDock icons={dockIcons} href="https://x.com/notsurajgaud" />

        <GlassButton href="https://x.com/notsurajgaud">
          <div className="text-xl text-white">
            <p>How can i help you today?</p>
          </div>
        </GlassButton>
      </div>     
    </div>
  );
}



demo.tsx
import { Component } from "@/components/ui/liquid-glass";

const DemoOne = () => {
  return <Component />;
};

export { DemoOne };

\`\`\`

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):
\`\`\`css
@import "tailwindcss";
@import "tw-animate-css";


@keyframes moveBackground {
  from {
    background-position: 0% 0%;
  }
  to {
    background-position: 0% -1000%;
  }
}
\`\`\`

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them`,
  },
];

function PromptLibraryCard({ Icon, title, desc, pill, prompt }) {
  const [h, setH] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <>
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        onClick={() => setOpen(true)}
        className="glass-panel"
        style={{ borderRadius:32,border:h?"1px solid rgba(232,112,42,0.40)":"1px solid rgba(255,255,255,0.18)",background:h?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.07)",padding:24,backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",boxShadow:h?"0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.20)":"0 4px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.12)",transition:"all 0.3s",transform:h?"translateY(-4px)":"translateY(0)",cursor:"pointer" }}>
        <div style={{ width:44,height:44,borderRadius:"50%",background:"rgba(232,112,42,0.15)",color:"#e8702a",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24 }}><Icon size={20}/></div>
        <p style={{ fontSize:17,fontWeight:600,letterSpacing:"-0.03em" }}>{title}</p>
        <p style={{ fontSize:14,color:"rgba(255,255,255,0.60)",lineHeight:1.6,marginTop:12 }}>{desc}</p>
        <span style={{ display:"inline-flex",alignItems:"center",gap:6,marginTop:24,fontSize:12,color:"rgba(255,255,255,0.70)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:9999,padding:"4px 12px" }}>{pill}</span>
      </div>

      <BottomSheetModal open={open} onClose={() => setOpen(false)}>
        <h3 style={{ fontSize:20,fontWeight:600,marginBottom:16,paddingRight:36 }}>{title}</h3>
        <div style={{ position:"relative" }}>
          <button onClick={handleCopy}
            style={{ position:"absolute",top:10,right:10,display:"flex",alignItems:"center",gap:6,fontSize:12,padding:"6px 12px",borderRadius:8,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",cursor:"pointer" }}>
            {copied ? <Check size={13}/> : <Copy size={13}/>} {copied ? "Copied" : "Copy"}
          </button>
          <pre style={{ margin:0,padding:"20px 16px",borderRadius:16,background:"rgba(0,0,0,0.45)",border:"1px solid rgba(255,255,255,0.10)",overflowX:"auto",whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,0.85)",fontFamily:"'SFMono-Regular',Consolas,monospace" }}>
            <code>{prompt}</code>
          </pre>
        </div>
        <p style={{ fontSize:13,color:"rgba(255,255,255,0.50)",lineHeight:1.6,marginTop:14 }}>Copy prompt ini lalu paste ke Claude AI.</p>
      </BottomSheetModal>
    </>
  );
}

function PromptLibrarySection() {
  return (
    <section id="prompt-library" className="section-pad" style={{ position:"relative",background:"#000",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"8%",left:"-5%",opacity:0.7 }}>
        <ScrollSpin size={220} variant="grid" />
      </div>
      <div style={{ maxWidth:1152,margin:"0 auto" }}>
        <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:16 }}>Prompt Library</p>
        <h2 style={{ fontSize:"clamp(32px,5vw,58px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:1,maxWidth:680,marginBottom:16 }}>Ready-to-use prompts for Claude AI.</h2>
        <p style={{ color:"rgba(255,255,255,0.60)",fontSize:15,lineHeight:1.65,maxWidth:520,marginBottom:48 }}>Prompt systems yang aku buat sendiri tinggal copy, paste ke Claude AI, langsung jalan.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:16 }}>
          {CHATGPT_PROMPTS.map(c => <PromptLibraryCard key={c.title} {...c}/>)}
        </div>
      </div>
    </section>
  );
}

// ─── Workflow Section ─────────────────────────────────────────────────────────
const WORKFLOW_STEPS = [
  { n:1, title:"Idea Mapping",    desc:"Turn raw ideas into structured product directions." },
  { n:2, title:"Prompt System",   desc:"Create reusable prompts for consistent AI output." },
  { n:3, title:"Agent Execution", desc:"Use AI agents to research, code, debug, and iterate." },
  { n:4, title:"Web Build",       desc:"Transform the plan into a working interface or application." },
  { n:5, title:"Launch & Improve",desc:"Publish, test, refine, and turn it into content or product." },
];

function WorkflowSection() {
  return (
    <section id="workflow" className="section-pad" style={{ position:"relative",background:"#000",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",bottom:"-6%",left:"-4%",opacity:0.85 }}>
        <ScrollSpin size={260} reverse variant="diamond" />
      </div>
      <div style={{ maxWidth:1152,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:64,alignItems:"center" }}>
        <div>
          <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:20 }}>AI Workflow</p>
          <h2 style={{ fontSize:"clamp(30px,4vw,52px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:0.95,marginBottom:24 }}>
            From prompt to product, not just <span className="font-playfair">pretty</span> answers.
          </h2>
          <p style={{ color:"rgba(255,255,255,0.65)",fontSize:15,lineHeight:1.7,maxWidth:400,marginBottom:32 }}>Zae Labs focuses on using AI as a real execution system: planning the idea, generating the structure, building the interface, and turning the result into publishable digital products.</p>
          <a href="#prompts" style={{ display:"inline-flex",alignItems:"center",gap:8,background:"#e8702a",color:"#fff",fontSize:14,fontWeight:500,padding:"12px 28px",borderRadius:9999,transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background="#d2611f"; e.currentTarget.style.transform="scale(1.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#e8702a"; e.currentTarget.style.transform="scale(1)"; }}>
            Explore Workflow <ArrowRight size={16}/>
          </a>
        </div>
        <div style={{ borderRadius:32,border:"1px solid rgba(255,255,255,0.10)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(12px)",padding:"20px 24px" }}>
          {WORKFLOW_STEPS.map(({ n, title, desc }, i) => (
            <div key={n} style={{ display:"flex",gap:16,padding:"16px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.10)":"none" }}>
              <div style={{ width:36,height:36,borderRadius:"50%",background:"#fff",color:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,flexShrink:0 }}>{n}</div>
              <div>
                <p style={{ fontSize:15,fontWeight:600 }}>{title}</p>
                <p style={{ fontSize:13,color:"rgba(255,255,255,0.55)",marginTop:4,lineHeight:1.55 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Zae AI Widget (text + voice, pakai Web Speech API bawaan browser) ────────
// Status: UI only — belum konek ke otak AI. Begitu API key Gemini siap,
// tinggal isi fungsi getZaeAIReply() di bawah ini (contoh pemanggilan ada
// di komentar dalam fungsinya). Voice input (STT) & voice output (TTS) sudah
// jalan penuh di sisi browser, tidak butuh API key.
const ZAE_LANG = "id-ID";

async function getZaeAIReply(message) {
  const m = message.toLowerCase();

  if (m.includes("jam berapa") || m.includes("waktu sekarang")) {
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    return `Sekarang jam ${now}.`;
  }
  if (m.includes("siapa kamu") || m.includes("kamu siapa")) {
    return "Aku Zae AI, asisten dari Zae Labs. Otak AI-nya belum dipasang, jadi jawabanku masih terbatas dulu.";
  }
  if (m.includes("halo") || m.includes("hai") || m.includes("hei")) {
    return "Halo! Ada yang bisa aku bantu?";
  }
  if (m.includes("terima kasih") || m.includes("makasih")) {
    return "Sama-sama! Panggil aku lagi kalau perlu.";
  }
  return "Otak AI-ku belum tersambung ke Gemini, jadi jawabanku masih terbatas. Setelah API key dipasang, aku bisa jawab lebih pintar.";

  // TODO: ganti bagian di atas dengan pemanggilan Gemini API, contoh:
  //
  // const res = await fetch(
  //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
  //   }
  // );
  // const data = await res.json();
  // return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Maaf, aku belum bisa jawab itu.";
}

function ZaeAIAvatar({ state }) {
  const STATE_COLORS = {
    idle: "#e8702a",
    listening: "#4CFFEA",
    thinking: "#FFB020",
    speaking: "#e8702a",
  };
  const color = STATE_COLORS[state] || "#e8702a";
  return (
    <div className="zae-ai-orb" style={{ position:"relative",width:96,height:96,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:`1.5px dashed ${color}66`,animation: state==="idle" ? "none" : "zaeSpin 3.4s linear infinite" }} />
      <div style={{ position:"absolute",inset:12,borderRadius:"50%",border:`1px solid ${color}99`,animation: state==="idle" ? "zaePulse 2.4s ease-in-out infinite" : "zaeSpinRev 4.2s linear infinite" }} />
      <div style={{
        width: state==="listening" ? 22 : 15, height: state==="listening" ? 22 : 15,
        borderRadius:"50%", background:color, boxShadow:`0 0 22px ${color}`,
        transition:"all .25s cubic-bezier(0.16,1,0.3,1)",
        animation: state==="thinking" ? "zaePulse 0.9s ease-in-out infinite" : "none",
      }} />
    </div>
  );
}

function ZaeAIWidget() {
  const [messages, setMessages] = useState([
    { role:"system", text:"Halo, aku Zae AI. Ketik pesan atau tekan ikon mic buat ngobrol pakai suara." },
  ]);
  const [input, setInput] = useState("");
  const [state, setState] = useState("idle"); // idle | listening | thinking | speaking
  const [voiceOn, setVoiceOn] = useState(true);
  const [micSupported, setMicSupported] = useState(true);
  const [micError, setMicError] = useState("");
  const recognitionRef = useRef(null);
  const logRef = useRef(null);
  const voicesRef = useRef([]);
  const handleSendRef = useRef(() => {});

  // Voice list loads async in most browsers — keep it fresh so we can
  // actually pick a good voice once it's available.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const loadVoices = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) { setMicSupported(false); return; }
    const rec = new SR();
    rec.lang = ZAE_LANG;
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript || "";
      if (text.trim()) handleSendRef.current(text);
    };
    rec.onstart = () => setMicError("");
    rec.onerror = (e) => {
      setState("idle");
      const code = e?.error;
      setMicError(
        code === "not-allowed" || code === "service-not-allowed"
          ? "Akses mic diblokir. Izinkan mic di pengaturan browser dulu ya."
          : code === "no-speech"
          ? "Nggak kedengeran suara. Coba lagi, ngomongnya lebih deket ke mic."
          : code === "audio-capture"
          ? "Mic nggak ketemu di device ini."
          : "Ada gangguan pas dengerin suara, coba tekan mic lagi."
      );
    };
    rec.onend = () => setState((s) => (s === "listening" ? "idle" : s));
    recognitionRef.current = rec;
    return () => { try { rec.stop(); } catch (_) {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  // Picks the most natural-sounding FEMALE Indonesian voice available in
  // the user's browser. Falls back gracefully if nothing matches.
  const pickFemaleIndonesianVoice = () => {
    const voices = voicesRef.current?.length
      ? voicesRef.current
      : (typeof window !== "undefined" && window.speechSynthesis?.getVoices()) || [];
    if (!voices.length) return null;

    const idVoices = voices.filter(v => v.lang?.toLowerCase().startsWith("id"));
    const pool = idVoices.length ? idVoices : voices;

    const femaleHints = ["female", "wanita", "damayanti", "gadis", "putri", "siti"];
    const maleHints = ["male", "pria", "andika"];

    const score = (v) => {
      const n = v.name?.toLowerCase() || "";
      let s = 0;
      if (femaleHints.some(h => n.includes(h))) s += 5;
      if (maleHints.some(h => n.includes(h))) s -= 5;
      if (n.includes("google")) s += 3;      // Google's id-ID voice: natural + female by default
      if (n.includes("neural") || n.includes("online")) s += 2; // cloud/neural voices sound better than compact/local ones
      if (v.localService) s += 1;
      return s;
    };

    return [...pool].sort((a, b) => score(b) - score(a))[0] || null;
  };

  const speak = (text) => {
    if (!voiceOn || typeof window === "undefined" || !window.speechSynthesis) { setState("idle"); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = ZAE_LANG;
    const voice = pickFemaleIndonesianVoice();
    if (voice) utter.voice = voice;
    utter.pitch = 1.05;   // slightly higher, natural female range
    utter.rate = 0.97;    // a touch slower than default = less robotic
    utter.volume = 1;
    utter.onstart = () => setState("speaking");
    utter.onend = () => setState("idle");
    utter.onerror = () => setState("idle");
    window.speechSynthesis.speak(utter);
  };

  const handleSend = async (raw) => {
    const clean = (raw ?? "").trim();
    if (!clean) return;
    setMessages((m) => [...m, { role:"user", text:clean }]);
    setInput("");
    setState("thinking");
    const reply = await getZaeAIReply(clean);
    setMessages((m) => [...m, { role:"assistant", text:reply }]);
    speak(reply);
  };
  // keep the ref pointed at the latest handleSend so the mic's onresult
  // handler (bound once on mount) never calls a stale closure.
  useEffect(() => { handleSendRef.current = handleSend; });

  const toggleMic = async () => {
    if (!micSupported) return;
    if (state === "listening") {
      try { recognitionRef.current?.stop(); } catch (_) {}
      setState("idle");
      return;
    }
    setMicError("");
    window.speechSynthesis?.cancel();
    // Explicitly ask for mic permission first — on some browsers (mobile
    // Chrome especially) SpeechRecognition silently fails to capture audio
    // if this isn't granted up front.
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
      }
    } catch (_) {
      setMicError("Akses mic diblokir. Izinkan mic di pengaturan browser dulu ya.");
      return;
    }
    setState("listening");
    try {
      recognitionRef.current?.start();
    } catch (_) {
      setState("idle");
      setMicError("Mic lagi sibuk, coba tekan lagi.");
    }
  };

  const clearChat = () => setMessages([{ role:"system", text:"Riwayat dibersihkan." }]);

  const stateLabel = { idle:"Siap", listening:"Mendengarkan…", thinking:"Mikir…", speaking:"Ngomong…" }[state];

  return (
    <div className="zae-ai-shell glass-panel" style={{
      borderRadius:24, border:"1px solid rgba(255,255,255,0.12)",
      background:"rgba(255,255,255,0.045)", overflow:"hidden", textAlign:"left",
      maxWidth:600, margin:"0 auto",
    }}>
      <div className="zae-ai-avatar-panel" style={{
        alignItems:"center", justifyContent:"center", gap:10, padding:"26px 14px",
        background:"rgba(232,112,42,0.06)", borderRight:"1px solid rgba(255,255,255,0.08)",
      }}>
        <ZaeAIAvatar state={state} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize:13,fontWeight:600 }}>Zae AI</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,0.5)" }}>{stateLabel}</div>
        </div>
      </div>

      <div style={{ display:"flex",flexDirection:"column",height:360,maxHeight:360,minHeight:0,overflow:"hidden" }}>
        <div ref={logRef} className="zae-ai-scroll" style={{ flex:"1 1 0%",minHeight:0,overflowY:"auto",padding:"18px 18px 8px",display:"flex",flexDirection:"column",gap:9 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role==="user" ? "flex-end" : "flex-start",
              maxWidth:"85%", fontSize:13.5, lineHeight:1.5, padding: msg.role==="system" ? "0" : "9px 13px",
              borderRadius:14,
              background: msg.role==="user" ? "#e8702a" : msg.role==="assistant" ? "rgba(255,255,255,0.08)" : "transparent",
              color: msg.role==="system" ? "rgba(255,255,255,0.4)" : "#fff",
              fontStyle: msg.role==="system" ? "italic" : "normal",
              border: msg.role==="assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="zae-ai-toolbar" style={{ borderTop:"1px solid rgba(255,255,255,0.08)",padding:"10px 12px",display:"flex",alignItems:"center",gap:7 }}>
          <button onClick={toggleMic} disabled={!micSupported}
            title={micSupported ? "Bicara" : "Browser ini belum dukung input suara"}
            style={{
              width:32,height:32,borderRadius:"50%",border:"none",flexShrink:0,
              cursor: micSupported ? "pointer" : "not-allowed",
              background: state==="listening" ? "#e8702a" : "rgba(255,255,255,0.08)",
              color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",
              opacity: micSupported ? 1 : 0.35,
            }}>
            {state==="listening" ? <Mic size={14}/> : <MicOff size={14}/>}
          </button>
          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=>{ if (e.key==="Enter") handleSend(input); }}
            placeholder="Ketik pesan…"
            style={{
              flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.10)",
              borderRadius:9999,padding:"9px 14px",fontSize:16,color:"#fff",outline:"none",minWidth:0,
            }} />
          <button onClick={()=>handleSend(input)} style={{
            width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",flexShrink:0,
            background:"#e8702a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            <Send size={13}/>
          </button>
          <button onClick={()=>setVoiceOn(v=>!v)} title="Suara balasan" style={{
            width:28,height:28,borderRadius:"50%",border:"none",cursor:"pointer",flexShrink:0,background:"transparent",
            color: voiceOn ? "#e8702a" : "rgba(255,255,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            {voiceOn ? <Volume2 size={14}/> : <VolumeX size={14}/>}
          </button>
          <button onClick={clearChat} title="Bersihkan chat" style={{
            width:28,height:28,borderRadius:"50%",border:"none",cursor:"pointer",flexShrink:0,background:"transparent",
            color:"rgba(255,255,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            <Trash2 size={13}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section id="contact" className="section-pad" style={{ background:"#000",color:"#fff",padding:"80px 56px" }}>
      <div style={{ maxWidth:960,margin:"0 auto" }}>
        <div className="cta-inner-box" style={{ position:"relative",overflow:"hidden",borderRadius:40,border:"1px solid rgba(255,255,255,0.10)",background:"rgba(255,255,255,0.05)",padding:"56px",textAlign:"center",backdropFilter:"blur(12px)" }}>
          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:300,background:"radial-gradient(ellipse,rgba(232,112,42,0.18) 0%,transparent 70%)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.35 }}>
            <ScrollSpin size={320} accent="#ffffff" dim={0.5} variant="arc" />
          </div>
          <p style={{ position:"relative",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:20 }}>
            <Sparkles size={13}/> Meet Zae AI
          </p>
          <h2 style={{ position:"relative",fontSize:"clamp(28px,4.4vw,48px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:0.98,marginBottom:18 }}>
            Ngobrol, bukan sekadar <span className="font-playfair">chat.</span>
          </h2>
          <p style={{ position:"relative",color:"rgba(255,255,255,0.65)",fontSize:16,lineHeight:1.65,maxWidth:480,margin:"0 auto 36px" }}>
            Asisten AI dari Zae Labs — ketik atau ngomong langsung, jawabannya bisa didengar juga. Masih tahap awal, otak AI-nya nyusul.
          </p>

          <div style={{ position:"relative",marginBottom:36 }}>
            <ZaeAIWidget />
          </div>

          <div style={{ position:"relative",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"center",gap:12 }}>
            <a href="#prompts" style={{ display:"inline-block",background:"#e8702a",color:"#fff",fontSize:14,fontWeight:500,padding:"12px 28px",borderRadius:9999,transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background="#d2611f"; e.currentTarget.style.transform="scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#e8702a"; e.currentTarget.style.transform="scale(1)"; }}>
              Get Prompts
            </a>
            <a href="https://www.instagram.com/irsyazaelani/" target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-block",background:"#fff",color:"#111",fontSize:14,fontWeight:600,padding:"12px 28px",borderRadius:9999,transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background="#f0f0f0"; e.currentTarget.style.transform="scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.transform="scale(1)"; }}>
              Follow @irsyazaelani
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const navCols = [
    {
      heading:"NAVIGATION",
      links:[
        { label:"About", href:"https://portofolio-iota-one-64.vercel.app/" },
        { label:"Experiments", href:"https://portofolio-iota-one-64.vercel.app/" },
        { label:"Sessions", href:"https://portofolio-iota-one-64.vercel.app/" },
        { label:"Community", href:"https://portofolio-iota-one-64.vercel.app/" },
      ],
    },
    {
      heading:"OTHER PRODUCTS",
      links:[
        { label:"Zae AI", href:"https://zae-ai.vercel.app/" },
        { label:"Zae Cloud", href:"https://portofolio-iota-one-64.vercel.app/" },
        { label:"Zae Research", href:"https://portofolio-iota-one-64.vercel.app/" },
        { label:"Zae DeepMind", href:"https://portofolio-iota-one-64.vercel.app/" },
        { label:"Search Labs", href:"https://portofolio-iota-one-64.vercel.app/" },
      ],
    },
  ];

  const socials = SOCIAL_LINKS;

  return (
    <footer style={{ background:"#000",color:"#fff",padding:"56px 56px 48px",borderTop:"1px solid rgba(255,255,255,0.10)" }}>
      <div style={{ maxWidth:1152,margin:"0 auto" }}>
        <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:40,marginBottom:40 }}>
          {/* Left brand */}
          <div style={{ maxWidth:340 }}>
            <a href="#hero" style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
              <LogoIcon size={24}/>
              <span style={{ color:"#fff",fontSize:19,lineHeight:1,letterSpacing:"-0.02em",display:"flex",alignItems:"baseline",gap:4 }}>
                <span style={{ fontWeight:700,fontFamily:"'Inter',sans-serif" }}>Zae</span>
                <span className="font-playfair" style={{ fontSize:18,opacity:0.85 }}>Labs</span>
              </span>
            </a>
            <p style={{ fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.65,marginBottom:24 }}>
              Stay connected for early access to our newest tools and local events. AI workflows, prompt systems, and web development experiments for modern builders.
            </p>
            {/* Newsletter signup pill */}
            <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
              {socials.map(({ icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  title={label}
                  style={{ width:40,height:40,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.18)",background:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,transition:"all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.50)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(255,255,255,0.18)"; }}>
                  {icon}
                </a>
              ))}
              <a href="https://maszae-bit.github.io/Login-Zae-Group/" target="_blank" rel="noopener noreferrer"
                style={{ height:40,padding:"0 20px",borderRadius:9999,background:"#fff",color:"#000",fontSize:13,fontWeight:600,display:"inline-flex",alignItems:"center",transition:"background 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.background="#e0e0e0"}
                onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                Sign up for newsletter
              </a>
            </div>
          </div>

          {/* Right columns */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:32 }}>
            {navCols.map(({ heading, links }) => (
              <div key={heading}>
                <h4 style={{ fontSize:10,letterSpacing:"1.5px",color:"rgba(255,255,255,0.35)",marginBottom:18,fontWeight:600,textTransform:"uppercase" }}>{heading}</h4>
                <ul style={{ listStyle:"none",display:"flex",flexDirection:"column",gap:13 }}>
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize:13,color:"rgba(255,255,255,0.60)",transition:"color 0.3s" }}
                        onMouseEnter={e => e.currentTarget.style.color="#fff"}
                        onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.60)"}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:24 }}>
          <p style={{ fontSize:12,color:"rgba(255,255,255,0.30)" }}>© 2026 Zae Labs · Irsya Zaelani. Built for creators, students, and builders.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Intro Loader ─────────────────────────────────────────────────────────────
// ─── Intro loader illustration ────────────────────────────────────────────
// Adapted from Uiverse.io by vajion_7943 (floating isometric server/cube),
// converted from raw SVG to JSX (kebab-case attrs -> camelCase, class -> className)
// and resized via width/height props instead of the original CSS `zoom` hack.
function LoaderIllustration({ size = 132 }) {
  const height = Math.round((size * 578) / 477);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 477 578"
      height={height}
      width={size}
    >
      <g filter="url(#loader-filter0-i)">
        <path
          fill="#E9E9E9"
          d="M235.036 304.223C236.949 303.118 240.051 303.118 241.964 304.223L470.072 435.921C473.898 438.13 473.898 441.712 470.072 443.921L247.16 572.619C242.377 575.38 234.623 575.38 229.84 572.619L6.92817 443.921C3.10183 441.712 3.10184 438.13 6.92817 435.921L235.036 304.223Z"
        ></path>
      </g>
      <path
        stroke="white"
        d="M235.469 304.473C237.143 303.506 239.857 303.506 241.531 304.473L469.639 436.171C473.226 438.242 473.226 441.6 469.639 443.671L246.727 572.369C242.183 574.992 234.817 574.992 230.273 572.369L7.36118 443.671C3.77399 441.6 3.774 438.242 7.36119 436.171L235.469 304.473Z"
      ></path>
      <path
        stroke="white"
        fill="#C3CADC"
        d="M234.722 321.071C236.396 320.105 239.111 320.105 240.785 321.071L439.477 435.786C443.064 437.857 443.064 441.215 439.477 443.286L240.785 558.001C239.111 558.967 236.396 558.967 234.722 558.001L36.0304 443.286C32.4432 441.215 32.4432 437.857 36.0304 435.786L234.722 321.071Z"
      ></path>
      <path
        fill="#4054B2"
        d="M234.521 366.089C236.434 364.985 239.536 364.985 241.449 366.089L406.439 461.346L241.247 556.72C239.333 557.825 236.231 557.825 234.318 556.72L69.3281 461.463L234.521 366.089Z"
      ></path>
      <path
        fill="#30439B"
        d="M237.985 364.089L237.984 556.972C236.144 556.941 235.082 556.717 233.13 556.043L69.3283 461.463L237.985 364.089Z"
      ></path>
      <path
        fill="url(#loader-paint0)"
        d="M36.2146 117.174L237.658 0.435217V368.615C236.541 368.598 235.686 368.977 233.885 370.124L73.1836 463.678L39.2096 444.075C37.0838 442.229 36.285 440.981 36.2146 438.027V117.174Z"
        className="loader-layer-pared"
      ></path>
      <path
        fill="url(#loader-paint1)"
        d="M439.1 116.303L237.657 0.435568V368.616C238.971 368.585 239.822 369.013 241.43 370.135L403.64 462.925L436.128 444.089C437.832 442.715 438.975 441.147 439.1 439.536V116.303Z"
        className="loader-layer-pared"
      ></path>
      <path
        fill="#27C6FD"
        d="M64.5447 181.554H67.5626V186.835L64.5447 188.344V181.554Z"
        className="loader-float"
      ></path>
      <path
        fill="#138EB9"
        d="M88.3522 374.347L232.415 457.522C234.202 458.405 234.866 458.629 236.335 458.71V468.291C235.356 468.291 234.086 468.212 232.415 467.275L88.3522 384.1C86.3339 382.882 85.496 382.098 85.4707 380.198V370.428L88.3522 374.347Z"
        className="loader-float"
      ></path>
      <path
        fill="#138EB9"
        d="M384.318 374.445L240.254 457.62C238.914 458.385 238.295 458.629 236.335 458.71V468.291C237.315 468.291 238.704 468.211 240.236 467.274L384.318 384.198C386.457 383.091 387.151 382.244 387.258 380.228V370.917C386.768 372.387 386.21 373.295 384.318 374.445Z"
        className="loader-float"
      ></path>
      <path
        stroke="url(#loader-paint3)"
        fill="url(#loader-paint2)"
        d="M240.452 226.082L408.617 323.172C412.703 325.531 412.703 329.355 408.617 331.713L240.452 428.803C238.545 429.904 235.455 429.904 233.548 428.803L65.3832 331.713C61.298 329.355 61.298 325.531 65.3832 323.172L233.548 226.082C235.455 224.982 238.545 224.982 240.452 226.082Z"
        className="loader-float"
      ></path>
      <path
        fill="#5B6CA2"
        d="M408.896 332.123L241.489 428.775C240.013 429.68 238.557 430.033 236.934 430.033V464.518C238.904 464.518 239.366 464.169 241.489 463.233L408.896 366.58C411.372 365.292 412.125 363.262 412.312 361.317C412.312 361.317 412.312 326.583 412.312 327.722C412.312 328.86 411.42 330.514 408.896 332.123Z"
        className="loader-float"
      ></path>
      <path
        fill="#6879AF"
        d="M240.92 429.077L255.155 420.857V432.434L251.511 439.064V457.432L241.489 463.242C240.116 463.858 239.141 464.518 236.934 464.518V430.024C238.695 430.024 239.862 429.701 240.92 429.077Z"
        className="loader-float"
      ></path>
      <path
        fill="url(#loader-paint4)"
        d="M65.084 331.984L232.379 428.571C233.882 429.619 235.101 430.005 236.934 430.005V464.523C234.656 464.523 234.285 464.215 232.379 463.214L65.084 366.442C62.4898 365 61.6417 362.992 61.6699 361.29V327.125C61.6899 329.24 62.4474 330.307 65.084 331.984Z"
        className="loader-float"
      ></path>
      <path
        fill="#20273A"
        d="M400.199 361.032C403.195 359.302 405.623 355.096 405.623 351.637C405.623 348.177 403.195 346.775 400.199 348.505C397.203 350.235 394.775 354.441 394.775 357.9C394.775 361.359 397.203 362.762 400.199 361.032Z"
        className="loader-float"
      ></path>
      <path
        fill="#20273A"
        d="M221.404 446.444C224.4 448.174 226.828 446.771 226.828 443.312C226.828 439.853 224.4 435.646 221.404 433.917C218.408 432.187 215.979 433.589 215.979 437.049C215.979 440.508 218.408 444.714 221.404 446.444Z"
        className="loader-float"
      ></path>
      <path
        fill="#494F76"
        d="M102.895 359.589L97.9976 356.762V380.07L102.895 382.897V359.589Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M102.895 359.619L98.3394 356.989V379.854L102.895 382.484V359.619Z"
        className="loader-float"
      ></path>
      <path
        fill="#494F76"
        d="M78.9793 345.923L74.0823 343.096V366.37L78.9793 369.198V345.923Z"
        className="loader-float"
      ></path>
      <path
        fill="#494F76"
        d="M86.9512 350.478L82.0542 347.651V370.959L86.9512 373.787V350.478Z"
        className="loader-float"
      ></path>
      <path
        fill="#494F76"
        d="M94.9229 355.034L90.0259 352.206V375.515L94.9229 378.342V355.034Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M86.951 350.509L82.3958 347.879V370.743L86.951 373.373V350.509Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M94.9227 355.064L90.3674 352.434V375.299L94.9227 377.929V355.064Z"
        className="loader-strobe"
      ></path>
      <path
        fill="#313654"
        d="M78.9794 345.954L74.4241 343.324V366.188L78.9794 368.818V345.954Z"
        className="loader-strobe"
      ></path>
      <path
        fill="#333B5F"
        d="M221.859 446.444C224.855 448.174 227.284 446.771 227.284 443.312C227.284 439.853 224.855 435.646 221.859 433.917C218.863 432.187 216.435 433.589 216.435 437.049C216.435 440.508 218.863 444.714 221.859 446.444Z"
        className="loader-float"
      ></path>
      <path
        fill="#333B5F"
        d="M399.516 361.032C402.511 359.302 404.94 355.096 404.94 351.637C404.94 348.177 402.511 346.775 399.516 348.505C396.52 350.235 394.091 354.441 394.091 357.9C394.091 361.359 396.52 362.762 399.516 361.032Z"
        className="loader-float"
      ></path>
      <path
        fill="#27C6FD"
        d="M88.3522 317.406L232.415 400.581C234.202 401.464 234.866 401.688 236.335 401.769V411.35C235.356 411.35 234.086 411.271 232.415 410.334L88.3522 327.159C86.3339 325.941 85.496 325.157 85.4707 323.256V313.486L88.3522 317.406Z"
        className="loader-float"
      ></path>
      <path
        fill="#27C6FD"
        d="M384.318 317.504L240.254 400.679C238.914 401.444 238.295 401.688 236.335 401.769V411.35C237.315 411.35 238.704 411.27 240.236 410.333L384.318 327.257C386.457 326.15 387.151 325.303 387.258 323.287V313.976C386.768 315.446 386.21 316.354 384.318 317.504Z"
        className="loader-float"
      ></path>
      <path
        stroke="url(#loader-paint6)"
        fill="url(#loader-paint5)"
        d="M240.452 169.141L408.617 266.231C412.703 268.59 412.703 272.414 408.617 274.772L240.452 371.862C238.545 372.962 235.455 372.962 233.548 371.862L65.3832 274.772C61.298 272.414 61.298 268.59 65.3832 266.231L233.548 169.141C235.455 168.04 238.545 168.04 240.452 169.141Z"
        className="loader-float"
      ></path>
      <path
        fill="#5B6CA2"
        d="M408.896 275.182L241.489 371.834C240.013 372.739 238.557 373.092 236.934 373.092V407.577C238.904 407.577 239.366 407.229 241.489 406.292L408.896 309.64C411.372 308.352 412.125 306.321 412.312 304.376C412.312 304.376 412.312 269.642 412.312 270.781C412.312 271.92 411.42 273.573 408.896 275.182Z"
        className="loader-float"
      ></path>
      <path
        fill="#6879AF"
        d="M240.92 372.135L255.155 363.915V375.493L251.511 382.123V400.491L241.489 406.3C240.116 406.916 239.141 407.577 236.934 407.577V373.083C238.695 373.083 239.862 372.759 240.92 372.135Z"
        className="loader-float"
      ></path>
      <path
        fill="url(#loader-paint7)"
        d="M65.084 275.043L232.379 371.63C233.882 372.678 235.101 373.064 236.934 373.064V407.582C234.656 407.582 234.285 407.274 232.379 406.273L65.084 309.501C62.4898 308.059 61.6417 306.051 61.6699 304.349V270.184C61.6899 272.299 62.4474 273.366 65.084 275.043Z"
        className="loader-float"
      ></path>
      <path
        fill="#20273A"
        d="M400.199 304.091C403.195 302.362 405.623 298.155 405.623 294.696C405.623 291.237 403.195 289.835 400.199 291.564C397.203 293.294 394.775 297.5 394.775 300.959C394.775 304.419 397.203 305.821 400.199 304.091Z"
        className="loader-float"
      ></path>
      <path
        fill="#20273A"
        d="M221.404 389.503C224.4 391.232 226.828 389.83 226.828 386.371C226.828 382.912 224.4 378.705 221.404 376.976C218.408 375.246 215.979 376.648 215.979 380.107C215.979 383.567 218.408 387.773 221.404 389.503Z"
        className="loader-float"
      ></path>
      <path
        fill="#494F76"
        d="M102.553 301.281L97.656 298.454V321.762L102.553 324.59V301.281Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M102.553 301.312L97.9976 298.682V321.546L102.553 324.176V301.312Z"
        className="loader-strobe"
      ></path>
      <path
        fill="#494F76"
        d="M78.6377 287.615L73.7407 284.788V308.063L78.6377 310.89V287.615Z"
        className="loader-float"
      ></path>
      <path
        fill="#494F76"
        d="M86.6094 292.171L81.7124 289.343V312.652L86.6094 315.479V292.171Z"
        className="loader-float"
      ></path>
      <path
        fill="#494F76"
        d="M94.5811 296.726L89.6841 293.899V317.207L94.5811 320.034V296.726Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M86.6095 292.201L82.0542 289.571V312.436L86.6095 315.066V292.201Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M94.5812 296.756L90.0259 294.126V316.991L94.5812 319.621V296.756Z"
        className="loader-strobe-v2"
      ></path>
      <path
        fill="#313654"
        d="M78.6376 287.646L74.0823 285.016V307.88L78.6376 310.51V287.646Z"
        className="loader-float"
      ></path>
      <path
        fill="#333B5F"
        d="M221.859 389.503C224.855 391.232 227.284 389.83 227.284 386.371C227.284 382.912 224.855 378.705 221.859 376.976C218.863 375.246 216.435 376.648 216.435 380.107C216.435 383.567 218.863 387.773 221.859 389.503Z"
        className="loader-float"
      ></path>
      <path
        fill="#333B5F"
        d="M399.516 304.091C402.511 302.362 404.94 298.155 404.94 294.696C404.94 291.237 402.511 289.835 399.516 291.564C396.52 293.294 394.091 297.5 394.091 300.959C394.091 304.419 396.52 305.821 399.516 304.091Z"
        className="loader-float"
      ></path>
      <path
        fill="#27C6FD"
        d="M89.4907 214.912L233.554 298.087C235.341 298.97 236.003 299.194 237.474 299.275V308.856C236.494 308.856 235.223 308.777 233.554 307.84L89.4907 224.665C87.4726 223.447 86.6347 222.663 86.6094 220.762V210.993L89.4907 214.912Z"
        className="loader-float"
      ></path>
      <path
        fill="#27C6FD"
        d="M385.457 215.01L241.393 298.185C240.053 298.951 239.434 299.194 237.474 299.275V308.856C238.454 308.856 239.844 308.776 241.375 307.839L385.457 224.763C387.597 223.656 388.29 222.809 388.397 220.793V211.482C387.907 212.953 387.349 213.86 385.457 215.01Z"
        className="loader-float"
      ></path>
      <path
        fill="url(#loader-paint8)"
        d="M66.1102 196.477L233.517 293.129C235.593 294.154 236.364 294.416 238.073 294.509V305.642C236.934 305.642 235.458 305.551 233.517 304.463L66.1102 207.81C63.7651 206.394 62.7914 205.483 62.762 203.275V191.922L66.1102 196.477Z"
        className="loader-float"
      ></path>
      <path
        fill="#5B6CA2"
        d="M410.101 196.591L242.694 293.243C241.135 294.132 240.35 294.375 238.073 294.468V305.643C239.211 305.643 240.892 305.55 242.671 304.46L410.101 207.923C412.587 206.638 413.392 205.653 413.517 203.31V192.491C412.948 194.199 412.3 195.254 410.101 196.591Z"
        className="loader-float"
      ></path>
      <path
        stroke="url(#loader-paint10)"
        fill="url(#loader-paint9)"
        d="M241.59 90.5623L409.756 187.652C413.842 190.011 413.842 193.835 409.756 196.194L241.59 293.284C239.684 294.384 236.593 294.384 234.687 293.284L66.5219 196.194C62.4367 193.835 62.4367 190.011 66.5219 187.652L234.687 90.5623C236.593 89.4616 239.684 89.4616 241.59 90.5623Z"
        className="loader-float"
      ></path>
      <path
        fill="#20273A"
        d="M89.0427 195.334C92.0385 197.063 96.8956 197.063 99.8914 195.334C102.887 193.604 102.887 190.8 99.8914 189.07C96.8956 187.341 92.0385 187.341 89.0427 189.07C86.0469 190.8 86.0469 193.604 89.0427 195.334Z"
        className="loader-float"
      ></path>
      <path
        fill="#20273A"
        d="M231.396 111.061C234.391 112.791 239.249 112.791 242.244 111.061C245.24 109.331 245.24 106.527 242.244 104.798C239.249 103.068 234.391 103.068 231.396 104.798C228.4 106.527 228.4 109.331 231.396 111.061Z"
        className="loader-float"
      ></path>
      <path
        fill="#20273A"
        d="M374.887 194.195C377.883 195.925 382.74 195.925 385.736 194.195C388.732 192.465 388.732 189.661 385.736 187.932C382.74 186.202 377.883 186.202 374.887 187.932C371.891 189.661 371.891 192.465 374.887 194.195Z"
        className="loader-float"
      ></path>
      <path
        fill="#20273A"
        d="M231.396 279.607C234.391 281.336 239.249 281.336 242.244 279.607C245.24 277.877 245.24 275.073 242.244 273.343C239.249 271.613 234.391 271.613 231.396 273.343C228.4 275.073 228.4 277.877 231.396 279.607Z"
        className="loader-float"
      ></path>
      <path
        fill="#333B5F"
        d="M232.109 279.607C235.104 281.336 239.962 281.336 242.957 279.607C245.953 277.877 245.953 275.073 242.957 273.343C239.962 271.613 235.104 271.613 232.109 273.343C229.113 275.073 229.113 277.877 232.109 279.607Z"
        className="loader-float"
      ></path>
      <path
        fill="#333B5F"
        d="M89.7563 195.334C92.7521 197.063 97.6092 197.063 100.605 195.334C103.601 193.604 103.601 190.8 100.605 189.07C97.6092 187.341 92.7521 187.341 89.7563 189.07C86.7605 190.8 86.7605 193.604 89.7563 195.334Z"
        className="loader-float"
      ></path>
      <path
        fill="#333B5F"
        d="M232.109 111.061C235.104 112.791 239.962 112.791 242.957 111.061C245.953 109.331 245.953 106.527 242.957 104.798C239.962 103.068 235.104 103.068 232.109 104.798C229.113 106.527 229.113 109.331 232.109 111.061Z"
        className="loader-float"
      ></path>
      <path
        fill="#333B5F"
        d="M375.6 194.195C378.595 195.925 383.453 195.925 386.448 194.195C389.444 192.465 389.444 189.661 386.448 187.932C383.453 186.202 378.595 186.202 375.6 187.932C372.604 189.661 372.604 192.465 375.6 194.195Z"
        className="loader-float"
      ></path>
      <path
        stroke="#313654"
        d="M371.315 166.009L354.094 176.748C351.92 178.337 350.677 179.595 350.677 181.872L351.247 196.108C351.412 198.824 350.734 200.095 347.83 201.802L251.03 257.603C248.955 258.968 247.598 259.356 244.767 259.312L215.727 258.743C212.711 258.605 211.233 259.005 208.894 260.45L193.659 269.072"
        className="loader-float"
      ></path>
      <path
        stroke="#313654"
        d="M345.691 151.204L328.328 161.374C326.154 162.963 324.911 164.221 324.911 166.498L325.481 180.734C325.646 183.45 324.968 184.721 322.064 186.428L225.264 242.229C223.19 243.594 221.832 243.982 219.001 243.938L189.961 243.369C186.946 243.231 185.468 243.631 183.128 245.076L167.124 253.698"
        className="loader-float"
      ></path>
      <path
        stroke="#313654"
        d="M105.482 218.098L122.697 207.363C124.87 205.773 126.111 204.516 126.111 202.24L125.537 188.007C125.371 185.291 126.048 184.02 128.951 182.314L225.715 126.533C227.788 125.17 229.146 124.782 231.976 124.825L261.012 125.398C264.026 125.535 265.503 125.136 267.842 123.691L283.072 115.072"
        className="loader-float"
      ></path>
      <path
        stroke="#313654"
        d="M131.121 232.893L148.482 222.725C150.656 221.136 151.898 219.879 151.898 217.601L151.327 203.367C151.162 200.65 151.839 199.379 154.743 197.673L251.531 141.878C253.605 140.514 254.962 140.126 257.794 140.17L286.832 140.74C289.847 140.878 291.325 140.478 293.664 139.032L309.667 130.412"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M327.961 242.79L301.907 227.748L300.673 228.46L326.727 243.503L327.961 242.79Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M354.625 227.426L328.56 212.377L327.326 213.09L353.392 228.139L354.625 227.426Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M300.864 258.519L274.707 243.417L273.474 244.129L299.631 259.231L300.864 258.519Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M176.498 155.101L150.21 139.924L148.977 140.636L175.264 155.813L176.498 155.101Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M193.703 145.191L167.388 129.998L166.154 130.711L192.469 145.903L193.703 145.191Z"
        className="loader-float"
      ></path>
      <path
        fill="#313654"
        d="M158.333 165.69L131.974 150.472L130.74 151.184L157.099 166.402L158.333 165.69Z"
        className="loader-float"
      ></path>
      <path
        fill="#20273A"
        d="M232.079 135.83C234.258 134.573 237.79 134.573 239.969 135.83L329.717 187.647C334.074 190.163 334.074 194.242 329.717 196.757L239.969 248.574C237.79 249.832 234.258 249.832 232.079 248.574L142.33 196.757C137.972 194.242 137.972 190.163 142.33 187.647L232.079 135.83Z"
        className="loader-float"
      ></path>
      <path
        fill="url(#loader-paint11)"
        d="M234.357 135.83C236.535 134.573 240.068 134.573 242.246 135.83L331.995 187.647C336.352 190.163 336.352 194.242 331.995 196.757L242.246 248.574C240.068 249.832 236.535 249.832 234.357 248.574L144.608 196.757C140.25 194.242 140.25 190.163 144.608 187.647L234.357 135.83Z"
        className="loader-float"
      ></path>
      <path
        strokeWidth="3"
        stroke="#27C6FD"
        d="M380.667 192.117V181.97C380.667 179.719 383.055 178.27 385.052 179.309L409.985 192.282C410.978 192.799 411.601 193.825 411.601 194.943V301.113C411.601 302.642 409.953 303.606 408.62 302.856L399.529 297.742"
        className="loader-after loader-float"
      ></path>
      <path
        strokeWidth="3"
        stroke="#27C6FD"
        d="M94.7234 192.117V180.306C94.7234 179.214 94.1301 178.208 93.1744 177.68L70.5046 165.152C68.5052 164.047 66.0536 165.493 66.0536 167.778V185.326"
        className="loader-float"
      ></path>
      <ellipse fill="#27C6FD" ry="1.50894" rx="1.50894" cy="192.117" cx="380.667" className="loader-float"></ellipse>
      <ellipse fill="#27C6FD" ry="1.50894" rx="1.50894" cy="192.117" cx="94.7235" className="loader-float"></ellipse>
      <ellipse fill="#27C6FD" ry="1.50894" rx="1.50894" cy="297.742" cx="399.529" className="loader-float"></ellipse>
      <ellipse fill="#27C6FD" ry="1.50894" rx="1.50894" cy="383.751" cx="221.474" className="loader-float"></ellipse>
      <ellipse fill="#27C6FD" ry="1.50894" rx="1.50894" cy="439.583" cx="221.474" className="loader-float"></ellipse>
      <path
        strokeWidth="3"
        stroke="#27C6FD"
        d="M221.474 383.752L211.746 388.941C210.768 389.462 210.157 390.48 210.157 391.588V444.34C210.157 445.108 210.988 445.589 211.654 445.208L221.474 439.583"
        className="loader-float"
      ></path>
      <path
        fill="url(#loader-paint13)"
        d="M237.376 236.074L36 119.684V439.512C36.0957 441.966 36.7214 443.179 39.0056 445.021L200.082 538.547L231.362 556.441C233.801 557.806 235.868 558.222 237.376 558.328V236.074Z"
        className="loader-layer-pared"
      ></path>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          y2="556.454"
          x2="438.984"
          y1="235.918"
          x1="237.376"
          id="loader-paint13"
        >
          <stop style={{ stopColor: "#4457b3", stopOpacity: 0 }} offset="10%"></stop>
          <stop style={{ stopColor: "#4457b3", stopOpacity: 1 }} offset="100%"></stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#loader-paint13)"
        d="M237.376 235.918L438.984 119.576V439.398C439.118 441.699 438.452 442.938 435.975 444.906L274.712 538.539L243.397 556.454C240.955 557.821 238.886 558.23 237.376 558.336V235.918Z"
        className="loader-gradient-anim loader-layer-pared"
      ></path>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="275.295"
          width="468.883"
          y="303.394"
          x="4.05835"
          id="loader-filter0-i"
        >
          <feFlood result="BackgroundImageFix" floodOpacity="0"></feFlood>
          <feBlend result="shape" in2="BackgroundImageFix" in="SourceGraphic" mode="normal"></feBlend>
          <feColorMatrix
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            type="matrix"
            in="SourceAlpha"
          ></feColorMatrix>
          <feOffset dy="4"></feOffset>
          <feGaussianBlur stdDeviation="2"></feGaussianBlur>
          <feComposite k3="1" k2="-1" operator="arithmetic" in2="hardAlpha"></feComposite>
          <feColorMatrix values="0 0 0 0 0.220833 0 0 0 0 0.220833 0 0 0 0 0.220833 0 0 0 1 0" type="matrix"></feColorMatrix>
          <feBlend result="effect1_innerShadow_163_1030" in2="shape" mode="normal"></feBlend>
        </filter>
        <linearGradient gradientUnits="userSpaceOnUse" y2="336.055" x2="294.366" y1="60.1113" x1="135.05" id="loader-paint0">
          <stop stopOpacity="0.01" stopColor="white" offset="0.305"></stop>
          <stop stopColor="#4054B2" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="335.208" x2="180.935" y1="59.2405" x1="340.265" id="loader-paint1">
          <stop stopOpacity="0.01" stopColor="white" offset="0.305"></stop>
          <stop stopColor="#4054B2" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="420.619" x2="88.5367" y1="327.152" x1="412.313" id="loader-paint2">
          <stop stopColor="#313654"></stop>
          <stop stopColor="#313654" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="211.092" x2="168.239" y1="426.799" x1="236.934" id="loader-paint3">
          <stop stopColor="#7281B8"></stop>
          <stop stopColor="#333952" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="349.241" x2="232.379" y1="349.241" x1="65.0839" id="loader-paint4">
          <stop stopColor="#7281B8"></stop>
          <stop stopColor="#5D6EA4" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="363.678" x2="88.5367" y1="270.211" x1="412.313" id="loader-paint5">
          <stop stopColor="#313654"></stop>
          <stop stopColor="#313654" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="154.15" x2="168.239" y1="369.858" x1="236.934" id="loader-paint6">
          <stop stopColor="#7281B8"></stop>
          <stop stopColor="#333952" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="292.3" x2="232.379" y1="292.3" x1="65.0839" id="loader-paint7">
          <stop stopColor="#7281B8"></stop>
          <stop stopColor="#5D6EA4" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="198.899" x2="238.073" y1="198.899" x1="62.762" id="loader-paint8">
          <stop stopColor="#7382B9"></stop>
          <stop stopColor="#5D6EA4" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="191.599" x2="67.1602" y1="191.633" x1="413.451" id="loader-paint9">
          <stop stopColor="#5F6E99"></stop>
          <stop stopColor="#465282" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="191.599" x2="63.6601" y1="191.599" x1="417.16" id="loader-paint10">
          <stop stopColor="#7281B8"></stop>
          <stop stopColor="#333952" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="243.221" x2="156.734" y1="191.633" x1="335.442" id="loader-paint11">
          <stop stopColor="#313654"></stop>
          <stop stopColor="#313654" offset="1"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="421.983" x2="-1.9283" y1="179.292" x1="138.189" id="loader-paint12">
          <stop stopOpacity="0.01" stopColor="white" offset="0.305"></stop>
          <stop stopColor="#4054B2" offset="1"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

function IntroLoader({ onDone }) {
  const [phase, setPhase] = useState("blank"); // blank -> in -> hold -> exit
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setPhase("in"), 300);
    const t2 = setTimeout(() => setPhase("hold"), 3100);
    const t3 = setTimeout(() => setPhase("exit"), 3600);
    const t4 = setTimeout(() => onDone(), 4500);

    let raf;
    const start = Date.now();
    const duration = 2800;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    const progressStart = setTimeout(() => { raf = requestAnimationFrame(tick); }, 300);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearTimeout(progressStart);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onDone]);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"#000",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24,
      opacity: phase === "exit" ? 0 : 1,
      transform: phase === "exit" ? "scale(1.045)" : "scale(1)",
      filter: phase === "exit" ? "blur(8px)" : "blur(0px)",
      transition:"opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.9s ease",
      pointerEvents: phase === "exit" ? "none" : "auto",
    }}>
      {/* Loader illustration */}
      <div style={{
        opacity: phase === "blank" ? 0 : 1,
        transform: phase === "blank" ? "translateY(6px) scale(0.85)" : "translateY(0) scale(1)",
        transition:"opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <LoaderIllustration size={130} />
      </div>

      {/* Wordmark */}
      <span style={{
        color:"#fff",
        fontFamily:"'Inter',sans-serif",
        fontSize:"clamp(18px,2.8vw,26px)",
        fontWeight:600,
        whiteSpace:"nowrap",
        opacity: phase === "blank" ? 0 : 1,
        letterSpacing: phase === "blank" ? "0.04em" : "0.42em",
        transition:"opacity 0.85s ease 0.1s, letter-spacing 1.5s cubic-bezier(0.16,1,0.3,1) 0.1s",
      }}>
        ZAE LABS
      </span>

      {/* Progress bar */}
      <div style={{
        width:130, height:1, background:"rgba(255,255,255,0.12)", position:"relative", overflow:"hidden",
        opacity: phase === "blank" ? 0 : 1,
        transition:"opacity 0.6s ease 0.35s",
      }}>
        <div style={{
          position:"absolute", left:0, top:0, height:"100%",
          width:`${progress}%`,
          background:"#e8702a",
          transition:"width 0.15s linear",
        }} />
      </div>

      {/* Percentage counter */}
      <span style={{
        fontSize:11, letterSpacing:"0.15em", color:"rgba(255,255,255,0.35)",
        fontVariantNumeric:"tabular-nums",
        opacity: phase === "blank" ? 0 : 1,
        transition:"opacity 0.6s ease 0.35s",
      }}>
        {String(progress).padStart(2,"0")}%
      </span>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <LiquidGlassFilter />
      {!introDone && <IntroLoader onDone={() => setIntroDone(true)} />}
      <div style={{ minHeight:"100vh",background:"#000",letterSpacing:"-0.02em",fontFamily:"'Inter',sans-serif" }}>
        <Nav unlocked={unlocked} />
        <HeroSection unlocked={unlocked} setUnlocked={setUnlocked} />
        <PortfolioHero />
        <AboutSection />
        <ExperienceSection />
        <CertificationsSection />
        <GalleryScrollSection />
        <ToolsSection />
        <PromptsSection />
        <PromptLibrarySection />
        <WorkflowSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
