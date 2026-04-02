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
    { title: "Light / Extended Palette", tokens: Object.values(colors.light), textRule: true },
    { title: "Gray Scale", tokens: Object.values(colors.gray) },
    { title: "Background", tokens: Object.values(colors.background) },
    { title: "Variant", tokens: Object.values(colors.variant) },
  ];
  const overlays = Object.values(states.overlay);
  // Light palette: _100 토큰은 base 토큰과 쌍으로 표시
  const lightPairs = [
    ["primary_a", "primary_a_100"],
    ["primary_b", "primary_b_100"],
    ["accent",    "accent_100"],
    ["ygy_green", "ygy_green_100"],
    ["ygy_orange","ygy_orange_100"],
  ];
  // text color rule: base → white text, _100 → base color text
  const lightTextColor = { primary_a: "#fff", primary_b: "#fff", accent: "#fff", ygy_green: "#fff", ygy_orange: "#fff", primary_a_100: "#fa0050", primary_b_100: "#28343c", accent_100: "#0c80e4", ygy_green_100: "#05947f", ygy_orange_100: "#f04600", gray_c: "#fff" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {groups.map(g => (
        <div key={g.title}>
          <div style={{ fontSize: "11px", color: "#5a5a8a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px", fontWeight: 600 }}>{g.title}</div>
          {g.textRule ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* rule badge */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                <div style={{ fontSize: "10px", color: "#5a5a8a", background: "#0c0c1e", border: "1px solid #1a1a30", padding: "2px 8px", borderRadius: "4px" }}>규칙.1 숫자 없음 → TextColor #FFF or #333</div>
                <div style={{ fontSize: "10px", color: "#5a5a8a", background: "#0c0c1e", border: "1px solid #1a1a30", padding: "2px 8px", borderRadius: "4px" }}>규칙.2 _100 suffix → TextColor = base 색</div>
              </div>
              {lightPairs.map(([base, light]) => {
                const bt = colors.light[base];
                const lt = colors.light[light];
                return (
                  <div key={base} style={{ display: "flex", gap: "10px", alignItems: "stretch" }}>
                    {/* base */}
                    <div style={{ flex: 1, background: bt.value, borderRadius: "10px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "10px", color: lightTextColor[base], opacity: 0.7 }}>{bt.name}</span>
                      <span style={{ fontFamily: "monospace", fontSize: "11px", color: lightTextColor[base], fontWeight: 600 }}>버튼</span>
                      <span style={{ fontFamily: "monospace", fontSize: "9px", color: lightTextColor[base], opacity: 0.6 }}>{bt.value.toUpperCase()}</span>
                    </div>
                    {/* arrow */}
                    <div style={{ display: "flex", alignItems: "center", color: "#3a3a5a", fontSize: "12px" }}>→</div>
                    {/* _100 */}
                    <div style={{ flex: 1, background: lt.value, borderRadius: "10px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "4px", border: "1px solid #1a1a30" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "10px", color: lightTextColor[light], opacity: 0.7 }}>{lt.name}</span>
                      <span style={{ fontFamily: "monospace", fontSize: "11px", color: lightTextColor[light], fontWeight: 600 }}>버튼</span>
                      <span style={{ fontFamily: "monospace", fontSize: "9px", color: lightTextColor[light], opacity: 0.6 }}>{lt.value.toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
              {/* gray_c 단독 */}
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "calc(50% - 16px)", background: colors.light.gray_c.value, borderRadius: "10px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#fff", opacity: 0.7 }}>gray_c</span>
                  <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#fff", fontWeight: 600 }}>버튼</span>
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#fff", opacity: 0.6 }}>#000000</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "12px" }}>
              {g.tokens.map(t => <ColorSwatch key={t.name} name={t.name} value={t.value} />)}
            </div>
          )}
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

function PhoneFrame({ platform, device, children, canvasMode }) {
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
              {/* Screen content */}
              <div style={{ flex: 1, background: "#fff", position: "relative", overflow: canvasMode ? "hidden" : "auto" }}>
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
  const [platform,  setPlatform]  = useState("ios");
  const [deviceIdx, setDeviceIdx] = useState(2); // iPhone 13
  const [items,     setItems]     = useState([]);
  const [selected,  setSelected]  = useState(null);
  const dragRef  = useRef(null);
  const scaleRef = useRef(1);

  const device = DEVICES[platform][deviceIdx];
  const scale  = MAX_FRAME_H / device.h;
  scaleRef.current = scale;

  // ── drag (window-level) ──────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current) return;
      const { id, startMX, startMY, startX, startY } = dragRef.current;
      const dx = (e.clientX - startMX) / scaleRef.current;
      const dy = (e.clientY - startMY) / scaleRef.current;
      setItems(prev => prev.map(i => i.id === id
        ? { ...i, x: Math.round(Math.max(0, startX + dx)), y: Math.round(Math.max(0, startY + dy)) }
        : i));
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const startDrag = (e, item) => {
    e.preventDefault(); e.stopPropagation();
    if (item.isMaster) { setSelected(item.id); return; }
    dragRef.current = { id: item.id, startMX: e.clientX, startMY: e.clientY, startX: item.x, startY: item.y };
    setSelected(item.id);
  };

  // ── item helpers ─────────────────────────────────────────────────────────────
  const addItem = (type) => {
    const id = Date.now();
    const base = type === "labelButton"
      ? { type:"labelButton", shape:"filled", colorStyle:"primary_v2", size:"medium", config:"labelOnly", iconPos:"left", labelText:"버튼", isMaster:false }
      : { type:"text",        style:"Body/body_6",  content:"텍스트",   color:"#333333", isMaster:false };
    setItems(prev => [...prev, { id, x: 16, y: Math.min(16 + prev.length * 64, 480), ...base }]);
    setSelected(id);
  };

  const updateItem = (id, updates) => setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  const removeItem = (id) => { setItems(prev => prev.filter(i => i.id !== id)); if (selected === id) setSelected(null); };
  const duplicateItem = (item) => {
    const id = Date.now();
    setItems(prev => [...prev, { ...item, id, x: item.x + 24, y: item.y + 24, isMaster: false }]);
    setSelected(id);
  };
  const sel = items.find(i => i.id === selected);

  // shapeStyle 변경 시 colorStyle 자동 보정
  const changeShape = (s) => {
    const allowed = ALLOWED_COLORS[s];
    const newColor = allowed.includes(sel.colorStyle) ? sel.colorStyle : allowed[0];
    updateItem(sel.id, { shape: s, colorStyle: newColor });
  };

  // ── render component in canvas ───────────────────────────────────────────────
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
      const ico = <span style={{ fontSize:`${fs+2}px`, lineHeight:1 }}>✎</span>;
      return (
        <div style={{ height:`${h}px`, padding:`0 ${ph}px`, background:bg, border:bdr, borderRadius:`${r}px`, color:fg, fontSize:`${fs}px`, fontWeight:700, display:"inline-flex", alignItems:"center", gap:"5px", fontFamily: platform==="ios"?"system-ui":"Roboto,sans-serif", userSelect:"none", whiteSpace:"nowrap" }}>
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
  };

  // ── property panel ───────────────────────────────────────────────────────────
  const pCtl = (label, opts, val, key, allowedSet) => {
    const isLocked = allowedSet && allowedSet.length === 0;
    return (
    <div style={{ marginBottom:"10px" }}>
      <div style={{ fontSize:"10px", color:"#4a4a7a", marginBottom:"4px" }}>{label}</div>
      <div style={{ display:"flex", gap:"3px", flexWrap:"wrap" }}>
        {opts.map(o => {
          const dis = !isLocked && allowedSet && !allowedSet.includes(o);
          return (
            <button key={o} disabled={dis || isLocked} onClick={() => !dis && !isLocked && updateItem(sel.id, { [key]: o })}
              style={{ padding:"3px 7px", borderRadius:"4px", background: val===o?"#1e1e3a":"transparent", border: val===o?"1px solid #3a3a6a":"1px solid #1a1a30", color: isLocked?"#333350": dis?"#252540": val===o?"#c0c0f0":"#5a5a8a", fontSize:"10px", cursor:(dis||isLocked)?"default":"pointer", textDecoration:dis?"line-through":"none" }}>
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
      <div style={{ padding:"28px 16px", textAlign:"center", color:"#2a2a4a", fontSize:"11px", lineHeight:1.8 }}>
        컴포넌트를<br/>선택하세요
      </div>
    );
    const locked = sel.isMaster;
    return (
      <div style={{ padding:"14px", display:"flex", flexDirection:"column" }}>

        {/* Header: type name + master toggle */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <div style={{ fontSize:"10px", color: locked?"#ccaa00":"#5a5a8a", letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:600 }}>
            {locked && "🔒 "}{sel.type === "labelButton" ? "LabelButton" : "Text"}
          </div>
          <button onClick={() => updateItem(sel.id, { isMaster: !locked })}
            style={{ padding:"2px 6px", borderRadius:"4px", background: locked?"#2a2200":"transparent", border: locked?"1px solid #665500":"1px solid #2a2a4a", color: locked?"#ccaa00":"#4a4a6a", fontSize:"9px", cursor:"pointer", letterSpacing:"0.05em" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=locked?"#998800":"#4a4a8a"; e.currentTarget.style.color=locked?"#ffdd00":"#8080c0"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=locked?"#665500":"#2a2a4a"; e.currentTarget.style.color=locked?"#ccaa00":"#4a4a6a"; }}>
            {locked ? "Master 해제" : "Master 지정"}
          </button>
        </div>

        {/* Master lock notice */}
        {locked && (
          <div style={{ marginBottom:"10px", padding:"7px 9px", background:"#1a1500", border:"1px solid #443300", borderRadius:"6px", fontSize:"10px", color:"#998800", lineHeight:1.6 }}>
            편집이 잠겨있습니다.<br/>복제 후 수정하세요.
          </div>
        )}

        {sel.type === "labelButton" && <>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#4a4a7a", marginBottom:"4px" }}>labelText</div>
            <input value={sel.labelText} onChange={e => !locked && updateItem(sel.id, { labelText: e.target.value })}
              readOnly={locked}
              style={{ width:"100%", background:"#08081a", border:"1px solid #2a2a4a", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#e0e0f0", fontSize:"11px", outline:"none", boxSizing:"border-box", cursor: locked?"default":"text" }} />
          </div>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#4a4a7a", marginBottom:"4px" }}>shapeStyle</div>
            <div style={{ display:"flex", gap:"3px" }}>
              {["filled","outlined","text"].map(o => (
                <button key={o} onClick={() => !locked && changeShape(o)} disabled={locked}
                  style={{ padding:"3px 7px", borderRadius:"4px", background: sel.shape===o?"#1e1e3a":"transparent", border: sel.shape===o?"1px solid #3a3a6a":"1px solid #1a1a30", color: locked?"#333350": sel.shape===o?"#c0c0f0":"#5a5a8a", fontSize:"10px", cursor: locked?"default":"pointer" }}>
                  {o}
                </button>
              ))}
            </div>
          </div>
          {pCtl("colorStyle", ["primary_v2","gray_v2","gray250_v2"], sel.colorStyle, "colorStyle", locked ? [] : ALLOWED_COLORS[sel.shape])}
          {pCtl("size",   ["medium","small"],            sel.size,   "size",   locked ? [] : undefined)}
          {pCtl("config", ["labelOnly","labelWithIcon"], sel.config, "config", locked ? [] : undefined)}
          {sel.config === "labelWithIcon" && pCtl("iconPos", ["left","right"], sel.iconPos, "iconPos", locked ? [] : undefined)}
        </>}

        {sel.type === "text" && <>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#4a4a7a", marginBottom:"4px" }}>content</div>
            <textarea value={sel.content} onChange={e => !locked && updateItem(sel.id, { content: e.target.value })}
              readOnly={locked}
              style={{ width:"100%", background:"#08081a", border:"1px solid #2a2a4a", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#e0e0f0", fontSize:"11px", outline:"none", resize:"vertical", minHeight:"52px", boxSizing:"border-box", cursor: locked?"default":"text" }} />
          </div>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#4a4a7a", marginBottom:"4px" }}>typography</div>
            <select value={sel.style} onChange={e => !locked && updateItem(sel.id, { style: e.target.value })} disabled={locked}
              style={{ width:"100%", background:"#08081a", border:"1px solid #2a2a4a", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#c0c0f0", fontSize:"10px", outline:"none" }}>
              {typography.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#4a4a7a", marginBottom:"4px" }}>color</div>
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              <input type="color" value={sel.color} onChange={e => !locked && updateItem(sel.id, { color: e.target.value })} disabled={locked}
                style={{ width:"28px", height:"28px", border:"none", background:"none", cursor: locked?"default":"pointer", padding:0, opacity: locked?0.3:1 }} />
              <input value={sel.color} onChange={e => !locked && updateItem(sel.id, { color: e.target.value })} readOnly={locked}
                style={{ flex:1, background:"#08081a", border:"1px solid #2a2a4a", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#e0e0f0", fontSize:"11px", outline:"none" }} />
            </div>
          </div>
        </>}

        {/* Position */}
        <div style={{ paddingTop:"10px", borderTop:"1px solid #1a1a30", display:"flex", gap:"8px", marginBottom:"10px" }}>
          {["x","y"].map(axis => (
            <div key={axis} style={{ flex:1 }}>
              <div style={{ fontSize:"9px", color:"#3a3a5a", marginBottom:"3px", textTransform:"uppercase" }}>{axis} dp</div>
              <input type="number" value={sel[axis]} onChange={e => !locked && updateItem(sel.id, { [axis]: Number(e.target.value) })} readOnly={locked}
                style={{ width:"100%", background:"#08081a", border:"1px solid #2a2a4a", borderRadius:"5px", padding:"4px 6px", color: locked?"#555570":"#e0e0f0", fontSize:"11px", outline:"none", boxSizing:"border-box", cursor: locked?"default":"text" }} />
            </div>
          ))}
        </div>

        {/* Duplicate + Delete */}
        <div style={{ display:"flex", gap:"6px" }}>
          <button onClick={() => duplicateItem(sel)}
            style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border:"1px solid #1a3a2a", color:"#2a6a4a", fontSize:"10px", cursor:"pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background="#081a10"; e.currentTarget.style.color="#60cc90"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#2a6a4a"; }}>
            복제
          </button>
          <button onClick={() => !locked && removeItem(sel.id)} disabled={locked}
            style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border: locked?"1px solid #1a1a2a":"1px solid #3a1a1a", color: locked?"#2a2a3a":"#6a2a2a", fontSize:"10px", cursor: locked?"default":"pointer" }}
            onMouseEnter={e => { if (!locked) { e.currentTarget.style.background="#1a0808"; e.currentTarget.style.color="#ff6060"; }}}
            onMouseLeave={e => { if (!locked) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#6a2a2a"; }}}>
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

        <div style={{ background:"#0c0c1e", border:"1px solid #1a1a30", borderRadius:"10px", padding:"12px" }}>
          <div style={{ fontSize:"10px", color:"#5a5a8a", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px", fontWeight:600 }}>Platform</div>
          <div style={{ display:"flex", gap:"5px", marginBottom:"10px" }}>
            {["ios","android"].map(p => (
              <button key={p} onClick={() => { setPlatform(p); setDeviceIdx(0); }}
                style={{ flex:1, padding:"6px", borderRadius:"6px", background: platform===p?"#1e1e3a":"transparent", border: platform===p?"1px solid #3a3a6a":"1px solid #1a1a30", color: platform===p?"#c0c0f0":"#5a5a8a", fontSize:"11px", cursor:"pointer", fontWeight: platform===p?700:400, textTransform:"uppercase" }}>
                {p === "ios" ? "iOS" : "Android"}
              </button>
            ))}
          </div>
          <select value={deviceIdx} onChange={e => setDeviceIdx(Number(e.target.value))}
            style={{ width:"100%", background:"#08081a", border:"1px solid #2a2a4a", borderRadius:"6px", padding:"5px 8px", color:"#c0c0f0", fontSize:"10px", outline:"none" }}>
            {DEVICES[platform].map((d, i) => <option key={i} value={i}>{d.name} ({d.w}×{d.h})</option>)}
          </select>
        </div>

        {/* Palette */}
        <div style={{ background:"#0c0c1e", border:"1px solid #1a1a30", borderRadius:"10px", padding:"12px" }}>
          <div style={{ fontSize:"10px", color:"#5a5a8a", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px", fontWeight:600 }}>Add</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
            {[{ type:"labelButton", label:"⬚  LabelButton" }, { type:"text", label:"T   Text" }].map(c => (
              <button key={c.type} onClick={() => addItem(c.type)}
                style={{ padding:"8px 10px", borderRadius:"7px", background:"transparent", border:"1px solid #1a1a30", color:"#7070a0", fontSize:"11px", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#3a3a6a"; e.currentTarget.style.color="#c0c0f0"; e.currentTarget.style.background="#0e0e22"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#1a1a30"; e.currentTarget.style.color="#7070a0"; e.currentTarget.style.background="transparent"; }}>
                + {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layers */}
        <div style={{ background:"#0c0c1e", border:"1px solid #1a1a30", borderRadius:"10px", padding:"12px", flex:1 }}>
          <div style={{ fontSize:"10px", color:"#5a5a8a", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px", fontWeight:600 }}>Layers</div>
          {items.length === 0
            ? <div style={{ fontSize:"10px", color:"#2a2a4a", textAlign:"center", padding:"12px 0" }}>비어있음</div>
            : <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
                {[...items].reverse().map(item => (
                  <div key={item.id} onClick={() => setSelected(item.id)}
                    style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 8px", borderRadius:"5px", background: selected===item.id?"#1a1a30":"transparent", border: selected===item.id ? (item.isMaster?"1px solid #665500":"1px solid #3a3a6a") : "1px solid transparent", cursor:"pointer" }}>
                    <span style={{ fontSize:"10px", color: item.isMaster?"#ccaa00": selected===item.id?"#c0c0f0":"#6060a0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>
                      {item.isMaster ? "🔒 " : ""}{item.type==="labelButton"?"⬚":"T"} {item.type==="labelButton"?item.labelText:item.content}
                    </span>
                    <button onClick={e => { e.stopPropagation(); if (!item.isMaster) removeItem(item.id); }}
                      style={{ background:"none", border:"none", color: item.isMaster?"#333330":"#3a3a5a", cursor: item.isMaster?"default":"pointer", fontSize:"12px", padding:"0 2px", flexShrink:0 }}>
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
        <PhoneFrame platform={platform} device={device} canvasMode>
          <div style={{ position:"absolute", inset:0 }} onClick={() => setSelected(null)}>
            {items.map(item => (
              <div key={item.id}
                style={{ position:"absolute", left:`${item.x}px`, top:`${item.y}px`, cursor: item.isMaster?"pointer":"grab", outline: selected===item.id ? (item.isMaster?"1.5px dashed #ccaa0088":"1.5px dashed #fa005088") : "none", outlineOffset:"4px", borderRadius:"4px" }}
                onMouseDown={e => startDrag(e, item)}>
                {renderComp(item)}
                {item.isMaster && (
                  <div style={{ position:"absolute", top:"-7px", right:"-7px", background:"#ccaa00", borderRadius:"50%", width:"13px", height:"13px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"7px", fontWeight:700, color:"#000", pointerEvents:"none", lineHeight:1 }}>
                    M
                  </div>
                )}
              </div>
            ))}
            {items.length === 0 && (
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#bbb", fontSize:"12px", fontFamily:"system-ui", pointerEvents:"none", flexDirection:"column", gap:"6px" }}>
                <span style={{ fontSize:"24px", opacity:0.3 }}>+</span>
                <span style={{ opacity:0.4 }}>Add에서 컴포넌트 추가</span>
              </div>
            )}
          </div>
        </PhoneFrame>
      </div>

      {/* Right: Properties */}
      <div style={{ width:"196px", flexShrink:0, background:"#0c0c1e", border:"1px solid #1a1a30", borderRadius:"10px", overflow:"hidden" }}>
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
