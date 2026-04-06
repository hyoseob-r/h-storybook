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
  return undefined;
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
    overflow: "hidden",
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
        fontFamily: "system-ui, sans-serif",
      }}>
        {node.characters}
      </div>
    );
  }

  if (node.type === "ELLIPSE") {
    return <div style={{ ...style, borderRadius: "50%" }} />;
  }

  return (
    <div style={style}>
      {(node.children || []).map((child, i) => (
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

// ── Figma Import Panel (SVG paste) ──────────────────────────────────────────
function FigmaImportPanel({ onAdd, onClose }) {
  const toast = useToast();
  const [svg,      setSvg]      = useState("");
  const [error,    setError]    = useState("");
  const [name,     setName]     = useState("Untitled");
  const [ready,    setReady]    = useState(false);
  // step: "idle" | "confirming" | "saving" | "done"
  const [step,     setStep]     = useState("idle");
  const [progress, setProgress] = useState(0);
  const cancelRef  = useRef(false);
  const timerRef   = useRef(null);

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
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:"10px", fontWeight:700, color:"#333333", letterSpacing:"0.1em", textTransform:"uppercase" }}>Figma → SVG 붙여넣기</div>
        <button onClick={handleClose} style={{ background:"none", border:"none", color:"#aaaaaa", cursor:"pointer", fontSize:"14px", lineHeight:1 }}>×</button>
      </div>
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

      {ready && step === "idle" && (
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
      {step === "confirming" && (
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
      {step === "saving" && (
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
      {step === "done" && (
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

function SimulatorSection({ pendingDraft, onDraftConsumed }) {
  const toast = useToast();
  const [platform,  setPlatform]  = useState("ios");
  const [deviceIdx, setDeviceIdx] = useState(2);
  const [items,     setItems]     = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [hovered,   setHovered]   = useState(null);
  const [snapGrid,      setSnapGrid]      = useState(true);
  const [darkMode,      setDarkMode]      = useState(false);
  const [showFigmaPanel,  setShowFigmaPanel]  = useState(false);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [pickerDrafts,    setPickerDrafts]    = useState([]);
  const [pickerLoading,   setPickerLoading]   = useState(false);

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
        setItems(prev => prev.map(i => i.id === id
          ? { ...i, x: Math.max(0, snap(startX + dx)), y: Math.max(0, snap(startY + dy)) }
          : i));
      }
      if (resizeRef.current) {
        const { id, handle, startMX, startW, startX } = resizeRef.current;
        const dx = (e.clientX - startMX) / scaleRef.current;
        let upd = {};
        if (handle.includes("e")) { upd.w = Math.max(60, snap(startW + dx)); }
        if (handle.includes("w")) {
          const nw = Math.max(60, snap(startW - dx));
          upd.w = nw;
          upd.x = Math.max(0, snap(startX + (startW - nw)));
        }
        setItems(prev => prev.map(i => i.id === id ? { ...i, ...upd } : i));
      }
    };
    const onUp = () => { dragRef.current = null; resizeRef.current = null; };
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
        setItems(prev => prev.filter(i => i.id !== selected));
        setSelected(null);
        return;
      }
      if (e.key === "Escape") { setSelected(null); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        const nid = Date.now();
        setItems(prev => [...prev, { ...item, id: nid, x: item.x + 24, y: item.y + 24, isMaster: false }]);
        setSelected(nid);
        return;
      }
      if (!item.isMaster) {
        const N = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowLeft")  { e.preventDefault(); setItems(p => p.map(i => i.id===selected ? { ...i, x: Math.max(0, i.x-N) } : i)); }
        if (e.key === "ArrowRight") { e.preventDefault(); setItems(p => p.map(i => i.id===selected ? { ...i, x: i.x+N } : i)); }
        if (e.key === "ArrowUp")    { e.preventDefault(); setItems(p => p.map(i => i.id===selected ? { ...i, y: Math.max(0, i.y-N) } : i)); }
        if (e.key === "ArrowDown")  { e.preventDefault(); setItems(p => p.map(i => i.id===selected ? { ...i, y: i.y+N } : i)); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, items]);

  // ── item helpers ─────────────────────────────────────────────────────────────
  const addItem = (type) => {
    const id = Date.now();
    const base = type === "labelButton"
      ? { type:"labelButton", shape:"filled", colorStyle:"primary_v2", size:"medium", config:"labelOnly", iconPos:"left", iconName:"chevron_right", labelText:"버튼", isMaster:false }
      : { type:"text", style:"Body/body_6", content:"텍스트", color:"#333333", isMaster:false };
    setItems(prev => [...prev, { id, x: 16, y: Math.min(16 + prev.length * 64, 480), ...base }]);
    setSelected(id);
  };

  const updateItem    = (id, upd) => setItems(prev => prev.map(i => i.id === id ? { ...i, ...upd } : i));
  const removeItem    = (id) => { setItems(prev => prev.filter(i => i.id !== id)); if (selected === id) setSelected(null); };
  const duplicateItem = (item) => {
    const nid = Date.now();
    setItems(prev => [...prev, { ...item, id: nid, x: item.x + 24, y: item.y + 24, isMaster: false }]);
    setSelected(nid);
  };
  const sel = items.find(i => i.id === selected);

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
            {locked && "🔒 "}{sel.type === "labelButton" ? "LabelButton" : "Text"}
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

        {/* Position & Size */}
        <div style={{ paddingTop:"10px", borderTop:"1px solid #e5e5e5", marginBottom:"10px" }}>
          <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"6px" }}>Position &amp; Size</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
            {["x","y"].map(axis => (
              <div key={axis}>
                <div style={{ fontSize:"9px", color:"#bbbbbb", marginBottom:"3px" }}>{axis.toUpperCase()} (dp)</div>
                <input type="number" value={sel[axis]} onChange={e => !locked && updateItem(sel.id, { [axis]: Number(e.target.value) })} readOnly={locked}
                  style={{ width:"100%", background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"4px 6px", color: locked?"#555570":"#111111", fontSize:"11px", outline:"none", boxSizing:"border-box" }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize:"9px", color:"#bbbbbb", marginBottom:"3px" }}>W (dp)</div>
              <input type="number" value={sel.w || ""} placeholder="auto" onChange={e => !locked && updateItem(sel.id, { w: e.target.value ? Number(e.target.value) : undefined })} readOnly={locked}
                style={{ width:"100%", background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"4px 6px", color: locked?"#555570":"#111111", fontSize:"11px", outline:"none", boxSizing:"border-box" }} />
            </div>
            <div>
              <div style={{ fontSize:"9px", color:"#bbbbbb", marginBottom:"3px" }}>Snap</div>
              <button onClick={() => setSnapGrid(v => !v)}
                style={{ width:"100%", padding:"4px 0", borderRadius:"5px", background: snapGrid?"#f0f0f0":"transparent", border: snapGrid?"1px solid #c0c0c0":"1px solid #e5e5e5", color: snapGrid?"#333333":"#999999", fontSize:"10px", cursor:"pointer" }}>
                {snapGrid ? "8dp ✓" : "free"}
              </button>
            </div>
          </div>
        </div>

        {/* Duplicate + Delete */}
        <div style={{ display:"flex", gap:"6px" }}>
          <button onClick={() => duplicateItem(sel)}
            style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border:"1px solid #b0d0b8", color:"#2a7a4a", fontSize:"10px", cursor:"pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background="#e8f5ec"; e.currentTarget.style.color="#1a5a30"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#2a7a4a"; }}>
            복제
          </button>
          <button onClick={() => !locked && removeItem(sel.id)} disabled={locked}
            style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border: locked?"1px solid #dddddd":"1px solid #f0b0b0", color: locked?"#cccccc":"#aa3333", fontSize:"10px", cursor: locked?"default":"pointer" }}
            onMouseEnter={e => { if (!locked) { e.currentTarget.style.background="#ffeaea"; e.currentTarget.style.color="#cc0000"; }}}
            onMouseLeave={e => { if (!locked) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#aa3333"; }}}>
            삭제
          </button>
        </div>
      </div>
    );
  };

  // ── layout ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", gap:"16px", alignItems:"flex-start" }}>

      {/* Left: Device + Palette + Layers */}
      <div style={{ width:"196px", flexShrink:0, display:"flex", flexDirection:"column", gap:"10px" }}>

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
            {[{ type:"labelButton", label:"⬚  LabelButton" }, { type:"text", label:"T   Text" }].map(c => (
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
            onAdd={({ svgData, w, h }) => {
              const id = Date.now();
              setItems(prev => [...prev, { id, type:"svg", svgData, w, h, x:16, y:Math.min(16+prev.length*40,400), isMaster:false }]);
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
            : <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
                {[...items].reverse().map(item => (
                  <div key={item.id} onClick={() => setSelected(item.id)}
                    style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 8px", borderRadius:"5px", background: selected===item.id?"#e5e5e5":"transparent", border: selected===item.id ? (item.isMaster?"1px solid #665500":"1px solid #c0c0c0") : "1px solid transparent", cursor:"pointer" }}>
                    <span style={{ fontSize:"10px", color: item.isMaster?"#ccaa00": selected===item.id?"#333333":"#888888", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>
                      {item.isMaster ? "🔒 " : ""}{item.type==="labelButton"?"⬚":"T"} {item.type==="labelButton"?item.labelText:item.content}
                    </span>
                    <button onClick={e => { e.stopPropagation(); if (!item.isMaster) removeItem(item.id); }}
                      style={{ background:"none", border:"none", color: item.isMaster?"#333330":"#bbbbbb", cursor: item.isMaster?"default":"pointer", fontSize:"12px", padding:"0 2px", flexShrink:0 }}>
                      {item.isMaster ? "🔒" : "×"}
                    </button>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Center: Phone canvas */}
      <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
        <PhoneFrame platform={platform} device={device} canvasMode darkMode={darkMode}>
          <div style={{ position:"absolute", inset:0 }} onClick={() => setSelected(null)}>
            {items.map(item => (
              <div key={item.id}
                ref={el => compRefs.current[item.id] = el}
                style={{ position:"absolute", left:`${item.x}px`, top:`${item.y}px`, cursor: item.isMaster?"pointer":"grab", ...(item.w ? { width:`${item.w}px` } : {}) }}
                onMouseDown={e => startDrag(e, item)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {renderComp(item)}
                {hovered === item.id && selected !== item.id && renderSelectionBox(item, true)}
                {selected === item.id && renderSelectionBox(item, false)}
              </div>
            ))}
            {items.length === 0 && (
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#bbb", fontSize:`${sdp(12)}px`, fontFamily:"system-ui", pointerEvents:"none", flexDirection:"column", gap:`${sdp(6)}px` }}>
                <span style={{ fontSize:`${sdp(24)}px`, opacity:0.3 }}>+</span>
                <span style={{ opacity:0.4 }}>Add에서 컴포넌트 추가</span>
              </div>
            )}
          </div>
        </PhoneFrame>
      </div>

      {/* Right: Properties */}
      <div style={{ width:"196px", flexShrink:0, background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", overflow:"hidden" }}>
        {renderProps()}
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
  const row1 = CATEGORY_ITEMS.slice(0, 8);
  const row2 = [...CATEGORY_ITEMS.slice(8), LOTTERIA];

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
      <div style={{ width: "52px", height: "52px", borderRadius: "14px", overflow: "hidden", background: "#2a2a2a", position: "relative" }}>
        <img src={item.img} width="52" height="52" style={{ objectFit: "cover", display: "block" }} onError={e => { e.target.style.display = "none"; }} />
        {item.badge && (
          <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", background: "#FA0050", fontSize: "7px", fontWeight: 700, color: "#fff", textAlign: "center", padding: "2px 0", lineHeight: 1.2 }}>{item.badge}</div>
        )}
      </div>
      <span style={{ fontSize: "12px", color: "#cccccc", fontFamily: "Roboto, sans-serif", whiteSpace: "nowrap" }}>{item.label}</span>
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
        <div style={{ background: "#1a1a1a", borderRadius: "16px", width: "390px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: "4px", padding: "16px 20px 8px", overflowX: "auto", scrollbarWidth: "none" }}>
            {row1.map((item, i) => renderCategoryItem(item, i))}
          </div>
          {/* Row 2 */}
          <div style={{ display: "flex", gap: "4px", padding: "0 20px 8px", overflowX: "auto", scrollbarWidth: "none" }}>
            {row2.map((item, i) => renderCategoryItem(item, i + 8))}
          </div>
          {/* Scroll indicator */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: "8px" }}>
            <div style={{ width: "56px", height: "4px", background: "#333", borderRadius: "2px", position: "relative" }}>
              <div style={{ width: "24px", height: "4px", background: "#ffffff", borderRadius: "2px" }} />
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
