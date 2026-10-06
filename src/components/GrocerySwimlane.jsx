import { useState } from "react";
import { SectionHeader } from "./SectionHeader.jsx";

// ─── YDS 2.0 GrocerySwimlane (우리동네 장보기·쇼핑, 리뉴얼-2026) ──────────
// Figma: node 12057:53549
// 가로 스크롤 런처 — 72x72 아이템, 원형 로고 + 라벨 + 옵션 뱃지
// SectionHeader 재사용 (title: "우리동네 장보기·쇼핑", showArrow: true)

// ── GroceryItem ─────────────────────────────────────────────────────────────
export function GroceryItem({
  logoSrc,
  bgColor = "#ffb41e",
  label = "오피스디포",
  badge = null,    // "7,000원 쿠폰" 또는 null
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 72,
        flexShrink: 0,
        cursor: onClick ? "pointer" : "default",
        fontFamily: "Pretendard, Roboto, sans-serif",
        position: "relative",
      }}
    >
      {/* 뱃지 — 상단 중앙 absolute */}
      {badge && (
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          background: "#fff",
          border: "0.5px solid #e5e5e5",
          borderRadius: 9,
          boxShadow: "0 1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)",
          padding: "1px 4px",
          maxWidth: 70,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            lineHeight: "14px",
            color: "#FA0050",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>{badge}</span>
        </div>
      )}

      {/* 이미지 영역 — 72x56, paddingX 6 → 내부 60 중 원형 48x48 */}
      <div style={{
        width: 72,
        height: 56,
        paddingLeft: 6,
        paddingRight: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 26,
          overflow: "hidden",
          background: bgColor,
          border: "0.433px solid rgba(0,0,0,0.2)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={label}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            /* 로고 없을 때 텍스트 약어 */
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              textAlign: "center",
              lineHeight: "13px",
            }}>{label.slice(0, 2)}</span>
          )}
        </div>
      </div>

      {/* 라벨 — 12r (body_10), lineHeight 16, color #333 */}
      <span style={{
        fontSize: 12,
        fontWeight: 400,
        lineHeight: "16px",
        color: "#333",
        textAlign: "center",
        width: 72,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>{label}</span>
    </div>
  );
}

// ── GrocerySwimlane ─────────────────────────────────────────────────────────
export function GrocerySwimlane({
  title = "우리동네 장보기·쇼핑",
  items = [],
}) {
  return (
    <div style={{ background: "#fff" }}>
      {/* SectionHeader 재사용 */}
      <SectionHeader title={title} showArrow />

      {/* 아이템 목록: 가로 스크롤 */}
      <div style={{
        display: "flex",
        gap: 10,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: 8,
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        <style>{`
          .grocery-scroll::-webkit-scrollbar { display: none; }
        `}</style>
        {items.map((item, i) => (
          <GroceryItem key={item.id || i} {...item} />
        ))}
      </div>
    </div>
  );
}

// ── 샘플 데이터 ─────────────────────────────────────────────────────────────
const GROCERY_ITEMS = [
  { id: "emart",     label: "이마트에브리데이", bgColor: "#FFD700", logoSrc: null, badge: "7,000원 쿠폰" },
  { id: "gs",        label: "GS더프레시",     bgColor: "#0094DA", logoSrc: null, badge: "5,000원 할인" },
  { id: "homeplus",  label: "홈플러스",       bgColor: "#E60012", logoSrc: null, badge: null },
  { id: "lotte",     label: "롯데마트",       bgColor: "#E60012", logoSrc: null, badge: "3,000원 쿠폰" },
  { id: "coupang",   label: "쿠팡",           bgColor: "#BF141B", logoSrc: null, badge: null },
  { id: "oasis",     label: "오아시스",       bgColor: "#3DAD2B", logoSrc: null, badge: null },
  { id: "officedepot", label: "오피스디포",   bgColor: "#CC0000", logoSrc: null, badge: null },
  { id: "market",    label: "마켓컬리",       bgColor: "#5F0080", logoSrc: null, badge: "첫구매 할인" },
];

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function GrocerySwimlaneSection() {
  const [items, setItems] = useState(GROCERY_ITEMS);

  return (
    <div style={{ padding: "24px 0" }}>
      {/* 1. 라이브 프리뷰 */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e5e5e5",
        overflow: "hidden",
        marginBottom: 24,
      }}>
        <GrocerySwimlane
          title="우리동네 장보기·쇼핑"
          items={items}
        />
      </div>

      {/* 2. 아이템 목록 컨트롤 */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e5e5e5",
        padding: 20,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>
          아이템 설정
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item, i) => (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "8px 12px", background: "#f9f9f9", borderRadius: 8,
            }}>
              {/* 색상 미니 원 */}
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: item.bgColor, flexShrink: 0,
                border: "1px solid rgba(0,0,0,0.1)",
              }} />
              <span style={{ fontSize: 12, color: "#333", flex: 1 }}>{item.label}</span>
              {/* 뱃지 토글 */}
              <button
                onClick={() => {
                  const next = [...items];
                  next[i] = { ...next[i], badge: next[i].badge ? null : "쿠폰 할인" };
                  setItems(next);
                }}
                style={{
                  padding: "3px 10px", borderRadius: 12, fontSize: 10, cursor: "pointer",
                  border: `1px solid ${item.badge ? "#FA0050" : "#e0e0e0"}`,
                  background: item.badge ? "#FFF0F5" : "#fff",
                  color: item.badge ? "#FA0050" : "#999",
                }}
              >
                {item.badge || "뱃지 OFF"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
