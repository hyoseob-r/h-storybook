import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 QC Swimlane (퀵커머스 스윔레인, 리뉴얼-2026) ─────────────────
// Figma: 리뉴얼-2026 > QC swimlane (node 4917:373715)
// service_launcher_new: 70x68 셀, 48x48 원형 이미지, 12r 라벨, 뱃지 지원
// 우측 auto_transition 버튼 (28x28)

const SHADOW = "0px 0px 2px rgba(25,48,64,0.08), 0px 1px 8px rgba(25,48,64,0.1)";

const QC_ITEMS = [
  { id: "grocery",    label: "장보기/쇼핑", bgColor: "#93cc74" },
  { id: "emart",      label: "이마트슈퍼",  bgColor: "#ffb41e", badge: "7,000원 쿠폰" },
  { id: "gsfresh",    label: "GS더프레시",  bgColor: "#04563e", badge: "5% 할인" },
  { id: "gs25",       label: "GS25",       bgColor: "#007cff", badge: "최대 7,000원" },
  { id: "cu",         label: "CU",         bgColor: "#652d8d", badge: "최대 7,000원" },
  { id: "snowfox",    label: "스노우폭스",  bgColor: "#c2a0c5", badge: "최대 8,000원" },
  { id: "yogiconv",   label: "요편의점",    bgColor: "#673095" },
];

function QCItem({ id, label, bgColor = "#f2f2f2", logoSrc = null, badge = null, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      width: 70, flexShrink: 0, borderRadius: 40, cursor: "pointer",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 70, height: 48, position: "relative" }}>
          {/* 원형 이미지 */}
          <div style={{
            width: 48, height: 48, borderRadius: 26, overflow: "hidden",
            background: bgColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "absolute", left: "50%", transform: "translateX(-50%)",
          }}>
            {logoSrc ? (
              <img src={logoSrc} alt={label} style={{ width: 32, height: "auto", objectFit: "contain" }} />
            ) : (
              <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, opacity: 0.7 }}>
                {label.substring(0, 2)}
              </span>
            )}
          </div>
          {/* 뱃지 */}
          {badge && (
            <div style={{
              position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)",
              maxWidth: 70, boxShadow: SHADOW, zIndex: 1,
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
        <span style={{ fontSize: 12, fontWeight: 400, color: "#333", lineHeight: "16px", whiteSpace: "nowrap" }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export function QCSwimlaneRow({ items = QC_ITEMS }) {
  return (
    <div style={{
      display: "flex", gap: 24, alignItems: "center",
      padding: "16px 16px 8px",
      overflowX: "auto", scrollbarWidth: "none",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
        {items.map((item, i) => <QCItem key={item.id || i} {...item} />)}
      </div>
      {/* auto_transition */}
      <div style={{
        width: 28, height: 28, borderRadius: 10, flexShrink: 0,
        background: "#f6f6f6", border: "1.3px solid #e5e5e5",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <YdsIcon name="chevron_right_s" size={16} color="#999" />
      </div>
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function QCSwimlaneSection() {
  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>QC Swimlane (퀵커머스)</div>
      <div style={{ width: 390, background: "#fff", borderRadius: 12, overflow: "hidden" }}>
        <QCSwimlaneRow />
      </div>
    </div>
  );
}
