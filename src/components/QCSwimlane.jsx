import { useState } from "react";
import { BenefitBadge } from "./Badge.jsx";

// ─── YDS 2.0 QC Swimlane (퀵커머스, 리뉴얼-2026) ──────────────────────────
// 72x56 이미지 에셋 기반. 뱃지 on → 72x56 그대로 / 뱃지 off → 원형 크롭
// 각 런처별 뱃지 on/off 토글 가능

const QC_ASSET_BASE = "/assets/qc-icons";

const QC_ITEMS = [
  { id: "grocery",       label: "장보기/쇼핑",   assetOn: "grocery_badge_on.png",       assetOff: "grocery_badge_off.png",       badge: "최대 5,000원" },
  { id: "free_delivery", label: "무료배달위크",   assetOn: "free_delivery_badge_on.png", assetOff: "free_delivery_badge_off.png", badge: "무료배달" },
  { id: "yogiconv",      label: "요편의점",       assetOn: "yogiconv_badge_on.png",      assetOff: "yogiconv_badge_off.png",      badge: "최대 7,000원" },
  { id: "conv_pickup",   label: "편의점픽업",     assetOn: "conv_pickup_badge_on.png",   assetOff: null,                          badge: "최대 8,000원" },
  { id: "conv_takeout",  label: "편의점포장",     assetOn: null,                         assetOff: "conv_takeout_badge_off.png",  badge: null },
];

function QCItem({ label, assetOn, assetOff, badge, showBadge = true, onClick }) {
  const hasBadge = showBadge && badge;
  const assetFile = hasBadge ? assetOn : assetOff;
  const imgSrc = assetFile ? `${QC_ASSET_BASE}/${assetFile}` : null;

  return (
    <div onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      width: 70, flexShrink: 0, cursor: "pointer",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {/* 이미지 + 뱃지 영역 */}
      <div style={{ width: 70, height: 56, position: "relative" }}>
        {/* 이미지 72x56 */}
        {imgSrc && (
          <img src={imgSrc} alt={label} style={{
            width: 72, height: 56, objectFit: "contain",
            display: "block", position: "absolute", left: -1, top: 0,
          }} />
        )}
        {/* 혜택 뱃지 — 이미지 상단 중앙 겹침 */}
        {hasBadge && (
          <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)", zIndex: 1 }}>
            <BenefitBadge label={badge} />
          </div>
        )}
      </div>
      {/* 라벨 */}
      <span style={{
        fontSize: 12, fontWeight: 400, color: "#333", lineHeight: "16px",
        whiteSpace: "nowrap", marginTop: 4,
      }}>
        {label}
      </span>
    </div>
  );
}

export function QCSwimlaneRow({ items = QC_ITEMS, badgeStates = null }) {
  return (
    <div style={{
      display: "flex", gap: 4, alignItems: "flex-start",
      padding: "16px 16px 12px",
      overflowX: "auto", scrollbarWidth: "none",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {items.map((item, i) => (
        <QCItem
          key={item.id || i}
          {...item}
          showBadge={badgeStates ? badgeStates[item.id] !== false : !!item.badge}
        />
      ))}
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function QCSwimlaneSection() {
  const [badgeStates, setBadgeStates] = useState(() => {
    const init = {};
    QC_ITEMS.forEach(item => { init[item.id] = !!item.badge; });
    return init;
  });

  const toggleBadge = (id) => {
    setBadgeStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const controlStyle = {
    padding: "16px 20px", background: "#fff", borderRadius: 12,
    border: "1px solid #e8e8e8", marginBottom: 16,
  };
  const chipStyle = (active) => ({
    padding: "4px 10px", borderRadius: 20,
    border: `1.5px solid ${active ? "#FA0050" : "#e0e0e0"}`,
    background: active ? "#FA0050" : "#fff",
    color: active ? "#fff" : "#666",
    fontSize: 10, cursor: "pointer",
  });

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Controls */}
      <div style={controlStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#333", marginBottom: 10 }}>Options — 혜택 뱃지 on/off</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {QC_ITEMS.filter(item => item.badge).map(item => (
            <button key={item.id} onClick={() => toggleBadge(item.id)} style={chipStyle(badgeStates[item.id])}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Preview</div>
      <div style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e8e8e8" }}>
        <QCSwimlaneRow badgeStates={badgeStates} />
      </div>
    </div>
  );
}
