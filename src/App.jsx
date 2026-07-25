import { useState, useEffect, useRef } from "react";
import { Code2, Bot, Video, Zap, Menu, ArrowRight, X, Search, ChevronDown, ChevronUp, ExternalLink, Award, BookOpen, Wrench, GraduationCap, Copy, Check, Cpu } from "lucide-react";
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
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  // Lock scroll on mount, unlock when button clicked
  useEffect(() => {
    if (!unlocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [unlocked]);

  useEffect(() => {
    const onMove = e => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    window.addEventListener("mousemove", onMove);
    const loop = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;
      setCursorPos({ x: smoothRef.current.x, y: smoothRef.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleUnlock = () => {
    setUnlocked(true);
    setTimeout(() => {
      document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <section id="hero" style={{ position:"relative",width:"100%",overflow:"hidden",height:"100dvh",background:"#000" }}>
      <div className="hero-zoom" style={{ position:"absolute",inset:0,backgroundImage:`url('${BG_IMAGE_1}')`,backgroundSize:"cover",backgroundPosition:"center",zIndex:10 }} />
      <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

      {/* Heading */}
      <div style={{ position:"absolute",top:"14%",left:0,right:0,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"0 20px",pointerEvents:"none",zIndex:50 }}>
        <h1 style={{ color:"#fff",lineHeight:0.95,margin:0 }}>
          <span className="hero-anim hero-reveal font-playfair" style={{ display:"block",fontSize:"clamp(48px,8vw,96px)",fontWeight:400,letterSpacing:"-0.05em",animationDelay:"0.25s" }}>The process</span>
          <span className="hero-anim hero-reveal" style={{ display:"block",fontSize:"clamp(48px,8vw,96px)",fontWeight:400,letterSpacing:"-0.08em",marginTop:"-4px",animationDelay:"0.42s" }}>never lies.</span>
        </h1>
        <span className="hero-anim hero-fade" style={{ display:"block",marginTop:20,fontSize:"clamp(14px,1.8vw,18px)",color:"rgba(255,255,255,0.55)",letterSpacing:"0.01em",animationDelay:"0.55s",pointerEvents:"none" }}>
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
    <section id="portfolio" style={{ position:"relative",background:"#000",color:"#fff",padding:"120px 56px 80px",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden" }}>
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
    <section id="about" style={{ position:"relative",background:"#050505",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
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
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
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
  { title:"LPK Tepi Sawah Volunteer", org:"IPB University", period:"Present", desc:"Actively volunteering in the Computer Science community, focusing on teaching basic things to children through play and participating in direct field activities." },
  { title:"IPB Archery", org:"IPB University", period:"Present", desc:"Active as a member of the IPB Archery community, focusing on mastering basic archery techniques through regular practice and actively participating in community activities in the field." },
  { title:"Head of Robotic Club", org:"SMAN 28 Kab. Tangerang", period:"Jun 2023 – Aug 2024", desc:"Led the high school robotics club and successfully engineered a Line Follower Robot. Fostered leadership, teamwork, and strong hardware-software integration skills." },
  { title:"Member of Dastha Research Team", org:"SMAN 28 Kab. Tangerang", period:"Jun 2023 – Jul 2024", desc:"Actively contributed to the research team. Applied strong analytical and teamwork skills to conduct studies, gather data, and develop innovative solutions." },
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
    <section id="experience" style={{ position:"relative",background:"#000",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
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
    <section style={{ position:"relative",background:"#050505",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
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

function ToolsSection() {
  const [query, setQuery] = useState("");
  const filtered = query.trim() === ""
    ? TOOLS
    : TOOLS.filter(t => t.keyword.toLowerCase().includes(query.toLowerCase()) || t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section id="tools" style={{ position:"relative",background:"#000",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
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
    Icon: Zap,
    title: "Productivity Prompts",
    desc: "Prompts to organize ideas, build learning plans, summarize resources, and execute faster.",
    pill: "Daily System",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=960&h=540&fit=crop&q=80",
    code: `// GANTI dengan kode Wokwi kamu\n#include <Arduino.h>\n#include <Servo.h>\n\nServo myServo;\n\nvoid setup() {\n  myServo.attach(9);\n}\n\nvoid loop() {\n  for (int pos = 0; pos <= 180; pos++) {\n    myServo.write(pos);\n    delay(10);\n  }\n  for (int pos = 180; pos >= 0; pos--) {\n    myServo.write(pos);\n    delay(10);\n  }\n}`,
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
    <section id="prompts" style={{ position:"relative",background:"#050505",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
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
    title: "Web Development Prompts",
    desc: "Prompt structures for building landing pages, full-stack apps, UI systems, and product prototypes.",
    pill: "React · Vite · Tailwind",
    prompt: `GANTI dengan prompt ChatGPT kamu untuk Web Development.\n\nContoh struktur:\nRole: Kamu adalah senior frontend engineer.\nContext: [jelaskan project/produk]\nTask: Bangun landing page dengan section hero, fitur, dan CTA menggunakan React + Tailwind.\nConstraints: [tech stack, aksesibilitas, responsif]\nOutput format: kode lengkap per file.`,
  },
  {
    Icon: Bot,
    title: "AI Agent Prompts",
    desc: "Prompt structures for planning, coding, researching, debugging, and automating repetitive tasks.",
    pill: "Agent Workflow",
    prompt: `GANTI dengan prompt ChatGPT kamu untuk AI Agent Workflow.\n\nContoh struktur:\nRole: Kamu adalah AI agent planner.\nGoal: [tujuan otomatisasi]\nSteps: pecah task jadi langkah kecil dan urutkan prioritas.\nTools available: [list tools/API]\nOutput format: rencana eksekusi langkah demi langkah.`,
  },
  {
    Icon: Video,
    title: "Content Creation Prompts",
    desc: "Prompt systems for Reels, Shorts, carousel posts, hooks, scripts, and content calendars.",
    pill: "Social Media",
    prompt: `GANTI dengan prompt ChatGPT kamu untuk Content Creation.\n\nContoh struktur:\nRole: Kamu adalah content strategist.\nTopic: [topik konten]\nFormat: Reels/Shorts 30 detik.\nHook: buat 3 opsi hook pembuka yang kuat.\nOutput format: script + caption + hashtag.`,
  },
  {
    Icon: Zap,
    title: "Productivity Prompts",
    desc: "Prompts to organize ideas, build learning plans, summarize resources, and execute faster.",
    pill: "Daily System",
    prompt: `GANTI dengan prompt ChatGPT kamu untuk Productivity.\n\nContoh struktur:\nRole: Kamu adalah personal productivity coach.\nGoal: [target belajar/kerja]\nTimeframe: [durasi]\nOutput format: rencana harian/mingguan + checklist prioritas.`,
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
        <p style={{ fontSize:13,color:"rgba(255,255,255,0.50)",lineHeight:1.6,marginTop:14 }}>Copy prompt ini lalu paste ke ChatGPT.</p>
      </BottomSheetModal>
    </>
  );
}

function PromptLibrarySection() {
  return (
    <section id="prompt-library" style={{ position:"relative",background:"#000",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"8%",left:"-5%",opacity:0.7 }}>
        <ScrollSpin size={220} variant="grid" />
      </div>
      <div style={{ maxWidth:1152,margin:"0 auto" }}>
        <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:16 }}>Prompt Library</p>
        <h2 style={{ fontSize:"clamp(32px,5vw,58px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:1,maxWidth:680,marginBottom:16 }}>Ready-to-use prompts for ChatGPT.</h2>
        <p style={{ color:"rgba(255,255,255,0.60)",fontSize:15,lineHeight:1.65,maxWidth:520,marginBottom:48 }}>Prompt systems yang aku buat sendiri — tinggal copy, paste ke ChatGPT, langsung jalan.</p>
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
    <section id="workflow" style={{ position:"relative",background:"#000",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
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

// ─── Access Section ───────────────────────────────────────────────────────────
function AccessSection() {
  return (
    <section style={{ position:"relative",background:"#050505",color:"#fff",padding:"64px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"-10%",left:"50%",transform:"translateX(-50%)",opacity:0.5 }}>
        <ScrollSpin size={260} accent="#ffffff" dim={0.55} variant="grid" />
      </div>
      <div style={{ maxWidth:480,margin:"0 auto",textAlign:"center" }}>
        <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:24 }}>Access Now</p>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {[
            { label:"Explore Zae AI", href:"https://zae-ai.vercel.app/", primary:true },
            { label:"Zae Vision", href:"https://portofolio-iota-one-64.vercel.app/", primary:false },
          ].map(({ label, href, primary }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{ display:"block",padding:"14px 20px",borderRadius:9999,fontSize:14,fontWeight:primary?600:500,textDecoration:"none",transition:"all 0.3s",
                background:primary?"#e8702a":"transparent",color:"#fff",border:primary?"1px solid transparent":"1px solid rgba(255,255,255,0.20)" }}
              onMouseEnter={e => { e.currentTarget.style.transform="scale(1.02)"; if(!primary) e.currentTarget.style.borderColor="rgba(255,255,255,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; if(!primary) e.currentTarget.style.borderColor="rgba(255,255,255,0.20)"; }}>
              {label}
            </a>
          ))}
        </div>
        <a href="#" style={{ display:"inline-block",marginTop:28,fontSize:13,color:"rgba(255,255,255,0.40)",transition:"color 0.3s" }}
          onMouseEnter={e => e.currentTarget.style.color="#fff"} onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.40)"}>
          Already have access? Go to Project Zae
        </a>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section id="contact" style={{ background:"#000",color:"#fff",padding:"80px 56px" }}>
      <div style={{ maxWidth:960,margin:"0 auto" }}>
        <div style={{ position:"relative",overflow:"hidden",borderRadius:40,border:"1px solid rgba(255,255,255,0.10)",background:"rgba(255,255,255,0.05)",padding:"56px",textAlign:"center",backdropFilter:"blur(12px)" }}>
          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:300,background:"radial-gradient(ellipse,rgba(232,112,42,0.18) 0%,transparent 70%)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.35 }}>
            <ScrollSpin size={320} accent="#ffffff" dim={0.5} variant="arc" />
          </div>
          <p style={{ position:"relative",fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:20 }}>Build with Zae Labs</p>
          <h2 style={{ position:"relative",fontSize:"clamp(32px,5vw,58px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:0.95,marginBottom:24 }}>
            Get the prompts. Build the system. <span className="font-playfair">Launch</span> faster.
          </h2>
          <p style={{ position:"relative",color:"rgba(255,255,255,0.65)",fontSize:17,lineHeight:1.65,maxWidth:520,margin:"0 auto 36px" }}>
            Follow Zae Labs for practical AI tutorials, web development experiments, and prompt systems that help you turn ideas into real digital products.
          </p>
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
function IntroLoader({ onDone }) {
  const [phase, setPhase] = useState("blank"); // blank -> in -> hold -> exit
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setPhase("in"), 250);
    const t2 = setTimeout(() => setPhase("hold"), 2100);
    const t3 = setTimeout(() => setPhase("exit"), 2550);
    const t4 = setTimeout(() => onDone(), 3350);

    let raf;
    const start = Date.now();
    const duration = 1950;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    const progressStart = setTimeout(() => { raf = requestAnimationFrame(tick); }, 250);

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
      {/* Logo mark */}
      <div style={{
        opacity: phase === "blank" ? 0 : 1,
        transform: phase === "blank" ? "translateY(6px) scale(0.85)" : "translateY(0) scale(1)",
        transition:"opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <LogoIcon size={28} />
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
        <ToolsSection />
        <PromptsSection />
        <PromptLibrarySection />
        <WorkflowSection />
        <AccessSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
