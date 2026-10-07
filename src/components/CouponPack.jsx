import { useState } from "react";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 CouponPack (쿠폰팩 티켓 카드) ─────────────────────────────────
// 3분할 이미지 기반: left(12 fixed) + center(stretch) + right(84 fixed)
// Android: NinePatchDrawable / iOS: resizableImage(withCapInsets:) 동일 방식

const COUPON_LEFT = "/assets/coupon/coupon_left@3x.png";
const COUPON_CENTER = "/assets/coupon/coupon_center@3x.png";
const COUPON_RIGHT = "/assets/coupon/coupon_right@3x.png";

export function CouponPack({
  subtitle = "쿠폰팩 21개 한번에 받기",
  title = "총 62,000원 할인 쿠폰팩",
  buttonLabel = "전체받기",
  onDownload,
}) {
  return (
    <div style={{
      display: "flex", alignItems: "stretch",
      width: "100%", height: 72,
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {/* Left — 12px fixed, 이미지 배경 */}
      <div style={{
        width: 12, flexShrink: 0,
        backgroundImage: `url(${COUPON_LEFT})`,
        backgroundSize: "12px 72px",
        backgroundRepeat: "no-repeat",
      }} />

      {/* Center — stretch, 이미지 타일링 */}
      <div style={{
        flex: 1, minWidth: 0,
        backgroundImage: `url(${COUPON_CENTER})`,
        backgroundSize: "1px 72px",
        backgroundRepeat: "repeat-x",
        display: "flex", alignItems: "center",
      }}>
        {/* 텍스트 콘텐츠 */}
        <div style={{ padding: "0 8px 0 4px", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: "#333" }}>
            {subtitle}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: "22px", color: "#333" }}>
            {title}
          </div>
        </div>
      </div>

      {/* Right — 84px fixed, 이미지 배경 + 버튼 */}
      <div
        onClick={onDownload}
        style={{
          width: 84, flexShrink: 0,
          backgroundImage: `url(${COUPON_RIGHT})`,
          backgroundSize: "84px 72px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 3, cursor: "pointer",
          paddingLeft: 16,
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
        {/* 360px */}
        <div style={{ maxWidth: 360, padding: "0 16px" }}>
          <div style={{ fontSize: 10, color: "#bbb", marginBottom: 4 }}>360px</div>
          <CouponPack />
        </div>

        {/* 320px — min */}
        <div style={{ maxWidth: 288, padding: "0 16px" }}>
          <div style={{ fontSize: 10, color: "#bbb", marginBottom: 4 }}>288px (min)</div>
          <CouponPack subtitle="쿠폰팩 5개 한번에 받기" title="총 15,000원 할인" />
        </div>

        {/* 390px — max */}
        <div style={{ maxWidth: 390, padding: "0 16px" }}>
          <div style={{ fontSize: 10, color: "#bbb", marginBottom: 4 }}>390px</div>
          <CouponPack subtitle="쿠폰팩 30개 한번에 받기" title="총 120,000원 할인 쿠폰팩" buttonLabel="다운로드" />
        </div>
      </div>

      {/* 구현 가이드 */}
      <div style={{ marginTop: 32, padding: "16px 20px", background: "#fff", borderRadius: 12, border: "1px solid #e8e8e8" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#333", marginBottom: 8 }}>Native 구현 가이드</div>
        <div style={{ fontSize: 11, color: "#666", lineHeight: "18px" }}>
          <div><b>Android</b>: coupon_left + coupon_center (repeat-x) + coupon_right</div>
          <div>또는 NinePatch (.9.png) — left 12px, right 84px cap inset</div>
          <div style={{ marginTop: 4 }}><b>iOS</b>: UIImage.resizableImage(withCapInsets: UIEdgeInsets(top:0, left:12, bottom:0, right:84))</div>
          <div style={{ marginTop: 4 }}><b>에셋 경로</b>: /assets/coupon/coupon_left@3x.png, coupon_center@3x.png, coupon_right@3x.png</div>
        </div>
      </div>
    </div>
  );
}
