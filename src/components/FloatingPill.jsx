import { useState } from "react";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 FloatingPill (플로팅 넛지 배너, 리뉴얼-2026) ─────────────────
// 2가지 유형: 요타임딜 / 주문현황
// 우선순위: 주문현황 > 요타임딜 (동시 노출 불가)

const SHADOW = "0px 0px 2px rgba(25,48,64,0.08), 0px 1px 8px rgba(25,48,64,0.1)";
const PILL_STYLE = {
  display: "flex", alignItems: "center",
  height: 52, borderRadius: 100,
  background: "rgba(255,255,255,0.96)",
  boxShadow: SHADOW,
  overflow: "hidden",
  padding: "10px 8px",
  width: "100%",
  fontFamily: "Pretendard, Roboto, sans-serif",
  cursor: "pointer",
};

const ORDER_STATUS_MAP = {
  order_complete:  { title: "주문을 완료했어요", status: "주문완료", asset: "/assets/order-status/order_complete.gif" },
  cooking:         { title: "오후 6:37 도착 예정", status: "조리중", asset: "/assets/order-status/cooking.gif" },
  delivering:      { title: "오후 6:37 도착 예정", status: "배달중", asset: "/assets/order-status/delivering.gif" },
  preparing_qc:    { title: "오후 6:37 도착 예정", status: "준비중", asset: "/assets/order-status/preparing_qc.gif" },
  pickup_ready:    { title: "오후 6:37 픽업 가능", status: "픽업가능", asset: "/assets/order-status/pickup_ready.gif" },
  delivered:       { title: "오후 6:37 배달 완료", status: "배달완료", asset: "/assets/order-status/delivered.gif" },
  delivered_photo: { title: "오후 6:37 배달 완료", status: "배달완료", asset: "/assets/order-status/delivered_photo.png" },
  cancelled:       { title: "가게 사정으로 취소됐어요", status: "주문취소", asset: "/assets/order-status/cancelled.gif" },
};

// ── 요타임딜 Pill ──────────────────────────────────────────────────────────
export function TimedealPill({ discount = "1만원 할인", text = "지금 단 15분", timer = "14:59", onClick }) {
  return (
    <div style={PILL_STYLE} onClick={onClick}>
      {/* 로띠/이미지 */}
      <div style={{ width: 36, height: 36, borderRadius: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="/assets/lottie/yotimedeal.json" alt="" style={{ width: 36, height: 36 }}
          onError={(e) => { e.target.style.display = "none"; e.target.parentElement.innerHTML = "🔥"; e.target.parentElement.style.fontSize = "24px"; }}
        />
      </div>
      {/* 텍스트 */}
      <div style={{ flex: 1, padding: "0 6px", display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, lineHeight: "19px", color: "#333" }}>최대 </span>
        <span style={{ fontSize: 14, fontWeight: 700, lineHeight: "19px", color: "#FA0050" }}>{discount}</span>
        <span style={{ fontSize: 14, fontWeight: 700, lineHeight: "19px", color: "#333" }}>, {text}</span>
      </div>
      {/* 타이머 + chevron */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontWeight: 700, lineHeight: "22px", color: "#FA0050", letterSpacing: 4 }}>{timer}</span>
        <YdsIcon name="chevron_right_s" size={20} color="#333" />
      </div>
    </div>
  );
}

// ── 주문현황 Pill ──────────────────────────────────────────────────────────
export function OrderStatusPill({ status = "order_complete", title, shopName = "서브웨이-서초점", photoSrc, onClick }) {
  const preset = ORDER_STATUS_MAP[status] || ORDER_STATUS_MAP.order_complete;
  const displayTitle = title || preset.title;
  const assetSrc = status === "delivered_photo" && photoSrc ? photoSrc : preset.asset;

  return (
    <div style={PILL_STYLE} onClick={onClick}>
      {/* GIF/이미지 */}
      <div style={{ width: 36, height: 36, borderRadius: status === "delivered_photo" ? 8 : 0, overflow: "hidden", flexShrink: 0 }}>
        <img src={assetSrc} alt={preset.status} style={{ width: 36, height: 36, objectFit: "cover" }} />
      </div>
      {/* 텍스트 */}
      <div style={{ flex: 1, padding: "0 8px", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 700, lineHeight: "19px", color: "#333" }}>{displayTitle}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 2, height: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, lineHeight: "16px", color: "#FA0050", flexShrink: 0 }}>{preset.status}</span>
          <span style={{ width: 2, height: 2, borderRadius: 1, background: "#ccc", flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shopName}</span>
        </div>
      </div>
      {/* chevron */}
      <YdsIcon name="chevron_right_s" size={20} color="#333" style={{ flexShrink: 0 }} />
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
const STATUS_LIST = Object.keys(ORDER_STATUS_MAP);

export default function FloatingPillSection() {
  const [activeStatus, setActiveStatus] = useState("order_complete");

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
      <div style={{
        padding: "16px 20px", background: "#fff", borderRadius: 12,
        border: "1px solid #e8e8e8", marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#333", marginBottom: 10 }}>주문현황 상태</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {STATUS_LIST.map(s => (
            <button key={s} onClick={() => setActiveStatus(s)} style={chipStyle(activeStatus === s)}>
              {ORDER_STATUS_MAP[s].status}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>FloatingPill variants</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 390, padding: "0 16px" }}>
        {/* 요타임딜 */}
        <TimedealPill />

        {/* 주문현황 — 선택된 상태 */}
        <OrderStatusPill status={activeStatus} shopName="서브웨이-서초점" />

        {/* 전체 상태 목록 */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginTop: 16, marginBottom: 4 }}>All order status variants</div>
        {STATUS_LIST.map(s => (
          <OrderStatusPill key={s} status={s} shopName={s === "preparing_qc" ? "요마트-GSTHEFRESH서초점" : "서브웨이-서초점"} />
        ))}
      </div>
    </div>
  );
}
