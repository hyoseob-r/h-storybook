import { useState } from "react";
import { metaTokens } from "../tokens";

// ─── YDS 2.0 NumericStepper Component ────────────────────────────────────────
// Figma: 📌 Customer-Component > NumericStepper
// Types: compact (fab-like), default (inline stepper)
// Variants: size (small/medium), shapeStyle (elevated/outlined), readOnly, section (start/middle/end)

const STEPPER_SIZES = {
  small: { height: 36, iconSize: 20, fontSize: 14, width: 96, compactSize: 36, valueWidth: 32 },
  medium: { height: 48, iconSize: 24, fontSize: 16, width: 104, compactSize: 48, valueWidth: 32 },
};

function MinusIcon({ size = 24, color = "#333", disabled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14" stroke={disabled ? "#ccc" : color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ size = 24, color = "#333", disabled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={disabled ? "#ccc" : color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Default NumericStepper ───────────────────────────────────────────────────
export function NumericStepperDefault({
  value = 1,
  min = 1,
  max = 99,
  size = "small",
  shapeStyle = "elevated",
  readOnly = false,
  onChange,
}) {
  const s = STEPPER_SIZES[size];
  const atMin = value <= min;
  const atMax = value >= max;

  const containerStyle = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    height: s.height, width: s.width,
    borderRadius: metaTokens.radius.meta_r3,
    background: "#fff",
    ...(shapeStyle === "elevated"
      ? { boxShadow: "0 1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)" }
      : { border: "1px solid #E5E5E5" }),
    opacity: readOnly ? 0.5 : 1,
    pointerEvents: readOnly ? "none" : "auto",
    fontFamily: "Pretendard, Roboto, sans-serif",
  };

  return (
    <span style={containerStyle}>
      <button onClick={() => !atMin && onChange?.(value - 1)}
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", background: "transparent", cursor: atMin ? "default" : "pointer",
          height: "100%", borderRadius: `${metaTokens.radius.meta_r1}px` }}>
        <MinusIcon size={s.iconSize} disabled={atMin} />
      </button>
      <span style={{ width: s.valueWidth, textAlign: "center", fontSize: s.fontSize, fontWeight: 700, color: "#333" }}>
        {value}
      </span>
      <button onClick={() => !atMax && onChange?.(value + 1)}
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", background: "transparent", cursor: atMax ? "default" : "pointer",
          height: "100%", borderRadius: `${metaTokens.radius.meta_r1}px` }}>
        <PlusIcon size={s.iconSize} disabled={atMax} />
      </button>
    </span>
  );
}

// ── Compact NumericStepper ───────────────────────────────────────────────────
export function NumericStepperCompact({
  value = 1,
  size = "small",
  shapeStyle = "elevated",
  readOnly = false,
  expanded = false,
  onToggle,
  onChange,
}) {
  const s = STEPPER_SIZES[size];

  if (!expanded) {
    return (
      <button onClick={() => !readOnly && onToggle?.()}
        style={{
          width: s.compactSize, height: s.compactSize,
          borderRadius: metaTokens.radius.meta_r3, background: "#fff",
          border: shapeStyle === "outlined" ? "1px solid #E5E5E5" : "none",
          boxShadow: shapeStyle === "elevated" ? "0 1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: readOnly ? "default" : "pointer", opacity: readOnly ? 0.5 : 1,
          fontFamily: "Pretendard, Roboto, sans-serif", fontSize: s.fontSize, fontWeight: 700, color: "#333",
        }}>
        {value}
      </button>
    );
  }

  return (
    <NumericStepperDefault value={value} size={size} shapeStyle={shapeStyle} readOnly={readOnly} onChange={onChange} />
  );
}

// ── Section (Storybook 표시용) ───────────────────────────────────────────────
export default function NumericStepperSection() {
  const [val1, setVal1] = useState(1);
  const [val2, setVal2] = useState(3);
  const [val3, setVal3] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [size, setSize] = useState("small");
  const [shape, setShape] = useState("elevated");

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Size:</span>
          {["small", "medium"].map(s => (
            <button key={s} onClick={() => setSize(s)}
              style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${size === s ? "#0C74E4" : "#e0e0e0"}`,
                background: size === s ? "#0C74E4" : "#fff", color: size === s ? "#fff" : "#666",
                fontSize: 11, cursor: "pointer" }}>{s}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Shape:</span>
          {["elevated", "outlined"].map(s => (
            <button key={s} onClick={() => setShape(s)}
              style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${shape === s ? "#0C74E4" : "#e0e0e0"}`,
                background: shape === s ? "#0C74E4" : "#fff", color: shape === s ? "#fff" : "#666",
                fontSize: 11, cursor: "pointer" }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Default type */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>default</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>start (min)</div>
            <NumericStepperDefault value={val1} min={1} max={99} size={size} shapeStyle={shape} onChange={setVal1} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>middle</div>
            <NumericStepperDefault value={val2} min={1} max={99} size={size} shapeStyle={shape} onChange={setVal2} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>readOnly</div>
            <NumericStepperDefault value={5} size={size} shapeStyle={shape} readOnly />
          </div>
        </div>
      </div>

      {/* Compact type */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>compact</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>tap to expand</div>
            <NumericStepperCompact value={val3} size={size} shapeStyle={shape}
              expanded={expanded} onToggle={() => setExpanded(!expanded)}
              onChange={(v) => { setVal3(v); }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>readOnly</div>
            <NumericStepperCompact value={2} size={size} shapeStyle={shape} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
