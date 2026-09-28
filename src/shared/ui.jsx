import React, { useState } from "react";

// ── Toast system ─────────────────────────────────────────────────────────────
const ToastContext = React.createContext(null);
export function useToast() { return React.useContext(ToastContext); }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = (msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  };
  const icons  = { success: "✓", error: "✕", info: "i", warning: "!" };
  const colors = {
    success: { bg: "#111111", text: "#ffffff", icon: "#4cdd80" },
    error:   { bg: "#2a0a0a", text: "#ffffff", icon: "#ff5555" },
    info:    { bg: "#0a1a2a", text: "#ffffff", icon: "#5599ff" },
    warning: { bg: "#1a1200", text: "#ffffff", icon: "#ffcc44" },
  };
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div style={{ position:"fixed", bottom:"24px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", gap:"8px", zIndex:9999, alignItems:"center", pointerEvents:"none" }}>
        {toasts.map(t => {
          const c = colors[t.type] || colors.info;
          return (
            <div key={t.id} style={{ background:c.bg, color:c.text, borderRadius:"10px", padding:"10px 16px", fontSize:"12px", fontWeight:500, display:"flex", alignItems:"center", gap:"10px", boxShadow:"0 4px 20px rgba(0,0,0,0.25)", whiteSpace:"nowrap", animation:"toastIn 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <span style={{ color:c.icon, fontWeight:700, fontSize:"13px" }}>{icons[t.type]}</span>
              {t.msg}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// ── Copy Button ──────────────────────────────────────────────────────────────
export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{ padding: "4px 10px", background: copied ? "#e8f5e8" : "#f0f0f0", border: `1px solid ${copied ? "#5aaa5a" : "#d0d0d0"}`, borderRadius: "6px", color: copied ? "#2a7a2a" : "#888888", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}>
      {copied ? "복사됨 ✓" : "복사"}
    </button>
  );
}

// ── Code Block ───────────────────────────────────────────────────────────────
export function CodeBlock({ code }) {
  return (
    <div style={{ position: "relative", background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "8px", right: "8px" }}><CopyButton text={code} /></div>
      <pre style={{ margin: 0, padding: "16px", fontSize: "11.5px", lineHeight: "1.7", color: "#333333", overflowX: "auto", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{code}</pre>
    </div>
  );
}

// ── Platform Tabs ────────────────────────────────────────────────────────────
export function PlatformTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].id);
  return (
    <div>
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            style={{ padding: "5px 12px", borderRadius: "6px", background: active === t.id ? "#f0f0f0" : "transparent", border: active === t.id ? "1px solid #c0c0c0" : "1px solid transparent", color: active === t.id ? "#333333" : "#999999", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>
      <CodeBlock code={tabs.find(t => t.id === active)?.code || ""} />
    </div>
  );
}

// ── Size Control ─────────────────────────────────────────────────────────────
export function SizeControl({ size, onChange }) {
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      <span style={{ fontSize: "10px", color: "#bbbbbb", marginRight: "4px", letterSpacing: "0.08em" }}>크기</span>
      {["S", "M", "L"].map(s => (
        <button key={s} onClick={() => onChange(s)}
          style={{ width: "24px", height: "24px", borderRadius: "6px", background: size === s ? "#111111" : "#f0f0f0", border: size === s ? "1px solid #333333" : "1px solid #e5e5e5", color: size === s ? "#ffffff" : "#888888", fontSize: "10px", fontWeight: 700, cursor: "pointer", transition: "all 0.15s", lineHeight: 1 }}>
          {s}
        </button>
      ))}
    </div>
  );
}
