import { useState } from "react";
import { metaTokens } from "../tokens";

// ─── YDS 2.0 StickyCTA Component ────────────────────────────────────────────
// Figma: 📌 Customer-Component > StickyCTA
// Anatomy: Bar + Title + Body + Caption(opt) + Gage(opt) + ButtonDocked(NumericStepper + PriceButton)

// ── PriceButton ──────────────────────────────────────────────────────────────
export function PriceButton({
  label = "버튼",
  strikePrice = null,
  countBadge = null,
  disabled = false,
  onClick,
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
      height: 48, borderRadius: metaTokens.radius.meta_r3, border: "none",
      background: disabled ? "#ccc" : "#FA0050", color: "#fff", cursor: disabled ? "default" : "pointer",
      padding: "0 16px", fontFamily: "Pretendard, Roboto, sans-serif", position: "relative",
    }}>
      {strikePrice && (
        <span style={{ fontSize: 12, textDecoration: "line-through", opacity: 0.8, marginRight: 2 }}>{strikePrice}원</span>
      )}
      <span style={{ fontSize: 16, fontWeight: 700 }}>{label}</span>
      {countBadge != null && (
        <span style={{
          minWidth: 20, height: 20, borderRadius: 360, background: "#fff", color: "#FA0050",
          fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
          padding: "0 4px", border: "1px solid #FA0050", marginLeft: 4,
        }}>{countBadge}</span>
      )}
    </button>
  );
}

// ── NumericStepperInline (SticyCTA용 내장 스테퍼) ─────────────────────────────
function NumericStepperInline({ value = 1, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 104, height: 48, borderRadius: metaTokens.radius.meta_r3,
      border: "1px solid #E5E5E5", background: "#fff",
    }}>
      <button onClick={() => value > 1 && onChange?.(value - 1)}
        style={{ flex: 1, border: "none", background: "transparent", cursor: "pointer", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={value <= 1 ? "#ccc" : "#333"} strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      <span style={{ width: 32, textAlign: "center", fontSize: 16, fontWeight: 700, color: "#333", fontFamily: "Pretendard, Roboto, sans-serif" }}>{value}</span>
      <button onClick={() => onChange?.(value + 1)}
        style={{ flex: 1, border: "none", background: "transparent", cursor: "pointer", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#333" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

// ── StickyCTA ────────────────────────────────────────────────────────────────
export function StickyCTA({
  type = "default",
  title = null,
  titleIcon = null,
  body = null,
  caption = null,
  showGage = false,
  gagePercent = 0,
  showNumericStepper = false,
  buttonLabel = "Price 버튼",
  strikePrice = null,
  countBadge = null,
  quantity = 1,
  onQuantityChange,
  onButtonClick,
}) {
  return (
    <div style={{
      width: 360, borderRadius: `${metaTokens.radius.meta_r5}px ${metaTokens.radius.meta_r5}px 0 0`,
      overflow: "hidden",
      boxShadow: "0 -1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {/* Bar (handle) */}
      <div style={{ height: 16, background: "#fff", borderRadius: `${metaTokens.radius.meta_r5}px ${metaTokens.radius.meta_r5}px 0 0` }} />

      {/* Message area */}
      {(title || body || caption) && (
        <div style={{ background: "#fff", padding: "0 16px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {title && (
            <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "center" }}>
              {titleIcon && <span style={{ fontSize: 20 }}>{titleIcon}</span>}
              <span style={{ fontSize: 16, fontWeight: 700, color: "#333", textAlign: "center" }}>{title}</span>
            </div>
          )}
          {body && (
            <div style={{ fontSize: 14, fontWeight: 700, color: "#333", textAlign: "center", width: "100%" }}>{body}</div>
          )}
          {caption && (
            <div style={{ fontSize: 10, color: "#999", textAlign: "center", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{caption}</div>
          )}
        </div>
      )}

      {/* Gage */}
      {showGage && (
        <div style={{ background: "#fff", padding: "0 16px 8px" }}>
          <div style={{ height: 4, background: "#f0f0f0", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, gagePercent)}%`, background: "#FA0050", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      {/* ButtonDocked */}
      <div style={{ background: "#fff", padding: "0 16px 16px", display: "flex", gap: 8, alignItems: "center" }}>
        {showNumericStepper && <NumericStepperInline value={quantity} onChange={onQuantityChange} />}
        <PriceButton label={buttonLabel} strikePrice={strikePrice} countBadge={countBadge} onClick={onButtonClick} />
      </div>
    </div>
  );
}

// ── Section (Storybook 표시용) ───────────────────────────────────────────────
export default function StickyCTASection() {
  const [qty, setQty] = useState(1);
  const [type, setType] = useState("deal");

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Type:</span>
        {["default", "deal"].map(t => (
          <button key={t} onClick={() => setType(t)}
            style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${type === t ? "#0C74E4" : "#e0e0e0"}`,
              background: type === t ? "#0C74E4" : "#fff", color: type === t ? "#fff" : "#666",
              fontSize: 11, cursor: "pointer" }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {type === "default" && (
          <div>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>default — NumericStepper + PriceButton</div>
            <StickyCTA
              showNumericStepper
              buttonLabel="23,900원 담기"
              quantity={qty}
              onQuantityChange={setQty}
            />
          </div>
        )}
        {type === "deal" && (
          <div>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>deal — Title + Body + Caption + PriceButton</div>
            <StickyCTA
              type="deal"
              titleIcon="🎁"
              title="Title Contextual Text"
              body="Body Contextual Text"
              caption="Caption Contextual Text"
              showNumericStepper
              buttonLabel="Price 버튼"
              quantity={qty}
              onQuantityChange={setQty}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>PriceButton variants</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ width: 200 }}><PriceButton label="23,900원 담기" /></div>
          <div style={{ width: 200 }}><PriceButton label="버튼" strikePrice="25,000" /></div>
          <div style={{ width: 200 }}><PriceButton label="버튼" countBadge={3} /></div>
          <div style={{ width: 200 }}><PriceButton label="품절" disabled /></div>
        </div>
      </div>
    </div>
  );
}
