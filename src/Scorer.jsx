import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Copy, Upload, FileText, CreditCard } from "lucide-react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Gauge } from "./Gauge.jsx";
import { fontImports } from "./fonts.js";
import DashboardShell from "./DashboardShell.jsx";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

function ComingSoon({ title, body }) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1, color: "#8A8375", marginBottom: 8 }}>
        COMING SOON
      </div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, margin: "0 0 10px", color: "#1A1611" }}>
        {title}
      </h1>
      <p style={{ color: "#54503F", fontSize: 15, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}

function SeverityIcon({ level }) {
  if (level === "critical") return <XCircle size={16} color="#A93226" style={{ flexShrink: 0, marginTop: 2 }} />;
  if (level === "warning") return <AlertTriangle size={16} color="#B8863B" style={{ flexShrink: 0, marginTop: 2 }} />;
  return <CheckCircle2 size={16} color="#2E5339" style={{ flexShrink: 0, marginTop: 2 }} />;
}

const SECTION_LABELS = {
  critical: "Critical issues",
  warning: "Needs improvement",
  pass: "Working well",
};

const SECTION_TINTS = {
  "#A93226": "#FBEEEC",
  "#B8863B": "#FBF3E6",
  "#2E5339": "#EDF3EE",
};

function ReportSection({ title, color, items }) {
  if (!items.length) return null;
  const tint = SECTION_TINTS[color] || "#F7F5EF";
  return (
    <div
      style={{
        marginTop: 16,
        background: tint,
        borderLeft: `3px solid ${color}`,
        borderRadius: 8,
        padding: "16px 18px",
      }}
    >
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 0.5, color, marginBottom: 12, fontWeight: 700 }}>
        {title.toUpperCase()} · {items.length}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <SeverityIcon level={f.severity} />
            <span style={{ fontSize: 14, lineHeight: 1.5, color: "#1A1611" }}>{f.point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        letterSpacing: 0.5,
        color: "#54503F",
        fontWeight: 700,
        marginBottom: 12,
        paddingTop: 24,
        borderTop: "1px solid #C9C2AE",
      }}
    >
      {children.toUpperCase()}
    </div>
  );
}

