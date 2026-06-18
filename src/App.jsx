import { useState, useEffect, useRef } from "react";
import { Code2, Bot, Video, Zap, Menu, ArrowRight, X, Search, ChevronDown, ChevronUp, ExternalLink, Award, BookOpen, Wrench, GraduationCap } from "lucide-react";

// ─── Asset URLs ───────────────────────────────────────────────────────────────
const BG_IMAGE_1 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";
const PROFILE_PHOTO = "https://instagram.fcgk32-1.fna.fbcdn.net/v/t51.82787-15/659592455_18112837321689596_351421020188487837_n.webp?_nc_cat=101&ig_cache_key=Mzg2Nzk3NTUwNzI4Mzk3NzY4MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=tF_fdwFdNuEQ7kNvwE_A047&_nc_oc=Ado09678_JFvuIAjICGSfJBpR_82cijS2WmOQtrA0XafdbHm6W7yVacTUX7IAmGuRBQ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fcgk32-1.fna&_nc_gid=EY39F15DxzX6dlGEeAzPIQ&_nc_ss=7a32e&oh=00_Af3h_YUTEvLuIB8cyUKv6jdN_lDP5ilw_RAzebfBVTsH9A&oe=69E6AD76";

const SPOTLIGHT_R = 260;

// ─── Global CSS ───────────────────────────────────────────────────────────────
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
    background: rgba(255,255,255,0.07) !important;
    transform: translateY(-4px) !important;
  }

  .cert-dropdown-content {
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.4s ease, opacity 0.3s ease;
  }
  .cert-dropdown-content.open { max-height: 400px; opacity: 1; }

  .cert-link { text-decoration:none; display:flex; align-items:center; gap:10px; padding:11px 16px;
    border-radius:12px; font-size:13px; color:rgba(255,255,255,0.75); background:rgba(0,0,0,0.3);
    border:1px solid rgba(255,255,255,0.06); transition:all 0.2s; }
  .cert-link:hover { background:#fff; color:#000; border-color:#fff; transform:translateX(4px); }

  .nav-link-item { text-decoration:none; }
  .footer-link-item { text-decoration:none; }
  a { text-decoration:none; }
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────
function LogoIcon({ size = 26, fill = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill={fill}>
      <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
    </svg>
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

function Nav() {
  const [active, setActive] = useState("Zae Labs");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px" }}>
      {/* Logo */}
      <a href="#hero" style={{ display:"flex",alignItems:"center",gap:10 }} onClick={() => setActive("Zae Labs")}>
        <LogoIcon size={24} />
        <span className="font-playfair" style={{ color:"#fff",fontSize:20,lineHeight:1 }}>Zae Labs</span>
      </a>

      {/* Center pill desktop */}
      <div className="desktop-nav-pill" style={{ position:"absolute",left:"50%",transform:"translateX(-50%)",background:"rgba(255,255,255,0.18)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.28)",borderRadius:9999,padding:"6px 6px",display:"flex",alignItems:"center",gap:2 }}>
        {NAV_LINKS.slice(1).map(({ label, href }) => (
          <a key={label} href={href} onClick={() => setActive(label)}
            style={{ fontSize:13,fontWeight:500,padding:"6px 14px",borderRadius:9999,transition:"all 0.2s",color:active===label?"#000":"rgba(255,255,255,0.8)",background:active===label?"#fff":"transparent" }}
            onMouseEnter={e => { if(active!==label){ e.currentTarget.style.background="rgba(255,255,255,0.18)"; e.currentTarget.style.color="#fff"; }}}
            onMouseLeave={e => { if(active!==label){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.8)"; }}}
          >{label}</a>
        ))}
      </div>

      {/* Right follow */}
      <a href="https://www.instagram.com/irsyazaelani/" target="_blank" rel="noopener noreferrer"
        className="desktop-follow-btn"
        style={{ background:"#fff",color:"#111",fontSize:13,fontWeight:600,padding:"10px 22px",borderRadius:9999,transition:"background 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.background="#f0f0f0"}
        onMouseLeave={e => e.currentTarget.style.background="#fff"}
      >Follow</a>

      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(p => !p)} className="mobile-menu-btn"
        style={{ background:"none",border:"none",color:"#fff",cursor:"pointer",padding:4 }}>
        {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

      {mobileOpen && (
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
        @media(min-width:900px){ .desktop-nav-pill{display:flex!important;} .desktop-follow-btn{display:inline-flex!important;} .mobile-menu-btn{display:none!important;} }
        @media(max-width:899px){ .desktop-nav-pill{display:none!important;} .desktop-follow-btn{display:none!important;} .mobile-menu-btn{display:flex!important;} }
      `}</style>
    </nav>
  );
}

// ─── Hero (Zae Labs) ─────────────────────────────────────────────────────────
function HeroSection() {
  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [unlocked, setUnlocked] = useState(false);

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
        <p style={{ fontSize:14,color:"rgba(255,255,255,0.80)",lineHeight:1.65 }}>Explore ready-to-use prompts, AI agent workflows, and real web builds designed to turn ideas into working products.</p>
        <button
          onClick={handleUnlock}
          style={{ display:"inline-block",background:"#e8702a",color:"#fff",fontSize:14,fontWeight:500,padding:"12px 28px",borderRadius:9999,border:"none",cursor:"pointer",transition:"all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background="#d2611f"; e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(232,112,42,0.30)"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#e8702a"; e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="none"; }}>
          Get Prompts
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
    <section id="portfolio" style={{ background:"#000",color:"#fff",padding:"120px 56px 80px",minHeight:"100vh",display:"flex",alignItems:"center" }}>
      <div id="portfolio-hero-trigger" style={{ maxWidth:1152,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:64,alignItems:"center" }}>
        {/* Left text */}
        <div>
          <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:20 }}>Portfolio</p>
          <h2 style={{ fontSize:"clamp(36px,5vw,60px)",fontWeight:600,letterSpacing:"-0.05em",lineHeight:1.05,marginBottom:12 }}>
            Hello, I'm <span style={{ fontWeight:700 }}>Irsya Zaelani</span>
          </h2>
          <h3 style={{ fontSize:"clamp(16px,2vw,20px)",color:"rgba(255,255,255,0.55)",fontWeight:400,marginBottom:28 }}>
            Tech Enthusiast & Student at <span style={{ color:"#fff",fontWeight:600 }}>IPB University</span>
          </h3>
          <p style={{ fontSize:15,color:"rgba(255,255,255,0.65)",lineHeight:1.8,minHeight:80,maxWidth:520,marginBottom:36 }}>{typed}<span style={{ opacity:0.5 }}>|</span></p>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
            <a href="#experience" style={{ display:"inline-flex",alignItems:"center",gap:10,padding:"13px 26px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.20)",color:"#fff",borderRadius:9999,fontSize:14,fontWeight:500,transition:"all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.color="#000"; e.currentTarget.style.borderColor="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="rgba(255,255,255,0.20)"; }}>
              <GraduationCap size={16} /> Get to Know Me
            </a>
            <a href="#tools" style={{ display:"inline-flex",alignItems:"center",gap:10,padding:"13px 26px",background:"rgba(232,112,42,0.10)",border:"1px solid rgba(232,112,42,0.35)",color:"#e8702a",borderRadius:9999,fontSize:14,fontWeight:500,transition:"all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.background="#e8702a"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#e8702a"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(232,112,42,0.10)"; e.currentTarget.style.color="#e8702a"; e.currentTarget.style.borderColor="rgba(232,112,42,0.35)"; }}>
              <Wrench size={16} /> My Tools
            </a>
          </div>
        </div>

        {/* Right photo */}
        <div style={{ display:"flex",justifyContent:"center",alignItems:"center" }}>
          <div className="float-anim" style={{ position:"relative" }}>
            <div style={{ position:"absolute",inset:-2,borderRadius:20,background:"linear-gradient(135deg,rgba(232,112,42,0.4),rgba(255,255,255,0.05))",zIndex:0 }} />
            <img src={PROFILE_PHOTO} alt="Irsya Zaelani"
              style={{ position:"relative",zIndex:1,width:320,height:320,objectFit:"cover",borderRadius:18,border:"1px solid rgba(255,255,255,0.10)",boxShadow:"0 24px 60px rgba(0,0,0,0.6)" }}
              onError={e => { e.currentTarget.style.display="none"; }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About / Zae Labs brand ──────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" style={{ position:"relative",background:"#050505",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:-128,right:-128,width:420,height:420,background:"rgba(232,112,42,0.18)",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none" }} />
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
              <div key={label} style={{ borderRadius:24,border:"1px solid rgba(255,255,255,0.10)",background:"rgba(255,255,255,0.04)",padding:20,backdropFilter:"blur(12px)" }}>
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

function ExperienceCard({ title, org, period, desc }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ borderRadius:28,border:h?"1px solid rgba(232,112,42,0.35)":"1px solid rgba(255,255,255,0.10)",background:h?"rgba(255,255,255,0.06)":"rgba(15,15,15,0.60)",padding:"32px 28px",backdropFilter:"blur(20px)",transition:"all 0.35s",transform:h?"translateY(-6px)":"translateY(0)",display:"flex",flexDirection:"column",gap:12,cursor:"default" }}>
      <div style={{ width:40,height:40,borderRadius:"50%",background:"rgba(232,112,42,0.12)",border:"1px solid rgba(232,112,42,0.25)",display:"flex",alignItems:"center",justifyContent:"center" }}>
        <BookOpen size={18} color="#e8702a" />
      </div>
      <h3 style={{ fontSize:18,fontWeight:600,letterSpacing:"-0.03em",color:"#fff" }}>{title}</h3>
      <p style={{ fontSize:13,color:"rgba(255,255,255,0.45)",fontWeight:500 }}>{org} · {period}</p>
      <p style={{ fontSize:14,color:"rgba(255,255,255,0.65)",lineHeight:1.65 }}>{desc}</p>
    </div>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" style={{ position:"relative",background:"#000",color:"#fff",padding:"96px 56px",overflow:"hidden" }}>
      <div style={{ position:"absolute",bottom:-80,left:-80,width:360,height:360,background:"rgba(232,112,42,0.10)",filter:"blur(100px)",borderRadius:"50%",pointerEvents:"none" }} />
      <div style={{ maxWidth:1152,margin:"0 auto" }}>
        <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:16 }}>Experience</p>
        <h2 style={{ fontSize:"clamp(32px,5vw,56px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:0.95,marginBottom:12,maxWidth:600 }}>
          Where I've <span className="font-playfair">grown</span> and contributed.
        </h2>
        <p style={{ color:"rgba(255,255,255,0.55)",fontSize:15,lineHeight:1.65,maxWidth:480,marginBottom:48 }}>Organizations and communities that shaped my skills in tech, leadership, and collaboration.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20 }}>
          {EXPERIENCES.map(e => <ExperienceCard key={e.title} {...e} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Certifications Section ───────────────────────────────────────────────────
const CERTS = [
  {
    icon: "🎓",
    title: "Google Certification",
    desc: "Official certifications from Google demonstrating industry-standard technical competence and expertise.",
    links: [
      { label:"Gemini Certified Educator", href:"https://edu.google.accredible.com/5463895f-480a-4157-96ab-885dcaeda295" },
      { label:"AI Basics (Dicoding)", href:"https://www.dicoding.com/certificates/53XEKKEYVXRN" },
    ],
  },
  {
    icon: "🏆",
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
    icon: "📜",
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
    <div style={{ borderRadius:28,border:"1px solid rgba(255,255,255,0.10)",background:"rgba(15,15,15,0.60)",padding:"32px 28px",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",gap:16,transition:"all 0.35s" }}>
      <div style={{ fontSize:36 }}>{icon}</div>
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
    <section style={{ background:"#050505",color:"#fff",padding:"96px 56px" }}>
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
  { name:"Database",        keyword:"vscode coding database",    href:"https://maszae-bit.github.io/Login-Zae-Group/",          icon:"🗄️" },
  { name:"Github",          keyword:"github repo code",          href:"https://github.com/MasZae-BIT",                           icon:"🐙" },
  { name:"Knowledge Hub",   keyword:"knowledge hub drive flask",  href:"https://drive.google.com/drive/u/1/folders/1rC5fnbguTs4TBfGauJ9_8HD-0uiyKKWg", icon:"🔬" },
  { name:"Zae AI",          keyword:"chatgpt ai bot microchip",  href:"https://zae-ai.vercel.app/",                              icon:"🤖" },
  { name:"Grammar Checker", keyword:"grammar checker english spell text", href:"https://grammar-checker-ashen.vercel.app/",       icon:"✅" },
  { name:"Spotify",         keyword:"spotify music song playlist",href:"https://open.spotify.com/playlist/4T7MrNwyHzB3DwtzaIGFFn?si=ddabd6a078a64c0a", icon:"🎵" },
  { name:"Discord",         keyword:"discord social chat",       href:"https://discord.gg/3JdWnYsV",                             icon:"💬" },
  { name:"Instagram DL",    keyword:"instagram social media download", href:"https://maszae-bit.github.io/Instagram-Downloader/",icon:"📸" },
  { name:"TikTok DL",       keyword:"tiktok video social download", href:"https://maszae-bit.github.io/Tiktok-Downloader/",      icon:"🎬" },
  { name:"Journal Search",  keyword:"database sql journal search book", href:"https://maszae-bit.github.io/Journal/",            icon:"📚" },
];

function ToolsSection() {
  const [query, setQuery] = useState("");
  const filtered = query.trim() === ""
    ? TOOLS
    : TOOLS.filter(t => t.keyword.toLowerCase().includes(query.toLowerCase()) || t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section id="tools" style={{ background:"#000",color:"#fff",padding:"96px 56px" }}>
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
              <div className="tool-card-inner" style={{ borderRadius:20,border:"1px solid rgba(255,255,255,0.10)",background:"rgba(15,15,15,0.60)",backdropFilter:"blur(10px)",height:150,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:12,transition:"all 0.3s",cursor:"pointer" }}>
                <span style={{ fontSize:36 }}>{icon}</span>
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
const PROMPT_CARDS = [
  { Icon:Code2, title:"Web Development Prompts", desc:"Prompts for building landing pages, full-stack apps, UI systems, and product prototypes.", pill:"React · Vite · Tailwind" },
  { Icon:Bot,   title:"AI Agent Prompts",        desc:"Prompt structures for planning, coding, researching, debugging, and automating repetitive tasks.", pill:"Agent Workflow" },
  { Icon:Video, title:"Content Creation Prompts",desc:"Prompt systems for Reels, Shorts, carousel posts, hooks, scripts, and content calendars.", pill:"Social Media" },
  { Icon:Zap,   title:"Productivity Prompts",    desc:"Prompts to organize ideas, build learning plans, summarize resources, and execute faster.", pill:"Daily System" },
];

function PromptCard({ Icon, title, desc, pill }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ borderRadius:32,border:h?"1px solid rgba(232,112,42,0.40)":"1px solid rgba(255,255,255,0.10)",background:h?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.04)",padding:24,backdropFilter:"blur(12px)",transition:"all 0.3s",transform:h?"translateY(-4px)":"translateY(0)",cursor:"default" }}>
      <div style={{ width:44,height:44,borderRadius:"50%",background:"rgba(232,112,42,0.15)",color:"#e8702a",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24 }}><Icon size={20}/></div>
      <p style={{ fontSize:17,fontWeight:600,letterSpacing:"-0.03em" }}>{title}</p>
      <p style={{ fontSize:14,color:"rgba(255,255,255,0.60)",lineHeight:1.6,marginTop:12 }}>{desc}</p>
      <span style={{ display:"inline-flex",marginTop:24,fontSize:12,color:"rgba(255,255,255,0.70)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:9999,padding:"4px 12px" }}>{pill}</span>
    </div>
  );
}

function PromptsSection() {
  return (
    <section id="prompts" style={{ background:"#050505",color:"#fff",padding:"96px 56px" }}>
      <div style={{ maxWidth:1152,margin:"0 auto" }}>
        <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.3em",color:"#e8702a",fontWeight:600,marginBottom:16 }}>Prompt Library</p>
        <h2 style={{ fontSize:"clamp(32px,5vw,58px)",fontWeight:500,letterSpacing:"-0.06em",lineHeight:1,maxWidth:680,marginBottom:16 }}>Ready-to-use prompts for modern builders.</h2>
        <p style={{ color:"rgba(255,255,255,0.60)",fontSize:15,lineHeight:1.65,maxWidth:520,marginBottom:48 }}>Explore prompt systems designed for web development, AI agents, content creation, automation, and productivity.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:16 }}>
          {PROMPT_CARDS.map(c => <PromptCard key={c.title} {...c}/>)}
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
    <section style={{ background:"#050505",color:"#fff",padding:"64px 56px" }}>
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

  const socials = [
    { icon:"📸", href:"https://www.instagram.com/irsyazaelani/", label:"Instagram" },
    { icon:"💼", href:"https://www.linkedin.com/in/muhammad-irsya-zaelani", label:"LinkedIn" },
    { icon:"🐦", href:"https://x.com/TweetsOfCats/status/1578127628179210240", label:"X" },
    { icon:"📧", href:"https://maszae-bit.github.io/Login-Zae-Group/", label:"Newsletter" },
  ];

  return (
    <footer style={{ background:"#000",color:"#fff",padding:"56px 56px 48px",borderTop:"1px solid rgba(255,255,255,0.10)" }}>
      <div style={{ maxWidth:1152,margin:"0 auto" }}>
        <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:40,marginBottom:40 }}>
          {/* Left brand */}
          <div style={{ maxWidth:340 }}>
            <a href="#hero" style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
              <LogoIcon size={24}/> <span className="font-playfair" style={{ color:"#fff",fontSize:20 }}>Zae Labs</span>
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

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight:"100vh",background:"#000",letterSpacing:"-0.02em",fontFamily:"'Inter',sans-serif" }}>
        <Nav />
        <HeroSection />
        <PortfolioHero />
        <AboutSection />
        <ExperienceSection />
        <CertificationsSection />
        <ToolsSection />
        <PromptsSection />
        <WorkflowSection />
        <AccessSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
