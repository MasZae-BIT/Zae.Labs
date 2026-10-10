"use client";

import { useEffect, useState } from "react";
import { Sparkles, Compass, ArrowDown, Layers, CheckCircle2, ChevronRight } from "lucide-react";
import GlyphPortal from "@/components/ui/glyph-portal";

const settings = { word: "ZAE LABS", scrollLength: 2.4, interactive: true, annotations: false };
const family = '"Glyph Portal Jakarta", Arial, sans-serif';
let fontLoad: Promise<void> | undefined;

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [face, setFace] = useState<string | null>(null);
  useEffect(() => {
    let settled = false;
    const finish = (value: string) => { if (!settled) { settled = true; setFace(value); } };
    // The demo uses the résumé's face. The component itself never fetches a font.
    fontLoad ??= new FontFace("Glyph Portal Jakarta", 'url("https://cdn.21st.dev/assets/mirror/15/153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79.woff2")', { weight: "400 700" })
      .load().then((font) => { document.fonts.add(font); });
    const timeout = window.setTimeout(() => finish("Arial, sans-serif"), 1600);
    void fontLoad.then(() => finish(family), () => finish("Arial, sans-serif"));
    return () => { settled = true; clearTimeout(timeout); };
  }, []);
  return (
    <div data-demo-scroll data-slipstream-demo tabIndex={0} role="region" aria-label="Zae Labs. Scroll to step inside."
      style={{ width: "100%", height: "min(720px, 100svh)", overflowY: "auto", background: "#000", color: "#fff", containerType: "inline-size", fontFamily: face ?? "Arial, sans-serif" }}>
      <style>{`
        [data-slipstream-demo] [data-gp-caption]{inset:calc(var(--gp-word-bottom,50%) + 82px) 24px auto;justify-content:center;}
        [data-slipstream-demo] [data-gp-hint]{display:none;}
        [data-slipstream-demo] [data-gp-enter]{min-height:46px;padding:0 20px;gap:12px;background:#e8702a;border:1px solid rgba(255,255,255,0.15);border-radius:9999px;color:#fff;font-size:13px;font-weight:600;box-shadow:0 4px 20px rgba(232,112,42,0.35);transition:background .18s,box-shadow .18s,transform .18s;}
        [data-slipstream-demo] [data-gp-enter]:hover{background:#d2611f;box-shadow:0 6px 26px rgba(232,112,42,0.5);transform:scale(1.03);}
        [data-slipstream-demo] [data-gp-enter]:focus-visible{outline:2px solid #e8702a;outline-offset:4px;}
        [data-slipstream-demo] [data-gp-touch-picker]{top:auto;bottom:18px;left:50%;}
        [data-slipstream-demo] [data-gp-select]{border-color:rgba(255,255,255,0.2);border-radius:8px;font-size:12px;color:#fff;background:#18181b;}
        [data-sublime-header]{position:absolute;inset:clamp(24px,4.5cqw,48px) clamp(24px,5cqw,64px) auto;display:flex;align-items:center;justify-content:space-between;gap:20px;z-index:10;}
        [data-sublime-logo]{font-size:19px;font-weight:700;letter-spacing:-.04em;color:#fff;display:flex;align-items:center;gap:8px;}
        [data-sublime-category]{font-size:12px;line-height:1.5;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:6px;}
        [data-sublime-eyebrow]{position:absolute;inset:auto 24px calc(100% - var(--gp-word-top,35%) + 32px);margin:0;text-align:center;font-size:13px;font-weight:500;line-height:1.5;letter-spacing:.02em;color:#e8702a;display:flex;align-items:center;justify-content:center;gap:6px;}
        [data-sublime-support]{position:absolute;inset:calc(var(--gp-word-bottom,50%) + 32px) 24px auto;margin:0;text-align:center;font-size:16px;font-weight:400;line-height:1.5;color:rgba(255,255,255,0.85);}
        [data-sublime-scroll]{position:absolute;inset:auto 24px 7%;text-align:center;color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:.02em;display:flex;align-items:center;justify-content:center;gap:6px;}
        @media(any-pointer:coarse){[data-sublime-scroll]{bottom:13%;}}
        @container(max-width:450px){[data-sublime-category]{max-width:14ch;text-align:right;}[data-sublime-eyebrow]{font-size:12px;}[data-sublime-support]{font-size:14px;}[data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 76px);}}
        @container(max-height:479px){[data-sublime-header]{top:18px;}[data-sublime-support]{top:calc(var(--gp-word-bottom,50%) + 16px);}[data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 60px);}[data-sublime-scroll]{display:none;}}
        [data-slipstream-demo] [data-gp-content]{padding:5.5rem clamp(1.25rem,5cqw,5rem) 6.5rem;font-family:inherit;}
        [data-slipstream-demo] section,[data-slipstream-demo] [data-gp-caption]{font-family:inherit;}
        [data-slipstream-copy]{display:flex;width:min(100%,80rem);margin:auto;flex-direction:column;align-items:flex-start;gap:clamp(2rem,5svh,3.5rem);}
        [data-slipstream-copy] h2{max-width:48rem;margin:0;color:#fff;font-size:clamp(1.75rem,1.1rem + 2.1cqw,2.25rem);font-weight:600;line-height:1.25;letter-spacing:-0.03em;text-wrap:balance;}
        [data-slipstream-features]{display:grid;width:100%;grid-template-columns:1fr;gap:1.75rem;}
        [data-slipstream-feature]{border-top:1px solid rgba(255,255,255,.14);padding-top:1.1rem;}
        [data-slipstream-feature] h3{margin:0;color:#fff;font-size:1.125rem;font-weight:600;line-height:1.2;letter-spacing:-0.01em;display:flex;align-items:center;gap:8px;}
        [data-slipstream-feature] p{margin:.55rem 0 0;color:rgba(255,255,255,.75);font-size:.9375rem;line-height:1.55;}
        [data-slipstream-no]{display:inline-block;margin-right:.4rem;color:#e8702a;font:600 .8rem ui-monospace,monospace;letter-spacing:.08em;}
        @container(min-width:768px){[data-slipstream-features]{grid-template-columns:repeat(3,minmax(0,1fr));gap:3.5rem;}}
      `}</style>
      {face ? (
        <GlyphPortal
          word={s.word}
          fontFamily={face}
          fontWeight={900}
          style={{
            fontFamily: face,
            "--gp-paper": "#000000",
            "--gp-ink": "#ffffff",
            "--gp-field": "#0c0805",
            "--gp-foreground": "#ffffff",
          }}
          scrollLength={s.scrollLength}
          interactive={s.interactive}
          annotations={s.annotations}
          enterLabel="Step inside Zae Labs"
          background={
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80"
              alt="Zae Labs Cyberpunk Ambient Background"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}
            />
          }
          front={
            <>
              <div data-sublime-header>
                <span data-sublime-logo>
                  <Sparkles size={18} color="#e8702a" /> Zae Labs
                </span>
                <span data-sublime-category>
                  <Compass size={14} /> AI Workflows & Experiments
                </span>
              </div>
              <p data-sublime-eyebrow>
                <Layers size={14} /> Interactive 3D Scroll Portal
              </p>
              <p data-sublime-support>Choose any letter in ZAE LABS, then scroll to zoom in.</p>
              <span data-sublime-scroll>
                Scroll for a closer look <ArrowDown size={14} />
              </span>
            </>
          }
        >
          <div data-slipstream-copy>
            <h2>Ideas engineered into real digital products.</h2>
            <div data-slipstream-features>
              <div data-slipstream-feature>
                <h3>
                  <span data-slipstream-no>01</span> Choose your way in
                </h3>
                <p>Pick any letter, then scroll. Each path navigates you into deep typography.</p>
              </div>
              <div data-slipstream-feature>
                <h3>
                  <span data-slipstream-no>02</span> Unsplash Ambient Scene
                </h3>
                <p>High-resolution cinematic aesthetics set the stage behind the wordmark.</p>
              </div>
              <div data-slipstream-feature>
                <h3>
                  <span data-slipstream-no>03</span> Real Execution
                </h3>
                <p>Turn prompt architectures into deployed, reliable web systems.</p>
              </div>
            </div>
          </div>
        </GlyphPortal>
      ) : (
        <div role="status" style={{ height: "100%", display: "grid", placeItems: "center", color: "#888", fontSize: 13 }}>
          <Sparkles size={16} className="animate-spin" /> Loading Zae Labs Portal type…
        </div>
      )}
    </div>
  );
}
