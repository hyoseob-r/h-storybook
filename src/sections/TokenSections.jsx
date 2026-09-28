import { useState } from "react";
import { colors, typography, spacing, radius, elevation, states, metaTokens } from "../tokens";
import { SizeControl } from "../shared/ui.jsx";

// ── Section: Meta Tokens ─────────────────────────────────────────────────────

function MetaTokensSection() {
  const [tab, setTab] = useState("color");
  const [chipSize, setChipSize] = useState("M");

  const tabStyle = (t) => ({
    padding: "6px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600,
    background: tab === t ? "#111111" : "#f0f0f0", color: tab === t ? "#fff" : "#888888", transition: "all 0.15s",
  });

  const sectionLabel = (text) => (
    <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaaaaa", marginBottom: "10px", marginTop: "24px" }}>{text}</div>
  );

  const chipPx = chipSize === "S" ? 32 : chipSize === "L" ? 72 : 48;

  const chip = (label, sub, color) => (
    <div key={label} style={{ display: "flex", flexDirection: "column", gap: "5px", width: `${chipPx + 12}px` }}>
      <div style={{ width: `${chipPx}px`, height: `${chipPx}px`, borderRadius: "8px", background: color || "#eeeeee", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
      <div style={{ fontSize: "9px", fontWeight: 600, color: "#333333", fontFamily: "monospace", lineHeight: "1.3", wordBreak: "break-all" }}>{label}</div>
      {sub && sub !== label && <div style={{ fontSize: "9px", color: "#aaaaaa", fontFamily: "monospace", lineHeight: "1.2" }}>{sub}</div>}
    </div>
  );

  // Color tab
  const renderColors = () => (
    <div>
      <div style={{ background: "#f2f2f2", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "14px 16px", marginBottom: "20px", fontSize: "11px", color: "#888888", lineHeight: "1.8" }}>
        <span style={{ color: "#fa0050", fontWeight: 700 }}>Meta</span> → <span style={{ color: "#0c74e4", fontWeight: 700 }}>Semantic</span> → <span style={{ color: "#10a891", fontWeight: 700 }}>Component</span>
        &nbsp;&nbsp;|&nbsp;&nbsp;Suffix <code style={{ color: "#111111" }}>_d</code> = dark-bg variant &nbsp;·&nbsp; <code style={{ color: "#111111" }}>_i</code> = inverse (dark mode)
      </div>
      {Object.entries(metaTokens.colors).map(([family, tokens]) => (
        <div key={family}>
          {sectionLabel(family)}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 10px" }}>
            {Object.entries(tokens).filter(([, v]) => v).map(([name, hex]) => chip(name, hex, hex))}
          </div>
        </div>
      ))}
    </div>
  );

  // Typography tab
  const renderTypography = () => (
    <div>
      <div style={{ background: "#f2f2f2", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "14px 16px", marginBottom: "20px", fontSize: "11px", color: "#888888", lineHeight: "1.8" }}>
        <span style={{ color: "#111111", fontWeight: 700 }}>meta_sf_</span><span style={{ color: "#555555" }}>{"{size}"}</span><span style={{ color: "#111111", fontWeight: 700 }}>_</span><span style={{ color: "#555555" }}>{"{r|b}"}</span>
        &nbsp;&nbsp;·&nbsp;&nbsp; Typeface: SD Neo / SF Pro Display (iOS) &nbsp;·&nbsp; Noto Sans / Roboto (Android)
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px" }}>
        {Object.entries(metaTokens.typography).map(([name, spec]) => (
          <div key={name} style={{ background: "#f8f8f8", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#111111", fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: `${Math.min(spec.size, 20)}px`, fontWeight: spec.weight, lineHeight: `${spec.lineHeight}px`, color: "#111111", whiteSpace: "nowrap", overflow: "hidden" }}>
              Ag — {spec.size}px
            </div>
            <div style={{ fontSize: "9px", color: "#999999", fontFamily: "monospace" }}>size:{spec.size} lh:{spec.lineHeight} w:{spec.weight}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Radius tab
  const renderRadius = () => (
    <div>
      <div style={{ background: "#f2f2f2", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "14px 16px", marginBottom: "20px", fontSize: "11px", color: "#888888" }}>
        <span style={{ color: "#111111", fontWeight: 700 }}>meta_r0–r6</span> &nbsp;+&nbsp; <span style={{ color: "#111111", fontWeight: 700 }}>rfull</span> &nbsp;·&nbsp; Values: 0, 4, 8, 10, 12, 16, 20 &nbsp;·&nbsp; rfull = 360
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {Object.entries(metaTokens.radius).map(([name, value]) => (
          <div key={name} style={{ background: "#f8f8f8", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "64px", height: "64px", background: "#11111110", border: "1.5px solid #111111", borderRadius: `${Math.min(value, 32)}px` }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#333333", fontWeight: 700 }}>{name}</div>
              <div style={{ fontSize: "10px", color: "#999999", marginTop: "2px" }}>{value === 360 ? "360 (full)" : `${value}dp`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSpacing = () => (
    <div>
      <div style={{ background: "#f2f2f2", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "14px 16px", marginBottom: "20px", fontSize: "11px", color: "#888888" }}>
        <span style={{ color: "#111111", fontWeight: 700 }}>meta_s1–s13</span> &nbsp;·&nbsp; ≤12dp: 2의 배수 &nbsp;·&nbsp; &gt;12dp: 4의 배수 &nbsp;·&nbsp; Range: 2→40dp
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "flex-end" }}>
        {Object.entries(metaTokens.spacing).map(([name, value]) => (
          <div key={name} style={{ background: "#f8f8f8", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "12px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div style={{ width: `${Math.min(value * 2.5, 80)}px`, height: `${Math.min(value * 2.5, 80)}px`, background: value <= 12 ? "#11111115" : "#11111130", border: `1.5px solid ${value <= 12 ? "#cccccc" : "#111111"}`, borderRadius: "50%", minWidth: "8px", minHeight: "8px" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#333333", fontWeight: 700 }}>{name}</div>
              <div style={{ fontSize: "11px", color: "#111111", marginTop: "2px", fontWeight: 700 }}>{value}dp</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "16px", fontSize: "10px", color: "#bbbbbb" }}>
        <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#11111115", border: "1px solid #cccccc", marginRight: "6px", verticalAlign: "middle" }} />필요시 사용 (2, 4, 6, 8, 10, 12)
        &nbsp;&nbsp;
        <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#11111130", border: "1px solid #111111", marginRight: "6px", verticalAlign: "middle" }} />우선 사용 (16→40)
      </div>
    </div>
  );

  return (
    <div style={{ padding: "32px", maxWidth: "1100px" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px", alignItems: "center" }}>
        {["color", "typography", "radius", "spacing"].map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          {tab === "color" && <SizeControl size={chipSize} onChange={setChipSize} />}
        </div>
      </div>
      {tab === "color"      && renderColors()}
      {tab === "typography" && renderTypography()}
      {tab === "radius"     && renderRadius()}
      {tab === "spacing"    && renderSpacing()}
    </div>
  );
}

// ── Section: Colors ───────────────────────────────────────────────────────────

function ColorsSection() {
  const [chipSize, setChipSize] = useState("M");
  const px = chipSize === "S" ? 32 : chipSize === "L" ? 72 : 48;

  const chip = (name, hex) => (
    <div key={name} onClick={() => navigator.clipboard.writeText(hex)}
      style={{ display: "flex", flexDirection: "column", gap: "5px", width: `${px + 12}px`, cursor: "pointer" }}>
      <div style={{ width: `${px}px`, height: `${px}px`, borderRadius: "8px", background: hex, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
      <div style={{ fontSize: "9px", fontWeight: 600, color: "#333333", fontFamily: "monospace", lineHeight: "1.3", wordBreak: "break-all" }}>{name}</div>
      <div style={{ fontSize: "9px", color: "#aaaaaa", fontFamily: "monospace", lineHeight: "1.2" }}>{hex}</div>
    </div>
  );

  const sectionLabel = (text) => (
    <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaaaaa", marginBottom: "10px", marginTop: "24px" }}>{text}</div>
  );

  const allLight = Object.values(colors.light);
  const overlays = Object.values(states.overlay);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
        <SizeControl size={chipSize} onChange={setChipSize} />
      </div>

      {sectionLabel("Foundation")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 10px" }}>
        {Object.values(colors.foundation).map(t => chip(t.name, t.value))}
      </div>

      {sectionLabel("Light / Extended Palette")}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
        <div style={{ fontSize: "10px", color: "#999999", background: "#ffffff", border: "1px solid #e5e5e5", padding: "2px 8px", borderRadius: "4px" }}>규칙.1 숫자 없음 → TextColor #FFF or #333</div>
        <div style={{ fontSize: "10px", color: "#999999", background: "#ffffff", border: "1px solid #e5e5e5", padding: "2px 8px", borderRadius: "4px" }}>규칙.2 _100 suffix → TextColor = base 색</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 10px" }}>
        {allLight.map(t => chip(t.name, t.value))}
      </div>

      {sectionLabel("Gray Scale")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 10px" }}>
        {Object.values(colors.gray).map(t => chip(t.name, t.value))}
      </div>

      {sectionLabel("Background")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 10px" }}>
        {Object.values(colors.background).map(t => chip(t.name, t.value))}
      </div>

      {sectionLabel("Variant")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 10px" }}>
        {Object.values(colors.variant).map(t => chip(t.name, t.value))}
      </div>

      {sectionLabel("States / Overlay")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 10px" }}>
        {overlays.map(o => (
          <div key={o.name} style={{ display: "flex", flexDirection: "column", gap: "5px", width: `${px + 12}px` }}>
            <div style={{ width: `${px}px`, height: `${px}px`, borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-conic-gradient(#bbbbbb 0% 25%, #e5e5e5 0% 50%)", backgroundSize: "8px 8px" }} />
              <div style={{ position: "absolute", inset: 0, background: o.value }} />
            </div>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "#333333", fontFamily: "monospace", lineHeight: "1.3", wordBreak: "break-all" }}>{o.name}</div>
            <div style={{ fontSize: "9px", color: "#aaaaaa", fontFamily: "monospace", lineHeight: "1.2" }}>opacity {o.opacity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Typography ───────────────────────────────────────────────────────

function TypographySection() {
  const [typoSize, setTypoSize] = useState("M");
  const scale = typoSize === "S" ? 0.7 : typoSize === "L" ? 1.5 : 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
        <SizeControl size={typoSize} onChange={setTypoSize} />
      </div>
      {typography.map(t => (
        <div key={t.name} style={{ padding: "16px 20px", background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "10px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "180px", flexShrink: 0 }}>
            <div style={{ fontSize: "10px", color: "#999999", marginBottom: "2px", fontFamily: "monospace" }}>{t.name}</div>
            <div style={{ fontSize: "10px", color: "#c0c0c0" }}>{t.size}px · {t.style} · lh {t.lineHeight}</div>
          </div>
          <div style={{ fontFamily: "Roboto, sans-serif", fontSize: `${Math.round(t.size * scale)}px`, fontWeight: t.weight, lineHeight: `${Math.round(t.lineHeight * scale)}px`, color: "#111111", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            요기요-배달할때마다 포인트 적립 Points earned with every delivery
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Section: Spacing & Radius ─────────────────────────────────────────────────

function SpacingSection() {
  const [spacingSize, setSpacingSize] = useState("M");
  const mult = spacingSize === "S" ? 2 : spacingSize === "L" ? 7 : 4;
  const [radiusSize, setRadiusSize] = useState("M");
  const radiusPx = radiusSize === "S" ? 48 : radiusSize === "L" ? 96 : 64;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ fontSize: "11px", color: "#999999", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Spacing</div>
          <div style={{ marginLeft: "auto" }}><SizeControl size={spacingSize} onChange={setSpacingSize} /></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {spacing.map(s => (
            <div key={s.name} style={{ padding: "12px 20px", background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "10px", display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "60px", fontSize: "12px", color: "#888888", fontFamily: "monospace" }}>{s.name}</div>
              <div style={{ width: `${Math.min(s.value * mult, 400)}px`, height: "20px", background: "#11111115", border: "1px solid #cccccc", borderRadius: "3px", transition: "width 0.2s" }} />
              <div style={{ fontSize: "12px", color: "#999999" }}>{s.value}px</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ fontSize: "11px", color: "#999999", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Border Radius</div>
          <div style={{ marginLeft: "auto" }}><SizeControl size={radiusSize} onChange={setRadiusSize} /></div>
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {radius.map(r => (
            <div key={r.name} style={{ padding: "16px 20px", background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ width: `${radiusPx}px`, height: `${radiusPx}px`, background: "#11111110", border: "1.5px solid #111111", borderRadius: `${Math.min(r.value / 20 * radiusPx / 2, radiusPx / 2)}px`, transition: "all 0.2s" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#333333", fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: "10px", color: "#999999", marginTop: "2px" }}>{r.value}px</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Section: Elevation / Shadow ──────────────────────────────────────────────

function ElevationSection() {
  const [selPlatform, setSelPlatform] = useState("swiftui");
  const [elevSize, setElevSize] = useState("M");
  const [selLevel, setSelLevel] = useState(0);
  const platforms = ["swiftui", "ios", "compose", "android", "css", "react"];
  const platLabel = { swiftui: "SwiftUI", ios: "UIKit", compose: "Jetpack Compose", android: "Android XML", css: "CSS", react: "React" };
  const previewW = elevSize === "S" ? 72 : elevSize === "L" ? 160 : 110;
  const previewH = elevSize === "S" ? 44 : elevSize === "L" ? 96 : 64;
  const lv = elevation[selLevel];

  const codeStr = selPlatform === "swiftui" ? lv.swiftui
    : selPlatform === "ios"     ? `layer.shadowColor = UIColor(red: 0.098, green: 0.188, blue: 0.251, alpha: 1).cgColor\nlayer.${lv.ios}`
    : selPlatform === "compose" ? `Modifier.shadow(${lv.compose}, shape = RoundedCornerShape(12.dp))`
    : selPlatform === "android" ? `android:elevation="${lv.android.replace("elevation: ", "").replace("dp","")}" />`
    : selPlatform === "css"     ? `.element {\n  box-shadow: ${lv.css};\n}`
    : `<div style={{ boxShadow: '${lv.css}' }} />`;

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

      {/* ── Left: level list + previews ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaaaaa" }}>Levels</span>
          <SizeControl size={elevSize} onChange={setElevSize} />
        </div>
        {elevation.map((lv, i) => (
          <div key={lv.name} onClick={() => setSelLevel(i)}
            style={{ padding: "14px 16px", background: selLevel === i ? "#f0f0f0" : "#ffffff", border: selLevel === i ? "1px solid #cccccc" : "1px solid #e5e5e5", borderRadius: "12px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "12px", transition: "all 0.15s" }}
            onMouseEnter={e => { if (selLevel !== i) e.currentTarget.style.background = "#f8f8f8"; }}
            onMouseLeave={e => { if (selLevel !== i) e.currentTarget.style.background = "#ffffff"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <code style={{ fontSize: "10px", color: "#888888", background: "#f0f0f0", padding: "1px 6px", borderRadius: "4px" }}>{lv.name}</code>
              <span style={{ fontSize: "11px", color: "#333333", fontWeight: 600 }}>{lv.label}</span>
              <span style={{ fontSize: "9px", color: "#cccccc", letterSpacing: "0.08em" }}>{lv.direction === "up" ? "↑ up" : "↓ down"}</span>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ width: `${previewW}px`, height: `${previewH}px`, background: "#ffffff", borderRadius: "10px", boxShadow: lv.css, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                <span style={{ fontSize: "9px", color: "#bbbbbb", fontFamily: "monospace" }}>{lv.label}</span>
              </div>
              <code style={{ fontSize: "10px", color: "#777777", fontFamily: "monospace", lineHeight: 1.6, wordBreak: "break-all" }}>{lv.css}</code>
            </div>
          </div>
        ))}
      </div>

      {/* ── Right: platform selector + code ── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {platforms.map(p => (
            <button key={p} onClick={() => setSelPlatform(p)}
              style={{ padding: "5px 12px", borderRadius: "6px", background: selPlatform === p ? "#111111" : "#f0f0f0", border: selPlatform === p ? "1px solid #333333" : "1px solid #e5e5e5", color: selPlatform === p ? "#ffffff" : "#888888", fontSize: "11px", cursor: "pointer", fontWeight: selPlatform === p ? 600 : 400, transition: "all 0.15s" }}>
              {platLabel[p]}
            </button>
          ))}
        </div>
        <pre style={{ background: "#f8f8f8", border: "1px solid #e5e5e5", borderRadius: "10px", padding: "16px 18px", fontSize: "12px", color: "#444444", fontFamily: "monospace", overflowX: "auto", lineHeight: 1.7, margin: 0, flex: 1 }}>
          {codeStr}
        </pre>
      </div>

    </div>
  );
}

export { MetaTokensSection, ColorsSection, TypographySection, SpacingSection, ElevationSection };
