import { useState } from "react";
import { colors, typography, spacing, radius } from "./tokens";

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

// ── Section: Button Component ─────────────────────────────────────────────────

function ButtonSection() {
  const [variant, setVariant] = useState("primary");
  const [size, setSize] = useState("medium");

  const variants = ["primary", "secondary", "outline"];
  const sizes = ["large", "medium", "small"];

  const bgMap = { primary: "#fa0050", secondary: "#2591b5", outline: "transparent" };
  const fgMap = { primary: "#ffffff", secondary: "#ffffff", outline: "#fa0050" };
  const borderMap = { primary: "none", secondary: "none", outline: "1px solid #fa0050" };
  const padMap = { large: "12px 20px", medium: "8px 16px", small: "6px 12px" };
  const fontMap = { large: "16px", medium: "14px", small: "12px" };

  const platforms = [
    { id: "xml",     label: "Android XML",       code: genButtonCode("xml", variant, size) },
    { id: "compose", label: "Jetpack Compose",    code: genButtonCode("compose", variant, size) },
    { id: "swiftui", label: "SwiftUI",            code: genButtonCode("swiftui", variant, size) },
    { id: "flutter", label: "Flutter",            code: genButtonCode("flutter", variant, size) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#5a5a8a", marginBottom: "8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Variant</div>
          <div style={{ display: "flex", gap: "4px" }}>
            {variants.map(v => (
              <button key={v} onClick={() => setVariant(v)}
                style={{ padding: "5px 12px", borderRadius: "6px", background: variant === v ? "#1e1e3a" : "transparent", border: variant === v ? "1px solid #3a3a6a" : "1px solid #1a1a30", color: variant === v ? "#c0c0f0" : "#5a5a8a", fontSize: "11px", cursor: "pointer", textTransform: "capitalize" }}>
                {v}
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
      <div style={{ padding: "40px", background: "#0c0c1e", border: "1px solid #1a1a30", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
        <button style={{ padding: padMap[size], background: bgMap[variant], border: borderMap[variant], borderRadius: "10px", color: fgMap[variant], fontSize: fontMap[size], fontWeight: 700, cursor: "pointer", fontFamily: "Roboto, sans-serif", transition: "all 0.2s" }}>
          버튼
        </button>
        <button disabled style={{ padding: padMap[size], background: bgMap[variant], border: borderMap[variant], borderRadius: "10px", color: fgMap[variant], fontSize: fontMap[size], fontWeight: 700, cursor: "not-allowed", fontFamily: "Roboto, sans-serif", opacity: 0.4 }}>
          비활성
        </button>
      </div>

      {/* Code */}
      <PlatformTabs tabs={platforms} />
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
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      {/* Device label */}
      <div style={{ fontSize: "10px", color: "#4a4a7a", letterSpacing: "0.1em" }}>
        {device.name} · {device.w} × {device.h}dp
      </div>
      <div style={{ position: "relative", width: `${fw}px`, flexShrink: 0 }}>
        {/* Phone shell */}
        <div style={{
          width: `${fw}px`, height: `${fh}px`, borderRadius: `${radius}px`,
          background: isIOS ? "#1a1a1a" : "#111",
          border: `${border}px solid ${isIOS ? "#2a2a2a" : "#222"}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px #333",
          display: "flex", flexDirection: "column", overflow: "hidden", position: "relative"
        }}>
          {/* Status bar */}
          {isIOS ? (
            <div style={{ height: `${Math.round(44 * scale)}px`, background: "#fff", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: `0 ${Math.round(24*scale)}px ${Math.round(8*scale)}px`, flexShrink: 0 }}>
              <span style={{ fontSize: `${Math.round(11*scale)}px`, fontWeight: 700, color: "#000", fontFamily: "system-ui" }}>9:41</span>
              <div style={{ width: `${Math.round(100*scale)}px`, height: `${Math.round(26*scale)}px`, background: "#111", borderRadius: `${Math.round(20*scale)}px`, position: "absolute", left: "50%", transform: "translateX(-50%)", top: "0" }} />
              <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                <span style={{ fontSize: `${Math.round(9*scale)}px`, color: "#000" }}>●●● WiFi 🔋</span>
              </div>
            </div>
          ) : (
            <div style={{ height: `${Math.round(28*scale)}px`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${Math.round(16*scale)}px`, flexShrink: 0 }}>
              <span style={{ fontSize: `${Math.round(10*scale)}px`, fontWeight: 700, color: "#000", fontFamily: "Roboto, sans-serif" }}>9:41</span>
              <span style={{ fontSize: `${Math.round(8*scale)}px`, color: "#000" }}>▲▲▲ WiFi 🔋</span>
            </div>
          )}
          {/* Screen content — scaled via transform */}
          <div style={{ flex: 1, background: "#fff", overflow: "hidden", position: "relative" }}>
            <div style={{ transformOrigin: "top left", transform: `scale(${scale})`, width: `${device.w}px`, height: `${Math.round(device.h * (1 - (isIOS ? 72 : 64) / device.h))}px`, overflowY: "auto" }}>
              {children}
            </div>
          </div>
          {/* Home indicator */}
          {isIOS ? (
            <div style={{ height: `${Math.round(28*scale)}px`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: `${Math.round(100*scale)}px`, height: `${Math.round(4*scale)}px`, background: "#000", borderRadius: "2px", opacity: 0.2 }} />
            </div>
          ) : (
            <div style={{ height: `${Math.round(36*scale)}px`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: `${Math.round(20*scale)}px` }}>
              <span style={{ fontSize: `${Math.round(14*scale)}px`, opacity: 0.4 }}>◁</span>
              <div style={{ width: `${Math.round(18*scale)}px`, height: `${Math.round(18*scale)}px`, borderRadius: "50%", border: "1.5px solid #0006" }} />
              <span style={{ fontSize: `${Math.round(12*scale)}px`, opacity: 0.4 }}>□</span>
            </div>
          )}
        </div>
        {/* Side buttons */}
        {isIOS ? (
          <>
            <div style={{ position: "absolute", right: `-${border+4}px`, top: `${Math.round(100*scale)}px`, width: "3px", height: `${Math.round(60*scale)}px`, background: "#2a2a2a", borderRadius: "2px" }} />
            <div style={{ position: "absolute", left: `-${border+4}px`, top: `${Math.round(90*scale)}px`, width: "3px", height: `${Math.round(32*scale)}px`, background: "#2a2a2a", borderRadius: "2px" }} />
            <div style={{ position: "absolute", left: `-${border+4}px`, top: `${Math.round(135*scale)}px`, width: "3px", height: `${Math.round(52*scale)}px`, background: "#2a2a2a", borderRadius: "2px" }} />
            <div style={{ position: "absolute", left: `-${border+4}px`, top: `${Math.round(200*scale)}px`, width: "3px", height: `${Math.round(52*scale)}px`, background: "#2a2a2a", borderRadius: "2px" }} />
          </>
        ) : (
          <>
            <div style={{ position: "absolute", right: `-${border+4}px`, top: `${Math.round(80*scale)}px`, width: "3px", height: `${Math.round(44*scale)}px`, background: "#222", borderRadius: "2px" }} />
            <div style={{ position: "absolute", left: `-${border+4}px`, top: `${Math.round(110*scale)}px`, width: "3px", height: `${Math.round(32*scale)}px`, background: "#222", borderRadius: "2px" }} />
            <div style={{ position: "absolute", left: `-${border+4}px`, top: `${Math.round(155*scale)}px`, width: "3px", height: `${Math.round(52*scale)}px`, background: "#222", borderRadius: "2px" }} />
          </>
        )}
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

const NAV = [
  { id: "colors",     label: "Colors",      icon: "◈" },
  { id: "typography", label: "Typography",  icon: "T" },
  { id: "spacing",    label: "Spacing",     icon: "↔" },
  { id: "button",     label: "Button",      icon: "⬚" },
  { id: "label",      label: "Label",       icon: "◷" },
  { id: "simulator",  label: "Simulator",   icon: "📱" },
];

export default function App() {
  const [active, setActive] = useState("colors");

  const renderContent = () => {
    if (active === "colors")     return <ColorsSection />;
    if (active === "typography") return <TypographySection />;
    if (active === "spacing")    return <SpacingSection />;
    if (active === "button")     return <ButtonSection />;
    if (active === "label")      return <LabelSection />;
    if (active === "simulator")  return <SimulatorSection />;
  };

  const titles    = { colors: "Color Tokens", typography: "Typography", spacing: "Spacing & Radius", button: "Button", label: "Label", simulator: "Simulator" };
  const subtitles = { colors: "YDS 2.0 Customer Token", typography: "Roboto 기반 타입 스케일", spacing: "스페이싱 및 보더 라디우스", button: "버튼 컴포넌트 — 멀티 플랫폼 코드", label: "라벨 컴포넌트 — 멀티 플랫폼 코드", simulator: "iOS / Android 실시간 화면 시뮬레이션" };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#060612", color: "#e0e0f0", fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", flexShrink: 0, background: "#08081a", borderRight: "1px solid #1a1a30", display: "flex", flexDirection: "column", padding: "20px 0" }}>
        <div style={{ padding: "0 16px 20px", borderBottom: "1px solid #1a1a30", marginBottom: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#e0e0f0", letterSpacing: "-0.01em" }}>h's Storybook</div>
          <div style={{ fontSize: "10px", color: "#4a4a7a", marginTop: "3px" }}>YDS 2.0 Design System</div>
        </div>
        <div style={{ fontSize: "9px", color: "#3a3a5a", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0 16px", marginBottom: "6px", fontWeight: 600 }}>Tokens</div>
        {NAV.slice(0, 3).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#1a1a30" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #fa0050" : "2px solid transparent", color: active === n.id ? "#e0e0f0" : "#6060a0", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ fontSize: "9px", color: "#3a3a5a", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 16px 6px", fontWeight: 600 }}>Components</div>
        {NAV.slice(3, 5).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: active === n.id ? "#1a1a30" : "transparent", border: "none", borderLeft: active === n.id ? "2px solid #fa0050" : "2px solid transparent", color: active === n.id ? "#e0e0f0" : "#6060a0", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ fontSize: "9px", color: "#3a3a5a", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 16px 6px", fontWeight: 600 }}>Simulate</div>
        {NAV.slice(5).map(n => (
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
