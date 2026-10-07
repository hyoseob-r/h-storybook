import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 BottomNav Component (리뉴얼-2026) ──────────────────────────────
// Figma: 리뉴얼-2026 > NaviItemNew / NavNew / BottomNavNew
// Pill-shaped glass nav bar with 5 tabs

const NAV_ITEMS = [
  { id: "home",     label: "홈",        icon: "house",    filledIcon: "house_filled" },
  { id: "benefits", label: "할인/혜택", icon: "benefit",  filledIcon: "benefit_filled" },
  { id: "orders",   label: "주문내역",  icon: "receipt",  filledIcon: "receipt_filled" },
  { id: "likes",    label: "찜",        icon: "heart",    filledIcon: "heart_filled" },
  { id: "my",       label: "마이요기요", icon: "mymenu",   filledIcon: "mymenu_filled" },
];

// YDS System Icons 매핑 — 인라인 SVG 사용 금지, 반드시 YdsIcon 사용
// 바텀네비 전용 28x28 아이콘 — nav_ prefix
const ICON_MAP = {
  house: "nav_house",
  house_filled: "nav_house_filled",
  benefit: "nav_benefit",
  benefit_filled: "nav_benefit_filled",
  receipt: "nav_receipt",
  receipt_filled: "nav_receipt_filled",
  heart: "nav_heart",
  heart_filled: "nav_heart_filled",
  mymenu: "nav_mymenu",
  mymenu_filled: "nav_mymenu_filled",
};

// ── NaviItemNew ──────────────────────────────────────────────────────────────
export function NaviItemNew({ icon, filledIcon, label, selected = false, onClick }) {
  const iconName = selected ? ICON_MAP[filledIcon] || filledIcon : ICON_MAP[icon] || icon;
  return (
    <button onClick={onClick} style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height: 54, borderRadius: 40, border: "none", cursor: "pointer", position: "relative",
      background: selected ? "rgba(0,0,0,0.04)" : "transparent",
    }}>
      <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <YdsIcon name={iconName} size={28} color="#333" />
      </div>
      <span style={{ fontSize: 10, fontWeight: 400, color: "#000", lineHeight: "14px", fontFamily: "Pretendard, Roboto, sans-serif" }}>
        {label}
      </span>
    </button>
  );
}

// ── NavNew (pill nav bar) ────────────────────────────────────────────────────
export function NavNew({ activeTab = "home", onTabChange }) {
  return (
    <div style={{
      display: "flex", gap: 3, height: 62, padding: 4, borderRadius: 40, position: "relative",
      background: "rgba(255,255,255,0.94)",
      boxShadow: "0 1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08), inset 0.5px 0.5px 0 rgba(255,255,255,0.7), inset -0.5px -0.5px 2px rgba(255,255,255,0.2)",
    }}>
      {NAV_ITEMS.map(item => (
        <NaviItemNew key={item.id} {...item} selected={activeTab === item.id}
          onClick={() => onTabChange?.(item.id)} />
      ))}
    </div>
  );
}

// ── Section (Storybook 표시용) ───────────────────────────────────────────────
export default function BottomNavSection() {
  const [tab, setTab] = useState("home");

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Preview */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Preview</div>
      <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "40px 0 0", width: "100%", margin: "0 auto", overflow: "hidden" }}>
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 13 }}>
          (화면 콘텐츠 영역)
        </div>
        <div style={{ padding: "16px 20px 20px" }}>
          <NavNew activeTab={tab} onTabChange={setTab} />
        </div>
      </div>
    </div>
  );
}
