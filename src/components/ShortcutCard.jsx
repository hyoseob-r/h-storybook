import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";
import { SingleBadge, OffersBadge } from "./Badge.jsx";

// ─── YDS 2.0 ShortcutCard Component (리뉴얼-2026) ──────────────────────────
// Figma: 리뉴얼-2026 > Shortcut Card
// 홈 상단 숏컷 — 아이콘 + 라벨, 빠른 진입점

const SHORTCUT_PRESETS = [
  { id: "reorder",    icon: "receipt",  label: "재주문",    color: "#FA0050" },
  { id: "coupon",     icon: "coupon",   label: "쿠폰함",    color: "#0C74E4" },
  { id: "timedeal",   icon: "benefit",  label: "타임딜",    color: "#FF8800" },
  { id: "rank",       icon: "task",     label: "할인랭킹",   color: "#7B61FF" },
  { id: "new",        icon: "gift",     label: "신규 혜택",  color: "#00B886" },
  { id: "yogipass",   icon: "heart",    label: "요기패스X",  color: "#FA0050" },
  { id: "mart",       icon: "house",    label: "요마트",    color: "#0C74E4" },
  { id: "franchise",  icon: "information", label: "프랜차이즈", color: "#333" },
];

export function ShortcutCard({
  icon = "receipt",
  label = "재주문",
  color = "#FA0050",
  badge = null,
  size = "medium",
  onClick,
}) {
  const isSmall = size === "small";
  const iconBoxSize = isSmall ? 40 : 48;
  const iconSize = isSmall ? 20 : 24;
  const fontSize = isSmall ? 11 : 12;

  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      background: "none", border: "none", cursor: "pointer", padding: 0,
      width: isSmall ? 56 : 64,
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      <div style={{
        width: iconBoxSize, height: iconBoxSize,
        borderRadius: metaTokens.radius.meta_r4,
        background: `${color}10`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <YdsIcon name={icon} size={iconSize} color={color} />
        {badge && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            minWidth: 16, height: 16, borderRadius: 360,
            background: "#FA0050", color: "#fff",
            fontSize: 9, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 4px",
          }}>{badge}</span>
        )}
      </div>
      <span style={{
        fontSize, fontWeight: 400, color: "#333",
        textAlign: "center", lineHeight: "15px",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        maxWidth: isSmall ? 56 : 64,
      }}>{label}</span>
    </button>
  );
}

// ── ShortcutRow ─────────────────────────────────────────────────────────────
export function ShortcutRow({ items = SHORTCUT_PRESETS, size = "medium" }) {
  return (
    <div style={{
      display: "flex", gap: size === "small" ? 8 : 12,
      overflowX: "auto", scrollbarWidth: "none",
      padding: "4px 0",
    }}>
      {items.map((item, i) => (
        <ShortcutCard key={item.id || i} {...item} size={size} />
      ))}
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function ShortcutCardSection() {
  const [size, setSize] = useState("medium");

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Size:</span>
        {["small", "medium"].map(s => (
          <button key={s} onClick={() => setSize(s)}
            style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${size === s ? "#0C74E4" : "#e0e0e0"}`,
              background: size === s ? "#0C74E4" : "#fff", color: size === s ? "#fff" : "#666",
              fontSize: 11, cursor: "pointer" }}>{s}</button>
        ))}
      </div>

      {/* Default row */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>ShortcutRow (8 items)</div>
        <div style={{ width: 375, background: "#fff", borderRadius: 12, padding: 16 }}>
          <ShortcutRow items={SHORTCUT_PRESETS} size={size} />
        </div>
      </div>

      {/* With badges */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>With badges</div>
        <div style={{ width: 375, background: "#fff", borderRadius: 12, padding: 16 }}>
          <ShortcutRow items={[
            { icon: "coupon", label: "쿠폰함", color: "#0C74E4", badge: "3" },
            { icon: "receipt", label: "재주문", color: "#FA0050", badge: "N" },
            { icon: "benefit", label: "타임딜", color: "#FF8800" },
            { icon: "gift", label: "신규 혜택", color: "#00B886" },
            { icon: "heart", label: "요기패스X", color: "#FA0050" },
          ]} size={size} />
        </div>
      </div>

      {/* Individual card */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>Individual Cards</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {SHORTCUT_PRESETS.map(p => (
            <ShortcutCard key={p.id} {...p} size={size} />
          ))}
        </div>
      </div>
    </div>
  );
}
