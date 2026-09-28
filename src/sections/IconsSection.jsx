import { useState } from "react";
import { YdsIcon, ICON_NAMES } from "../icons.jsx";
import { SizeControl } from "../shared/ui.jsx";

function IconsSection() {
  const [copied, setCopied] = useState(null);
  const [iconSize, setIconSize] = useState("M");
  const sz = iconSize === "S" ? 16 : iconSize === "L" ? 32 : 24;
  const gridMin = iconSize === "S" ? 72 : iconSize === "L" ? 120 : 96;
  const copy = (name) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(null), 1500);
    });
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "11px", color: "#999999" }}>
          YDS 2.0 System Icon — {ICON_NAMES.length}개 · 클릭하면 이름 복사
        </div>
        <div style={{ marginLeft: "auto" }}><SizeControl size={iconSize} onChange={setIconSize} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${gridMin}px, 1fr))`, gap: "8px" }}>
        {ICON_NAMES.map(name => (
          <button key={name} onClick={() => copy(name)}
            style={{ background: copied===name?"#e8f5e8":"#ffffff", border: copied===name?"1px solid #5aaa5a":"1px solid #e5e5e5", borderRadius: "10px", padding: `${sz < 20 ? 10 : 16}px 8px ${sz < 20 ? 8 : 12}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { if (copied!==name) { e.currentTarget.style.background="#eeeeee"; e.currentTarget.style.borderColor="#c0c0c0"; }}}
            onMouseLeave={e => { if (copied!==name) { e.currentTarget.style.background="#ffffff"; e.currentTarget.style.borderColor="#e5e5e5"; }}}>
            <YdsIcon name={name} size={sz} color={copied===name?"#60cc90":"#333333"} />
            <div style={{ fontSize: "9px", color: copied===name?"#60cc90":"#999999", textAlign: "center", wordBreak: "break-all", lineHeight: 1.4 }}>
              {copied===name ? "복사됨" : name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default IconsSection;
