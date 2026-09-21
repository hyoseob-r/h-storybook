import { useState } from "react";
import { metaTokens } from "../tokens";

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

// Simple icon SVGs (inline for self-containment)
const ICONS = {
  house: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M4.5 13L14 4.5L23.5 13V22.5C23.5 23.33 22.83 24 22 24H6C5.17 24 4.5 23.33 4.5 22.5V13Z" stroke="#333" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M10.5 24V16H17.5V24" stroke="#333" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  house_filled: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M4.5 13L14 4.5L23.5 13V22.5C23.5 23.33 22.83 24 22 24H6C5.17 24 4.5 23.33 4.5 22.5V13Z" fill="#333" stroke="#333" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M10.5 24V16H17.5V24" fill="white" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  benefit: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4L17 10L24 11L19 16L20 23L14 20L8 23L9 16L4 11L11 10L14 4Z" stroke="#333" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  benefit_filled: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4L17 10L24 11L19 16L20 23L14 20L8 23L9 16L4 11L11 10L14 4Z" fill="#333" stroke="#333" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  receipt: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M7 4H21V24L18 22L15 24L12 22L9 24L7 22V4Z" stroke="#333" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M11 10H17M11 14H15" stroke="#333" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  receipt_filled: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M7 4H21V24L18 22L15 24L12 22L9 24L7 22V4Z" fill="#333" stroke="#333" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M11 10H17M11 14H15" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  heart: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 24S4 18 4 11C4 7.5 7 5 10 5C12 5 13.5 6 14 7C14.5 6 16 5 18 5C21 5 24 7.5 24 11C24 18 14 24 14 24Z" stroke="#333" strokeWidth="1.8"/>
    </svg>
  ),
  heart_filled: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 24S4 18 4 11C4 7.5 7 5 10 5C12 5 13.5 6 14 7C14.5 6 16 5 18 5C21 5 24 7.5 24 11C24 18 14 24 14 24Z" fill="#333" stroke="#333" strokeWidth="1.8"/>
    </svg>
  ),
  mymenu: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="10" r="4" stroke="#333" strokeWidth="1.8"/>
      <path d="M7 22C7 18.5 10 16 14 16C18 16 21 18.5 21 22" stroke="#333" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  mymenu_filled: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="10" r="4" fill="#333"/>
      <path d="M7 22C7 18.5 10 16 14 16C18 16 21 18.5 21 22" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
};

// ── NaviItemNew ──────────────────────────────────────────────────────────────
export function NaviItemNew({ icon, filledIcon, label, selected = false, onClick }) {
  const iconSvg = selected ? ICONS[filledIcon] : ICONS[icon];
  return (
    <button onClick={onClick} style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height: 54, borderRadius: 40, border: "none", cursor: "pointer", position: "relative",
      background: selected ? "rgba(0,0,0,0.04)" : "transparent",
    }}>
      <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {iconSvg}
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

// ── FloatingPill ─────────────────────────────────────────────────────────────
export function FloatingPill({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", height: 52, borderRadius: 100,
      background: "rgba(255,255,255,0.96)", padding: "10px 8px", overflow: "hidden",
      boxShadow: "0 1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)",
    }}>
      {children}
    </div>
  );
}

// ── YoTimedealBar ────────────────────────────────────────────────────────────
export function YoTimedealBar({ discount = "1만원", minutes = "15", countdown = "14:59" }) {
  return (
    <FloatingPill>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: "#FFE6EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 16 }}>🔥</span>
      </div>
      <div style={{ flex: 1, padding: "0 6px", minWidth: 0 }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 14, fontWeight: 700, fontFamily: "Pretendard, Roboto, sans-serif", whiteSpace: "nowrap" }}>
          <span style={{ color: "#333" }}>최대</span>
          <span style={{ color: "#FA0050" }}>{discount} 할인</span>
          <span style={{ color: "#333" }}>, 지금 단 {minutes}분</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#FA0050", letterSpacing: 4, fontFamily: "Pretendard, Roboto, sans-serif" }}>{countdown}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#333" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
    </FloatingPill>
  );
}

// ── OrderStatusBar ───────────────────────────────────────────────────────────
const ORDER_STATUSES = {
  ordered: { label: "주문완료", text: "주문을 완료했어요", emoji: "✅" },
  cooking: { label: "조리중", text: "오후 6:37 도착 예정", emoji: "🍳" },
  delivering: { label: "배달중", text: "오후 6:37 도착 예정", emoji: "🏍" },
  delivered: { label: "배달완료", text: "오후 6:37 배달 완료", emoji: "📦" },
};

export function OrderStatusBar({ status = "ordered", shopName = "서브웨이-서초점" }) {
  const s = ORDER_STATUSES[status] || ORDER_STATUSES.ordered;
  return (
    <FloatingPill>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
        {s.emoji}
      </div>
      <div style={{ flex: 1, padding: "0 8px", minWidth: 0, fontFamily: "Pretendard, Roboto, sans-serif" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#333", lineHeight: "19px" }}>{s.text}</div>
        <div style={{ display: "flex", gap: 2, alignItems: "center", height: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#FA0050" }}>{s.label}</span>
          <span style={{ width: 2, height: 2, borderRadius: 1, background: "#ccc", display: "inline-block" }} />
          <span style={{ fontSize: 12, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shopName}</span>
        </div>
      </div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" stroke="#333" strokeWidth="2" strokeLinecap="round"/></svg>
    </FloatingPill>
  );
}

// ── BottomNavNew (전체 하단 영역) ────────────────────────────────────────────
export function BottomNavNew({ activeTab = "home", onTabChange, floatingBar = null }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 12, width: 390,
      paddingTop: 16, paddingBottom: 20,
      background: "linear-gradient(to bottom, rgba(251,250,249,0) 0%, rgba(251,250,249,0.92) 100%)",
    }}>
      {floatingBar && <div style={{ padding: "0 20px" }}>{floatingBar}</div>}
      <div style={{ padding: "0 20px" }}>
        <NavNew activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
}

// ── Section (Storybook 표시용) ───────────────────────────────────────────────
export default function BottomNavSection() {
  const [tab, setTab] = useState("home");
  const [variant, setVariant] = useState("default");

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Variant selector */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Variant:</span>
        {[
          { id: "default", label: "Nav Only" },
          { id: "order", label: "+ 주문현황" },
          { id: "timedeal", label: "+ 요타임딜" },
        ].map(v => (
          <button key={v.id} onClick={() => setVariant(v.id)}
            style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${variant === v.id ? "#0C74E4" : "#e0e0e0"}`,
              background: variant === v.id ? "#0C74E4" : "#fff", color: variant === v.id ? "#fff" : "#666",
              fontSize: 11, cursor: "pointer" }}>{v.label}</button>
        ))}
      </div>

      {/* Preview */}
      <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "40px 0 0", width: 390, margin: "0 auto", overflow: "hidden" }}>
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 13 }}>
          (화면 콘텐츠 영역)
        </div>
        <BottomNavNew activeTab={tab} onTabChange={setTab}
          floatingBar={
            variant === "order" ? <OrderStatusBar status="delivering" /> :
            variant === "timedeal" ? <YoTimedealBar /> : null
          }
        />
      </div>

      {/* Individual components */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>FloatingPill variants</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 353 }}>
          <YoTimedealBar />
          <OrderStatusBar status="ordered" />
          <OrderStatusBar status="cooking" />
          <OrderStatusBar status="delivering" shopName="요마트-GSTHEFRESH서초점" />
          <OrderStatusBar status="delivered" />
        </div>
      </div>
    </div>
  );
}