function PaidReport({ result, keywordGaps, onRescan }) {
  const critical = result.findings.filter((f) => f.severity === "critical");
  const warning = result.findings.filter((f) => f.severity === "warning");
  const pass = result.findings.filter((f) => f.severity !== "critical" && f.severity !== "warning");
  const rewrites = Array.isArray(result.rewriteSuggestions) ? result.rewriteSuggestions : null;

  return (
    <div>
      <div style={{ borderTop: "1px solid #C9C2AE", marginTop: 24, paddingTop: 4 }} />

      <ReportSection title="Critical issues" color="#A93226" items={critical} />
      <ReportSection title="Needs improvement" color="#B8863B" items={warning} />
      <ReportSection title="Working well" color="#2E5339" items={pass} />

      <div>
        <SectionHeader>Keyword gap analysis</SectionHeader>
        {!keywordGaps ? (
          <p style={{ fontSize: 14, color: "#54503F", margin: 0 }}>
            Paste the job description above to check your resume against it.
          </p>
        ) : keywordGaps.missing.length === 0 ? (
          <p style={{ fontSize: 14, color: "#2E5339", margin: 0 }}>
            Your resume covers every keyword we found in the job description.
          </p>
        ) : (
          <div>
            <p style={{ fontSize: 14, color: "#54503F", marginBottom: 10 }}>
              These words appear in the job description but not in your resume.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {keywordGaps.missing.map((k) => (
                <span
                  key={k}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    padding: "5px 10px",
                    borderRadius: 6,
                    border: "1px solid #A93226",
                    color: "#A93226",
                  }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <SectionHeader>Rewrite suggestions</SectionHeader>
        {rewrites === null ? (
          <p style={{ fontSize: 14, color: "#54503F", margin: 0 }}>
            Rewrite suggestions are not available for this scan yet. This feature is being finished on our end.
          </p>
        ) : rewrites.length === 0 ? (
          <p style={{ fontSize: 14, color: "#2E5339", margin: 0 }}>Nothing flagged. No rewrites needed.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rewrites.map((r, i) => (
              <div key={i} style={{ background: "#F0EEE6", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 13, color: "#A93226", marginBottom: 4 }}>Before: {r.original}</div>
                <div style={{ fontSize: 14, color: "#1A1611", fontWeight: 600 }}>After: {r.rewrite}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onRescan}
        style={{
          marginTop: 26,
          padding: "12px 20px",
          borderRadius: 8,
          border: "1px solid #1A1611",
          background: "none",
          color: "#1A1611",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Score another resume
      </button>
    </div>
  );
}

const PRICE_LABEL = import.meta.env.VITE_PRICE_LABEL || "₦1,500";

export default function Scorer() {
  const [searchParams] = useSearchParams();
  const [tier, setTier] = useState(() => {
    if (searchParams.has("reference") || searchParams.has("trxref")) return "paid";
    return searchParams.get("tier") === "free" ? "free" : "paid";
  });

  const [unlocked, setUnlocked] = useState(false);
  const [activeSection, setActiveSection] = useState("scan");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  const [email, setEmail] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const [returningFromPayment, setReturningFromPayment] = useState(false);
  const [justPaidCode, setJustPaidCode] = useState("");

  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [parsing, setParsing] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [codeSpent, setCodeSpent] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "";

  // Restore a saved session so refreshing the page doesn't force the person
  // to pay or re-enter their code again.
  useEffect(() => {
    const savedCode = sessionStorage.getItem("rc_code");
    const savedTier = sessionStorage.getItem("rc_tier");
    if (!savedCode) return;

    fetch(`${apiUrl}/api/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: savedCode }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Code no longer valid.");
        setCodeInput(savedCode);
        if (savedTier) setTier(savedTier);
        setUnlocked(true);
      })
      .catch(() => {
        sessionStorage.removeItem("rc_code");
        sessionStorage.removeItem("rc_tier");
      });
  }, [apiUrl]);

  // If Paystack just redirected back here with ?reference=..., confirm the
  // payment and pick up the code it generated.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) return;

    setReturningFromPayment(true);
    window.history.replaceState({}, "", window.location.pathname);

    fetch(`${apiUrl}/api/pay/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Payment could not be verified.");
        setJustPaidCode(data.code);
        setCodeInput(data.code);
      })
      .catch((err) => setPayError(err.message))
      .finally(() => setReturningFromPayment(false));
  }, [apiUrl]);

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = () => reject(new Error("Read failed"));
      reader.readAsDataURL(file);
    });
  }

  async function extractPdfText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    const pageTexts = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str || "");
      pageTexts.push(strings.join(" "));
    }
    return pageTexts.join("\n\n");
  }

  async function handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFileError("");
    setParsing(true);
    setResumeText("");

    const ext = file.name.split(".").pop().toLowerCase();

    try {
      if (ext === "txt") {
        const text = await file.text();
        setResumeText(text);
        setFileName(file.name);
      } else if (ext === "pdf") {
        const text = await extractPdfText(file);
        if (!text.trim()) {
          setFileError("Could not extract text from the PDF. Paste your resume text instead.");
        } else {
          setResumeText(text);
          setFileName(file.name);
        }
      } else if (["png", "jpg", "jpeg", "webp"].includes(ext)) {
        setFileError("Image upload is not supported with this model. Use PDF or .txt, or paste text directly.");
      } else if (ext === "docx") {
        setFileError("Open the file in Word or Google Docs, select all, copy, and paste the text below.");
      } else {
        setFileError("Use a .pdf or .txt file, or paste your resume text directly below.");
      }
    } catch (err) {
      setFileError("Could not read that file. Paste your resume text directly instead.");
    } finally {
      setParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handlePay() {
    setPayError("");
    const cleanedEmail = email.trim();
    if (!cleanedEmail || !cleanedEmail.includes("@")) {
      setPayError("Enter a valid email. Paystack sends your receipt there.");
      return;
    }
    setPayLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/pay/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanedEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not start payment.");
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setPayError(err.message);
      setPayLoading(false);
    }
  }

  async function handleUnlock() {
    const cleaned = codeInput.trim().toUpperCase();
    if (!cleaned) {
      setCodeError("Enter the code you got after payment.");
      return;
    }
    setUnlocking(true);
    setCodeError("");
    try {
      const response = await fetch(`${apiUrl}/api/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleaned }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "That code doesn't match.");
      setCodeInput(cleaned);
      setUnlocked(true);
      sessionStorage.setItem("rc_code", cleaned);
      sessionStorage.setItem("rc_tier", tier);
    } catch (err) {
      setCodeError(err.message);
    } finally {
      setUnlocking(false);
    }
  }

  function handleCodeKeyDown(e) {
    if (e.key === "Enter") handleUnlock();
  }

  async function handleAnalyze() {
    const hasText = resumeText.trim().length >= 100;
    if (!hasText) {
      setError("Upload a PDF or .txt file, or paste the full resume text. That looks too short to score fairly.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${apiUrl}/api/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          role,
          jobDescription,
          code: tier === "free" ? "" : codeInput.trim().toUpperCase(),
          tier,
        }),
      });

      const data = await response.json();

      if (response.status === 403) {
        if (tier === "free") {
          // Backend doesn't support scoring without a paid code yet. Send the
          // person to the paid flow instead of showing a confusing "code invalid" error.
          setError("Free scoring needs a small backend change first. Get the full report to continue for now.");
          return;
        }
        // Code was invalid or already spent server-side. Send them back to the paywall.
        setUnlocked(false);
        setCodeSpent(true);
        setCodeInput("");
        throw new Error(data.error || "That code is no longer valid.");
      }

      if (!response.ok || typeof data.score !== "number") {
        throw new Error(data.error || "Scoring failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something broke while scoring. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  const STOPWORDS = new Set([
    "the", "and", "for", "with", "that", "this", "you", "your", "will", "have",
    "are", "our", "who", "can", "from", "each", "must", "not", "all", "any",
    "role", "team", "work", "job", "years", "year", "including", "such", "into",
    "using", "than", "they", "their", "them", "which", "about", "also", "more",
    "other", "some", "these", "those", "were", "been", "being", "over", "when",
    "where", "what", "how", "then", "there", "here", "under", "within",
  ]);

  function extractKeywords(text) {
    const counts = {};
    text
      .toLowerCase()
      .split(/[^a-z0-9+/]+/)
      .filter((w) => w.length >= 4 && !STOPWORDS.has(w))
      .forEach((w) => {
        counts[w] = (counts[w] || 0) + 1;
      });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([w]) => w);
  }

  function getKeywordGaps() {
    if (!jobDescription.trim()) return null;
    const jdKeywords = extractKeywords(jobDescription);
    const resumeLower = resumeText.toLowerCase();
    const missing = jdKeywords.filter((k) => !resumeLower.includes(k));
    const present = jdKeywords.filter((k) => resumeLower.includes(k));
    return { missing, present };
  }

  function copyReport() {
    if (!result) return;
    const lines = [
      `Resume Score: ${result.score}/100`,
      `Verdict: ${result.verdict}`,
      "",
      ...(tier === "free" ? ["Full breakdown available with the paid report."] : result.findings.map((f) => `[${f.severity.toUpperCase()}] ${f.point}`)),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const containerStyle = {
    minHeight: "100vh",
    background: "#1A1611",
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "#F7F5EF",
    padding: "0",
  };

  if (!unlocked && tier !== "free") {
    return (
      <div style={{ ...containerStyle, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <style>{fontImports}</style>
        <div
          style={{
            background: "#F7F5EF",
            color: "#1A1611",
            borderRadius: 16,
            padding: "36px 28px",
            width: "100%",
            maxWidth: 400,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <Link
            to="/"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              color: "#8A8375",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            ← Back
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Lock size={20} color="#1A1611" />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1, color: "#8A8375" }}>
              ACCESS REQUIRED
            </span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, margin: "8px 0 4px" }}>
            ResumeCheck
          </h1>
          <p style={{ fontSize: 14, color: "#54503F", marginBottom: 20, lineHeight: 1.5 }}>
            An honest recruiter's read on your resume, for any field. One code works for 30 days.
          </p>

          {codeSpent && (
            <div style={{ fontSize: 13, color: "#A93226", marginBottom: 16, lineHeight: 1.4 }}>
              That code is invalid or has expired. Pay again below to get a fresh one.
            </div>
          )}

          {justPaidCode && (
            <div
              style={{
                background: "#E8EDE4",
                border: "1px solid #2E5339",
                borderRadius: 8,
                padding: "12px 14px",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 12, color: "#2E5339", marginBottom: 4 }}>Payment confirmed. Your code:</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 700 }}>{justPaidCode}</div>
              <div style={{ fontSize: 11, color: "#5F6B56", marginTop: 4 }}>Save this. It works for 30 days.</div>
            </div>
          )}

          {returningFromPayment && (
            <div style={{ fontSize: 13, color: "#54503F", marginBottom: 16 }}>Confirming your payment...</div>
          )}

          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#54503F", display: "block", marginBottom: 6 }}>
              Get a code ({PRICE_LABEL})
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1.5px solid #C9C2AE",
                fontSize: 14,
                marginBottom: 10,
                outline: "none",
              }}
            />
            {payError && <div style={{ color: "#A93226", fontSize: 13, marginBottom: 10 }}>{payError}</div>}
            <button
              onClick={handlePay}
              disabled={payLoading}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "none",
                background: payLoading ? "#4A453A" : "#B8863B",
                color: "#1A1611",
                fontSize: 15,
                fontWeight: 700,
                cursor: payLoading ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <CreditCard size={16} />
              {payLoading ? "Starting payment..." : `Pay ${PRICE_LABEL} with Paystack`}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0", color: "#B8AF9C", fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: "#E6E2D5" }} />
            or enter a code you already have
            <div style={{ flex: 1, height: 1, background: "#E6E2D5" }} />
          </div>

          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            onKeyDown={handleCodeKeyDown}
            placeholder="Access code"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 14px",
              borderRadius: 8,
              border: "1.5px solid #C9C2AE",
              fontSize: 15,
              fontFamily: "'IBM Plex Mono', monospace",
              marginBottom: 10,
              outline: "none",
            }}
          />
          {codeError && <div style={{ color: "#A93226", fontSize: 13, marginBottom: 10 }}>{codeError}</div>}
          <button
            onClick={handleUnlock}
            disabled={unlocking}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 8,
              border: "none",
              background: "#1A1611",
              color: "#F7F5EF",
              fontSize: 15,
              fontWeight: 600,
              cursor: unlocking ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {unlocking ? "Checking..." : "Unlock"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell activeSection={activeSection} onSelectSection={setActiveSection}>
      <style>{fontImports}</style>

      {activeSection === "reports" && (
        <ComingSoon
          title="My reports"
          body="Your past scans will show up here once report history is built. For now, use Score another resume to run a new scan."
        />
      )}

      {activeSection === "account" && (
        <ComingSoon
          title="Account"
          body="Account settings and code management are coming soon. For now, your access code works for 30 days from purchase."
        />
      )}

      {activeSection === "scan" && (
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 80px" }}>
        <style>{`
          .rc-input, .rc-textarea {
            transition: border-color 0.15s, box-shadow 0.15s;
          }
          .rc-input:focus, .rc-textarea:focus {
            border-color: #B8863B !important;
            box-shadow: 0 0 0 3px rgba(184,134,59,0.25);
          }
          .rc-btn-primary:hover:not(:disabled) { opacity: 0.9; }
          .rc-btn-outline:hover { background: #1A1611; color: #F7F5EF; }
          .rc-scan-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
          @media (min-width: 900px) {
            .rc-scan-grid { grid-template-columns: 1fr 1fr; align-items: start; }
            .rc-scan-right { position: sticky; top: 24px; }
          }
        `}</style>

        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1, color: "#8A8375", marginBottom: 8 }}>
          RESUME DIAGNOSTIC
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 700, margin: "0 0 8px" }}>
          Will this resume get you an interview?
        </h1>
        <p style={{ color: "#B8AF9C", fontSize: 15, lineHeight: 1.5, marginBottom: 36 }}>
          Paste your resume text below. You'll get a score, a verdict, and specific fixes, not generic advice.
        </p>

        <div className="rc-scan-grid">
        <div>

        <label style={{ fontSize: 13, fontWeight: 600, color: "#B8AF9C", display: "block", marginBottom: 6 }}>
          Target role (optional)
        </label>
        <input
          className="rc-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Registered Nurse, Sales Manager, Frontend Engineer"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            borderRadius: 8,
            border: "1.5px solid #3A352C",
            background: "#241F17",
            color: "#F7F5EF",
            fontSize: 14,
            marginBottom: 18,
            outline: "none",
          }}
        />

        {tier === "paid" && (
          <>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#B8AF9C", display: "block", marginBottom: 6 }}>
              Job description (optional, unlocks keyword gap analysis)
            </label>
            <textarea
              className="rc-textarea"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting text here"
              rows={4}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1.5px solid #3A352C",
                background: "#241F17",
                color: "#F7F5EF",
                fontSize: 14,
                marginBottom: 18,
                outline: "none",
                resize: "vertical",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            />
          </>
        )}

        <label style={{ fontSize: 13, fontWeight: 600, color: "#B8AF9C", display: "block", marginBottom: 6 }}>
          Resume file or text
        </label>

        <input type="file" ref={fileInputRef} accept=".txt,.pdf" onChange={handleFileUpload} style={{ display: "none" }} />
        <button
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderRadius: 8,
            border: "1.5px dashed #4A453A",
            background: "#241F17",
            color: "#B8AF9C",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          <Upload size={15} />
          {parsing ? "Reading file..." : "Upload PDF or .txt"}
        </button>

        {fileName && !fileError && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2E5339", marginBottom: 10 }}>
            <FileText size={14} />
            {fileName} loaded into the box below.
          </div>
        )}
        {fileError && <div style={{ fontSize: 13, color: "#B8863B", marginBottom: 10, lineHeight: 1.4 }}>{fileError}</div>}

        <div style={{ fontSize: 12, color: "#54503F", marginBottom: 10 }}>Or paste your resume text directly:</div>
        <textarea
          className="rc-textarea"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your full resume text here..."
          rows={10}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px",
            borderRadius: 8,
            border: "1.5px solid #3A352C",
            background: "#241F17",
            color: "#F7F5EF",
            fontSize: 14,
            lineHeight: 1.5,
            resize: "vertical",
            outline: "none",
            fontFamily: "'Inter', sans-serif",
          }}
        />

        {error && <div style={{ color: "#A93226", fontSize: 13, marginTop: 10 }}>{error}</div>}

        <button
          className="rc-btn-primary"
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            marginTop: 18,
            padding: "13px 22px",
            borderRadius: 8,
            border: "none",
            background: loading ? "#4A453A" : "#B8863B",
            color: "#1A1611",
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {loading ? "Scoring..." : "Score my resume"}
          {!loading && <ArrowRight size={16} />}
        </button>

        </div>

        <div className="rc-scan-right">
        {!result && (
          <div
            style={{
              background: "#F7F5EF",
              color: "#54503F",
              borderRadius: 16,
              padding: "32px 24px",
              border: "1px dashed #C9C2AE",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1, color: "#8A8375", marginBottom: 10 }}>
              WAITING FOR INPUT
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Paste or upload your resume, then click "Score my resume." Your score, verdict, and findings show up here.
            </p>
          </div>
        )}

        {result && (
          <div
            style={{
              background: "#F7F5EF",
              color: "#1A1611",
              borderRadius: 16,
              padding: "28px 24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 4 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 48, fontWeight: 700 }}>{result.score}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: "#8A8375" }}>/ 100</span>
            </div>
            <Gauge score={result.score} />

            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 20, lineHeight: 1.4 }}>{result.verdict}</p>

            {tier === "free" ? (
              <div
                style={{
                  marginTop: 20,
                  border: "1px dashed #C9C2AE",
                  borderRadius: 12,
                  padding: "18px 16px",
                }}
              >
                <p style={{ fontSize: 14, color: "#54503F", margin: 0 }}>
                  The full report includes a section by section breakdown, keyword gaps, and rewrite suggestions.
                </p>
                <button
                  onClick={() => {
                    setTier("paid");
                    setResult(null);
                  }}
                  style={{
                    marginTop: 14,
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "none",
                    background: "#B8863B",
                    color: "#1A1611",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Get the full report ({PRICE_LABEL})
                </button>
              </div>
            ) : (
              <PaidReport result={result} keywordGaps={getKeywordGaps()} onRescan={() => setResult(null)} />
            )}

            <button
              className="rc-btn-outline"
              onClick={copyReport}
              style={{
                marginTop: 22,
                padding: "10px 16px",
                borderRadius: 8,
                border: "1.5px solid #1A1611",
                background: "transparent",
                color: "#1A1611",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Copy size={14} /> {copied ? "Copied" : "Copy report"}
            </button>

          </div>
        )}
        </div>
        </div>
      </div>
      )}
    </DashboardShell>
  );
}