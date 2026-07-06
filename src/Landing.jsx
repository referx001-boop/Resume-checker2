import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fontImports } from "./fonts.js";

const PRICE_LABEL = import.meta.env.VITE_PRICE_LABEL || "₦1,500";

const css = `
:root{
  --ink:#1A1611;
  --paper:#EFECE3;
  --paper-light:#F7F5EF;
  --stamp-red:#A93226;
  --seal-gold:#B8863B;
  --pass-green:#2E5339;
  --line:#C9C2AE;
  --line-soft:#DAD5C6;
  --font-display:'Fraunces', serif;
  --font-body:'Inter', sans-serif;
  --font-mono:'IBM Plex Mono', monospace;
}

.rc-landing{ background:var(--paper); color:var(--ink); font-family:var(--font-body); line-height:1.5; -webkit-font-smoothing:antialiased; }
.rc-landing *{box-sizing:border-box;}
.rc-landing a{color:inherit; text-decoration:none;}
.rc-landing .wrap{max-width:1100px; margin:0 auto; padding:0 24px;}
.rc-landing .rule{border:none; border-top:1px solid var(--line); margin:0;}
.rc-landing .rule-thick{border:none; border-top:2px solid var(--ink); margin:0;}
.rc-landing .mono{font-family:var(--font-mono);}
.rc-landing .eyebrow{
  font-family:var(--font-mono); font-size:12px; letter-spacing:0.12em; text-transform:uppercase;
  color:var(--stamp-red); display:flex; align-items:center; gap:8px;
}
.rc-landing .eyebrow::before{content:''; width:16px; height:1px; background:var(--stamp-red); display:inline-block;}
.rc-landing h1, .rc-landing h2, .rc-landing h3{ font-family:var(--font-display); font-weight:600; line-height:1.08; margin:0; }

.rc-landing header{ border-bottom:1px solid var(--line); background:var(--paper); position:sticky; top:0; z-index:50; }
.rc-landing .nav{ display:flex; align-items:center; justify-content:space-between; padding:18px 0; }
.rc-landing .logo{ font-family:var(--font-display); font-weight:700; font-size:20px; display:flex; align-items:center; gap:8px; }
.rc-landing .logo-mark{ width:10px; height:10px; background:var(--stamp-red); border-radius:50%; }
.rc-landing .nav-cta{ font-family:var(--font-mono); font-size:13px; border:1px solid var(--ink); padding:9px 18px; transition:background 0.15s, color 0.15s; background:none; cursor:pointer; }
.rc-landing .nav-cta:hover{background:var(--ink); color:var(--paper);}

.rc-landing .hero{padding:56px 0 40px;}
.rc-landing .doc{ border:1px solid var(--ink); background:var(--paper-light); position:relative; }
.rc-landing .doc-header{
  display:flex; justify-content:space-between; align-items:flex-start; padding:20px 28px;
  border-bottom:1px solid var(--line); font-family:var(--font-mono); font-size:12px; color:#555;
}
.rc-landing .seal{
  width:64px; height:64px; border:1.5px solid var(--seal-gold); border-radius:50%;
  display:flex; align-items:center; justify-content:center; color:var(--seal-gold);
  font-family:var(--font-mono); font-size:9px; text-align:center; letter-spacing:0.08em;
  text-transform:uppercase; line-height:1.3; flex-shrink:0;
}
.rc-landing .doc-body{ padding:48px 28px 40px; }
.rc-landing .hero h1{ font-size:clamp(32px, 5.4vw, 56px); max-width:760px; letter-spacing:-0.01em; }
.rc-landing .hero-sub{ font-size:17px; color:#3d3830; max-width:520px; margin-top:18px; }
.rc-landing .hero-actions{ display:flex; align-items:center; gap:18px; margin-top:32px; flex-wrap:wrap; }
.rc-landing .btn-primary{
  background:var(--ink); color:var(--paper); font-family:var(--font-mono); font-size:14px;
  padding:15px 26px; border:1px solid var(--ink); cursor:pointer; transition:opacity 0.15s;
}
.rc-landing .btn-primary:hover{opacity:0.85;}
.rc-landing .hero-note{font-family:var(--font-mono); font-size:12px; color:#6b6558;}

.rc-landing .score-panel{
  margin-top:44px; border:1px solid var(--line); background:#fff; padding:24px 26px;
  display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap;
}
.rc-landing .score-left{display:flex; align-items:baseline; gap:14px;}
.rc-landing .score-num{ font-family:var(--font-mono); font-size:54px; font-weight:600; line-height:1; }
.rc-landing .score-max{font-family:var(--font-mono); font-size:16px; color:#8a8375;}
.rc-landing .score-label{font-family:var(--font-mono); font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#6b6558; margin-top:4px;}
.rc-landing .stamp{
  font-family:var(--font-mono); font-weight:700; font-size:15px; letter-spacing:0.1em; text-transform:uppercase;
  border:2px solid var(--pass-green); color:var(--pass-green); padding:8px 18px;
  transform:rotate(-6deg) scale(0); opacity:0; transition:transform 0.4s cubic-bezier(.2,1.4,.4,1), opacity 0.3s;
}
.rc-landing .stamp.show{transform:rotate(-6deg) scale(1); opacity:1;}

.rc-landing section{padding:72px 0;}
.rc-landing .section-head{max-width:640px; margin-bottom:40px;}
.rc-landing .section-head h2{font-size:clamp(26px, 3.4vw, 38px); margin-top:14px;}
.rc-landing .problem-body{font-size:16px; color:#3d3830; max-width:620px; margin-top:16px;}

.rc-landing .steps{ display:grid; grid-template-columns:repeat(3, 1fr); gap:0; border-top:1px solid var(--line); border-left:1px solid var(--line); }
.rc-landing .step{ border-right:1px solid var(--line); border-bottom:1px solid var(--line); padding:28px 24px; }
.rc-landing .step-sn{font-family:var(--font-mono); font-size:12px; color:var(--stamp-red); letter-spacing:0.08em;}
.rc-landing .step h3{font-size:19px; margin-top:12px; font-weight:600;}
.rc-landing .step p{font-size:14px; color:#54503f; margin-top:8px;}

.rc-landing .local{background:var(--ink); color:var(--paper);}
.rc-landing .local .eyebrow{color:var(--seal-gold);}
.rc-landing .local .eyebrow::before{background:var(--seal-gold);}
.rc-landing .local-list{margin-top:28px; display:flex; flex-direction:column;}
.rc-landing .local-item{ display:flex; justify-content:space-between; align-items:center; padding:18px 0; border-top:1px solid #3a352c; gap:20px; }
.rc-landing .local-item:last-child{border-bottom:1px solid #3a352c;}
.rc-landing .local-item p{font-size:16px; max-width:560px; margin:0;}
.rc-landing .tag{
  font-family:var(--font-mono); font-size:11px; letter-spacing:0.08em; text-transform:uppercase;
  padding:5px 10px; border:1px solid #6b6558; white-space:nowrap; flex-shrink:0;
}
.rc-landing .tag.live{border-color:var(--pass-green); color:#8fd6a5;}
.rc-landing .tag.soon{border-color:var(--seal-gold); color:var(--seal-gold);}

.rc-landing .pricing-grid{display:grid; grid-template-columns:1fr 1fr; gap:0; border:1px solid var(--ink);}
.rc-landing .price-card{padding:36px 28px; border-right:1px solid var(--ink);}
.rc-landing .price-card:last-child{border-right:none; background:var(--ink); color:var(--paper);}
.rc-landing .price-tier{font-family:var(--font-mono); font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:var(--stamp-red);}
.rc-landing .price-card:last-child .price-tier{color:var(--seal-gold);}
.rc-landing .price-amount{font-family:var(--font-display); font-size:42px; font-weight:600; margin-top:10px;}
.rc-landing .price-features{margin-top:22px; display:flex; flex-direction:column; gap:10px;}
.rc-landing .price-features div{font-size:14px; display:flex; gap:10px;}
.rc-landing .price-features div::before{content:'—'; color:var(--stamp-red); flex-shrink:0;}
.rc-landing .price-card:last-child .price-features div::before{color:var(--seal-gold);}
.rc-landing .price-cta{
  display:inline-block; margin-top:26px; font-family:var(--font-mono); font-size:13px;
  border:1px solid var(--ink); padding:12px 22px; background:none; cursor:pointer; color:inherit;
}
.rc-landing .price-card:last-child .price-cta{border-color:var(--paper);}

.rc-landing .faq-item{border-top:1px solid var(--line);}
.rc-landing .faq-item:last-child{border-bottom:1px solid var(--line);}
.rc-landing .faq-q{ padding:20px 0; display:flex; justify-content:space-between; align-items:center; cursor:pointer; font-size:16px; font-weight:500; }
.rc-landing .faq-sn{font-family:var(--font-mono); font-size:12px; color:#8a8375; margin-right:14px;}
.rc-landing .faq-plus{font-family:var(--font-mono); font-size:18px; color:var(--stamp-red); transition:transform 0.2s; display:inline-block;}
.rc-landing .faq-item.open .faq-plus{transform:rotate(45deg);}
.rc-landing .faq-a{ max-height:0; overflow:hidden; transition:max-height 0.25s ease; font-size:14px; color:#54503f; }
.rc-landing .faq-item.open .faq-a{max-height:200px; padding-bottom:20px;}

.rc-landing .final{text-align:center; padding:88px 0;}
.rc-landing .final h2{font-size:clamp(28px, 4.4vw, 44px); max-width:600px; margin:16px auto 0;}
.rc-landing .final .btn-primary{margin-top:30px;}

.rc-landing footer{
  border-top:1px solid var(--line); padding:28px 0; font-family:var(--font-mono); font-size:12px;
  color:#6b6558; display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;
}

@media (max-width:720px){
  .rc-landing .steps{grid-template-columns:1fr;}
  .rc-landing .pricing-grid{grid-template-columns:1fr;}
  .rc-landing .price-card{border-right:none; border-bottom:1px solid var(--ink);}
  .rc-landing .price-card:last-child{border-bottom:none;}
  .rc-landing .doc-body{padding:36px 20px 32px;}
  .rc-landing .doc-header{padding:16px 20px;}
}
`;

