import { useState } from "react";
import { YdsIcon, ICON_NAMES } from "../icons.jsx";
import { Button } from "../components/Button.jsx";

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

// shapeStyle -> 허용된 colorStyle (YDS 2.0 스펙)
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
          <Button label="버튼" shapeStyle={shape} colorStyle={color} size={size}
            leftIcon={config === "labelWithIcon" && iconPos === "left" ? iconName : null}
            rightIcon={config === "labelWithIcon" && iconPos === "right" ? iconName : null} />
          <span style={{ fontSize: "9px", color: "#bbbbbb", letterSpacing: "0.1em" }}>ENABLED</span>
        </div>
        {/* disabled */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <Button label="버튼" shapeStyle={shape} colorStyle={color} size={size} disabled
            leftIcon={config === "labelWithIcon" && iconPos === "left" ? iconName : null}
            rightIcon={config === "labelWithIcon" && iconPos === "right" ? iconName : null} />
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

export default ButtonSection;
