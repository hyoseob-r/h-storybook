import { useState, useRef, useEffect } from "react";
import { colors, typography, spacing, radius, elevation, states } from "./tokens";

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
  return "";
}

// ── UI Components ─────────────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{ padding: "4px 10px", background: copied ? "#1a3a1a" : "#1a1a2a", border: `1px solid ${copied ? "#3a6a3a" : "#2a2a4a"}`, borderRadius: "6px", color: copied ? "#80d080" : "#6060a0", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}>
      {copied ? "복사됨 ✓" : "복사"}
    </button>
  );
}

function CodeBlock({ code }) {
  return (
    <div style={{ position: "relative", background: "#08081a", border: "1px solid #1a1a30", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "8px", right: "8px" }}><CopyButton text={code} /></div>
      <pre style={{ margin: 0, padding: "16px", fontSize: "11.5px", lineHeight: "1.7", color: "#a0a0d0", overflowX: "auto", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{code}</pre>
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
            style={{ padding: "5px 12px", borderRadius: "6px", background: active === t.id ? "#1e1e3a" : "transparent", border: active === t.id ? "1px solid #3a3a6a" : "1px solid transparent", color: active === t.id ? "#c0c0f0" : "#5a5a8a", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>
      <CodeBlock code={tabs.find(t => t.id === active)?.code || ""} />
    </div>
  );
}

// ── Section: Colors ───────────────────────────────────────────────────────────

function ColorSwatch({ name, value }) {
  const isDark = parseInt(value.replace("#", "").slice(0, 2), 16) < 128;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", cursor: "pointer" }} onClick={() => navigator.clipboard.writeText(value)}>
      <div style={{ width: "100%", height: "56px", background: value, borderRadius: "8px", border: "1px solid #1a1a30", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "10px", color: isDark ? "#ffffff88" : "#00000088", fontFamily: "monospace" }}>{value}</span>
      </div>
      <div style={{ fontSize: "10px", color: "#7070a0", lineHeight: "1.4" }}>{name}</div>
    </div>
  );
}

function ColorsSection() {
  const groups = [
    { title: "Foundation", tokens: Object.values(colors.foundation) },
    { title: "Gray Scale", tokens: Object.values(colors.gray) },
    { title: "Background", tokens: Object.values(colors.background) },
    { title: "Variant", tokens: Object.values(colors.variant) },
  ];
  const overlays = Object.values(states.overlay);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {groups.map(g => (
        <div key={g.title}>
          <div style={{ fontSize: "11px", color: "#5a5a8a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px", fontWeight: 600 }}>{g.title}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "12px" }}>
            {g.tokens.map(t => <ColorSwatch key={t.name} name={t.name} value={t.value} />)}
          </div>
        </div>
      ))}
      {/* States / Overlay */}
      <div>
        <div style={{ fontSize: "11px", color: "#5a5a8a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px", fontWeight: 600 }}>States / Overlay</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {overlays.map(o => (
            <div key={o.name} style={{ padding: "14px 20px", background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "10px", display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Checkerboard + overlay swatch */}
              <div style={{ width: "48px", height: "32px", borderRadius: "6px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-conic-gradient(#3a3a5a 0% 25%, #1a1a30 0% 50%)", backgroundSize: "10px 10px" }} />
                <div style={{ position: "absolute", inset: 0, background: o.value }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", color: "#c0c0f0", fontWeight: 600 }}>{o.label}</div>
                <div style={{ fontSize: "10px", color: "#5a5a8a", fontFamily: "monospace", marginTop: "2px" }}>{o.name}</div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#7070a0" }}>{o.value.toUpperCase()}</div>
              <div style={{ fontSize: "10px", color: "#3a3a6a", background: "#1a1a30", padding: "2px 8px", borderRadius: "4px" }}>opacity {o.opacity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Section: Typography ───────────────────────────────────────────────────────

function TypographySection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {typography.map(t => (
        <div key={t.name} style={{ padding: "16px 20px", background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "10px", display: "flex", alignItems: "baseline", gap: "20px" }}>
          <div style={{ width: "180px", flexShrink: 0 }}>
            <div style={{ fontSize: "10px", color: "#5a5a8a", marginBottom: "2px", fontFamily: "monospace" }}>{t.name}</div>
            <div style={{ fontSize: "10px", color: "#3a3a6a" }}>{t.size}px · {t.style} · lh {t.lineHeight}</div>
          </div>
          <div style={{ fontFamily: "Roboto, sans-serif", fontSize: `${t.size}px`, fontWeight: t.weight, lineHeight: `${t.lineHeight}px`, color: "#e0e0f0" }}>
            배달의민족 Delivery Hero
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Section: Spacing & Radius ─────────────────────────────────────────────────

function SpacingSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ fontSize: "11px", color: "#5a5a8a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px", fontWeight: 600 }}>Spacing</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {spacing.map(s => (
            <div key={s.name} style={{ padding: "12px 20px", background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "10px", display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "60px", fontSize: "12px", color: "#7070a0", fontFamily: "monospace" }}>{s.name}</div>
              <div style={{ width: `${s.value * 4}px`, height: "20px", background: "#fa005033", border: "1px solid #fa005066", borderRadius: "3px" }} />
              <div style={{ fontSize: "12px", color: "#5a5a8a" }}>{s.value}px</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "11px", color: "#5a5a8a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px", fontWeight: 600 }}>Border Radius</div>
        <div style={{ display: "flex", gap: "16px" }}>
          {radius.map(r => (
            <div key={r.name} style={{ padding: "16px 24px", background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: `${r.value}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ fontSize: "12px", color: "#7070a0", fontFamily: "monospace" }}>{r.name}</div>
              <div style={{ fontSize: "11px", color: "#5a5a8a" }}>{r.value}px</div>
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
  const platforms = ["swiftui", "ios", "compose", "android"];
  const platLabel = { swiftui: "SwiftUI", ios: "UIKit", compose: "Jetpack Compose", android: "Android XML" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Platform picker */}
      <div style={{ display: "flex", gap: "4px" }}>
        {platforms.map(p => (
          <button key={p} onClick={() => setSelPlatform(p)}
            style={{ padding: "5px 12px", borderRadius: "6px", background: selPlatform === p ? "#1e1e3a" : "transparent", border: selPlatform === p ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: selPlatform === p ? "#c0c0f0" : "#5a5a8a", fontSize: "11px", cursor: "pointer" }}>
            {platLabel[p]}
          </button>
        ))}
      </div>

      {elevation.map(lv => (
        <div key={lv.name} style={{ background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#5a5a8a", background: "#08081a", border: "1px solid #1a1a30", padding: "2px 8px", borderRadius: "4px" }}>{lv.name}</div>
            <div style={{ fontSize: "13px", color: "#c0c0f0", fontWeight: 600 }}>{lv.label}</div>
            <div style={{ fontSize: "10px", color: "#3a3a6a", textTransform: "uppercase", letterSpacing: "0.1em" }}>↕ {lv.direction === "up" ? "Upward" : "Downward"}</div>
          </div>

          {/* Visual preview */}
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <div style={{ width: "120px", height: "72px", background: "#ffffff", borderRadius: "12px", boxShadow: lv.css, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: "10px", color: "#999", fontFamily: "monospace" }}>{lv.label}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "10px", color: "#5a5a8a", marginBottom: "6px", letterSpacing: "0.1em", textTransform: "uppercase" }}>CSS box-shadow</div>
              <code style={{ fontSize: "11px", color: "#8080c0", fontFamily: "monospace", lineHeight: 1.6 }}>{lv.css}</code>
            </div>
          </div>

          {/* Platform code */}
          <div>
            <div style={{ fontSize: "10px", color: "#5a5a8a", marginBottom: "6px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{platLabel[selPlatform]}</div>
            <pre style={{ background: "#060612", border: "1px solid #1a1a30", borderRadius: "8px", padding: "14px 16px", fontSize: "12px", color: "#9090d0", fontFamily: "monospace", overflowX: "auto", lineHeight: 1.6, margin: 0 }}>
              {selPlatform === "swiftui" ? lv.swiftui
               : selPlatform === "ios"     ? `layer.shadowColor = UIColor(red: 0.098, green: 0.188, blue: 0.251, alpha: 1).cgColor\nlayer.${lv.ios}`
               : selPlatform === "compose" ? `Modifier.shadow(${lv.compose}, shape = RoundedCornerShape(12.dp))`
               : `android:elevation="${lv.android.replace("elevation: ", "").replace("dp","")}" />`}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── LabelButton code generator (YDS 2.0) ─────────────────────────────────────

function genLabelButtonCode(platform, shape, colorStyle, size, config) {
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
  const iconNote = hasLeftIcon ? " (leftIcon)" : hasRightIcon ? " (rightIcon)" : "";

  if (platform === "xml") return `<com.google.android.material.button.MaterialButton
    android:layout_width="wrap_content"
    android:layout_height="${h}dp"
    android:text="버튼${iconNote}"
    android:textColor="${fg}"
    android:textSize="${fs}sp"
    android:fontFamily="@font/roboto_bold"
    android:paddingStart="${ph}dp"
    android:paddingEnd="${ph}dp"
    app:backgroundTint="${bg}"
    app:cornerRadius="${r}dp"${shape === "outlined" ? `\n    style="@style/Widget.MaterialComponents.Button.OutlinedButton"\n    app:strokeColor="${border}"\n    app:strokeWidth="1dp"` : ""}${shape === "text" ? `\n    style="@style/Widget.MaterialComponents.Button.TextButton"` : ""} />`;

  if (platform === "compose") return `Button(
    onClick = { },
    modifier = Modifier.height(${h}.dp),
    colors = ButtonDefaults.buttonColors(
        containerColor = Color(0xFF${bg.replace("#","")}),
        contentColor = Color(0xFF${fg.replace("#","")})
    ),
    shape = RoundedCornerShape(${r}.dp),
    contentPadding = PaddingValues(horizontal = ${ph}.dp),${shape === "outlined" ? `\n    border = BorderStroke(1.dp, Color(0xFF${(border||"").replace("#","")})),` : ""}
) {${hasLeftIcon ? `\n    Icon(/* leftIcon */, contentDescription = null)\n    Spacer(Modifier.width(4.dp))` : ""}
    Text("버튼", fontSize = ${fs}.sp, fontWeight = FontWeight.Bold)${hasRightIcon ? `\n    Spacer(Modifier.width(4.dp))\n    Icon(Icons.Default.ChevronRight, contentDescription = null)` : ""}
}`;

  if (platform === "swiftui") return `Button(action: {}) {${hasLeftIcon ? `\n    HStack(spacing: 4) {\n        Image(systemName: "pencil")\n        Text("버튼")\n    }` : hasRightIcon ? `\n    HStack(spacing: 4) {\n        Text("버튼")\n        Image(systemName: "chevron.right")\n    }` : `\n    Text("버튼")`}
}
.frame(height: ${h})
.padding(.horizontal, ${ph})${shape === "filled" ? `\n.background(Color(hex: "${bg}"))\n.foregroundColor(Color(hex: "${fg}"))` : shape === "outlined" ? `\n.overlay(RoundedRectangle(cornerRadius: ${r}).stroke(Color(hex: "${border}"), lineWidth: 1))\n.foregroundColor(Color(hex: "${fg}"))` : `\n.foregroundColor(Color(hex: "${fg}"))`}
.cornerRadius(${r})
.font(.system(size: ${fs}, weight: .bold))`;

  if (platform === "flutter") {
    const child = hasLeftIcon
      ? `Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.edit, size: ${fs + 2}), SizedBox(width: 4), Text('버튼', style: TextStyle(fontSize: ${fs}, fontWeight: FontWeight.bold))])`
      : hasRightIcon
      ? `Row(mainAxisSize: MainAxisSize.min, children: [Text('버튼', style: TextStyle(fontSize: ${fs}, fontWeight: FontWeight.bold)), SizedBox(width: 4), Icon(Icons.chevron_right, size: ${fs + 2})])`
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
  const [iconPos, setIconPos]  = useState("left");   // "left" | "right"
  const [selPlat, setSelPlat]  = useState("compose");

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

  const iconEl = <span style={{ fontSize: `${fs + 2}px`, lineHeight: 1 }}>✎</span>;
  const configForCode = config === "labelWithIcon"
    ? (iconPos === "left" ? "labelWithLeftIcon" : "labelWithRightIcon")
    : "labelOnly";
  const code = genLabelButtonCode(selPlat, shape, color, size, configForCode);

  const ctl = (label, options, val, set, allowedSet) => (
    <div>
      <div style={{ fontSize: "10px", color: "#5a5a8a", marginBottom: "6px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {options.map(o => {
          const disabled = allowedSet && !allowedSet.includes(o);
          return (
            <button key={o} onClick={() => !disabled && set(o)} disabled={disabled}
              style={{ padding: "4px 10px", borderRadius: "6px", background: val === o ? "#1e1e3a" : "transparent", border: val === o ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: disabled ? "#2a2a4a" : val === o ? "#c0c0f0" : "#5a5a8a", fontSize: "11px", cursor: disabled ? "default" : "pointer", textDecoration: disabled ? "line-through" : "none" }}>
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
          <div key={k} style={{ padding: "3px 10px", background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "6px", fontSize: "10px", color: "#6060a0" }}>
            <span style={{ color: "#3a3a6a" }}>{k} </span>{v}
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
      </div>

      {/* Preview */}
      <div style={{ padding: "40px", background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
        {/* enabled */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <button style={{ height: `${h}px`, padding: `0 ${ph}px`, background: previewBg, border: previewBorder, borderRadius: `${r}px`, color: previewFg, fontSize: `${fs}px`, fontWeight: 700, cursor: "pointer", fontFamily: "Roboto, sans-serif", display: "flex", alignItems: "center", gap: "5px" }}>
            {config === "labelWithIcon" && iconPos === "left" && iconEl}
            버튼
            {config === "labelWithIcon" && iconPos === "right" && iconEl}
          </button>
          <span style={{ fontSize: "9px", color: "#3a3a5a", letterSpacing: "0.1em" }}>ENABLED</span>
        </div>
        {/* disabled */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <button disabled style={{ height: `${h}px`, padding: `0 ${ph}px`, background: previewBg, border: previewBorder, borderRadius: `${r}px`, color: previewFg, fontSize: `${fs}px`, fontWeight: 700, cursor: "not-allowed", fontFamily: "Roboto, sans-serif", opacity: 0.35, display: "flex", alignItems: "center", gap: "5px" }}>
            {config === "labelWithIcon" && iconPos === "left" && iconEl}
            버튼
            {config === "labelWithIcon" && iconPos === "right" && iconEl}
          </button>
          <span style={{ fontSize: "9px", color: "#3a3a5a", letterSpacing: "0.1em" }}>DISABLED</span>
        </div>
      </div>

      {/* Platform tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "-16px" }}>
        {plats.map(p => (
          <button key={p.id} onClick={() => setSelPlat(p.id)}
            style={{ padding: "5px 12px", borderRadius: "6px 6px 0 0", background: selPlat === p.id ? "#0c0c1e" : "transparent", border: selPlat === p.id ? "1px solid #1a1a30" : "1px solid transparent", borderBottom: selPlat === p.id ? "1px solid #0c0c1e" : "none", color: selPlat === p.id ? "#c0c0f0" : "#5a5a8a", fontSize: "11px", cursor: "pointer" }}>
            {p.label}
          </button>
        ))}
      </div>
      <pre style={{ background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "0 8px 8px 8px", padding: "16px", fontSize: "12px", color: "#9090d0", fontFamily: "monospace", overflowX: "auto", lineHeight: 1.65, margin: 0 }}>
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
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#5a5a8a", marginBottom: "8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Color</div>
          <div style={{ display: "flex", gap: "4px" }}>
            {colors2.map(c => (
              <button key={c} onClick={() => setColor(c)}
                style={{ padding: "5px 12px", borderRadius: "6px", background: color === c ? "#1e1e3a" : "transparent", border: color === c ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: color === c ? "#c0c0f0" : "#5a5a8a", fontSize: "11px", cursor: "pointer", textTransform: "capitalize" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "10px", color: "#5a5a8a", marginBottom: "8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Size</div>
          <div style={{ display: "flex", gap: "4px" }}>
            {sizes.map(s => (
              <button key={s} onClick={() => setSize(s)}
                style={{ padding: "5px 12px", borderRadius: "6px", background: size === s ? "#1e1e3a" : "transparent", border: size === s ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: size === s ? "#c0c0f0" : "#5a5a8a", fontSize: "11px", cursor: "pointer", textTransform: "capitalize" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ padding: "40px", background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
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

function PhoneFrame({ platform, device, children }) {
  const isIOS = platform === "ios";
  const scale = MAX_FRAME_H / device.h;
  const fw = Math.round(device.w * scale);
  const fh = MAX_FRAME_H;
  const border = isIOS ? 10 : 8;
  const radius = isIOS ? Math.round(48 * scale) : Math.round(36 * scale);
  // 폰 전체를 실제 dp 크기로 렌더링 후 scale로 축소
  const totalW = device.w + border * 2;
  const totalH = device.h + border * 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      {/* Device label */}
      <div style={{ fontSize: "10px", color: "#4a4a7a", letterSpacing: "0.1em" }}>
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
                <div style={{ height: "44px", background: "#fff", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 24px 8px", flexShrink: 0 }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#000", fontFamily: "system-ui" }}>9:41</span>
                  <div style={{ width: "100px", height: "26px", background: "#111", borderRadius: "20px", position: "absolute", left: "50%", transform: "translateX(-50%)", top: "0" }} />
                  <span style={{ fontSize: "9px", color: "#000" }}>●●● WiFi 🔋</span>
                </div>
              ) : (
                <div style={{ height: "28px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0 }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#000", fontFamily: "Roboto, sans-serif" }}>9:41</span>
                  <span style={{ fontSize: "8px", color: "#000" }}>▲▲▲ WiFi 🔋</span>
                </div>
              )}
              {/* Screen content — renders at actual dp */}
              <div style={{ flex: 1, background: "#fff", overflowY: "auto", overflowX: "hidden" }}>
                {children}
              </div>
              {/* Home indicator */}
              {isIOS ? (
                <div style={{ height: "28px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "100px", height: "4px", background: "#000", borderRadius: "2px", opacity: 0.2 }} />
                </div>
              ) : (
                <div style={{ height: "36px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                  <span style={{ fontSize: "14px", opacity: 0.4 }}>◁</span>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "1.5px solid #0006" }} />
                  <span style={{ fontSize: "12px", opacity: 0.4 }}>□</span>
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

function SimulatorSection() {
  const [platform, setPlatform] = useState("ios");
  const [deviceIdx, setDeviceIdx] = useState(0);
  const [canvasItems, setCanvasItems] = useState([
    { id: 1, type: "button", variant: "primary", size: "medium", label: "주문하기" },
    { id: 2, type: "label",  color: "primary",   size: "medium", label: "인기" },
    { id: 3, type: "button", variant: "outline",  size: "medium", label: "장바구니" },
  ]);
  const [selected, setSelected] = useState(null);
  const nextId = () => Date.now();

  const addItem = (type) => {
    const item = type === "button"
      ? { id: nextId(), type: "button", variant: "primary", size: "medium", label: "버튼" }
      : { id: nextId(), type: "label",  color: "primary",   size: "medium", label: "라벨" };
    setCanvasItems(prev => [...prev, item]);
    setSelected(item.id);
  };

  const removeItem = (id) => {
    setCanvasItems(prev => prev.filter(i => i.id !== id));
    if (selected === id) setSelected(null);
  };

  const updateItem = (id, key, val) => {
    setCanvasItems(prev => prev.map(i => i.id === id ? { ...i, [key]: val } : i));
  };

  const sel = canvasItems.find(i => i.id === selected);

  const bgMap  = { primary: "#fa0050", secondary: "#2591b5", outline: "transparent" };
  const fgMap  = { primary: "#fff",    secondary: "#fff",    outline: "#fa0050" };
  const lBgMap = { primary: "#fff5f8", secondary: "#f0f7fa", neutral: "#f6f6f6" };
  const lFgMap = { primary: "#fa0050", secondary: "#2591b5", neutral: "#333" };
  const fontMap = { large: "16px", medium: "14px", small: "12px" };
  const padMap  = { large: "12px 20px", medium: "8px 16px", small: "6px 12px" };

  return (
    <div style={{ display: "flex", gap: "32px", height: "100%", alignItems: "flex-start" }}>
      {/* Left: Controls */}
      <div style={{ width: "220px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Platform + Device */}
        <div style={{ background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#5a5a8a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>Platform</div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {["ios", "android"].map(p => (
              <button key={p} onClick={() => { setPlatform(p); setDeviceIdx(0); }}
                style={{ flex: 1, padding: "7px", borderRadius: "7px", background: platform === p ? "#1e1e3a" : "transparent", border: platform === p ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: platform === p ? "#c0c0f0" : "#5a5a8a", fontSize: "11px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: platform === p ? 700 : 400 }}>
                {p === "ios" ? "iOS" : "Android"}
              </button>
            ))}
          </div>
          <div style={{ fontSize: "10px", color: "#5a5a8a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>Device</div>
          <select value={deviceIdx} onChange={e => setDeviceIdx(Number(e.target.value))}
            style={{ width: "100%", background: "#08081a", border: "1px solid #2a2a4a", borderRadius: "6px", padding: "6px 8px", color: "#c0c0f0", fontSize: "11px", outline: "none", cursor: "pointer" }}>
            {DEVICES[platform].map((d, i) => (
              <option key={i} value={i}>{d.name} ({d.w}×{d.h})</option>
            ))}
          </select>
        </div>

        {/* Add components */}
        <div style={{ background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#5a5a8a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>Add Component</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => addItem("button")}
              style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "transparent", border: "1px solid #1a1a30", color: "#7070a0", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#3a3a6a"; e.currentTarget.style.color = "#b0b0e0"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a30"; e.currentTarget.style.color = "#7070a0"; }}>
              + Button
            </button>
            <button onClick={() => addItem("label")}
              style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "transparent", border: "1px solid #1a1a30", color: "#7070a0", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#3a3a6a"; e.currentTarget.style.color = "#b0b0e0"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a30"; e.currentTarget.style.color = "#7070a0"; }}>
              + Label
            </button>
          </div>
        </div>

        {/* Canvas items list */}
        <div style={{ background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#5a5a8a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>Layers</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {canvasItems.map(item => (
              <div key={item.id} onClick={() => setSelected(item.id)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "6px", background: selected === item.id ? "#1a1a30" : "transparent", border: selected === item.id ? "1px solid #3a3a6a" : "1px solid transparent", cursor: "pointer" }}>
                <span style={{ fontSize: "11px", color: selected === item.id ? "#c0c0f0" : "#6060a0" }}>{item.type === "button" ? "⬚" : "◷"} {item.label}</span>
                <button onClick={e => { e.stopPropagation(); removeItem(item.id); }}
                  style={{ background: "none", border: "none", color: "#3a3a5a", cursor: "pointer", fontSize: "12px", padding: "0 2px" }}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected item properties */}
        {sel && (
          <div style={{ background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "10px", padding: "14px" }}>
            <div style={{ fontSize: "10px", color: "#5a5a8a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px", fontWeight: 600 }}>Properties</div>

            {/* Label text */}
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "10px", color: "#4a4a7a", marginBottom: "5px" }}>Text</div>
              <input value={sel.label} onChange={e => updateItem(sel.id, "label", e.target.value)}
                style={{ width: "100%", background: "#08081a", border: "1px solid #2a2a4a", borderRadius: "6px", padding: "6px 8px", color: "#e0e0f0", fontSize: "11px", outline: "none" }} />
            </div>

            {sel.type === "button" && (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "10px", color: "#4a4a7a", marginBottom: "5px" }}>Variant</div>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {["primary","secondary","outline"].map(v => (
                      <button key={v} onClick={() => updateItem(sel.id, "variant", v)}
                        style={{ padding: "4px 8px", borderRadius: "5px", background: sel.variant === v ? "#1e1e3a" : "transparent", border: sel.variant === v ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: sel.variant === v ? "#c0c0f0" : "#5a5a8a", fontSize: "10px", cursor: "pointer" }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {sel.type === "label" && (
              <div style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", color: "#4a4a7a", marginBottom: "5px" }}>Color</div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["primary","secondary","neutral"].map(c => (
                    <button key={c} onClick={() => updateItem(sel.id, "color", c)}
                      style={{ padding: "4px 8px", borderRadius: "5px", background: sel.color === c ? "#1e1e3a" : "transparent", border: sel.color === c ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: sel.color === c ? "#c0c0f0" : "#5a5a8a", fontSize: "10px", cursor: "pointer" }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: "10px", color: "#4a4a7a", marginBottom: "5px" }}>Size</div>
              <div style={{ display: "flex", gap: "4px" }}>
                {["large","medium","small"].map(s => (
                  <button key={s} onClick={() => updateItem(sel.id, "size", s)}
                    style={{ padding: "4px 8px", borderRadius: "5px", background: sel.size === s ? "#1e1e3a" : "transparent", border: sel.size === s ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: sel.size === s ? "#c0c0f0" : "#5a5a8a", fontSize: "10px", cursor: "pointer" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Phone preview */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", paddingTop: "8px" }}>
        <PhoneFrame platform={platform} device={DEVICES[platform][deviceIdx]}>
          {/* App bar */}
          <div style={{ padding: platform === "ios" ? "16px 16px 12px" : "12px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: platform === "ios" ? "8px" : "4px", background: "#fa0050", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "Roboto, sans-serif" }}>Y</span>
            </div>
            <span style={{ fontSize: platform === "ios" ? "17px" : "16px", fontWeight: 700, color: "#111", fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>YDS Preview</span>
          </div>
          {/* Component canvas */}
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {canvasItems.map(item => (
              <div key={item.id} onClick={() => setSelected(item.id)}
                style={{ outline: selected === item.id ? "2px solid #fa005066" : "none", borderRadius: "10px", display: "inline-block", cursor: "pointer" }}>
                {item.type === "button" ? (
                  <button style={{ padding: padMap[item.size], background: bgMap[item.variant], border: item.variant === "outline" ? "1px solid #fa0050" : "none", borderRadius: "10px", color: fgMap[item.variant], fontSize: fontMap[item.size], fontWeight: 700, cursor: "pointer", fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif", width: "100%" }}>
                    {item.label}
                  </button>
                ) : (
                  <span style={{ padding: item.size === "large" ? "3px 10px" : item.size === "medium" ? "2px 8px" : "1px 6px", background: lBgMap[item.color], borderRadius: "10px", color: lFgMap[item.color], fontSize: fontMap[item.size], fontWeight: 700, fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </PhoneFrame>
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
  { name: "맥도날드",       tag: "버거",    time: "20분", rating: "4.8", color: "#FFC72C" },
  { name: "BBQ치킨",        tag: "치킨",    time: "25분", rating: "4.7", color: "#E63329" },
  { name: "본죽",            tag: "한식",    time: "30분", rating: "4.6", color: "#4CAF50" },
  { name: "스타벅스",       tag: "카페",    time: "15분", rating: "4.9", color: "#00704A" },
  { name: "피자헛",         tag: "피자",    time: "35분", rating: "4.5", color: "#E31837" },
  { name: "롯데리아",       tag: "버거",    time: "18분", rating: "4.4", color: "#E31837" },
  { name: "교촌치킨",       tag: "치킨",    time: "28분", rating: "4.7", color: "#C8A96E" },
  { name: "CU 편의점",      tag: "편의점",  time: "10분", rating: "4.3", color: "#00AADC" },
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

  const fwOptions = platform === "ios"
    ? [{ id: "swiftui", label: "SwiftUI" }, { id: "uikit", label: "UIKit" }]
    : [{ id: "compose", label: "Jetpack Compose" }, { id: "xml", label: "View (XML)" }];

  return (
    <div style={{ display: "flex", gap: "20px", height: "100%", minHeight: 0 }}>

      {/* ── Left controls ── */}
      <div style={{ width: "210px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>

        {/* Platform */}
        <div style={{ background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#5a5a8a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>Platform</div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {["ios","android"].map(p => (
              <button key={p} onClick={() => { setPlatform(p); setOsIdx(p === "ios" ? 5 : 3); setFramework(p === "ios" ? "swiftui" : "compose"); setDeviceIdx(0); }}
                style={{ flex: 1, padding: "7px", borderRadius: "7px", background: platform === p ? "#1e1e3a" : "transparent", border: platform === p ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: platform === p ? "#c0c0f0" : "#5a5a8a", fontSize: "11px", cursor: "pointer", fontWeight: platform === p ? 700 : 400 }}>
                {p === "ios" ? "iOS" : "Android"}
              </button>
            ))}
          </div>
          <div style={{ fontSize: "10px", color: "#5a5a8a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 600 }}>OS Version</div>
          <select value={osIdx} onChange={e => setOsIdx(Number(e.target.value))}
            style={{ width: "100%", background: "#08081a", border: "1px solid #2a2a4a", borderRadius: "6px", padding: "6px 8px", color: "#c0c0f0", fontSize: "11px", outline: "none", cursor: "pointer" }}>
            {osList.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
          </select>
        </div>

        {/* Device */}
        <div style={{ background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#5a5a8a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>Device</div>
          <select value={deviceIdx} onChange={e => setDeviceIdx(Number(e.target.value))}
            style={{ width: "100%", background: "#08081a", border: "1px solid #2a2a4a", borderRadius: "6px", padding: "6px 8px", color: "#c0c0f0", fontSize: "11px", outline: "none", cursor: "pointer" }}>
            {DEVICES[platform].map((d, i) => <option key={i} value={i}>{d.name}</option>)}
          </select>
        </div>

        {/* Scroll simulator */}
        <div style={{ background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "10px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", color: "#5a5a8a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Scroll</div>
            <div style={{ fontSize: "10px", color: "#4a4a7a", fontFamily: "monospace" }}>{Math.round(scrollRatio * 100)}%</div>
          </div>
          <input type="range" min="0" max="100" value={Math.round(scrollRatio * 100)}
            onChange={e => setScrollRatio(Number(e.target.value) / 100)}
            style={{ width: "100%", accentColor: "#fa0050", cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#3a3a5a", marginTop: "4px" }}>
            <span>Top</span><span>Bottom</span>
          </div>
        </div>

        {/* Compatibility badge */}
        <div style={{ background: "#0c0c1e", border: `1px solid ${compat.color}33`, borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#5a5a8a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>Compatibility</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "20px", background: `${compat.color}18`, border: `1px solid ${compat.color}44` }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: compat.color }} />
            <span style={{ fontSize: "10px", color: compat.color, fontWeight: 600 }}>{compat.label}</span>
          </div>
          {platform === "android" && api < 31 && (
            <div style={{ marginTop: "10px", fontSize: "10px", color: "#6060a0", lineHeight: "1.6" }}>
              {api >= 29 ? "blur 미지원 → 스크림으로 대체" : "blur/scrim 모두 미지원 → solid color"}
            </div>
          )}
          {platform === "ios" && os.liquidGlass && (
            <div style={{ marginTop: "10px", fontSize: "10px", color: "#6060a0", lineHeight: "1.6" }}>
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
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "20px" }}>🍽</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#111", fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>{s.name}</div>
                  <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>⭐ {s.rating} · {s.time}</div>
                </div>
                <span style={{ padding: "2px 8px", background: "#fff5f8", borderRadius: "10px", color: "#fa0050", fontSize: "10px", fontWeight: 700, flexShrink: 0 }}>{s.tag}</span>
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
              style={{ padding: "6px 14px", borderRadius: "7px", background: framework === f.id ? "#1e1e3a" : "transparent", border: framework === f.id ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: framework === f.id ? "#c0c0f0" : "#5a5a8a", fontSize: "11px", cursor: "pointer", fontWeight: framework === f.id ? 700 : 400 }}>
              {f.label}
            </button>
          ))}
        </div>
        <CodeBlock code={genGlassCode(platform, os, framework)} />
      </div>

    </div>
  );
}

const NAV = [
  { id: "colors",      label: "Colors",        icon: "◈" },
  { id: "typography",  label: "Typography",    icon: "T" },
  { id: "spacing",     label: "Spacing",       icon: "↔" },
  { id: "elevation",   label: "Elevation",     icon: "◻" },
  { id: "button",      label: "Button",        icon: "⬚" },
  { id: "label",       label: "Label",         icon: "◷" },
  { id: "simulator",   label: "Simulator",     icon: "📱" },
  { id: "glassnav",    label: "Liquid Glass",  icon: "✦" },
];

export default function App() {
  const [active, setActive] = useState("colors");

  const renderContent = () => {
    if (active === "colors")     return <ColorsSection />;
    if (active === "typography") return <TypographySection />;
    if (active === "spacing")    return <SpacingSection />;
    if (active === "elevation")  return <ElevationSection />;
    if (active === "button")     return <ButtonSection />;
    if (active === "label")      return <LabelSection />;
    if (active === "simulator")  return <SimulatorSection />;
    if (active === "glassnav")   return <GlassNavSection />;
  };

  const titles    = { colors: "Color Tokens", typography: "Typography", spacing: "Spacing & Radius", elevation: "Elevation / Shadow", button: "Button", label: "Label", simulator: "Simulator", glassnav: "Liquid Glass Nav" };
  const subtitles = { colors: "YDS 2.0 Customer Token", typography: "Roboto 기반 타입 스케일", spacing: "스페이싱 및 보더 라디우스", elevation: "YDS 2.0 Elevation — Level 1 · 2 (normal & inverse)", button: "버튼 컴포넌트 — 멀티 플랫폼 코드", label: "라벨 컴포넌트 — 멀티 플랫폼 코드", simulator: "iOS / Android 실시간 화면 시뮬레이션", glassnav: "OS 버전별 Glass Nav Bar — 호환성 + 코드 생성" };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#060612", color: "#e0e0f0", fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", flexShrink: 0, background: "#08081a", borderRight: "1px solid #1a1a30", display: "flex", flexDirection: "column", padding: "20px 0" }}>
        <div style={{ padding: "0 16px 20px", borderBottom: "1px solid #1a1a30", marginBottom: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#e0e0f0", letterSpacing: "-0.01em" }}>h's Storybook</div>
          <div style={{ fontSize: "10px", color: "#4a4a7a", marginTop: "3px" }}>YDS 2.0 Design System</div>
        </div>
        <div style={{ fontSize: "9px", color: "#3a3a5a", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0 16px", marginBottom: "6px", fontWeight: 600 }}>Tokens</div>
        {NAV.slice(0, 4).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#1a1a30" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #fa0050" : "2px solid transparent", color: active === n.id ? "#e0e0f0" : "#6060a0", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ fontSize: "9px", color: "#3a3a5a", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 16px 6px", fontWeight: 600 }}>Components</div>
        {NAV.slice(4, 6).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#1a1a30" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #fa0050" : "2px solid transparent", color: active === n.id ? "#e0e0f0" : "#6060a0", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ fontSize: "9px", color: "#3a3a5a", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 16px 6px", fontWeight: 600 }}>Simulate</div>
        {NAV.slice(6, 8).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#1a1a30" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #fa0050" : "2px solid transparent", color: active === n.id ? "#e0e0f0" : "#6060a0", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ fontSize: "9px", color: "#3a3a5a", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 16px 6px", fontWeight: 600 }}>Labs</div>
        {NAV.slice(8).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#1a1a30" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #fa0050" : "2px solid transparent", color: active === n.id ? "#e0e0f0" : "#6060a0", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1a1a30", fontSize: "9px", color: "#2a2a4a" }}>
          Figma → YDS 2.0 ✓
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "16px 28px", borderBottom: "1px solid #1a1a30", background: "#08081a", flexShrink: 0 }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#e0e0f0" }}>{titles[active]}</div>
          <div style={{ fontSize: "11px", color: "#4a4a7a", marginTop: "3px" }}>{subtitles[active]}</div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px", scrollbarWidth: "thin", scrollbarColor: "#1a1a30 transparent" }}>
          {renderContent()}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1a30; border-radius: 2px; }
      `}</style>
    </div>
  );
}
