import React, { useState, useRef, useEffect } from "react";
import { colors, typography, spacing, radius, elevation, states, metaTokens } from "./tokens";
import { YdsIcon, YDS_ICONS, ICON_NAMES } from "./icons.jsx";
import { fetchComponents, saveComponent, deleteComponent, renameComponent } from "./supabase.js";

// ── Code generators ──────────────────────────────────────────────────────────

function genButtonCode(platform, variant, size) {
  const bg = variant === "primary" ? "#FA0050" : variant === "secondary" ? "#2591B5" : "#FFFFFF";
  const fg = variant === "outline" ? "#FA0050" : "#FFFFFF";
  const border = variant === "outline" ? "#FA0050" : "none";
  const textSize = size === "large" ? 16 : size === "medium" ? 14 : 12;
  const paddingH = size === "large" ? 20 : size === "medium" ? 16 : 12;
  const paddingV = size === "large" ? 12 : size === "medium" ? 8 : 6;
  const fontWeight = "bold";

  if (platform === "xml") return `<com.google.android.material.button.MaterialButton
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="버튼"
    android:textColor="${fg}"
    android:textSize="${textSize}sp"
    android:fontFamily="@font/roboto_bold"
    android:paddingStart="${paddingH}dp"
    android:paddingEnd="${paddingH}dp"
    android:paddingTop="${paddingV}dp"
    android:paddingBottom="${paddingV}dp"
    app:backgroundTint="${bg}"
    app:cornerRadius="10dp"${variant === "outline" ? `\n    style="@style/Widget.MaterialComponents.Button.OutlinedButton"\n    app:strokeColor="${border}"\n    app:strokeWidth="1dp"` : ""} />`;

  if (platform === "compose") return `Button(
    onClick = { },
    colors = ButtonDefaults.buttonColors(
        containerColor = Color(0xFF${bg.replace("#", "")}),
        contentColor = Color(0xFF${fg.replace("#", "")})
    ),
    shape = RoundedCornerShape(10.dp),
    contentPadding = PaddingValues(
        horizontal = ${paddingH}.dp,
        vertical = ${paddingV}.dp
    )${variant === "outline" ? `,\n    border = BorderStroke(1.dp, Color(0xFF${border.replace("#", "")}))` : ""}
) {
    Text(
        text = "버튼",
        fontSize = ${textSize}.sp,
        fontWeight = FontWeight.Bold
    )
}`;

  if (platform === "swiftui") return `Button("버튼") { }
    .padding(.horizontal, ${paddingH})
    .padding(.vertical, ${paddingV})${variant === "outline"
      ? `\n    .background(Color.white)\n    .foregroundColor(Color(hex: "${bg.replace("#","")}"))\n    .overlay(\n        RoundedRectangle(cornerRadius: 10)\n            .stroke(Color(hex: "${border.replace("#","")}"), lineWidth: 1)\n    )`
      : `\n    .background(Color(hex: "${bg.replace("#","")}"))\n    .foregroundColor(Color(hex: "${fg.replace("#","")}"))\n    .cornerRadius(10)`}
    .font(.system(size: ${textSize}, weight: .bold))`;

  if (platform === "flutter") return `ElevatedButton(
  onPressed: () {},
  style: ElevatedButton.styleFrom(
    backgroundColor: Color(0xFF${bg.replace("#", "")}),
    foregroundColor: Color(0xFF${fg.replace("#", "")}),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(10),${variant === "outline" ? `\n      side: BorderSide(color: Color(0xFF${border.replace("#","")})),` : ""}
    ),
    padding: EdgeInsets.symmetric(
      horizontal: ${paddingH},
      vertical: ${paddingV},
    ),
  ),
  child: Text(
    '버튼',
    style: TextStyle(
      fontSize: ${textSize},
      fontWeight: FontWeight.bold,
    ),
  ),
)`;
  return "";
}

function genLabelCode(platform, color, size) {
  const textSize = size === "large" ? 14 : size === "medium" ? 12 : 10;
  const hex = color === "primary" ? "#FA0050" : color === "secondary" ? "#2591B5" : "#333333";
  const bgHex = color === "primary" ? "#FFF5F8" : color === "secondary" ? "#F0F7FA" : "#F6F6F6";

  if (platform === "xml") return `<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="라벨"
    android:textColor="${hex}"
    android:textSize="${textSize}sp"
    android:fontFamily="@font/roboto_bold"
    android:background="@drawable/bg_label_${color}"
    android:paddingStart="8dp"
    android:paddingEnd="8dp"
    android:paddingTop="2dp"
    android:paddingBottom="2dp" />

<!-- bg_label_${color}.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="${bgHex}" />
    <corners android:radius="10dp" />
</shape>`;

  if (platform === "compose") return `Surface(
    color = Color(0xFF${bgHex.replace("#", "")}),
    shape = RoundedCornerShape(10.dp)
) {
    Text(
        text = "라벨",
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
        color = Color(0xFF${hex.replace("#", "")}),
        fontSize = ${textSize}.sp,
        fontWeight = FontWeight.Bold
    )
}`;

  if (platform === "swiftui") return `Text("라벨")
    .padding(.horizontal, 8)
    .padding(.vertical, 2)
    .background(Color(hex: "${bgHex.replace("#","")}"))
    .foregroundColor(Color(hex: "${hex.replace("#","")}"))
    .cornerRadius(10)
    .font(.system(size: ${textSize}, weight: .bold))`;

  if (platform === "flutter") return `Container(
  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
  decoration: BoxDecoration(
    color: Color(0xFF${bgHex.replace("#", "")}),
    borderRadius: BorderRadius.circular(10),
  ),
  child: Text(
    '라벨',
    style: TextStyle(
      color: Color(0xFF${hex.replace("#", "")}),
      fontSize: ${textSize},
      fontWeight: FontWeight.bold,
    ),
  ),
)`;

  if (platform === "css") return `.label {
  padding: 2px 8px;
  background-color: ${bgHex};
  color: ${hex};
  border-radius: 10px;
  font-size: ${textSize}px;
  font-weight: bold;
  display: inline-block;
}`;

  if (platform === "react") return `<span
  style={{
    padding: '2px 8px',
    backgroundColor: '${bgHex}',
    color: '${hex}',
    borderRadius: 10,
    fontSize: ${textSize},
    fontWeight: 'bold',
  }}
>
  라벨
</span>`;
  return "";
}

// ── UI Components ─────────────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{ padding: "4px 10px", background: copied ? "#e8f5e8" : "#f0f0f0", border: `1px solid ${copied ? "#5aaa5a" : "#d0d0d0"}`, borderRadius: "6px", color: copied ? "#2a7a2a" : "#888888", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}>
      {copied ? "복사됨 ✓" : "복사"}
    </button>
  );
}

function CodeBlock({ code }) {
  return (
    <div style={{ position: "relative", background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "8px", right: "8px" }}><CopyButton text={code} /></div>
      <pre style={{ margin: 0, padding: "16px", fontSize: "11.5px", lineHeight: "1.7", color: "#333333", overflowX: "auto", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{code}</pre>
    </div>
  );
}

function PlatformTabs({ tabs }) {
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

// ── Shared: Size Control ─────────────────────────────────────────────────────
function SizeControl({ size, onChange }) {
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

// ── LabelButton code generator (YDS 2.0) ─────────────────────────────────────

function genLabelButtonCode(platform, shape, colorStyle, size, config, iconName = "chevron_right") {
  const h   = size === "medium" ? 48 : 36;
  const ph  = size === "medium" ? 16 : 12;
  const fs  = size === "medium" ? 14 : 12;
  const r   = size === "medium" ? 10 : 8;

  const bgFilled  = { primary_v2: "#FA0050", gray_v2: "#333333", gray250_v2: "#BFBFBF" };
  const fgFilled  = { primary_v2: "#FFFFFF", gray_v2: "#FFFFFF", gray250_v2: "#333333" };
  const accent    = { primary_v2: "#FA0050", gray_v2: "#333333", gray250_v2: "#BFBFBF" };

  const bg = shape === "filled"   ? bgFilled[colorStyle]  : "transparent";
  const fg = shape === "filled"   ? fgFilled[colorStyle]  : accent[colorStyle];
  const border = shape === "outlined" ? accent[colorStyle] : null;
  const hasLeftIcon  = config === "labelWithLeftIcon";
  const hasRightIcon = config === "labelWithRightIcon";
  const icAndroid = `ic_${iconName}_v2`;
  const icCompose  = `YdsIcon.${iconName.split('_').map(w=>w[0].toUpperCase()+w.slice(1)).join('')}`;
  const icSwiftUI  = `YdsIcon.${iconName}`;
  const icFlutter  = `YdsIcons.${iconName}`;

  if (platform === "xml") return `<com.google.android.material.button.MaterialButton
    android:layout_width="wrap_content"
    android:layout_height="${h}dp"
    android:text="버튼"
    android:textColor="${fg}"
    android:textSize="${fs}sp"
    android:fontFamily="@font/roboto_bold"
    android:paddingStart="${ph}dp"
    android:paddingEnd="${ph}dp"
    app:backgroundTint="${bg}"
    app:cornerRadius="${r}dp"${hasLeftIcon ? `\n    app:icon="@drawable/${icAndroid}"\n    app:iconGravity="start"\n    app:iconSize="${fs+2}dp"\n    app:iconPadding="4dp"` : hasRightIcon ? `\n    app:icon="@drawable/${icAndroid}"\n    app:iconGravity="end"\n    app:iconSize="${fs+2}dp"\n    app:iconPadding="4dp"` : ""}${shape === "outlined" ? `\n    style="@style/Widget.MaterialComponents.Button.OutlinedButton"\n    app:strokeColor="${border}"\n    app:strokeWidth="1dp"` : ""}${shape === "text" ? `\n    style="@style/Widget.MaterialComponents.Button.TextButton"` : ""} />`;

  if (platform === "compose") return `Button(
    onClick = { },
    modifier = Modifier.height(${h}.dp),
    colors = ButtonDefaults.buttonColors(
        containerColor = Color(0xFF${bg.replace("#","")}),
        contentColor = Color(0xFF${fg.replace("#","")})
    ),
    shape = RoundedCornerShape(${r}.dp),
    contentPadding = PaddingValues(horizontal = ${ph}.dp),${shape === "outlined" ? `\n    border = BorderStroke(1.dp, Color(0xFF${(border||"").replace("#","")})),` : ""}
) {${hasLeftIcon ? `\n    Icon(${icCompose}, contentDescription = null, modifier = Modifier.size(${fs+2}.dp))\n    Spacer(Modifier.width(4.dp))` : ""}
    Text("버튼", fontSize = ${fs}.sp, fontWeight = FontWeight.Bold)${hasRightIcon ? `\n    Spacer(Modifier.width(4.dp))\n    Icon(${icCompose}, contentDescription = null, modifier = Modifier.size(${fs+2}.dp))` : ""}
}`;

  if (platform === "swiftui") return `Button(action: {}) {${hasLeftIcon ? `\n    HStack(spacing: 4) {\n        ${icSwiftUI}.image.resizable().frame(width: ${fs+2}, height: ${fs+2})\n        Text("버튼")\n    }` : hasRightIcon ? `\n    HStack(spacing: 4) {\n        Text("버튼")\n        ${icSwiftUI}.image.resizable().frame(width: ${fs+2}, height: ${fs+2})\n    }` : `\n    Text("버튼")`}
}
.frame(height: ${h})
.padding(.horizontal, ${ph})${shape === "filled" ? `\n.background(Color(hex: "${bg}"))\n.foregroundColor(Color(hex: "${fg}"))` : shape === "outlined" ? `\n.overlay(RoundedRectangle(cornerRadius: ${r}).stroke(Color(hex: "${border}"), lineWidth: 1))\n.foregroundColor(Color(hex: "${fg}"))` : `\n.foregroundColor(Color(hex: "${fg}"))`}
.cornerRadius(${r})
.font(.system(size: ${fs}, weight: .bold))`;

  if (platform === "flutter") {
    const child = hasLeftIcon
      ? `Row(mainAxisSize: MainAxisSize.min, children: [SvgPicture.asset('assets/icons/${icAndroid}.svg', width: ${fs+2}, height: ${fs+2}, colorFilter: ColorFilter.mode(Color(0xFF${fg.replace("#","")}), BlendMode.srcIn)), SizedBox(width: 4), Text('버튼', style: TextStyle(fontSize: ${fs}, fontWeight: FontWeight.bold))])`
      : hasRightIcon
      ? `Row(mainAxisSize: MainAxisSize.min, children: [Text('버튼', style: TextStyle(fontSize: ${fs}, fontWeight: FontWeight.bold)), SizedBox(width: 4), SvgPicture.asset('assets/icons/${icAndroid}.svg', width: ${fs+2}, height: ${fs+2}, colorFilter: ColorFilter.mode(Color(0xFF${fg.replace("#","")}), BlendMode.srcIn))])`
      : `Text('버튼', style: TextStyle(fontSize: ${fs}, fontWeight: FontWeight.bold))`;
    return `${shape === "outlined" ? "OutlinedButton" : shape === "text" ? "TextButton" : "ElevatedButton"}(
  onPressed: () {},
  style: ${shape === "outlined" ? "OutlinedButton" : shape === "text" ? "TextButton" : "ElevatedButton"}.styleFrom(
    ${shape === "filled" ? `backgroundColor: Color(0xFF${bg.replace("#","")}),\n    foregroundColor: Color(0xFF${fg.replace("#","")}),` : `foregroundColor: Color(0xFF${fg.replace("#","")}),`}
    minimumSize: Size(0, ${h}),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(${r})),
    padding: EdgeInsets.symmetric(horizontal: ${ph}),
  ),
  child: ${child},
)`;
  }

  if (platform === "css") return `.button {
  height: ${h}px;
  padding: 0 ${ph}px;
  background-color: ${bg};
  color: ${fg};
  border: ${border ? `1px solid ${border}` : "none"};
  border-radius: ${r}px;
  font-size: ${fs}px;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}`;

  if (platform === "react") return `<button
  style={{
    height: ${h},
    padding: '0 ${ph}px',
    backgroundColor: '${bg}',
    color: '${fg}',
    border: ${border ? `'1px solid ${border}'` : "'none'"},
    borderRadius: ${r},
    fontSize: ${fs},
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  }}
>
  ${hasLeftIcon ? `<YdsIcon name="${iconName}" size={${fs + 2}} />\n  ` : ""}버튼${hasRightIcon ? `\n  <YdsIcon name="${iconName}" size={${fs + 2}} />` : ""}
</button>`;
  return "";
}

// ── Section: LabelButton Component (YDS 2.0) ─────────────────────────────────

// shapeStyle → 허용된 colorStyle (YDS 2.0 스펙)
const ALLOWED_COLORS = {
  filled:   ["primary_v2"],
  outlined: ["primary_v2", "gray250_v2"],
  text:     ["gray_v2"],
};

function ButtonSection() {
  const [shape,   setShapeRaw] = useState("filled");
  const [color,   setColor]    = useState("primary_v2");
  const [size,    setSize]     = useState("medium");
  const [config,  setConfig]   = useState("labelOnly");
  const [iconPos,  setIconPos]  = useState("left");
  const [iconName, setIconName] = useState("chevron_right");
  const [selPlat,  setSelPlat]  = useState("compose");

  // shapeStyle 변경 시 허용 colorStyle로 자동 리셋
  const setShape = (s) => {
    setShapeRaw(s);
    const allowed = ALLOWED_COLORS[s];
    if (!allowed.includes(color)) setColor(allowed[0]);
  };

  const shapes = ["filled", "outlined", "text"];
  const sizes  = ["medium", "small"];
  const configs = ["labelOnly", "labelWithIcon"];
  const plats  = [
    { id: "compose", label: "Jetpack Compose" },
    { id: "xml",     label: "Android XML" },
    { id: "swiftui", label: "SwiftUI" },
    { id: "flutter", label: "Flutter" },
    { id: "css",     label: "CSS" },
    { id: "react",   label: "React" },
  ];

  // preview
  const h  = size === "medium" ? 48 : 36;
  const ph = size === "medium" ? 16 : 12;
  const fs = size === "medium" ? 14 : 12;
  const r  = size === "medium" ? 10 : 8;
  const bgFilled = { primary_v2: "#FA0050", gray_v2: "#333333", gray250_v2: "#BFBFBF" };
  const fgFilled = { primary_v2: "#fff",    gray_v2: "#fff",    gray250_v2: "#333" };
  const accent   = { primary_v2: "#FA0050", gray_v2: "#333333", gray250_v2: "#BFBFBF" };
  const previewBg     = shape === "filled"   ? bgFilled[color] : "transparent";
  const previewFg     = shape === "filled"   ? fgFilled[color] : accent[color];
  const previewBorder = shape === "outlined" ? `1px solid ${accent[color]}` : "none";

  const iconEl = <YdsIcon name={iconName} size={fs + 2} color={previewFg} />;
  const configForCode = config === "labelWithIcon"
    ? (iconPos === "left" ? "labelWithLeftIcon" : "labelWithRightIcon")
    : "labelOnly";
  const code = genLabelButtonCode(selPlat, shape, color, size, configForCode, iconName);

  const ctl = (label, options, val, set, allowedSet) => (
    <div>
      <div style={{ fontSize: "10px", color: "#999999", marginBottom: "6px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {options.map(o => {
          const disabled = allowedSet && !allowedSet.includes(o);
          return (
            <button key={o} onClick={() => !disabled && set(o)} disabled={disabled}
              style={{ padding: "4px 10px", borderRadius: "6px", background: val === o ? "#f0f0f0" : "transparent", border: val === o ? "1px solid #c0c0c0" : "1px solid #e5e5e5", color: disabled ? "#d0d0d0" : val === o ? "#333333" : "#999999", fontSize: "11px", cursor: disabled ? "default" : "pointer", textDecoration: disabled ? "line-through" : "none" }}>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Spec badges */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[["height", size === "medium" ? "48dp" : "36dp"], ["padding-h", size === "medium" ? "s7 · 16dp" : "s6 · 12dp"], ["font", size === "medium" ? "body_5 · 14px Bold" : "body_9 · 12px Bold"], ["radius", size === "medium" ? "r3 · 10dp" : "r2 · 8dp"]].map(([k, v]) => (
          <div key={k} style={{ padding: "3px 10px", background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "6px", fontSize: "10px", color: "#888888" }}>
            <span style={{ color: "#c0c0c0" }}>{k} </span>{v}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
        {ctl("shapeStyle", shapes,   shape,  setShape)}
        {ctl("colorStyle", ["primary_v2","gray_v2","gray250_v2"], color, setColor, ALLOWED_COLORS[shape])}
        {ctl("size",       sizes,    size,   setSize)}
        {ctl("config",     configs,  config, setConfig)}
        {config === "labelWithIcon" && ctl("iconPos", ["left","right"], iconPos, setIconPos)}
        {config === "labelWithIcon" && (
          <div>
            <div style={{ fontSize:"10px", color:"#999999", marginBottom:"6px", letterSpacing:"0.1em", textTransform:"uppercase" }}>Icon</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(10,1fr)", gap:"4px", maxWidth:"320px" }}>
              {ICON_NAMES.map(name => (
                <button key={name} onClick={() => setIconName(name)} title={name}
                  style={{ padding:"5px", borderRadius:"5px", background: iconName===name?"#f0f0f0":"transparent", border: iconName===name?"1px solid #c0c0c0":"1px solid #e5e5e5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <YdsIcon name={name} size={14} color={iconName===name?"#333333":"#999999"} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div style={{ padding: "40px", background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
        {/* enabled */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <button style={{ height: `${h}px`, padding: `0 ${ph}px`, background: previewBg, border: previewBorder, borderRadius: `${r}px`, color: previewFg, fontSize: `${fs}px`, fontWeight: 700, cursor: "pointer", fontFamily: "Roboto, sans-serif", display: "flex", alignItems: "center", gap: "5px" }}>
            {config === "labelWithIcon" && iconPos === "left" && iconEl}
            버튼
            {config === "labelWithIcon" && iconPos === "right" && iconEl}
          </button>
          <span style={{ fontSize: "9px", color: "#bbbbbb", letterSpacing: "0.1em" }}>ENABLED</span>
        </div>
        {/* disabled */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <button disabled style={{ height: `${h}px`, padding: `0 ${ph}px`, background: previewBg, border: previewBorder, borderRadius: `${r}px`, color: previewFg, fontSize: `${fs}px`, fontWeight: 700, cursor: "not-allowed", fontFamily: "Roboto, sans-serif", opacity: 0.35, display: "flex", alignItems: "center", gap: "5px" }}>
            {config === "labelWithIcon" && iconPos === "left" && iconEl}
            버튼
            {config === "labelWithIcon" && iconPos === "right" && iconEl}
          </button>
          <span style={{ fontSize: "9px", color: "#bbbbbb", letterSpacing: "0.1em" }}>DISABLED</span>
        </div>
      </div>

      {/* Platform tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "-16px" }}>
        {plats.map(p => (
          <button key={p.id} onClick={() => setSelPlat(p.id)}
            style={{ padding: "5px 12px", borderRadius: "6px 6px 0 0", background: selPlat === p.id ? "#ffffff" : "transparent", border: selPlat === p.id ? "1px solid #e5e5e5" : "1px solid transparent", borderBottom: selPlat === p.id ? "1px solid #e5e5e5" : "none", color: selPlat === p.id ? "#333333" : "#999999", fontSize: "11px", cursor: "pointer" }}>
            {p.label}
          </button>
        ))}
      </div>
      <pre style={{ background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "0 8px 8px 8px", padding: "16px", fontSize: "12px", color: "#555555", fontFamily: "monospace", overflowX: "auto", lineHeight: 1.65, margin: 0 }}>
        {code}
      </pre>
    </div>
  );
}

// ── Section: Label Component ──────────────────────────────────────────────────

function LabelSection() {
  const [color, setColor] = useState("primary");
  const [size, setSize] = useState("medium");

  const colors2 = ["primary", "secondary", "neutral"];
  const sizes = ["large", "medium", "small"];

  const bgMap = { primary: "#fff5f8", secondary: "#f0f7fa", neutral: "#f6f6f6" };
  const fgMap = { primary: "#fa0050", secondary: "#2591b5", neutral: "#333333" };
  const fontMap = { large: "14px", medium: "12px", small: "10px" };

  const platforms = [
    { id: "xml",     label: "Android XML",    code: genLabelCode("xml", color, size) },
    { id: "compose", label: "Jetpack Compose", code: genLabelCode("compose", color, size) },
    { id: "swiftui", label: "SwiftUI",         code: genLabelCode("swiftui", color, size) },
    { id: "flutter", label: "Flutter",         code: genLabelCode("flutter", color, size) },
    { id: "css",     label: "CSS",             code: genLabelCode("css", color, size) },
    { id: "react",   label: "React",           code: genLabelCode("react", color, size) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#999999", marginBottom: "8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Color</div>
          <div style={{ display: "flex", gap: "4px" }}>
            {colors2.map(c => (
              <button key={c} onClick={() => setColor(c)}
                style={{ padding: "5px 12px", borderRadius: "6px", background: color === c ? "#f0f0f0" : "transparent", border: color === c ? "1px solid #c0c0c0" : "1px solid #e5e5e5", color: color === c ? "#333333" : "#999999", fontSize: "11px", cursor: "pointer", textTransform: "capitalize" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "10px", color: "#999999", marginBottom: "8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Size</div>
          <div style={{ display: "flex", gap: "4px" }}>
            {sizes.map(s => (
              <button key={s} onClick={() => setSize(s)}
                style={{ padding: "5px 12px", borderRadius: "6px", background: size === s ? "#f0f0f0" : "transparent", border: size === s ? "1px solid #c0c0c0" : "1px solid #e5e5e5", color: size === s ? "#333333" : "#999999", fontSize: "11px", cursor: "pointer", textTransform: "capitalize" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ padding: "40px", background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
        {["라벨", "NEW", "인기", "이벤트"].map(text => (
          <span key={text} style={{ padding: "2px 8px", background: bgMap[color], borderRadius: "10px", color: fgMap[color], fontSize: fontMap[size], fontWeight: 700, fontFamily: "Roboto, sans-serif" }}>
            {text}
          </span>
        ))}
      </div>

      {/* Code */}
      <PlatformTabs tabs={platforms} />
    </div>
  );
}

// ── Device definitions ────────────────────────────────────────────────────────

const DEVICES = {
  ios: [
    { name: "iPhone SE (3rd)",     w: 375, h: 667 },
    { name: "iPhone 13 mini",      w: 360, h: 780 },
    { name: "iPhone 13",           w: 390, h: 844 },
    { name: "iPhone 13 Pro",       w: 390, h: 844 },
    { name: "iPhone 13 Pro Max",   w: 428, h: 926 },
    { name: "iPhone 14",           w: 390, h: 844 },
    { name: "iPhone 14 Plus",      w: 428, h: 926 },
    { name: "iPhone 14 Pro",       w: 393, h: 852 },
    { name: "iPhone 14 Pro Max",   w: 430, h: 932 },
    { name: "iPhone 15",           w: 393, h: 852 },
    { name: "iPhone 15 Plus",      w: 430, h: 932 },
    { name: "iPhone 15 Pro",       w: 393, h: 852 },
    { name: "iPhone 15 Pro Max",   w: 430, h: 932 },
    { name: "iPhone 16",           w: 393, h: 852 },
    { name: "iPhone 16 Plus",      w: 430, h: 932 },
    { name: "iPhone 16 Pro",       w: 402, h: 874 },
    { name: "iPhone 16 Pro Max",   w: 440, h: 956 },
  ],
  android: [
    { name: "Nokia 1 (320dp)",     w: 320, h: 569  },
    { name: "Galaxy A54 (360dp)",  w: 360, h: 780  },
    { name: "Galaxy S20 (412dp)",  w: 412, h: 915  },
  ],
};

// ── Section: Simulator ────────────────────────────────────────────────────────

const MAX_FRAME_H = 560;

function PhoneFrame({ platform, device, children, canvasMode, darkMode = false }) {
  const isIOS = platform === "ios";
  const scale = MAX_FRAME_H / device.h;
  const fw = Math.round(device.w * scale);
  const fh = MAX_FRAME_H;
  const border = isIOS ? 10 : 8;
  const radius = isIOS ? Math.round(48 * scale) : Math.round(36 * scale);
  // 폰 전체를 실제 dp 크기로 렌더링 후 scale로 축소
  const totalW = device.w + border * 2;
  const totalH = device.h + border * 2;
  const screenBg  = darkMode ? "#1d1d1d" : "#ffffff";
  const statusBg  = darkMode ? "#1d1d1d" : "#ffffff";
  const statusFg  = darkMode ? "#ffffff" : "#000000";
  const homeBg    = darkMode ? "#1d1d1d" : "#ffffff";
  const homeBar   = darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      {/* Device label */}
      <div style={{ fontSize: "10px", color: "#aaaaaa", letterSpacing: "0.1em" }}>
        {device.name} · {device.w} × {device.h}dp
      </div>
      {/* Layout placeholder — actual size after scale */}
      <div style={{ width: `${totalW * scale}px`, height: `${totalH * scale}px`, position: "relative", flexShrink: 0 }}>
        {/* Phone at full dp size, scaled down */}
        <div style={{ transformOrigin: "top left", transform: `scale(${scale})`, position: "absolute", top: 0, left: 0, width: `${totalW}px` }}>
          <div style={{ position: "relative", width: `${device.w}px` }}>
            {/* Phone shell */}
            <div style={{
              width: `${device.w}px`, height: `${device.h}px`, borderRadius: isIOS ? "48px" : "36px",
              background: isIOS ? "#1a1a1a" : "#111",
              border: `${border}px solid ${isIOS ? "#2a2a2a" : "#222"}`,
              boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px #333",
              display: "flex", flexDirection: "column", overflow: "hidden", position: "relative"
            }}>
              {/* Status bar */}
              {isIOS ? (
                <div style={{ height: "44px", background: statusBg, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 24px 8px", flexShrink: 0 }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: statusFg, fontFamily: "system-ui" }}>9:41</span>
                  <div style={{ width: "100px", height: "26px", background: "#111", borderRadius: "20px", position: "absolute", left: "50%", transform: "translateX(-50%)", top: "0" }} />
                  <span style={{ fontSize: "9px", color: statusFg }}>●●● WiFi 🔋</span>
                </div>
              ) : (
                <div style={{ height: "28px", background: statusBg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0 }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: statusFg, fontFamily: "Roboto, sans-serif" }}>9:41</span>
                  <span style={{ fontSize: "8px", color: statusFg }}>▲▲▲ WiFi 🔋</span>
                </div>
              )}
              {/* Screen content */}
              <div style={{ flex: 1, background: screenBg, position: "relative", overflow: canvasMode ? "hidden" : "auto" }}>
                {children}
              </div>
              {/* Home indicator */}
              {isIOS ? (
                <div style={{ height: "28px", background: homeBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "100px", height: "4px", background: homeBar, borderRadius: "2px" }} />
                </div>
              ) : (
                <div style={{ height: "36px", background: homeBg, display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                  <span style={{ fontSize: "14px", color: statusFg, opacity: 0.4 }}>◁</span>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `1.5px solid ${statusFg}`, opacity: 0.4 }} />
                  <span style={{ fontSize: "12px", color: statusFg, opacity: 0.4 }}>□</span>
                </div>
              )}
            </div>
            {/* Side buttons */}
            {isIOS ? (
              <>
                <div style={{ position: "absolute", right: `-${border+4}px`, top: "100px", width: "3px", height: "60px", background: "#2a2a2a", borderRadius: "2px" }} />
                <div style={{ position: "absolute", left: `-${border+4}px`, top: "90px",  width: "3px", height: "32px", background: "#2a2a2a", borderRadius: "2px" }} />
                <div style={{ position: "absolute", left: `-${border+4}px`, top: "135px", width: "3px", height: "52px", background: "#2a2a2a", borderRadius: "2px" }} />
                <div style={{ position: "absolute", left: `-${border+4}px`, top: "200px", width: "3px", height: "52px", background: "#2a2a2a", borderRadius: "2px" }} />
              </>
            ) : (
              <>
                <div style={{ position: "absolute", right: `-${border+4}px`, top: "80px",  width: "3px", height: "44px", background: "#222", borderRadius: "2px" }} />
                <div style={{ position: "absolute", left: `-${border+4}px`, top: "110px", width: "3px", height: "32px", background: "#222", borderRadius: "2px" }} />
                <div style={{ position: "absolute", left: `-${border+4}px`, top: "155px", width: "3px", height: "52px", background: "#222", borderRadius: "2px" }} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Figma JSON → React renderer ──────────────────────────────────────────────

function figmaRGBA(c, opacity = 1) {
  if (!c) return "transparent";
  return `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},${((c.a??1)*(opacity??1)).toFixed(3)})`;
}

function figmaFill(fills) {
  if (!fills?.length) return undefined;
  const f = fills.find(f => f.visible !== false);
  if (!f) return undefined;
  if (f.type === "SOLID") return figmaRGBA(f.color, f.opacity);
  if (f.type === "GRADIENT_LINEAR") {
    const stops = f.gradientStops.map(s => `${figmaRGBA(s.color)} ${Math.round(s.position*100)}%`).join(", ");
    return `linear-gradient(${stops})`;
  }
  if (f.type === "GRADIENT_RADIAL") {
    const stops = f.gradientStops.map(s => `${figmaRGBA(s.color)} ${Math.round(s.position*100)}%`).join(", ");
    return `radial-gradient(${stops})`;
  }
  if (f.type === "IMAGE") return "#e8e8e8"; // 이미지 fills → 회색 플레이스홀더
  return undefined;
}

function figmaImageFill(fills) {
  if (!fills?.length) return null;
  return fills.find(f => f.visible !== false && f.type === "IMAGE") || null;
}

function figmaNodeToStyle(node, ox, oy) {
  const b = node.absoluteBoundingBox;
  const s = {
    position: "absolute",
    left:   b ? b.x - ox : 0,
    top:    b ? b.y - oy : 0,
    width:  b ? b.width  : "auto",
    height: b ? b.height : "auto",
    boxSizing: "border-box",
    // clipsContent가 명시적으로 true인 노드만 overflow:hidden
    overflow: node.clipsContent === true ? "hidden" : "visible",
  };
  if (node.opacity !== undefined && node.opacity < 1) s.opacity = node.opacity;
  if (node.cornerRadius) s.borderRadius = node.cornerRadius;
  if (Array.isArray(node.rectangleCornerRadii)) {
    const [tl, tr, br, bl] = node.rectangleCornerRadii;
    s.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
  }
  const bg = figmaFill(node.fills);
  if (bg) s.background = bg;
  if (node.strokes?.length && node.strokeWeight) {
    const sc = node.strokes.find(s => s.visible !== false);
    if (sc?.color) s.border = `${node.strokeWeight}px solid ${figmaRGBA(sc.color)}`;
  }
  const shadows = (node.effects || [])
    .filter(e => e.visible !== false && (e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW"))
    .map(e => `${e.type==="INNER_SHADOW"?"inset ":""}${e.offset?.x??0}px ${e.offset?.y??0}px ${e.radius??0}px ${e.spread??0}px ${figmaRGBA(e.color)}`);
  if (shadows.length) s.boxShadow = shadows.join(", ");
  return s;
}

function RenderFigmaNode({ node, ox, oy }) {
  if (node.visible === false) return null;
  const style = figmaNodeToStyle(node, ox, oy);

  if (node.type === "TEXT") {
    const ts = node.style || {};
    const textColor = figmaFill(node.fills);
    return (
      <div style={{
        ...style,
        background: "none",
        overflow: "visible",
        fontSize: ts.fontSize || 14,
        fontWeight: ts.fontWeight || 400,
        lineHeight: ts.lineHeightPx ? `${ts.lineHeightPx}px` : "normal",
        letterSpacing: ts.letterSpacing ? `${ts.letterSpacing}px` : undefined,
        textAlign: (ts.textAlignHorizontal || "LEFT").toLowerCase(),
        color: textColor || "#000",
        whiteSpace: "pre-wrap",
        fontFamily: "Pretendard, system-ui, sans-serif",
      }}>
        {node.characters}
      </div>
    );
  }

  if (node.type === "ELLIPSE") {
    return <div style={{ ...style, borderRadius: "50%" }} />;
  }

  // VECTOR, BOOLEAN_OPERATION, STAR, POLYGON → fill color로 채운 박스 (아이콘 placeholder)
  if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION" || node.type === "STAR" || node.type === "POLYGON") {
    const fillColor = figmaFill(node.fills) || figmaFill(node.strokes) || "rgba(0,0,0,0.15)";
    return <div style={{ ...style, background: fillColor, borderRadius: style.borderRadius || 2 }} />;
  }

  // LINE → 얇은 선
  if (node.type === "LINE") {
    const strokeColor = figmaFill(node.strokes) || "#ccc";
    return <div style={{ ...style, background: strokeColor, height: Math.max(style.height, 1) }} />;
  }

  // RECTANGLE, FRAME, GROUP, COMPONENT, INSTANCE, COMPONENT_SET → 자식 렌더
  // 이미지 fill이 있으면 회색 플레이스홀더 오버레이
  const imgFill = figmaImageFill(node.fills);
  const children = node.children || [];

  return (
    <div style={style}>
      {imgFill && children.length === 0 && (
        <div style={{ position:"absolute", inset:0, background:"#d0d0d0", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:"10px", color:"#999" }}>🖼</span>
        </div>
      )}
      {children.map((child, i) => (
        <RenderFigmaNode key={`${child.id||i}`} node={child} ox={ox} oy={oy} />
      ))}
    </div>
  );
}

// ── Draft utils (Supabase) ───────────────────────────────────────────────────
// DB row → app 포맷 변환
function rowToDraft(row) {
  return { id: row.id, name: row.name, svgData: row.svg_data, w: row.w, h: row.h, createdAt: row.created_at };
}

// ── SVG dimension extractor ──────────────────────────────────────────────────
function extractSvgSize(svgStr) {
  const wMatch = svgStr.match(/\bwidth="([^"]+)"/);
  const hMatch = svgStr.match(/\bheight="([^"]+)"/);
  const vbMatch = svgStr.match(/viewBox="([^"]+)"/);
  let w = wMatch ? parseFloat(wMatch[1]) : 0;
  let h = hMatch ? parseFloat(hMatch[1]) : 0;
  if ((!w || !h) && vbMatch) {
    const parts = vbMatch[1].split(/[\s,]+/);
    if (!w) w = parseFloat(parts[2]) || 100;
    if (!h) h = parseFloat(parts[3]) || 100;
  }
  return { w: w || 100, h: h || 100 };
}

// ── Figma URL 파싱 유틸 ───────────────────────────────────────────────────────
function parseFigmaUrl(url) {
  try {
    const u = new URL(url.trim());
    const parts = u.pathname.split("/").filter(Boolean);
    // /design/{fileKey}/... or /file/{fileKey}/...
    const keyIdx = parts.findIndex(p => p === "design" || p === "file" || p === "proto");
    if (keyIdx === -1 || keyIdx + 1 >= parts.length) return null;
    const fileKey = parts[keyIdx + 1];
    const rawId = u.searchParams.get("node-id") || u.searchParams.get("nodeId") || null;
    const nodeId = rawId ? rawId.replace(/-/g, ":") : null;
    return { fileKey, nodeId };
  } catch { return null; }
}

// ── Figma Import Panel (SVG paste + URL fetch) ───────────────────────────────
function FigmaImportPanel({ onAdd, onClose }) {
  const toast = useToast();
  const [tab,      setTab]      = useState("url"); // "url" | "svg"
  // URL 탭
  const [figmaUrl, setFigmaUrl] = useState("");
  const [token,    setToken]    = useState(() => localStorage.getItem("figma_token") || "");
  const [showToken, setShowToken] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [fetchStart, setFetchStart] = useState(null);
  const [fetchElapsed, setFetchElapsed] = useState(0);
  const fetchTimerRef = useRef(null);
  // SVG 탭 (기존)
  const [svg,      setSvg]      = useState("");
  const [error,    setError]    = useState("");
  const [name,     setName]     = useState("Untitled");
  const [ready,    setReady]    = useState(false);
  // step: "idle" | "confirming" | "saving" | "done"
  const [step,     setStep]     = useState("idle");
  const [progress, setProgress] = useState(0);
  const cancelRef  = useRef(false);
  const timerRef   = useRef(null);

  const saveToken = (t) => {
    setToken(t);
    localStorage.setItem("figma_token", t);
  };

  const handleFetchFromUrl = async () => {
    setFetchError("");
    const parsed = parseFigmaUrl(figmaUrl);
    if (!parsed) { setFetchError("올바른 Figma URL이 아닙니다."); return; }
    if (!token.trim()) { setFetchError("Figma Access Token을 입력해주세요."); return; }
    const { fileKey, nodeId } = parsed;
    if (!nodeId) { setFetchError("node-id가 URL에 없습니다. 레이어를 선택하고 링크를 복사해주세요."); return; }
    const start = Date.now();
    setFetchStart(start);
    setFetchElapsed(0);
    setFetching(true);
    fetchTimerRef.current = setInterval(() => {
      setFetchElapsed(Math.floor((Date.now() - start) / 1000));
    }, 500);
    try {
      // Figma nodes API로 JSON 레이어 트리 가져오기
      const idsParam = encodeURIComponent(nodeId);
      const res = await fetch(
        `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${idsParam}`,
        { headers: { "X-Figma-Token": token.trim() } }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Figma API 오류 (${res.status})`);
      }
      const data = await res.json();
      const nodeEntry = Object.values(data.nodes || {})[0];
      if (!nodeEntry?.document) throw new Error("노드를 가져오지 못했습니다.");
      const doc = nodeEntry.document;
      const b = doc.absoluteBoundingBox;
      const w = b?.width || 375;
      const h = b?.height || 812;
      toast("Figma 레이어 구조를 가져왔습니다!", "success");
      onAdd({ figmaData: doc, w, h });
      onClose();
    } catch (e) {
      setFetchError(e.message);
    } finally {
      clearInterval(fetchTimerRef.current);
      setFetching(false);
      setFetchStart(null);
    }
  };

  const handlePaste = (val) => {
    setSvg(val);
    setStep("idle");
    cancelRef.current = false;
    const trimmed = val.trim();
    if (!trimmed) { setReady(false); setError(""); return; }
    if (!trimmed.startsWith("<svg")) {
      setError("SVG가 아닙니다. Figma에서 Copy as SVG로 복사해주세요.");
      setReady(false); return;
    }
    setError("");
    setReady(true);
  };

  const { w, h } = ready ? extractSvgSize(svg) : { w: 0, h: 0 };
  const thumbScale = ready ? Math.min(160 / w, 100 / h, 1) : 1;

  // SVG 크기 → 예상 시간 계산
  const svgBytes = ready ? new Blob([svg]).size : 0;
  const sizeLabel = svgBytes < 1024
    ? `${svgBytes} B`
    : svgBytes < 1024 * 1024
    ? `${(svgBytes / 1024).toFixed(1)} KB`
    : `${(svgBytes / 1024 / 1024).toFixed(1)} MB`;
  // localStorage write는 빠르지만 큰 SVG는 직렬화 시간이 있음
  const saveDurationMs = svgBytes < 20 * 1024 ? 400
    : svgBytes < 100 * 1024 ? 800
    : svgBytes < 500 * 1024 ? 1400
    : 2200;
  const timeLabel = saveDurationMs < 600 ? "약 0.5초 미만"
    : saveDurationMs < 1000 ? "약 1초"
    : saveDurationMs < 1600 ? "약 1~2초"
    : "약 2초 이상";
  const storageLabel = "Supabase 서버 (HWorld DB)";

  // 저장 버튼 클릭 → 확인 단계로
  const handleSaveClick = () => {
    if (!ready || step !== "idle") return;
    setStep("confirming");
  };

  // 확인 후 실제 저장
  const handleConfirm = () => {
    setStep("saving");
    setProgress(0);
    cancelRef.current = false;

    // 프로그레스 애니메이션 (Supabase 업로드 동안)
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / saveDurationMs, 0.9);
      setProgress(pct);
      if (!cancelRef.current) timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);

    saveComponent({ name, svgData: svg, w, h })
      .then((row) => {
        if (cancelRef.current) return;
        cancelAnimationFrame(timerRef.current);
        setProgress(1);
        setStep("done");
        toast(`"${name}" 서버에 저장됐습니다`, "success");
      })
      .catch((e) => {
        cancelAnimationFrame(timerRef.current);
        setStep("idle");
        toast("저장에 실패했습니다: " + e.message, "error");
      });
  };

  // 중지
  const handleCancel = () => {
    cancelRef.current = true;
    cancelAnimationFrame(timerRef.current);
    setStep("idle");
    setProgress(0);
    toast("저장이 중지됐습니다", "warning");
  };

  const handleAddWithoutSave = () => {
    onAdd({ svgData: svg, w, h });
    toast("저장하지 않고 캔버스에 추가했습니다", "info");
  };

  const handleClose = () => {
    if (ready && step !== "done") {
      cancelRef.current = true;
      cancelAnimationFrame(timerRef.current);
      toast("저장하지 않고 닫았습니다", "warning");
    }
    onClose();
  };

  return (
    <div style={{ background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", padding:"12px", display:"flex", flexDirection:"column", gap:"8px" }}>
      {/* 헤더 */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:"4px" }}>
          {[["url","🔗 URL"], ["svg","📋 SVG"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"10px", fontWeight: tab===t ? 700 : 400, background: tab===t ? "#111111" : "transparent", color: tab===t ? "#ffffff" : "#aaaaaa", border: tab===t ? "none" : "1px solid #e5e5e5", cursor:"pointer" }}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={handleClose} style={{ background:"none", border:"none", color:"#aaaaaa", cursor:"pointer", fontSize:"14px", lineHeight:1 }}>×</button>
      </div>

      {/* URL 탭 */}
      {tab === "url" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {/* Token 설정 */}
          <div style={{ background:"#f8f8f8", border:"1px solid #e5e5e5", borderRadius:"6px", padding:"8px 10px", display:"flex", flexDirection:"column", gap:"6px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:"10px", fontWeight:700, color:"#555555" }}>Figma Access Token</span>
              <button onClick={() => setShowToken(p => !p)} style={{ fontSize:"9px", color:"#aaaaaa", background:"none", border:"none", cursor:"pointer" }}>{showToken ? "숨기기" : "보기"}</button>
            </div>
            <input
              type={showToken ? "text" : "password"}
              value={token}
              onChange={e => saveToken(e.target.value)}
              placeholder="figd_xxxxxxxx..."
              style={{ width:"100%", padding:"5px 8px", borderRadius:"5px", border:"1px solid #e0e0e0", fontSize:"10px", fontFamily:"monospace", color:"#333333", outline:"none", boxSizing:"border-box", background:"#ffffff" }}
            />
            {!token && (
              <div style={{ fontSize:"9px", color:"#aaaaaa", lineHeight:1.6 }}>
                Figma → Settings → Security → Personal access tokens → Generate new token
              </div>
            )}
          </div>

          {/* URL 입력 */}
          <input
            value={figmaUrl}
            onChange={e => { setFigmaUrl(e.target.value); setFetchError(""); }}
            placeholder="https://www.figma.com/design/..."
            style={{ width:"100%", padding:"7px 10px", borderRadius:"6px", border:`1px solid ${fetchError?"#cc3333":"#e0e0e0"}`, fontSize:"11px", color:"#333333", outline:"none", boxSizing:"border-box" }}
          />
          {fetchError && <div style={{ fontSize:"10px", color:"#cc3333" }}>{fetchError}</div>}

          <button
            onClick={handleFetchFromUrl}
            disabled={fetching || !figmaUrl.trim()}
            style={{ padding:"8px", borderRadius:"6px", background: fetching || !figmaUrl.trim() ? "#cccccc" : "#111111", border:"none", color:"#ffffff", fontSize:"11px", fontWeight:700, cursor: fetching || !figmaUrl.trim() ? "default" : "pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px" }}>
            <span>{fetching ? "가져오는 중..." : "→ 컴포넌트로 가져오기"}</span>
            {fetching && (
              <span style={{ fontSize:"10px", fontWeight:400, opacity:0.85, fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap" }}>
                {fetchElapsed}s <span style={{ opacity:0.6 }}>/ ~{fetchElapsed < 3 ? 8 : fetchElapsed < 6 ? 12 : 15}s</span>
              </span>
            )}
          </button>
          {fetching && (
            <div style={{ height:"3px", background:"#e5e5e5", borderRadius:"2px", overflow:"hidden" }}>
              <div style={{
                height:"100%",
                width:`${Math.min((fetchElapsed / 15) * 100, 92)}%`,
                background:"linear-gradient(90deg, #5028c8, #8855ff)",
                borderRadius:"2px",
                transition:"width 0.5s ease"
              }} />
            </div>
          )}

          <div style={{ fontSize:"9px", color:"#aaaaaa", lineHeight:1.7 }}>
            Figma에서 레이어 선택 → 우클릭 → Copy link to selection → 붙여넣기
          </div>
        </div>
      )}

      {/* SVG 탭 (기존) */}
      {tab === "svg" && (
        <>
          <div style={{ background:"#f0f4ff", border:"1px solid #c5d3f5", borderRadius:"6px", padding:"8px 10px", fontSize:"10px", color:"#3355aa", lineHeight:1.7 }}>
            Figma에서 레이어 선택<br/>
            → 우클릭 → <b>Copy/Paste as → Copy as SVG</b><br/>
            → 아래에 붙여넣기 (Ctrl+V / ⌘V)
          </div>
          <textarea
            value={svg}
            onChange={e => handlePaste(e.target.value)}
            onPaste={e => { setTimeout(() => handlePaste(e.target.value), 0); }}
            placeholder="<svg xmlns=... 여기에 붙여넣기"
            style={{ width:"100%", height:"64px", background:"#f8f8f8", border:`1px solid ${error?"#cc3333":ready?"#5028c8":"#d0d0d0"}`, borderRadius:"6px", padding:"6px 8px", fontSize:"10px", fontFamily:"monospace", color:"#333333", resize:"none", outline:"none", boxSizing:"border-box" }}
          />
          {error && <div style={{ fontSize:"10px", color:"#cc3333", lineHeight:1.5 }}>{error}</div>}
        </>
      )}

      {tab === "svg" && ready && step === "idle" && (
        <>
          {/* Preview */}
          <div style={{ background:"#f5f5f5", border:"1px solid #e5e5e5", borderRadius:"6px", padding:"8px", overflow:"hidden", display:"flex", flexDirection:"column", gap:"6px" }}>
            <div style={{ fontSize:"9px", color:"#999999" }}>{Math.round(w)}×{Math.round(h)}px · {sizeLabel}</div>
            <div style={{ transform:`scale(${thumbScale})`, transformOrigin:"top left", width: w*thumbScale, height: h*thumbScale, flexShrink:0 }}
              dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
          {/* Save prompt */}
          <div style={{ background:"#fffbe6", border:"1px solid #f0d800", borderRadius:"6px", padding:"10px", display:"flex", flexDirection:"column", gap:"8px" }}>
            <div style={{ fontSize:"10px", fontWeight:700, color:"#665500" }}>Draft에 저장하시겠습니까?</div>
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ width:"100%", padding:"5px 8px", borderRadius:"5px", border:"1px solid #e0c800", background:"#ffffff", fontSize:"11px", color:"#111111", outline:"none", boxSizing:"border-box" }} />
            <div style={{ display:"flex", gap:"6px" }}>
              <button onClick={handleSaveClick}
                style={{ flex:1, padding:"6px", borderRadius:"5px", background:"#111111", border:"none", color:"#ffffff", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
                Draft로 저장
              </button>
              <button onClick={handleAddWithoutSave}
                style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border:"1px solid #d0d0d0", color:"#888888", fontSize:"11px", cursor:"pointer" }}>
                저장 없이 추가
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── 저장 전 확인 단계 ── */}
      {tab === "svg" && step === "confirming" && (
        <div style={{ background:"#f5f0ff", border:"1px solid #b090ee", borderRadius:"8px", padding:"12px", display:"flex", flexDirection:"column", gap:"10px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:"#3a0a8a" }}>저장하기 전에 확인해주세요</div>
          <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"4px 10px", fontSize:"10px" }}>
            <span style={{ color:"#999" }}>파일 크기</span>  <span style={{ color:"#333", fontWeight:600 }}>{sizeLabel}</span>
            <span style={{ color:"#999" }}>예상 시간</span>  <span style={{ color:"#333", fontWeight:600 }}>{timeLabel}</span>
            <span style={{ color:"#999" }}>저장 위치</span>  <span style={{ color:"#333" }}>{storageLabel}</span>
            <span style={{ color:"#999" }}>이름</span>       <span style={{ color:"#333", fontWeight:600 }}>"{name}"</span>
          </div>
          <div style={{ fontSize:"10px", color:"#7755aa", background:"#ede5ff", borderRadius:"5px", padding:"7px 9px", lineHeight:1.6 }}>
            Supabase 서버에 저장됩니다.<br/>
            어떤 기기, 어떤 브라우저에서도 불러올 수 있습니다.
          </div>
          <div style={{ display:"flex", gap:"6px" }}>
            <button onClick={handleConfirm}
              style={{ flex:1, padding:"7px", borderRadius:"5px", background:"#5028c8", border:"none", color:"#ffffff", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
              진짜 저장할게
            </button>
            <button onClick={() => { setStep("idle"); toast("저장이 취소됐습니다", "warning"); }}
              style={{ flex:1, padding:"7px", borderRadius:"5px", background:"transparent", border:"1px solid #d0c0f0", color:"#7755aa", fontSize:"11px", cursor:"pointer" }}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* ── 저장 진행 중 ── */}
      {tab === "svg" && step === "saving" && (
        <div style={{ background:"#f8f8f8", border:"1px solid #e0e0e0", borderRadius:"8px", padding:"12px", display:"flex", flexDirection:"column", gap:"10px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:"11px", fontWeight:600, color:"#333" }}>저장 중...</div>
            <div style={{ fontSize:"10px", color:"#999" }}>{Math.round(progress * 100)}%</div>
          </div>
          {/* Progress bar */}
          <div style={{ height:"6px", background:"#e5e5e5", borderRadius:"3px", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress * 100}%`, background:"linear-gradient(90deg,#5028c8,#8855ff)", borderRadius:"3px", transition:"width 0.05s linear" }} />
          </div>
          <button onClick={handleCancel}
            style={{ padding:"6px", borderRadius:"5px", background:"transparent", border:"1px solid #ffbbbb", color:"#cc3333", fontSize:"11px", fontWeight:600, cursor:"pointer" }}>
            중지
          </button>
        </div>
      )}

      {/* ── 저장 완료 ── */}
      {tab === "svg" && step === "done" && (
        <div style={{ background:"#e8f5e8", border:"1px solid #5aaa5a", borderRadius:"6px", padding:"10px", display:"flex", flexDirection:"column", gap:"8px" }}>
          <div style={{ fontSize:"11px", color:"#2a7a2a", fontWeight:700 }}>✓ Draft에 저장됐습니다</div>
          <div style={{ height:"4px", background:"#5aaa5a", borderRadius:"2px" }} />
          <div style={{ display:"flex", gap:"6px" }}>
            <button onClick={() => { onAdd({ svgData: svg, w, h }); toast("캔버스에 추가됐습니다", "success"); }}
              style={{ flex:1, padding:"6px", borderRadius:"5px", background:"#111111", border:"none", color:"#ffffff", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
              캔버스에 추가
            </button>
            <button onClick={onClose}
              style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border:"1px solid #d0d0d0", color:"#888888", fontSize:"11px", cursor:"pointer" }}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Deep tree helpers (Frame nesting) ────────────────────────────────────────
function findDeep(items, id) {
  for (const it of items) {
    if (it.id === id) return it;
    if (it.children) { const f = findDeep(it.children, id); if (f) return f; }
  }
  return null;
}
function updateDeep(items, id, patch) {
  return items.map(it => {
    if (it.id === id) return { ...it, ...patch };
    if (it.children) return { ...it, children: updateDeep(it.children, id, patch) };
    return it;
  });
}
function removeDeep(items, id) {
  return items
    .filter(it => it.id !== id)
    .map(it => it.children ? { ...it, children: removeDeep(it.children, id) } : it);
}
function insertIntoFrame(items, frameId, child) {
  return items.map(it => {
    if (it.id === frameId) return { ...it, children: [...(it.children||[]), child] };
    if (it.children) return { ...it, children: insertIntoFrame(it.children, frameId, child) };
    return it;
  });
}
function reparentInto(items, itemId, frameId) {
  const item = findDeep(items, itemId);
  if (!item) return items;
  const frame = findDeep(items, frameId);
  const relX = Math.max(0, (item.x||0) - (frame?.x||0));
  const relY = Math.max(0, (item.y||0) - (frame?.y||0));
  const without = removeDeep(items, itemId);
  return insertIntoFrame(without, frameId, { ...item, x: relX, y: relY });
}
function flattenTree(items, depth = 0) {
  const result = [];
  for (const it of [...items].reverse()) {
    result.push({ item: it, depth });
    if (it.type === "frame" && it.children?.length) {
      result.push(...flattenTree([...it.children].reverse(), depth + 1));
    }
  }
  return result;
}

const newScreenId = () => Date.now();
const makeScreen = (name) => ({ id: newScreenId(), name, items: [] });

function SimulatorSection({ pendingDraft, onDraftConsumed }) {
  const toast = useToast();
  const [mode,      setMode]      = useState("assembly"); // "assembly" | "prototype"
  const [platform,  setPlatform]  = useState("ios");
  const [deviceIdx, setDeviceIdx] = useState(2);

  // ── 화면 관리 ────────────────────────────────────────────────────────────────
  const [screens,        setScreens]        = useState([makeScreen("Screen 1")]);
  const [activeScreenId, setActiveScreenId] = useState(null);
  const [protoScreenId,  setProtoScreenId]  = useState(null); // 프로토 모드 현재 화면
  const [renamingId,     setRenamingId]     = useState(null);
  const [renameVal,      setRenameVal]      = useState("");

  const activeId     = activeScreenId ?? screens[0]?.id;
  const activeScreen = screens.find(s => s.id === activeId) || screens[0];
  const items        = activeScreen?.items || [];

  const setItems = (updater) => {
    setScreens(prev => prev.map(s =>
      s.id === activeId
        ? { ...s, items: typeof updater === "function" ? updater(s.items) : updater }
        : s
    ));
  };

  const addScreen = () => {
    const s = makeScreen(`Screen ${screens.length + 1}`);
    setScreens(prev => [...prev, s]);
    setActiveScreenId(s.id);
  };

  const removeScreen = (id) => {
    if (screens.length === 1) { toast("마지막 화면은 삭제할 수 없습니다", "warning"); return; }
    setScreens(prev => prev.filter(s => s.id !== id));
    if (activeId === id) setActiveScreenId(screens.find(s => s.id !== id)?.id || null);
  };

  const startRename = (s) => { setRenamingId(s.id); setRenameVal(s.name); };
  const commitRename = () => {
    if (renameVal.trim()) setScreens(prev => prev.map(s => s.id === renamingId ? { ...s, name: renameVal.trim() } : s));
    setRenamingId(null);
  };

  // 프로토타입 현재 화면
  const protoId     = protoScreenId ?? screens[0]?.id;
  const protoScreen = screens.find(s => s.id === protoId) || screens[0];

  const [selected,  setSelected]  = useState(null);
  const [hovered,   setHovered]   = useState(null);
  const [snapGrid,      setSnapGrid]      = useState(true);
  const [darkMode,      setDarkMode]      = useState(false);
  const [showFigmaPanel,  setShowFigmaPanel]  = useState(false);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [showAiPanel,     setShowAiPanel]     = useState(false);
  const [aiCommand,       setAiCommand]       = useState("");
  const [aiStatus,        setAiStatus]        = useState("idle"); // idle | waiting | done | error
  const [aiStartTime,     setAiStartTime]     = useState(null);
  const [aiElapsed,       setAiElapsed]       = useState(0);
  const [aiProxyUrl,      setAiProxyUrl]      = useState(() => { const v = localStorage.getItem("storybook_ai_proxy_url"); return (v && v !== "connected") ? v : null; });
  const [aiProxyChecking, setAiProxyChecking] = useState(false);
  const aiPollRef         = useRef(null);
  const aiTimerRef        = useRef(null);
  const [pickerDrafts,    setPickerDrafts]    = useState([]);
  const [pickerLoading,   setPickerLoading]   = useState(false);
  const [showCode,        setShowCode]        = useState(false);

  const isProto = mode === "prototype";
  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);

  // ── prototype pinch-zoom ──────────────────────────────────────────────────────
  const [protoScale, setProtoScale] = useState(1);
  const pinchRef = useRef(null); // { dist0, scale0 }
  const protoFrameRef = useRef(null);
  useEffect(() => {
    const el = protoFrameRef.current;
    if (!el || !isProto) return;
    const dist = (t) => {
      const dx = t[0].clientX - t[1].clientX;
      const dy = t[0].clientY - t[1].clientY;
      return Math.hypot(dx, dy);
    };
    const onStart = (e) => {
      if (e.touches.length === 2) {
        pinchRef.current = { dist0: dist(e.touches), scale0: protoScale };
      }
    };
    const onMove = (e) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const ratio = dist(e.touches) / pinchRef.current.dist0;
        setProtoScale(Math.min(3, Math.max(0.4, pinchRef.current.scale0 * ratio)));
      }
    };
    const onEnd = () => { if (pinchRef.current) pinchRef.current = null; };
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setProtoScale(prev => Math.min(3, Math.max(0.4, prev * (1 - e.deltaY * 0.003))));
      }
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove",  onMove,  { passive: false });
    el.addEventListener("touchend",   onEnd,   { passive: true });
    el.addEventListener("wheel",      onWheel, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove",  onMove);
      el.removeEventListener("touchend",   onEnd);
      el.removeEventListener("wheel",      onWheel);
    };
  }, [isProto, protoScale]);

  useEffect(() => {
    if (!pendingDraft) return;
    const id = Date.now();
    if (pendingDraft.svgData) {
      setItems(prev => [...prev, { id, type:"svg", svgData: pendingDraft.svgData, w: pendingDraft.w||100, h: pendingDraft.h||100, x:16, y:Math.min(16+prev.length*40,400), isMaster:false }]);
    } else if (pendingDraft.figmaData) {
      const b = pendingDraft.figmaData?.absoluteBoundingBox;
      setItems(prev => [...prev, { id, type:"figma", figmaData: pendingDraft.figmaData, x:16, y:Math.min(16+prev.length*40,400), w:b?.width||100, isMaster:false }]);
    }
    setSelected(id);
    onDraftConsumed?.();
  }, [pendingDraft]);

  const dragRef   = useRef(null); // { id, startMX, startMY, startX, startY }
  const resizeRef = useRef(null); // { id, handle, startMX, startW, startX }
  const scaleRef  = useRef(1);
  const snapRef   = useRef(true);
  const compRefs  = useRef({});   // id → DOM element

  const device = DEVICES[platform][deviceIdx];
  const scale  = MAX_FRAME_H / device.h;
  scaleRef.current = scale;
  snapRef.current  = snapGrid;

  const GRID   = 8;
  const snap   = (v) => snapRef.current ? Math.round(v / GRID) * GRID : Math.round(v);
  // convert desired screen-px to dp (for handles/borders inside the scaled frame)
  const sdp    = (px) => px / scale;

  // ── window-level mouse (drag + resize) ───────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      if (dragRef.current) {
        const { id, startMX, startMY, startX, startY } = dragRef.current;
        const dx = (e.clientX - startMX) / scaleRef.current;
        const dy = (e.clientY - startMY) / scaleRef.current;
        setItems(prev => updateDeep(prev, id, { x: Math.max(0, Math.round((startX + dx) / 8) * 8), y: Math.max(0, Math.round((startY + dy) / 8) * 8) }));
      }
      if (resizeRef.current) {
        const { id, handle, startMX, startW, startX } = resizeRef.current;
        const dx = (e.clientX - startMX) / scaleRef.current;
        let upd = {};
        if (handle.includes("e")) { upd.w = Math.max(60, Math.round((startW + dx) / 8) * 8); }
        if (handle.includes("w")) {
          const nw = Math.max(60, Math.round((startW - dx) / 8) * 8);
          upd.w = nw;
          upd.x = Math.max(0, Math.round((startX + (startW - nw)) / 8) * 8);
        }
        setItems(prev => updateDeep(prev, id, upd));
      }
    };
    const onUp = (e) => {
      if (dragRef.current) {
        const { id, startMX, startMY, startX, startY } = dragRef.current;
        const dx = (e.clientX - startMX) / scaleRef.current;
        const dy = (e.clientY - startMY) / scaleRef.current;
        const finalX = Math.max(0, Math.round((startX + dx) / 8) * 8);
        const finalY = Math.max(0, Math.round((startY + dy) / 8) * 8);
        // frame drop detection: only for root-level items
        const cur = itemsRef.current;
        const isRoot = cur.some(it => it.id === id);
        if (isRoot) {
          const draggedItem = findDeep(cur, id);
          const iw = draggedItem?.w || 60;
          const ih = draggedItem?.h || 30;
          const cx = finalX + iw / 2;
          const cy = finalY + ih / 2;
          const targetFrame = cur.find(it =>
            it.type === "frame" && it.id !== id &&
            cx >= it.x && cx <= it.x + (it.w || 200) &&
            cy >= it.y && cy <= it.y + (it.h || 150)
          );
          if (targetFrame) {
            setItems(prev => reparentInto(prev, id, targetFrame.id));
          }
        }
      }
      dragRef.current = null;
      resizeRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  // ── keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!selected) return;
      const item = items.find(i => i.id === selected);
      if (!item) return;

      if ((e.key === "Delete" || e.key === "Backspace") && !item.isMaster) {
        e.preventDefault();
        setItems(prev => removeDeep(prev, selected));
        setSelected(null);
        return;
      }
      if (e.key === "Escape") { setSelected(null); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        const nid = Date.now();
        setItems(prev => [...prev, { ...item, id: nid, x: (item.x||0) + 24, y: (item.y||0) + 24, isMaster: false }]);
        setSelected(nid);
        return;
      }
      if (!item.isMaster) {
        const N = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowLeft")  { e.preventDefault(); setItems(p => updateDeep(p, selected, { x: Math.max(0, (item.x||0)-N) })); }
        if (e.key === "ArrowRight") { e.preventDefault(); setItems(p => updateDeep(p, selected, { x: (item.x||0)+N })); }
        if (e.key === "ArrowUp")    { e.preventDefault(); setItems(p => updateDeep(p, selected, { y: Math.max(0, (item.y||0)-N) })); }
        if (e.key === "ArrowDown")  { e.preventDefault(); setItems(p => updateDeep(p, selected, { y: (item.y||0)+N })); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, items]);

  // ── AI 명령 브릿지 ───────────────────────────────────────────────────────────
  const cancelAiCommand = () => {
    clearInterval(aiPollRef.current);
    clearInterval(aiTimerRef.current);
    setAiStatus("idle");
    setAiStartTime(null);
    setAiElapsed(0);
  };

  const AI_HUB = "https://alfred-agent-nine.vercel.app";
  const AI_PROXY_KEY = "storybook_ai_proxy_url";

  const detectAiProxy = async () => {
    // ai-worker가 허브에 등록됐는지 확인
    try {
      const res = await fetch(`${AI_HUB}/api/get-proxy?github_login=hyoseob-r`, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      if (data?.proxy_url) {
        setAiProxyUrl("hub");
        localStorage.setItem(AI_PROXY_KEY, "hub");
        return;
      }
    } catch {}
    alert("ai-worker가 실행 중이지 않습니다. Mac에서 ai-worker가 켜져 있는지 확인해주세요.");
  };

  const disconnectAiProxy = () => { localStorage.removeItem(AI_PROXY_KEY); setAiProxyUrl(null); };

  const sendAiCommand = async () => {
    if (!aiCommand.trim() || !aiProxyUrl) return;
    const start = Date.now();
    setAiStatus("waiting");
    setAiStartTime(start);
    setAiElapsed(0);
    aiTimerRef.current = setInterval(() => setAiElapsed(Math.floor((Date.now() - start) / 1000)), 500);

    try {
      // 1. 결과 초기화 후 명령 허브에 전송
      await fetch(`${AI_HUB}/api/ai-queue`, { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ type:"result", payload:{ cleared:true, ts: start } }) });
      await fetch(`${AI_HUB}/api/ai-queue`, { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ type:"command", payload:{ command: aiCommand.trim(), ts: start } }) });

      // 2. ai-worker가 처리 후 허브에 올린 결과를 폴링
      const deadline = start + 300_000;
      aiPollRef.current = setInterval(async () => {
        if (Date.now() > deadline) {
          clearInterval(aiPollRef.current); clearInterval(aiTimerRef.current); setAiStatus("error"); return;
        }
        try {
          const res  = await fetch(`${AI_HUB}/api/ai-queue?role=browser`);
          const data = await res.json();
          if (data?.items && !data.cleared && data._updatedAt > new Date(start).toISOString()) {
            clearInterval(aiPollRef.current); clearInterval(aiTimerRef.current);
            setScreens(prev => prev.map(s => s.id === activeScreen ? { ...s, items: data.items } : s));
            setItems(data.items);
            setAiStatus("done"); setAiCommand("");
            setTimeout(() => { setAiStatus("idle"); setAiStartTime(null); setAiElapsed(0); }, 2500);
          }
        } catch {}
      }, 2000);
    } catch {
      clearInterval(aiTimerRef.current);
      setAiStatus("error");
    }
  };

  // ── item helpers ─────────────────────────────────────────────────────────────
  const addItem = (type) => {
    const id = Date.now();
    const base = type === "frame"
      ? { type:"frame", w:240, h:160, children:[], frameBg:"rgba(0,0,0,0.03)", frameBorder:"#cccccc", frameRadius:8, isMaster:false }
      : type === "labelButton"
      ? { type:"labelButton", shape:"filled", colorStyle:"primary_v2", size:"medium", config:"labelOnly", iconPos:"left", iconName:"chevron_right", labelText:"버튼", isMaster:false }
      : { type:"text", style:"Body/body_6", content:"텍스트", color:"#333333", isMaster:false };
    // if selected item is a frame, add inside it
    const selItem = findDeep(itemsRef.current, selected);
    if (selItem?.type === "frame") {
      const childCount = selItem.children?.length || 0;
      const newChild = { id, x:8, y:8 + childCount*52, ...base };
      setItems(prev => updateDeep(prev, selItem.id, { children: [...(selItem.children||[]), newChild] }));
    } else {
      setItems(prev => [...prev, { id, x:16, y:Math.min(16 + prev.length * 64, 480), ...base }]);
    }
    setSelected(id);
  };

  const updateItem    = (id, upd) => setItems(prev => updateDeep(prev, id, upd));
  const removeItem    = (id) => { setItems(prev => removeDeep(prev, id)); if (selected === id) setSelected(null); };
  const duplicateItem = (item) => {
    const nid = Date.now();
    const copy = JSON.parse(JSON.stringify({ ...item, id: nid, x: (item.x||0) + 24, y: (item.y||0) + 24, isMaster: false }));
    const assignIds = (node) => { node.id = Date.now() + Math.random(); if (node.children) node.children.forEach(assignIds); };
    if (copy.children) copy.children.forEach(assignIds);
    setItems(prev => [...prev, copy]);
    setSelected(nid);
  };
  const sel = findDeep(items, selected);

  const changeShape = (s) => {
    if (!sel) return;
    const allowed = ALLOWED_COLORS[s];
    updateItem(sel.id, { shape: s, colorStyle: allowed.includes(sel.colorStyle) ? sel.colorStyle : allowed[0] });
  };

  const startDrag = (e, item) => {
    e.preventDefault(); e.stopPropagation();
    setSelected(item.id);
    if (!item.isMaster) {
      dragRef.current = { id: item.id, startMX: e.clientX, startMY: e.clientY, startX: item.x, startY: item.y };
    }
  };

  const startResize = (e, item, handle) => {
    e.preventDefault(); e.stopPropagation();
    const el = compRefs.current[item.id];
    const cw = item.w || (el ? el.offsetWidth : 120);
    resizeRef.current = { id: item.id, handle, startMX: e.clientX, startW: cw, startX: item.x };
  };

  // ── render component ─────────────────────────────────────────────────────────
  const renderComp = (item) => {
    if (item.type === "frame") return null; // frames rendered by wrapper
    if (item.type === "labelButton") {
      const h  = item.size === "medium" ? 48 : 36;
      const ph = item.size === "medium" ? 16 : 12;
      const fs = item.size === "medium" ? 14 : 12;
      const r  = item.size === "medium" ? 10 : 8;
      const bgFilled = { primary_v2:"#FA0050", gray_v2:"#333333", gray250_v2:"#BFBFBF" };
      const fgFilled = { primary_v2:"#fff",    gray_v2:"#fff",    gray250_v2:"#333" };
      const accentC  = { primary_v2:"#FA0050", gray_v2:"#333333", gray250_v2:"#BFBFBF" };
      const bg  = item.shape === "filled"   ? bgFilled[item.colorStyle] : "transparent";
      const fg  = item.shape === "filled"   ? fgFilled[item.colorStyle] : accentC[item.colorStyle];
      const bdr = item.shape === "outlined" ? `1px solid ${accentC[item.colorStyle]}` : "none";
      const ico = <YdsIcon name={item.iconName || "chevron_right"} size={fs + 2} color={fg} />;
      return (
        <div style={{ height:`${h}px`, padding:`0 ${ph}px`, background:bg, border:bdr, borderRadius:`${r}px`, color:fg, fontSize:`${fs}px`, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", fontFamily: platform==="ios"?"system-ui":"Roboto,sans-serif", userSelect:"none", whiteSpace:"nowrap", width:"100%", boxSizing:"border-box" }}>
          {item.config === "labelWithIcon" && item.iconPos === "left"  && ico}
          {item.labelText}
          {item.config === "labelWithIcon" && item.iconPos === "right" && ico}
        </div>
      );
    }
    if (item.type === "text") {
      const t = typography.find(t => t.name === item.style) || { size:14, weight:400, lineHeight:19 };
      return (
        <div style={{ fontSize:`${t.size}px`, fontWeight:t.weight, lineHeight:`${t.lineHeight}px`, color:item.color, fontFamily: platform==="ios"?"system-ui":"Roboto,sans-serif", userSelect:"none", whiteSpace:"pre-wrap" }}>
          {item.content}
        </div>
      );
    }
    if (item.type === "figma") {
      const b = item.figmaData?.absoluteBoundingBox;
      return (
        <div style={{ position:"relative", width: item.w || b?.width || 100, height: b?.height || 100, pointerEvents:"none" }}>
          <RenderFigmaNode node={item.figmaData} ox={b?.x || 0} oy={b?.y || 0} />
        </div>
      );
    }
    if (item.type === "svg") {
      return (
        <div style={{ width: item.w || 100, height: item.h || 100, pointerEvents:"none", lineHeight:0 }}
          dangerouslySetInnerHTML={{ __html: item.svgData }} />
      );
    }
  };

  // ── recursive item wrapper (handles frame nesting) ───────────────────────────
  const renderItemWrapper = (item, parentAL = null, depth = 0) => {
    const sc = !parentAL && item.scroll?.enabled ? item.scroll : null;
    const resolvedW = item.wMode==="fill" ? device.w
      : item.wMode==="pct" ? Math.round(device.w*(item.wPct||100)/100)
      : item.w;
    const resolvedH = item.hMode==="fill" ? device.h
      : item.hMode==="pct" ? Math.round(device.h*(item.hPct||100)/100)
      : item.h;

    if (item.type === "frame") {
      const al = item.autoLayout?.enabled ? item.autoLayout : null;
      const flexDir = al?.direction==="horizontal" ? "row" : "column";
      const justMap = { start:"flex-start", center:"center", end:"flex-end", "space-between":"space-between" };
      const alignMap = { start:"flex-start", center:"center", end:"flex-end" };
      const wPx = resolvedW || item.w || 240;
      const hPx = resolvedH || item.h || 160;
      const posStyle = parentAL ? {
        position:"relative",
        flexShrink: item.wMode==="hug" ? 0 : (item.wMode==="fill" ? 1 : 0),
        flex: item.wMode==="fill" ? "1 1 auto" : undefined,
      } : {
        position:"absolute", left:`${item.x||0}px`, top:`${item.y||0}px`,
      };
      return (
        <div key={item.id}
          ref={el => compRefs.current[item.id] = el}
          style={{
            ...posStyle,
            width: item.wMode==="fill" ? "100%" : item.wMode==="hug" ? "fit-content" : `${wPx}px`,
            height: item.hMode==="hug" ? "fit-content" : `${hPx}px`,
            background: item.frameBg || "rgba(0,0,0,0.03)",
            border: `1px solid ${item.frameBorder || "#cccccc"}`,
            borderRadius: `${item.frameRadius||0}px`,
            overflow: "hidden",
            boxSizing: "border-box",
            display: al ? "flex" : "block",
            flexDirection: al ? flexDir : undefined,
            gap: al ? `${al.gap||0}px` : undefined,
            padding: al ? `${al.padT||0}px ${al.padR||0}px ${al.padB||0}px ${al.padL||0}px` : 0,
            justifyContent: al ? (justMap[al.mainAlign]||"flex-start") : undefined,
            alignItems: al ? (alignMap[al.crossAlign]||"center") : undefined,
            flexWrap: al?.wrap ? "wrap" : "nowrap",
            cursor: isProto ? (item.onTap?"pointer":"default") : "grab",
          }}
          onMouseDown={e => { if (!isProto) { e.stopPropagation(); setSelected(item.id); if (!item.isMaster) dragRef.current = { id:item.id, startMX:e.clientX, startMY:e.clientY, startX:item.x||0, startY:item.y||0 }; } }}
          onMouseEnter={() => !isProto && setHovered(item.id)}
          onMouseLeave={() => !isProto && setHovered(null)}
          onClick={e => { e.stopPropagation(); if (!isProto) setSelected(item.id); if (isProto && item.onTap?.type==="navigate") setProtoScreenId(item.onTap.screenId); }}
        >
          {/* children */}
          {item.children?.map(child => renderItemWrapper(child, al, depth+1))}
          {/* empty placeholder */}
          {!isProto && (!item.children || item.children.length===0) && (
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:`${sdp(10)}px`, color:"#c0c0c0", pointerEvents:"none", userSelect:"none" }}>Frame</div>
          )}
          {/* frame label badge */}
          {!isProto && (
            <div style={{ position:"absolute", top:`${sdp(-13)}px`, left:0, fontSize:`${sdp(9)}px`, color:"#888", background:"#f0f0f0", padding:`${sdp(1)}px ${sdp(4)}px`, borderRadius:`${sdp(3)}px`, whiteSpace:"nowrap", pointerEvents:"none", zIndex:10 }}>
              {item.name||"Frame"}
            </div>
          )}
          {!isProto && hovered===item.id && selected!==item.id && renderSelectionBox(item, true)}
          {!isProto && selected===item.id && renderSelectionBox(item, false)}
        </div>
      );
    }

    // leaf item
    const clipW = sc?.clipW || resolvedW;
    const clipH = sc?.clipH || resolvedH || item.h;
    const posStyle = parentAL ? {
      position:"relative",
      flexShrink: item.wMode==="hug" ? 0 : (item.wMode==="fill" ? 1 : 0),
      flex: item.wMode==="fill" ? "1 1 auto" : undefined,
    } : {
      position:"absolute", left:`${item.x||0}px`, top:`${item.y||0}px`,
    };
    // mouse-drag scroll handler for prototype scroll containers
    const makeDragScroll = (sc) => {
      if (!sc || !isProto) return {};
      let startX, startY, scrollLeft, scrollTop, isDragging = false;
      return {
        onMouseDown: (e) => {
          const el = e.currentTarget;
          isDragging = true;
          startX = e.clientX; startY = e.clientY;
          scrollLeft = el.scrollLeft; scrollTop = el.scrollTop;
          el.style.cursor = "grabbing";
          e.preventDefault(); e.stopPropagation();
          const onMove = (ev) => {
            if (!isDragging) return;
            if (sc.direction === "horizontal") el.scrollLeft = scrollLeft - (ev.clientX - startX);
            else el.scrollTop = scrollTop - (ev.clientY - startY);
          };
          const onUp = () => {
            isDragging = false;
            el.style.cursor = "grab";
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        },
      };
    };
    const dragScrollHandlers = makeDragScroll(sc);
    return (
      <div key={item.id}
        ref={el => compRefs.current[item.id] = el}
        className={sc && isProto ? "sim-noscrollbar" : undefined}
        style={{
          ...posStyle,
          cursor: isProto ? (sc ? "grab" : item.onTap ? "pointer" : "default") : item.isMaster?"pointer":"grab",
          ...(sc ? {
            width:`${clipW}px`, height:`${clipH}px`,
            overflowX: sc.direction==="horizontal" ? (isProto?"scroll":"hidden") : "hidden",
            overflowY: sc.direction==="vertical"   ? (isProto?"scroll":"hidden") : "hidden",
            WebkitOverflowScrolling:"touch",
            scrollbarWidth:"none",
            msOverflowStyle:"none",
            touchAction: isProto ? (sc.direction==="horizontal" ? "pan-x" : "pan-y") : "none",
            userSelect:"none",
            outline: !isProto ? `${sdp(1.5)}px dashed #2591b5` : "none",
            boxSizing:"border-box",
          } : item.wMode==="hug" ? { width:"fit-content" } : item.hMode==="hug" ? { height:"fit-content" } : resolvedW ? { width:`${resolvedW}px` } : {}),
        }}
        {...(isProto && sc ? dragScrollHandlers : {})}
        onMouseDown={e => { if (!isProto) { e.stopPropagation(); startDrag(e, item); } }}
        onMouseEnter={() => !isProto && setHovered(item.id)}
        onMouseLeave={() => !isProto && setHovered(null)}
        onClick={e => { e.stopPropagation(); if (isProto && item.onTap?.type==="navigate") setProtoScreenId(item.onTap.screenId); else if (!isProto) setSelected(item.id); }}
      >
        {!isProto && sc && (
          <div style={{ position:"absolute", top:`${sdp(-14)}px`, left:0, fontSize:`${sdp(9)}px`, color:"#2591b5", background:"#e8f5fa", padding:`${sdp(1)}px ${sdp(5)}px`, borderRadius:`${sdp(4)}px`, whiteSpace:"nowrap", zIndex:10, pointerEvents:"none", fontWeight:700 }}>
            {sc.direction==="horizontal" ? "⇔ 가로 스크롤" : "⇕ 세로 스크롤"}
          </div>
        )}
        {renderComp(item)}
        {!isProto && hovered===item.id && selected!==item.id && renderSelectionBox(item, true)}
        {!isProto && selected===item.id && renderSelectionBox(item, false)}
      </div>
    );
  };

  // ── selection / hover overlay with resize handles ────────────────────────────
  const renderSelectionBox = (item, isHover) => {
    const color  = item.isMaster ? "#ccaa00" : "#111111";
    const bw     = sdp(isHover ? 1 : 1.5);   // border width in dp
    const hSize  = sdp(7);                    // handle square size in dp
    const hOff   = hSize / 2;                 // half, for centering
    const rDp    = sdp(3);                    // border-radius in dp
    const inset  = -(bw + sdp(1));

    // Handle descriptors: key, positioning style (dp), whether it resizes
    const handles = [
      { key:"nw", s:{ top:`-${hOff}px`,  left:`-${hOff}px`  },                        resize:true  },
      { key:"n",  s:{ top:`-${hOff}px`,  left:"50%", transform:`translateX(-${hOff}px)` }, resize:false },
      { key:"ne", s:{ top:`-${hOff}px`,  right:`-${hOff}px` },                        resize:true  },
      { key:"e",  s:{ top:"50%", transform:`translateY(-${hOff}px)`, right:`-${hOff}px` }, resize:true  },
      { key:"se", s:{ bottom:`-${hOff}px`, right:`-${hOff}px` },                      resize:true  },
      { key:"s",  s:{ bottom:`-${hOff}px`, left:"50%", transform:`translateX(-${hOff}px)` }, resize:false },
      { key:"sw", s:{ bottom:`-${hOff}px`, left:`-${hOff}px` },                       resize:true  },
      { key:"w",  s:{ top:"50%", transform:`translateY(-${hOff}px)`, left:`-${hOff}px` }, resize:true  },
    ];
    const cursorMap = { nw:"nw-resize", n:"ns-resize", ne:"ne-resize", e:"ew-resize", se:"se-resize", s:"ns-resize", sw:"sw-resize", w:"ew-resize" };

    return (
      <div style={{ position:"absolute", inset:`${inset}px`, border:`${bw}px solid ${color}${isHover?"88":"ff"}`, borderRadius:`${rDp}px`, pointerEvents:"none", zIndex:20 }}>
        {!isHover && !item.isMaster && handles.map(h => (
          <div key={h.key}
            style={{ position:"absolute", width:`${hSize}px`, height:`${hSize}px`, background:"#fff", border:`${bw}px solid ${color}`, borderRadius:`${sdp(2)}px`, cursor: cursorMap[h.key], pointerEvents:"all", zIndex:21, ...h.s }}
            onMouseDown={h.resize ? (e => startResize(e, item, h.key)) : undefined}
          />
        ))}
        {!isHover && item.isMaster && (
          <div style={{ position:"absolute", top:`-${sdp(8)}px`, right:`-${sdp(8)}px`, background:"#ccaa00", borderRadius:"50%", width:`${sdp(14)}px`, height:`${sdp(14)}px`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:`${sdp(7)}px`, fontWeight:700, color:"#000", pointerEvents:"none" }}>M</div>
        )}
      </div>
    );
  };

  // ── property panel ───────────────────────────────────────────────────────────
  const pCtl = (label, opts, val, key, allowedSet) => {
    const isLocked = allowedSet && allowedSet.length === 0;
    return (
      <div style={{ marginBottom:"10px" }}>
        <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>{label}</div>
        <div style={{ display:"flex", gap:"3px", flexWrap:"wrap" }}>
          {opts.map(o => {
            const dis = !isLocked && allowedSet && !allowedSet.includes(o);
            return (
              <button key={o} disabled={dis || isLocked} onClick={() => !dis && !isLocked && updateItem(sel.id, { [key]: o })}
                style={{ padding:"3px 7px", borderRadius:"4px", background: val===o?"#f0f0f0":"transparent", border: val===o?"1px solid #c0c0c0":"1px solid #e5e5e5", color: isLocked?"#333350": dis?"#252540": val===o?"#333333":"#999999", fontSize:"10px", cursor:(dis||isLocked)?"default":"pointer", textDecoration:dis?"line-through":"none" }}>
                {o}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProps = () => {
    if (!sel) return (
      <div style={{ padding:"24px 16px", textAlign:"center", color:"#d0d0d0", fontSize:"11px", lineHeight:2 }}>
        컴포넌트를<br/>선택하세요
        <div style={{ marginTop:"14px", padding:"10px", background:"#f4f4f4", borderRadius:"7px", textAlign:"left" }}>
          <div style={{ fontSize:"9px", color:"#aaaaaa", lineHeight:2.2 }}>
            <span style={{ color:"#555555" }}>⌫</span> 삭제<br/>
            <span style={{ color:"#555555" }}>↑↓←→</span> 1dp 이동<br/>
            <span style={{ color:"#555555" }}>⇧ + 화살표</span> 10dp<br/>
            <span style={{ color:"#555555" }}>⌘D</span> 복제<br/>
            <span style={{ color:"#555555" }}>Esc</span> 선택 해제
          </div>
        </div>
      </div>
    );
    const locked = sel.isMaster;
    return (
      <div style={{ padding:"14px", display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <div style={{ fontSize:"10px", color: locked?"#ccaa00":"#999999", letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:600 }}>
            {locked && "🔒 "}{sel.type === "frame" ? "Frame" : sel.type === "labelButton" ? "LabelButton" : sel.type === "svg" ? "SVG" : sel.type === "figma" ? "Figma" : "Text"}
          </div>
          <button onClick={() => updateItem(sel.id, { isMaster: !locked })}
            style={{ padding:"2px 6px", borderRadius:"4px", background: locked?"#fffbe6":"transparent", border: locked?"1px solid #e6c800":"1px solid #d0d0d0", color: locked?"#997700":"#888888", fontSize:"9px", cursor:"pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=locked?"#ccaa00":"#999999"; e.currentTarget.style.color=locked?"#664400":"#333333"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=locked?"#e6c800":"#d0d0d0"; e.currentTarget.style.color=locked?"#997700":"#888888"; }}>
            {locked ? "Master 해제" : "Master 지정"}
          </button>
        </div>
        {locked && (
          <div style={{ marginBottom:"10px", padding:"7px 9px", background:"#fffce6", border:"1px solid #e6c800", borderRadius:"6px", fontSize:"10px", color:"#997700", lineHeight:1.6 }}>
            편집이 잠겨있습니다.<br/>복제 후 수정하세요.
          </div>
        )}

        {sel.type === "labelButton" && <>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>labelText</div>
            <input value={sel.labelText} onChange={e => !locked && updateItem(sel.id, { labelText: e.target.value })} readOnly={locked}
              style={{ width:"100%", background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#111111", fontSize:"11px", outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>shapeStyle</div>
            <div style={{ display:"flex", gap:"3px" }}>
              {["filled","outlined","text"].map(o => (
                <button key={o} onClick={() => !locked && changeShape(o)} disabled={locked}
                  style={{ padding:"3px 7px", borderRadius:"4px", background: sel.shape===o?"#f0f0f0":"transparent", border: sel.shape===o?"1px solid #c0c0c0":"1px solid #e5e5e5", color: locked?"#333350": sel.shape===o?"#333333":"#999999", fontSize:"10px", cursor: locked?"default":"pointer" }}>
                  {o}
                </button>
              ))}
            </div>
          </div>
          {pCtl("colorStyle", ["primary_v2","gray_v2","gray250_v2"], sel.colorStyle, "colorStyle", locked ? [] : ALLOWED_COLORS[sel.shape])}
          {pCtl("size",   ["medium","small"],            sel.size,   "size",   locked ? [] : undefined)}
          {pCtl("config", ["labelOnly","labelWithIcon"], sel.config, "config", locked ? [] : undefined)}
          {sel.config === "labelWithIcon" && pCtl("iconPos", ["left","right"], sel.iconPos, "iconPos", locked ? [] : undefined)}
          {sel.config === "labelWithIcon" && (
            <div style={{ marginBottom:"10px" }}>
              <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"6px" }}>icon</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"4px" }}>
                {ICON_NAMES.map(name => (
                  <button key={name} disabled={locked} onClick={() => !locked && updateItem(sel.id, { iconName: name })} title={name}
                    style={{ padding:"5px", borderRadius:"5px", background: sel.iconName===name?"#f0f0f0":"transparent", border: sel.iconName===name?"1px solid #c0c0c0":"1px solid #e5e5e5", cursor: locked?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <YdsIcon name={name} size={14} color={locked?"#333350": sel.iconName===name?"#333333":"#888888"} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>}

        {sel.type === "text" && <>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>content</div>
            <textarea value={sel.content} onChange={e => !locked && updateItem(sel.id, { content: e.target.value })} readOnly={locked}
              style={{ width:"100%", background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#111111", fontSize:"11px", outline:"none", resize:"vertical", minHeight:"52px", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>typography</div>
            <select value={sel.style} onChange={e => !locked && updateItem(sel.id, { style: e.target.value })} disabled={locked}
              style={{ width:"100%", background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#333333", fontSize:"10px", outline:"none" }}>
              {typography.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>color</div>
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              <input type="color" value={sel.color} onChange={e => !locked && updateItem(sel.id, { color: e.target.value })} disabled={locked}
                style={{ width:"28px", height:"28px", border:"none", background:"none", cursor: locked?"default":"pointer", padding:0, opacity: locked?0.3:1 }} />
              <input value={sel.color} onChange={e => !locked && updateItem(sel.id, { color: e.target.value })} readOnly={locked}
                style={{ flex:1, background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#111111", fontSize:"11px", outline:"none" }} />
            </div>
          </div>
        </>}

        {/* Frame-specific properties */}
        {sel.type === "frame" && (
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"6px" }}>Frame 이름</div>
            <input value={sel.name||""} onChange={e => updateItem(sel.id, { name:e.target.value })}
              placeholder="Frame"
              style={{ width:"100%", background:"#fff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"5px 8px", fontSize:"11px", color:"#111", outline:"none", boxSizing:"border-box" }} />
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginTop:"8px", marginBottom:"4px" }}>배경 / 테두리</div>
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              <input type="color" value={sel.frameBg?.startsWith("rgba") ? "#f0f0f0" : (sel.frameBg||"#f0f0f0")}
                onChange={e => updateItem(sel.id, { frameBg: e.target.value })}
                style={{ width:"28px", height:"28px", border:"none", background:"none", cursor:"pointer", padding:0 }} />
              <input type="color" value={sel.frameBorder||"#cccccc"}
                onChange={e => updateItem(sel.id, { frameBorder: e.target.value })}
                style={{ width:"28px", height:"28px", border:"none", background:"none", cursor:"pointer", padding:0 }} />
              <div style={{ display:"flex", alignItems:"center", gap:"4px", flex:1, background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 6px" }}>
                <span style={{ fontSize:"9px", color:"#aaa" }}>R</span>
                <input type="number" value={sel.frameRadius||0} onChange={e => updateItem(sel.id, { frameRadius: Number(e.target.value) })}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0 }} />
              </div>
            </div>
          </div>
        )}
        {/* ── FRAME: Position & Size (Figma-style) ── */}
        <div style={{ borderTop:"1px solid #e5e5e5", paddingTop:"10px", marginBottom:"2px" }}>
          {/* X Y row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px", marginBottom:"4px", overflow:"hidden" }}>
            {[["X","x"],["Y","y"]].map(([label, key]) => (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 5px", overflow:"hidden", minWidth:0 }}>
                <span style={{ fontSize:"9px", color:"#aaaaaa", flexShrink:0 }}>{label}</span>
                <input type="number" value={sel[key]} readOnly={locked}
                  onChange={e => !locked && updateItem(sel.id, { [key]: Number(e.target.value) })}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color: locked?"#999":"#111", padding:0, minWidth:0, width:0 }} />
              </div>
            ))}
          </div>
          {/* W H row with mode icons */}
          {(["w","h"]).map(dim => {
            const modeKey = dim+"Mode";
            const pctKey  = dim+"Pct";
            const devSize = dim==="w" ? device.w : device.h;
            const curMode = sel[modeKey] || "fixed";
            const resolved = curMode==="fill" ? devSize : curMode==="pct" ? Math.round(devSize*(sel[pctKey]||100)/100) : (sel[dim]||"");
            return (
              <div key={dim} style={{ display:"flex", alignItems:"center", gap:"3px", marginBottom:"4px", overflow:"hidden" }}>
                {/* Fixed / Fill / Hug toggles */}
                <div style={{ display:"flex", gap:"2px", flexShrink:0 }}>
                  {[["fixed","—","고정"],["fill","⇔",dim==="w"?"부모 폭 채우기":"부모 높이 채우기"],["hug","⤢","내용에 맞춤"]].map(([m,icon,tip]) => (
                    <button key={m} title={tip} onClick={() => {
                      if(locked)return;
                      const patch = {[modeKey]:m};
                      if(m==="fill"){
                        patch[dim]=devSize;
                        // scroll clip도 같이 갱신
                        if(sel.scroll?.enabled){
                          const scPatch = {...(sel.scroll||{})};
                          if(dim==="w") scPatch.clipW=devSize;
                          else scPatch.clipH=devSize;
                          patch.scroll=scPatch;
                        }
                      } else if(m==="hug"){
                        patch[dim]=undefined;
                      } else if(m==="fixed"){
                        // fixed로 돌아올 때 현재 resolved 값 유지
                        patch[dim]=resolved||devSize;
                      }
                      updateItem(sel.id,patch);
                    }}
                      style={{ width:"18px", height:"18px", borderRadius:"3px", border:"none", cursor:locked?"default":"pointer", fontSize:"10px", display:"flex", alignItems:"center", justifyContent:"center", background:curMode===m?"#111":"#f0f0f0", color:curMode===m?"#fff":"#888", flexShrink:0 }}>
                      {icon}
                    </button>
                  ))}
                </div>
                {/* dim label */}
                <span style={{ fontSize:"9px", color:"#aaa", flexShrink:0, textTransform:"uppercase", width:"9px" }}>{dim}</span>
                {/* value field */}
                <div style={{ flex:1, display:"flex", alignItems:"center", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 5px", overflow:"hidden", minWidth:0 }}>
                  {curMode==="hug" ? <span style={{ fontSize:"10px", color:"#aaa" }}>hug</span>
                  : curMode==="fill" ? <span style={{ fontSize:"10px", color:"#aaa" }}>{devSize}</span>
                  : curMode==="pct" ? <>
                      <input type="number" min={1} max={100} value={sel[pctKey]||100} readOnly={locked}
                        onChange={e => { if(locked)return; const pct=Number(e.target.value); updateItem(sel.id,{[pctKey]:pct,[dim]:Math.round(devSize*pct/100)}); }}
                        style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0, width:0 }} />
                      <span style={{ fontSize:"9px", color:"#aaa", flexShrink:0 }}>%</span>
                    </>
                  : <input type="number" value={sel[dim]||""} placeholder="auto" readOnly={locked}
                      onChange={e => !locked && updateItem(sel.id,{[dim]:e.target.value?Number(e.target.value):undefined,[modeKey]:"fixed"})}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:locked?"#999":"#111", padding:0, minWidth:0, width:0 }} />
                  }
                </div>
                {/* % toggle (fixed only) */}
                {curMode==="fixed" && (
                  <button title="%" onClick={() => { if(locked)return; const pct=sel[pctKey]||Math.round((sel[dim]||devSize)*100/devSize); updateItem(sel.id,{[modeKey]:"pct",[pctKey]:pct,[dim]:Math.round(devSize*pct/100)}); }}
                    style={{ fontSize:"8px", color:"#aaa", background:"transparent", border:"1px solid #e5e5e5", borderRadius:"3px", padding:"2px 3px", cursor:"pointer", flexShrink:0 }}>%</button>
                )}
              </div>
            );
          })}
          {/* Snap toggle */}
          <div style={{ display:"flex", justifyContent:"flex-end" }}>
            <button onClick={() => setSnapGrid(v => !v)}
              style={{ fontSize:"9px", padding:"2px 7px", borderRadius:"4px", background: snapGrid?"#111":"transparent", color: snapGrid?"#fff":"#aaa", border: snapGrid?"none":"1px solid #e5e5e5", cursor:"pointer" }}>
              {snapGrid ? "Snap 8dp ✓" : "Snap off"}
            </button>
          </div>
        </div>

        {/* ── AUTO LAYOUT ── */}
        <div style={{ borderTop:"1px solid #e5e5e5", paddingTop:"10px", marginBottom:"2px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
            <span style={{ fontSize:"10px", color:"#999", fontWeight:600, letterSpacing:"0.08em" }}>AUTO LAYOUT</span>
            <button onClick={() => {
              if (sel.autoLayout?.enabled)
                updateItem(sel.id, { autoLayout: null });
              else
                updateItem(sel.id, { autoLayout: { enabled:true, direction:"horizontal", gap:8, padT:8, padR:8, padB:8, padL:8, mainAlign:"start", crossAlign:"center", wrap:false } });
            }}
              style={{ padding:"2px 8px", borderRadius:"10px", fontSize:"9px", fontWeight:700, border:"none", cursor:"pointer", background: sel.autoLayout?.enabled?"#111":"#f0f0f0", color: sel.autoLayout?.enabled?"#fff":"#888" }}>
              {sel.autoLayout?.enabled ? "ON" : "OFF"}
            </button>
          </div>
          {sel.autoLayout?.enabled && (() => {
            const al = sel.autoLayout;
            const upAl = (patch) => updateItem(sel.id, { autoLayout: { ...al, ...patch } });
            return (<>
              {/* Direction */}
              <div style={{ display:"flex", gap:"4px", marginBottom:"6px" }}>
                {[["horizontal","⇒ 가로"],["vertical","⇓ 세로"]].map(([d,label]) => (
                  <button key={d} onClick={() => upAl({ direction:d })}
                    style={{ flex:1, padding:"5px", borderRadius:"5px", fontSize:"10px", fontWeight: al.direction===d?700:400, background: al.direction===d?"#111":"transparent", color: al.direction===d?"#fff":"#888", border: al.direction===d?"none":"1px solid #e5e5e5", cursor:"pointer" }}>
                    {label}
                  </button>
                ))}
              </div>
              {/* Gap */}
              <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                <span style={{ fontSize:"9px", color:"#aaa", width:"30px" }}>Gap</span>
                <div style={{ flex:1, display:"flex", alignItems:"center", gap:"4px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 6px" }}>
                  <input type="number" value={al.gap} onChange={e => upAl({ gap:Number(e.target.value) })}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0 }} />
                  <span style={{ fontSize:"9px", color:"#aaa" }}>dp</span>
                </div>
              </div>
              {/* Padding */}
              <div style={{ marginBottom:"6px" }}>
                <div style={{ fontSize:"9px", color:"#aaa", marginBottom:"4px" }}>Padding</div>
                {/* Top row */}
                <div style={{ display:"flex", justifyContent:"center", marginBottom:"3px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 8px", width:"60px" }}>
                    <span style={{ fontSize:"8px", color:"#aaa" }}>T</span>
                    <input type="number" value={al.padT||0} onChange={e => upAl({ padT:Number(e.target.value) })}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0 }} />
                  </div>
                </div>
                {/* Middle row: L and R */}
                <div style={{ display:"flex", gap:"4px", justifyContent:"space-between", marginBottom:"3px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 8px", width:"60px" }}>
                    <span style={{ fontSize:"8px", color:"#aaa" }}>L</span>
                    <input type="number" value={al.padL||0} onChange={e => upAl({ padL:Number(e.target.value) })}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0 }} />
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 8px", width:"60px" }}>
                    <span style={{ fontSize:"8px", color:"#aaa" }}>R</span>
                    <input type="number" value={al.padR||0} onChange={e => upAl({ padR:Number(e.target.value) })}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0 }} />
                  </div>
                </div>
                {/* Bottom row */}
                <div style={{ display:"flex", justifyContent:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 8px", width:"60px" }}>
                    <span style={{ fontSize:"8px", color:"#aaa" }}>B</span>
                    <input type="number" value={al.padB||0} onChange={e => upAl({ padB:Number(e.target.value) })}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0 }} />
                  </div>
                </div>
              </div>
              {/* Align main axis */}
              <div style={{ marginBottom:"4px" }}>
                <div style={{ fontSize:"9px", color:"#aaa", marginBottom:"3px" }}>{al.direction==="horizontal"?"가로 정렬":"세로 정렬"}</div>
                <div style={{ display:"flex", gap:"3px" }}>
                  {[["start","시작"],["center","중앙"],["end","끝"],["space-between","균등"]].map(([v,label]) => (
                    <button key={v} onClick={() => upAl({ mainAlign:v })}
                      style={{ flex:1, padding:"3px 2px", borderRadius:"4px", fontSize:"9px", background: al.mainAlign===v?"#111":"transparent", color: al.mainAlign===v?"#fff":"#888", border: al.mainAlign===v?"none":"1px solid #e5e5e5", cursor:"pointer" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Align cross axis */}
              <div style={{ marginBottom:"6px" }}>
                <div style={{ fontSize:"9px", color:"#aaa", marginBottom:"3px" }}>{al.direction==="horizontal"?"세로 정렬":"가로 정렬"}</div>
                <div style={{ display:"flex", gap:"3px" }}>
                  {[["start","시작"],["center","중앙"],["end","끝"]].map(([v,label]) => (
                    <button key={v} onClick={() => upAl({ crossAlign:v })}
                      style={{ flex:1, padding:"3px 2px", borderRadius:"4px", fontSize:"9px", background: al.crossAlign===v?"#111":"transparent", color: al.crossAlign===v?"#fff":"#888", border: al.crossAlign===v?"none":"1px solid #e5e5e5", cursor:"pointer" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Wrap */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
                <span style={{ fontSize:"9px", color:"#aaa" }}>Wrap</span>
                <button onClick={() => upAl({ wrap: !al.wrap })}
                  style={{ padding:"2px 8px", borderRadius:"10px", fontSize:"9px", fontWeight:700, border:"none", cursor:"pointer", background: al.wrap?"#111":"#f0f0f0", color: al.wrap?"#fff":"#888" }}>
                  {al.wrap?"ON":"OFF"}
                </button>
              </div>
              {/* Platform code hints */}
              <div style={{ background:"#f4f4f4", borderRadius:"6px", padding:"7px 9px", fontSize:"8.5px", lineHeight:1.8, color:"#888" }}>
                <div style={{ fontWeight:700, color:"#555", marginBottom:"3px", fontSize:"9px" }}>코드 변환</div>
                <div><span style={{ color:"#5577cc" }}>iOS</span> {al.direction==="horizontal"
                  ? `HStack(alignment: .${al.crossAlign==="start"?"top":al.crossAlign==="end"?"bottom":"center"}, spacing: ${al.gap})`
                  : `VStack(alignment: .${al.crossAlign==="start"?"leading":al.crossAlign==="end"?"trailing":"center"}, spacing: ${al.gap})`}</div>
                <div style={{ marginTop:"2px" }}><span style={{ color:"#aa5500" }}>Android</span> {al.direction==="horizontal"
                  ? `Row(horizontalArrangement = Arrangement.${al.mainAlign==="space-between"?"SpaceBetween":al.mainAlign==="center"?"Center":al.mainAlign==="end"?"End":"Start"}, verticalAlignment = Alignment.${al.crossAlign==="start"?"Top":al.crossAlign==="end"?"Bottom":"CenterVertically"})`
                  : `Column(verticalArrangement = Arrangement.${al.mainAlign==="space-between"?"SpaceBetween":al.mainAlign==="center"?"Center":al.mainAlign==="end"?"Bottom":"Top"}, horizontalAlignment = Alignment.${al.crossAlign==="start"?"Start":al.crossAlign==="end"?"End":"CenterHorizontally"})`}</div>
                <div style={{ marginTop:"2px" }}><span style={{ color:"#338855" }}>XML</span> LinearLayout orientation="{al.direction==="horizontal"?"horizontal":"vertical"}" gravity="{al.mainAlign==="center"?"center":al.mainAlign==="end"?"end":"start"}"</div>
              </div>
            </>);
          })()}
        </div>

        {/* ── SCROLL ── */}
        <div style={{ borderTop:"1px solid #e5e5e5", paddingTop:"10px", marginBottom:"2px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
            <span style={{ fontSize:"10px", color:"#999", fontWeight:600, letterSpacing:"0.08em" }}>SCROLL</span>
            <button onClick={() => updateItem(sel.id, { scroll: sel.scroll?.enabled ? null : { enabled:true, direction:"horizontal", clipW:sel.w||200, clipH:sel.h||120 } })}
              style={{ padding:"2px 8px", borderRadius:"10px", fontSize:"9px", fontWeight:700, border:"none", cursor:"pointer", background: sel.scroll?.enabled?"#111":"#f0f0f0", color: sel.scroll?.enabled?"#fff":"#888" }}>
              {sel.scroll?.enabled?"ON":"OFF"}
            </button>
          </div>
          {sel.scroll?.enabled && (<>
            <div style={{ display:"flex", gap:"4px", marginBottom:"6px" }}>
              {[["horizontal","⇔ 가로"],["vertical","⇕ 세로"]].map(([d,label]) => (
                <button key={d} onClick={() => updateItem(sel.id, { scroll:{ ...sel.scroll, direction:d } })}
                  style={{ flex:1, padding:"5px", borderRadius:"5px", fontSize:"10px", fontWeight: sel.scroll.direction===d?700:400, background: sel.scroll.direction===d?"#111":"transparent", color: sel.scroll.direction===d?"#fff":"#888", border: sel.scroll.direction===d?"none":"1px solid #e5e5e5", cursor:"pointer" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px", overflow:"hidden" }}>
              {[["W","clipW"],["H","clipH"]].map(([label,key]) => (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 5px", overflow:"hidden", minWidth:0 }}>
                  <span style={{ fontSize:"9px", color:"#aaa", flexShrink:0 }}>{label}</span>
                  <input type="number" value={sel.scroll[key]} onChange={e => updateItem(sel.id, { scroll:{ ...sel.scroll, [key]:Number(e.target.value) } })}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0, width:0 }} />
                </div>
              ))}
            </div>
          </>)}
        </div>

        {/* ── INTERACTION ── */}
        {screens.length > 1 && (
          <div style={{ borderTop:"1px solid #e5e5e5", paddingTop:"10px", marginBottom:"2px" }}>
            <div style={{ fontSize:"10px", color:"#999", fontWeight:600, letterSpacing:"0.08em", marginBottom:"6px" }}>INTERACTION</div>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <span style={{ fontSize:"9px", color:"#aaa", flexShrink:0 }}>탭 →</span>
              <select value={sel.onTap?.screenId||""} onChange={e => { const v=e.target.value; updateItem(sel.id, { onTap: v?{ type:"navigate", screenId:Number(v) }:null }); }}
                style={{ flex:1, padding:"4px 6px", borderRadius:"5px", border:"1px solid #d0d0d0", background:"#fff", fontSize:"10px", color:"#333", outline:"none" }}>
                <option value="">없음</option>
                {screens.filter(s=>s.id!==activeId).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {sel.onTap?.screenId && (
              <div style={{ marginTop:"5px", fontSize:"9px", color:"#5028c8", background:"#f4f0ff", padding:"4px 7px", borderRadius:"5px" }}>
                ▶ "{screens.find(s=>s.id===sel.onTap.screenId)?.name}"으로 이동
              </div>
            )}
          </div>
        )}

        {/* ── ACTIONS ── */}
        <div style={{ borderTop:"1px solid #e5e5e5", paddingTop:"10px", display:"flex", gap:"6px" }}>
          <button onClick={() => duplicateItem(sel)}
            style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border:"1px solid #b0d0b8", color:"#2a7a4a", fontSize:"10px", cursor:"pointer" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#e8f5ec";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>복제</button>
          <button onClick={() => !locked && removeItem(sel.id)} disabled={locked}
            style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border: locked?"1px solid #ddd":"1px solid #f0b0b0", color: locked?"#ccc":"#aa3333", fontSize:"10px", cursor: locked?"default":"pointer" }}
            onMouseEnter={e=>{if(!locked)e.currentTarget.style.background="#ffeaea";}} onMouseLeave={e=>{if(!locked)e.currentTarget.style.background="transparent";}}>삭제</button>
        </div>
      </div>
    );
  };

  // ── layout ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>

      {/* Mode toggle */}
      <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
        {[["assembly","⬚ 조립"], ["prototype","▶ 프로토타이핑"]].map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setSelected(null); }}
            style={{ padding:"6px 16px", borderRadius:"20px", fontSize:"11px", fontWeight: mode===m ? 700 : 400, background: mode===m ? "#111111" : "transparent", color: mode===m ? "#ffffff" : "#888888", border: mode===m ? "none" : "1px solid #e0e0e0", cursor:"pointer", transition:"all 0.15s" }}>
            {label}
          </button>
        ))}
        <div style={{ fontSize:"10px", color:"#cccccc", marginLeft:"8px" }}>
          {isProto ? "실제 앱처럼 — 터치 스크롤 / 핀치 줌" : "컴포넌트 배치 및 편집"}
          {isProto && protoScale !== 1 && (
            <button onClick={() => setProtoScale(1)}
              style={{ marginLeft:"6px", padding:"2px 8px", borderRadius:"10px", fontSize:"9px", background:"#f0f0f0", border:"1px solid #d0d0d0", color:"#555", cursor:"pointer" }}>
              {Math.round(protoScale*100)}% ↺
            </button>
          )}
        </div>
      </div>

      {/* Screens tab bar */}
      <div style={{ display:"flex", alignItems:"center", gap:"4px", padding:"6px 10px", background:"#f8f8f8", border:"1px solid #e5e5e5", borderRadius:"10px", minHeight:"36px" }}>
        {isProto ? (
          /* Prototype mode: prev/next navigation */
          <>
            <button
              onClick={() => {
                const idx = screens.findIndex(s => s.id === protoId);
                if (idx > 0) setProtoScreenId(screens[idx - 1].id);
              }}
              disabled={screens.findIndex(s => s.id === protoId) === 0}
              style={{ padding:"3px 8px", borderRadius:"5px", background:"transparent", border:"1px solid #e0e0e0", color: screens.findIndex(s => s.id === protoId) === 0 ? "#d0d0d0" : "#555555", fontSize:"11px", cursor: screens.findIndex(s => s.id === protoId) === 0 ? "default" : "pointer" }}>
              ‹
            </button>
            <div style={{ display:"flex", gap:"3px", flex:1, justifyContent:"center" }}>
              {screens.map((s, idx) => (
                <button key={s.id} onClick={() => setProtoScreenId(s.id)}
                  style={{ padding:"4px 12px", borderRadius:"16px", fontSize:"11px", background: protoId === s.id ? "#111111" : "transparent", color: protoId === s.id ? "#ffffff" : "#888888", border: protoId === s.id ? "none" : "1px solid #e0e0e0", cursor:"pointer", fontWeight: protoId === s.id ? 700 : 400, transition:"all 0.12s" }}>
                  {s.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const idx = screens.findIndex(s => s.id === protoId);
                if (idx < screens.length - 1) setProtoScreenId(screens[idx + 1].id);
              }}
              disabled={screens.findIndex(s => s.id === protoId) === screens.length - 1}
              style={{ padding:"3px 8px", borderRadius:"5px", background:"transparent", border:"1px solid #e0e0e0", color: screens.findIndex(s => s.id === protoId) === screens.length - 1 ? "#d0d0d0" : "#555555", fontSize:"11px", cursor: screens.findIndex(s => s.id === protoId) === screens.length - 1 ? "default" : "pointer" }}>
              ›
            </button>
          </>
        ) : (
          /* Assembly mode: screen tabs + add/rename/delete */
          <>
            {screens.map(s => (
              <div key={s.id} style={{ display:"flex", alignItems:"center", gap:"2px", position:"relative" }}>
                {renamingId === s.id ? (
                  <input
                    autoFocus
                    value={renameVal}
                    onChange={e => setRenameVal(e.target.value)}
                    onBlur={() => { setScreens(prev => prev.map(sc => sc.id === s.id ? { ...sc, name: renameVal || sc.name } : sc)); setRenamingId(null); }}
                    onKeyDown={e => {
                      if (e.key === "Enter") { setScreens(prev => prev.map(sc => sc.id === s.id ? { ...sc, name: renameVal || sc.name } : sc)); setRenamingId(null); }
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    style={{ padding:"3px 8px", borderRadius:"5px", border:"1px solid #5028c8", fontSize:"11px", color:"#111111", outline:"none", width:"90px", background:"#fff" }}
                  />
                ) : (
                  <button
                    onClick={() => setActiveScreenId(s.id)}
                    onDoubleClick={() => { setRenamingId(s.id); setRenameVal(s.name); }}
                    style={{ padding:"4px 10px", borderRadius:"16px", fontSize:"11px", background: activeId === s.id ? "#111111" : "transparent", color: activeId === s.id ? "#ffffff" : "#888888", border: activeId === s.id ? "none" : "1px solid #e0e0e0", cursor:"pointer", fontWeight: activeId === s.id ? 700 : 400, transition:"all 0.12s", display:"flex", alignItems:"center", gap:"5px" }}>
                    {s.name}
                    {screens.length > 1 && (
                      <span
                        onClick={e => { e.stopPropagation(); removeScreen(s.id); }}
                        style={{ fontSize:"10px", color: activeId === s.id ? "#ffffff88" : "#cccccc", lineHeight:1, marginLeft:"2px" }}>×</span>
                    )}
                  </button>
                )}
              </div>
            ))}
            <button onClick={addScreen}
              style={{ padding:"4px 8px", borderRadius:"5px", background:"transparent", border:"1px dashed #d0d0d0", color:"#aaaaaa", fontSize:"11px", cursor:"pointer", flexShrink:0, marginLeft:"2px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#5028c8"; e.currentTarget.style.color="#5028c8"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#d0d0d0"; e.currentTarget.style.color="#aaaaaa"; }}>
              + 화면
            </button>
            <div style={{ fontSize:"9px", color:"#cccccc", marginLeft:"auto", flexShrink:0 }}>더블클릭 → 이름 편집</div>
          </>
        )}
      </div>

    <div style={{ display:"flex", gap:"16px", alignItems:"flex-start" }}>

      {/* Left: Device + Palette + Layers */}
      {!isProto && <div style={{ width:"224px", flexShrink:0, display:"flex", flexDirection:"column", gap:"10px" }}>

        {/* AI 명령 패널 */}
        <div style={{ background: aiStatus==="waiting" ? "#fffbe8" : aiStatus==="done" ? "#f0fff4" : aiStatus==="error" ? "#fff0f0" : "#f5f0ff", border:`1px solid ${aiStatus==="waiting"?"#f0c040":aiStatus==="done"?"#88cc88":aiStatus==="error"?"#ee8888":"#c0a0ff"}`, borderRadius:"10px", padding:"10px" }}>
          {/* 프록시 연결 상태 */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px" }}>
            <div style={{ fontSize:"10px", fontWeight:700, color:"#5028c8", letterSpacing:"0.1em", textTransform:"uppercase" }}>✦ AI 명령</div>
            {aiProxyUrl
              ? <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                  <span style={{ fontSize:"9px", color:"#059669", fontWeight:600 }}>⚡ 연결됨</span>
                  <button onClick={disconnectAiProxy} style={{ fontSize:"9px", padding:"1px 6px", borderRadius:"4px", background:"transparent", border:"1px solid #fca5a5", color:"#dc2626", cursor:"pointer" }}>해제</button>
                </div>
              : <button onClick={detectAiProxy}
                  style={{ fontSize:"9px", padding:"2px 8px", borderRadius:"5px", background:"#111", border:"none", color:"#fff", cursor:"pointer", fontWeight:600 }}>
                  AI 활성화
                </button>
            }
          </div>
          {/* 처리 상태 */}
          {aiStatus==="waiting" && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
              <div style={{ fontSize:"9px", color:"#b07000", display:"flex", gap:"8px" }}>
                <span>시작 {new Date(aiStartTime).toLocaleTimeString("ko-KR", { hour:"2-digit", minute:"2-digit", second:"2-digit" })}</span>
                <span style={{ fontVariantNumeric:"tabular-nums" }}>경과 {aiElapsed}s</span>
              </div>
              <button onClick={cancelAiCommand} style={{ fontSize:"9px", padding:"1px 8px", borderRadius:"4px", background:"#fff0f0", border:"1px solid #ffaaaa", color:"#cc3333", cursor:"pointer", fontWeight:600 }}>■ 중지</button>
            </div>
          )}
          {aiStatus==="done" && <div style={{ fontSize:"9px", color:"#059669", marginBottom:"6px", fontWeight:600 }}>✓ 완료</div>}
          {aiStatus==="error" && <div style={{ fontSize:"9px", color:"#cc3333", marginBottom:"6px", fontWeight:600 }}>✗ 오류 — 다시 시도하세요</div>}
          <textarea
            value={aiCommand}
            onChange={e => setAiCommand(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); sendAiCommand(); } }}
            placeholder={aiProxyUrl ? "화면을 글로 설명해주세요.\n예) 요기요 홈 화면\n카테고리 + 추천 가게 카드\n\nCmd+Enter로 전송" : "먼저 프록시를 연결해주세요."}
            disabled={aiStatus==="waiting" || !aiProxyUrl}
            style={{ width:"100%", minHeight:"80px", background:"transparent", border:"none", outline:"none", fontSize:"11px", color: aiProxyUrl?"#333":"#aaa", lineHeight:1.6, resize:"none", fontFamily:"inherit", boxSizing:"border-box", padding:0 }}
          />
          <button onClick={sendAiCommand} disabled={aiStatus==="waiting" || !aiCommand.trim() || !aiProxyUrl}
            style={{ marginTop:"6px", width:"100%", padding:"7px", borderRadius:"6px", background: (!aiProxyUrl||aiStatus==="waiting")?"#e5e5e5":"#5028c8", border:"none", color: (!aiProxyUrl||aiStatus==="waiting")?"#aaa":"#fff", fontSize:"11px", fontWeight:700, cursor: (!aiProxyUrl||aiStatus==="waiting")?"default":"pointer", transition:"all 0.15s" }}>
            {aiStatus==="waiting" ? "처리 중..." : "→ 화면 그리기"}
          </button>
        </div>

        <div style={{ background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", padding:"12px" }}>
          <div style={{ fontSize:"10px", color:"#999999", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px", fontWeight:600 }}>Platform</div>
          <div style={{ display:"flex", gap:"5px", marginBottom:"10px" }}>
            {["ios","android"].map(p => (
              <button key={p} onClick={() => { setPlatform(p); setDeviceIdx(0); }}
                style={{ flex:1, padding:"6px", borderRadius:"6px", background: platform===p?"#f0f0f0":"transparent", border: platform===p?"1px solid #c0c0c0":"1px solid #e5e5e5", color: platform===p?"#333333":"#999999", fontSize:"11px", cursor:"pointer", fontWeight: platform===p?700:400, textTransform:"uppercase" }}>
                {p === "ios" ? "iOS" : "Android"}
              </button>
            ))}
          </div>
          <select value={deviceIdx} onChange={e => setDeviceIdx(Number(e.target.value))}
            style={{ width:"100%", background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"6px", padding:"5px 8px", color:"#333333", fontSize:"10px", outline:"none" }}>
            {DEVICES[platform].map((d, i) => <option key={i} value={i}>{d.name} ({d.w}×{d.h})</option>)}
          </select>
          <button onClick={() => setDarkMode(d => !d)}
            style={{ marginTop:"8px", width:"100%", padding:"7px", borderRadius:"6px", border:`1px solid ${darkMode?"#5a5a9a":"#e5e5e5"}`, background: darkMode?"#1a1a3a":"transparent", color: darkMode?"#333333":"#999999", fontSize:"11px", cursor:"pointer", fontWeight:600, transition:"all 0.15s" }}>
            {darkMode ? "☾  Dark" : "☀  Light"}
          </button>
        </div>

        {/* Palette */}
        <div style={{ background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", padding:"12px" }}>
          <div style={{ fontSize:"10px", color:"#999999", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px", fontWeight:600 }}>Add</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
            {[{ type:"frame", label:"▣  Frame" }, { type:"labelButton", label:"⬚  LabelButton" }, { type:"text", label:"T   Text" }].map(c => (
              <button key={c.type} onClick={() => addItem(c.type)}
                style={{ padding:"8px 10px", borderRadius:"7px", background:"transparent", border:"1px solid #e5e5e5", color:"#888888", fontSize:"11px", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#c0c0c0"; e.currentTarget.style.color="#333333"; e.currentTarget.style.background="#f4f4f4"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e5e5"; e.currentTarget.style.color="#888888"; e.currentTarget.style.background="transparent"; }}>
                + {c.label}
              </button>
            ))}
            <button onClick={() => { setShowFigmaPanel(v => !v); setShowDraftPicker(false); }}
              style={{ padding:"8px 10px", borderRadius:"7px", background: showFigmaPanel?"#111111":"transparent", border: showFigmaPanel?"1px solid #333333":"1px solid #e5e5e5", color: showFigmaPanel?"#ffffff":"#888888", fontSize:"11px", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
              onMouseEnter={e => { if (!showFigmaPanel) { e.currentTarget.style.borderColor="#c0c0c0"; e.currentTarget.style.color="#333333"; e.currentTarget.style.background="#f4f4f4"; }}}
              onMouseLeave={e => { if (!showFigmaPanel) { e.currentTarget.style.borderColor="#e5e5e5"; e.currentTarget.style.color="#888888"; e.currentTarget.style.background="transparent"; }}}>
              ◈  Figma SVG
            </button>
            {(
              <button onClick={() => {
                const next = !showDraftPicker;
                setShowDraftPicker(next);
                setShowFigmaPanel(false);
                if (next) {
                  setPickerLoading(true);
                  fetchComponents()
                    .then(rows => { setPickerDrafts(rows.map(rowToDraft)); setPickerLoading(false); })
                    .catch(e => { toast("불러오기 실패: " + e.message, "error"); setPickerLoading(false); });
                }
              }}
                style={{ padding:"8px 10px", borderRadius:"7px", background: showDraftPicker?"#5028c8":"transparent", border: showDraftPicker?"1px solid #5028c8":"1px solid #e5e5e5", color: showDraftPicker?"#ffffff":"#888888", fontSize:"11px", cursor:"pointer", textAlign:"left", transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"space-between" }}
                onMouseEnter={e => { if (!showDraftPicker) { e.currentTarget.style.borderColor="#c0c0c0"; e.currentTarget.style.color="#333333"; e.currentTarget.style.background="#f4f4f4"; }}}
                onMouseLeave={e => { if (!showDraftPicker) { e.currentTarget.style.borderColor="#e5e5e5"; e.currentTarget.style.color="#888888"; e.currentTarget.style.background="transparent"; }}}>
                <span>◈  From Drafts</span>
                {pickerLoading
                  ? <span style={{ display:"inline-block", width:"10px", height:"10px", border:"1.5px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.6s linear infinite" }} />
                  : <span style={{ fontSize:"9px", background: showDraftPicker?"rgba(255,255,255,0.3)":"#e5e5e5", color: showDraftPicker?"#fff":"#888888", borderRadius:"10px", padding:"1px 6px" }}>{pickerDrafts.length}</span>
                }
              </button>
            )}
          </div>
        </div>

        {/* Figma Import Panel */}
        {showFigmaPanel && (
          <FigmaImportPanel
            onClose={() => setShowFigmaPanel(false)}
            onAdd={({ svgData, figmaData, w, h }) => {
              const id = Date.now();
              if (figmaData) {
                setItems(prev => [...prev, { id, type:"figma", figmaData, w, h, x:16, y:Math.min(16+prev.length*40,400), isMaster:false }]);
              } else {
                setItems(prev => [...prev, { id, type:"svg", svgData, w, h, x:16, y:Math.min(16+prev.length*40,400), isMaster:false }]);
              }
              setSelected(id);
              setShowFigmaPanel(false);
            }}
          />
        )}

        {/* Draft Picker */}
        {showDraftPicker && (
          <div style={{ background:"#ffffff", border:"1px solid #5028c8", borderRadius:"10px", padding:"12px", display:"flex", flexDirection:"column", gap:"6px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:"10px", fontWeight:700, color:"#5028c8", letterSpacing:"0.1em", textTransform:"uppercase" }}>Components</div>
              <button onClick={() => setShowDraftPicker(false)} style={{ background:"none", border:"none", color:"#aaaaaa", cursor:"pointer", fontSize:"14px" }}>×</button>
            </div>
            {pickerLoading && (
              <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 0", color:"#aaa", fontSize:"11px" }}>
                <span style={{ display:"inline-block", width:"10px", height:"10px", border:"1.5px solid #e5e5e5", borderTopColor:"#5028c8", borderRadius:"50%", animation:"spin 0.6s linear infinite" }} />
                불러오는 중...
              </div>
            )}
            {!pickerLoading && pickerDrafts.length === 0 && (
              <div style={{ fontSize:"11px", color:"#aaaaaa", padding:"8px 0" }}>저장된 컴포넌트가 없습니다</div>
            )}
            {!pickerLoading && pickerDrafts.map(draft => {
              const dw = draft.w || 100;
              const dh = draft.h || 100;
              const scale = Math.min(60 / dw, 40 / dh, 1);
              return (
                <button key={draft.id}
                  onClick={() => {
                    const id = Date.now();
                    setItems(prev => [...prev, { id, type:"svg", svgData: draft.svgData, w: dw, h: dh, x:16, y:Math.min(16+prev.length*40,400), isMaster:false }]);
                    setSelected(id);
                    setShowDraftPicker(false);
                  }}
                  style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px", borderRadius:"7px", background:"transparent", border:"1px solid #e5e5e5", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="#f4f0ff"; e.currentTarget.style.borderColor="#5028c8"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="#e5e5e5"; }}>
                  <div style={{ width:60, height:40, background:"#f5f5f5", borderRadius:"5px", flexShrink:0, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ transform:`scale(${scale})`, transformOrigin:"center center", lineHeight:0 }}
                      dangerouslySetInnerHTML={{ __html: draft.svgData }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:"11px", fontWeight:600, color:"#333333", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{draft.name}</div>
                    <div style={{ fontSize:"9px", color:"#aaaaaa", marginTop:"2px" }}>{Math.round(dw)}×{Math.round(dh)}px</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Layers */}
        <div style={{ background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", padding:"12px", flex:1 }}>
          <div style={{ fontSize:"10px", color:"#999999", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px", fontWeight:600 }}>Layers</div>
          {items.length === 0
            ? <div style={{ fontSize:"10px", color:"#d0d0d0", textAlign:"center", padding:"12px 0" }}>비어있음</div>
            : <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                {flattenTree(items).map(({ item, depth }) => {
                  const icon = item.type==="frame" ? "▣" : item.type==="labelButton" ? "⬚" : item.type==="text" ? "T" : "◈";
                  const label = item.type==="frame" ? (item.name||"Frame") : item.type==="labelButton" ? item.labelText : item.type==="text" ? item.content : item.type==="svg" ? (item.name||"SVG") : item.type==="figma" ? (item.name||"Figma") : (item.name||item.type);
                  return (
                    <div key={item.id} onClick={() => setSelected(item.id)}
                      style={{ display:"flex", alignItems:"center", paddingLeft:`${8+depth*10}px`, paddingRight:"4px", paddingTop:"4px", paddingBottom:"4px", borderRadius:"5px", background: selected===item.id?"#e5e5e5":"transparent", border: selected===item.id?"1px solid #c0c0c0":"1px solid transparent", cursor:"pointer" }}>
                      <span style={{ fontSize:"10px", color: item.type==="frame"?"#5028c8": item.isMaster?"#ccaa00": selected===item.id?"#333":"#888", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>
                        {depth>0 ? "└ " : ""}{item.isMaster?"🔒 ":""}{icon} {label}
                      </span>
                      <button onClick={e => { e.stopPropagation(); if (!item.isMaster) removeItem(item.id); }}
                        style={{ background:"none", border:"none", color:"#ccc", cursor: item.isMaster?"default":"pointer", fontSize:"11px", padding:"0 2px", flexShrink:0 }}>×</button>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      </div>}

      {/* Center: Phone canvas */}
      <style>{`.sim-noscrollbar::-webkit-scrollbar{display:none}`}</style>
      <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
        <PhoneFrame platform={platform} device={device} canvasMode darkMode={darkMode}>
          <div
            ref={protoFrameRef}
            style={{
              position:"absolute", inset:0,
              transform: isProto && protoScale !== 1 ? `scale(${protoScale})` : undefined,
              transformOrigin:"top center",
              touchAction: isProto ? "pan-y pinch-zoom" : "none",
            }}
            onClick={() => !isProto && setSelected(null)}
          >
            {(isProto ? protoScreen?.items || [] : items).map(item => renderItemWrapper(item, null, 0))}
            {(isProto ? protoScreen?.items || [] : items).length === 0 && (
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#bbb", fontSize:`${sdp(12)}px`, fontFamily:"system-ui", pointerEvents:"none", flexDirection:"column", gap:`${sdp(6)}px` }}>
                <span style={{ fontSize:`${sdp(24)}px`, opacity:0.3 }}>+</span>
                <span style={{ opacity:0.4 }}>{isProto ? "조립 모드에서 컴포넌트를 추가하세요" : "Add에서 컴포넌트 추가"}</span>
              </div>
            )}
          </div>
        </PhoneFrame>
      </div>

      {/* Right: Properties (조립 모드만) */}
      {!isProto && <div style={{ width:"224px", flexShrink:0, background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", overflow:"hidden" }}>
        {renderProps()}
      </div>}

    </div>
    </div>
  );
}

// ── OS Version definitions ────────────────────────────────────────────────────

const IOS_OS = [
  { id: "14", label: "iOS 14", liquidGlass: false },
  { id: "15", label: "iOS 15", liquidGlass: false },
  { id: "16", label: "iOS 16", liquidGlass: false },
  { id: "17", label: "iOS 17", liquidGlass: false },
  { id: "18", label: "iOS 18", liquidGlass: false },
  { id: "26", label: "iOS 26", liquidGlass: true  },
];

const ANDROID_OS = [
  { id: "28", label: "Android 9  (API 28)", blur: false, scrim: false },
  { id: "29", label: "Android 10 (API 29)", blur: false, scrim: true  },
  { id: "30", label: "Android 11 (API 30)", blur: false, scrim: true  },
  { id: "31", label: "Android 12 (API 31)", blur: true,  scrim: true  },
  { id: "33", label: "Android 13 (API 33)", blur: true,  scrim: true  },
  { id: "34", label: "Android 14 (API 34)", blur: true,  scrim: true  },
  { id: "35", label: "Android 15 (API 35)", blur: true,  scrim: true  },
];

// ── Code generators: Glass Nav ────────────────────────────────────────────────

function genGlassCode(platform, os, framework) {
  const api = platform === "android" ? parseInt(os.id) : 0;

  if (framework === "css") return `/* Glass Nav Bar — CSS */
.nav-wrapper {
  height: 100vh;
  overflow-y: auto;
}

.nav-bar {
  position: sticky;
  top: 0;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  backdrop-filter: blur(0px) saturate(1);
  -webkit-backdrop-filter: blur(0px) saturate(1);
  background-color: rgba(255, 255, 255, 0);
  border-bottom: none;
  transition: all 0.25s;
  z-index: 100;
}

/* Scrolled state — toggle via JS */
.nav-bar.scrolled {
  backdrop-filter: blur(40px) saturate(2.2);
  -webkit-backdrop-filter: blur(40px) saturate(2.2);
  background-color: rgba(255, 255, 255, 0.7);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.08);
}

/* JS: scroll-reactive ratio */
// document.querySelector('.nav-wrapper').addEventListener('scroll', (e) => {
//   const ratio = Math.min(e.target.scrollTop / 300, 1);
//   navBar.style.backdropFilter = \`blur(\${ratio*40}px) saturate(\${1+ratio*1.2})\`;
//   navBar.style.background = \`rgba(255,255,255,\${ratio*0.7})\`;
// });`;

  if (framework === "react") return `// React — Glass Nav Bar
import { useState } from 'react';

function GlassNavBar() {
  const [ratio, setRatio] = useState(0);

  return (
    <div
      onScroll={(e) => setRatio(Math.min(e.target.scrollTop / 300, 1))}
      style={{ height: '100vh', overflowY: 'auto' }}
    >
      {/* Sticky Glass Nav */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          backdropFilter: \`blur(\${ratio * 40}px) saturate(\${1 + ratio * 1.2})\`,
          WebkitBackdropFilter: \`blur(\${ratio * 40}px) saturate(\${1 + ratio * 1.2})\`,
          background: \`rgba(255, 255, 255, \${ratio * 0.7})\`,
          borderBottom: ratio > 0.05 ? \`0.5px solid rgba(255,255,255,\${ratio * 0.4})\` : 'none',
          boxShadow: ratio > 0 ? \`0 2px 24px rgba(0,0,0,\${ratio * 0.08})\` : 'none',
          transition: 'all 0.25s',
          zIndex: 100,
        }}
      >
        <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700 }}>
          홈
        </span>
      </div>

      {/* Page content */}
    </div>
  );
}`;

  if (platform === "android" && framework === "compose") {
    if (api >= 31) return `// Jetpack Compose — RenderEffect Blur (API 31+)
@Composable
fun GlassNavScreen() {
    val scrollState = rememberScrollState()
    val ratio = (scrollState.value / 300f).coerceIn(0f, 1f)

    Box(Modifier.fillMaxSize()) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
        ) {
            Spacer(Modifier.height(56.dp))
            repeat(20) { RestaurantCard(it) }
        }

        // Glass Nav Bar
        Box(
            Modifier
                .fillMaxWidth()
                .height(56.dp)
                .blur(lerp(0.dp, 20.dp, ratio))   // Compose 1.3+ / API 31+
                .background(
                    Color.White.copy(alpha = lerp(0f, 0.45f, ratio))
                )
                .border(
                    width = 0.5.dp,
                    color = Color.White.copy(alpha = ratio * 0.4f),
                    shape = RectangleShape
                )
        ) {
            NavBarContent()
        }
    }
}`;
    if (api >= 29) return `// Jetpack Compose — Scrim fallback (API 29–30)
// blur 미지원 → 반투명 스크림으로 대체
@Composable
fun GlassNavScreen() {
    val scrollState = rememberScrollState()
    val ratio = (scrollState.value / 300f).coerceIn(0f, 1f)

    Box(Modifier.fillMaxSize()) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
        ) {
            Spacer(Modifier.height(56.dp))
            repeat(20) { RestaurantCard(it) }
        }

        Box(
            Modifier
                .fillMaxWidth()
                .height(56.dp)
                .background(
                    Color.Black.copy(alpha = lerp(0f, 0.65f, ratio))
                )
        ) {
            NavBarContent(textColor = Color.White)
        }
    }
}`;
    return `// Jetpack Compose — Solid fallback (API 28 이하)
// blur / scrim 모두 미지원 → solid color 고정
@Composable
fun GlassNavScreen() {
    Box(Modifier.fillMaxSize()) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            Spacer(Modifier.height(56.dp))
            repeat(20) { RestaurantCard(it) }
        }

        Box(
            Modifier
                .fillMaxWidth()
                .height(56.dp)
                .background(Color(0xFF1A1A1A))
        ) {
            NavBarContent(textColor = Color.White)
        }
    }
}`;
  }

  if (platform === "android" && framework === "xml") {
    if (api >= 31) return `<!-- View System + RenderEffect (API 31+) -->
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.core.widget.NestedScrollView
        android:id="@+id/scrollView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:paddingTop="56dp">
        <!-- content -->
    </androidx.core.widget.NestedScrollView>

    <View
        android:id="@+id/navBar"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:background="#66FFFFFF" />

</FrameLayout>

// Kotlin
scrollView.setOnScrollChangeListener { _, _, y, _, _ ->
    val ratio = (y / 300f).coerceIn(0f, 1f)
    if (Build.VERSION.SDK_INT >= 31) {
        navBar.setRenderEffect(
            RenderEffect.createBlurEffect(
                ratio * 20f, ratio * 20f,
                Shader.TileMode.CLAMP
            )
        )
    }
    navBar.alpha = 0.1f + ratio * 0.9f
}`;
    return `<!-- View System — Scrim/Solid fallback (API 28–30) -->
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.core.widget.NestedScrollView
        android:id="@+id/scrollView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:paddingTop="56dp">
        <!-- content -->
    </androidx.core.widget.NestedScrollView>

    <View
        android:id="@+id/navBar"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:background="#00000000" />

</FrameLayout>

// Kotlin
scrollView.setOnScrollChangeListener { _, _, y, _, _ ->
    val ratio = (y / 300f).coerceIn(0f, 1f)
    // API 28–: blur 불가, 스크림으로 대체
    navBar.setBackgroundColor(
        Color.argb((ratio * 165).toInt(), 0, 0, 0)
    )
}`;
  }

  if (platform === "ios" && framework === "swiftui") {
    if (os.liquidGlass) return `// SwiftUI — iOS 26 Liquid Glass
import SwiftUI

struct HomeView: View {
    @State private var scrollOffset: CGFloat = 0

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(0..<20) { RestaurantRow(index: $0) }
            }
            .padding(.top, 56)
            .background(scrollOffsetReader)
        }
        .coordinateSpace(name: "scroll")
        .onPreferenceChange(ScrollOffsetKey.self) { scrollOffset = $0 }
        .overlay(alignment: .top) {
            LiquidGlassNavBar(offset: scrollOffset)
        }
    }

    var scrollOffsetReader: some View {
        GeometryReader { geo in
            Color.clear.preference(
                key: ScrollOffsetKey.self,
                value: geo.frame(in: .named("scroll")).minY
            )
        }
    }
}

struct LiquidGlassNavBar: View {
    let offset: CGFloat
    var ratio: CGFloat { min(max(-offset / 100, 0), 1) }

    var body: some View {
        HStack {
            Text("홈").font(.headline)
            Spacer()
            Image(systemName: "magnifyingglass")
        }
        .padding(.horizontal, 16)
        .frame(height: 56)
        .background {
            // iOS 26 Liquid Glass — .ultraThinMaterial + iridescent overlay
            ZStack {
                Rectangle()
                    .fill(.ultraThinMaterial)
                    .opacity(ratio)
                LinearGradient(
                    colors: [
                        .white.opacity(0.15 * ratio),
                        Color(hue: 0.6, saturation: 0.3, brightness: 1).opacity(0.08 * ratio),
                        Color(hue: 0.9, saturation: 0.2, brightness: 1).opacity(0.06 * ratio),
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            }
        }
        .overlay(alignment: .bottom) {
            Rectangle()
                .frame(height: 0.5)
                .foregroundColor(.white.opacity(0.4 * ratio))
        }
    }
}`;

    return `// SwiftUI — iOS ${os.id} (.ultraThinMaterial)
import SwiftUI

struct HomeView: View {
    @State private var scrollOffset: CGFloat = 0

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(0..<20) { RestaurantRow(index: $0) }
            }
            .padding(.top, 56)
            .background(scrollOffsetReader)
        }
        .coordinateSpace(name: "scroll")
        .onPreferenceChange(ScrollOffsetKey.self) { scrollOffset = $0 }
        .overlay(alignment: .top) {
            GlassNavBar(offset: scrollOffset)
        }
    }
}

struct GlassNavBar: View {
    let offset: CGFloat
    var ratio: CGFloat { min(max(-offset / 100, 0), 1) }

    var body: some View {
        HStack {
            Text("홈").font(.headline)
            Spacer()
            Image(systemName: "magnifyingglass")
        }
        .padding(.horizontal, 16)
        .frame(height: 56)
        .background(
            .ultraThinMaterial.opacity(ratio)  // iOS 15+
            // iOS 14: .regularMaterial 사용
        )
        .overlay(alignment: .bottom) {
            Divider().opacity(ratio * 0.6)
        }
    }
}`;
  }

  if (platform === "ios" && framework === "uikit") {
    return `// UIKit — iOS ${os.id}
class HomeViewController: UIViewController {
    private let tableView  = UITableView()
    private let navBar     = UIView()
    private let blurView   = UIVisualEffectView(
        effect: UIBlurEffect(style: .systemChromeMaterial)
    )

    override func viewDidLoad() {
        super.viewDidLoad()
        setupLayout()
        tableView.delegate = self
    }

    private func setupLayout() {
        view.addSubview(tableView)
        tableView.frame = view.bounds
        tableView.contentInset = UIEdgeInsets(top: 56, left: 0, bottom: 0, right: 0)

        navBar.frame = CGRect(x: 0, y: 0,
                              width: view.bounds.width, height: 56)
        blurView.frame  = navBar.bounds
        blurView.alpha  = 0
        navBar.addSubview(blurView)
        view.addSubview(navBar)
    }
}

extension HomeViewController: UIScrollViewDelegate {
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let ratio = min(max(scrollView.contentOffset.y / 100, 0), 1)
        UIView.animate(withDuration: 0.1) {
            self.blurView.alpha = Float(ratio)
        }
    }
}`;
  }

  return "";
}

// ── Section: Liquid Glass ─────────────────────────────────────────────────────

const STORES = [
  { name: "맥도날드",   tag: "버거",   time: "20분", rating: "4.8", food: "https://picsum.photos/seed/burger1/96/96",   bg: "#FFC72C", initial: "M", color: "#DA291C" },
  { name: "BBQ치킨",   tag: "치킨",   time: "25분", rating: "4.7", food: "https://picsum.photos/seed/chicken2/96/96",  bg: "#E63329", initial: "B", color: "#ffffff" },
  { name: "본죽",       tag: "한식",   time: "30분", rating: "4.6", food: "https://picsum.photos/seed/korean3/96/96",   bg: "#4CAF50", initial: "본", color: "#ffffff" },
  { name: "스타벅스",  tag: "카페",   time: "15분", rating: "4.9", food: "https://picsum.photos/seed/coffee4/96/96",   bg: "#00704A", initial: "S", color: "#ffffff" },
  { name: "피자헛",    tag: "피자",   time: "35분", rating: "4.5", food: "https://picsum.photos/seed/pizza5/96/96",    bg: "#E31837", initial: "P", color: "#ffffff" },
  { name: "롯데리아",  tag: "버거",   time: "18분", rating: "4.4", food: "https://picsum.photos/seed/burger6/96/96",   bg: "#E31837", initial: "L", color: "#ffffff" },
  { name: "교촌치킨",  tag: "치킨",   time: "28분", rating: "4.7", food: "https://picsum.photos/seed/chicken7/96/96",  bg: "#C8A96E", initial: "교", color: "#ffffff" },
  { name: "CU 편의점", tag: "편의점", time: "10분", rating: "4.3", food: "https://picsum.photos/seed/store8/96/96",    bg: "#00AADC", initial: "CU", color: "#ffffff" },
];

function GlassNavSection() {
  const [platform, setPlatform]   = useState("ios");
  const [osIdx, setOsIdx]         = useState(5);
  const [deviceIdx, setDeviceIdx] = useState(2);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [framework, setFramework] = useState("swiftui");
  const contentRef = useRef(null);

  const osList  = platform === "ios" ? IOS_OS : ANDROID_OS;
  const os      = osList[Math.min(osIdx, osList.length - 1)];
  const device  = DEVICES[platform][deviceIdx];
  const api     = platform === "android" ? parseInt(os.id) : 999;

  // ── Compatibility ──────────────────────────────────────────────────────────
  const compat = platform === "ios"
    ? { blur: true,  glass: os.liquidGlass, label: os.liquidGlass ? "Liquid Glass" : "UIBlurEffect", color: "#4caf50" }
    : api >= 31
      ? { blur: true,  glass: false, label: "RenderEffect.createBlurEffect", color: "#4caf50" }
      : api >= 29
        ? { blur: false, glass: false, label: "Scrim 대체 (blur 불가)",          color: "#ff9800" }
        : { blur: false, glass: false, label: "Solid color만 가능",              color: "#f44336" };

  // ── Nav bar visual style ───────────────────────────────────────────────────
  const t = scrollRatio;
  let navStyle = {};
  if (platform === "ios") {
    if (os.liquidGlass) {
      navStyle = {
        backdropFilter: `blur(${t * 40}px) saturate(${1 + t * 1.2})`,
        background: `linear-gradient(135deg,rgba(255,255,255,${t*0.25}),rgba(180,220,255,${t*0.12}),rgba(255,200,230,${t*0.1}))`,
        borderBottom: t > 0.05 ? `0.5px solid rgba(255,255,255,${t*0.5})` : "none",
        boxShadow: t > 0 ? `0 2px 24px rgba(0,0,0,${t*0.08}),inset 0 1px 0 rgba(255,255,255,${t*0.5})` : "none",
      };
    } else {
      navStyle = {
        backdropFilter: `blur(${t*20}px)`,
        background: `rgba(242,242,247,${t*0.85})`,
        borderBottom: t > 0.05 ? `0.5px solid rgba(0,0,0,${t*0.12})` : "none",
      };
    }
  } else {
    if (api >= 31) {
      navStyle = {
        backdropFilter: `blur(${t*20}px)`,
        background: `rgba(255,255,255,${0.05+t*0.4})`,
        borderBottom: `1px solid rgba(255,255,255,${t*0.3})`,
        boxShadow: t > 0 ? `0 2px 16px rgba(0,0,0,${t*0.15})` : "none",
      };
    } else if (api >= 29) {
      navStyle = { background: `rgba(0,0,0,${t*0.65})` };
    } else {
      navStyle = { background: "#1a1a1a", borderBottom: "1px solid #333" };
    }
  }

  const navTextColor = (platform === "android" && api < 31 && t > 0.2) ? "#fff"
    : (platform === "ios" || (platform === "android" && api >= 31)) ? "#111"
    : "#fff";

  // ── Sync slider → actual scroll ────────────────────────────────────────────
  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    el.scrollTop = scrollRatio * (el.scrollHeight - el.clientHeight);
  }, [scrollRatio]);

  const fwOptions = [
    ...(platform === "ios"
      ? [{ id: "swiftui", label: "SwiftUI" }, { id: "uikit", label: "UIKit" }]
      : [{ id: "compose", label: "Jetpack Compose" }, { id: "xml", label: "View (XML)" }]),
    { id: "css",   label: "CSS" },
    { id: "react", label: "React" },
  ];

  return (
    <div style={{ display: "flex", gap: "20px", height: "100%", minHeight: 0 }}>

      {/* ── Left controls ── */}
      <div style={{ width: "210px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>

        {/* Platform */}
        <div style={{ background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#999999", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>Platform</div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {["ios","android"].map(p => (
              <button key={p} onClick={() => { setPlatform(p); setOsIdx(p === "ios" ? 5 : 3); setFramework(p === "ios" ? "swiftui" : "compose"); setDeviceIdx(0); }}
                style={{ flex: 1, padding: "7px", borderRadius: "7px", background: platform === p ? "#f0f0f0" : "transparent", border: platform === p ? "1px solid #c0c0c0" : "1px solid #e5e5e5", color: platform === p ? "#333333" : "#999999", fontSize: "11px", cursor: "pointer", fontWeight: platform === p ? 700 : 400 }}>
                {p === "ios" ? "iOS" : "Android"}
              </button>
            ))}
          </div>
          <div style={{ fontSize: "10px", color: "#999999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 600 }}>OS Version</div>
          <select value={osIdx} onChange={e => setOsIdx(Number(e.target.value))}
            style={{ width: "100%", background: "#ffffff", border: "1px solid #d0d0d0", borderRadius: "6px", padding: "6px 8px", color: "#333333", fontSize: "11px", outline: "none", cursor: "pointer" }}>
            {osList.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
          </select>
        </div>

        {/* Device */}
        <div style={{ background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#999999", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>Device</div>
          <select value={deviceIdx} onChange={e => setDeviceIdx(Number(e.target.value))}
            style={{ width: "100%", background: "#ffffff", border: "1px solid #d0d0d0", borderRadius: "6px", padding: "6px 8px", color: "#333333", fontSize: "11px", outline: "none", cursor: "pointer" }}>
            {DEVICES[platform].map((d, i) => <option key={i} value={i}>{d.name}</option>)}
          </select>
        </div>

        {/* Scroll simulator */}
        <div style={{ background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "10px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", color: "#999999", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Scroll</div>
            <div style={{ fontSize: "10px", color: "#aaaaaa", fontFamily: "monospace" }}>{Math.round(scrollRatio * 100)}%</div>
          </div>
          <input type="range" min="0" max="100" value={Math.round(scrollRatio * 100)}
            onChange={e => setScrollRatio(Number(e.target.value) / 100)}
            style={{ width: "100%", accentColor: "#fa0050", cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#bbbbbb", marginTop: "4px" }}>
            <span>Top</span><span>Bottom</span>
          </div>
        </div>

        {/* Compatibility badge */}
        <div style={{ background: "#ffffff", border: `1px solid ${compat.color}33`, borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#999999", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>Compatibility</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "20px", background: `${compat.color}18`, border: `1px solid ${compat.color}44` }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: compat.color }} />
            <span style={{ fontSize: "10px", color: compat.color, fontWeight: 600 }}>{compat.label}</span>
          </div>
          {platform === "android" && api < 31 && (
            <div style={{ marginTop: "10px", fontSize: "10px", color: "#888888", lineHeight: "1.6" }}>
              {api >= 29 ? "blur 미지원 → 스크림으로 대체" : "blur/scrim 모두 미지원 → solid color"}
            </div>
          )}
          {platform === "ios" && os.liquidGlass && (
            <div style={{ marginTop: "10px", fontSize: "10px", color: "#888888", lineHeight: "1.6" }}>
              iridescent gradient + saturate 필터 적용
            </div>
          )}
        </div>
      </div>

      {/* ── Phone preview ── */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <PhoneFrame platform={platform} device={device}>
          <div ref={contentRef} style={{ height: "100%", overflowY: "auto", overflowX: "hidden", position: "relative" }}>
            {/* Glass Nav Bar — sticky */}
            <div style={{ position: "sticky", top: 0, zIndex: 10, height: "56px", display: "flex", alignItems: "center", padding: "0 16px", transition: "all 0.25s", ...navStyle }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#fa0050", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>Y</span>
              </div>
              <span style={{ flex: 1, textAlign: "center", fontSize: "15px", fontWeight: 700, color: navTextColor, fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>홈</span>
              <span style={{ fontSize: "18px", color: navTextColor, opacity: 0.7 }}>⌕</span>
            </div>

            {/* Hero banner */}
            <div style={{ margin: "0 16px 16px", padding: "20px 16px", background: "linear-gradient(135deg,#fa0050,#ff3072)", borderRadius: "16px", color: "#fff" }}>
              <div style={{ fontSize: "11px", opacity: 0.85, marginBottom: "4px", fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>지금 주문하면</div>
              <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>무료배달 이벤트</div>
              <div style={{ fontSize: "11px", marginTop: "4px", opacity: 0.8, fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>오늘 23:59 까지</div>
            </div>

            {/* Section title */}
            <div style={{ padding: "0 16px 10px", fontSize: "14px", fontWeight: 700, color: "#111", fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>
              주변 맛집
            </div>

            {/* Store list */}
            {STORES.map((s, i) => (
              <div key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
                {/* Food photo */}
                <div style={{ position: "relative", height: "100px", overflow: "hidden" }}>
                  <img src={s.food} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {/* Logo badge */}
                  <div style={{ position: "absolute", bottom: 8, left: 12, width: 36, height: 36, borderRadius: 10, background: s.bg, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
                    <span style={{ fontSize: s.initial.length > 1 ? "9px" : "13px", fontWeight: 900, color: s.color, letterSpacing: "-0.5px" }}>{s.initial}</span>
                  </div>
                </div>
                {/* Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#111", fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>{s.name}</div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>⭐ {s.rating} · {s.time}</div>
                  </div>
                  <span style={{ padding: "2px 8px", background: "#fff5f8", borderRadius: "10px", color: "#fa0050", fontSize: "10px", fontWeight: 700, flexShrink: 0 }}>{s.tag}</span>
                </div>
              </div>
            ))}
            <div style={{ height: "40px" }} />
          </div>
        </PhoneFrame>
      </div>

      {/* ── Code panel ── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Framework selector */}
        <div style={{ display: "flex", gap: "4px" }}>
          {fwOptions.map(f => (
            <button key={f.id} onClick={() => setFramework(f.id)}
              style={{ padding: "6px 14px", borderRadius: "7px", background: framework === f.id ? "#f0f0f0" : "transparent", border: framework === f.id ? "1px solid #c0c0c0" : "1px solid #e5e5e5", color: framework === f.id ? "#333333" : "#999999", fontSize: "11px", cursor: "pointer", fontWeight: framework === f.id ? 700 : 400 }}>
              {f.label}
            </button>
          ))}
        </div>
        <CodeBlock code={genGlassCode(platform, os, framework)} />
      </div>

    </div>
  );
}

// ── Section: Icons ────────────────────────────────────────────────────────────

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

// ── Section: Drafts ──────────────────────────────────────────────────────────
function DraftsSection({ onUseInSimulator }) {
  const toast = useToast();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  const refresh = () => {
    setLoading(true);
    fetchComponents()
      .then(rows => { setDrafts(rows.map(rowToDraft)); setLoading(false); })
      .catch(e => { toast("불러오기 실패: " + e.message, "error"); setLoading(false); });
  };

  useEffect(() => { refresh(); }, []);

  const handleDelete = (draft) => {
    deleteComponent(draft.id)
      .then(() => { refresh(); toast(`"${draft.name}" 삭제됐습니다`, "info"); })
      .catch(e => toast("삭제 실패: " + e.message, "error"));
  };

  const startRename = (draft) => {
    setRenamingId(draft.id);
    setRenameVal(draft.name);
  };

  const confirmRename = (id) => {
    const prev = drafts.find(d => d.id === id)?.name;
    renameComponent(id, renameVal)
      .then(() => { setRenamingId(null); refresh(); toast(`"${prev}" → "${renameVal}" 이름 변경됐습니다`, "success"); })
      .catch(e => toast("변경 실패: " + e.message, "error"));
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"300px", gap:"10px", color:"#bbbbbb" }}>
      <span style={{ display:"inline-block", width:"16px", height:"16px", border:"2px solid #e5e5e5", borderTopColor:"#5028c8", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
      <span style={{ fontSize:"13px" }}>불러오는 중...</span>
    </div>
  );

  if (drafts.length === 0) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"300px", gap:"12px", color:"#bbbbbb" }}>
      <div style={{ fontSize:"32px", opacity:0.4 }}>◈</div>
      <div style={{ fontSize:"13px" }}>저장된 컴포넌트가 없습니다</div>
      <div style={{ fontSize:"11px", color:"#d0d0d0", textAlign:"center", lineHeight:1.7 }}>
        시뮬레이터 → Add → Figma SVG<br/>에서 컴포넌트를 붙여넣어 저장하세요.
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      <div style={{ fontSize:"11px", color:"#aaaaaa" }}>{drafts.length}개의 Draft 컴포넌트</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:"16px" }}>
        {drafts.map(draft => {
          const isSvg = !!draft.svgData;
          const dw = draft.w || draft.figmaData?.absoluteBoundingBox?.width || 100;
          const dh = draft.h || draft.figmaData?.absoluteBoundingBox?.height || 100;
          const scale = Math.min(180 / dw, 120 / dh, 1);
          const date = new Date(draft.createdAt).toLocaleDateString("ko-KR", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
          return (
            <div key={draft.id} style={{ background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"12px", overflow:"hidden", display:"flex", flexDirection:"column" }}>
              {/* Thumbnail */}
              <div style={{ background:"#f5f5f5", height:"130px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative", flexShrink:0 }}>
                {isSvg ? (
                  <div style={{ transform:`scale(${scale})`, transformOrigin:"center center", lineHeight:0 }}
                    dangerouslySetInnerHTML={{ __html: draft.svgData }} />
                ) : draft.figmaData?.absoluteBoundingBox ? (
                  <div style={{ transform:`scale(${scale})`, transformOrigin:"center center", position:"absolute" }}>
                    <div style={{ position:"relative", width: dw, height: dh }}>
                      <RenderFigmaNode node={draft.figmaData} ox={draft.figmaData.absoluteBoundingBox.x} oy={draft.figmaData.absoluteBoundingBox.y} />
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize:"11px", color:"#cccccc" }}>미리보기 없음</div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding:"12px", display:"flex", flexDirection:"column", gap:"8px", flex:1 }}>
                {renamingId === draft.id ? (
                  <div style={{ display:"flex", gap:"4px" }}>
                    <input value={renameVal} onChange={e => setRenameVal(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") confirmRename(draft.id); if (e.key === "Escape") setRenamingId(null); }}
                      autoFocus
                      style={{ flex:1, padding:"4px 7px", borderRadius:"5px", border:"1px solid #5028c8", fontSize:"12px", color:"#111111", outline:"none" }} />
                    <button onClick={() => confirmRename(draft.id)}
                      style={{ padding:"4px 8px", borderRadius:"5px", background:"#5028c8", border:"none", color:"#ffffff", fontSize:"10px", cursor:"pointer" }}>확인</button>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <div style={{ fontSize:"13px", fontWeight:700, color:"#111111", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{draft.name}</div>
                    <button onClick={() => startRename(draft)}
                      style={{ background:"none", border:"none", color:"#bbbbbb", cursor:"pointer", fontSize:"11px", flexShrink:0, padding:"2px 4px" }}>✎</button>
                  </div>
                )}
                <div style={{ fontSize:"10px", color:"#aaaaaa" }}>
                  {Math.round(dw)}×{Math.round(dh)}px · {date}
                </div>

                {/* Actions */}
                <div style={{ display:"flex", gap:"6px", marginTop:"auto" }}>
                  <button onClick={() => { onUseInSimulator(draft); toast(`"${draft.name}" 시뮬레이터에 추가됐습니다`, "success"); }}
                    style={{ flex:1, padding:"6px", borderRadius:"6px", background:"#111111", border:"none", color:"#ffffff", fontSize:"10px", fontWeight:700, cursor:"pointer" }}>
                    시뮬레이터에 추가
                  </button>
                  <button onClick={() => handleDelete(draft)}
                    style={{ padding:"6px 10px", borderRadius:"6px", background:"transparent", border:"1px solid #f0b0b0", color:"#aa3333", fontSize:"10px", cursor:"pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.background="#ffeaea"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── FigmaSection ─────────────────────────────────────────────────────────────
const CATEGORY_ITEMS = [
  { label: "전체",    img: "https://www.figma.com/api/mcp/asset/9d71c5a8-693a-4ab4-94f1-30f393fab5e6" },
  { label: "카페",    img: "https://www.figma.com/api/mcp/asset/9bd89d63-ea6c-4cdf-837f-d2aaf96a5398" },
  { label: "치킨",    img: "https://www.figma.com/api/mcp/asset/91772945-18ff-4634-a5fe-cda075a1ee45" },
  { label: "한식",    img: "https://www.figma.com/api/mcp/asset/a3610b34-be79-4dbd-b5b4-23b05acb8259" },
  { label: "중국집",  img: "https://www.figma.com/api/mcp/asset/dc5dc5d6-0445-404a-b8b5-6d6a78b51e2d" },
  { label: "회초밥",  img: "https://www.figma.com/api/mcp/asset/79c4968c-0443-4ce5-a387-43b7371e957d" },
  { label: "도시락죽", img: "https://www.figma.com/api/mcp/asset/c3925541-459c-4c04-95ce-6b5ff1cfdcc6" },
  { label: "아시안",  img: "https://www.figma.com/api/mcp/asset/7f3d7d2a-c284-45b1-8ca1-8ecb68bad041" },
  { label: "분식",    img: "https://www.figma.com/api/mcp/asset/376084f8-b164-4b5b-9239-39bcb8770272" },
  { label: "피자",    img: "https://www.figma.com/api/mcp/asset/43e75c9b-517d-4838-b724-08e96b77139a" },
  { label: "버거",    img: "https://www.figma.com/api/mcp/asset/392a78fc-287b-44f3-a5d9-0d1d560e31bb" },
  { label: "돈까스",  img: "https://www.figma.com/api/mcp/asset/5fa05041-81a8-478a-8565-5310e696be60" },
  { label: "찜탕",    img: "https://www.figma.com/api/mcp/asset/41a85033-b43e-4919-b995-1afd28fdd788" },
  { label: "고기구이", img: "https://www.figma.com/api/mcp/asset/7e9dc497-bf80-42a9-8190-71eaa24eb201" },
  { label: "샌드위치", img: "https://www.figma.com/api/mcp/asset/52011258-1da2-4dc6-a17e-ac8fcf811a3b" },
  { label: "샐러드",  img: "https://www.figma.com/api/mcp/asset/0f56ddc2-a20f-4493-9bc8-907cc768952e" },
];

const LOTTERIA = { label: "롯데리아", img: "https://www.figma.com/api/mcp/asset/95882b03-2ac7-44bd-a366-79ec8ae44dc7", badge: "2,000원 할인" };

const CATEGORY_REACT_CODE = `function CategoryRow() {
  const items = [
    { label: "전체" }, { label: "카페" }, { label: "치킨" },
    { label: "한식" }, { label: "중국집" }, { label: "회초밥" },
    { label: "도시락죽" }, { label: "아시안" },
  ];
  return (
    <div style={{ background: "#1a1a1a", width: 390, borderRadius: 16, overflow: "hidden" }}>
      {[0, 1].map(row => (
        <div key={row} style={{ display: "flex", gap: 4, padding: "16px 20px 8px", overflowX: "auto" }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 66 }}>
              <img src={item.img} width={52} height={52} style={{ borderRadius: 14 }} />
              <span style={{ fontSize: 14, color: "#333", fontFamily: "Roboto" }}>{item.label}</span>
            </div>
          ))}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
        <div style={{ width: 56, height: 4, background: "#333", borderRadius: 2, position: "relative" }}>
          <div style={{ width: 24, height: 4, background: "#fff", borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}`;

const CATEGORY_SWIFTUI_CODE = `struct CategoryRow: View {
  let items = ["전체","카페","치킨","한식","중국집","회초밥","도시락죽","아시안"]
  var body: some View {
    VStack(spacing: 4) {
      ForEach(0..<2) { row in
        ScrollView(.horizontal, showsIndicators: false) {
          HStack(spacing: 4) {
            ForEach(items, id: \\.self) { item in
              VStack(spacing: 4) {
                Image(item)
                  .resizable()
                  .frame(width: 52, height: 52)
                  .cornerRadius(14)
                Text(item)
                  .font(.system(size: 14))
                  .foregroundColor(Color(hex: "333333"))
              }
              .frame(width: 66)
            }
          }
          .padding(.horizontal, 20)
          .padding(.vertical, 16)
        }
      }
    }
    .background(Color(hex: "1a1a1a"))
    .cornerRadius(16)
    .frame(width: 390)
  }
}`;

const CATEGORY_COMPOSE_CODE = `@Composable
fun CategoryRow() {
  val items = listOf("전체","카페","치킨","한식","중국집","회초밥","도시락죽","아시안")
  Column(
    modifier = Modifier
      .background(Color(0xFF1A1A1A), RoundedCornerShape(16.dp))
      .width(390.dp)
  ) {
    repeat(2) {
      LazyRow(
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
      ) {
        items(items) { item ->
          Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.width(66.dp)
          ) {
            AsyncImage(
              model = item.imageUrl,
              contentDescription = item,
              modifier = Modifier.size(52.dp).clip(RoundedCornerShape(14.dp))
            )
            Text(text = item, fontSize = 14.sp, color = Color(0xFF333333))
          }
        }
      }
    }
  }
}`;

const CATEGORY_FLUTTER_CODE = `class CategoryRow extends StatelessWidget {
  final items = ['전체','카페','치킨','한식','중국집','회초밥','도시락죽','아시안'];
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 390,
      decoration: BoxDecoration(
        color: Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: List.generate(2, (row) =>
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: Row(
              children: items.map((item) => Container(
                width: 66,
                child: Column(children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(14),
                    child: Image.network(item.imageUrl, width: 52, height: 52, fit: BoxFit.cover),
                  ),
                  SizedBox(height: 4),
                  Text(item, style: TextStyle(fontSize: 14, color: Color(0xFF333333))),
                ]),
              )).toList(),
            ),
          ),
        ),
      ),
    );
  }
}`;

function FigmaSection() {
  const [platform, setPlatform] = useState("react");
  const [activeItem, setActiveItem] = useState(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const scrollRef = useRef(null);
  const dragRef = useRef({ down: false, startX: 0, scrollLeft: 0 });
  const row1 = CATEGORY_ITEMS.slice(0, 8);
  const row2 = [...CATEGORY_ITEMS.slice(8), LOTTERIA];

  const handleScroll = (e) => {
    const el = e.target;
    const ratio = el.scrollLeft / (el.scrollWidth - el.clientWidth) || 0;
    setScrollRatio(ratio);
  };

  const onMouseDown = (e) => {
    dragRef.current = { down: true, startX: e.pageX - scrollRef.current.offsetLeft, scrollLeft: scrollRef.current.scrollLeft };
    scrollRef.current.style.cursor = "grabbing";
  };
  const onMouseUp = () => {
    dragRef.current.down = false;
    scrollRef.current.style.cursor = "grab";
  };
  const onMouseMove = (e) => {
    if (!dragRef.current.down) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = dragRef.current.scrollLeft - (x - dragRef.current.startX);
  };

  const codeMap = { react: CATEGORY_REACT_CODE, swiftui: CATEGORY_SWIFTUI_CODE, compose: CATEGORY_COMPOSE_CODE, flutter: CATEGORY_FLUTTER_CODE };
  const platforms = [
    { id: "react",   label: "React JSX" },
    { id: "swiftui", label: "SwiftUI" },
    { id: "compose", label: "Compose" },
    { id: "flutter", label: "Flutter" },
  ];

  const renderCategoryItem = (item, i) => (
    <div key={i}
      onClick={() => setActiveItem(activeItem === i ? null : i)}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: "66px", cursor: "pointer", position: "relative" }}>
      <div style={{ width: "52px", height: "52px", borderRadius: "14px", overflow: "hidden", background: colors.gray.gray25.value, position: "relative" }}>
        <img src={item.img} width="52" height="52" style={{ objectFit: "cover", display: "block" }} onError={e => { e.target.style.display = "none"; }} />
        {item.badge && (
          <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", background: "#FA0050", fontSize: "7px", fontWeight: 700, color: "#fff", textAlign: "center", padding: "2px 0", lineHeight: 1.2 }}>{item.badge}</div>
        )}
      </div>
      <span style={{ fontSize: "12px", color: colors.gray.gray800.value, fontFamily: "Roboto, sans-serif", whiteSpace: "nowrap" }}>{item.label}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Component info */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ background: "#5028c8", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.08em" }}>FIGMA IMPORT</div>
        <div style={{ fontSize: "12px", color: "#888" }}>리뉴얼-2026 · Category · 390 × 200px</div>
      </div>

      {/* Preview */}
      <div>
        <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Preview</div>
        <div style={{ background: colors.background.primary.value, borderRadius: "16px", width: "390px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: `1px solid ${colors.gray.gray100.value}` }}>
          {/* Scrollable 2-row grid */}
          <div ref={scrollRef} onScroll={handleScroll}
            onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}
            style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", padding: "16px 20px 12px", cursor: "grab", userSelect: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "max-content" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {row1.map((item, i) => renderCategoryItem(item, i))}
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {row2.map((item, i) => renderCategoryItem(item, i + 8))}
              </div>
            </div>
          </div>
          {/* Scroll indicator */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px" }}>
            <div style={{ width: "56px", height: "4px", background: colors.gray.gray100.value, borderRadius: "2px", position: "relative" }}>
              <div style={{ width: "24px", height: "4px", background: colors.gray.gray800.value, borderRadius: "2px", position: "absolute", left: `${scrollRatio * 32}px`, transition: "left 0.1s ease" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Platform code */}
      <div>
        <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Code</div>
        {/* Platform tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
          {platforms.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: platform === p.id ? "#5028c8" : "#f0f0f0", color: platform === p.id ? "#fff" : "#666", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
              {p.label}
            </button>
          ))}
        </div>
        {/* Code block */}
        <div style={{ background: "#111111", borderRadius: "12px", padding: "20px", overflowX: "auto" }}>
          <pre style={{ margin: 0, fontSize: "11px", lineHeight: 1.6, color: "#e0e0e0", fontFamily: "'SF Mono', 'Fira Code', monospace", whiteSpace: "pre" }}>
            {codeMap[platform]}
          </pre>
        </div>
      </div>

      {/* Spec grid */}
      <div>
        <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Specs</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
          {[
            { key: "Container", val: "390 × 200px" },
            { key: "Item size", val: "66 × 72px" },
            { key: "Icon", val: "52 × 52px, r14" },
            { key: "Label", val: "14px Roboto" },
            { key: "Gap", val: "4px" },
            { key: "H Padding", val: "20px" },
            { key: "V Padding", val: "16px top, 8px btm" },
            { key: "Badge", val: "9px Bold #FA0050" },
          ].map(s => (
            <div key={s.key} style={{ background: "#f8f8f8", borderRadius: "8px", padding: "10px 12px" }}>
              <div style={{ fontSize: "9px", color: "#aaa", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.key}</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#333" }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


const NAV = [
  { id: "meta",        label: "Meta Tokens",   icon: "◉" },
  { id: "colors",      label: "Colors",        icon: "◈" },
  { id: "typography",  label: "Typography",    icon: "T" },
  { id: "spacing",     label: "Spacing",       icon: "↔" },
  { id: "elevation",   label: "Elevation",     icon: "◻" },
  { id: "button",      label: "Button",        icon: "⬚" },
  { id: "label",       label: "Label",         icon: "◷" },
  { id: "icons",       label: "Icons",         icon: "◎" },
  { id: "simulator",   label: "Simulator",     icon: "📱" },
  { id: "glassnav",    label: "Liquid Glass",  icon: "✦" },
  { id: "drafts",      label: "Drafts",        icon: "◈" },
  { id: "figma",       label: "Category",      icon: "✦" },
];

// ── Toast system ─────────────────────────────────────────────────────────────
const ToastContext = React.createContext(null);
function useToast() { return React.useContext(ToastContext); }

function ToastProvider({ children }) {
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

const H_WORLD_APPS = [
  { id: "launcher",  label: "h's world",      sub: "Launcher",          href: "https://alfred-launcher.vercel.app",     color: "#111111" },
  { id: "alfred",    label: "Alfred Agent",    sub: "Problem to Product", href: "https://alfred-agent-nine.vercel.app",   color: "#2255cc" },
  { id: "storybook", label: "h's Storybook",   sub: "Design System",     href: "https://storybook-livid-chi.vercel.app", color: "#5028c8" },
  { id: "lottie",    label: "Lottie Studio",   sub: "Animation",         href: "https://lottie-studio.vercel.app",       color: "#cc7700" },
];

function AppMenu({ current }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "24px", height: "24px", borderRadius: "7px", background: open ? "#f0f0f0" : "transparent", border: "1px solid " + (open ? "#cccccc" : "#e5e5e5"), color: open ? "#555555" : "#aaaaaa", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#cccccc"; e.currentTarget.style.color = "#555555"; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#aaaaaa"; } }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
          <rect x="0" y="0" width="5" height="5" rx="1" /><rect x="7" y="0" width="5" height="5" rx="1" />
          <rect x="0" y="7" width="5" height="5" rx="1" /><rect x="7" y="7" width="5" height="5" rx="1" />
        </svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "6px", minWidth: "210px", zIndex: 1000 }}>
          {H_WORLD_APPS.map(app => {
            const isCurrent = app.id === current;
            return isCurrent ? (
              <div key={app.id} style={{ padding: "8px 10px", borderRadius: "8px", background: "#f5f5f5", marginBottom: "2px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: app.color, opacity: 0.5 }}>{app.label}</div>
                <div style={{ fontSize: "10px", color: "#bbbbbb" }}>{app.sub} · 현재</div>
              </div>
            ) : (
              <a key={app.id} href={app.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}
                style={{ display: "block", padding: "8px 10px", borderRadius: "8px", textDecoration: "none", marginBottom: "2px", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: app.color }}>{app.label}</div>
                <div style={{ fontSize: "10px", color: "#aaaaaa" }}>{app.sub} ↗</div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("colors");
  const [pendingDraft, setPendingDraft] = useState(null);
  const [componentCount, setComponentCount] = useState(0);

  useEffect(() => {
    fetchComponents()
      .then(rows => setComponentCount(rows.length))
      .catch(() => {});
  }, [active]); // 탭 전환할 때마다 갱신

  const renderContent = () => {
    if (active === "meta")       return <MetaTokensSection />;
    if (active === "colors")     return <ColorsSection />;
    if (active === "typography") return <TypographySection />;
    if (active === "spacing")    return <SpacingSection />;
    if (active === "elevation")  return <ElevationSection />;
    if (active === "button")     return <ButtonSection />;
    if (active === "label")      return <LabelSection />;
    if (active === "icons")      return <IconsSection />;
    if (active === "simulator")  return <SimulatorSection pendingDraft={pendingDraft} onDraftConsumed={() => setPendingDraft(null)} />;
    if (active === "glassnav")   return <GlassNavSection />;
    if (active === "drafts")     return <DraftsSection onUseInSimulator={draft => { setPendingDraft(draft); setActive("simulator"); }} />;
    if (active === "figma")      return <FigmaSection />;
  };

  const titles    = { meta: "Meta Tokens", colors: "Color Tokens", typography: "Typography", spacing: "Spacing & Radius", elevation: "Elevation / Shadow", button: "Button", label: "Label", icons: "Icons", simulator: "Simulator", glassnav: "Liquid Glass Nav", drafts: "Drafts", figma: "Category" };
  const subtitles = { meta: "YDS 2.0 Primitive Layer — Meta → Semantic → Component", colors: "YDS 2.0 Customer Token", typography: "Roboto 기반 타입 스케일", spacing: "스페이싱 및 보더 라디우스", elevation: "YDS 2.0 Elevation — Level 1 · 2 (normal & inverse)", button: "버튼 컴포넌트 — 멀티 플랫폼 코드", label: "라벨 컴포넌트 — 멀티 플랫폼 코드", icons: "YDS 2.0 System Icon — Figma 원본 기반", simulator: "iOS / Android 실시간 화면 시뮬레이션", glassnav: "OS 버전별 Glass Nav Bar — 호환성 + 코드 생성", drafts: "Figma에서 가져온 컴포넌트 — 관리 및 시뮬레이터 연동", figma: "Figma에서 추출한 카테고리 컴포넌트 — 리뉴얼-2026" };

  return (
    <ToastProvider>
    <div style={{ display: "flex", height: "100vh", background: "#f5f5f5", color: "#111111", fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes toastIn { from { opacity:0; transform:translateY(10px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
      {/* Sidebar */}
      <div style={{ width: "200px", flexShrink: 0, background: "#ffffff", borderRight: "1px solid #e5e5e5", display: "flex", flexDirection: "column", padding: "20px 0" }}>
        <div style={{ padding: "0 16px 20px", borderBottom: "1px solid #e5e5e5", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#111111", letterSpacing: "-0.01em" }}>h's Storybook</div>
            <AppMenu current="storybook" />
          </div>
          <div style={{ fontSize: "10px", color: "#aaaaaa" }}>YDS 2.0 Design System</div>
        </div>
        <div style={{ fontSize: "9px", color: "#bbbbbb", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0 16px", marginBottom: "6px", fontWeight: 600 }}>Tokens</div>
        {NAV.slice(0, 5).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#e5e5e5" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #111111" : "2px solid transparent", color: active === n.id ? "#111111" : "#888888", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ fontSize: "9px", color: "#bbbbbb", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 16px 6px", fontWeight: 600 }}>Components</div>
        {NAV.slice(5, 8).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#e5e5e5" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #111111" : "2px solid transparent", color: active === n.id ? "#111111" : "#888888", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ fontSize: "9px", color: "#bbbbbb", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 16px 6px", fontWeight: 600 }}>Simulate</div>
        {NAV.slice(8, 9).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#e5e5e5" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #111111" : "2px solid transparent", color: active === n.id ? "#111111" : "#888888", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ fontSize: "9px", color: "#bbbbbb", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 16px 6px", fontWeight: 600 }}>Labs</div>
        {NAV.slice(9, 10).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#e5e5e5" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #111111" : "2px solid transparent", color: active === n.id ? "#111111" : "#888888", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ fontSize: "9px", color: "#bbbbbb", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 16px 6px", fontWeight: 600 }}>Library</div>
        {NAV.slice(10).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#e5e5e5" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #5028c8" : "2px solid transparent", color: active === n.id ? "#5028c8" : "#888888", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
            {n.id === "drafts" && componentCount > 0 && (
              <span style={{ marginLeft:"auto", fontSize:"9px", background:"#5028c8", color:"#fff", borderRadius:"10px", padding:"1px 6px" }}>{componentCount}</span>
            )}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e5e5", fontSize: "9px", color: "#d0d0d0" }}>
          Figma → YDS 2.0 ✓
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "16px 28px", borderBottom: "1px solid #e5e5e5", background: "#ffffff", flexShrink: 0 }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#111111" }}>{titles[active]}</div>
          <div style={{ fontSize: "11px", color: "#aaaaaa", marginTop: "3px" }}>{subtitles[active]}</div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px", scrollbarWidth: "thin", scrollbarColor: "#e5e5e5 transparent" }}>
          {renderContent()}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 2px; }
      `}</style>
    </div>
    </ToastProvider>
  );
}