export default function Landing() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [stampShown, setStampShown] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const panelRef = useRef(null);
  const refNum = useRef(String(Math.floor(10000 + Math.random() * 89999))).current;

  useEffect(() => {
    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !played) {
            played = true;
            const target = 78;
            let current = 0;
            const interval = setInterval(() => {
              current += 4;
              if (current >= target) {
                setScore(target);
                clearInterval(interval);
                setStampShown(true);
                return;
              }
              setScore(current);
            }, 24);
          }
        });
      },
      { threshold: 0.5 }
    );
    if (panelRef.current) observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);

  function scrollToPricing(e) {
    e.preventDefault();
    document.getElementById("rc-pricing")?.scrollIntoView({ behavior: "smooth" });
  }

  const faqs = [
    ["What file formats do you accept?", "PDF or plain text. For a DOCX file, open it, copy the text, and paste it in."],
    ["How is my score calculated?", "We check formatting, keyword match, structure, and section completeness against how ATS software actually parses résumés."],
    ["Do you store my résumé?", "[Confirm your data retention policy here.]"],
    ["How do I pay?", `Through Paystack, in naira. ${PRICE_LABEL} gets you the full report and an access code.`],
  ];

  return (
    <div className="rc-landing">
      <style>{fontImports}</style>
      <style>{css}</style>

      <header>
        <div className="wrap nav">
          <div className="logo"><span className="logo-mark"></span>ResumeCheck</div>
          <a href="#rc-pricing" className="nav-cta" onClick={scrollToPricing}>Check your résumé</a>
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <div className="doc">
            <div className="doc-header">
              <span>REF NO: RC-2026-{refNum}</span>
              <div className="seal">Verified<br />Scan</div>
            </div>
            <div className="doc-body">
              <div className="eyebrow">Applicant Tracking System Check</div>
              <h1>Know your ATS score before you apply.</h1>
              <p className="hero-sub">Upload your résumé. Get a score, a section by section breakdown, and fixes you can make in minutes. Built for the Nigerian job market.</p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={scrollToPricing}>Check your résumé</button>
                <span className="hero-note">Free score. Pay for the full breakdown.</span>
              </div>

              <div className="score-panel" ref={panelRef}>
                <div className="score-left">
                  <div>
                    <div className="score-num">{score}</div>
                    <div className="score-label">ATS Score</div>
                  </div>
                  <div className="score-max">/ 100</div>
                </div>
                <div className={`stamp${stampShown ? " show" : ""}`}>Approved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">01 / Why this matters</div>
            <h2>Most résumés get rejected by software, not people.</h2>
          </div>
          <p className="problem-body">An applicant tracking system reads your résumé before a recruiter does. A wrong file format, a missing keyword, or a layout the parser can't read is enough to get you filtered out. You never find out why. You just don't hear back.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">02 / How it works</div>
            <h2>Three steps. No guesswork.</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-sn">S/N 01</div>
              <h3>Upload your résumé</h3>
              <p>PDF or plain text. Takes a few seconds.</p>
            </div>
            <div className="step">
              <div className="step-sn">S/N 02</div>
              <h3>Get your score</h3>
              <p>A full breakdown by section: formatting, keywords, structure, gaps.</p>
            </div>
            <div className="step">
              <div className="step-sn">S/N 03</div>
              <h3>Fix and re-scan</h3>
              <p>Apply the fixes. Re-check before you send it out.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="local">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">03 / Built for Nigeria</div>
            <h2>Most résumé checkers are built for the US and Europe. This one isn't.</h2>
          </div>
          <div className="local-list">
            <div className="local-item">
              <p>AI scoring against real ATS parsing rules, with a full section by section breakdown.</p>
              <span className="tag live">Live</span>
            </div>
            <div className="local-item">
              <p>Reads NYSC status, state of origin, and Nigerian university grading correctly.</p>
              <span className="tag soon">Coming soon</span>
            </div>
            <div className="local-item">
              <p>Checks your résumé against real listings from Jobberman and MyJobMag.</p>
              <span className="tag soon">Coming soon</span>
            </div>
            <div className="local-item">
              <p>Priced in naira. Paid through Paystack.</p>
              <span className="tag live">Live</span>
            </div>
          </div>
        </div>
      </section>

      <section id="rc-pricing">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">04 / Pricing</div>
            <h2>Start free. Pay for the full breakdown.</h2>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-tier">Free scan</div>
              <div className="price-amount">₦0</div>
              <div className="price-features">
                <div>Overall ATS score</div>
                <div>One scan</div>
                <div>No sign-up required</div>
              </div>
              <button className="price-cta" onClick={() => navigate("/app?tier=free")}>Run a free scan</button>
            </div>
            <div className="price-card">
              <div className="price-tier">Full report</div>
              <div className="price-amount">{PRICE_LABEL}</div>
              <div className="price-features">
                <div>Section by section breakdown</div>
                <div>Keyword gap analysis</div>
                <div>Rewrite suggestions</div>
                <div>Unlimited re-scans</div>
              </div>
              <button className="price-cta" onClick={() => navigate("/app?tier=paid")}>Get the full report</button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">05 / Questions</div>
            <h2>Before you start</h2>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <div key={q} className={`faq-item${openFaq === i ? " open" : ""}`}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span><span className="faq-sn">{String(i + 1).padStart(2, "0")}</span>{q}</span>
                  <span className="faq-plus">+</span>
                </div>
                <div className="faq-a">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Ready when you are</div>
          <h2>Check your résumé before you send it.</h2>
          <button className="btn-primary" onClick={scrollToPricing}>Check your résumé</button>
        </div>
      </section>

      <footer>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: 10 }}>
          <span>ResumeCheck © 2026</span>
          <span>Built by Yusuf Media</span>
        </div>
      </footer>
    </div>
  );
}
