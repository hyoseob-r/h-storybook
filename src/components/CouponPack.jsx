import { useState } from "react";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 CouponPack (쿠폰팩 티켓 카드, 혜택탭) ─────────────────────────
// 티켓 모양: 좌측(12 fixed) + 중앙(stretch min192~max264) + 노치(8+8) + 우측(68 fixed)
// 노치: 상하 반원 + 점선

const NOTCH_SIZE = 8; // 반원 지름

export function CouponPack({
  subtitle = "쿠폰팩 21개 한번에 받기",
  title = "총 62,000원 할인 쿠폰팩",
  buttonLabel = "전체받기",
  onDownload,
}) {
  return (
    <div style={{
      display: "flex", alignItems: "stretch",
      width: "100%",
      fontFamily: "Pretendard, Roboto, sans-serif",
      position: "relative",
    }}>
      {/* 좌측: 콘텐츠 영역 */}
      <div style={{
        flex: 1, minWidth: 0,
        background: "#fff",
        borderRadius: "16px 0 0 16px",
        border: "0.5px solid #e5e5e5",
        borderRight: "none",
        padding: "16px 8px 16px 16px",
        display: "flex", flexDirection: "column", gap: 2, justifyContent: "center",
      }}>
        <div style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: "#333" }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: "22px", color: "#333" }}>
          {title}
        </div>
      </div>

      {/* 노치 영역 — 좌측(콘텐츠 쪽) */}
      <div style={{
        width: NOTCH_SIZE, alignSelf: "stretch",
        background: "#fff",
        borderTop: "0.5px solid #e5e5e5",
        borderBottom: "0.5px solid #e5e5e5",
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "flex-end",
      }}>
        {/* 상단 반원 노치 */}
        <div style={{
          position: "absolute", top: -NOTCH_SIZE / 2, right: 0,
          width: NOTCH_SIZE, height: NOTCH_SIZE,
          borderRadius: "0 0 50% 50%",
          background: "#f8f8f8",
          zIndex: 1,
        }} />
        {/* 점선 */}
        <div style={{
          position: "absolute", top: NOTCH_SIZE / 2, bottom: NOTCH_SIZE / 2,
          right: 0, width: 1,
          borderRight: "1px dashed #e5e5e5",
        }} />
        {/* 하단 반원 노치 */}
        <div style={{
          position: "absolute", bottom: -NOTCH_SIZE / 2, right: 0,
          width: NOTCH_SIZE, height: NOTCH_SIZE,
          borderRadius: "50% 50% 0 0",
          background: "#f8f8f8",
          zIndex: 1,
        }} />
      </div>

      {/* 노치 영역 — 우측(다운로드 쪽) */}
      <div style={{
        width: NOTCH_SIZE, alignSelf: "stretch",
        background: "#f0f7ff",
        borderTop: "0.5px solid #e5e5e5",
        borderBottom: "0.5px solid #e5e5e5",
        position: "relative",
      }}>
        {/* 상단 반원 노치 */}
        <div style={{
          position: "absolute", top: -NOTCH_SIZE / 2, left: 0,
          width: NOTCH_SIZE, height: NOTCH_SIZE,
          borderRadius: "0 0 50% 50%",
          background: "#f8f8f8",
          zIndex: 1,
        }} />
        {/* 하단 반원 노치 */}
        <div style={{
          position: "absolute", bottom: -NOTCH_SIZE / 2, left: 0,
          width: NOTCH_SIZE, height: NOTCH_SIZE,
          borderRadius: "50% 50% 0 0",
          background: "#f8f8f8",
          zIndex: 1,
        }} />
      </div>

      {/* 우측: 다운로드 버튼 영역 (68px fixed) */}
      <div
        onClick={onDownload}
        style={{
          width: 68, flexShrink: 0,
          background: "#f0f7ff",
          borderRadius: "0 16px 16px 0",
          border: "0.5px solid #e5e5e5",
          borderLeft: "none",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 3, cursor: "pointer",
          paddingRight: 8,
        }}
      >
        <YdsIcon name="download" size={24} color="#0c74e4" />
        <span style={{
          fontSize: 10, fontWeight: 400, lineHeight: "14px",
          color: "#0c74e4", textAlign: "center",
        }}>{buttonLabel}</span>
      </div>
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function CouponPackSection() {
  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Preview</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 기본 */}
        <div style={{ maxWidth: 360, padding: "0 16px" }}>
          <CouponPack />
        </div>

        {/* 320px */}
        <div style={{ maxWidth: 288, padding: "0 16px" }}>
          <CouponPack subtitle="쿠폰팩 5개 한번에 받기" title="총 15,000원 할인" />
        </div>

        {/* 넓은 */}
        <div style={{ maxWidth: 390, padding: "0 16px" }}>
          <CouponPack subtitle="쿠폰팩 30개 한번에 받기" title="총 120,000원 할인 쿠폰팩" buttonLabel="다운로드" />
        </div>
      </div>
    </div>
  );
}
