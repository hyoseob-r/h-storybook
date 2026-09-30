import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 VerticalLauncher (리뉴얼-2026) ────────────────────────────────
// Figma: 리뉴얼-2026 > vertical_launcher (node 4917:373717)
// pill 형태 버튼 — 44px 아이콘 + 14b 라벨, shadow level_1, rounded 16
// 뱃지 지원 (할인 정보)

const SHADOW = "0px 0px 2px rgba(25,48,64,0.08), 0px 1px 8px rgba(25,48,64,0.1)";

const LAUNCHER_PRESETS = [
  { id: "yogiplus",  icon: "point",        label: "요기더+적립", color: "#7B61FF" },
  { id: "takeout",   icon: "receipt",      label: "포장",       color: "#FF8800" },
  { id: "gift",      icon: "gift",         label: "선물하기",    color: "#FA0050" },
  { id: "rank",      icon: "ic_bpr",       label: "할인랭킹",    color: "#0C74E4" },
  { id: "robot",     icon: "house",        label: "로봇배달",    color: "#00B886" },
  { id: "subsidy",   icon: "benefit",      label: "고유가지원금", color: "#168046" },
];

export function VLauncherItem({
  icon = "receipt",
  label = "포장",
  badge = null,
  onClick,
}) {
  return (
    <div style={{ position: "relative", height: 44, flexShrink: 0 }}>
      <button onClick={onClick} style={{
        display: "flex", alignItems: "center",
        height: 44, background: "#fff", border: "none",
        borderRadius: 16, boxShadow: SHADOW, overflow: "hidden",
        cursor: "pointer", paddingRight: 12,
        fontFamily: "Pretendard, Roboto, sans-serif",
      }}>
        <div style={{
          width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, overflow: "hidden",
        }}>
          <YdsIcon name={icon} size={25} color="#333" />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#333", whiteSpace: "nowrap" }}>
          {label}
        </span>
      </button>
      {badge && (
        <div style={{
          position: "absolute", top: -7, left: 0,
          maxWidth: 70, boxShadow: SHADOW,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "#fff", border: "0.5px solid #e5e5e5",
            borderRadius: 9, padding: "1px 4px",
            fontSize: 10, fontWeight: 700, color: "#FA0050",
            lineHeight: "14px", whiteSpace: "nowrap",
          }}>{badge}</span>
        </div>
      )}
    </div>
  );
}

export function VerticalLauncherRow({ items = LAUNCHER_PRESETS }) {
  return (
    <div style={{
      display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none",
      padding: "8px 16px 16px",
    }}>
      {items.map((item, i) => (
        <VLauncherItem key={item.id || i} icon={item.icon} label={item.label} badge={item.badge} />
      ))}
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function VerticalLauncherSection() {
  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>VerticalLauncher Row</div>
        <div style={{ width: 390, background: "#f6f6f6", borderRadius: 12, overflow: "hidden" }}>
          <VerticalLauncherRow items={[
            { id: "yogiplus", icon: "point", label: "요기더+적립" },
            { id: "takeout", icon: "receipt", label: "포장", badge: "7% 할인" },
            { id: "gift", icon: "gift", label: "선물하기" },
            { id: "rank", icon: "ic_bpr", label: "할인랭킹" },
            { id: "robot", icon: "house", label: "로봇배달" },
            { id: "subsidy", icon: "benefit", label: "고유가지원금" },
            { id: "landers", icon: "heart", label: "랜더스" },
            { id: "kiwoom", icon: "task", label: "키움" },
          ]} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>Individual Items</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "8px 0" }}>
          <VLauncherItem icon="point" label="요기더+적립" />
          <VLauncherItem icon="receipt" label="포장" badge="7% 할인" />
          <VLauncherItem icon="gift" label="선물하기" />
          <VLauncherItem icon="ic_bpr" label="할인랭킹" />
        </div>
      </div>
    </div>
  );
}
