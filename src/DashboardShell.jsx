import React from "react";
import { Link } from "react-router-dom";
import { ScanSearch, FileClock, Settings, ArrowLeft } from "lucide-react";

const NAV_ITEMS = [
  { key: "scan", label: "New scan", icon: ScanSearch },
  { key: "reports", label: "My reports", icon: FileClock },
  { key: "account", label: "Account", icon: Settings },
];

const css = `
.rc-shell{ min-height:100vh; display:flex; background:#EFECE3; }
.rc-sidebar{
  width:220px; flex-shrink:0; background:#1A1611; color:#F7F5EF;
  display:flex; flex-direction:column; padding:24px 16px;
  position:sticky; top:0; height:100vh; overflow-y:auto;
}
.rc-logo{ font-family:'Fraunces', serif; font-weight:700; font-size:19px; padding:0 8px; margin-bottom:32px; }
.rc-nav{ display:flex; flex-direction:column; gap:4px; flex:1; }
.rc-nav-btn{
  display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px;
  border:none; background:transparent; color:#B8AF9C; font-size:14px; font-weight:400;
  text-align:left; cursor:pointer; font-family:'Inter', system-ui, sans-serif; width:100%;
}
.rc-nav-btn.active{ background:#241F17; color:#F7F5EF; font-weight:600; }
.rc-back{
  display:flex; align-items:center; gap:8px; padding:10px 12px; margin-top:12px;
  color:#8A8375; font-size:13px; text-decoration:none; font-family:'IBM Plex Mono', monospace;
}
.rc-main{ flex:1; min-width:0; }

@media (max-width: 720px){
  .rc-shell{ flex-direction:column; }
  .rc-sidebar{
    width:100%; height:auto; position:static; flex-direction:row; align-items:center;
    padding:12px 16px; gap:12px; overflow-x:auto;
  }
  .rc-logo{ margin-bottom:0; flex-shrink:0; }
  .rc-nav{ flex-direction:row; flex:none; gap:4px; }
  .rc-nav-btn{ width:auto; white-space:nowrap; padding:8px 10px; font-size:13px; }
  .rc-nav-btn span{ display:none; }
  .rc-back{ margin-top:0; margin-left:auto; padding:8px; flex-shrink:0; }
  .rc-back span{ display:none; }
}
`;

export default function DashboardShell({ activeSection, onSelectSection, children }) {
  return (
    <div className="rc-shell">
      <style>{css}</style>

      <aside className="rc-sidebar">
        <div className="rc-logo">ResumeCheck</div>

        <nav className="rc-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectSection(item.key)}
                className={`rc-nav-btn${active ? " active" : ""}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <Link to="/" className="rc-back">
          <ArrowLeft size={14} />
          <span>Back to home</span>
        </Link>
      </aside>

      <main className="rc-main">{children}</main>
    </div>
  );
}
